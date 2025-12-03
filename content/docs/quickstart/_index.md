---
title: "Getting Started with LanceDB"
sidebar_title: "Quickstart"
description: Get started with LanceDB, a modern vector database for AI applications. Learn how to install, connect, and perform basic operations with our Python SDK, in open source or in our Cloud version.
keywords: LanceDB quickstart, vector database tutorial, AI database setup, semantic search database, vector similarity search
weight: 2
---

This is a minimal tutorial for Python users. Let's get started with LanceDB in a few easy steps!

## 1. Install LanceDB

LanceDB can be installed via `pip`.

{{< code language="shell" title="Python" >}}
pip install lancedb
{{< /code >}}

{{< code language="shell" title="TypeScript" >}}
npm install @lancedb/lancedb apache-arrow
{{< /code >}}

Or, if you prefer `uv` (which will manage your dependencies via `pyproject.toml`), run the following:

{{< code language="shell" title="Python" >}}
uv init
uv add lancedb
{{< /code >}}

## 2. Import LanceDB

LanceDB is open source, and made available as an embedded vector database. Using it is as simple as running
the following import statement -- no servers needed!

{{< code language="python" >}}
import lancedb
db = lancedb.connect(uri="ex_lancedb")
{{< /code >}}

{{< code language="typescript" >}}
import * as lancedb from "@lancedb/lancedb";
const db = await lancedb.connect("ex_lancedb");
{{< /code >}}

### Optional: Cloud or Enterprise versions

If you want a fully-managed solution, you can opt for LanceDB Cloud, which provides managed infrastructure, security, and automatic backups. To move from LanceDB OSS to the cloud version, simply replace the connection `uri` with the relevant slug on your LanceDB cloud setup.

{{< code language="python" >}}
db = lancedb.connect(
    uri="db://your-project-slug",
    api_key="your-api-key",
    region="us-east-1"
)
{{< /code >}}

{{< code language="typescript" >}}
const db = await lancedb.connect(
    "db://your-project-slug",
    { apiKey: "your-api-key", region: "us-east-1" }
);
{{< /code >}}

{{< admonition >}}
If you're operating at enormous scale and are looking for more advanced use cases beyond just search, like feature engineering, model training and more, check out [LanceDB Enterprise](/docs/enterprise).
{{< /admonition >}}

## 4. Obtain some data

LanceDB uses the notion of tables, where each row represents a record, and each column represents a field
and/or its metadata. The simplest way to begin is to define a list of objects, where each object
contains a vector field (list of floats) and optional fields for metadata.

Let's look at an example. We have the following records of characters in an adventure board game. The `vector` field is
a list of floats. In the real world, these would contain hundreds of floating-point values and be generated via an embedding model, but the example below shows a simple version with just 3 values.

{{< code language="python" >}}
data = [
    {"id": "1", "text": "knight", "vector": [0.9, 0.4, 0.8]},    
    {"id": "2", "text": "ranger", "vector": [0.8, 0.4, 0.7]},  
    {"id": "9", "text": "priest", "vector": [0.6, 0.2, 0.6]},   
    {"id": "4", "text": "rogue", "vector": [0.7, 0.4, 0.7]},
]
{{< /code >}}

{{< code language="typescript" >}}
const data = [
  { id: "1", text: "knight", vector: [0.9, 0.4, 0.8] },
  { id: "2", text: "ranger", vector: [0.8, 0.4, 0.7] },
  { id: "9", text: "priest", vector: [0.6, 0.2, 0.6] },
  { id: "4", text: "rogue", vector: [0.7, 0.4, 0.7] },
];
{{< /code >}}

## 5. Create a table

Next, let's create a `Table` in LanceDB and ingest the data into it.
If not provided explicitly, the table infers the schema of your data
(in this case, a list of dictionaries in Python). If the table already exists, you'll get an error message.

{{< code language="python" >}}
table = db.create_table("adventurers", data=data)
# If the table already exists, you'll get a ValueError: Table 'my_table' already exists
{{< /code >}}

{{< code language="typescript" >}}
const table = await db.createTable("adventurers", data);
// If the table already exists, you'll get an Error
{{< /code >}}

To overwrite the existing table, you can use the `mode=overwrite` parameter.

{{< code language="python" >}}
table = db.create_table("adventurers", data=data, mode="overwrite")
# No ValueError!
{{< /code >}}

{{< code language="typescript" >}}
const table = await db.createTable("adventurers", data, { mode: "overwrite" });
{{< /code >}}

LanceDB requires that you provide either data or a schema (e.g., PyArrow) during table creation.
You can learn more about that in the "[working with tables](/docs/tables)" page.

## 6. Vector search

Now, let's perform a vector similarity search. The query vector should have the same dimensionality as your data vectors. The search returns the most similar vectors based on Euclidean distance.

Our query is a vector that represents a `warrior`, which isn't in the data we ingested.
We'll find the result that's most similar to it!

{{< code language="python" >}}
# Let's search for vectors similar to "warrior"
query_vector = [0.8, 0.3, 0.8]

# Ensure you run `pip install polars` beforehand
results = table.search(query_vector).limit(2).to_polars()
{{< /code >}}

{{< code language="typescript" >}}
// Let's search for vectors similar to "warrior"
const queryVector = [0.8, 0.3, 0.8];

const results = await table.search(queryVector).limit(2).toArray();
{{< /code >}}
It's often convenient to display the query results as a table. You can output the results of a vector search query
as a Pandas or Polars DataFrame. The example below shows the output as a Polars DataFrame.

It looks like the `knight` is the most similar adventurer to the `warrior` from our query!

```
┌─────┬────────┬─────────────────┬───────────┐
│ id  ┆ text   ┆ vector          ┆ _distance │
│ --- ┆ ---    ┆ ---             ┆ ---       │
│ str ┆ str    ┆ array[f32, 3]   ┆ f32       │
╞═════╪════════╪═════════════════╪═══════════╡
│ 1   ┆ knight ┆ [0.9, 0.4, 0.8] ┆ 0.02      │
│ 2   ┆ ranger ┆ [0.8, 0.4, 0.7] ┆ 0.02      │
└─────┴────────┴─────────────────┴───────────┘
```

If you prefer Pandas, you can use the `to_pandas()` method to display the results as a Pandas DataFrame.
{{< code language="python" >}}
results = table.search(query_vector).limit(2).to_pandas()
{{< /code >}}

## 7. Add data and run more queries

If you obtain more data, it's simple to add it to an existing table. In the same script or a new one, you
can connect to the LanceDB database, open an existing table, and use the `table.add` command.

{{< code language="python" >}}
import lancedb

# Connect to an existing database
uri = "./ex_lancedb"
db = lancedb.connect(uri)

# Open the existing table that we created earlier
table = db.open_table("adventurers")

more_data = [
    {"id": "7", "text": "mage", "vector": [0.6, 0.3, 0.4]},
    {"id": "8", "text": "bard", "vector": [0.3, 0.8, 0.4]},
]

# Add data to table
table.add(more_data)
{{< /code >}}

{{< code language="typescript" >}}
import * as lancedb from "@lancedb/lancedb";

// Connect to an existing database
const uri = "ex_lancedb";
const db = await lancedb.connect(uri);

// Open the existing table that we created earlier
const table = await db.openTable("adventurers");

const moreData = [
  { id: "7", text: "mage", vector: [0.6, 0.3, 0.4] },
  { id: "8", text: "bard", vector: [0.3, 0.8, 0.4] },
];

// Add data to table
await table.add(moreData);
{{< /code >}}

To verify that our new data was added, we can run a different query that looks for adventurers similar to `wizard`.

{{< code language="python" >}}
# Let's search for vectors similar to "wizard"
query_vector = [0.7, 0.3, 0.5]

results = table.search(query_vector).limit(2).to_polars()
print(results)
{{< /code >}}

{{< code language="typescript" >}}
// Let's search for vectors similar to "wizard"
const queryVector = [0.7, 0.3, 0.5];

const results = await table.search(queryVector).limit(2).toArray();
console.log(results);
{{< /code >}}
```
┌─────┬────────┬─────────────────┬───────────┐
│ id  ┆ text   ┆ vector          ┆ _distance │
│ --- ┆ ---    ┆ ---             ┆ ---       │
│ str ┆ str    ┆ array[f32, 3]   ┆ f32       │
╞═════╪════════╪═════════════════╪═══════════╡
│ 7   ┆ mage   ┆ [0.6, 0.3, 0.4] ┆ 0.02      │
│ 9   ┆ priest ┆ [0.6, 0.2, 0.6] ┆ 0.03      │
└─────┴────────┴─────────────────┴───────────┘
```

The `mage` is the most magical of all our characters!


## 8. What's next?

You've learned how to create a LanceDB database, add data to it, and run vector search to find the
most similar results to your given query embedding. In the real world, embeddings capture meaning and [vector search](/docs/concepts/search/vector-search/) allows you to find the most relevant data based on semantic similarity.

This is just the beginning, and there's a lot more you can do in LanceDB alongside vector search, including full-text search, reranking results, and feature engineering. As a next step, check out the next [tutorial](/docs/quickstart/basic-usage/) on common database operations. Have fun using LanceDB!

## LanceDB Cloud: Fully-managed, serverless vector search

Once your application's scale grows and your needs evolve, you can sign up for **LanceDB Cloud**, a _fully managed_, _serverless_ vector search service that enables you to build, deploy, and scale your applications without any infrastructure management overhead.

It's seamless to switch from the open source version of LanceDB (per the example above) to the cloud version -- all it takes is to swap out the local `uri` for a remote one. You can get started with LanceDB Cloud by following these steps:

1. [Sign up for LanceDB Cloud](https://accounts.lancedb.com/sign-up)
2. [Follow our tutorial video to create a LanceDB Cloud Project](https://app.storylane.io/share/pudefwx54tun) 