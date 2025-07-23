---
title: "API Reference"
description: "Complete API documentation for LanceDB"
weight: 3
---

# API Reference

This page provides detailed documentation for the LanceDB Python API.

## Database Operations

### Connecting to a Database

```python
import lancedb

# Connect to a local database
db = lancedb.connect("./data")

# Connect to a remote database
db = lancedb.connect("s3://my-bucket/lancedb")
```

### Listing Tables

```python
# List all tables in the database
tables = db.table_names()
print(tables)
```

### Opening Tables

```python
# Open an existing table
table = db.open_table("my_table")
```

## Table Operations

### Creating Tables

```python
import pandas as pd

# Create table from DataFrame
data = pd.DataFrame({
    "id": [1, 2, 3],
    "vector": [[1.1, 1.2], [2.1, 2.2], [3.1, 3.2]]
})
table = db.create_table("my_table", data=data)
```

### Inserting Data

```python
# Insert new rows
new_data = pd.DataFrame({
    "id": [4, 5],
    "vector": [[4.1, 4.2], [5.1, 5.2]]
})
table.add(new_data)
```

### Querying Data

```python
# Basic query
results = table.search([1.0, 1.0]).limit(5).to_df()

# Query with filters
results = table.search([1.0, 1.0]).where("id > 2").limit(3).to_df()
```

## Search Operations

### Vector Search

```python
# Basic vector search
results = table.search([1.0, 1.0]).limit(10).to_df()

# Search with metric
results = table.search([1.0, 1.0], metric="cosine").limit(10).to_df()
```

### Hybrid Search

```python
# Combine vector search with text search
results = table.search([1.0, 1.0]).where("text LIKE '%hello%'").limit(5).to_df()
```

## Advanced Features

### Indexing

```python
# Create an index for faster search
table.create_index("vector", index_type="ivf_pq")
```

### Schema Management

```python
# Get table schema
schema = table.schema
print(schema)
```

For more detailed examples, see our [tutorials](/docs/tutorials/). 