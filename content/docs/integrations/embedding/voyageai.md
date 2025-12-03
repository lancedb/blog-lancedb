---
title: VoyageAI Embedding Models
sidebar_title: VoyageAI
---

Voyage AI provides cutting-edge embedding and rerankers.


Using voyageai API requires voyageai package, which can be installed using `pip install voyageai`. Voyage AI embeddings are used to generate embeddings for text data. The embeddings can be used for various tasks like semantic search, clustering, and classification.
You also need to set the `VOYAGE_API_KEY` environment variable to use the VoyageAI API.

Supported models are:

- voyage-context-3
- voyage-3.5
- voyage-3.5-lite
- voyage-3
- voyage-3-lite
- voyage-finance-2
- voyage-multilingual-2
- voyage-law-2
- voyage-code-2


Supported parameters (to be passed in `create` method) are:

| Parameter | Type | Default Value | Description |
|---|---|--------|---------|
| `name` | `str` | `None` | The model ID of the model to use. Supported base models for Text Embeddings: voyage-3, voyage-3-lite, voyage-finance-2, voyage-multilingual-2, voyage-law-2, voyage-code-2 |
| `input_type` | `str` | `None` | Type of the input text. Default to None. Other options: query, document. |
| `truncation` | `bool` | `True` | Whether to truncate the input texts to fit within the context length. |


Usage Example:
    
{{< code language="python" >}}
import lancedb
from lancedb.pydantic import LanceModel, Vector
from lancedb.embeddings import EmbeddingFunctionRegistry

voyageai = EmbeddingFunctionRegistry.get_instance().get("voyageai").create(name="voyage-3")

class TextModel(LanceModel):
    text: str = voyageai.SourceField()
    vector: Vector(voyageai.ndims()) =  voyageai.VectorField()

data = [ { "text": "hello world" },
        { "text": "goodbye world" }]

db = lancedb.connect("~/.lancedb")
tbl = db.create_table("test", schema=TextModel, mode="overwrite")

tbl.add(data)
{{< /code >}}

{{< code language="typescript" >}}
import * as lancedb from "@lancedb/lancedb";
import {
  LanceSchema,
  getRegistry,
  register,
  EmbeddingFunction,
} from "@lancedb/lancedb/embedding";
import "@lancedb/lancedb/embedding/voyageai";
import { Utf8 } from "apache-arrow";

const db = await lancedb.connect("data/sample-lancedb");
const func = getRegistry()
  .get("voyageai")
  ?.create({ name: "voyage-3" }) as EmbeddingFunction;

const schema = LanceSchema({
  text: func.sourceField(new Utf8()),
  vector: func.vectorField(),
});

const table = await db.createTable(
  "test",
  [{ text: "hello world" }, { text: "goodbye world" }],
  {
    schema,
  },
);
{{< /code >}}