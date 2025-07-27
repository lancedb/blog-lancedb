---
title: "LanceDB Enterprise FAQ"
sidebar_title: "LanceDB Enterprise"
description: "Find answers to frequently asked questions about LanceDB Enterprise. Covers features, performance, deployment, security, and more."
keywords: "LanceDB Enterprise, vector database FAQ, enterprise vector search, database connection, indexing, querying, architecture, monitoring, fault tolerance, consistency, GPU indexing"
weight: 3
---

This section provides answers to the most common questions asked about LanceDB Enterprise. For assistance with LanceDB Enterprise, please contact our Support staff at [support@lancedb.com](mailto:support@lancedb.com).

## Architecture and Fault Tolerance

### What's the impact of losing each component (query node, indexer, etc.) in the LanceDB stack?
LanceDB Enterprise employs component-level replication to ensure fault tolerance and 
continuous operations. While the system remains fully functional during replica 
failures, transient performance impacts (e.g., elevated latency or reduced throughput) 
may occur until automated recovery completes.  
For architectural deep dives, including redundancy configurations, 
please contact the LanceDB team.

### What does plan executor cache versus not cache?
The plan executor caches the table data, not the table indices.

### Should I use disk cache or memory cache for the plan executor?
LanceDB implements highly performant consistent hashing for our plan executors. 
NVMe SSD caching is enabled by default for all deployments.

### How is the PE (Plan Executor) fleet shared? What fault tolerance exists (how many nodes can be lost)?
LanceDB's plan executor is typically deployed with 2+ replicas for fault tolerance: 

- Mirrored Caches: Each query replica maintains synchronized copies of data subsets, 
  enabling low-latency query execution.
- Load Balancing: Traffic is distributed evenly across replicas.

With a single replica failure, there is no downtime - the system remains 
operational with degraded performance, as the remaining 
replicas will handle all the traffic until the failed replica comes back online.

## Consistency

### How is strong/weak consistency configured in the enterprise stack?
By default, LanceDB Enterprise operates in strong consistency mode. 
Once a write is successfully acknowledged, a new Lance dataset version manifest 
file is created. Subsequent reads always load the latest manifest file to 
ensure the most up-to-date data.

However, this increases query latency and can place significant load on the storage system 
under high concurrency. We offer the following parameter to adjust consistency level: 

- `weak_read_consistency_interval_seconds` (default: 0) – Defines the interval 
  (in seconds) at which the system checks for table updates from other processes.

Recommended Setting: 

To balance consistency and performance, setting `weak_read_consistency_interval_seconds` to 30–60 seconds is often a 
good trade-off. This reduces unnecessary cloud storage operations while still 
keeping data reasonably fresh for most applications.

{{< admonition >}}
This setting only affects read operations. Write operations always remain strongly consistent.
{{< /admonition >}}

## Indexing

### Can I use GPU for indexing?
Yes! Please contact the LanceDB team to enable GPU-based indexing for your deployment.
Then you just need to call `create_index`, and the backend will use GPU for indexing.
LanceDB is able to index a few billion vectors under 4 hours.

## Cluster Configuration

### What are the parameters that can be configured for my LanceDB cluster?
LanceDB Enterprise offers granular control over performance, resilience, and 
operational behavior through a comprehensive set of parameters: replication factors for
each component, consistency level, graceful shutdown time intervals, etc. Please 
contact the LanceDB team for detailed documentation on such parameter configurations.

## Monitoring and Alerts

### What are the metrics that LanceDB exposes for monitoring?
We have various metrics set up for monitoring each component in the LanceDB stack: 

- Query node: RPS, query latency, error codes, slow take count, CPU/memory utilization, etc. 
- Plan executor: SSD cache hit/miss, CPU/memory utilization, etc. 

Please contact the LanceDB team for the comprehensive list of monitoring metrics.

### How do I integrate LanceDB's monitoring metrics with my monitoring dashboard?
LanceDB uses Prometheus for metrics collection and OpenTelemetry (OTel) to export such
metrics with data enrichment. The LanceDB team will work with you to integrate the 
monitoring metrics with your preferred dashboard.

## Others

### How do I check the Lance version of my dataset?
Upgrade to a recent pylance version (v0.18.0+), then use _LanceDataset.data_storage_version_

```shell
>>> lance.dataset("my_dataset").data_storage_version
'2.0'
```