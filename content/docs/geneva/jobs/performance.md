---
title: Distributed Job Performance
sidebar_title: Performance
description: Learn how to tune Geneva distributed job performance by scaling compute resources and balancing write bandwidth.
weight: 4
---

When Geneva runs in distributed mode, jobs are deployed against a kubernetes kuberay instance that dynamically provisions a Ray cluster.  Jobs execution time depends on suffcient cpu/gpu resources for *computation* and sufficient *write bandwidth* to store the output values.  Tuning the performance of a job boils down to configuring the table or cluster resources.

## Scaling computation resoures

Geneva jobs can split and schedule computational work into smalller batches that are assigned to *tasks* which are distributed across the cluster.  As each task completes, each writes its output into a checkpoint file.  If a job is interurupted or run again, Geneva will look to see if a checkpoint for the computation is already present and if not will kick off computations.  

Usually computation capacity is the bottleneck for job execution.  To complete all of a job's tasks more quickly, you just need to increase the amount of CPU/GPU resources available.

### GKE node pools

GKE + kuberay can autoscale the amount of VM nodes on demand.  Limitations on the amount of resources provisioned is configured via [nodepools](https://cloud.google.com/kubernetes-engine/docs/how-to/node-pools#scale-node-pool).  Node pools can be managed to scale vertically (type of machine) or horizontally (# of nodes)

Properly applying kubernetes labels to the nodepool machines allow you to control resources for different jobs in your cluster.


### Options on `Table.backfill(..)`

The `Table.backfill(..) ` method has several optional arguments to tune performance.  To saturate the CPUs in the cluster, the main arguments to change are `concurrency` which controls the number of task processes and `intra_applier_concurrency` which controls the number of task threads per task process.

`commit_granularity` controls how frequently fragments are committed so that partical results can be come visible to table readers.  

Setting `batch_size` smaller introduces finer-grained checkpoints and can help provide more frequent proof of life as a job is being executed.  This is useful if the computation on your data is expensive.

### `meth` geneva.table.Table.backfill

Backfills the specified column. Returns `job_id` string

```python
backfill(
    col_name,
    *,
    input_columns: list[str] | None = None,
    udf: UDF | None = None,
    where: str | None = None,
    concurrency: int = 8,
    intra_applier_concurrency: int = 1,
    refresh_status_secs: float = 2.0,
    **kwargs,
) -> str
```

#### Parameters

| Parameter | Description |
| :--- | :--- |
| col_name | col_name – Target column name to backfill |
| input_columns | input_columns (`list[str]` &#124; `None`, default: `None` ) – Optionally override columns used as sources for scalar `UDF` input arguments or `pa.Array` batch UDF arguments. Not valid for `pa.RecordBatch` UDFs. |
| udf | udf (`UDF` &#124; `None`, default: `None` ) – Optionally override the `UDF` used to backfill the column. |
| where | where (`str` &#124; `None`, default: `None` ) – SQL expression filter used select rows to apply backfills. |
| concurrency | concurrency (`int`, default: 8 ) – (default = 8) This controls the number of processes that tasks run concurrently. For max throughput, ideally this is larger than the number of nodes in the k8s cluster. This is the number of Ray actor processes are started. |
| intra_applier_concurrency | intra_applier_concurrency (`int`, default: 1 ) – (default = 1) This controls the number of threads used to execute tasks within a process. Multiplying this times concurrency roughly corresponds to the number of cpu's being used. |
| commit_granularity | commit_granularity – (default = 64) Show a partial result everytime this number of fragments are completed. If `None`, the entire result is committed at once. |
| read_version | read_version – (default = `None`) The version of the table to read from. If `None`, the latest version is used. |
| task_shuffle_diversity | task_shuffle_diversity – (default = 8) ?? |
| batch_size | batch_size – (default = 10240) The number of rows per batch when reading data from the table. If `None`, the default value is used. |


## Balancing write bandwidth

While computation can be broken down to small tasks, new Lance column data for each fragment must be written out in a serialized fashion.  Each fragment has a writer that waits for checkpointed results to arrive, sequences them, and then serially write out the new datafile.  

Writers can be a bottleneck if a lance dataset has a small number of fragments, espcially if the amount of data being written out is comparatively large.  Maximizing parallel write throughput can be achieved by having more fragments than nodes in the cluster. 

### Symptom: Computation tasks complete but writers seem to hang

Certain jobs that take a small data set and expand it may appear as if the writer has frozen.  

An example is table that contains a list of URLs pointing to large media files.  This list is relatively small (&lt; 100MB) and can fit into a single fragment.  A UDF that downloads will fetch all the data and then attempt to write all of it out through the single writer.  This single writer then can be responsible for serially writing out 500+GB of data to a single file!

To mitigate this, you can load your initial table so that there will be multipe fragments.  Each fragment with new outputs can be written in parallel with higher write throughput.