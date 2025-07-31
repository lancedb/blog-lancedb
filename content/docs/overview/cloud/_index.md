---
title: "LanceDB Cloud: Features and Benefits"
sidebar_title: "LanceDB Cloud"
description: Learn about LanceDB Cloud, a serverless vector database service. Includes features, benefits, and best practices for cloud-based vector search applications.
weight: 3
---

LanceDB Cloud is a fully managed, serverless vector database service that enables developers to build, deploy, and scale AI-powered applications without infrastructure management overhead. 

Designed for production workloads, LanceDB Cloud provides cost-effective scaling that adapts to your application needs. The service is currently in public beta with general availability coming soon.

Access your data through the [LanceDB Cloud UI](/docs/cloud/) and benefit from automatic scaling, built-in security, and enterprise-grade reliability.

![What is LanceDB?](/assets/docs/overview/multimodal.png)

## Key Features

LanceDB Cloud provides the same underlying fast vector database and search engine that powers the OSS version, but without the need to maintain your own infrastructure. Because it's serverless, you only pay for the storage you use, and you can scale compute up and down as needed depending on the size of your data and its associated index.

| Feature | Description |
|:--------|:-------------|
| **Serverless & Cost Efficient** | Automatically scales to zero when idle, with usage-based pricing so you only pay for what you use. No need to manage or pay for always-on infrastructure. |
| **True Multimodal Storage** | Store raw data, embeddings, and metadata together for fast retrieval and filtering. Optimized for vectors, text, images and more. |
| **Simple Migration** | Seamlessly migrate from open source LanceDB by just changing the connection URL. No code changes required. |
| **Enterprise-Grade Security** | Data encryption at rest, SOC2 Type 2 compliance, and HIPAA compliance for regulated workloads. |
| **Full Observability** | Native integration with OpenTelemetry for comprehensive logging, monitoring and distributed tracing. |

## Which LanceDB to Use?

### LanceDB OSS: Embedded Vector Database

LanceDB OSS is an embedded, in-process vector database designed for production in self-hosted deployments. It integrates seamlessly into your existing application architecture and ML pipelines, providing full control over your data and infrastructure.

**Ideal for:** Self-hosting and organizations requiring complete data sovereignty in their own cloud.

### LanceDB Cloud: Managed Serverless Service

LanceDB Cloud is a fully managed, serverless vector database that eliminates infrastructure management overhead. The service automatically handles scaling, security, and operational tasks while providing enterprise-grade reliability and performance.

**Ideal for:** Production applications, teams requiring rapid deployment, organizations needing automatic scaling, and workloads requiring enterprise security features.

{{< admonition "info" "Seamless Migration Path" >}}
Both versions leverage the same high-performance Lance data format, ensuring consistent performance and enabling effortless migration from OSS to Cloud when your needs evolve. [Start with Cloud today](https://cloud.lancedb.com) to experience the benefits of managed infrastructure.
{{< /admonition >}}

## Upgrading to Cloud

When your application requires a managed deployment for production, you can seamlessly transition from OSS to Cloud by simply updating your connection string to point to the remote database.

LanceDB Cloud enables you to scale your AI applications from development to production without code changes or infrastructure management overhead.

[![LanceDB Cloud](/assets/docs/main-cloud-cta.png)](https://lancedb.com/cloud)