---
title: "What is LanceDB?"
sidebar_title: "What is LanceDB?"
description: Comprehensive documentation for LanceDB, a vector database for AI applications. Includes guides, tutorials, API references, and best practices for vector search and data management.
weight: 3
---

**LanceDB OSS** is an open-source, batteries-included embedded multimodal database that you can run on your own infrastructure. "Embedded" means that it runs *in-process*, making it incredibly simple to self-host your own AI retrieval workflows for RAG and more. No servers, no hassle.

[![LanceDB Products](/assets/docs/lancedb-products.png)](https://lancedb.com/cloud)



![What is LanceDB?](/assets/docs/lancedb_embedded_explanation.png)

It is a multimodal vector database for AI that's designed to store, manage, query and retrieve embeddings on large-scale data of different modalities. Most existing vector databases that store and query just the embeddings and their metadata. The actual data is stored elsewhere, requiring you to manage their storage and versioning separately.

![](/assets/docs/lancedb_and_lance.png)

## **LanceDB Ecosystem**

LanceDB integrates with a wide range of tools and frameworks in the AI and data ecosystem:

![](/assets/docs/ecosystem-illustration.png)

{{< admonition "info" "LanceDB can be run in a number of ways:" >}}
* Embedded within an existing backend (like your Django, Flask, Node.js or FastAPI application)
* Directly from a client application like a Jupyter notebook for analytical workloads
* Deployed as a remote serverless database
{{< /admonition >}}

LanceDB supports storage of the *actual data itself*, alongside the embeddings and metadata. You can persist your images, videos, text documents, audio files and more in the Lance format, which provides automatic data versioning and blazing fast retrievals and filtering via LanceDB.

![](/assets/docs/lancedb_local_data_explanation.png)

The core of LanceDB is written in Rust 🦀 and is built on top of [Lance](https://github.com/lancedb/lance), an open-source columnar data format designed for performant ML workloads and fast random access.

Both the database and the underlying data format are designed from the ground up to be **easy-to-use**, **scalable** and **cost-effective**.








