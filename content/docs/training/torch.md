---
title: "LanceDB PyTorch Integration"
sidebar_title: "PyTorch"
description: Learn how to use LanceDB with PyTorch for training and inference.
weight: 1
aliases: ["/docs/training/torch/", "/docs/training/torch"]
---

LanceDB provides a seamless integration with PyTorch for training and inference. This allows you to use LanceDB as a backend for your PyTorch models, and to use PyTorch for training and inference. You can use LanceDB to store your data, and PyTorch to train your models.

## Quick Start

The `Table` class in LanceDB implements contract for a PyTorch [Dataset](https://docs.pytorch.org/docs/stable/data.html#torch.utils.data.Dataset). This means you can simply use a LanceDB table in a PyTorch data loader directly.

```python
import lancedb
import torch
import pyarrow as pa

mem_db = lancedb.connect("memory://")
table = mem_db.create_table("test_table", pa.table({"a": range(1000)}))

# Any LanceDB table can be used as a PyTorch Dataset
dataloader = torch.utils.data.DataLoader(
    table, batch_size=1024, shuffle=True
)

for batch in dataloader:
    print(batch)
```

## Advanced Usage

Although the `Table` class implements the `torch.utils.data.Dataset` interface, most users will find that using
a table `Permutation` is more efficient for training.

## Selecting Columns

By default, the `Table` class will return all columns in the table when used as input to PyTorch. If you only need
a subset of columns, you can significantly reduce your I/O requirements by selecting only the columns you need.

```python
from lancedb.permutation import Permutation

permutation = Permutation.identity(table).select_columns(["id", "prompt"])
dataloader = torch.utils.data.DataLoader(
    permutation, batch_size=1024, shuffle=True
)

for batch in dataloader:
    print(batch.schema)
```
