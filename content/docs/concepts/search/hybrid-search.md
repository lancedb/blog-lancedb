---
title: Hybrid Search in LanceDB
sidebar_title: Hybrid Search
weight: 5
---

You may want to search for a document that is semantically similar to a query document, but also contains a specific keyword. This is an example of **hybrid search**, a query method that combines multiple search techniques.

For detailed examples, try our [**Python Notebook**](https://colab.research.google.com/github/lancedb/vectordb-recipes/blob/main/examples/saas_examples/python_notebook/Hybrid_search.ipynb) or the [**TypeScript Example**](https://github.com/lancedb/vectordb-recipes/tree/main/examples/saas_examples/ts_example/hybrid-search)

## **Reranking** 

You can perform hybrid search in LanceDB by combining the results of semantic and full-text search via a reranking algorithm of your choice. LanceDB comes with [**built-in rerankers**](https://lancedb.github.io/lancedb/reranking/) and you can implement you own **custom reranker** as well. 

By default, LanceDB uses `RRFReranker()`, which uses reciprocal rank fusion score, to combine and rerank the results of semantic and full-text search. You can customize the hyperparameters as needed or write your own custom reranker. Here's how you can use any of the available rerankers:

| Argument | Type | Default | Description |
|----------|------|---------|-------------|
| `normalize` | `str` | `"score"` | The method to normalize the scores. Can be `rank` or `score`. If `rank`, the scores are converted to ranks and then normalized. If `score`, the scores are normalized directly. |
| `reranker` | `Reranker` | `RRF()` | The reranker to use. If not specified, the default reranker is used. |

## **Example: Hybrid Search**

### **1. Setup**
Import the necessary libraries and dependencies for working with LanceDB, OpenAI embeddings, and reranking.

{{< code language="python" >}}
import os
import lancedb
import openai
from lancedb.embeddings import get_registry
from lancedb.pydantic import LanceModel, Vector
from lancedb.rerankers import RRFReranker
{{< /code >}}

{{< code language="typescript" >}}
import * as lancedb from "@lancedb/lancedb";
import "@lancedb/lancedb/embedding/openai";
import { Utf8 } from "apache-arrow";
{{< /code >}}

### **2. Connect to LanceDB Cloud**
Establish a connection to your LanceDB instance, with different options for Cloud, Enterprise, and Open Source deployments.

{{< code language="python" >}}
db = lancedb.connect(
  uri="db://your-project-slug",
  api_key="your-api-key",
  region="us-east-1"
)
{{< /code >}}

{{< code language="typescript" >}}
const db = await lancedb.connect({
  uri: "db://your-project-slug",
  apiKey: "your-api-key",
  region: "us-east-1",
});
{{< /code >}}

For LanceDB Enterprise, set the host override to your private cloud endpoint:

{{< code language="python" >}}
host_override = os.environ.get("LANCEDB_HOST_OVERRIDE")

db = lancedb.connect(
uri=uri,
api_key=api_key,
region=region,
host_override=host_override
)
{{< /code >}}

For Open Source:

{{< code language="python" source="examples/py/test_basic.py" id="set_uri" />}}
{{< code language="python" source="examples/py/test_basic.py" id="connect" />}}

{{< code language="typescript" source="examples/ts/basic.test.ts" id="connect" />}}

### **3. Configure Embedding Model**
Set up the OpenAI embedding model that will convert text into vector representations for semantic search.

{{< code language="python" >}}
if "OPENAI_API_KEY" not in os.environ:
    # OR set the key here as a variable
    openai.api_key = "sk-..."
embeddings = get_registry().get("openai").create()
{{< /code >}}

{{< code language="typescript" >}}
if (!process.env.OPENAI_API_KEY) {
  console.log("Skipping hybrid search - OPENAI_API_KEY not set");
  return { success: true, message: "Skipped: OPENAI_API_KEY not set" };
}

const embedFunc = lancedb.embedding.getRegistry().get("openai")?.create({
  model: "text-embedding-ada-002",
}) as lancedb.embedding.EmbeddingFunction;
{{< /code >}}

### **4. Create Table & Schema**
Define the data structure for your documents, including both the text content and its vector representation.

{{< code language="python" >}}
class Documents(LanceModel):
    text: str = embeddings.SourceField()
    vector: Vector(embeddings.ndims()) = embeddings.VectorField()

table_name = "hybrid_search_example"
table = db.create_table(table_name, schema=Documents, mode="overwrite")
{{< /code >}}

{{< code language="typescript" >}}
const documentSchema = lancedb.embedding.LanceSchema({
  text: embedFunc.sourceField(new Utf8()),
  vector: embedFunc.vectorField(),
});

const tableName = "hybrid_search_example";
const table = await db.createEmptyTable(tableName, documentSchema, {
  mode: "overwrite",
});
{{< /code >}}

### **5. Add Data**
Insert sample documents into your table, which will be used for both semantic and keyword search.

{{< code language="python" >}}
data = [
    {"text": "rebel spaceships striking from a hidden base"},
    {"text": "have won their first victory against the evil Galactic Empire"},
    {"text": "during the battle rebel spies managed to steal secret plans"},
    {"text": "to the Empire's ultimate weapon the Death Star"},
]
table.add(data=data)
{{< /code >}}

{{< code language="typescript" >}}
const data = [
  { text: "rebel spaceships striking from a hidden base" },
  { text: "have won their first victory against the evil Galactic Empire" },
  { text: "during the battle rebel spies managed to steal secret plans" },
  { text: "to the Empire's ultimate weapon the Death Star" },
];
await table.add(data);
console.log(`Created table: ${tableName} with ${data.length} rows`);
{{< /code >}}

### **6. Build Full Text Index**
Create a full-text search index on the text column to enable keyword-based search capabilities.

{{< code language="python" >}}
table.create_fts_index("text")
wait_for_index(table, "text_idx")
{{< /code >}}

{{< code language="typescript" >}}
console.log("Creating full-text search index...");
await table.createIndex("text", {
  config: lancedb.Index.fts(),
});
await waitForIndex(table as any, "text_idx");
{{< /code >}}

### **7. Set Reranker**
Initialize the reranker that will combine and rank results from both semantic and keyword search.

{{< code language="python" >}}
reranker = RRFReranker()
{{< /code >}}

{{< code language="typescript" >}}
const reranker = await lancedb.rerankers.RRFReranker.create();
{{< /code >}}

### **8. Hybrid Search**
Perform a hybrid search query that combines semantic similarity with keyword matching, using the specified reranker to merge and rank the results.

{{< code language="python" >}}
results = (
    table.search(
        "flower moon",
        query_type="hybrid",
        vector_column_name="vector",
        fts_columns="text",
    )
    .rerank(reranker)
    .limit(10)
    .to_pandas()
)

print("Hybrid search results:")
print(results)
{{< /code >}}

{{< code language="typescript" >}}
console.log("Performing hybrid search...");
const queryVector = await embedFunc.computeQueryEmbeddings("full moon in May");
const hybridResults = await table
  .query()
  .fullTextSearch("flower moon")
  .nearestTo(queryVector)
  .rerank(reranker)
  .select(["text"])
  .limit(10)
  .toArray();

console.log("Hybrid search results:");
console.log(hybridResults);
{{< /code >}}

### **9. Hybrid Search - Manual**
You can also pass the vector and text query explicitly. This is useful if you're not using the embedding API or if you're using a separate embedder service.

{{< code language="python" source="examples/py/test_search.py" id="hybrid_search_pass_vector_text" />}}
