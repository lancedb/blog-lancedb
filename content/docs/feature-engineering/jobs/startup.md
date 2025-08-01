---
title: Job and Session Startup Optimizations
sidebar_title: Startup Optimizations
description: Learn how to optimize Geneva job and session startup times for faster interactive development and production workflows.
weight: 2
---

During interactive sessions, there are two main actions where you would interact with Geneva:

- **Compute cluster creation**
- **Job execution**

Behind the scenes, Geneva packages your Python environment and auto-provisions nodes to execute the jobs. This can be time consuming, taking on the order of 5 minutes to complete before any work is done. The following sections will describe what happens in these steps and how to diagnose and speed up these interactions.

## Compute Cluster Creation

To execute a Geneva job, you'll need to initialize a compute environment. Here's the basic steps Geneva takes to instantiate that cluster:

1. User requests a cluster
2. Scan workspace's Python path for modules
    - Generate local workspace directory zip
    - Generate Python site-packages directory zip(s)
    - Generate other dirs zip (may include your `.venv`)
6. Upload zips
7. Provision head node
    - Initialize head node

The requests to create an environment can take 5-10 minutes to initiate. The most time-consuming steps are generating directory zips and uploading them. AI workloads often require many module packages and can be dependent on specific versions to work. Common modules required for GPU use to run model inference can easily be 5GB-10GB of compressed content. On GCE for example, this can take ~5 minutes to zip all this and ~1 minute to upload all of this data.

### Optimization Strategies

To speed this up, Geneva employs caching to help optimize the startup time. There are a few things you can do to make subsequent runs faster, often times <1 minute:

#### 1. Hashing and Caching

Geneva generates a hash of each path in the Python path that takes into account files and their last modified time. After the first time a directory zip is created and uploaded, the cached copy is used and no new zip is generated or uploaded. However, if there are any changes (e.g. new module added or upgraded) a new hash is created and the environment's content is zipped and uploaded.

#### 2. Isolate Dynamic Code and Modules

If you use a Jupyter notebook environment for your driver, the content of the `.ipynb` file is constantly changing. This means the hash for the directory that contains the notebook will change, even if the subdirectories do not. If your notebook is in your home directory, this could pull in large amounts of unneeded code and data.

**Solution**: Move your notebook into a subdirectory with no children. When your notebook is executed it is updated but only the notebook content is resent. Other path directories are unchanged, have the same hash and can skip zip and ship.

#### 3. Package Dependencies into a Docker Image

Geneva has an option to skip the zip and ship of the site-packages. Enabling this assumes that the default Docker image is overridden with a custom image that has the site-package content preloaded.

#### 4. Pre-provision Nodes and Pods

In your Kubernetes configuration, you can tag specific nodes with `geneva.lancedb.com/ray-head` k8s label. These nodes should be configured to be on non-spot instances that are always up. This makes initial KubeRay cluster creation quick.

## Job Execution

A backfill or materialized view job triggers the provisioning of worker nodes that will perform the computations and writes. A cold start can be slow because several steps must take place before the UDFs can be applied. However, once nodes and pods are warmed up, the time between submission and execution can be quick.

Here's the basic steps Geneva takes to kick off a Geneva job:

1. User submits job (backfill)
2. Plan scans
3. Provision worker nodes (VMs)
4. Load VM
5. Autoscale worker nodes
6. Provision worker nodes (VMs)
7. Load VM
8. Schedule Ray actors
9. Download Docker images
10. Download zips
11. Execute UDF
12. Orchestrate fragment write

In practice, planning the initial distributed step scans require loading VM and pod images. With a cold start, this can take ~5 minutes.

### Pre-warming Strategies

Here are some steps you can take to pre-warming worker nodes and pods so that execution can be more interactive:

#### 1. Set Worker Spec's Replicas

Set `replicas` or `min_replicas` to a value > 0. When the KubeRay cluster is instantiated this also pre-provision VMs so they are ready for k8s to place pods.

- `replicas` (for initial # of worker nodes)
- `minWorkers` (to keep a pool of nodes always up)

#### 2. Make a Warmup Call

Making an initial request to Ray will load the pod and zips content to the worker node so that subsequent startups will be fast.

#### 3. Prevent Nodes from Auto-scaling Down

During cluster creation, you can specify `idle_timeout_seconds` option -- this is the amount of time before a node needs to be idle before it is considered for de-provisioning.

## Performance Monitoring

Monitor your startup times using Geneva's built-in metrics:

```python
# Check cluster creation time
cluster_metrics = geneva.get_cluster_metrics()
print(f"Cluster creation time: {cluster_metrics['creation_time']}s")

# Check job startup time
job_metrics = geneva.get_job_metrics()
print(f"Job startup time: {job_metrics['startup_time']}s")
```

## Best Practices

1. **Use dedicated development clusters** for interactive work
2. **Pre-warm production clusters** during off-peak hours
3. **Cache frequently used dependencies** in custom Docker images
4. **Monitor startup times** and optimize based on usage patterns
5. **Use spot instances** for cost optimization while maintaining performance