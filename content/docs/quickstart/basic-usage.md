---
title: "Common Database Operations in LanceDB"
sidebar_title: "Basic Usage"
description: Learn how to use LanceDB with Python, TypeScript, and Rust SDKs. Includes installation instructions, basic operations, and code examples for each language.
weight: 2
---

In this section, you'll learn basic operations [in Python, TypeScript, and Rust SDKs](/docs/reference/).
The code examples are the same, regardless of whether you use LanceDB OSS or LanceDB Cloud/Enterprise.

For the LanceDB Cloud/Enterprise API Reference, check the [HTTP REST API Specification](https://docs.lancedb.com/).

## Installation Options

{{< code language="python" source="examples/extra.py" id="install" />}}
{{< code language="typescript" source="examples/extra.ts" id="install" />}}
{{< code language="rust" source="examples/extra.rs" id="install" />}}

### Preview Releases

Stable releases are created about every 2 weeks. For the latest features and bug
fixes, you can install the **Preview Release**. These releases receive the same
level of testing as stable releases but are not guaranteed to be available for
more than 6 months after they are released. Once your application is stable, we
recommend switching to stable releases.

{{< code language="python" source="examples/extra.py" id="install_preview" />}}
{{< code language="typescript" source="examples/extra.ts" id="install_preview" />}}
{{< code language="rust" source="examples/extra.rs" id="install_preview" />}}

For Rust, we don't push Preview Releases to crates.io, but you can reference the tag in GitHub within your Cargo dependencies:

## Useful Libraries

For this tutorial, we use some common libraries to help us work with data.
    
{{< code language="python" source="examples/extra.py" id="libraries" />}}
{{< code language="typescript" source="examples/extra.ts" id="libraries" />}}

## 1. Connect to LanceDB

### LanceDB Cloud 

[Don't forget to get your Cloud API key here!](https://accounts.lancedb.com/sign-up) The trial is free and you don't need a credit card.

{{< code language="python" source="examples/extra.py" id="connect_cloud" />}}
{{< code language="typescript" source="examples/extra.ts" id="connect_cloud" />}}

### LanceDB OSS

In case you want to use the embedded version locally, you can connect without credentials:

{{< code language="python" source="examples/extra.py" id="connect_oss" />}}
{{< code language="typescript" source="examples/ts/basic.test.ts" id="connect" />}}
{{< code language="rust" source="examples/extra.rs" id="connect" />}}

LanceDB will create the directory if it doesn't exist (including parent directories).

If you need a reminder of the URI, you can call `db.uri()`.

## 2. Working with Tables

### Create a Table From Data

If you have data to insert into the table at creation time, you can simultaneously create a
table and insert the data into it. The schema of the data will be used as the schema of the
table.

If the table already exists, LanceDB will raise an error by default. If you want to overwrite the table, you can pass in `mode="overwrite"` to the `create_table` method.

{{< code language="python" source="examples/py/test_basic.py" id="create_table" />}}
{{< code language="typescript" source="examples/ts/basic.test.ts" id="create_table" />}}
{{< code language="rust" source="examples/rs/simple.rs" id="create_table" />}}

### Create an Empty Table

Sometimes you may not have the data to insert into the table at creation time.
In this case, you can create an empty table and specify the schema, so that you can add
data to the table at a later time (as long as it conforms to the schema). This is
similar to a `CREATE TABLE` statement in SQL.

{{< code language="python" source="examples/py/test_basic.py" id="create_empty_table" />}}
{{< code language="typescript" source="examples/ts/basic.test.ts" id="create_empty_table" />}}
{{< code language="rust" source="examples/rs/simple.rs" id="create_empty_table" />}}

### Open a Table

Once created, you can open a table as follows:

{{< code language="python" source="examples/py/test_basic.py" id="open_table" />}}
{{< code language="typescript" source="examples/ts/basic.test.ts" id="open_table" />}}
{{< code language="rust" source="examples/rs/simple.rs" id="open_existing_tbl" />}}

### List Tables

If you forget your table's name, you can always get a listing of all table names:

{{< code language="python" source="examples/py/test_basic.py" id="table_names" />}}
{{< code language="typescript" source="examples/ts/basic.test.ts" id="table_names" />}}
{{< code language="rust" source="examples/rs/simple.rs" id="list_names" />}}

### Drop Table

Use the `drop_table()` method on the database to remove a table.

{{< code language="python" source="examples/py/test_basic.py" id="drop_table" />}}
{{< code language="typescript" source="examples/ts/basic.test.ts" id="drop_table" />}}
{{< code language="rust" source="examples/rs/simple.rs" id="drop_table" />}}

This permanently removes the table and is not recoverable, unlike deleting rows.
By default, if the table does not exist, an exception is raised. To suppress this, you can pass in `ignore_missing=True`.

## 3. Adding Data

LanceDB supports data in several formats: `pyarrow`, `pandas`, `polars` and `pydantic`. You can also work with regular python lists & dictionaries, as well as json and csv files.

### Add Data to a Table

The data will be appended to the existing table. By default, data is added in append mode, but you can also use `mode="overwrite"` to replace existing data.

{{< code language="python" source="examples/py/test_basic.py" id="add_data" />}}
{{< code language="typescript" source="examples/ts/basic.test.ts" id="add_data" />}}
{{< code language="rust" source="examples/rs/simple.rs" id="add" />}}

### Delete Rows

Use the `delete()` method on tables to delete rows from a table. To choose
which rows to delete, provide a filter that matches on the metadata columns.
This can delete any number of rows that match the filter.

{{< code language="python" source="examples/py/test_basic.py" id="delete_rows" />}}
{{< code language="typescript" source="examples/ts/basic.test.ts" id="delete_rows" />}}
{{< code language="rust" source="examples/rs/simple.rs" id="delete" />}}

The deletion predicate is a SQL expression that supports the same expressions
as the `where()` clause (`only_if()` in Rust) on a search. They can be as
simple or complex as needed. To see what expressions are supported, see the
[SQL filters](/docs/search/sql-queries/) section.

## 4. Vector Search

Once you've embedded the query, you can find its nearest neighbors as follows. LanceDB uses L2 (Euclidean) distance by default, but supports other distance metrics like cosine similarity and dot product.

{{< code language="python" source="examples/py/test_basic.py" id="vector_search" />}}
{{< code language="typescript" source="examples/ts/basic.test.ts" id="vector_search" />}}
{{< code language="rust" source="examples/rs/simple.rs" id="search" />}}

This returns a Pandas DataFrame with the results.

## 5. Building an Index

By default, LanceDB runs a brute-force scan over the dataset to find the K nearest neighbors (KNN). For larger datasets, this can be computationally expensive.

**Indexing Threshold:** If your table has more than **50,000 vectors**, you should create an ANN index to speed up search performance. [The IVF_PQ Index](/docs/concepts/indexing/) uses IVF (Inverted File) partitioning to reduce the search space.

{{< code language="python" source="examples/py/test_basic.py" id="create_index" />}}
{{< code language="typescript" source="examples/ts/basic.test.ts" id="create_index" />}}
{{< code language="rust" source="examples/rs/simple.rs" id="create_index" />}}

{{< admonition "Note" "Why is index creation manual?" >}}
LanceDB does not automatically create the ANN index for two reasons. **First**, it's optimized for really fast retrievals via a disk-based index, and **second**, data and query workloads can be very diverse, so there's no one-size-fits-all index configuration. LanceDB provides many parameters to fine-tune index size, query latency, and accuracy.
{{< /admonition >}}

## 6. Embedding API 

{{< admonition  >}}
This is for LanceDB OSS local use only. Inference is not offered in LanceDB Cloud.
{{< /admonition >}}

You can use the Embedding API when working with embedding models. It automatically vectorizes the data at ingestion and query time and comes with built-in integrations with [popular embedding models like Openai, Hugging Face, Sentence Transformers, CLIP and more.](/docs/integrations/embedding/)


{{< code language="python" >}}
from lancedb.pydantic import LanceModel, Vector
from lancedb.embeddings import get_registry


db = lancedb.connect("/tmp/db")
func = get_registry().get("openai").create(name="text-embedding-ada-002")

class Words(LanceModel):
    text: str = func.SourceField()
    vector: Vector(func.ndims()) = func.VectorField()

table = db.create_table("words", schema=Words, mode="overwrite")
table.add([{"text": "hello world"}, {"text": "goodbye world"}])

query = "greetings"
actual = table.search(query).limit(1).to_pydantic(Words)[0]
print(actual.text)
{{< /code >}}

{{< code language="typescript" >}}
import * as lancedb from "@lancedb/lancedb";
import "@lancedb/lancedb/embedding/openai";
import { LanceSchema, getRegistry, register } from "@lancedb/lancedb/embedding";
import { EmbeddingFunction } from "@lancedb/lancedb/embedding";
import { type Float, Float32, Utf8 } from "apache-arrow";
const db = await lancedb.connect(databaseDir);
const func = getRegistry()
  .get("openai")
  ?.create({ model: "text-embedding-ada-002" }) as EmbeddingFunction;

const wordsSchema = LanceSchema({
  text: func.sourceField(new Utf8()),
  vector: func.vectorField(),
});
const tbl = await db.createEmptyTable("words", wordsSchema, {
  mode: "overwrite",
});
await tbl.add([{ text: "hello world" }, { text: "goodbye world" }]);

const query = "greetings";
const actual = (await tbl.search(query).limit(1).toArray())[0];
{{< /code >}}

{{< code language="rust" >}}
use std::{iter::once, sync::Arc};

use arrow_array::{Float64Array, Int32Array, RecordBatch, RecordBatchIterator, StringArray};
use arrow_schema::{DataType, Field, Schema};
use futures::StreamExt;
use lancedb::{
    arrow::IntoArrow,
    connect,
    embeddings::{openai::OpenAIEmbeddingFunction, EmbeddingDefinition, EmbeddingFunction},
    query::{ExecutableQuery, QueryBase},
    Result,
};

#[tokio::main]
async fn main() -> Result<()> {
    let tempdir = tempfile::tempdir().unwrap();
    let tempdir = tempdir.path().to_str().unwrap();
    let api_key = std::env::var("OPENAI_API_KEY").expect("OPENAI_API_KEY is not set");
    let embedding = Arc::new(OpenAIEmbeddingFunction::new_with_model(
        api_key,
        "text-embedding-3-large",
    )?);

    let db = connect(tempdir).execute().await?;
    db.embedding_registry()
        .register("openai", embedding.clone())?;

    let table = db
        .create_table("vectors", make_data())
        .add_embedding(EmbeddingDefinition::new(
            "text",
            "openai",
            Some("embeddings"),
        ))?
        .execute()
        .await?;

    let query = Arc::new(StringArray::from_iter_values(once("something warm")));
    let query_vector = embedding.compute_query_embeddings(query)?;
    let mut results = table
        .vector_search(query_vector)?
        .limit(1)
        .execute()
        .await?;

    let rb = results.next().await.unwrap()?;
    let out = rb
        .column_by_name("text")
        .unwrap()
        .as_any()
        .downcast_ref::<StringArray>()
        .unwrap();
    let text = out.iter().next().unwrap().unwrap();
    println!("Closest match: {}", text);
    Ok(())
}
{{< /code >}}

## What's Next?

This section covered the very basics of using LanceDB. 

- To learn more about vector databases, you may want to read about [Search](/docs/concepts/search/) or [Indexing](/docs/concepts/indexing/) to get familiar with the concepts.

- If you've already worked with other vector databases, dive into the [Table Docs](/docs/concepts/tables/) to learn how to work with LanceDB Tables in more detail.

{{< admonition "Note" "How to Ingest Data?" >}}
We've prepared another example to teach you about [working with whole datasets](/docs/quickstart/datasets/).
{{< /admonition >}}

