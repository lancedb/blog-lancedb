---
title: LanceDB Feature Catalog
sidebar_title: "Feature Catalog"
description: "Complete catalog of LanceDB features including storage, tables, ingestion, indexing, search, and filtering capabilities"
weight: 15
---

This list outlines all the features offered by LanceDB - across OSS, Cloud and Enterprise product lines. Click on each feature to be taken to its individual documentation page.

## Storage

LanceDB provides flexible storage backends that support both cloud object storage and local high-performance storage for different deployment scenarios.

| Feature | Description | OSS | Cloud | Enterprise |
|:---|:---|:---:|:---:|:---:|
| [Object, File, Block Storage](/docs/concepts/storage/) | Support for AWS, GCS, Azure and S3-compatible vendors. | ✅ | ✅ | ✅ |
| [Local SSD/NVMe Storage](/docs/concepts/storage/) | Support for storage on customer's custom servers. | ✅ |  | ✅ |

## Tables

LanceDB's table abstraction provides ACID-compliant data management with schema evolution, versioning, and consistency guarantees for vector and scalar data.

| Feature | Description | OSS | Cloud | Enterprise |
|:---|:---|:---:|:---:|:---:|
| [Tables - CRUD Operations](/docs/concepts/tables/) | Basic API to create, read, update, drop tables. | ✅ | ✅ | ✅ |
| [Tables - Data Evolution](/docs/concepts/tables/schema/) | Alter column schema, datatype,  backfill + merge data | ✅ | ✅ | ✅ |
| [Tables - Versioning](/docs/concepts/tables/versioning/) | Append, overwrite, check versions + tag them. | ✅ | ✅ | ✅ |
| [Tables - Consistency](/docs/concepts/tables/consistency/) | Synchronize database with underlying storage. | ✅ | ✅ | ✅ |

## Ingestion

LanceDB's ingestion pipeline handles both vector embedding generation and data loading with support for multiple formats and efficient batch operations.

| Feature | Description | OSS | Cloud | Enterprise |
|:---|:---|:---:|:---:|:---:|
| [Embedding - Text Data](/docs/concepts/embedding/) | Generate vector embeddings from text data using various embedding models. | ✅ | ✅ | ✅ |
| [Embedding - Multimodal Data](/docs/concepts/embedding/) | Generate embeddings from images, audio, and other multimodal content. | ✅ | ✅ | ✅ |
| [Embedding - CPU & GPU Device Configuration](/docs/concepts/embedding/) | Configure CPU or GPU acceleration for embedding generation performance. | ✅ | ✅ | ✅ |
| [Embedding - Environment Variables](/docs/concepts/embedding/) | Manage API keys and configuration for embedding model access. | ✅ | ✅ | ✅ |
| [Data Ingestion - Default](/docs/concepts/tables/data/) | Formerly called Adding Data to a Table. | ✅ | ✅ | ✅ |
| [Data Ingestion - Formats](/docs/concepts/tables/data/) | Pandas, Polars, Pyarrow, Pydantic | ✅ | ✅ | ✅ |
| [Data Ingestion - Upsert](/docs/concepts/tables/update/) | Update existing records or insert new ones based on key. | ✅ | ✅ | ✅ |
| [Data Ingestion - Merge Insert](/docs/concepts/tables/update/) | Combine data from multiple sources into a single table. | ✅ | ✅ | ✅ |

## Indexing

LanceDB's indexing system provides multiple vector and scalar index types with automated optimization for fast similarity search and retrieval operations.

| Feature | Description | OSS | Cloud | Enterprise |
|:---|:---|:---:|:---:|:---:|
| [Vector Index - IVF_FLAT](/docs/concepts/indexing/vector-index/) | Minimal index that looks at IVF partitions, instead of brute forcing. | ✅ | ✅ | ✅ |
| [Vector Index - IVF_PQ](/docs/concepts/indexing/vector-index/) | Default vector index using Euclidean distance.  | ✅ | ✅ | ✅ |
| [Vector Index - IVF_SQ](/docs/concepts/indexing/vector-index/) | IVF index built using scalar quantized vectors. | ✅ | ✅ | ✅ |
| [Vector Index - IVF_HNSW_SQ](/docs/concepts/indexing/vector-index/) | HNSW built on IVF's partitions + vectors that are scalar quantized. | ✅ | ✅ | ✅ |
| [Vector Index - Binary](/docs/concepts/indexing/vector-index/) | IVF_FLAT with Hamming distance for binary vectors. | ✅ | ✅ | ✅ |
| [Scalar Index](/docs/concepts/indexing/scalar-index/) | BTREE, BITMAP, LABEL_LIST | ✅ | ✅ | ✅ |
| [Automated Indexing](/docs/concepts/indexing/) | Indexing happens in the background no config. |  | ✅ | ✅ |
| [Bypass Automated Indexing](/docs/concepts/indexing/) | When you want to search over all available vectors. | ✅ | ✅ | ✅ |
| [Reindexing - Manual](/docs/concepts/indexing/reindexing/) | User needs to specify that they want to reindex. | ✅ | ✅ | ✅ |
| [Reindexing - Automated](/docs/concepts/indexing/reindexing/) | Reindexing happens in the background no config |  | ✅ | ✅ |
| [GPU Indexing - Manual](/docs/concepts/indexing/gpu-indexing/) | User needs to specify which indexing device to use. | ✅ | ✅ | ✅ |
| [GPU Indexing - Automated](/docs/concepts/indexing/gpu-indexing/) | Indexing device is automatically set for user. |  | ✅ | ✅ |
| [Full Text Search Index](/docs/concepts/indexing/fts-index/) | Inverted index | ✅ | ✅ | ✅ |

## Search

LanceDB's search capabilities combine vector similarity search, full-text search, and hybrid approaches to provide comprehensive retrieval functionality across different data types.

| Feature | Description | OSS | Cloud | Enterprise |
|:---|:---|:---:|:---:|:---:|
| [Vector Search - No Index](/docs/concepts/search/vector-search/) | Goes through all the available vectors. | ✅ | ✅ | ✅ |
| [Vector Search - ANN Index](/docs/concepts/search/vector-search/) | Retrieves top K similar vectors. | ✅ | ✅ | ✅ |
| [Vector Search - Multivectors](/docs/concepts/search/multivector-search/) | Late interaction vector search. | ✅ | ✅ | ✅ |
| [Vector Search - Distance Range](/docs/concepts/search/vector-search/) | Search for vectors within a specific distance threshold. | ✅ | ✅ | ✅ |
| [Vector Search - Binary Vectors](/docs/concepts/search/vector-search/) | Search using binary vector representations for efficiency. | ✅ | ✅ | ✅ |
| [Vector Search - Filtering](/docs/concepts/search/filtering/) | Apply scalar filters during vector search operations. | ✅ | ✅ | ✅ |
| [Vector Search - Batch API](/docs/concepts/search/vector-search/) | Process multiple search queries in a single request. | ✅ | ✅ | ✅ |
| [Vector Search - Async Indexing](/docs/concepts/search/vector-search/) | Fallback brute force for fast performance. |  | ✅ | ✅ |
| [Full Text Search - FTS Index](/docs/concepts/search/full-text-search/) | Inverted Index | ✅ | ✅ | ✅ |
| [Full Text Search - Tokenizer](/docs/concepts/search/full-text-search/) | Ngram and other common methods of splitting text data. | ✅ | ✅ | ✅ |
| [Full Text Search - Scalar Index](/docs/concepts/search/full-text-search/) | BTREE, BITMAP, LABEL_LIST for non-vector data. | ✅ | ✅ | ✅ |
| [Full Text Search - Fuzzy Search](/docs/concepts/search/full-text-search/) | Searching when there is a typo on the query. | ✅ | ✅ | ✅ |
| [Full Text Search - Prefix Matching](/docs/concepts/search/full-text-search/) | Search for text that starts with specific characters. | ✅ | ✅ | ✅ |
| [Full Text Search - Score Boosting](/docs/concepts/search/full-text-search/) | Increase relevance scores for specific terms or fields. | ✅ | ✅ | ✅ |
| [Full Text Search - Boolean Logic](/docs/concepts/search/full-text-search/) | Use AND, OR, NOT operators in text search queries. | ✅ | ✅ | ✅ |
| [Full Text Search - Array Fields](/docs/concepts/search/full-text-search/) | Search within array or list data types. | ✅ | ✅ | ✅ |
| [Hybrid Search - FTS Index](/docs/concepts/search/hybrid-search/) | Combine vector and full-text search in single query. | ✅ | ✅ | ✅ |
| [Hybrid Search - Reranking](/docs/concepts/search/hybrid-search/) | Reorder search results using additional ranking models. | ✅ | ✅ | ✅ |
| [SQL Queries](/docs/concepts/search/sql-queries/) | Execute standard SQL queries on LanceDB tables. | ✅ | ✅ | ✅ |
| [Query Optimization](/docs/guides/optimize-queries/) | Explain query plan, analyze query plan, optimization config settings.  | ✅ | ✅ | ✅ |

## Filtering

LanceDB's filtering system provides flexible query capabilities that can be applied independently or in combination with vector and full-text search operations.

| Feature | Description | OSS | Cloud | Enterprise |
|:---|:---|:---:|:---:|:---:|
| [Filtering - no Vector Search](/docs/concepts/search/filtering/) | Apply filters without vector search operations. | ✅ | ✅ | ✅ |
| [Filtering - Vector Search](/docs/concepts/search/filtering/) | Apply filters during vector search operations. | ✅ | ✅ | ✅ |
| [Filtering - Full Text Search](/docs/concepts/search/filtering/) | Apply filters during full-text search operations. | ✅ | ✅ | ✅ |