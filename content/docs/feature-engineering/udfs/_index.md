---
title: User-Defined Functions
sidebar_title: Using UDFs
weight: 2
---

## Converting functions into UDFs

Converting your Python code to a Geneva UDF is simple. There are three kinds of UDFs that you can provide — scalar UDFs, batched UDFs and stateful UDFs.

In all cases, Geneva uses Python type hints from your functions to infer the input and output arrow data types that LanceDB uses.

## Scalar UDFs

The simplest form is a scalar UDF, which processes one row at a time:

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