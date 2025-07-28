---
title: "LanceDB Cloud: The Multimodal Vector Database"
sidebar_title: "LanceDB Cloud"
description: Learn about LanceDB Cloud, a serverless vector database service. Includes features, benefits, and best practices for cloud-based vector search applications.
weight: 3
---

LanceDB Cloud is a serverless vector database service that makes it easy to build, deploy, and scale AI-powered applications.

![](/assets/docs/lancedb_cloud.png)

LanceDB Cloud provides the same underlying fast vector store that powers the OSS version, but without the need to maintain your own infrastructure. Because it's serverless, you only pay for the storage you use, and you can scale compute up and down as needed depending on the size of your data and its associated index.

It's designed to be cost-effective and highly scalable without breaking the bank. LanceDB Cloud is currently in private beta with general availability coming soon, but you can apply for early access with the private beta release by signing up below.

[Try out LanceDB Cloud (Public Beta) Now](https://cloud.lancedb.com){ .md-button .md-button--primary }

## Key Features

- **Serverless & Cost Efficient**: Automatically scales to zero when idle, with usage-based pricing so you only pay for what you use. No need to manage or pay for always-on infrastructure.

- **True Multimodal Storage**: Store raw data, embeddings, and metadata together for fast retrieval and filtering. Optimized for vectors, text, images and more.

- **Simple Migration**: Seamlessly migrate from open source LanceDB by just changing the connection URL. No code changes required.

- **Enterprise-Grade Security**: Data encryption at rest, SOC2 Type 2 compliance, and HIPAA compliance for regulated workloads.

- **Full Observability**: Native integration with OpenTelemetry for comprehensive logging, monitoring and distributed tracing.

## What is the difference between LanceDB OSS and LanceDB Cloud?

LanceDB OSS is an **embedded** (in-process) solution that can be used as the vector store of choice for your LLM and RAG applications. It can be embedded inside an existing application backend, or used in-process alongside existing ML and data engineering pipelines.

LanceDB Cloud is a **serverless** solution — the database and data sit on the cloud and we manage the scalability of the application side via a remote client, without the need to manage any infrastructure.

Both flavors of LanceDB benefit from the blazing fast Lance data format and are built on the same open source foundations.

## Upgrading from OSS to Cloud

The OSS version of LanceDB is designed to be embedded in your application, and it runs in-process. This makes it incredibly simple to self-host your own AI retrieval workflows for RAG and more and build and test out your concepts on your own infrastructure. The OSS version is forever free, and you can continue to build and integrate LanceDB into your existing backend applications without any added costs.

![](/assets/docs/lancedb_oss_and_cloud.png)

Should you decide that you need a managed deployment in production, it's possible to seamlessly transition from the OSS to the cloud version by changing the connection string to point to a remote database instead of a local one. With LanceDB Cloud, you can take your AI application from development to production without major code changes or infrastructure burden.

