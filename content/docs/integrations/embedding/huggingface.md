---
title: HuggingFace Embedding Models
sidebar_title: HuggingFace
---

We offer support for all Hugging Face models (which can be loaded via [transformers](https://huggingface.co/docs/transformers/en/index) library). The default model is `colbert-ir/colbertv2.0` which also has its own special callout - `registry.get("colbert")`. Some Hugging Face models might require custom models defined on the HuggingFace Hub in their own modeling files. You may enable this by setting `trust_remote_code=True`. This option should only be set to True for repositories you trust and in which you have read the code, as it will execute code present on the Hub on your local machine. 

Example usage:

{{< code language="python" >}}
import lancedb
import pandas as pd
from lancedb.embeddings import get_registry
from lancedb.pydantic import LanceModel, Vector

db = lancedb.connect("/tmp/db")
model = get_registry().get("huggingface").create(name='facebook/bart-base')

class Words(LanceModel):
    text: str = model.SourceField()
    vector: Vector(model.ndims()) = model.VectorField()

df = pd.DataFrame({"text": ["hi hello sayonara", "goodbye world"]})
table = db.create_table("greets", schema=Words)
table.add(df)
query = "old greeting"
actual = table.search(query).limit(1).to_pydantic(Words)[0]
print(actual.text)
{{< /code >}}

{{< code language="typescript" >}}
import * as lancedb from "@lancedb/lancedb";
import {
  LanceSchema,
  getRegistry,
  register,
  EmbeddingFunction,
} from "@lancedb/lancedb/embedding";
import "@lancedb/lancedb/embedding/huggingface";
import { Utf8 } from "apache-arrow";

const db = await lancedb.connect("data/sample-lancedb");
const func = getRegistry()
  .get("huggingface")
  ?.create({ name: "facebook/bart-base" }) as EmbeddingFunction;

const schema = LanceSchema({
  text: func.sourceField(new Utf8()),
  vector: func.vectorField(),
});

const table = await db.createTable(
  "greets",
  [{ text: "hi hello sayonara" }, { text: "goodbye world" }],
  {
    schema,
  },
);

const query = "old greeting";
const results = await table.search(query).limit(1).toArray();
console.log(results[0].text);
{{< /code >}}