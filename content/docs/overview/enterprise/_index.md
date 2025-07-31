---
title: "LanceDB Enterprise: Features and Benefits"
sidebar_title: "LanceDB Enterprise"
description: "Learn about LanceDB Enterprise, the enterprise-grade vector database solution. Includes features, benefits, and deployment options for production environments."
weight: 4
---

**LanceDB Enterprise** is both a **private cloud or a BYOC solution** that transforms your data lake into a high-performance [vector database](/docs/overview/#the-multimodal-vector-database) or [lakehouse](/docs/overview/#the-multimodal-lakehouse) that can operate at extreme scale.

With a vector database built for [lakehouse architecture](/docs/overview/enterpris/architecture/), you can serve millions of tables and tens of billions of rows in a single index, improve retrieval quality using hybrid search with blazing-fast metadata filters, and reduce costs by up to 200x with object storage.

{{< admonition >}}
For private deployments, high performance at extreme scale, or if you have strict security requirements, [talk to us about LanceDB Enterprise](mailto:contact@lancedb.com).
{{< /admonition >}}

## Key Benefits of LanceDB Enterprise

### Perfect for Large Deployments

LanceDB Enterprise powers global deployments with a secure, compliant distributed lakehouse system that ensures complete data sovereignty and high performance at scale.

| Benefit | Description |
|:--------|:------------|
| **Flexible Deployment** | Bring your own cloud, account, region, or Kubernetes cluster, or let LanceDB manage it for you. |
| **Multi-Cloud Support** | Available on AWS, GCP, and Azure. Open data layer that eliminates vendor lock-in. |
| **Data Security** | Encryption at rest, SOC 2 Type II, and HIPAA compliance. |

Read more about how [self-hosting with Enterprise compares to LanceDB OSS](/docs/overview/enterprise/overview/).

### Best Performance for Petabyte Scale

LanceDB OSS is built on the highly-efficient Lance format and offers extensive features out of the box. Our Enterprise solution amplifies these benefits by means of a custom-build distributed system. 

| Benefit | Description |
|:--------|:------------|
| **Performance** | Tens of thousands of QPS with latency in single-digit milliseconds, hundreds of thousands of rows per second write throughput, and low-latency indexing across many tables. |
| **Scalability** | Support workloads requiring data isolation with millions of active tables, or a single table with billions of rows. |

Learn more about [performance differences between LanceDB OSS and Enterprise](/docs/overview/enterprise/overview/).

### Developer Experience

LanceDB Enterprise extends our OSS product with production-grade features while maintaining full compatibility. Move from prototype to production by simply updating your connection string - no code changes or data migration required.

| Benefit | Description |
|:--------|:------------|
| **Effortless Migration** | Migrate from Open Source LanceDB to LanceDB Enterprise by simply using a connection URL. |
| **Observability** | First-class integration with existing observability systems for logging, monitoring, and distributed traces using OpenTelemetry. |

Take a look at a more thorough [list of benefits of LanceDB Enterprise](/docs/overview/enterprise/overview/).