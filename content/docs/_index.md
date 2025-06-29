---
title: "Documentation"
description: "Welcome to LanceDB documentation"
weight: 1
---

# Welcome to LanceDB Documentation

LanceDB is an open-source database for vector search and AI applications. This documentation will help you get started with LanceDB and learn how to use it effectively.

## Quick Start

Get up and running with LanceDB in minutes:

```python
import lancedb
import pandas as pd

# Create a database
db = lancedb.connect("./data")

# Create a table
table = db.create_table("my_table", data=pd.DataFrame({
    "id": [1, 2, 3],
    "vector": [[1.1, 1.2], [2.1, 2.2], [3.1, 3.2]]
}))

# Search for similar vectors
results = table.search([1.0, 1.0]).limit(2).to_df()
```

## What's Next?

- [Getting Started](/docs/getting-started/) - Complete setup guide
- [API Reference](/docs/api-reference/) - Detailed API documentation
- [Tutorials](/docs/tutorials/) - Step-by-step tutorials 