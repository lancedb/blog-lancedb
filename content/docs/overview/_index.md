---
title: "What is LanceDB?"
sidebar_title: "What is LanceDB?"
description: Comprehensive documentation for LanceDB, a vector database for AI applications. Includes guides, tutorials, API references, and best practices for vector search and data management.
weight: 3
hide_toc: true
---

### The Multimodal Vector Database

**LanceDB** is a multimodal vector database that's designed to store and search data of different modalities. You can use LanceDB to build fast, scalable, and intelligent applications that rely on vector search and analytics. 

By combining columnar storage with cutting-edge indexing techniques, LanceDB enables efficient querying of both structured and unstructured data. It is ideal for powering [semantic search engines](/tutorials/multimodal-vector-search/), [recommendation systems](/tutorials/multimodal-vector-search/), and [AI-driven applications (RAG, Agents)](/tutorials/RAG/) that require real-time insights.

### LanceDB Holds All the Data

- **The Source of Truth:** Most existing vector databases only store and search embeddings and their metadata. The original data is usually stored elsewhere, so you need another database as a source of truth. LanceDB can effortlessly store both the source data and its embeddings.

- **Technology:** It is built on top of [Lance](https://github.com/lancedb/lance), an open-source columnar data format designed for extreme storage, performant ML workloads and fast random access.

### LanceDB is Multimodal and Embedded

- **Multimodal:** You can store vectors, metadata, raw images, videos, text, audio files and more. All modalities are stored in the Lance format, which provides automatic data versioning and blazing fast retrievals and filtering.

![What is LanceDB?](/assets/docs/overview/multimodal.png)

- **Embedded:** This database doesn't run as a server. Instead it runs *in-process* in your app, making it simple and cheap to implement. 

![What is LanceDB?](/assets/docs/lancedb_embedded_explanation.png)

### Integrations & Ecosystem

LanceDB integrates seamlessly with the modern AI ecosystem, providing connectors for popular frameworks, embedding models, and development tools. Whether you’re building RAG applications, working with data management platforms, or working with specific AI models, LanceDB has you covered. [Learn more about our integrations.](/docs/integrations/)

![](/assets/docs/ecosystem-illustration.png)

{{< admonition "info" "LanceDB can be run in a number of ways:" >}}
* Embedded within an existing backend (like your Django, Flask, Node.js or FastAPI application)
* Directly from a client application like a Jupyter notebook for analytical workloads
* Deployed as a remote serverless database
{{< /admonition >}}






