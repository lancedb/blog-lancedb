---
title: "Vectorizing and Embedding Data with LanceDB"
sidebar_title: Embedding Data
description: "Complete reference for LanceDB's embedding API - registry, functions, schemas, and multi-language SDK support."
weight: 1
---

Modern machine learning models can be trained to convert raw data into embeddings, which are vectors of floating point numbers. The position of an embedding in vector space captures the semantics of the data, so vectors that are close to each other are considered similar.

LanceDB provides an embedding function registry that automatically generates vector embeddings during data ingestion and querying. The API abstracts embedding generation, allowing you to focus on your application logic.

## Core Concepts

- **EmbeddingFunctionRegistry**: A global registry that manages all embedding function instances.
- **EmbeddingFunction**: The abstract base class you can use to implement your own custom embedding functions.
- **SourceField/VectorField**: Schema decorators that tell LanceDB which field to embed and where to store the resulting vector.

## Embedding Function Registry

You can get an embedding function from the registry, and then use it in your table schema.

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
```

### Creating an Embedding Function

The `.create()` method accepts several arguments to configure the embedding function's behavior.

| Argument | Type | Description |
|---|---|---|
| `name` | `str` | The name of the model to use (e.g., `text-embedding-3-small`). |
| `max_retries` | `int` | The maximum number of times to retry on a failed API request. Defaults to 7. |
| `batch_size` | `int` | The number of inputs to process in a single batch. Provider-specific. |
| `api_key` | `str` | The API key for the embedding provider. Can also be set via environment variables. |
| `device` | `str` | The device to run the model on (e.g., "cpu", "cuda"). Defaults to automatic detection. |

**Example:**
```python
# Create a configured OpenAI embedding function
func = get_registry().get("openai").create(
    name="text-embedding-3-small",
    max_retries=5,
    batch_size=32
)
```


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
