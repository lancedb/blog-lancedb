---
title: "Implementing Corrective RAG in the Easiest Way"
date: 2024-03-04
author: LanceDB
categories: ["Engineering"]
draft: false
featured: false
image: /assets/blog/implementing-corrective-rag-in-the-easiest-way-2/preview-image.png
meta_image: /assets/blog/implementing-corrective-rag-in-the-easiest-way-2/preview-image.png
description: "Even though text-generation models are good at generating content, they sometimes need to improve in returning facts.  This happens because of the way they are trained."
---

Even though text-generation models are good at generating content, they sometimes need to improve in returning facts. This happens because of the way they are trained. Retrieval Augmented Generation(RAG) techniques have been introduced to address this issue by fetching context from a knowledge base.

Corrective RAG is an additional step to ensure the model sticks to the information it gets. It corrects factual inaccuracies in real-time by ranking options based on how likely they fit the model and match the retrieved info. This helps ensure accurate corrections before completing the text.

[**Corrective Retrieval Augmented Generation paper**](https://arxiv.org/pdf/2401.15884.pdf)

![CRAG at Inference](/assets/blog/implementing-corrective-rag-in-the-easiest-way-2/unnamed.png)

CRAG at Inference ([https://arxiv.org/abs/2401.15884](https://arxiv.org/abs/2401.15884))

### **Top Level Structure**

CRAG has three main parts:

1. **Generative Model**: It generates an initial sequence.
2. **Retrieval Model**: It retrieves context based on the initial sequence from the knowledge base.
3. **Retrieval Evaluator**: It manages the back-and-forth between the generator and retriever, ranks options, and decides the final sequence to be given as output.

In CRAG, the **Retrieval Evaluator** links the Retriever and Generator. It keeps track of the text created, asks the generator for more, gets knowledge with updated info, scores options for both text fit and accuracy, and chooses the best one to add to the output at each step.

![Pseudocode of CRAG](/assets/blog/implementing-corrective-rag-in-the-easiest-way-2/crag-pseudocode.png)Pseudocode of CRAG from paper

### **Implementation**

[![Open in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/lancedb/vectordb-recipes/blob/main/tutorials/Corrective-RAG-with_Langgraph/CRAG_with_Langgraph.ipynb)
Implementation will include giving ratings/scores to retrieved documents based on how well they answer a question:

**For Correct documents** -

1. If at least one document is relevant, it moves on to creating text
2. Before creating text, it cleans up the knowledge
3. This breaks down the document into “knowledge strips”
4. It rates each strip and gets rid of ones that don’t matter

**For Ambiguous or Incorrect documents** -

1. If all documents need to be more relevant or are unsure, the method looks for more information.
2. It uses a web search to add more details to what it found
3. The diagram in the paper also shows that they might change the question to get better results.

We will implement CRAG using Langgraph and LanceDB. LanceDB for lightning-fast retrieval from the knowledge base. Here is the flow of how it will work.

![Flow diagram](/assets/blog/implementing-corrective-rag-in-the-easiest-way-2/unnamed-1.png)

The next step to implement this flow will be:

1. Retrieve relevant documents
2. If a relevant document is not found, go for supplement retrieval with a web search(using Tavily API).
3. Query re-writing to optimize the query for web search.

Here is some pseudocode. For a complete implementation, please refer to the linked Colab notebook.

**Building Retriever**

We will use Jay Alammer’s articles on Transformers as a knowledge base.

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.vectorstores import LanceDB
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

# Using Jay Alammar's articles on Transformers, BERT, and retrieval
urls = [
    "https://jalammar.github.io/illustrated-transformer/",
    "https://jalammar.github.io/illustrated-bert/",
    "https://jalammar.github.io/illustrated-retrieval-transformer/",
]

docs = [WebBaseLoader(url).load() for url in urls]
docs_list = [item for sublist in docs for item in sublist]

# document chunking
text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    chunk_size=250, chunk_overlap=0
)
doc_splits = text_splitter.split_documents(docs_list)
```

**Define knowledge base using LanceDB**

```python
import lancedb

def lanceDBConnection(embed):
    db = lancedb.connect("/tmp/lancedb")
    table = db.create_table(
        "crag_demo",
        data=[{"vector": embed.embed_query("Hello World"), "text": "Hello World"}],
        mode="overwrite",
    )
    return table
```

**Embeddings Extraction**

We will use the OpenAI embeddings function and insert them in the LanceDB knowledge base for fetching context to extract the embeddings of documents.

```python
# OpenAI embeddings
embedder = OpenAIEmbeddings()

# LanceDB as vector store
table = lanceDBConnection(embedder)
vectorstore = LanceDB.from_documents(
    documents=doc_splits,
    embedding=embedder,
    connection=table,
)

# ready with our retriever
retriever = vectorstore.as_retriever()
```

**Define Langgraph**

We will define a graph for building Langgraph by adding nodes and edges as in the above flow diagram.

```python
from typing import Dict, TypedDict

from langchain_core.messages import BaseMessage

class GraphState(TypedDict):
    """
    Represents the state of our graph.

    Attributes:
        keys: A dictionary where each key is a string.
    """

    keys: Dict[str, any]
```

This Graph will include five nodes: document retriever, generator, document grader, query transformer, and web search, and 1 edge will decide whether to generate or not.

The following graph shows the flow shown in the diagram.

```python
import pprint

from langgraph.graph import END, StateGraph

workflow = StateGraph(GraphState)

# Define the nodes
workflow.add_node("retrieve", retrieve)  # retrieve docs
workflow.add_node("grade_documents", grade_documents)  # grade retrieved docs
workflow.add_node("generate", generate)  # generate answers
workflow.add_node("transform_query", transform_query)  # transform_query for web search
workflow.add_node("web_search", web_search)  # web search

# Build graph
workflow.set_entry_point("retrieve")
workflow.add_edge("retrieve", "grade_documents")
workflow.add_conditional_edges(
    "grade_documents",
    decide_to_generate,
    {
        "transform_query": "transform_query",
        "generate": "generate",
    },
)
workflow.add_edge("transform_query", "web_search")
workflow.add_edge("web_search", "generate")
workflow.add_edge("generate", END)

# Compile
app = workflow.compile()

# Run
query_prompt = "How Transformers work?"
inputs = {"keys": {"question": query_prompt}}
for output in app.stream(inputs):
    for key, value in output.items():
        # print full state at each node
        pprint.pprint(value["keys"], indent=2, width=80, depth=None)
    pprint.pprint("------------------------")

# Final generation
print("*"*5, " Generated Answer ", "*"*5)
pprint.pprint(value["keys"]["generation"])
```

Here is the generated answer output, illustrating each node’s functioning and their decisions, ultimately resulting in the final generated output.
![Output of implemented CRAG](/assets/blog/implementing-corrective-rag-in-the-easiest-way-2/output.png)
Checkout the Colab for implementation:

[![Open in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/lancedb/vectordb-recipes/blob/main/tutorials/Corrective-RAG-with_Langgraph/CRAG_with_Langgraph.ipynb)

### **Challenges and Future Work**

CRAG helps generate more accurate factual information out of the knowledge base, but still, Some Challenges remain for the widespread adoption of CRAG:

1. Retrieval quality depends on comprehensive knowledge coverage in the knowledge base.
2. Increased computation cost and latency compared to basic models.
3. The framework is sensitive to retriever limitations.
4. Balancing between fluency and factuality is challenging.
