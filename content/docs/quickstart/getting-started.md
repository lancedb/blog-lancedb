---
title: "Getting Started"
description: "Learn how to install and set up LanceDB"
weight: 2
---

# Getting Started with LanceDB

This guide will help you install LanceDB and create your first vector database.

## Installation

### Python

Install LanceDB using pip:

```bash
pip install lancedb
```

### Rust

If you prefer to use the Rust API:

```bash
cargo add lancedb
```

## Quick Start

### 1. Create a Database

```python
import lancedb

# Connect to a database (creates it if it doesn't exist)
db = lancedb.connect("./data")
```

### 2. Create a Table

```python
import pandas as pd

# Sample data with vectors
data = pd.DataFrame({
    "id": [1, 2, 3, 4, 5],
    "text": ["hello world", "goodbye world", "hello there", "goodbye there", "hello again"],
    "vector": [
        [1.1, 1.2, 1.3],
        [2.1, 2.2, 2.3],
        [1.2, 1.3, 1.4],
        [2.2, 2.3, 2.4],
        [1.3, 1.4, 1.5]
    ]
})

# Create the table
table = db.create_table("documents", data=data)
```

### 3. Search for Similar Vectors

```python
# Search for vectors similar to [1.0, 1.0, 1.0]
results = table.search([1.0, 1.0, 1.0]).limit(3).to_df()
print(results)
```

## Next Steps

- Learn more about [table operations](/docs/api-reference/#tables)
- Explore [vector search options](/docs/api-reference/#search)
- Check out our [tutorials](/docs/tutorials/) for real-world examples 