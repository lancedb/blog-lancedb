---
title: "Lance Columnar Format: How Does it Work?"
sidebar_title: "Lance Format"
weight: 10
---

LanceDB is built on top of the [Lance](https://lancedb.github.io/lance/) columnar data format, which provides the foundation for its multimodal capabilities. Lance combines the performance of Apache Arrow with advanced features designed specifically for AI workloads.

> Looking for Lance columnar format docs? [Click here.](https://lancedb.github.io/lance/)


## Why Lance?

The Lance format enables LanceDB to serve as a unified data store that eliminates the need for separate databases. Unlike traditional vector databases that only store embeddings, LanceDB can store both the original data and its vector representations in the same efficient format.

### Key Advantages of Lance Format

| Advantage | Description |
|:----------|:-------------|
| Multimodal Storage | Efficiently holds vectors, images, videos, audio, text, and more |
| Version Control | Built-in data versioning for reproducible ML experiments and data lineage |
| ML-Optimized | Designed for training and inference workloads with fast random access |
| Query Performance | Columnar storage enables blazing-fast vector search and analytics |
| Cloud-Native | Seamless integration with cloud object stores (S3, GCS, Azure Blob) |

## Core Concepts of Lance

The following concepts are important to keep in mind:

1. Data storage is columnar and is interoperable with other columnar formats (such as Parquet) via Arrow
2. Data is divided into fragments that represent a subset of the data. Fragments are chunks of data in a Lance dataset. Each fragment includes multiple files that contain several columns in the chunk of data that it represents.
3. Data is versioned, with each insert operation creating a new version of the dataset and an update to the manifest that tracks versions via metadata

### The Importance of Versioning

- First, each version contains metadata and just the new/updated data in your transaction. So if you have 100 versions, they aren't 100 duplicates of the same data. However, they do have 100x the metadata overhead of a single version, which can result in slower queries.  

- Second, these versions exist to keep LanceDB scalable and consistent. We do not immediately blow away old versions when creating new ones because other clients might be in the middle of querying the old version. It's important to retain older versions for as long as they might be queried.

## Data Compaction 

As you insert more data, your dataset will grow and you'll need to perform *compaction* to maintain query throughput (i.e., keep latencies down to a minimum). Compaction is the process of merging fragments together to reduce the amount of metadata that needs to be managed, and to reduce the number of files that need to be opened while scanning the dataset.

### Performance Optimization Through Compaction

Compaction performs the following tasks in the background:

- Removes deleted rows from fragments
- Removes dropped columns from fragments
- Merges small fragments into larger ones

Depending on the use case and dataset, optimal compaction will have different requirements. As a rule of thumb:

- It's always better to use *batch* inserts rather than adding 1 row at a time (to avoid too small fragments). If single-row inserts are unavoidable, run compaction on a regular basis to merge them into larger fragments.
- Keep the number of fragments under 100, which is suitable for most use cases (for *really* large datasets of >500M rows, more fragments might be needed)

## Data Deletion and Recovery

Although Lance allows you to delete rows from a dataset, it does not actually delete the data immediately. It simply marks the row as deleted in the `DataFile` that represents a fragment. 

For a given version of the dataset, each fragment can have up to one deletion file (if no rows were ever deleted from that fragment, it will not have a deletion file). This is important to keep in mind because it means that the data is still there, and can be recovered if needed, as long as that version still exists based on your backup policy.

{{< admonition note "Learn More About Lance" >}}
Lance is a separate open source project.[Check out the Lance docs.](https://lancedb.github.io/lance/)
{{< /admonition >}}
