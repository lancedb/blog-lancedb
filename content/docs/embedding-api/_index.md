---
title: "LanceDB Embedding API"
sidebar_title: Embedding
description: "Complete reference for LanceDB's embedding API - registry, functions, schemas, and multi-language SDK support."
weight: 9
---

LanceDB provides an embedding function registry that automatically generates vector embeddings during data ingestion and querying. The API abstracts embedding generation, allowing you to focus on your application logic.

## Core Concepts

- **EmbeddingFunctionRegistry**: Global registry managing embedding function instances
- **EmbeddingFunction**: Abstract base class for custom implementations
- **SourceField/VectorField**: Schema decorators that trigger automatic embedding
- **Registry Pattern**: `get_registry().get("provider").create(params)`


## Embedding Function Registry

### Available Providers

| Provider | Model ID | Default Model | Dimensions |
|----------|----------|---------------|------------|
| OpenAI | `openai` | `text-embedding-ada-002` | 1536 |
| Sentence Transformers | `sentence-transformers` | `all-MiniLM-L6-v2` | 384 |
| Hugging Face | `huggingface` | `colbert-ir/colbertv2.0` | Variable |
| Ollama | `ollama` | `nomic-embed-text` | 768 |
| Cohere | `cohere` | `embed-english-v3.0` | 1024 |
| Gemini | `gemini-text` | `text-embedding-004` | 768 |
| Jina | `jina` | `jina-embeddings-v2-base-en` | 768 |
| AWS Bedrock | `bedrock-text` | `amazon.titan-embed-text-v1` | 1536 |
| IBM Watson | `watsonx` | `sentence-transformers/all-MiniLM-L6-v2` | 384 |
| VoyageAI | `voyageai` | `voyage-large-2` | 1024 |
| Instructor | `instructor` | `hkunlp/instructor-base` | 768 |

### Multi-modal Providers

| Provider | Model ID | Supported Inputs | Dimensions |
|----------|----------|------------------|------------|
| OpenCLIP | `open-clip` | Text, Images | 512 |
| ImageBind | `imagebind` | Text, Images, Audio, Video | 1024 |
| Jina Multi-modal | `jina` | Text, Images (select models) | Variable |

## API Reference

### Registry Methods

```python
from lancedb.embeddings import get_registry

registry = get_registry()

# Get provider factory
factory = registry.get("openai")

# Create configured instance
func = factory.create(
    name="text-embedding-3-small",
    max_retries=7,  # Default retry attempts
    batch_size=32   # Provider-specific
)

# Set runtime variables (not stored in metadata)
registry.set_var("OPENAI_API_KEY", "sk-...")
registry.set_var("DEVICE", "cuda")
```

### Schema Definition

```python
from lancedb.pydantic import LanceModel, Vector

class MySchema(LanceModel):
    # Automatic embedding on ingestion
    text: str = func.SourceField()
    
    # Store embeddings (dimensions from func.ndims())
    vector: Vector(func.ndims()) = func.VectorField()
    
    # Regular fields
    metadata: dict = {}
    timestamp: datetime = Field(default_factory=datetime.now)
```

### Table Operations

```python
# Create table with embedding schema
table = db.create_table("my_table", schema=MySchema)

# Add data (embeddings generated automatically)
table.add([
    {"text": "Document 1", "metadata": {"source": "web"}},
    {"text": "Document 2", "metadata": {"source": "api"}}
])

# Search (query embedding generated automatically)
results = table.search("query text").limit(10).to_pandas()

# Multi-modal search
image = Image.open("query.jpg")
results = table.search(image).limit(5).to_pandas()
```

## Multi-language Support

### TypeScript

```typescript
import * as lancedb from '@lancedb/lancedb'
import { getRegistry } from '@lancedb/lancedb/embeddings'

const func = getRegistry().get("openai").create({
  apiKey: process.env.OPENAI_API_KEY
})

const db = await lancedb.connect("/tmp/db")
const table = await db.createTable("docs", [
  { text: "hello world" },
  { text: "goodbye world" }
], func)

const results = await table.search("greetings").limit(5).toArray()
```

### Rust

```rust
use lancedb::LanceDB;
use lancedb::embeddings::OpenAIEmbeddingFunction;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let func = OpenAIEmbeddingFunction::new()
        .with_model("text-embedding-ada-002")
        .with_api_key("sk-...");

    let db = LanceDB::connect("/tmp/db").await?;
    let table = db.create_table("docs", &func).await?;
    
    table.add(&[("hello world",), ("goodbye world",)]).await?;
    let results = table.search("greetings").limit(5).execute().await?;
    
    Ok(())
}
```

## Custom Embedding Functions

### Text-only Implementation

```python
from lancedb.embeddings import register, TextEmbeddingFunction
from functools import cached_property

@register("my-embedder")
class MyTextEmbedder(TextEmbeddingFunction):
    model_name: str = "my-model"
    device: str = "cpu"
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._ndims = None
    
    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        # Your embedding logic here
        return self._model.encode(texts).tolist()
    
    def ndims(self) -> int:
        if self._ndims is None:
            self._ndims = len(self.generate_embeddings(["test"])[0])
        return self._ndims
    
    @cached_property
    def _model(self):
        # Initialize your model
        return MyEmbeddingModel(self.model_name, device=self.device)
    
    def sensitive_keys(self) -> List[str]:
        return ["api_key", "secret"]
```

### Multi-modal Implementation

```python
from lancedb.embeddings import register, EmbeddingFunction
from typing import Union, List
import numpy as np

@register("my-multimodal")
class MyMultimodalEmbedder(EmbeddingFunction):
    model_name: str = "my-multimodal-model"
    
    def compute_query_embeddings(
        self, 
        query: Union[str, "PIL.Image.Image"]
    ) -> List[np.ndarray]:
        if isinstance(query, str):
            return [self._encode_text(query)]
        else:
            return [self._encode_image(query)]
    
    def compute_source_embeddings(
        self, 
        data: Union[List[str], List["PIL.Image.Image"]]
    ) -> List[np.ndarray]:
        embeddings = []
        for item in data:
            if isinstance(item, str):
                embeddings.append(self._encode_text(item))
            else:
                embeddings.append(self._encode_image(item))
        return embeddings
    
    def ndims(self) -> int:
        return 512  # Your model's output dimension
```

## Configuration & Security

### Environment Variables

```python
# Set sensitive data via environment
import os
os.environ["OPENAI_API_KEY"] = "sk-..."

# Or use registry variables
registry = get_registry()
registry.set_var("OPENAI_API_KEY", "sk-...")
registry.set_var("DEVICE", "cuda")
```

### Variable References in Configuration

```python
# Reference variables in embedding config
func = get_registry().get("openai").create(
    api_key="$env:OPENAI_API_KEY",
    device="$env:DEVICE:cpu"  # Default to CPU if not set
)
```

## Performance & Optimization

### Rate Limiting

```python
# Configure retry behavior
func = get_registry().get("openai").create(
    max_retries=10,  # Increase from default 7
    max_retries=0    # Disable retries
)
```

### Batch Processing

```python
# Optimize batch size for your use case
func = get_registry().get("sentence-transformers").create(
    batch_size=64,  # Larger batches for GPU
    batch_size=8    # Smaller batches for memory constraints
)
```

### Device Management

```python
# Automatic device detection
import torch
device = "cuda" if torch.cuda.is_available() else "cpu"

func = get_registry().get("sentence-transformers").create(
    device=device
)
```

## Cloud Deployment

```python
# LanceDB Cloud with embedding functions
db = lancedb.connect(
    uri="db://your-db-id",
    api_key="sk-...",
    region="us-east-1"
)

# Embeddings generated on source device, sent to cloud
func = get_registry().get("openai").create()
table = db.create_table("docs", schema=MySchema)
```

## Error Handling

```python
try:
    results = table.search("query").limit(5).to_pandas()
except Exception as e:
    if "rate limit" in str(e).lower():
        # Handle rate limiting
        time.sleep(60)
        results = table.search("query").limit(5).to_pandas()
    elif "authentication" in str(e).lower():
        # Handle auth errors
        raise ValueError("Invalid API key")
    else:
        raise
```

## Migration & Compatibility

```python
# Legacy with_embeddings API (deprecated)
# Use embedding functions instead
table = db.create_table("legacy_table")
table.add(data, embedding_function=func)  # Old way

# New way - embedding functions in schema
table = db.create_table("new_table", schema=MySchema)
table.add(data)  # Embeddings generated automatically
``` 