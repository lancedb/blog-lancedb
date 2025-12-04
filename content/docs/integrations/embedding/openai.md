---
title: OpenAI Embedding Models
sidebar_title: OpenAI
---

LanceDB registers the OpenAI embeddings function in the registry by default, as `openai`. Below are the parameters that you can customize when creating the instances:

| Parameter | Type | Default Value | Description |
|---|---|---|---|
| `name` | `str` | `"text-embedding-ada-002"` | The name of the model. |
| `dim` | `int` |  Model default   | For OpenAI's newer text-embedding-3 model, we can specify a dimensionality that is smaller than the 1536 size. This feature supports it |
| `use_azure` | bool | `False` | Set true to use Azure OpenAPI SDK |


{{< code language="python" >}}
import lancedb
from lancedb.pydantic import LanceModel, Vector
from lancedb.embeddings import get_registry

db = lancedb.connect("/tmp/db")
func = get_registry().get("openai").create(name="text-embedding-ada-002")

class Words(LanceModel):
    text: str = func.SourceField()
    vector: Vector(func.ndims()) = func.VectorField()

table = db.create_table("words", schema=Words, mode="overwrite")
table.add([
    {"text": "hello world"},
    {"text": "goodbye world"}
])

query = "greetings"
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
import "@lancedb/lancedb/embedding/openai";
import { Utf8 } from "apache-arrow";

const db = await lancedb.connect("data/sample-lancedb");
const func = getRegistry()
  .get("openai")
  ?.create({ model: "text-embedding-ada-002" }) as EmbeddingFunction;

const schema = LanceSchema({
  text: func.sourceField(new Utf8()),
  vector: func.vectorField(),
});

const table = await db.createTable(
  "words",
  [{ text: "hello world" }, { text: "goodbye world" }],
  {
    schema,
  },
);

const query = "greetings";
const results = await table.search(query).limit(1).toArray();
console.log(results[0].text);
{{< /code >}}