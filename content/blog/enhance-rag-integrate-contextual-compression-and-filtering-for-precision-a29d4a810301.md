---
title: "Efficient RAG with Compression and Filtering"
date: 2024-01-09
author: ["Kaushal Choudhary"]
author_avatar: /assets/authors/kaushal-choudhary.jpg
categories: ["Engineering"]
draft: false
featured: false
image: /assets/blog/enhance-rag-integrate-contextual-compression-and-filtering-for-precision-a29d4a810301/preview-image.png
meta_image: /assets/blog/enhance-rag-integrate-contextual-compression-and-filtering-for-precision-a29d4a810301/preview-image.png
description: "Discover about efficient rag with compression and filtering. Get practical steps, examples, and best practices you can use now."
---

## Why Contextual Compressors and Filters?

RAG (Retrieval Augmented Generation) is a technique that helps add additional data sources to our existing LLM Models; however, in most cases, it also brings unnecessary data that is not relevant to the use case.

Compression and filtering are the techniques that can help us extract only the relevant data from the corpus, increasing the efficiency and speed of our application.

Contextual compression is self-explanatory, which means that it compresses the relevant (context) data from the large, raw dataset.

Filtering is a process that further cleans the data after compression from the large dataset. Both in sync can help us drastically reduce storage, retrieval, and cost of operation.

## Working of Contextual Compression

![Contextual compression diagram](/assets/blog/enhance-rag-integrate-contextual-compression-and-filtering-for-precision-a29d4a810301/1*WZToanVYGWBLlaI00seH4A.png)

RAG (Retrieval Augmented Generation) lacks transparency in revealing what it retrieves, making it uncertain which questions the system will encounter. This results in valuable information getting lost amid a mass of irrelevant text, which is not ideal for a production-grade application.

`Contextual compression `addresses this issue with the following advantages:

1. A fundamental retriever collects various pieces of information.
2. This information is then passed through a document compressor.
3. The compressor filters and processes the data, extracting meaningful information that is pertinent to the query.

You can observe a step-by-step demonstration of this process in an interactive Colab notebook.

## Notebook Walk-through

> Follow along with this Colab notebook:

[![Open in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/lancedb/vectordb-recipes/blob/main/examples/Contextual-Compression-with-RAG/main.ipynb)

For brevity, only important code blocks are presented here, please follow the above link for full python implementation.

We will be using HuggingFace models. Get your API [**token**](https://huggingface.co/settings/tokens).

## Load the Data (PDF)

```python
loader = PyPDFLoader("Science_Glossary.pdf")
documents = loader.load()
print(len(documents))
print(documents[0].page_content)
```

Using [**BLING (Best Little Instruct-following No-GPU)**](https://huggingface.co/llmware) model series on HuggingFace for Embeddings.

```python
embeddings = SentenceTransformerEmbeddings(model_name="llmware/industry-bert-insurance-v0.1")
```

## Instantiate the LLM

***`bling-sheared-llama-1.3b-0.1`*** is part of the BLING (Best Little Instruction-following No-GPU-required) model series, instruct trained on top of a Sheared-LLaMA-1.3B base model.

```python
repo_id = "llmware/bling-sheared-llama-1.3b-0.1"
llm = HuggingFaceHub(repo_id=repo_id, model_kwargs={"temperature": 0.3, "max_length": 500})
```

## Setting up LanceDB

```python
context_data = lancedb.connect("./.lancedb")
table = context_data.create_table("context", data=[
    {"vector": embeddings.embed_query("Hello World"), "text": "Hello World", "id": "1"}
], mode="overwrite")
```

## Retriever

```python
retriever_d = database.as_retriever(search_kwargs={"k": 5, "include_metadata": True})
```

Now that we have set everything, let’s retrieve the relevant contexts that match the query.

```python
docs = retriever.get_relevant_documents(query="What is Wetlands?")
pretty_print_docs(docs)
```

![Initial retrieval results](/assets/blog/enhance-rag-integrate-contextual-compression-and-filtering-for-precision-a29d4a810301/1*mw-3Vvk7wplgsFVp7b68rQ.png)

We can see that the first two results are the most relevant to the query.

Let’s add Contextual Compression with **LLMChainExtractor**

- `LLMChainExtractor` will iterate over the initially returned documents.
- Extract only the relevant context to query from the documents.

```python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

# creating the compressor
compressor = LLMChainExtractor.from_llm(llm=llm)

# compressor retriever = base retriever + compressor
compression_retriever = ContextualCompressionRetriever(
    base_retriever=retriever_d,
    base_compressor=compressor,
)
```

Now, will add ***Filters ***to Contextual Compressions

```python
from getpass import getpass
import os
from langchain.embeddings import OpenAIEmbeddings
from langchain.retrievers.document_compressors import EmbeddingsFilter

os.environ["OPENAI_API_KEY"] = getpass()
embeddings_filter = EmbeddingsFilter(embeddings=embeddings)
compression_retriever_filter = ContextualCompressionRetriever(
    base_retriever=retriever_d, base_compressor=embeddings_filter
)

compressed_docs = compression_retriever_filter.get_relevant_documents(query="What is the Environment?")
pretty_print_docs(compressed_docs)
```

To get the result, we will utilize `RetrievalQA Chain` from Langchain.

```python
from langchain.chains import RetrievalQA

qa = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=compression_retriever_filter,
    verbose=True,
)

# Ask Question
qa("What is Environment?")
```

![RetrievalQA output](/assets/blog/enhance-rag-integrate-contextual-compression-and-filtering-for-precision-a29d4a810301/1*D7rXwGlKsdelh5NlYrlt6w.png)

## Pipelines

We can also join compressors and document transformers for better output and efficiency.

Here, we will create a pipeline comprising of redundant filter + relevant filter.

- `Redundant Filter `:- Identify similar documents and filter out redundancies.
- `Relevant Filter` :- Cleverly chooses the documents which are sufficiently relevant to a query.

```python
from langchain.document_transformers import EmbeddingsRedundantFilter
from langchain.retrievers.document_compressors import DocumentCompressorPipeline

redundant_filter = EmbeddingsRedundantFilter(embeddings=embeddings)
relevant_filter = EmbeddingsFilter(embeddings=embeddings, k=5)

# creating the pipeline
compressed_pipeline = DocumentCompressorPipeline(transformers=[redundant_filter, relevant_filter])

# compressor retriever
comp_pipe_retrieve = ContextualCompressionRetriever(
    base_retriever=retriever_d, base_compressor=compressed_pipeline
)

# print the prompt
print(comp_pipe_retrieve)

# Get relevant documents
compressed_docs = comp_pipe_retrieve.get_relevant_documents(query="What is Environment?")
pretty_print_docs(compressed_docs)
```

![Compression pipeline results](/assets/blog/enhance-rag-integrate-contextual-compression-and-filtering-for-precision-a29d4a810301/1*ilN4dlfQPy-RJ-Oj2cS3Gw.png)

We can see that it tries to gather the most relevant documents to query.

Visit LanceDB GitHub if you wish to learn more about LanceDB Python and Typescript library.
For more such applied GenAI and VectorDB applications, examples, and tutorials, visit VectorDB-Recipes.
