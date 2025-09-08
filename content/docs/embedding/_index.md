---
title: "Vectorizing and Embedding Data with LanceDB"
sidebar_title: Embedding Data
description: "Complete reference for LanceDB's embedding API - registry, functions, schemas, and multi-language SDK support."
weight: 105
aliases: ["/docs/guides/embedding/", "/docs/guides/embedding"]
---

Modern machine learning models can be trained to convert raw data into embeddings, which are vectors of floating point numbers. The position of an embedding in vector space captures the semantics of the data, so vectors that are close to each other are considered similar.

LanceDB provides an embedding function registry that automatically generates vector embeddings during data ingestion and querying. The API abstracts embedding generation, allowing you to focus on your application logic.

## Embedding Function Registry

You can get a supported embedding function from the registry, and then use it in your table schema. Once configured, the embedding function will automatically generate embeddings when you insert data into the table. And when you query the table, you can provide a query string or other input, and the embedding function will generate an embedding for it.

```python
from lancedb.embeddings import get_registry
from lancedb.pydantic import LanceModel, Vector

# Get a sentence-transformer function
func = get_registry().get("sentence-transformers").create()

class MySchema(LanceModel):
    # Embed the 'text' field automatically
    text: str = func.SourceField()
    # Store the embeddings in the 'vector' field
    vector: Vector(func.ndims()) = func.VectorField()

# Create a LanceDB table with the schema
import lancedb
db = lancedb.connect("./mydb")
table = db.create_table("mytable", MySchema)
# Insert data - embeddings are generated automatically
table.add([
    {"text": "This is a test."},
    {"text": "Another example."}
])

# Query the table - embeddings are generated for the query
results = table.search("test example").limit(5).to_pandas()
print(results)

## Example Output
#                                   text                            vector  _distance
# 0                     This is a test.  [0.0123, -0.0456, ..., 0.0789]  0.123456
# 1                     Another example.  [0.0234, -0.0567, ..., 0.0890]  0.234567

```

### Using an Embedding Function

The `.create()` method accepts several arguments to configure the embedding function's behavior. `max_retries` is a special argument that applies to all providers.

| Argument | Type | Description |
|---|---|---|
| `name` | `str` | The name of the model to use (e.g., `text-embedding-3-small`). |
| `max_retries` | `int` | The maximum number of times to retry on a failed API request. Defaults to 7. |

Other arguments are provider-specific. Common arguments include:
| Argument | Type | Description |
| `batch_size` | `int` | The number of inputs to process in a single batch. Provider-specific. |
| `api_key` | `str` | The API key for the embedding provider. Can also be set via environment variables. |
| `device` | `str` | The device to run the model on (e.g., "cpu", "cuda"). Defaults to automatic detection. |

Find the full list of arguments for each provider in the integrations section.

## Available Providers

LanceDB supports most popular embedding providers.

| Provider | Model ID | Default Model |
|----------|----------|---------------|
| OpenAI | `openai` | `text-embedding-ada-002` |
| Sentence Transformers | `sentence-transformers` | `all-MiniLM-L6-v2` |
| Hugging Face | `huggingface` | `colbert-ir/colbertv2.0` |
| Cohere | `cohere` | `embed-english-v3.0` |

### Multi-modal Providers

| Provider | Model ID | Supported Inputs |
|----------|----------|------------------|
| OpenCLIP | `open-clip` | Text, Images |
| ImageBind | `imagebind` | Text, Images, Audio, Video |


You can find all supported embedding models in integrations section

## Embedding function on LanceDB cloud
When using embedding functions on LanceDB cloud, during the ingestion time the embeddings are generated on the client side, and stored in the cloud. We don't yet support model inference on the cloud side so automatic query generation during search is not supported. You can manually generate the embeddings for your queries using the same embedding function and pass the vector to the search function.

```python
import lancedb
from lancedb.embeddings import get_registry
from lancedb.pydantic import LanceModel, Vector

db = lancedb.connect(...)
func = get_registry().get("sentence-transformers").create()

class MySchema(LanceModel):
    text: str = func.SourceField()
    vector: Vector(func.ndims()) = func.VectorField()

table = db.create_table("mytable", MySchema)
table.add([
    {"text": "This is a test."},
    {"text": "Another example."}
])

# Manually generate embeddings for the query
query_vector = func.generate_embeddings(["test example"])[0]
results = table.search(query_vector).limit(5).to_pandas()
```

## Custom Embedding Functions

You can implement your own embedding function by inheriting from `TextEmbeddingFunction` (for text) or `EmbeddingFunction` (for multi-modal data).

```python
from lancedb.embeddings import register, TextEmbeddingFunction
from functools import cached_property

@register("my-embedder")
class MyTextEmbedder(TextEmbeddingFunction):
    model_name: str = "my-model"
    
    def generate_embeddings(self, texts: list[str]) -> list[list[float]]:
        # Your embedding logic here
        return self._model.encode(texts).tolist()
    
    def ndims(self) -> int:
        # Return the dimensionality of the embeddings
        return len(self.generate_embeddings(["test"])[0])
    
    @cached_property
    def _model(self):
        # Initialize your model once
        return MyEmbeddingModel(self.model_name)
```
