---
title: Create LLM apps using RAG
date: 2024-03-21
excerpt: If you're considering making a personalized bot for your documents or website that responds to you, you're in the right spot. I'm here to help you create a bot using Langchain and RAG strategies for this purpose.
author: LanceDB
categories: ["Engineering"]
draft: false
featured: false
---

## **Understanding the Limitations of ChatGPT and LLMs**

ChatGPTs and other Large Language Models (LLMs) are extensively trained on text corpora to comprehend language semantics and coherence. Despite their impressive capabilities, these models have limitations that require careful consideration for particular use cases. One significant challenge is the potential for hallucinations, where the model might generate inaccurate or contextually irrelevant information.

Imagine requesting the model to enhance your company policies. ChatGPTs and other large language models might need more training on your company's data to provide factual responses in such scenarios. Instead, they may generate nonsensical or irrelevant, unhelpful responses. How can we ensure that an LLM comprehends our specific data and generates responses accordingly? This is where techniques like Retrieval Augmentation Generation (RAG) come to the rescue.
![](https://lh7-us.googleusercontent.com/PadHKVHGh32-TBWZLbezkZ16yIE_F9HQDZPBdJphbFNo-WBGWvu44HmRGGj5hd8rGbUn81CHW-3v0sKt-QW0oRxETR7Bkz3FFWBjmI4-9C3gkwltmNlkFYlkIykNzH3UPlOZj4UIq8bGDNHZFCOzwUc)
## **What is RAG?**

RAG, or Retrieval Augmented Generation, uses three main workflows to generate and give a better response

- Information Retrieval: When a user asks a question, the AI system retrieves the relevant data from a well-maintained knowledge library or external sources like databases, articles, APIs, or document repositories. This is achieved by converting the query into a numerical format or vector that machines can understand.
- LLM: The retrieved data is then presented to the LLM or Large Language Model, along with the user's query. The LLM uses this new knowledge and training data to generate the response.
- Response: Finally, the LLM generates a more accurate and relevant response since it has been augmented with the retrieved information. We gave the LLM some additional information from our Knowledge library, which allows LLMs to provide more contextually relevant and factual responses, solving the problem of models when they are just hallucinating or providing irrelevant answers.

Let's take the example of company policies again. Suppose you have an HR bot that handles queries related to your Company policies. Now, if someone asks anything specific to the policies, the bot can pull the most recent policy documents from the knowledge library, pass the relevant context to a well-crafted prompt, and then pass the prompt further to the LLM for generating the response.

To make it easier, Imagine an LLM as your knowledgeable friend who seems to know everything, from Geography to Computer Science, from Politics to Philosophy. Now, picture yourself asking this friend a few questions:

- "Who handles my laundry on weekends?"
- "Who lives next door to me?"
- "What brand of peanut butter do I prefer?"

Chances are, your friend wouldn't be able to answer these questions. Most of the time, no. But let's say this distant friend becomes closer to you over time; he comes to your place regularly, knows your parents very well, you both hang out pretty often, you go on outings, blah blah blah.. You got the point.  

I mean, he is gaining access to personal and insider information about you. Now, when you pose the same questions, he can somehow answer those questions more relevantly now because he is better suited to your personal insights.

Similarly, when provided with additional information or access to your data, an LLM won't guess or hallucinate. Instead, it can leverage that access data to provide more relevant and accurate answers.

## **Here are the steps to create any RAG application...**

1. Extract the relevant information from your data sources.

2. Break the information into small chunks.

3. Store the chunks as their embeddings into a vector database.

4. Create a prompt template which will be fed to the LLM with the query and the context.

5. Convert the query to its relevant embedding using the same embedding model.

6. Fetch k number of relevant documents related to the query from the vector database.

7. Pass the relevant documents to the LLM and get the response.

## **FAQs**

1. We will be using [Langchain](https://python.langchain.com/docs/get_started/introduction) for this task. Basically, it's like a wrapper that lets you talk and manage your LLM operations better. Note that Langchain is updating very fast, and some functions and other classes might move to different modules. So, if something doesn't work, just check if you are importing the libraries from the right sources!

2. We will also use [Hugging Face](https://huggingface.co/), an open-source library for building, training, and deploying state-of-the-art machine learning models, especially about NLP. To use HuggingFace, we need an access token, which you get [here](https://huggingface.co/docs/hub/security-tokens).

3. we'll need two critical components for our models: an LLM (Large Language Model) and an embedding model. While paid sources like OpenAI offer these, we'll utilize open-source models to ensure accessibility for everyone.

4. Now, we need a Vector Database to store our embeddings. We've got [LanceDB](https://lancedb.com/) for that task –it's like a super-smart data lake for handling lots of information. It's a top-notch vector database, making it the go-to choice for dealing with complex data like vector embeddings... And the best part? It won't burn a dent in your pocket because it's open-source and free to use!!

5. Our data ingestion process will use a URL and some PDFs to keep things simple. While you can incorporate additional data sources if needed, we'll concentrate solely on these two.

With Langchain for the interface, Hugging Face for fetching the models, along with open-source components, we're all set to go! This way, we will save some bucks while still having everything we need. Let's move to the next steps.

## **Environment Setup**

I am using a MacBook Air M1, and it's important to note that specific dependencies and configurations may vary depending on your system type. Now open your favorite editor, create a Python environment, and install the relevant dependencies.

    
    # Create a virtual environment
    python3 -m venv env
    
    # Activate the virtual environment
    source env/bin/activate
    
    # Upgrade pip in the virtual environment
    pip install --upgrade pip
    
    # Install required dependencies
    pip3 install lancedb langchain langchain_community prettytable sentence-transformers huggingface-hub bs4 pypdf pandas
    
    # This is optional, I did it for removing a warning
    pip3 uninstall urllib3
    pip3 install 'urllib3<2.0'

Create a .env file in the same directory to place your Hugging Face API credentials like this.

    
    HUGGINGFACEHUB_API_TOKEN = hf_........

Ensure the name ***HUGGINGFACEHUB_API_TOKEN***remains unchanged, which is crucial for authentication purposes.

If you prefer a straightforward approach without relying on external packages or file loading, you can directly configure the environment variable within your code like this.

    HF_TOKEN = "hf_........."
    os.environ["HUGGINGFACEHUB_API_TOKEN"] = HF_TOKEN

Finally, a data folder will be created in the project's root directory, designated as the central repository for storing PDF documents. You can add some sample PDFs for testing purposes; for instance, I am using the [Yolo V7](https://arxiv.org/pdf/2207.02696.pdf) and [Transformers](https://arxiv.org/abs/1706.03762) paper for demonstration. It's important to note that this designated folder will function as our primary source for data ingestion.

Everything is in order, and we're all set!

## **Step 1: Extracting the relevant information**

To get your RAG application running, the first thing we need to do is extract the relevant information from the various data sources. Whether it's a website page, a PDF file, a notion link, or a Google Doc, whatever it is, it needs to be extracted from its original source first.

    import os
    from langchain_community.document_loaders import WebBaseLoader, PyPDFLoader, DirectoryLoader
    
    # Put the token values inside the double quotes
    HF_TOKEN = "hf_......"
    os.environ["HUGGINGFACEHUB_API_TOKEN"] = HF_TOKEN
    
    # Loading the web URL and data
    url_loader = WebBaseLoader("https://gameofthrones.fandom.com/wiki/Jon_Snow")
    documents_loader = DirectoryLoader('data', glob="./*.pdf", loader_cls=PyPDFLoader)
    
    # Creating the instances
    url_docs = url_loader.load()
    data_docs = documents_loader.load()
    
    # Combining all the data that we ingested
    docs = url_docs + data_docs

This will ingest all the data from the URL link and the PDFs.

## **Step 2: Breaking the information into smaller chunks**

We have all the necessary data for developing our RAG application. Now, it's time to break down this information into smaller chunks. Later, we'll utilize an embedding model to convert these chunks into their respective embeddings. But why is this important?

Think of it like this: If you're tasked with digesting a 100-page book all at once and then asked a specific question about it, it would be challenging to retrieve the necessary information from the entire book to provide an answer. However, if you're permitted to break the book into smaller, manageable chunks—say ten pages each—and each chunk is labeled with an index from 0 to 9, the process becomes much more straightforward. When the same question is posed after this breakdown, you can easily locate the relevant chunk based on its index and then extract the information needed to answer the question accurately.

Picture the book as your extracted information, with each 10-page segment representing a small chunk of data and the index pages as the embedding. We'll apply an embedding model to these chunks to transform the information into their respective embeddings. While, as humans, we may not directly comprehend or relate to these embeddings, they serve as numeric representations of the chunks of our application.  This is how you can do this in Python

    from langchain.text_splitter import RecursiveCharacterTextSplitter
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size = 1000, chunk_overlap = 50)
    chunks = text_splitter.split_documents(docs)

Now, the chunk_size parameter specifies the maximum number of characters a chunk can contain, while the chunk_overlap parameter specifies the number of characters that should overlap between two adjacent chunks. With the chunk_overlap set to 50, the last 50 characters of the adjacent chunks will be shared with each other.

This approach helps to prevent important information from being split across two chunks, ensuring that each chunk contains sufficient contextual information of their neighbor chunks for the subsequent processing or analysis.

Shared information at the boundary of neighboring chunks enables a more seamless transition and understanding of the text's content. The best strategy for choosing the *chunk_size *and *chunk_overlap* parameters largely depends on the documents' nature and the application's purpose.

## **Step 3: Create the embeddings and store in a vector database**

There are two primary methods to generate embeddings for our text chunks. The first involves downloading a model, managing preprocessing, and conducting computations independently. Alternatively, we can leverage Hugging Face's model hub, which offers a variety of pre-trained models for various NLP tasks, including embedding generation.

Opting for the latter approach allows us to utilize one of Hugging Face's embedding models. With this method, we simply provide our text chunks to the chosen model, saving us from the resource-intensive computations on our local machines. 💀

Hugging Face's model hub provides numerous options for embedding models, and you can explore the [leaderboard](https://huggingface.co/spaces/mteb/leaderboard) to select the most suitable one for your requirements. For now, we'll proceed with "sentence-transformers/all-MiniLM-L6-v2." This model is fast and highly efficient in our task!!

    from langchain_community.embeddings import HuggingFaceEmbeddings
    
    embedding_model_name = 'sentence-transformers/all-MiniLM-L6-v2'
    embeddings = HuggingFaceEmbeddings(model_name=embedding_model_name, model_kwargs={'device': 'cpu'})

Here's a way to see the number of embeddings for each chunk

    query = "Hello I want to see the length of the embeddings for this document."
    print(len(embeddings.embed_documents([query])[0]))

    384

We have the embeddings for our chunks; now, we need a vector database to store them.

When it comes to vector databases, there are plenty of options out there to suit various needs. Databases like Pinecone offer adequate performance and advanced features but come with a hefty price tag. On the other hand, open-source alternatives like FAISS or Chroma may lack some extras but are more than sufficient for those who don't require extensive scalability.

But wait, I am dropping a bomb here. I've recently come across LanceDB, an open-source vector database similar to FAISS and Chroma. What makes LanceDB stand out is not just its open-source nature but also its unparalleled scalability. In fact, after a closer look, I realized that I hadn't done justice to highlighting LanceDB's true value propositions earlier!!

Surprisingly, LanceDB is the most scalable vector database available, outperforming even the likes of Pinecone, Chroma, Qdrant, and others. Scaling up to a billion vectors locally on your laptop is only achievable with LanceDB. This capability is a game-changer, especially when you compare it to other vector databases struggling even with a hundred million vectors. LanceDB manages to offer this unprecedented scalability at a fraction of the cost; they are offering the utilities and database tools at much cheaper rates than its closest counterparts.

So now, We'll create an instance of the LanceDB vector database by calling 

    lancedb.connect ("lance_database")

 This line essentially sets up a connection to the LanceDB database named "*lance_database*" Next, we create a table within the database named "*rag_sample*" using the create_table function. Now we initialized this table with a single data entry which includes a numeric vector generated by the embed_query function. 

So, the text "Hello World" is first converted to its numeric representation (fancy name of embeddings), and then mapped to `id` number 1. Like a key-value pair. Lastly, the mode="overwrite" parameter ensures that if the table "rag_sample" already exists, it will be overwritten with the new data.

This happens with all the text chunks, and it's pretty straightforward.

    import lancedb
    from langchain_community.vectorstores import LanceDB
    
    db = lancedb.connect("lance_database")
    table = db.create_table(
    	"rag_sample",
    	data=[
        	{
            	"vector": embeddings.embed_query("Hello World"),
            	"text": "Hello World",
            	"id": "1",
        	}
    	],
    	mode="overwrite",
    )
    
    docsearch = LanceDB.from_documents(chunks, embeddings, connection=table)

**NO ROCKET SCIENCE, HA!**

## **Step 4: Create a prompt template, which will be fed to the LLM**

Okay, now comes the prompt template. When you write a question to the ChatGPT, and it answers that question, you are providing a prompt to the model so that it can understand what the question is. When companies train the models, they decide what kind of prompt they will use to invoke the model and ask the question. 

For example, if you are working with "Mistral 7B instruct" and you want the optimal results, it's recommended to use the following chat template:

    <s>[INST] Instruction [/INST] Model answer</s>[INST] Follow-up instruction [/INST]

Note that \<s> and \</s> are special tokens to represent the beginning of the string (BOS) and end of the string (EOS), while [INST] and [/INST] are regular strings. It's just that the Mistral 7B instruct is made so that the model looks for those unique tokens to understand the question better. Different types of LLMs have various kinds of instructed prompts.

Now, for our case, we will use [huggingfaceh4/zephyr-7b-alpha](https://huggingface.co/HuggingFaceH4/zephyr-7b-alpha), a text generation model. Just to make it clear, Zephyr-7B-α has not been aligned or formatted to human preferences with techniques like RLHF (Reinforcement Learning with Human Feedback) or deployed with in-the-loop filtering of responses like ChatGPT, so the model can produce problematic outputs (especially when prompted to do so).

Instead of writing a Prompt of our own, I will use the *ChatPromptTemplate* class, which creates a prompt template for the chat models. In layman's terms, instead of writing a specified prompt, I am letting *ChatPromptTemplate* do it for me. Here is an example prompt template generated from the manual messages.

    from langchain_core.prompts import ChatPromptTemplate
    
    chat_template = ChatPromptTemplate.from_messages(
    	[
        	("system", "You are a helpful AI bot. Your name is {name}."),
        	("human", "Hello, how are you doing?"),
        	("ai", "I'm doing well, thanks!"),
        	("human", "{user_input}"),
    	]
    )
    
    messages = chat_template.format_messages(name="Bob", user_input="What is your name?")

If you don't want to write the manual instructions, you can use the *from_template* function to generate a more generic prompt template I used for this project. Here it is.

    from langchain_core.prompts import ChatPromptTemplate
    
    template = """
    {query}
    """
    
    prompt = ChatPromptTemplate.from_template(template)

Our prompt is set! We've crafted a single message, assuming it's from a human xD. If you're not using the *from_messages* function, the ChatPromptTemplate will ensure your prompt works seamlessly with the language model by reserving some additional system messages. There's always room for improvement with more generic prompts to achieve better results. For now, this setup should work.

## **Step 5: Convert the query to its relevant embedding using the same embedding model.**

Now, let's discuss the query or question we want to ask our RAG application. We can't just pass the query to our model and expect information in return. Instead, we need to pass the query through the same embedding model used for the chunks earlier. Why is this important? By embedding queries, we allow models to compare them efficiently with previously processed chunks of text. This enables tasks like finding similar documents or generating relevant responses.

To understand it better, Imagine you and your friend speak different languages, like English and Hindi, and you need to understand each other's writings. If your friend hands you a page in Hindi, you won't understand it directly. So, your friend will translate it first, turning Hindi into English for you. So now, if your friend asks you a question in Hindi, you can easily translate that question into English first and look for the relevant answers in that translated English Text.

Similarly, we initially transformed textual information into its corresponding embeddings. Now, when you pose a query, it undergoes a similar conversion into numeric form using the same embedding model applied previously to process our textual chunks. This consistent approach allows for efficient retrieval of relevant responses.

## **Step 6: Fetch K number of documents.**

Now, let's talk about the retriever. Its job is to dive into the vector database and search for relevant documents. It returns a set number, let's call it "k", of these documents, which are ranked based on their contextual relevance to the query or question you asked. You can set "k" as a parameter, indicating how many relevant documents you want - whether it's 2, 5, or 10. Generally, if you have a smaller amount of data, it's best to stick with a lower "k", around 2. For longer documents or larger datasets, a "k" between 10 and 20 is recommended.

Different [search techniques](https://python.langchain.com/docs/modules/data_connection/retrievers/vectorstore) can be employed to fetch relevant documents more effectively and quickly from a vector database. The choice depends on various factors, such as your specific use case, the amount of data you have, what kind of vector database you use, and the context of your problem.

    retriever = docsearch.as_retriever(search_kwargs={"k": 3})
    docs = retriever.get_relevant_documents("what did you know about Yolo V7?")
    print(docs)

When you run this code, the retriever will fetch the three most relevant documents from the vector database. These documents will be the contexts for our LLM model to generate the response for our query.

## **Step 7: Pass the relevant documents to the LLM and get the response.**

So far, we've asked our retriever to fetch a set number of relevant documents from the database. We need a language model (LLM) to generate an appropriate response based on that context. To ensure robustness, let's remember that at the beginning of this blog, I mentioned that LLMs like ChatGPT can sometimes generate irrelevant responses, especially when asked about specific use cases or contexts. However, this time, we're providing the context from our data to the LLM as a reference. So, this reference and its general capabilities will be considered when answering the question. That's the whole idea behind using RAG!

Now, let's dive into implementing the language model (LLM) aspect of our RAG setup. We'll be using the Zephyr model architecture from the Hugging Face Hub. Here's how we do it in Python:

    from langchain_community.llms import HuggingFaceHub
    
    # Model architecture
    llm_repo_id = "huggingfaceh4/zephyr-7b-alpha"
    model_kwargs = {"temperature": 0.5, "max_length": 4096, "max_new_tokens": 2048}
    model = HuggingFaceHub(repo_id=llm_repo_id, model_kwargs=model_kwargs)

In this code excerpt, we initialize our language model using the Hugging Face Hub. Specifically, we select the Zephyr 7 billion model, which is placed in this repository ID: [huggingfaceh4/zephyr-7b-alpha](https://huggingface.co/HuggingFaceH4/zephyr-7b-alpha). Choosing this model isn't arbitrary; as I said before, it's based on its suitability for our specific task and requirements. We have already implemented only open-source components, so Zephyr 7 billion works well enough to generate a useful response with minimal overhead and low latency.

This model comes with some additional parameters to fine-tune its behavior. We've set the temperature to 0.5, which controls the randomness of the generated text. As a lower temperature tends to result in more conservative and predictable outputs, and when the temperature is set to max, which is 1, the model tries to be as creative as it can, so based on what type of output you want for your use case, you can tweak this parameter. For simplicity and demonstration purposes, I set it to 0.5 to ensure we get decent results. Next is the max_length parameter, which defines the maximum length of the generated text and includes the size of your prompt and the response.

max_new_tokens sets the threshold on the maximum number of new tokens generated. As a general rule of thumb, the max_new_tokens should always be less than or equal to the max_length parameter. Why? Think about it.

## **Step 8: Create a chain for invoking the LLM.**

We have everything we want for our RAG application. The last thing we need to do is create a chain for invoking the LLM on our query to generate the response. There are different types of chains for different types of use cases. If you like your LLM to remember the context of the chat over time like the ChatGPT, you would need a memory instance that can be shared among multiple conversation pieces. For such cases, there are conversational chains available.

For now, we just need a chain that can combine our retrieved contexts and pass it with the query to the LLM to generate the response.

    from langchain_core.output_parsers import StrOutputParser
    from langchain_core.runnables import RunnablePassthrough
    
    rag_chain = (
    	{"context": retriever,  "query": RunnablePassthrough()}
    	| prompt
    	| model
    	| StrOutputParser()
    )
    response = rag_chain.invoke("Who killed Jon Snow?")

We have our Prompt, model, context, and the query! All of them are combined into a single chain. It's what all the chains do! Now, before running the final code, I want to give a quick check on these two helper functions:

1. RunnablePassthrough()
2. StrOutputParser()  

The *RunnablePassthrough* class in *LangChain* serves to pass inputs unchanged or with additional keys. In our chain, a prompt expects input in the form of a map with keys "context" and "question." However, user input only includes the "question." or the "query".  Here, *RunnablePassthrough* is utilized to pass the user's question under the "question" key while retrieving the context using a retriever. It just ensures that the input to the prompt conforms to the expected format.

Second, *StrOutputParser* is typically employed in RAG chains to parse the model's output into a human-readable string. In layman's terms, it is responsible for transforming the model's output into a more coherent and grammatically correct sentence, which is generally better readable by Humans! That's it!

## **D-Day**
![](https://lh7-us.googleusercontent.com/qF59U_HImv4SZ3d6tdqMJNtfYSf12aEaF63p94MAkOpBzB1hGlSZ4JZw6ZfEEkqGd5i3--eRi_mR7K1aDFrVWkmzx6VkL2z0kawnSbCK2HcxHzG3lkeExbGAXhbr15bFD1ahVIztXrvYraI_Swn7-BU)
To ensure we get the entire idea even if the response gets cut off, I've implemented a function called *get_complete_sentence()*. This function helps extract the last complete sentence from the text. So, even if the response hits the maximum token limit that we set and gets truncated midway, we will still get a coherent understanding of the message.

For testing, I suggest storing some low-sized PDFs in your project's data folder. You can choose PDFs related to various topics or domains you want the chatbot to interact with. Additionally, providing a URL as a reference for the chatbot can be helpful for testing. For example, you could use a Wikipedia page, a research paper, or any other online document relevant to your testing goals. During my testing, I used a URL containing information about Jon Snow from Game of Thrones, PDFs of Transformers paper, and the YOLO V7 paper to evaluate the bot's performance. Let's see how our bot performs in varied content.

    import os
    import time
    import lancedb
    from langchain_community.vectorstores import LanceDB
    
    from langchain_community.llms import HuggingFaceHub
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain_community.vectorstores import LanceDB
    from langchain_community.embeddings import HuggingFaceEmbeddings
    from langchain_community.document_loaders import WebBaseLoader, PyPDFLoader, DirectoryLoader
    from langchain_core.output_parsers import StrOutputParser
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.runnables import RunnablePassthrough
    from pretty table import PrettyTable
    
    HF_TOKEN = "hf*********"
    os.environ["HUGGINGFACEHUB_API_TOKEN"] = HF_TOKEN
    
    # Loading the web URL and breaking down the information into chunks
    start_time = time.time()
    
    loader = WebBaseLoader("https://gameofthrones.fandom.com/wiki/Jon_Snow")
    documents_loader = DirectoryLoader('data', glob="./*.pdf", loader_cls=PyPDFLoader)
    
    # URL loader
    url_docs = loader.load()
    
    
    
    # Document loader
    data_docs = documents_loader.load()
    
    # Combining all the information into a single variable
    docs = url_docs + data_docs
    
    # Specify chunk size and overlap
    chunk_size = 256
    chunk_overlap = 20
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    chunks = text_splitter.split_documents(docs)
    
    # Specify Embedding Model
    embedding_model_name = 'sentence-transformers/all-MiniLM-L6-v2'
    embeddings = HuggingFaceEmbeddings(model_name=embedding_model_name, model_kwargs={'device': 'cpu'})
    
    # Specify Vector Database
    vectorstore_start_time = time.time()
    database_name = "LanceDB"
    db = lancedb.connect("src/lance_database")
    table = db.create_table(
    	"rag_sample",
    	data=[
        	{
            	"vector": embeddings.embed_query("Hello World"),
            	"text": "Hello World",
            	"id": "1",
        	}
    	],
    	mode="overwrite",
    )
    docsearch = LanceDB.from_documents(chunks, embeddings, connection=table)
    vectorstore_end_time = time.time()
    
    # Specify Retrieval Information
    search_kwargs = {"k": 3}
    retriever = docsearch.as_retriever(search_kwargs = {"k": 3})
    
    # Specify Model Architecture
    llm_repo_id = "huggingfaceh4/zephyr-7b-alpha"
    model_kwargs = {"temperature": 0.5, "max_length": 4096, "max_new_tokens": 2048}
    model = HuggingFaceHub(repo_id=llm_repo_id, model_kwargs=model_kwargs)
    
    template = """
    {query}
    """
    
    prompt = ChatPromptTemplate.from_template(template)
    
    rag_chain_start_time = time.time()
    rag_chain = (
    	{"context": retriever, "query": RunnablePassthrough()}
    	| prompt
    	| model
    	| StrOutputParser()
    )
    rag_chain_end_time = time.time()
    
    def get_complete_sentence(response):
    	last_period_index = response.rfind('.')
    	if last_period_index != -1:
        	return response[:last_period_index + 1]
    	else:
        	return response
    
    # Invoke the RAG chain and retrieve the response
    rag_invoke_start_time = time.time()
    response = rag_chain.invoke("Who killed Jon Snow?")
    rag_invoke_end_time = time.time()
    
    # Get the complete sentence
    complete_sentence_start_time = time.time()
    complete_sentence = get_complete_sentence(response)
    complete_sentence_end_time = time.time()
    
    # Create a table
    table = PrettyTable()
    table.field_names = ["Task", "Time Taken (Seconds)"]
    
    # Add rows to the table
    table.add_row(["Vectorstore Creation", round(vectorstore_end_time - vectorstore_start_time, 2)])
    table.add_row(["RAG Chain Setup", round(rag_chain_end_time - rag_chain_start_time, 2)])
    table.add_row(["RAG Chain Invocation", round(rag_invoke_end_time - rag_invoke_start_time, 2)])
    table.add_row(["Complete Sentence Extraction", round(complete_sentence_end_time - complete_sentence_start_time, 2)])
    
    # Additional information in the table
    table.add_row(["Embedding Model", embedding_model_name])
    table.add_row(["LLM (Language Model) Repo ID", llm_repo_id])
    table.add_row(["Vector Database", database_name])
    table.add_row(["Temperature", model_kwargs["temperature"]])
    table.add_row(["Max Length Tokens", model_kwargs["max_length"]])
    table.add_row(["Max New Tokens", model_kwargs["max_new_tokens"]])
    table.add_row(["Chunk Size", chunk_size])
    table.add_row(["Chunk Overlap", chunk_overlap])
    table.add_row(["Number of Documents", len(docs)])
    
    
    print("\nComplete Sentence:")
    print(complete_sentence)
    
    # Print the table
    print("\nExecution Timings:")
    print(table)
    

    +------------------------------+----------------------------------------+
    |         	Task         	|      	Time Taken (Seconds)      	|
    +------------------------------+----------------------------------------+
    | 	Vectorstore Creation 	|             	16.21              	|
    |   	RAG Chain Setup    	|              	0.03              	|
    | 	RAG Chain Invocation 	|              	2.06              	|
    | Complete Sentence Extraction |              	0.0               	|
    |   	Embedding Model    	| sentence-transformers/all-MiniLM-L6-v2 |
    | LLM (Language Model) Repo ID | 	huggingfaceh4/zephyr-7b-alpha  	|
    |   	Vector Database    	|            	LanceDB             	|
    |     	Temperature      	|              	0.5               	|
    |  	Max Length Tokens   	|              	4096              	|
    |    	Max New Tokens    	|              	2048              	|
    |      	Chunk Size      	|              	256               	|
    |    	Chunk Overlap     	|               	20               	|
    | 	Number of Documents  	|               	39               	|
    +------------------------------+----------------------------------------+

To enhance readability and present the execution information in a structured tabular format, I have used the *PrettyTable* library. You can add it to your virtual environment using the command *`pip3 install prettytable`*.

So this is the response I received in less than < 1 minute, which is quite considerable for the starters. The time it takes can vary depending on your system's configuration, but you'll get decent results in just a few minutes. So, please be patient if it's taking a bit longer.

    Human:
    Question: Who killed Jon Snow?
    
    Answer:
    In the TV series Game of Thrones, Jon Snow was stabbed by his
    fellow Night's Watch members in season 5, episode 9,
    "The Dance of Dragons." However, he was later resurrected by Melisandre
    in season 6, episode 3, "Oathbreaker." So, technically,
    no one killed Jon Snow in the show.

![](https://lh7-us.googleusercontent.com/993Lv_uQr6ZxbiI--2cQTLJZMSw8jC-RKZzy1AU-k6Jmh9Xau6hXVCs1D8SbNF2SSV22OAUknd_2kbvkd0ZjUXdNTjhkPmPBM2m6RgDeV4Hscil4D1QO5YF_Fgf-iiMxJOnng2GG-G0Vf_bzhPJP7bU)
Have fun experimenting with various data sources! You can try changing the website addresses, adding new PDF files, or changing the template a bit. LLMs are fun; you never know what you'll get!

Here is the Google Colab link for reference.
[

Google Colab

![](https://ssl.gstatic.com/colaboratory-static/common/005460c8a91a7de335dec68f82b6f6e5/img/favicon.ico)

![](https://colab.research.google.com/img/colab_favicon_256px.png)
](https://colab.research.google.com/drive/1YsOfovVdNPBwCDMWHvLfOaNtqXn4qXTs?usp=sharing&amp;ref=blog.lancedb.com)
## **What's next?**

There are plenty of things we can adjust here. We could switch to a more effective embedding model for better indexing, try different searching techniques for the retriever, add a reranker to improve document ranking, or use a more advanced LLM with a larger context window and faster response times. Based on these factors, every RAG application is just an enhanced version. However, the fundamental concept of how an RAG application works remains the same.
