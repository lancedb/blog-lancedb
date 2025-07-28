---
title: LanceDB Cloud FAQ 
sidebar_title: "LanceDB Cloud"
description: Find answers to common questions about LanceDB Cloud. Includes setup, usage, pricing, and best practices for cloud-based vector database deployment.
weight: 2
---

This section provides answers to the most common questions asked about LanceDB Cloud. By following these guidelines, you can ensure a smooth, performant experience with LanceDB Cloud.

## Connection

### Should I reuse the database connection?
Yes! It is recommended to establish a single database connection and maintain 
it throughout your interaction with the tables within.

LanceDB uses HTTP connections to communicate with the servers. By reusing the Connection object, you avoid the overhead of repeatedly establishing HTTP connections, significantly improving efficiency.

### Should I reuse the `Table` object?
For optimal performance, `table = db.open_table()` should be called once and used for all subsequent table operations. 
If there are changes to the opened table, the table will always reflect the latest version of the data.

## Indexing

### What are the vector indexing types supported by LanceDB Cloud?
We support `IVF_PQ` and `IVF_HNSW_SQ` as the `index_type` which is passed to `create_index`. 
LanceDB Cloud tunes the indexing parameters automatically to achieve the best tradeoff 
between query latency and query quality.

### When should users call `create_index()`? Does creating an index too early cause unbalanced indices?
`create_index` is asynchronous. LanceDB, in the background, will determine when to 
trigger the index build job. When there are updates to the table data, we will optimize 
the existing indices accordingly so that query performance is not impacted.

### When I add new rows to a table, do I need to manually update the vector index?
No! LanceDB Cloud triggers an asynchronous background job to index the new vectors.
Even though indexing is asynchronous, your vectors will still be immediately searchable.
LanceDB uses brute-force search to search over unindexed rows. This makes your new data 
immediately available but may increase latency temporarily. 
To disable the brute-force part of search, set the `fast_search` flag in your query to `true`.

### Do I need to reindex the whole dataset if only a small portion of the data is deleted or updated?
No! Similar to adding data to the table, LanceDB Cloud triggers an asynchronous background 
job to update the existing indices. Therefore, no action is needed from users and newly updated 
data will be available for search immediately. There is absolutely no downtime expected.

### Do I need to recreate my full-text search (FTS)/scalar index if I updated the table data?
No! LanceDB will automatically optimize the FTS index for you. Meanwhile, newly updated
data will be available for search immediately. 

This applies to scalar indices as well.

### How do I know whether an index has been created?
While LanceDB Cloud indexes are typically created quickly, best practices differ 
between index types:

- **Full-Text Search (FTS) and Scalar Indexes**
  Queries executed immediately after `create_fts_index` or `create_scalar_index` calls 
  may fail if the background indexing process hasn't completed. 
  Wait for index confirmation before querying.

- **Vector Indexes**
  Queries after `create_index` will not generate errors, 
  but may experience degraded performance during ongoing index optimization. 
  For consistent performance, wait until indexing finishes.

It's recommended to use `list_indices` to verify index creation before querying. As an alternative, you can check the table details 
in the UI, where the existing indices will be displayed.

### How to find out number of unindexed rows?
You can call `index_stats` with the index name to check the number of
indexed and unindexed rows.

### Which indices should be enabled on filter columns? What's the impact of not indexing?
It is strongly recommended to create scalar indices on the filter columns. Scalar indices
will reduce the amount of data that needs to be scanned and thus speed up the filter.
LanceDB supports `BITMAP`, `BTREE`, and `LABEL_LIST` as our scalar index types. You 
can see more details [here](/core/index#scalar-index).

### Does LanceDB always recreate the full index or incrementally update existing centroids?
LanceDB implements an optimization algorithm to decide whether a delta index will be 
appended versus a full retrain on the index is needed.

## Query

### Can LanceDB support vector search combined with metadata filtering?
Yes! LanceDB supports blazing-fast vector search with metadata filtering. Both
prefiltering (default) and postfiltering are supported. 
We have seen **30ms** as the p50 latency for a dataset size of 15 million. 
You can see [here](/core/filtering) for more details.

### What should I do if I need to search for rows by `id`?
LanceDB Cloud currently does not support an ID or primary key column. You are recommended to add a user-defined ID column. To significantly improve the query performance with SQL clauses, a scalar BITMAP/BTREE index should be created on this column.

### Why is my query latency higher than expected?
Multiple factors can impact query latency. To reduce query latency, consider the 
following: 

- Send pre-warm queries: Send a few queries to warm up the cache before 
  an actual user query. 
- Check network latency: LanceDB Cloud is hosted in AWS us-east-1 region. 
  It is recommended to run queries from an EC2 instance that is in the same region. 
- Create scalar indices: If you are filtering on metadata, it is recommended to 
  create scalar indices on those columns. This will speed up searches with metadata filtering. 
  See [here](/core/index#scalar-index) for more details on creating a scalar index.

### Will I always query the latest data?
- For LanceDB Cloud users, yes, strong consistency is guaranteed. 
- For LanceDB Enterprise users, strong consistency is set by default. However, you can 
  change the `weak_read_consistency_interval_seconds` parameter on the query node to trade off
  between read consistency and query performance.

### How does `fast_search` work?
If you do not need to query from the unindexed data, you can call `fast_search` to 
make queries faster, with the unindexed data excluded.