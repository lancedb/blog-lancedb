---
title: ColPali Embedding Models
sidebar_title: ColPali
---

The `colpali` embedding function uses the [ColPali engine](https://github.com/illuin-tech/colpali) for multimodal multi-vector embeddings. This allows for generating multiple vector embeddings for both text and image inputs, which is particularly useful for late-interaction models like ColBERT.

First, you need to install the necessary packages:
```shell
pip install lancedb[embeddings]
pip install colpali-engine
```

## Supported Models

This integration supports various models compatible with the ColPali engine, including:
- **ColPali**: e.g., `"vidore/colpali-v1.3"`
- **ColQwen2.5**: e.g., `"Metric-AI/ColQwen2.5-3b-multilingual-v1.0"`
- **ColQwen2**: e.g., `"vidore/colqwen2-v1.0"`
- **ColSmol**: e.g., `"vidore/colSmol-256M"`

## Parameters

The following parameters can be passed to the `.create()` method:

| Parameter | Type | Default Value | Description |
|---|---|---|---|
| `model_name` | `str` | `"Metric-AI/ColQwen2.5-3b-multilingual-v1.0"` | The name of the model to use. |
| `device` | `str` | `"auto"` | The device for inference (e.g., "cpu", "cuda", "mps"). Defaults to automatic detection. |
| `dtype` | `str` | `"bfloat16"` | Data type for model weights (e.g., "bfloat16", "float16", "float32"). |
| `pooling_strategy` | `str` | `"hierarchical"` | The token pooling strategy. Can be `"hierarchical"`, `"lambda"`, or `None` to disable. |
| `pooling_func` | `Callable` | `None` | A custom function to use for pooling when `pooling_strategy` is `"lambda"`. |
| `pool_factor` | `int` | `2` | Factor to reduce sequence length if hierarchical pooling is enabled. |
| `quantization_config` | `BitsAndBytesConfig` | `None` | Quantization configuration for the model (requires `bitsandbytes`). |
| `batch_size` | `int` | `2` | Batch size for processing inputs. |
| `offload_folder` | `str` | `None` | Folder to offload model weights if using CPU offloading. |

## Usage Example

Here is an example of how to use the `colpali` embedding function to create a table with multi-vector embeddings for images and search it with a text query.

```python
import lancedb
import pandas as pd
from lancedb.pydantic import LanceModel, MultiVector
from lancedb.embeddings import get_registry
import requests

db = lancedb.connect("/tmp/colpali-db")
registry = get_registry()
func = registry.get("colpali").create(model_name="vidore/colSmol-256M")

class Media(LanceModel):
    text: str
    image_uri: str = func.SourceField()
    image_vectors: MultiVector(func.ndims()) = func.VectorField()

table = db.create_table("media", schema=Media, mode="overwrite")

# Sample data
data = [
    {"text": "a cute cat playing with yarn", "image_uri": "http://farm1.staticflickr.com/53/167798175_7c7845bbbd_z.jpg"},
    {"text": "a puppy in a flower field", "image_uri": "http://farm9.staticflickr.com/8387/8602747737_2e5c2a45d4_z.jpg"},
]
table.add(pd.DataFrame(data))

# Search with a text query
query = "a fluffy animal"
results = table.search(query, vector_column_name="image_vectors").limit(1).to_pydantic(Media)

print(results[0].text)
```
