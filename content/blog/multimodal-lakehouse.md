---
title: "What is the LanceDB Multimodal Lakehouse?"
date: 2025-06-23
draft: false
featured: true
categories: ["Engineering"]
image: /assets/blog/multimodal-lakehouse/preview-image.png
description: "Introducing the Multimodal Lakehouse - a unified platform for managing AI data from raw files to production-ready features, now part of LanceDB Enterprise."
author: David Myriel
author_avatar: "/assets/authors/david-myriel.jpg"
author_bio: "Writer."
author_github: "davidmyriel"
author_linkedin: "davidmyriel"
---

## Multimodal Is No Longer Optional

> Multimodality is no longer a niche capability. It is the foundation of every AI workflow that aims to operate in the real world.

Modern enterprises are already working with multimodal data, even if they don't call it that. PDFs, slide decks, contracts, sales calls, emails, and dashboards are part of daily operations. These inputs span formats: text, audio, images, structured metadata, and more. 

*Even if you're not generating media with AI, you're almost certainly consuming it.*

Building AI that delivers real business value means connecting and interpreting information across these modalities. Though vector embeddings are powerful tools for comparison and retrieval, they aren't the whole picture. 

You still need access to raw content and structured signals such as filenames, timestamps, captions, and bounding boxes to build applications that truly understand the data they're working with. 

## From Storage to Scalable Processing
![Multimodal Lakehouse Architecture](/assets/blog/multimodal-lakehouse/multimodal-lakehouse-1.jpg)

If you've worked with our [high-performance columnar format - Lance](https://github.com/lancedb/lance), you're already familiar with the foundation. Also, if you've used our [vector database - LanceDB](https://github.com/lancedb/lancedb), then you've experienced how it can efficiently store and retrieve both structured and multimodal data. 

However, as more teams build complex AI systems, they also need to transition seamlessly from rapid experimentation to large-scale production. In practice, many organizations get bogged down by brittle preprocessing scripts and fragmented pipelines.

Some of our largest customers posed essential questions:
- How can we automate and accelerate feature engineering?
- How do we scale across data modalities? 
- How do we transform raw data into training-ready datasets—without relying on complex orchestration tools or rebuilding infrastructure from scratch?

## The Multimodal Lakehouse is Our Answer

LanceDB started as a vector database company, designed to handle both embeddings and diverse data types. You could run [vector search](http://lancedb.com/documentation/guides/search/vector-search.html) and [full-text search](http://lancedb.com/documentation/guides/search/full-text-search.html) for a [complete hybrid search](http://lancedb.com/documentation/guides/search/hybrid-search.html) experience relevant to search engines, RAG chatbots or all flavors of agentic systems.

**Figure 1:** [LanceDB Cloud](https://accounts.lancedb.com/sign-up) will still offer a full vector search engine experience with added features such as clustering and dimensionality reduction.

![Multimodal Lakehouse Architecture](/assets/blog/multimodal-lakehouse/lancedb-cloud.png)

This is where things start to diverge. In LanceDB Enterprise, Search is now one part of a broader platform.

As of June 24th, 2025, we are introducing the Multimodal Lakehouse suite of products into LanceDB Enterprise. The LanceDB Enterprise offering now consists of four features: Search, Exploratory Data Analysis, Feature Engineering and Training. 

![Multimodal Lakehouse Architecture](/assets/blog/multimodal-lakehouse/lancedb-enterprise.png)


On top of Lance and LanceDB, [The Multimodal Lakehouse](https://lancedb.com) adds a distributed serving engine, UDF-based feature engineering, materialized views, and SQL-based data exploration. 

The accompanying open-source Python package `geneva`, brings this vision to life with a simple, developer-friendly API.

### Centralized Multimodal Data Management

[The Multimodal Lakehouse](https://lancedb.com) acts as a flexible abstraction layer that connects to your existing LanceDB datasets. It empowers you to transform raw assets into usable AI-ready features without having to manage pipelines manually. 

By centralizing data transformations, versioning, and distributed execution, the lakehouse becomes a shared foundation for AI teams working across modalities—video, image, text, audio or structured metadata.

**Figure 2:** **Traditional Data Lakes** are modular but fragmented, requiring teams to stitch together multiple systems, one for each kind of query. **The Multimodal Lakehouse** is cohesive and hybrid-query-native, offering vector, full-text, and SQL capabilities, with direct integration into modern ML and data tools.

![Traditional Data Lakes vs Multimodal Lakehouse](/assets/blog/multimodal-lakehouse/multimodal-lakehouse.png)

{{< admonition info "The Single Source of Truth" >}}
Whether you're prototyping in a Jupyter notebook or orchestrating large backfills across GPUs, the same interface and abstractions apply. Teams across departments can align around a single source of truth for features, metrics, and data logic.
{{< / admonition >}}

This architecture shift is what enables LanceDB to act not just as a vector database, but as a foundation for building AI-native platforms at scale.

## Declarative Feature Engineering with Python UDFs

What makes the [Multimodal Lakehouse](https://lancedb.com) unique is its deep integration with how data scientists and ML engineers already work. 

Using the lakehouse starts with installing the open-source geneva Python package:
```
pip install geneva
```
#### Connect to your LanceDB table 

After connecting to a LanceDB table, users can define feature logic as standard Python functions and apply them to their datasets via a simple API.

```python
import geneva as gv
table = gv.connect("imdb-movies")
```
Traditionally, moving from experimentation to production involves porting notebook code into brittle DAGs, replicating environments, and managing task execution across compute nodes.

#### Define feature engineering functions

The lakehouse eliminates these steps. Users can write Python functions—decorated as UDFs—that are then scheduled, versioned, and executed across distributed infrastructure. 

```python
@udf
def gen_caption(image: bytes) -> str:
    return call_image_caption_model(image)

table.add_columns({"caption": gen_caption})
table.backfill("caption")
```

Behind the scenes, the platform packages your environment, deploys your code, and handles all the complexity of data partitioning, checkpointing, and incremental updates.

#### Query with hybrid search

Finally, you can easily go through your captions by either leveraging vector search, full-text search, SQL-based exploration or a hybrid combination.

```python
results = view.search("sunset over mountains")
    .limit(10)
    .to_pandas()
```

**Note:** These operations are incremental by default. You can backfill only the rows that meet specific conditions and refresh materialized views as new data arrives. Whether working interactively or scheduling batch jobs, the same code paths are used, reducing complexity and increasing reliability.

The system supports scalar UDFs for per-row computation, batched UDFs for performance optimization using Apache Arrow, and stateful UDFs that can load models or external clients, which is ideal for embedding generation or inference tasks.

## Scalable Compute with Ray and Kubernetes

The Multimodal Lakehouse doesn't just simplify development—it also scales. Through its integration with [Ray](https://www.ray.io) and [KubeRay](https://github.com/ray-project/kuberay), workloads can be distributed across clusters of CPUs and GPUs, either on-prem or in the cloud.

Compute resources can be provisioned dynamically and matched to your workload, whether it's CPU-bound document parsing or GPU-heavy model inference. Features like workload identity, custom Docker images, and execution control over concurrency and batch sizes make it easy to run high-throughput jobs securely and efficiently.

This infrastructure allows for massive scale-out of feature engineering, training data preparation, and inference preprocessing, which are all within the same declarative Python environment.

## What Can You Do With the Multimodal Lakehouse?
![Multimodal Lakehouse Architecture](/assets/blog/multimodal-lakehouse/multimodal-lakehouse-2.jpg)

The Multimodal Lakehouse supports a wide variety of AI workflows, making it a versatile tool for any modern ML organization. Some common use cases include:

| Use Case | Description |
|----------|-------------|
| **LLM Training Pipelines** | Extract, clean, and embed large text corpora for transformer-based models |
| **Multimodal Vision + Language Systems** | Generate features across images, audio, and metadata for contrastive or fusion models |
| **Semantic Search Engines** | Build rich hybrid search pipelines with embeddings, captions, thumbnails, and metadata |
| **Recommender Systems** | Generate vector representations from logs, clicks, and metadata for nearest neighbor retrieval |
| **AI Data Platforms** | Maintain end-to-end pipelines from raw data ingestion to clean, versioned, training-ready datasets |

## Focus on Data, Not Infrastructure

The core value of the Multimodal Lakehouse is letting teams focus on their data, not on DevOps. Engineers are no longer burdened with writing custom pipeline orchestration, debugging DAG dependencies, or manually scaling compute clusters. Instead, they can iterate on feature logic, monitor outputs, and let the platform handle execution.

The shift from building infrastructure to building data products unlocks faster experimentation, better collaboration, and more robust systems. It's a fundamentally different way to manage AI development.

> This architecture marks the beginning of a new era for LanceDB. Instead of building disconnected tools, we're converging on a single, unified system for managing AI data from raw files to production-ready features.

Whether you're building a state-of-the-art semantic search system, a multimodal LLM training pipeline, or just want to simplify your feature engineering infrastructure, the multimodal lakehouse offers a production-ready, open-source solution with first class developer experience.

Looks like the sun’s almost up. We’re excited to see what you’ll discover and what great things you’ll build.

![Multimodal Lakehouse Architecture](/assets/blog/multimodal-lakehouse/multimodal-lakehouse-3.jpg)