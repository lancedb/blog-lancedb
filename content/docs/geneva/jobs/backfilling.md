---
title: Backfilling
sidebar_title: Backfilling
description: Learn how to trigger backfill operations to populate column values in your LanceDB table using Geneva's distributed framework.
weight: 1
---

## Triggering Backfill

Triggering backfill creates a distributed job to run the UDF and populate the column values in your LanceDB table. The Geneva framework simplifies several aspects of distributed execution.

**Checkpoints**: Each batch of UDF execution is checkpointed so that partial results are not lost in case of job failures. Jobs can resume and avoid most of the expense of having to recalculate values.

## Managing concurrency

One way to speed up the execution of a job to give it more resources and to have it work in parallel.  There are a few settings you can use on the backfill command to tune this.

* process-level `concurrency`
* thread-level `intra_applier_concurrency`

Process level concurrency can be set with the `concurrency` parameter.  This lets you specify the number of processes calculating values using the UDF.  The default is 8 and should be set to the number of GPUs you would like to dedicate to your job.  This can also be used based on CPU constraints.  So if you have 40 machines with 4 GPUs each, you could set ths value to 160.  If you set the value higher than the resources available, Geneva will try to schedule as much of the resources as it can (and potentially auto-scale to get more resources).

Thread level concurrency can be set with the `intra_applier_concurrency` parameter.  This lets you specify the number of threads in each process is calculating values using the UDF.  The default is 1.  If you have CPU heavy jobs this may be the best setting to tweak to get more utilization out of your systems. If you set the value higher than the resources available, Geneva will try to schedule as much of the resources as it can get.

The two settings can be used in combination.  So if your UDF requires 1 CPU and you set `concurrency` to 10 and `intra_applier_concurrency` to 5, you will potentially have 50 instances of the UDFs running in parallel.

```python
# backfill embeddings with 10 * 5 = 50 instances
tbl.backfill("embedding", concurrency=10, intra_applier_concurrency=5)
```

## Managing commit visibility

Feature engineering jobs at scale can take days to complete.  Two settings can help you present progress to other readers incrementally.

* Limit the number of rows processed with `num_frags`
* Perform intermediate commits with `commit_granularity`

The `num_frags` parameter lets you limit the number of fragments processed before the job is considered complete.  If you have a table with 1000 fragments, you could set `num_frags` to 1 to see how your UDF performs and if to validate the values generated.  You can then later run with a larger `num_frags` value or without the `num_frags` setting to complete the backfill.  Any fragments prevoiusly computed are not computed again.

```python
# only backfill 2 fragments so experiement can be done on the sample
tbl.backfill("embedding", num_frags=2)
```

The `commit_granularity` parameter lets you specify how many fragments need to be ready to commit before a intermediate commit occurs and makes partial results visible to other readers.  So for our example with a table of 1000 fragments, you can set `commit_granularity` to 10 to see progress updates every 10 fragments.

```python
# backfill all fragments and perform an intermediate commit every 10 fragments to expose incremental results.
tbl.backfill("embedding", commit_granularity=10)
```

## Filtered Backfills

Geneva allows you to specify SQL-style filters on the backfill operation. This lets you to apply backfills to a specified subset of the table's rows.

```python
# only backfill video content whose filenames start with 'a'
tbl.backfill("content", where="starts_with(filename, 'a')")
# only backfill embeddings of only those videos with content
tbl.backfill("embedding", where="content is not null")
```

Geneva also allows you to incrementally add more rows or have jobs that just update rows that were previously skipped.

If new rows are added, we can run the same command and the new rows that meet the criteria will be updated.

```python
# only backfill video content whose filenames start with 'a'
tbl.backfill("content", where="starts_with(filename, 'a')")
# only backfill embeddings of only those videos with content
tbl.backfill("embedding", where="content is not null")
```

Or, you can use filters to add in or overwrite content in rows previously backfilled.

```python
# only backfill video content whose filenames start with 'a' or 'b' but only if content not pulled previously
tbl.backfill("content", where="(starts_with(filename, 'a') or starts_with(filename, 'b')) and content is null")
# only backfill embeddings of only those videos with content and no prevoius embeddings
tbl.backfill("embedding", where="content is not null and embeddding is not null")
```

Reference:
* [`backfill` API](https://lancedb.github.io/geneva/api/table/#geneva.table.Table.backfill)
* [`backfill_async` API](https://lancedb.github.io/geneva/api/table/#geneva.table.Table.backfill_async)