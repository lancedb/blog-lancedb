---
title: Geneva Jobs
sidebar_title: Job Execution
description: Learn about Geneva's job execution framework for distributed feature engineering workflows.
weight: 3
---

Geneva provides a comprehensive job execution framework for distributed feature engineering workflows. This section covers the different types of jobs and execution contexts available in Geneva.

## Job Types

### [Backfilling](/docs/geneva/jobs/backfilling/)
Trigger distributed jobs to populate column values in your LanceDB table using UDFs. Learn about filtered backfills and incremental updates.

### [Materialized Views](/docs/geneva/jobs/materialized-views/)
Create declarative materialized views to manage batch updates of expensive operations. Optimize data layouts for training and simplify orchestration.

### [Startup Optimizations](/docs/geneva/jobs/startup/)
Optimize job and session startup times for faster interactive development and production workflows. Learn about caching, pre-warming, and performance tuning.

## Execution Contexts

### [Execution Contexts](/docs/geneva/jobs/contexts/)
Understand how Geneva automatically packages and deploys your Python execution environment to worker nodes for distributed execution using Ray.

## Key Features

- **Distributed Processing**: Scale feature computation across multiple nodes
- **Checkpointing**: Resume jobs from failures without losing progress
- **Incremental Updates**: Only process new or modified data
- **Multiple Backends**: Support for Ray on Kubernetes and standalone clusters
- **Environment Management**: Automatic dependency packaging and deployment

## Getting Started

1. **Choose your execution context** based on your infrastructure
2. **Define your UDFs** for feature computation
3. **Trigger backfill operations** to populate your data
4. **Monitor performance** and optimize based on usage patterns

For detailed information about each job type and execution context, explore the documentation in this section.
