---
title: "LanceDB WikiSearch: Native Full-Text Search on 41M Wikipedia Docs"
date: 2025-08-11
draft: false
featured: false
categories: ["Engineering"]
image: /assets/blog/feature-full-text-search/preview-image.png
meta_image: /assets/blog/feature-full-text-search/preview-image.png
description: "No more Tantivy! We stress-tested native full-text search in our latest massive-scale search demo. Let's break down how it works and what we did to scale it."
author: "David Myriel"
author_avatar: "/assets/authors/david-myriel.jpg"
author_bio: "Writer."
author_twitter: "davidmyriel"
author_github: "davidmyriel"
author_linkedin: "davidmyriel"
author2: "Ayush Chaurasia"
author2_avatar: "/assets/authors/ayush-chaurasia.jpg"
author2_bio: "ML Engineer and researcher focused on multi-modal AI systems and efficient retrieval methods."
author2_twitter: "ayushchaurasia"
author2_github: "ayushchaurasia"
author2_linkedin: "ayushchaurasia"
---

> It's not about the vectors. It's about getting the right result.

Many of our users are building RAG and search apps, and they want three things above all: precision, scale, and simplicity. In this article, we introduce [WikiSearch](https://wiki-search-2.vercel.app), our flagship demo that delivers all [with minimal code](https://github.com/lancedb/saas-examples-large-scale/tree/main/wikipedia-ingest). 

[WikiSearch](https://wiki-search-2.vercel.app) is a very simple [search engine](/docs/overview/) that stores and searches through real Wikipedia entries.
You don't see it, but there is a lot of content sitting in [LanceDB Cloud](https://accounts.lancedb.com/sign-up) - and we use Full Text Search to go through it. Vector search is still there for semantic relevance, and we merge both into a [powerful Hybrid Search solution](/docs/search/hybrid-search/). 

{{< admonition >}}
We previously used [Tantivy](https://github.com/quickwit-oss/tantivy) for our search implementation. Now, we have an in-house FTS solution that provides better integration with LanceDB and offers superior performance for our specific use cases. 
{{< /admonition >}}

## Why Full-Text Search Matters

[Full-Text Search (FTS)](/docs/search/full-text-search/) lets you find the exact words, phrases, and spellings people care about. It complements [vector search](/docs/search/vector-search/) by catching precise constraints, rare terms, and operators (phrases, boolean logic, field boosts) that embeddings alone often miss.

It works by tokenization: splitting text into small, searchable pieces called tokens. It lowercases words, removes punctuation, and can reduce words to a base form (e.g., “running” → “run”). 

Here is how basic stemming is enabled for an English-language text:
```python
table.create_fts_index("text", language="English", replace=True)
```

This request creates and stores tokens into an inverted (FTS) index. The tokenizer you choose can be [standard, language-aware, or n-gram & more](/docs/search/full-text-search/). Configuration directly shapes recall and precision, so you have a lot of freedom to play around with the parameters and match them to your use case.

FTS handles multilingual text, too. For French, enable `ascii_folding` during index creation to strip accents (e.g., “é” → “e”), so queries match words regardless of diacritics. 

```python
table.create_fts_index(
        "text",
        language="French",
        stem=True,
        ascii_folding=True,
        replace=True,
    )
```
{{< admonition >}}
Now, when you search for the name René, you can afford to make a mistake!
{{< /admonition >}}

[FTS is especially important for an encyclopedia or a Wiki](https://wiki-search-2.vercel.app), where articles are long and packed with names and multi-word terms. Tokenization makes variants like “New York City,” “New-York,” and “NYC” findable, and enables phrase/prefix matches. The result is fast, precise lookup across millions of entries.

### FTS and Hybrid Search

FTS is a great way to control search outcomes and [makes vector search better and faster](/docs/search/optimize-queries/). You can often find what embeddings miss, such as rare terms, names, numbers, and words with “must include/exclude” rules. Most of all, you can combine keyword scores with vector scores to rank by both meaning and exact wording, and show highlights to explain why a result matched. 

In [LanceDB's Hybrid Search](/docs/overview/hybrid-search), native FTS blends text and vector signals with weights or via Reciprocal‑Rank Fusion (RRF) for a [completely reranked search solution](/docs/reranking/).

{{< admonition >}}
To learn more about Hybrid Search, [give this example a try](/docs/search/hybrid-search/).
{{< /admonition >}}

## The 41M WikiSearch Demo

[![Wikipedia Search Demo](/assets/docs/demos/wiki-search.png)](https://wiki-search-2.vercel.app/)

{{< admonition "Try it out!" >}}
Want to know who wrote Romeo and Juliet? [Give it a spin!](https://wiki-search-2.vercel.app/)
{{< /admonition >}}

The demo lets you switch between semantic (vector), full-text (keyword), and hybrid search modes. [Semantic or Vector Search](/docs/search/vector-search/) finds conceptually related content, even when the exact words differ. [Full-text Search](/docs/search/full-text-search/) excels at finding precise terms and phrases. [Hybrid Search](/docs/search/hybrid-search/) combines both approaches - getting the best of semantic understanding while still catching exact matches. Try comparing the different modes to see how they handle various queries.


## Behind the Scenes

### Step 1: Ingestion

We start with raw articles from Wikipedia and normalize content into pages and sections. Long articles are chunked on headings so each result points to a focused span of text rather than an entire page. 

During ingestion we create a schema and columns, such as `content`, `url`, and `title`. Writes are batched (≈200k rows per commit) to maximize throughput.

**Figure 1:** Data is ingested, embedded, and stored in LanceDB. The user runs queries and retrieves WikiSearch results via our Python SDK.
![Wikipedia Search Demo](/assets/blog/feature-full-text-search/process.png)

### Step 2: Embedding 

A parallel embedding pipeline (configurable model) writes vectors into the `vector` column. The demo scripts let you swap the embedding models easily. Here, we are using a basic `sentence-transformers` model.

To learn more about vectorization, [read our Embedding API docs](/docs/embedding/).

### Step 3: Indexing 

We build two indexes per table: a vector index (`IVF_HNSW_PQ` or `IVF_PQ`, depending on your latency/recall/memory goals) over the embedded content, and a native `FTS` index over title and body. 

[This is where you define tokenization and matching options.](/docs/search/full-text-search/) As you configure the [FTS index](/docs/indexing/fts-index/), you can instruct the Wiki to be broken down in different ways.

**Figure 2:** Sample LanceDB Cloud table with schema and defined indexes for each column.
![Indexed Table](/assets/docs/demos/indexed-table.png)

### Step 4: Service 

A thin API fronts LanceDB Cloud. The web UI issues text, vector, or hybrid queries, shows results, and exposes `explain_plan` for each request. Deploying the app is a connection string plus credentials.....that's it! [Check out the entire implementation in GitHub.](https://github.com/lancedb/saas-examples-large-scale/tree/main/wikipedia-ingest)

## How the Search Works

1. [A text query](/docs/search/full-text-search/) first hits the FTS index and returns a pool of candidate document IDs with scores derived from term statistics. 

2. [A semantic query](/docs/search/vector-search/) embeds the input and asks the vector index for nearest neighbors, producing a separate candidate pool with distances. 

3. [In hybrid mode](/docs/search/hybrid-search/) we normalize these signals and combine them into a reranked search result.

**Figure 3:** Behind the scenes, you can see all the parameters for your search query.
![Wikipedia Search Demo](/assets/blog/feature-full-text-search/parameters.png)

### The Query Plan

Now we're getting serious. `explain_plan` is a very valuable feature that we created to help debug search issues and [optimize performance](/docs/search/optimize-queries/). Toggle it to get a structured trace of how LanceDB executed your query. 

**Figure 4:** The Query Plan can be shown for Semantic & Full Text Search. Hybrid Search will be added soon, with detailed outline of the reranker and its effect.
![Wikipedia Search Demo](/assets/blog/feature-full-text-search/query-plan-1.png)

The Query Plan shows:

- Which indexes were used (FTS and/or vector) and with what parameters
- Candidate counts from each stage (text and vector), plus the final returned set
- Filters that applied early vs. at re‑rank
- Timings per stage so you know where to optimize



## Performance and Scaling

At ~41 million documents, we needed to add data in batches. We ingested data efficiently using `table.add()`, with batches of 200K rows at once:

```python
BATCH_SIZE_LANCEDB = 200_000 

for i in range(0, len(all_processed_chunks), BATCH_SIZE):
    batch_to_add = all_processed_chunks[i : i + BATCH_SIZE]
    try:
        table.add(batch_to_add)
    except Exception as e:
        print(f"Error adding batch to LanceDB: {e}")
```
{{< admonition >}}
Batching `table.add(list_of_dicts)` is much faster than adding records individually. Adjust `BATCH_SIZE_LANCEDB` based on memory and performance.
{{< /admonition >}}

### Performance at Scale

The core pattern is: parallelize data loading, chunking, and embedding generation, then use `table.add(batch)` within each parallel worker to write to LanceDB. LanceDB’s design efficiently handles these concurrent additions. This example uses modal for performing distributed embedding generation and ingestion. 

Here are some performance metrics from our side:

|Process|Performance| 
|-|-| 
| Ingestion:|Using a distributed setup with 50 GPUs (via Modal), we ingested ~41M rows in roughly 11 minutes end‑to‑end.| 
| Indexing:|Vector index build completed in about 30 minutes for the same dataset.| 
| Write bandwidth:|LanceDB’s ingestion layer can sustain multi‑GB/s write rates (4 GB/s peak observed in our tests) when batching and parallelism are configured properly.| 

### Which Index to Use?

Use `IVF_HNSW_PQ` for high recall and predictable latency; use `IVF‑PQ` when memory footprint is the constraint and you want excellent throughput at scale. Native `FTS` indexes (title, body) handle tokenization and matching; choose options per your corpus.

{{< admonition >}}
[Read more about Indexing.](/docs/indexing/) 
{{< /admonition >}}

### Trying Things Out

Your numbers will vary based on encoder speed, instance types, and network, but the pattern holds: parallelize embedding, batch writes (e.g., ~200k rows per batch), and build indexes once per checkpointed snapshot. Cloud keeps the table readable while background jobs run, so you can stage changes and cut over via alias swap without downtime.

{{< admonition "Note" "Full Code and Tutorial">}}
Check out the [GitHub Repository.](https://github.com/lancedb/saas-examples-large-scale/tree/main/wikipedia-ingest) 
{{< /admonition >}}

## The Search is Never Complete

Beyond the endless exploration of a large dataset, this demo showcased what's possible when you combine [LanceDB's native Full-Text Search](/docs/search/full-text-search/) with vector embeddings. 

You get the precision of keyword matching, the semantic understanding of embeddings, and the scalability to handle massive datasets - all in one unified platform.

We built this entire app on [LanceDB Cloud](https://accounts.lancedb.com/sign-up), which is free to try and comes with comprehensive tutorials, sample code, and documentation to help you build RAG applications, AI agents, and semantic search engines. 

![Wikipedia Search Demo](/assets/blog/feature-full-text-search/outro.png)
