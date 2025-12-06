---
title: "LanceDB WikiSearch: Native Full-Text Search on 41M Wikipedia Docs"
date: 2025-08-11
draft: false
featured: false
categories: ["Engineering"]
image: /assets/blog/feature-full-text-search/preview-image.png
meta_image: /assets/blog/feature-full-text-search/preview-image.png
description: "No more Tantivy! We stress-tested native full-text search in our latest massive-scale search demo. Let's break down how it works and what we did to scale it."
author: David Myriel
author_avatar: "/assets/authors/david-myriel.jpg"
author_bio: "Writer, Software Engineer @ LanceDB"
author_twitter: "davidmyriel"
author_github: "davidmyriel"
author_linkedin: "davidmyriel"
---

> It's not about the vectors. It's about getting the right result.

Many of our users are building RAG and search apps, and they want three things above all: precision, scale, and simplicity. In this article, we introduce [WikiSearch](https://lancedb-demos.vercel.app/demo/wikipedia-search), our flagship demo that delivers all of these with minimal code.

[WikiSearch](https://lancedb-demos.vercel.app/demo/wikipedia-search) is a simple search engine that stores and searches through real Wikipedia entries. This demo showcases how to use LanceDB's full-text and hybrid search features to quickly find relevant information in a large dataset like Wikipedia.

## Building the Wikipedia Search Engine

Here’s a closer look at the steps involved in building the Wikipedia search engine demo, from preparing the data to performing advanced queries.

### Step 1: Data Preparation

We start with a sample of the Wikipedia dataset. The data is pre-processed and cleaned to ensure it's in a consistent format. Each document in our dataset has a `title` and `text` field, which we'll use for semantic and full-text search, respectively. There are total ~41M entries in the dataset.

### Step 2: Embedding Generation & Ingestion

{{< admonition >}}
**Note on Ingestion:** For brevity, the ingestion process described here is a basic version. The live demo app utilizes advanced, enterprise-ready LanceDB feature engineering tool, [geneva](https://lancedb.com/docs/geneva/). You can find the exact details in the "How This Works" section of the [live demo app](https://lancedb-demos.vercel.app/demo/wikipedia-search).
{{< /admonition >}}

To enable semantic search, we first need to convert our text data into their vector representations. This is done by generating vector embeddings, which are numerical representations of the text that capture its underlying meaning. We use the popular `sentence-transformers` library for this task. The resulting vectors allow us to find conceptually related content, even if the exact keywords don't match.

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(df['title'])
```

Here are the key performance metrics we achieved across an 8-GPU cluster:

|Metric|Performance|
|-|-|
|**Ingestion**|We processed 60,000+ documents per second with distributed GPU processing|
|**Indexing**|We built vector indexes on 41M documents in just 30 minutes|
|**Write Bandwidth**|We sustained 4 GB/s peak write rates for real-time applications|


### Step 3: Creating the LanceDB Table and Indexes

With our data prepared and embeddings generated, the next step is to store everything in a LanceDB table. A LanceDB table is a high-performance, columnar data store that is optimized for vector search and other AI workloads. We create a table with columns for our `title`, `text`, and the `vector` embeddings we just created.

```python
import lancedb
import pandas as pd

db = lancedb.connect("~/.lancedb")
table = db.create_table("wikipedia",
                        data=pd.DataFrame({"title": df['title'],
                                           "text": df['text'],
                                           "vector": embeddings}))
```

To ensure our searches are fast and efficient, we need to create indexes on our data. For this demo, we create two types of indexes:
*   A **vector index** on the `vector` column, which is essential for fast semantic search.
*   A **Full-Text Search (FTS)** index on the `text` column, which allows for quick keyword-based searches.

```python
# Create a vector index for semantic search
table.create_index("vector",
                   index_type="IVF_PQ",
                   num_partitions=256,
                   num_sub_vectors=96)

# Create a FTS index for keyword search
table.create_fts_index("text")
```

### Step 4: Performing Queries

Now that our data is indexed, we can perform various types of queries. LanceDB's unified search interface makes it easy to switch between different retrieval techniques.

*   **Full-Text Search (FTS)** is your classic keyword search. It's perfect for finding documents that contain specific words or phrases.
*   **Vector Search** goes beyond keywords to find results that are semantically similar to your query. This is powerful for discovering conceptually related content.
*   **Hybrid Search** gives you the best of both worlds. It combines the results of both FTS and vector search and then re-ranks them to provide a more comprehensive and relevant set of results. This is often the most effective approach for complex search tasks.



Here are examples of how to perform each type of search using LanceDB's intuitive API:

**Full-Text Search:**
```python
fts_results = table.search("ancient civilizations").limit(5).to_pandas()
```

**Vector Search:**
```python
query_vector = model.encode("famous landmarks")
vector_results = table.search(query_vector=query_vector).limit(5).to_pandas()
```

**Hybrid Search:**
```python
text = "history of space exploration"
vector = model.encode(text)
hybrid_results = table.search(query_type="hybrid")
                .vector(vector)
                .text(text)
                .limit(5)
                .to_pandas()
```

### Analyzing the Query 

To help debug search issues and optimize performance, LanceDB provides a valuable `explain_plan` and `analyse_plans` feature. This gives you a structured trace of how LanceDB executed your query.

**Figure 5:** The `analyse_plan` can be shown for Semantic & Full Text Search. Hybrid Search will be added soon, with detailed outline of the reranker and its effect.
![Wikipedia Search Demo](/assets/demos/wiki_analyse.png)

[The Plan](/docs/search/optimize-queries/) shows:

*   Which indexes were used (FTS and/or vector) and with what parameters
*   Candidate counts from each stage (text and vector), plus the final returned set
*   Filters that applied early vs. at re‑rank
*   Timings per stage so you know where to optimize

{{< admonition >}}
To learn more about Hybrid Search, [give this example a try](/docs/search/hybrid-search/).
{{< /admonition >}}

## The WikiSearch Demo

[![Wikipedia Search Demo](/assets/demos/wiki.png)](https://lancedb-demos.vercel.app/demo/wikipedia-search)

{{< admonition "Try it out!" >}}
Want to know who wrote Romeo and Juliet? [Give it a spin!](https://lancedb-demos.vercel.app/demo/wikipedia-search)
{{< /admonition >}}

The demo lets you switch between semantic (vector), full-text (keyword), and hybrid search modes. Try comparing the different modes to see how they handle various queries and deliver different results.

## Conclusion

This demo showcased what's possible when you combine [LanceDB's native Full-Text Search](/docs/search/full-text-search/) with vector embeddings to create a powerful hybrid search solution.

You get the precision of keyword matching, the semantic understanding of embeddings, and the scalability to handle massive datasets - all in one unified platform.
