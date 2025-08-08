---
title: "Quickstart: Embedding Data and Queries"
sidebar_title: "Quickstart"
weight: 1
aliases: ["/docs/guides/embedding/quickstart/", "/docs/guides/embedding/quickstart"]
---

LanceDB will automatically vectorize the data both at ingestion and query time. All you need to do is specify which model to use.

We support most popular embedding models like OpenAI, Hugging Face, Sentence Transformers, CLIP, and more.

## Step 1: Import Required Libraries

First, import the necessary LanceDB components:

```python
import lancedb
from lancedb.pydantic import LanceModel, Vector
from lancedb.embeddings import get_registry
```

- `lancedb`: The main database connection and operations
- `LanceModel`: Pydantic model for defining table schemas
- `Vector`: Field type for storing vector embeddings
- `get_registry()`: Access to the embedding function registry

## Step 2: Connect to LanceDB Cloud

Establish a connection to your LanceDB instance:

```python
db = lancedb.connect(
    uri="db://....",
    api_key="sk_...",
    region="us-east-1"
)
```

For local development, you can use:
```python
db = lancedb.connect("/path/to/local/database")
```

## Step 3: Initialize the Embedding Function

Choose and configure your embedding model:

```python
model = get_registry().get("sentence-transformers").create(
    name="BAAI/bge-small-en-v1.5", 
    device="cpu"
)
```

This creates a Sentence Transformers embedding function using the BGE model. You can:
- Change `"sentence-transformers"` to other providers like `"openai"`, `"cohere"`, etc.
- Modify the model name for different embedding models
- Set `device="cuda"` for GPU acceleration if available

## Step 4: Define Your Schema

Create a Pydantic model that defines your table structure:

```python
class Words(LanceModel):
    text: str = model.SourceField()  
    vector: Vector(model.ndims()) = model.VectorField()  
```

- `SourceField()`: This field will be embedded
- `VectorField()`: This stores the embeddings
- `model.ndims()`: Sets vector dimensions for your model

Go back to LanceDB Cloud and check that the table and schema were created:

![Embedding Schema](/assets/docs/quickstart/embedding-schema.png)

## Step 5: Create Table and Ingest Data

Create a table with your schema and add data:

```python
table = db.create_table("words", schema=Words)
table.add([
    {"text": "hello world"},
    {"text": "goodbye world"}
])
```

The `table.add()` call automatically:
- Takes the text from each document
- Generates embeddings using your chosen model
- Stores both the original text and the vector embeddings

Here is your data in the LanceDB Cloud table:
![Embedding Text](/assets/docs/quickstart/embedding-text.png)

## Step 6: Query with Automatic Embedding

Search your data using natural language queries:

```python
query = "greetings"
actual = table.search(query).limit(1).to_pydantic(Words)[0]
print(actual.text)
```

The search process:
1. Automatically converts your query text to embeddings
2. Finds the most similar vectors in your table
3. Returns the matching documents


## Complete Example 

LanceDB currently supports the [Embedding API via SDKs in Python, Typescript and Rust](/docs/reference/).

{{< code language="python" source="examples/py/test_embeddings_optional.py" id="imports" />}}
{{< code language="typescript" source="examples/ts/embedding.test.ts" id="imports" />}}
{{< code language="rust" source="examples/rs/openai.rs" id="imports" />}}

Here are some examples of queries in multiple languages. 

{{< code language="python" source="examples/py/test_embeddings_optional.py" id="openai_embeddings" />}}
{{< code language="typescript" source="examples/ts/embedding.test.ts" id="openai_embeddings" />}}
{{< code language="rust" source="examples/rs/openai.rs" id="openai_embeddings" />}}

Learn about using the existing integrations and creating custom embedding functions in the [**Embedding Guide**](/docs/guides/embedding/).\

Check out some [Basic Usage tips](/docs/quickstart/basic-usage/). After that, we'll teach you how to build a small app.
