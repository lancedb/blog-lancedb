---
title: "How Nomic Uses Lance and LanceDB for Atlas and AEC Document Intelligence"
date: 2025-09-12
draft: false
featured: false
categories: ["Case Study"]
image: /assets/blog/case-study-nomic/preview-image.png
meta_image: /assets/blog/case-study-nomic/preview-image.png
description: "How Nomic powers Atlas embedding visualization and AEC document intelligence using Lance and LanceDB for scalable storage, retrieval, and multi-stage workflows."
author: David Myriel
author_avatar: "/assets/authors/david-myriel.jpg"
author_bio: "Writer."
author_twitter: "davidmyriel"
author_github: "davidmyriel"
author_linkedin: "davidmyriel"
---

[Nomic](https://nomic.ai) builds two related products. [Atlas](https://atlas.nomic.ai) is a large-scale embedding visualization system. It consumes tabular datasets and can either take precomputed embeddings or generate embeddings for any text column. The newer [AEC product](https://www.nomic.ai/aec-whitepaper) ingests documents such as PDFs and runs agentic workflows over them. Across both products, the team relies on the [Lance file format](https://lancedb.github.io/lance/), and in the AEC product they use [LanceDB](https://lancedb.com).

**Figure 1:** Nomic Atlas for data exploration
![Nomic Atlas screenshot](/assets/blog/case-study-nomic/nomic-atlas.png)

## Atlas: making very large embedding datasets explorable

### Background and migration

Atlas started before Lance existed. Early versions leaned on the [Apache Arrow](https://arrow.apache.org) ecosystem, storing derived artifacts in Arrow IPC on disk and in formats such as [Parquet](https://parquet.apache.org/) and [Feather](https://arrow.apache.org/docs/python/feather.html). Some data also lived in [PostgreSQL](https://www.postgresql.org/). As Atlas grew to handle tens of millions of embeddings, this approach became hard to scale. The team shifted the storage of derived data and embeddings into [Lance tables](/docs/overview/lance/).

### Query performance and index strategy

That change simplified query performance and day-to-day operations. For many Atlas use cases, queries run fast enough by scanning Lance tables directly. The team no longer needs to prebuild and keep an [HNSW](https://github.com/nmslib/hnswlib) index in memory in order to retrieve relevant neighbors. They build an index only when a specific latency target requires it. This avoids the memory pressure and operational complexity they experienced when they maintained large in-memory HNSW graphs.

> In Atlas we scale to tens of millions of embeddings… for a lot of our use cases we can just do the plain Lance query without even building an index… generally we don’t—we just do the scan, and Lance is fast enough for most of our use cases. —Aaron Miller

### Versioning and compaction

Version history is important to Atlas. Users need to open a dataset as it existed at a previous point in time. The team uses Lance’s ability to [keep old versions](/docs/overview/lance/) so Atlas can always show earlier states of a map. Because those versions must remain available, the team writes data in large batches to reduce fragmentation and treats compaction carefully. In Atlas they often skip compaction because it would remove older versions that users still rely on.

### Storage layout and agents

The team also saw practical gains in storage layout. Many derived artifacts moved from a shared file system to [Amazon S3](https://aws.amazon.com/s3/). This lowered cost and made scaling storage easier while keeping the same workflows. Atlas’s chat and agent features read tool-call results directly from Lance tables, which removed the need for custom caching layers.

### Ecosystem fit

Atlas continues to benefit from the broader Arrow-first stack. The team already uses [DuckDB](https://duckdb.org/), so analytical filtering and column selection integrate cleanly when preparing maps and performing quality checks.

## AEC product: running multi-stage document workflows with LanceDB

The AEC product accepts documents such as PDFs and processes them through several stages. It calls out to different models and providers to perform the work. The application surfaces answers through retrieval and agentic workflows.

### Why Node.js + LanceDB

This product uses LanceDB from [Node.js](https://nodejs.org/). The team chose LanceDB here because it is easier to use from Node, while Atlas continues to access Lance from [Python](/docs/reference/python/). The retrieval patterns in AEC are usually scoped to a subset of the data. Users want results restricted to a particular project, site, or other slice. LanceDB makes this straightforward because [vector search](/docs/search/vector-search/) can be combined with [SQL-style filters](/docs/search/sql-queries/) in the same query. Today the primary retrieval method is text embeddings. The team plans to add [full-text search](/docs/search/full-text-search/) so the system can return results for content that does not yet have embeddings and for situations where keyword matching performs better. They also plan to explore hybrid approaches.

> A big part of why we’re using LanceDB [in the AEC product] is because we use Node.js there… we find LanceDB easier to use from Node. And since we’re querying subsets of the dataset, the ability to do an embedding query with SQL filters is really helpful. - Aaron Miller

### Concurrency and checkpoints

[Concurrency](/docs/overview/lance/) was a challenge in earlier designs. The team solved it through a multi-step approach:

**Step 1: Isolate writes by stage**
The team writes each processing stage to its own Lance table. This lets many writers run in parallel without contending on a single table. Reads can later combine the stage tables as needed.

**Step 2: Store checkpoints with data**
For long-running syncs from enterprise sources, the application must know where it left off. The checkpoint for that process is stored inside Lance so it cannot drift away from the data.

**Step 3: Two-phase commit for consistency**
To keep things consistent the team performs two commits during ingestion. One commit writes the metadata that includes the checkpoint. A second commit writes the data. When the system restarts it verifies that both commits happened together before continuing.

For building datasets and tables quickly, see [Datasets quickstart](/docs/quickstart/datasets/).

### Fragmentation and compaction

The team has also dealt with table fragmentation that comes from many small updates. They compact tables on a schedule or manually in some contexts. They would like programmatic triggers that start compaction when read performance degrades. They also want a mode of compaction that keeps specific older versions for Atlas while cleaning up the rest.

## Why Lance and LanceDB fit these jobs

Atlas needed storage that scales to tens of millions of embeddings and supports efficient scans, with the option to add an [index](/docs/indexing/vector-index/) only when a workload demands lower latency. It also needed reliable access to earlier versions of a dataset so users can reproduce what they saw before. [Lance](/docs/overview/lance/) met those needs and integrated with the Arrow and DuckDB tools the team already used.

The AEC product needed a developer-friendly way to run retrieval in a Node environment. It also needed to scope searches to a subset of the data and to support multi-stage pipelines without writer contention. LanceDB provided [vector search with filters](/docs/search/vector-search/), while Lance tables gave the team a simple way to isolate writes by stage and to keep ingestion checkpoints consistent with data.

> From a developer-experience standpoint, Lance (the low-level API) and LanceDB (the database wrapper) feel like the right way to work with large-scale embeddings. —Andriy Mulyar, Nomic CEO

## Results and next steps

Atlas now serves many queries by scanning Lance tables directly and only builds an [index](/docs/indexing/vector-index/) when latency requires it. The team removed the burden of keeping large HNSW graphs in memory for most use cases. Users can view older versions of datasets as needed (see [Lance overview](/docs/overview/lance/)). Derived artifacts moved from a shared file system to S3, which simplified scaling and reduced cost.

In the AEC product, LanceDB allows vector search with SQL-style filtering so users can search within a project or other slice. Writing each pipeline stage to its own table improved throughput and stability. Checkpoints are stored inside Lance and committed in step with data so a crash cannot desynchronize them. The team plans to add [full-text search](/docs/search/full-text-search/) and to evaluate [hybrid retrieval](/docs/search/) as needs grow.

## Summary

This is the story in the team’s own words: use Lance for derived data and embeddings across both products, use LanceDB from Node where developer ergonomics matter, favor scans until an index is truly needed, keep versions available for Atlas, split writes by stage to avoid contention, and store checkpoints with the data so the system can always pick up exactly where it left off.

