---
title: "Tutorials"
description: "Step-by-step tutorials for common LanceDB use cases"
weight: 4
---

# Tutorials

Learn how to use LanceDB with practical, step-by-step tutorials.

## Building a Document Search System

This tutorial shows how to build a simple document search system using LanceDB and sentence transformers.

### Step 1: Install Dependencies

```bash
pip install lancedb sentence-transformers pandas
```

### Step 2: Prepare Your Documents

```python
import pandas as pd

# Sample documents
documents = [
    "LanceDB is an open-source database for vector search.",
    "Vector databases are essential for AI applications.",
    "Machine learning models often require vector similarity search.",
    "LanceDB provides fast and efficient vector operations.",
    "AI applications benefit from semantic search capabilities."
]

# Create DataFrame
df = pd.DataFrame({
    "id": range(len(documents)),
    "text": documents
})
```

### Step 3: Generate Embeddings

```python
from sentence_transformers import SentenceTransformer

# Load the embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Generate embeddings
embeddings = model.encode(documents)
df['vector'] = embeddings.tolist()
```

### Step 4: Create LanceDB Table

```python
import lancedb

# Connect to database
db = lancedb.connect("./documents_db")

# Create table
table = db.create_table("documents", data=df)
```

### Step 5: Search Documents

```python
# Search query
query = "What is LanceDB used for?"

# Generate query embedding
query_embedding = model.encode([query])[0]

# Search for similar documents
results = table.search(query_embedding).limit(3).to_df()
print(results[['text', '_distance']])
```

## Building a Recommendation System

This tutorial demonstrates how to build a simple recommendation system.

### Step 1: Create User and Item Data

```python
import numpy as np

# Generate sample user preferences
np.random.seed(42)
user_preferences = np.random.rand(100, 10)  # 100 users, 10 features

# Generate sample item features
item_features = np.random.rand(50, 10)  # 50 items, 10 features

# Create DataFrames
users_df = pd.DataFrame({
    "user_id": range(100),
    "preferences": user_preferences.tolist()
})

items_df = pd.DataFrame({
    "item_id": range(50),
    "features": item_features.tolist(),
    "name": [f"Item {i}" for i in range(50)]
})
```

### Step 2: Store in LanceDB

```python
# Create tables
users_table = db.create_table("users", data=users_df)
items_table = db.create_table("items", data=items_df)
```

### Step 3: Generate Recommendations

```python
def get_recommendations(user_id, num_recommendations=5):
    # Get user preferences
    user = users_table.search([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]).where(f"user_id = {user_id}").to_df()
    if user.empty:
        return []
    
    user_pref = user.iloc[0]['preferences']
    
    # Find similar items
    recommendations = items_table.search(user_pref).limit(num_recommendations).to_df()
    return recommendations[['item_id', 'name', '_distance']]

# Get recommendations for user 0
recs = get_recommendations(0)
print(recs)
```

## Next Steps

- Explore the [API Reference](/docs/api-reference/) for more advanced features
- Check out our [blog posts](/blog/) for real-world use cases
- Join our community for support and discussions 