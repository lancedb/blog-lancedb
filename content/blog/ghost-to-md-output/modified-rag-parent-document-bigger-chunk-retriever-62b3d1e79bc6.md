---
title: "Modified RAG: Parent Document & Bigger chunk Retriever"
slug: modified-rag-parent-document-bigger-chunk-retriever-62b3d1e79bc6
date_published: 2023-12-15T23:18:00.000Z
date_updated: 2024-04-02T05:47:43.000Z
tags: Blog, #shawn
---

by Mahesh Deshwal

In case you’re interested in modifying and improving retrieval accuracy of RAG pipelines, you should check [Re-ranking post](https://medium.com/p/cf6eaec6d544).

# What’s it about?

There are some cases when your users want to have a task done by providing just a couple of lines input or even worse, couple of words. In this example, let’s say I have a “Sequel” song generation task given a line or two as input. Now if it’s a Part-2 of something, the tone, writing style, story etc are supposed to be related to the previous song so given the line “I am whatever I am”, my LLM should generate something related to the previous song not a mixture of 10 different songs and artists. If you use a vanilla RAG here, you’d be getting multiple results which might not be from same song, artist or even genre. If you use only the first match, you lose a lot of context as a smaller chunk won’t give the full context of the song.

# Solution?

There are 2 approaches to tackle that. Let’s go one by one from theory to code starting from **Parent Document Retriever**.
![](https://miro.medium.com/v2/resize:fit:550/1*0JHJPrAuvalxOsywuNxJqg.jpeg)
Given a text, find the most related chunk first (you can fetch N and then use additional logic based on Count etc too). Then instead of passing that chunk, get the Parent Document itself whose part was this chunk and pass THAT to the LLM as context. Let’s jump to the code quickly. Install and get all the required imports like LanceDB, LangChain etc. For the Embedding function, I’m using BAAI encoder but you can use any one.

    !pip install -U "langchain==0.0.344" openai tiktoken lark datasets sentence_transformers FlagEmbedding lancedb -qq
    
    from langchain.vectorstores import LanceDB
    from langchain.retrievers import ParentDocumentRetriever
    
    #Text Splitting
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain.storage import InMemoryStore
    from langchain.docstore.document import Document
    
    from langchain.embeddings.openai import OpenAIEmbeddings
    from langchain.chains import RetrievalQA
    from langchain.llms import OpenAI
    
    import os
    from datasets import load_dataset
    
    from langchain.embeddings import HuggingFaceBgeEmbeddings
    import lancedb
    
    
    os.environ["OPENAI_API_KEY"] = "YOUR_API_KEY_HERE" # NEEDED if you run LLM Experiment below
    
    # Embedding Functions
    model_name = "BAAI/bge-small-en-v1.5" # Open Source and effective Embedding
    encode_kwargs = {'normalize_embeddings': True} # set True to compute cosine similarity
    bge_embeddings = HuggingFaceBgeEmbeddings(model_name=model_name,model_kwargs={'device': 'cuda'},encode_kwargs=encode_kwargs)
    
    # Data Chunking Functions
    small_chunk_splitter = RecursiveCharacterTextSplitter(chunk_size = 512) # Splitter to split documents into small chunks
    big_chunk_splitter = RecursiveCharacterTextSplitter(chunk_size=2048) # Another Level of Bigger Chunks
    
    # Lance DB Connection. Load if exists else create
    my_db = lancedb.connect("./my_db")

For the demo data, I’m using [Eminem Song lyrics dataset present here](https://huggingface.co/huggingartists/eminem). Extract that data, split it into chunks and make embedding of those. Save all of those into a LanceDB table.

    # Load a sample data here
    long_texts = load_dataset("huggingartists/eminem")["train"].to_pandas().sample(100)["text"] # Data of huge context length. Use 100 random examples for demo
    
    # Convert to LangChain Document object
    docs = [Document(page_content=content, doc_id = _id, metadata = {"doc_id":_id}) for (_id, content) in enumerate(long_texts)] # List of LangChain Document Objects
    
    
    if "small_chunk_table" in my_db.table_names():
      small_chunk_table = my_db.open_table("small_chunk_table")
    else: # NOTE: 384 is the size of BAAI Embedding and -999 because it's a dummy data so invalid Embedding
      small_chunk_table = my_db.create_table("small_chunk_table", data=[{"vector": [-999]*384, "text": "", "doc_id": "-1",}], mode="overwrite")
    
    small_chunk_table.delete('doc_id = "-1"')
    
    vectorstore = LanceDB(small_chunk_table, bge_embeddings) # Vectorstore to use to index the child chunks
    store = InMemoryStore() # The storage layer for the parent documents
    
    full_doc_retriever = ParentDocumentRetriever(vectorstore=vectorstore, docstore=store, child_splitter=small_chunk_splitter)
    
    full_doc_retriever.add_documents(docs, ids=None) # Add all the documents

Now that everything’s been done, retrieve some text. We’ll first retrieve a smaller chunk and then we’ll jump on to get the parent document itself.

    # Fetch 3 most similar Smaller Documents
    sub_docs = vectorstore.similarity_search("I am whatever you say I am and if I wasn't why would you say I am", k=3)
    
    print(sub_docs[0].page_content) # This is a Smaller Chunk.
    
    
    full_docs = full_doc_retriever.get_relevant_documents("I am whatever you say I am and if I wasn't why would you say I am", k = 3)
    print(full_docs[0].page_content) # This is the Parent Document returned after matching the smaller chunks internally

    Girls Lyrics
    Ayo, dawg, I got some *** on my ****** chest
    That I need to get off cause if I dont
    Ima ****** explode or somethin
    Now, look, this is the story about......

If you look at both outputs, you’ll see that the first documents are the child and parent ones. You can use the Parent Document for the task described. **BUT there might be a PROBLEM with that**. If you have your parent documents, very big and short context length of LLM, then? You can’t summarise lyrics like a good old solution. Can you? So? There’s a middle ground too.

# Bigger Chunk Retrieval

To get around the problem of larger size of Parent document, what you can do right now is to make bigger chunks along with smaller ones. For example, if your smaller chunks are of 512 tokens and your Parent Documents are of 2048 tokens on average, you can make chunks of size 1024. Now during retrieval, it’ll match as the previous one above BUT this time, instead of parent document, it’ll fetch the Bigger chunk and pass it to LLM. this way you’ll lose some text for sure but not completely. You could use use 2 verses instead of original 4 to make the model understand the writing style, context etc etc that too being within the limits. Good thing, you just have to change 1 line from the previous one.

    if "big_chunk_table" in my_db.table_names():
      big_chunk_table = my_db.open_table("big_chunk_table")
    else:
      big_chunk_table = my_db.create_table("big_chunk_table", data=[{"vector": [-999]*384, "text": "", "doc_id": "-1",}], mode="overwrite")
    
    big_chunk_table.delete('doc_id = "-1"')
    pyt
    vectorstore = LanceDB(big_chunk_table, bge_embeddings)
    store = InMemoryStore()
    
    big_chunk_retriever = ParentDocumentRetriever(vectorstore=vectorstore, docstore=store,
                                                  child_splitter = small_chunk_splitter,
                                                  parent_splitter = big_chunk_splitter) # See one more line addition which retrieves the larger chunk instead of Parent Document
    
    big_chunk_retriever.add_documents(docs, ids=None) # Add all the documents
    
    
    big_chunks_docs = big_chunk_retriever.get_relevant_documents("I am whatever you say I am and if I wasn't why would you say I am", k = 3)
    print(big_chunks_docs[0].page_content) # This is the BIG chunks (in place of Parent Document) returned after matching the smaller chunks internally

    .........But as soon as someone calls you out
    You put your tail between your legs and bow down
    Now, I dont ask nobody to share my beliefs
    To be involved in my beefs
    Im a man, I can stand on my feet
    So if you dont wanna be in em, all I ask
    Is that you dont open your mouth with an opinion
    And I wont put you in em
    Cause I dont ask nobody to share my beliefs...........

# Using it with OpenAI

    qa = RetrievalQA.from_chain_type(llm=OpenAI(),
                                     chain_type="stuff",
                                     retriever=big_chunk_retriever)
    
    query = "I am whatever you say I am and if I wasn't why would you say I am? So who is Em?"
    qa.run(query)

You can [find the whole code (and lot more examples like this) HERE.](https://github.com/lancedb/vectordb-recipes#examples)

Until next time, happy parenting :)
![](https://miro.medium.com/v2/resize:fit:550/1*lkDfUDQXYMUsnje8fM331Q.jpeg)
