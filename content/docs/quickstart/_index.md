---
title: "Getting Started with LanceDB"
sidebar_title: "Quickstart"
description: Get started with LanceDB, a modern vector database for AI applications. Learn how to install, connect, and perform basic operations with our Python SDK for Cloud.
keywords: LanceDB quickstart, vector database tutorial, AI database setup, semantic search database, vector similarity search
weight: 2
---

This is a minimal tutorial for Python users on LanceDB Cloud. To run the notebook, [open in Colab](https://colab.research.google.com/github/lancedb/vectordb-recipes/blob/main/examples/saas_examples/python_notebook/LanceDB_Cloud_quickstart.ipynb).

## 1. Install LanceDB

LanceDB requires Python 3.8+ and can be installed via `pip`. The `pandas` package is optional but recommended for data manipulation.

```python
pip install lancedb pandas
```

## 2. Import Libraries

Import the libraries. LanceDB provides the core vector database functionality, while `pandas` helps with data handling.

```python
import lancedb
import pandas as pd
```

## 3. Connect to LanceDB Cloud

LanceDB Cloud provides managed infrastructure, security, and automatic backups. The connection `uri` determines where your data is stored.

```python
db = lancedb.connect(
    uri="db://your-project-slug",
    api_key="your-api-key",
    region="us-east-1"
)
```

## 4. Add Data

Create a `pandas` DataFrame with your data. Each row must contain a vector field (list of floats) and can include additional metadata.

```python
data = pd.DataFrame([
    {"id": "1", "vector": [0.9, 0.4, 0.8], "text": "knight"},    
    {"id": "2", "vector": [0.8, 0.5, 0.3], "text": "ranger"},  
    {"id": "3", "vector": [0.5, 0.9, 0.6], "text": "cleric"},    
    {"id": "4", "vector": [0.3, 0.8, 0.7], "text": "rogue"},     
    {"id": "5", "vector": [0.2, 1.0, 0.5], "text": "thief"},     
])
```

## 5. Create a Table

Create a table in the database. The table takes on the schema of your ingested data.

```python
table = db.create_table("adventurers", data)
```

Now, go to LanceDB Cloud and verify that your remote table has been created:

![Quickstart Table](/assets/docs/quickstart/quickstart-table.png)


## 6. Vector Search

Perform a vector similarity search. The query vector should have the same dimensionality as your data vectors. The search returns the most similar vectors based on **euclidean distance**.

Our query is "warrior", represented by a vector `[0.8, 0.3, 0.8]`. Let's find the most similar adventurer:

```python
query_vector = [0.8, 0.3, 0.8] # warrior 
results = table.search(query_vector).limit(3).to_pandas()
print(results)
```

## 7. Results

The results show the most similar vectors to your query, sorted by similarity score (distance). Lower distance means higher similarity.

```python
| id | vector          | text    | distance  |
|----|-----------------|---------|-----------|
| 1  | [0.9, 0.4, 0.8] | knight  | 0.02      |
| 2  | [0.8, 0.5, 0.3] | ranger  | 0.29      |
| 3  | [0.5, 0.9, 0.6] | cleric  | 0.49      |
```

Looks like the knight is the most similar to the warrior. Not exactly a real-life scenario - but you can see how vector search works in five steps.

Let's actually vectorize the word "warrior" with an embedding model and run a search over the same table, but embedded using a simple model `like sentence-transformers`.

Check out the next [tutorial on using the Embedding API](../quickstart/embedding). 
