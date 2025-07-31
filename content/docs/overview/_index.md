---
title: "What is LanceDB?"
sidebar_title: "What is LanceDB?"
description: Comprehensive documentation for LanceDB, a vector database for AI applications. Includes guides, tutorials, API references, and best practices for vector search and data management.
weight: 3
---

LanceDB serves two different use cases, both built on the foundation of [the powerful Lance format](/docs/overview/lance).

1. [Vector Search and Generative AI](#vector-search-and-generative-ai) </br>
LanceDB can be used as a vector database to build production-ready AI applications. Vector search is available in [OSS](/docs/overview/features), [Cloud](https://cloud.lancedb.com), and [Enterprise](/docs/overview/enterprise) editions. 

2. [Training, Feature Engineering and Analytics](#training-feature-engineering-and-analytics) </br>
Our enterprise-grade platform enables ML engineers and data scientists to perform large-scale training, multimodal EDA and AI model experimentation. Lakehouse features are available in [OSS](/docs/overview/features) and [Enterprise](/docs/overview/enterprise) editions.

## Use Cases

### Vector Search and Generative AI

LanceDB is the preferred choice for developers building production-ready search and generative AI applications, including e-commerce search, recommendation systems, RAG (Retrieval-Augmented Generation), and autonomous agents.

Acting as a vector database, LanceDB natively stores vectors alongside multiple data modalities (text, images, video, audio), serving as a unified data store that eliminates the need for separate databases to manage source data.

| Feature | LanceDB OSS | LanceDB Cloud | LanceDB Enterprise |
| :----- | :----- | :----- | :----- |
| **Search** | ✅ Local | ✅ Managed | ✅ Managed  |
| **Storage** | ✅ Local Disk + AWS S3, Azure Blob, GCS | ✅ Managed  | ✅ Managed, with Caching |
| **SQL** | ✅ Local, via DuckDB, Spark, Trino | ✅ Managed  | ✅ Managed  |

- **LanceDB OSS** gives you a free and embedded vector database for self-hosted deployments. [Check the full feature list.](/docs/overview/features/)
- **LanceDB Cloud** provides a fully managed, serverless experience with [automatic indexing, scaling and other quality of life features](/docs/overview/cloud/). 
- **LanceDB Enterprise** offers a distributed & managed database with all the same benefits of LanceDB Cloud and OSS, [plus additional performance and security benefits](/docs/overview/enterprise/overview/).

### Training, Feature Engineering and Analytics

Our multimodal lakehouse platform empowers ML engineers and data scientists to train and fine-tune custom models on petabyte-scale multimodal datasets.

The platform serves as a unified data hub for internal search, analytics, and model experimentation workflows. Enhanced with SQL analytics, training pipelines, and feature engineering capabilities to accelerate AI development.

| Feature | LanceDB OSS  | LanceDB Enterprise |
| :----- | :----- | :----- |
| **Search** | ✅ Local| ✅ Managed   |
| **Storage** | ✅ Local Disk + AWS S3, Azure Blob, GCS |  ✅ Managed, with Caching |
| **SQL** | ✅ Local, via DuckDB, Spark, Trino |  ✅ Managed |
| **Training** | ✅ Local, via PyTorch |  ✅ Managed, via PyTorch  |
| **Feature Engineering** | ✅ API-only (local compute, no caching) | ✅ Managed, via Geneva  |

- **LanceDB OSS** provides a free, self-hosted lakehouse platform that seamlessly works with training and analytics tools. 
- **LanceDB Enterprise** delivers a managed lakehouse with distributed architecture, accelleration through caching, and custom-built training and feature engineering support. [Learn about Enterprise capabilities.](/docs/overview/enterprise/overview/)

## Vector Search and Storage

**LanceDB** is used as a vector database that's designed to store and search data of different modalities. You can use LanceDB to build fast, scalable, and intelligent applications that rely on vector search and analytics. 

It is ideal for powering [semantic search engines](/docs/tutorials/vector-search/), [recommendation systems](/docs/tutorials/vector-search/), and [AI-driven applications (RAG, Agents)](/docs/tutorials/rag/) that require real-time insights.

### 1. Single Source Database

- **The Source of Truth:** Most existing vector databases only store and search embeddings and their metadata. The original data is usually stored elsewhere, so you need another database as a source of truth. LanceDB can effortlessly store both the source data and its embeddings.

- **Technology:** It is built on top of [Lance](https://github.com/lancedb/lance), an open-source columnar data format designed for extreme storage, performant ML workloads and fast random access.

### 2. Broad Multimodal Support

- **Multimodal:** You can store vectors, metadata, raw images, videos, text, audio files and more. All modalities are stored in the Lance format, which provides automatic data versioning and blazing fast retrievals and filtering.

### 3. Custom Query Engine 

- **Indexing:** By combining columnar storage with cutting-edge indexing techniques, LanceDB enables efficient querying of both structured and unstructured data. 

- **Search-at-Scale:** Columnar storage for read and write performance on large scale datasets, especially vector-heavy workloads.

### 4. Flexible Deployment

- **Embedded:** LanceDB OSS database is a library that runs *in-process* in your app, making it simple and cheap to implement on top of multiple remote storage options (such as S3). 

- **Serverless:** LanceDB Cloud is a fully managed, serverless vector database that scales automatically with your storage or search needs, eliminating infrastructure management overhead.

- **Managed:** LanceDB Enterprise offers a dedicated, enterprise-grade deployment with advanced security, compliance features, and dedicated support for mission-critical AI applications.

## Training, Feature Engineering and Analytics

### 1. Distributed Architecture

- **Scalability:** Optimized for performance at scale, the Enterprise edition supports a fully managed, horizontally scalable deployment that can handle billions of rows and petabyte-scale data volumes.

- **Caching for Performance:** A distributed NVMe cache fleet enables high IOPS and throughput—up to 5M IOPS and 10+ GB/s—while reducing API calls to cloud object stores like S3, GCS, and Azure Blob. This dramatically lowers inference and training costs.

### 2. Scalable Experimentation

- **Resilience:** Feature engineering pipelines include built-in checkpointing and automatic resumption, making workloads resilient to interruptions and suitable for preemptible (spot) instances.

- **Distributed Processing:** Python user-defined functions (UDFs) orchestrate distributed data transformations across Ray or Kubernetes clusters, allowing fast, declarative feature creation and evolution.

- **ML Workflow Integration:** Offers fast random access, named SQL views for training, and direct integration with PyTorch/JAX data loaders to streamline ML workflows.

### 3. Advanced Search 

- **Multimodal Search:** Enterprise deployments include full-text, vector, and hybrid search using secondary indices such as BTree, NGram, and vector indices—all backed by the Lance format for low-latency access.

### 4. Enterprise Support

- **Enterprise Security:** Supports BYOC (Bring Your Own Cloud), integrating natively with cloud provider security (IAM, audit logs, encryption) and enables private connectivity via AWS PrivateLink or GCP Private Service Connect.

- **Production Ready:** Includes telemetry pipelines, enterprise SLAs, and control plane integration for job scheduling and observability across training, analytics, and search.

## Integrations and Compatibility

LanceDB integrates seamlessly with the modern AI ecosystem, providing connectors for popular frameworks, embedding models, and development tools. [Read more about LanceDB Integrations.](/docs/integrations/)

![](/assets/docs/ecosystem-illustration.png)

### Popular Integrations

| Category | Integrations | Documentation |
|:---|:---|:---|
| **[AI Frameworks](/docs/integrations/frameworks/)** | LangChain, LlamaIndex, Haystack | [AI Frameworks](/docs/integrations/frameworks/) |
| **[Embedding Models](/docs/integrations/embedding/)** | OpenAI, Cohere, Hugging Face, Custom Models | [Embedding Models](/docs/integrations/embedding/) |
| **[Reranking Models](/docs/integrations/reranking/)** | BGE-reranker, Cohere Rerank, Custom Models | [Reranking Models](/docs/integrations/reranking/) |
| **[Data Platforms](/docs/integrations/platforms/)** | DuckDB, Pandas, Polars | [Data Platforms](/docs/integrations/platforms/) |

{{< admonition "info" "Getting Started" >}}
[Create a LanceDB Cloud account](https://accounts.lancedb.com/sign-up) to get started in minutes! Follow our guided tutorials to:
- [Upload data to a remote table](/docs/quickstart/basic-usage/)
- [Run vector searches and explore your data](/docs/quickstart/basic-usage/)
- [Build your first AI application](/docs/tutorials/)
{{< /admonition >}}