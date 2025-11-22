---
title: "From BI to AI: A Modern Lakehouse Stack with Lance and Iceberg"
date: 2025-11-21
draft: false
featured: true
categories: ["Engineering"]
image: /assets/blog/from-bi-to-ai-lance-and-iceberg/preview-image.png
meta_image: /assets/blog/from-bi-to-ai-lance-and-iceberg/preview-image.png
description: "A comparison of where Iceberg and Lance sit in the modern lakehouse stack. We highlight emerging architectures that are bridging the worlds of analytics and AI/ML workloads using these two formats, while being built on the same data foundation."
author: Jack Ye
author_avatar: "/assets/authors/jack-ye.jpg"
author_bio: "Software Engineer @ LanceDB"
author_github: "jackye1995"
author_linkedin: "yezhaoqin"
author2: "Prashanth Rao"
author2_avatar: "/assets/authors/prashanth.png"
author2_bio: "AI Engineer @ LanceDB"
author2_github: "prrao87"
author2_linkedin: "prrao87"
author2_twitter: "tech_optimist"
---

The modern, composable data stack has evolved around the idea of the *lakehouse* — a unified system that blends the flexibility of data lakes (i.e., object stores designed to hold data in open file formats) with the analytical performance and reliability of data warehouses. Projects like [Apache Iceberg](https://iceberg.apache.org/) have been pivotal in making this vision real, offering transactional guarantees and schema evolution at scale.

But as AI and machine learning workloads bring with them more ever larger amounts of data from multiple modalities (e.g., text, images, audio, video, sensor data), newer formats like [Lance](https://lance.org) are emerging to take the next leap forward. Lance is a high-performance columnar format that’s purpose-built for AI/ML workloads (training, feature engineering) and multimodal data at the petabyte-scale.

The goal of this post is to explain where Iceberg and Lance fit in the modern lakehouse stack, while discussing some of their key differences. We’ll highlight emerging data architectures that are bridging the worlds of analytics and AI/ML workloads using these two formats, when built on the same data foundation.

## Understanding the modern lakehouse stack

The modern lakehouse architecture consists of six distinct technological layers, each serving a specific purpose. Let’s dissect these layers (from the bottom-up) to understand where Lance and Iceberg fit in, and how they can work together.

![](/assets/blog/from-bi-to-ai-lance-and-iceberg/lakehouse_stack.png)

### Object store

At the foundation of the lakehouse lies the **object store** — these are storage systems characterized by their simple, object-based hierarchy, typically providing high durability guarantees with HTTP-based communication for data transfer.

### File format

The **file format** describes how a single file should be stored on disk. This is where formats like Lance, Parquet, ORC, and Avro are present. The file format defines the internal structure, encoding, and compression of individual data files.

### Table format

The **table format** describes how multiple files work together to form a logical table. Table formats must include features like transactional commits and read isolation, so that multiple writers and readers can safely operate against the same table.

### Catalog spec

The **catalog spec** defines how any system can discover and manage a collection of tables within storage. It acts as the bridge between the storage layer and the compute layer of the stack (starting with the catalog *service*, more on this below).

### Catalog service

A **catalog service** offers easy connectivity to the compute engines on top, and implements one or more catalog specs to provide both table metadata and optionally continuous background maintenance (compaction, optimization, index updates) that table formats require to stay performant.

### Compute engine

The **compute engine** is the workhorse built on top of catalog services that leverage their awareness of catalog specs, table formats and file formats to perform complex data workflows,  Compute engines are carefully designed to handle a variety of workloads, including SQL queries, analytics processing, vector search, full-text search, machine learning training.

## Differences between Lance and Iceberg

The key insight from the lakehouse architecture described above is that the file format, table format, and catalog spec layers are just **storage** specifications without compute. Any **compute power** resides only in the object store, catalog services, and compute engine layers. This clear separation of concerns is what allows lakehouse storage to be flexible, portable, and independently scalable, while opening up the same underlying data for discovery by any catalog service, and for processing by any compatible compute engine.

Iceberg operates at **two of the layers** in the stack: the table format and the catalog spec. It typically uses Parquet as the underlying file format.

Lance spans **three layers of the stack**, because it's simultaneously a file format, table format *and* a catalog spec.

![](/assets/blog/from-bi-to-ai-lance-and-iceberg/lance_and_iceberg.png)

In the sections below, we'll compare and contrast Lance and Iceberg at each of these layers.

### Table format

Iceberg employs a **three-level** metadata hierarchy in its table format: a table metadata file → manifest list → manifest files. The table metadata (a JSON file) rolls up a comprehensive history of past commits and schemas, and stores the partition specs, snapshot references and table properties. Each snapshot points to a manifest list (Avro) that contains metadata about manifest files and partition statistics (also Avro), and the manifests contain lists of data files that sit in the object store. Note that the Iceberg table format itself does not define how to atomically commit data — instead, it just describes the latest table metadata location, and it’s left to the catalog service how to actually do the commit.

Lance employs a **single-level** metadata hierarchy, with one manifest file per table version. Lance tables use the notion of *fragments*, rather than partitions. Each commit to a Lance table produces a new manifest file that contains fragments (each with their own data and deletion files) and pointers to the index files (for FTS, vector and other scalar indexes).

![](/assets/blog/from-bi-to-ai-lance-and-iceberg/table_format.png)

### File format

Iceberg supports multiple file formats under the hood. Parquet is the most prevalent and widely used, but Avro and ORC formats are also supported.

From a file format perspective, Lance does away with row groups (unlike Parquet, which heavily relies on them), achieving a high degree parallelism, achieving 100x the random access performance of Parquet without sacrificing scan performance. There are several other differences between Lance and Parquet that won’t be discussed here, but you can read more about it in this VLDB 2025 paper: [Efficient Random Access in Columnar Storage through Adaptive Structural Encodings](https://arxiv.org/html/2504.15247v1).

### Catalog spec

Because of the way Iceberg delegates the actual atomic write guarantees to arbitrary catalog services, over the years there have been many protocols developed by the vendors building these catalog services. Iceberg’s “REST Catalog spec” was developed as the wrapper to standardize these different protocols, and any catalog service adopting the spec is required to guarantee the atomicity of the API operation.

Lance uses “namespaces”, rather than explicitly defining a catalog spec. In fact, Lance intentionally names it as "Lance Namespace" rather than "Lance Catalog",  because it’s a thin wrapper to allow storing and managing a Lance table via any catalog service, and is not aimed to be a complete catalog spec. In the future, to provide a full catalog spec experience, Lance aims to use Arrow Flight gRPC as its main standard, to be compatible with Lance’s vision of being an “Arrow-native lakehouse format”.

## When Lance is beneficial

In this section, we’ll list the key benefits of using Lance over Iceberg, especially for AI/ML workloads.

### Fast random access for search, ML and AI

Earlier generations of open table formats (Iceberg, Delta Lake and Hudi) were primarily designed as replacements for Hive. They focus mainly on data warehouse (OLAP) workloads, with tables that are typically “long but narrow”.

Lance on the other hand, is designed from the ground up to support machine learning and AI workflows, with fundamentally different access patterns, supporting tables that are “[long and wide](https://lancedb.com/blog/lance-v2/#very-wide-schemas)” (e.g., embeddings, blobs and deeply nested data in columns). Lance can index [billions of vectors in hours](https://lancedb.com/blog/case-study-netflix/), storing tens of petabytes of data. For vector search, it can support more than 10,000 QPS with [\<50ms latency](https://lancedb.com/docs/enterprise/benchmark/) over object storage. For ML training, Lance integrates with PyTorch and JAX data loaders, achieving (through a distributed cache fleet) more than 5 million IOPS from NVMe SSDs.

Combining fast random access with native indexes within the same format is what gives Lance a significant advantage in ML and AI use cases, compared to scan-based approaches that are common in traditional lakehouses relying on Iceberg.

### Multimodal data done right

Multimodal data (images, videos, audio, deeply nested point clouds and their associated embeddings) is becoming more and more common, especially in the age of AI, where it’s never been easier to generate and consume huge amounts of it.

In many Iceberg deployments today, multimodal data is modeled as columns in tables (like any other tabular data), with pointers to the actual data located in object storage. This isn’t ideal from a data governance perspective, because organizations would need separate access control layers and extra operational plumbing across various systems. It’s also not ideal from a performance perspective, because there is additional I/O and network overhead while fetching individual data items.

Lance’s file format provides native blob embedding support, which makes it more convenient to maintain this data natively inside the columns, with no external lookups (the multimodal data is co-located with metadata and embeddings), thus simplifying governance and management of data that’s multimodal in nature. It’s also significantly more performant due to its native support for blob storage — at the table level, Lance can pack multiple smaller rows together while storing very large rows in a dedicated file thanks to its fragment-based design, balancing performance with storage size.

![](/assets/blog/from-bi-to-ai-lance-and-iceberg/multimodal_lakehouse.png)

### Flexible, zero-copy data evolution

A common need that arises in data management is **data evolution,** i.e., changes to the table properties and adding, updating or removing columns and their associated data. These types of operations are especially common in ML/AI applications, where developers frequently add features, predictions or embeddings as new columns to an existing table. In Iceberg, data evolution comes with a non-trivial cost — adding data to a new column requires a **full table rewrite** since Parquet stores entire row groups together.

In Lance, adding a new column **is essentially a zero-copy operation**. Lance's fragment design allows independent column files per fragment (though multiple columns can share a data file), meaning that adding or updating a column simply appends new column files without touching existing data. This avoids duplication [on petabytes of data](https://lancedb.com/blog/case-study-netflix), as noted by our partners at Netflix when they
began using LanceDB.

Lance’s ability to continuously or incrementally add features, without duplicating or rewriting unaffected data, makes it a compelling choice for managing petabyte-scale data for AI.

![](/assets/blog/from-bi-to-ai-lance-and-iceberg/data_evolution.png)

## When Iceberg is beneficial

In this section, we’ll highlight how Iceberg’s partition-based, catalog-centric approach can be beneficial for traditional BI or analytics workloads that are incredibly common in enterprises.

### Optimized for analytical workloads

Iceberg’s hidden partitioning logic and its three-level metadata hierarchy enable efficient partition pruning for compute engines that are optimized for analytics workloads, where queries are naturally filtered on partition keys. Lance, in contrast, uses fragments (rather than partitions) as the organizational unit for data, so at present, the way Lance organizes data doesn’t fit well with traditional OLAP-style compute engines that are heavily optimized for partition-based scans.

Newer methods like [liquid clustering](https://docs.databricks.com/aws/en/delta/clustering) (developed by Databricks) can, in the future, actively leverage Lance’s features, because they avoid hard-coded table layouts and adopt an adaptive clustering approach that’s optimized based on actual query patterns. However, partitioning is a concept that’s deeply baked into current-generation query engines, so until liquid clustering gains larger adoption in the ecosystem, Iceberg has several advantages for analytics workloads.

### Mature ecosystem integration

Iceberg has years of battle-hardening from production usage and is well-integrated with a mature ecosystem, including integrations with several compute engines and catalog services. In contrast, Lance’s compute engine integrations are still emerging (primarily Spark and Ray at present), with many more upcoming and in their nascent stages. There is strong community interest in adding Lance support to popular compute engines that are part of the Iceberg ecosystem, including Flink, StarRocks, and Trino, so expect this space to evolve with time.

### Centralized observability

Iceberg's catalog-dependent design means the catalog is aware of *all* table operations, enabling centralized monitoring and powerful automated optimization triggers. It also enable an easy-to-maintain unified audit log across all tables, with coordinated data lineage tracking.

Lance tables, like Delta Lake, can be **modified directly in storage** without catalog awareness. This storage-first design gives Lance a portability advantage but complicates activity tracking — downstream operations must rely on pull-based polling or storage event notifications (S3 Events, GCS Pub/Sub) rather than semantic catalog events. Over time, Lance’s approach to address this will be to offer managed solutions like LanceDB Enterprise (which has knowledge of all read/write traffic), and to onboard all operations onto open observability frameworks like OpenTelemetry.

## Takeaways from the comparison

The following table summarizes the main reasons why we think Lance is emerging as a **new standard for multimodal data and AI** workloads in the lakehouse.

| Feature | Lance | Iceberg |
| --- | --- | --- |
| **Metadata Structure** | Single-level manifest per version | Three-level hierarchy (metadata → manifest list → manifest) |
| **Metadata Growth** | Independent versions, no rollup | Metadata files accumulate snapshot history |
| **Data Organization** | Fragments (horizontal slices), global clustering/sorting | Partition specs with hidden partitioning, clustering/sorting within partition |
| **Row Address** | 64-bit addresses (fragment_id + offset) | file path + position tuple |
| **File Format** | Lance file format | Parquet/ORC/Avro |
| **Index Support** | Vector, full-text index + a standardized framework for new scalar index specifications | Puffin for simple NDV sketch, deletion vector |

Parquet and Iceberg, developed independently (in their own time frames), have led to an explosion of connectors, integrations and innovations up and down the layers of the lakehouse stack. However, a lot of these predate the age of AI, where the kinds of workloads and user requirements involved are changing at a blazing pace.

Because it’s relatively new, Lance has had the opportunity to a) build and iterate rapidly, from the ground up, and b) learn from the successes and existing pain points of Iceberg and Parquet. The design features of Lance, as can be seen in the table above, incorporates several proven patterns, while introducing new paradigms that aim to address the unique requirements of AI/ML workloads. Lance users can seamlessly interoperate between the various ML and data processing frameworks, from Pandas and Polars, to PyTorch and beyond.   

## A unified data platform with Lance and Iceberg

Looking at the trade-offs involved when choosing between Lance and Iceberg, especially for analytics vs. ML/AI workloads, we’re seeing a dual-format strategy involving Lance being adopted by large enterprises. Companies like Netflix are now [beginning to adopt Lance](https://lancedb.com/blog/case-study-netflix/) for their AI and multimodal workloads, alongside Iceberg, which has long been their primary table format for BI and analytics workloads.

The figure below envisions how a unified lakehouse platform built on top of Lance and Iceberg might look, as more organizations build out their lakehouses on top of modern infrastructure.

![](/assets/blog/from-bi-to-ai-lance-and-iceberg/unified_lakehouse_platform.png)

From an Iceberg perspective, leveraging the parts of the lakehouse stack that are optimized for large analytics-style workloads allows enterprises to benefit from mature compute engine and catalog integrations in the Iceberg ecosystem.

From a Lance perspective, leveraging the file-level benefits of Lance (faster random access, multimodal blob handling, Arrow-native integrations) and its table-level benefits (fragment design allowing zero-copy data evolution and a pluggable index framework) allows enterprises to rapidly move forward with their AI workloads and keep up with upcoming paradigms. All of this, built on top of the same data foundation.

These emerging architectural patterns reflects a broader trend: managing the separate needs of analytics and AI workloads with two distinct but interoperable formats — Iceberg for BI, and Lance for AI and multimodal data, bridging the best of both worlds.These emerging architectural patterns reflects a broader trend: managing the separate needs of analytics and AI workloads with two distinct but interoperable formats — Iceberg for BI, and Lance for AI and multimodal data, bridging the best of both worlds.