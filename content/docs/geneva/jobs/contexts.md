---
title: Execution Contexts
sidebar_title: Contexts
description: Learn how Geneva automatically packages and deploys your Python execution environment to worker nodes for distributed execution.
weight: 3
---

Geneva automatically packages and deploys your Python execution environment to its worker nodes. This ensures that distributed execution occurs in the same environment and dependencies as your prototype.

We currently support one processing backend: **Ray**. Geneva jobs can be deployed on a Kubernetes cluster on demand or on an existing Ray cluster.

> **Note**: If you are using a remote Ray cluster, you will need to have the notebook or script that code is packaged on running the same CPU architecture / OS. By default, Ray clusters are run in Linux. If you host a Jupyter service on a Mac, Geneva will attempt to deploy Mac shared libraries to a Linux cluster and result in Module not found errors. You can instead use a hosted Jupyter notebook, or host your Jupyter or Python environment on a Linux VM or container.

## Ray Auto Connect

To execute jobs without an external Ray cluster, you can just trigger the `Table.backfill` method. This will auto-create a local Ray cluster and is only suitable for prototyping on small datasets.

```python
tbl.backfill("area")
```

Then, add column 'filename_len' and trigger the job:

```python
tbl.backfill("filename_len")  # trigger the job
```

## Existing Ray Cluster

Geneva can execute jobs against an existing Ray cluster. You can define a RayCluster by specifying the address of the cluster and packages needed on your workers.

This approach makes it easy to tailor resource requirements to your particular UDFs.

You can then wrap your table backfill call with the RayCluster context.

```python
from geneva.config import override_config, from_kv
from geneva.runners.ray.raycluster import _HeadGroupSpec, _WorkerGroupSpec
from geneva.runners.ray._mgr import ray_cluster

# this path should be a shared path that distributed workers can reach
override_config(from_kv({"uploader.upload_dir": images_path + "/zips"}))

with ray_cluster(
        addr = "ray-head:10001"  # replace ray head with the address of your ray head node
        skip_site_packages=False, # optionally skip shipping python site packages if already in image
        use_portforwarding=False,  # Must be False when byo ray cluster
        pip=[], # list of pip package or urls to install on each image.
    ):

    tbl.backfill("xy_product")
```

> **Note**: If your Ray cluster is managed by KubeRay, you'll need to setup kubectl port forwarding setup so Geneva can connect.

For more interactive usage, you can use this pattern:

```python
# this is a k8s pod spec.
raycluster = ray_cluster(...)
raycluster.__enter__() # equivalent of ray.init()

#  trigger the backfill on column "filename_len" 
tbl.backfill("filename_len") 

raycluster.__exit__(None, None, None)
```

## Ray on Kubernetes

Geneva uses KubeRay to deploy Ray on Kubernetes. You can define a RayCluster by specifying the pod name, the Kubernetes namespace, credentials to use for deploying Ray, and characteristics of your workers.

This approach makes it easy to tailor resource requirements to your particular UDFs.

You can then wrap your table backfill call with the RayCluster context.

```python
from geneva.runners.ray.raycluster import _HeadGroupSpec, _WorkerGroupSpec
from geneva.runners._mgr import ray_cluster

override_config(from_kv({"uploader.upload_dir": images_path + "/zips"}))

with ray_cluster(
        name=k8s_name,  # prefix of your k8s pod
        namespace=k8s_namespace,
        skip_site_packages=False, # optionally skip shipping python site packages if already in image
        use_portforwarding=True,  # required for kuberay to expose ray ports
        head_group=_HeadGroupSpec(
            service_account="geneva-integ-test", # k8s service account bound geneva runs as
            image="rayproject/ray:latest-py312" # optionally specified custom docker image
            num_cpus=8,
            node_selector={"geneva.lancedb.com/ray-head":""}, # k8s label required for head
        ),
        worker_groups=[
            _WorkerGroupSpec(  # specification per worker for cpu-only nodes
                name="cpu",
                num_cpus=60,
                memory="120G",
                service_account="geneva-integ-test",
                image="rayproject/ray:latest-py312"
                node_selector={"geneva.lancedb.com/ray-worker-cpu":""}, # k8s label for cpu worker
            ),
            _WorkerGroupSpec( # specification per worker for gpu nodes
                name="gpu",
                num_cpus=8,
                memory="32G",
                num_gpus=1,
                service_account="geneva-integ-test",
                image="rayproject/ray:latest-py312-gpu"
                node_selector={"geneva.lancedb.com/ray-worker-gpu":""}, # k8s label for gpu worker
            ),
        ],
    ):

    tbl.backfill("xy_product")
```

For more interactive usage, you can use this pattern:

```python
# this is a k8s pod spec.
raycluster = ray_cluster(...)
raycluster.__enter__() # equivalent of ray.init()

#  trigger the backfill on column "filename_len" 
tbl.backfill("filename_len") 

raycluster.__exit__()
```

## Persistent Contexts

Geneva Execution Contexts can be reused and shared with team members using persistent Clusters and Manifests.

### Define a Cluster

A Geneva Cluster represents the compute resources used for distributed execution. Calling `define_cluster()` stores the Cluster metadata in persistent storage. The Cluster can then be referenced by name amd provisioned when creating an Execution Context.
```python
import sys
from geneva.cluster import GenevaClusterType, K8sConfigMethod
from geneva.runners.ray.raycluster import (
    get_ray_image,
)
from geneva.cluster.mgr import (
    GenevaCluster,
    HeadGroupConfig,
    KubeRayConfig,
    WorkerGroupConfig,
)

db = geneva.connect(my_db_uri)

cluster_name = "kuberay-gpu-small"
img = get_ray_image(
    ray.__version__, f"{sys.version_info.major}{sys.version_info.minor}"
)
db.define_cluster(cluster_name, GenevaCluster(
    name=cluster_name,
    cluster_type=GenevaClusterType.KUBE_RAY,
    kuberay=KubeRayConfig(
        namespace="geneva",
        head_group=HeadGroupConfig(
            image=img,
            service_account="geneva-service-account",
            num_cpus=2,
            memory="4Gi",
            node_selector={"geneva.lancedb.com/ray-head": "true"},
            labels={},
            tolerations=[],
            num_gpus=0,
        ),
        worker_groups=[
            WorkerGroupConfig(
                image=img,
                service_account="geneva-service-account",
                num_cpus=2,
                memory="4Gi",
                node_selector={"geneva.lancedb.com/ray-worker-gpu": "true"},
                labels={},
                tolerations=[],
                num_gpus=2,
            ),
        ],
    ),
))
```

### Define a Manifest

A Geneva Manifest represents the files and dependencies
used in the execution environment. Calling `define_manifest()` packages files in the local environment and stores the Manifest metadata and files in persistent storage.
The Manifest can then be referenced by name when creating an Execution Context. Persistent Manifests allow for deterministic execution environments that can be shared and reused.

```python
from geneva.manifest.mgr import GenevaManifest

db = geneva.connect(my_db_uri)

manifest_name="dev-manifest"
db.define_manifest(
    manifest_name,
    GenevaManifest(
        manifest_name,
        local_zip_output_dir="/tmp/zips",
        pip=["lancedb", "numpy"],
        py_modules=["my_module"],
    ),
)
```

### Create an Execution Context

An Execution Context represents the concrete execution environment used to execute a distributed Job.

Calling `context` will enter a contxt manager that will provision an execution cluster and execute the Job using the Cluster and Manifest definitions provided. Once completed, the context manager will automatically de-provision the cluster.

```python
db = geneva.connect(my_db_uri)
tbl = db.get_table("my_table")

with db.context(cluster=cluster_name, manifest=manifest_name):
    tbl.backfill("embedding", where="content is not null")
```