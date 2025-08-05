---
title: "LanceDB Enterprise vs OSS"
sidebar_title: Benefits
weight: 1
aliases: ["/docs/overview/enterprise/overview/", "/docs/overview/enterprise/overview"]
---

Modern AI workloads produce petabytes of multimodal data that must be queried in real time. On top of that, enterprise AI systems must stay completely private and air-gapped. 

LanceDB offers **two self-hosted options** to meet such requirements: **LanceDB OSS**, a single-process library, and **LanceDB Enterprise**, a distributed cluster with automated scaling and low-latency caching. 

This document compares their architectures and operational models so you can select the deployment that meets your performance targets and resource constraints.

## Key Differences

**LanceDB OSS** is an embedded vector database that runs inside your process. On the other hand, **LanceDB Enterprise** is a distributed cluster that spans many machines. Both share the same Lance columnar file format, so moving data from one edition to the other requires no conversion.

| Dimension | LanceDB OSS | LanceDB Enterprise | What the difference means |
|:----------|:------------|:-------------------|:-------------------------|
| **Mode** | Single process | Distributed fleet | OSS lives on one host. Enterprise spreads work across nodes and keeps serving even if one node fails. |
| **Latency from object storage** | 500–1000 ms | 50–200 ms | Enterprise mitigates network delay with an SSD cache and parallel reads. |
| **Throughput** | 10–50 QPS | Up to 10,000 QPS | A cluster can serve thousands of concurrent users; a single process cannot. |
| **Cache** | None | Distributed NVMe cache | Enterprise keeps hot data near compute and avoids repeated S3 calls. |
| **Indexing & compaction** | Manual | Automatic | Enterprise runs background jobs that rebuild and compact data without downtime. |
| **Data format** | Supports multiple available standards | Supports multiple available standards | No vendor lock-in; data moves freely between editions. |
| **Deployment** | Embedded in your code | Bring-Your-Own-Cloud or Managed Service | Enterprise meets uptime, compliance, and support goals that OSS cannot. |

### Architecture and Scale

LanceDB OSS is directly embedded into your service. The process owns all CPU, memory, and storage, so scale is limited to what the host can provide. 
Lance DB Enterprise separates work into routers, execution nodes, and background workers. New nodes join the cluster through a discovery service; they register, replicate metadata, and begin answering traffic without a restart. A distributed control plane watches node health, shifts load away from unhealthy nodes, and enforces consensus rules that prevent split-brain events.

Read More: [LanceDB Enterprise Architecture](/docs/overview/enterprise/architecture/)

### Latency of Data Retrieval

With Lance OSS every query fetches data from S3, GCS, or Azure Blob. Each round trip to an object store adds several hundred milliseconds, especially when data is cold. 

LanceDB Enterprise uses NVMe SSDs as a hybrid cache, before the data store is even accessed. The first read fills the cache, and subsequent reads come from the local disk and return in tens of milliseconds. Parallel chunked reads further reduce tail latency. This gap matters when the application serves interactive dashboards or real-time recommendations.

Read More: [LanceDB Enterprise Performance](/docs/overview/enterprise/benchmark/)

### Throughput of Search Queries

A single LanceDB OSS process shares one CPU pool with the rest of the application. When concurrent queries hit that CPU, retrieval and similarity processes compete for cores. The server cannot process more work in parallel and any extra traffic waits in the queue, raising latency without increasing queries per second.

LanceDB Enterprise distributes queries across many execution nodes. Each node runs a dedicated vector search engine that exploits all cores and uses SIMD instructions. A load balancer assigns queries to the least-loaded node, so throughput grows roughly linearly as more nodes join the cluster.

### Caching of Commonly Retrieved Data

LanceDB OSS has no built-in cache. Every read repeats the same object-store round trip and pays the same latency penalty. 

LanceDB Enterprise shards a cache across the fleet with consistent hashing. Popular vectors remain on local NVMe drives until they age out under a least-recently-used policy. Cache misses fall back to the object store, fill the local shard, and serve future reads faster. This design slashes both latency and egress cost for workloads with temporal locality.

### Maintenance of Vector Indexes

Vector indexes fragment when data is inserted, updated, or deleted. Fragmentation slows queries because the engine must scan more blocks. LanceDB OSS offers a CLI call to compact or rebuild the index, but you must schedule it and stop queries while it runs. 

LanceDB Enterprise runs compaction jobs in the background. It copies data to a scratch space, rebuilds the index, swaps the old files atomically, and frees disk space. Production traffic continues uninterrupted.

Read More: [Indexing in LanceDB](/docs/concepts/indexing/)

### Deployment and Governance

When you work with LanceDB OSS, it is included as part of your binary, Docker, or serverless function. The footprint is small, and no extra services run beside it. 

LanceDB Enterprise comes in two flavors. The Bring-Your-Own-Cloud template installs the control plane, routers, and nodes inside your VPC, so data never leaves your account. The managed SaaS option hands day-to-day operations to the vendor, including patching, scaling, and 24×7 monitoring. Both enterprise modes support private networking, role-based access control, audit logs, and single sign-on.

Read More: [LanceDB Enterprise Performance](/docs/overview/enterprise/deployment/)

## Which Option is Best?

Stay with LanceDB OSS when the entire dataset fits on one machine, daily traffic remains under fifty queries per second, and your team can run manual maintenance without affecting users. 

[Try the OSS first](/docs/quickstart/): Get started with `pip install lancedb` and run a quick vector tutorial.

Move to Lance DB Enterprise when you need latency to be below 200 ms, traffic grows toward hundreds of QPS, or the business requires high availability, compliance controls, and vendor support. 

[Jump straight to Enterprise](/contact/): We can help you scope your workload and arrange an Enterprise proof of concept.
