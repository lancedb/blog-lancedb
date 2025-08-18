---
title: "Geneva: Feature Engineering with LanceDB"
sidebar_title: Feature Engineering
description: Learn how to transform raw data into meaningful features for AI models using LanceDB's feature engineering capabilities. Scale your feature engineering workflows with distributed processing and UDFs.
weight: 107
---
{{< admonition "note" "LanceDB Enterprise" >}}
Feature Engineering and the `geneva` package are fully supported as part of LanceDB Enterprise
{{< /admonition >}}

`geneva` improves the productivity of AI engineers by streamlining feature engineering tasks. It is designed to reduce the time required to prototype, perform experiments, scale up, and move to production.

`geneva` uses Python [User Defined Functions (UDFs)](/docs/geneva/udfs/) to define features as columns in a Lance dataset. Adding a feature is straightforward:

1. Prototype your Python function in your favorite environment.
2. Wrap the function with a small UDF decorator (see [UDFs](/docs/geneva/udfs/)).
3. Register the UDF as a virtual column using `Table.add_columns()`.
4. Trigger a `backfill` operation (see [Backfilling](/docs/geneva/jobs/backfilling/)).

{{< admonition "note" "No setup or config required" >}}
You can build your Python feature generator function in an IDE or a notebook using your project's Python versions and dependencies. `geneva` will automate much of the dependency and version management needed to move from prototype to scale and production.
{{< /admonition >}}

## Related Pages

- **Overview**: [What is Feature Engineering?](/docs/geneva/overview/)
- **UDFs**: [Using UDFs](/docs/geneva/udfs/) · [Blob helpers](/docs/geneva/udfs/blobs/)
- **Jobs**: [Execution contexts](/docs/geneva/jobs/contexts/) · [Startup optimizations](/docs/geneva/jobs/startup/) · [Materialized views](/docs/geneva/jobs/materialized-views/) · [Backfilling](/docs/geneva/jobs/backfilling/) · [Performance](/docs/geneva/jobs/performance/)
- **Deployment**: [Deployment overview](/docs/geneva/deployment/) · [KubeRay](/docs/geneva/deployment/kuberay/) · [Troubleshooting](/docs/geneva/deployment/troubleshooting/)