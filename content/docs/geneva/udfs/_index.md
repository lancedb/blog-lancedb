---
title: User-Defined Functions
sidebar_title: Using UDFs
weight: 2
---

## Converting functions into UDFs

Converting your Python code to a Geneva UDF is simple.  There are three kinds of UDFs that you can provide — scalar UDFs, batched UDFs and stateful UDFs.

In all cases, Geneva uses Python type hints from your functions to infer the input and output
[arrow data types](https://arrow.apache.org/docs/python/api/datatypes.html) that LanceDB uses.

### Scalar UDFs

The **simplest** form is a scalar UDF, which processes one row at a time:

```python
from geneva import udf

@udf
def area_udf(x: int, y: int) -> int:
    return x * y

@udf
def download_udf(filename:str) -> bytes:
    import requests
    resp = requests.get(filename)
    res.raise_for_status()
    return resp.content

```

This UDF will take the value of x and value of y from each row and return the product.  The `@udf` wrapper is all that is needed.

### Batched UDFs

For **better performance**, you can also define batch UDFs that process multiple rows at once.

You can use `pyarrow.Array`s:

```python
import pyarrow as pa
from geneva import udf

@udf(data_type=pa.int32())
def batch_filename_len(filename: pa.Array) -> pa.Array:
    lengths = [len(str(f)) for f in filename]
    return pa.array(lengths, type=pa.int32())
```

Or take entire rows using `pyarrow.RecordBatch`:

```python
import pyarrow as pa
from geneva import udf

@udf(data_type=pa.int32())
def recordbatch_filename_len(batch: pa.RecordBatch) -> pa.Array:
    filenames = batch["filename"] 
    lengths = [len(str(f)) for f in filenames]
    return pa.array(lengths, type=pa.int32())
```

> **Note**:  Batch UDFS require you to specify `data_type` in the ``@udf`` decorator for batched UDFs which defines `pyarrow.DataType` of the returned `pyarrow.Array`.


### Stateful UDFs

You can also define a **stateful** UDF that retains its state across calls.

This can be used to share code and **parameterize your UDFs**.  In the example below, the model being used is a parameter that can be specified at UDF registration time.  It can also be used to paramterize input column names of `pa.RecordBatch` batch UDFS.

This also can be used to **optimize expensive initialization** that may require heavy resource on the distributed workers.  For example, this can be used to load an model to the GPU once for all records sent to a worker instead of once per record or per batch of records.

A stateful UDF is a `Callable` class, with `__call__()` method.  The call method can be a scalar function or a batched function.

```python
from typing import Callable
from openai import OpenAI

@udf(data_type=pa.list_(pa.float32(), 1536))
class OpenAIEmbedding(Callable):
    def __init__(self, model: str = "text-embedding-3-small"):
        self.model = model
        # Per-worker openai client
        self.client: OpenAI | None = None

    def __call__(self, text: str) -> pa.Array:
        if self.client is None:
            self.client = OpenAI()

        resp = self.client.embeddings.create(model=self.model, input=text)
        return pa.array(resp.data[0].embeddings)
```

> **Note**:  The state is will be independently managed on each distributed Worker.

## UDF options

The `udf` can have extra annotations that specify resource requirements and operational characteristics.
These are just add parameters to the `udf(...)`.

### Resources requirements for UDFs

Some workers may require specific resources such as gpus, cpus and certain amounts of RAM.

You can provide these requirements by adding `num_cpus`, `num_gpus`, and `memory` parameters to the UDF.

```python
@udf(..., num_cpus=1, num_gpus=0.5, memory = 4 * 1024**3) # require 1 CPU, 0.5 GPU, and 4GiB RAM
def func(...):
    ...
```

### Operational parameters for UDFs

UDFs can be quite varied -- some can be simple operations where thousands of calls can be completed per second, while others may be slow and require 30s per row.

In LanceDB, the default number of rows per fragment is 1024 * 1024 rows.  Conside a captioning UDF that takes 30s per row.   It could take a year (!) before any results show up! (e.g. 30s/row * 1024*1024 rows/fragment => 30M s/fragment => 8.3k hours/fragment -> 347 days/fragment).  To enable these to be parallelized, we provide a `batch_size` setting so the work can be split between workers and so that that partial results are checkpointed more frequently to enable finer-grained progress and job recovery.

By default `batch_size` is 100 computed rows per checkpoint.  So for an expensive captioning UDF that can take 30s per row, you may get a checkpoint every 3000s (50mins).  With 100 gpus, our job could finish in 3.5 days!  For cheap operations that can compute 100 rows per second you'd potentially be checkpointing every second.  Tuning this can help you see progress more frequently.

## Registering Features with UDFs

Registering a feature is done by providing the `Table.add_columns()` function a new column name and the Geneva UDF.

Let's start by obtaining the table `tbl`
```python
import geneva
import numpy as np
import pyarrow as pa

lancedb_uri="gs://bucket/db"
db = geneva.connect(lancedb_uri)

# Define schema for the video table
schema = pa.schema([
    ("filename", pa.string()),
    ("duration_sec", pa.float32()),
    ("x", pa.int32()),
    ("y", pa.int32()),
])
tbl = db.create_table("videos", schema=schema, mode="overwrite")

# Generate fake data
N = 10
data = {
    "filename": [f"video_{i}.mp4" for i in range(N)],
    "duration_sec": np.random.uniform(10, 300, size=N).astype(np.float32),
    "x": np.random.choice([640, 1280, 1920], size=N),
    "y": np.random.choice([360, 720, 1080], size=N),
    "caption": [f"this is video {i}" for i in range(N)]
}

# Convert to Arrow Table and add to LanceDB
batch = pa.table(data, schema=schema)
tbl.add(batch)
```

Here's how to register a simple UDF:
```python
@udf
def area_udf(x: int, y: int) -> int:
    return x * y

@udf
def download_udf(filename: str) -> bytes:
    ...

# {'new column name': <udf>, ...}
# simple_udf's arguments are `x` and `y` so the input columns are
# inferred to be columns `x` amd `y`
tbl.add_columns({"area": area_udf, "content": download_udf })
```

Batched UDFs require return type in their `udf` annotations

```python
@udf(data_type=pa.int32())
def batch_filename_len(filename: pa.Array) -> pa.Array:
    ...

# {'new column name': <udf>}
# batch_filename_len's input, `filename` input column is
# specified by the UDF's argument name.
tbl.add_columns({"filename_len": batch_filename_len})
```

or

```python
@udf(data_type=pa.int32())
def recordbatch_filename_len(batch: pa.RecordBatch) -> pa.Array:
    ...

# {'new column name': <udf>}
# batch_filename_len's input.  pa.RecordBatch typed UDF
# argument pulls in all the column values for each row.
tbl.add_columns({"filename_len": recordbatch_filename_len})
```

Similarly, a stateful UDF is registered by providing an instance of the Callable object.  The call method may be a per-record function or a batch function.
```python
@udf(data_type=pa.list_(pa.float32(), 1536))
class OpenAIEmbedding(Callable):
    ...
    def __call__(self, text: str) -> pa.Array:
        ...

# OpenAIEmbedding's call method input is inferred to be 'text' of
# type string from the __call__'s arguments, and its output type is
# a fixed size list of float32.
tbl.add_columns({"embedding": OpenAIEmbedding()})
```

## Changing data in computed columns

Let's say you backfilled data with your UDF then you noticed that your data has some issues.  Here are a few scenarios:

1. All the values are incorrect due to a bug in the UDF.
2. Most values are correct but some values are incorrect due to a failure in UDF execution.
3. Values calculated correctly and you want to perform a second pass to fixup some of the values.

In scenario 1, you'll most likely want to replaced the UDF with a new version and recalulate all the values.  You should perform a `alter_table` and then `backfill`.

In scenario 2, you'll most likely want to re-execute `backfill` to fill in the values.  If the error is in your code (certain cases not handled), you can modify the UDF, and perform an `alter_table`, and then `backfill` with some filters.

In scenario 3, you have a few options. A) You could `alter` your UDF and include the fixup operations in the UDF.  You'd `alter_table` and then `backfill` recalculating all the values.  B) You could have a chain of computed columns -- create a new column, calculate the "fixed" up values and have your application use the new column or a combination of the original column.  This is similar to A but does not recalulate A and can incur more storage.   C) You could `update` the values in the the column with the fixed up values.  This may be expedient but also sacrifices reproducability.

The next section shows you how to change your column definition by `alter`ing the UDF.

## Altering UDFs


You now want to revise the code.  To make the change, you'd update the UDF used to compute the column using the `alter_columns` API and the updated function.  The example below replaces the definition of column `area` to use the `area_udf_v2` function.

```python
table.alter_columns({"path": "area", "udf": area_udf_v2} )
```

After making this change, the existing data already in the table does not change.   However,  when you perform your next basic `backfill` operation,  all values would be recalculated and updated.  If you only wanted some rows updated , you could perform a filtered backfill, targeting the specific rows that need the new upates.   

For example, this filter would only update the rows where area was currently null. 
```python
table.backfill("area", where="area is null")
```

Reference:
* [`alter_columns` API](https://lancedb.github.io/geneva/api/table/#geneva.table.Table.alter_columns)