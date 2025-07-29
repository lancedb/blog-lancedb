---
title: "Versioning & Reproducibility in LanceDB"
sidebar_title: "Versioning"
description: "Learn how to implement versioning and ensure reproducibility in LanceDB. Includes version control, data snapshots, and audit trails."
weight: 3
---

LanceDB redefines data management for AI/ML workflows with built-in, 
automatic versioning powered by the [Lance columnar format](https://github.com/lancedb/lance). 
Every table mutation—appends, updates, deletions, or schema changes — is tracked with 
zero configuration, enabling:

- Time-Travel Debugging: Pinpoint production issues by querying historical table states.
- Atomic Rollbacks: Revert terabyte-scale datasets to any prior version in seconds.
- ML Reproducibility: Exactly reproduce training snapshots (vectors + metadata).
- Branching Workflows: Conduct A/B tests on embeddings/models via lightweight table clones.

## Basic Versioning Example

Let's create a table with sample data to demonstrate LanceDB's versioning capabilities:

### Setting Up the Table

First, let's create a table with some sample data:

{{< code language="python" >}}
import lancedb
import pandas as pd
import numpy as np
import pyarrow as pa
from sentence_transformers import SentenceTransformer

# Connect to LanceDB
db = lancedb.connect(
  uri="db://your-project-slug",
  api_key="your-api-key",
  region="us-east-1"
)

# Create a table with initial data
table_name = "quotes_versioning_example"
data = [
    {"id": 1, "author": "Richard", "quote": "Wubba Lubba Dub Dub!"},
    {"id": 2, "author": "Morty", "quote": "Rick, what's going on?"},
    {
        "id": 3,
        "author": "Richard",
        "quote": "I turned myself into a pickle, Morty!",
    },
]

# Define schema
schema = pa.schema(
    [
        pa.field("id", pa.int64()),
        pa.field("author", pa.string()),
        pa.field("quote", pa.string()),
    ]
)

table = db.create_table(table_name, data, schema=schema, mode="overwrite")
{{< /code >}}

{{< code language="typescript" >}}
import * as lancedb from "@lancedb/lancedb";
import {
  Schema,
  Field,
  Utf8,
  Int64,
} from "apache-arrow";

// Connect to LanceDB
const db = await lancedb.connect({
  uri: "db://your-project-slug",
  apiKey: "your-api-key",
  region: "us-east-1"
});

// Create a table with initial data
const tableName = "quotes_versioning_example-ts";

const data = [
  {
    id: 1,
    author: "Richard",
    quote: "Wubba Lubba Dub Dub!",
  },
  {
    id: 2,
    author: "Morty",
    quote: "Rick, what's going on?",
  },
  {
    id: 3,
    author: "Richard",
    quote: "I turned myself into a pickle, Morty!",
  },
];

const schema = new Schema([
  new Field("author", new Utf8()),
  new Field("quote", new Utf8()),
  new Field("id", new Int64()),
]);

const table = await db.createTable(tableName, data, {
  schema,
  mode: "overwrite",
});
{{< /code >}}

### Checking Initial Version

After creating the table, let's check the initial version information:

{{< code language="python" >}}
# View the initial version
versions = table.list_versions()
print(f"Number of versions after creation: {len(versions)}")
print(f"Current version: {table.version}")
{{< /code >}}

{{< code language="typescript" >}}
// View the initial version
const versions = await table.listVersions();
const versionCountInitial = versions.length;
const initialVersion = await table.version();
console.log(`Number of versions after creation: ${versionCountInitial}`);
console.log(`Current version: ${initialVersion}`);
{{< /code >}}

## Modifying Data

When you modify data through operations like update or delete, LanceDB automatically creates new versions.

### Updating Existing Data

Let's update some existing records to see versioning in action:

{{< code language="python" >}}
# Update author names to be more specific
table.update(where="author='Richard'", values={"author": "Richard Daniel Sanchez"})
rows_after_update = table.count_rows()
print(f"Number of rows after update: {rows_after_update}")
{{< /code >}}

{{< code language="typescript" >}}
// Update author names to be more specific
await table.update({
  where: "author='Richard'",
  values: { author: "Richard Daniel Sanchez" },
});
const rowsAfterUpdate = await table.countRows();
console.log(`Number of rows after update: ${rowsAfterUpdate}`);
{{< /code >}}

### Adding New Data

Now let's add more records to the table:

{{< code language="python" >}}
# Add more data
more_data = [
    {
        "id": 4,
        "author": "Richard Daniel Sanchez",
        "quote": "That's the way the news goes!",
    },
    {"id": 5, "author": "Morty", "quote": "Aww geez, Rick!"},
]
table.add(more_data)
{{< /code >}}

{{< code language="typescript" >}}
// Add more data
const moreData = [
  {
    id: 4,
    author: "Richard Daniel Sanchez",
    quote: "That's the way the news goes!",
  },
  {
    id: 5,
    author: "Morty",
    quote: "Aww geez, Rick!",
  },
];
await table.add(moreData);
{{< /code >}}

### Checking Version Changes

Let's see how the versions have changed after our modifications:

{{< code language="python" >}}
# Check versions after modifications
versions = table.list_versions()
version_count_after_mod = len(versions)
version_after_mod = table.version
print(f"Number of versions after modifications: {version_count_after_mod}")
print(f"Current version: {version_after_mod}")
{{< /code >}}

{{< code language="typescript" >}}
// Check versions after modifications
const versionsAfterMod = await table.listVersions();
const versionCountAfterMod = versionsAfterMod.length;
const versionAfterMod = await table.version();
console.log(`Number of versions after modifications: ${versionCountAfterMod}`);
console.log(`Current version: ${versionAfterMod}`);
{{< /code >}}

## Tracking Changes in Schema

LanceDB's versioning system automatically tracks every schema modification. This is critical when handling evolving embedding models. For example, adding a new `vector_minilm` column creates a fresh version, enabling seamless A/B testing between embedding generations without recreating the table.

### Preparing Data for Embeddings

First, let's get the data we want to embed:

{{< code language="python" >}}
import pyarrow as pa

# Get data from table
df = table.search().limit(5).to_pandas()
{{< /code >}}

{{< code language="typescript" >}}
// Get data from table
const df = await table.query().limit(5).toArray()
{{< /code >}}

### Generating Embeddings

Now let's generate embeddings using the all-MiniLM-L6-v2 model:

{{< code language="python" >}}
# Let's use "all-MiniLM-L6-v2" model to embed the quotes
model = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")

# Generate embeddings for each quote and pair with IDs
vectors = model.encode(
    df["quote"].tolist(), convert_to_numpy=True, normalize_embeddings=True
)
vector_dim = vectors[0].shape[0]
print(f"Vector dimension: {vector_dim}")

# Add IDs to vectors array with proper column names
vectors_with_ids = [
    {"id": i + 1, "vector_minilm": vec.tolist()} for i, vec in enumerate(vectors)
]
{{< /code >}}

{{< code language="typescript" >}}
let vectorDim = 0;
try {
  // Let's use all-MiniLM-L6-v2 model to embed the quotes
  console.log("Generating embeddings with transformers...");
  const { pipeline } = await import("@xenova/transformers");
  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2",
  );

  // Generate embeddings for all quotes
  const quotes = df.map((row) => row.quote);
  const outputs = await Promise.all(
    quotes.map((quote) =>
      extractor(quote, {
        pooling: "mean",
        normalize: true,
      }),
    ),
  );
  const embeddings = outputs.map((output) => Array.from(output.data));
  vectorDim = embeddings[0].length;
  console.log(`Vector dimension: ${vectorDim}`);

  // Create embedding_with_id for all quotes
  const embedding_with_id = df.map((row, i) => ({
    id: row.id,
    vector_minilm: embeddings[i],
  }));
{{< /code >}}

### Adding Vector Column to Schema

Now let's add the vector column to our table schema:

{{< code language="python" >}}
# Add vector column and merge data
table.add_columns(
  {"vector_minilm": f"arrow_cast(NULL, 'FixedSizeList({vector_dim}, Float32)')"}
)

table.merge_insert(
  "id"
).when_matched_update_all().when_not_matched_insert_all().execute(vectors_with_ids)
{{< /code >}}

{{< code language="typescript" >}}
  // Add the vector column to the table
  await table.addColumns([
    {
      name: "vector_minilm",
      valueSql: `arrow_cast(NULL, 'FixedSizeList(${vectorDim}, Float32)')`,
    },
  ]);

  // Update all rows with their embeddings
  await table
    .mergeInsert("id")
    .whenMatchedUpdateAll()
    .whenNotMatchedInsertAll()
    .execute(embedding_with_id);
} catch (error) {
  console.log(
    "Failed to load transformers, using dummy vectors instead:",
    error,
  );
  // Create dummy embeddings for all quotes
  const dummyEmbeddings = df.map(() => Array(vectorDim).fill(10));
  const embedding_with_id = df.map((row, i) => ({
    id: row.id,
    vector: dummyEmbeddings[i],
  }));
  await table
    .mergeInsert("id")
    .whenMatchedUpdateAll()
    .whenNotMatchedInsertAll()
    .execute(embedding_with_id);
}
{{< /code >}}

### Checking Version Changes After Schema Modification

Let's see how the schema change affected our versioning:

{{< code language="python" >}}
# Check versions after schema change
versions = table.list_versions()
version_count_after_embed = len(versions)
version_after_embed = table.version
print(f"Number of versions after adding embeddings: {version_count_after_embed}")
print(f"Current version: {version_after_embed}")

# Verify the schema change
# The table should now include a vector_minilm column containing
# embeddings generated by the all-MiniLM-L6-v2 model
print(table.schema)
{{< /code >}}

{{< code language="typescript" >}}
// Check versions after embedding addition
const versionsAfterEmbed = await table.listVersions();
const versionCountAfterEmbed = versionsAfterEmbed.length;
const versionAfterEmbed = await table.version();
console.log(
  `Number of versions after adding embeddings: ${versionCountAfterEmbed}`,
);
console.log(`Current version: ${versionAfterEmbed}`);

// Verify the schema change
// The table should now include a vector_minilm column containing
// embeddings generated by the all-MiniLM-L6-v2 model
console.log(await table.schema())
{{< /code >}}

## Rollback to Previous Versions

LanceDB supports fast rollbacks to any previous version without data duplication.

### Viewing All Versions

First, let's see all the versions we've created:

{{< code language="python" >}}
# Let's see all versions
versions = table.list_versions()
for v in versions:
    print(f"Version {v['version']}, created at {v['timestamp']}")
{{< /code >}}

{{< code language="typescript" >}}
// Let's see all versions
const allVersions = await table.listVersions();
allVersions.forEach(v => {
  console.log(`Version ${v.version}, created at ${v.timestamp}`);
});
{{< /code >}}

### Rolling Back to a Previous Version

Now let's roll back to before we added the vector column:

{{< code language="python" >}}
# Let's roll back to before we added the vector column
# We'll use the version after modifications but before adding embeddings
table.restore(version_after_mod)

# Notice we have one more version now, not less!
versions = table.list_versions()
version_count_after_rollback = len(versions)
print(f"Total number of versions after rollback: {version_count_after_rollback}")
{{< /code >}}

{{< code language="typescript" >}}
// Let's roll back to before we added the vector column
// We'll use the version after modifications but before adding embeddings
await table.checkout(versionAfterMod);
await table.restore();

// Notice we have one more version now, not less!
const versionsAfterRollback = await table.listVersions();
const versionCountAfterRollback = versionsAfterRollback.length;
console.log(
  `Total number of versions after rollback: ${versionCountAfterRollback}`,
);
{{< /code >}}

## Making Changes from Previous Versions

After restoring a table to an earlier version, you can continue making modifications. In this example, we rolled back to a version before adding embeddings. This allows us to experiment with different embedding models and compare their performance.

### Switching to a Different Embedding Model

Let's try a different embedding model (all-mpnet-base-v2) to see how it performs:

{{< code language="python" >}}
# Let's switch to the all-mpnet-base-v2 model to embed the quotes
model = SentenceTransformer("all-mpnet-base-v2", device="cpu")

# Generate embeddings for each quote and pair with IDs
vectors = model.encode(
    df["quote"].tolist(), convert_to_numpy=True, normalize_embeddings=True
)
vector_dim = vectors[0].shape[0]
print(f"Vector dimension: {vector_dim}")

# Add IDs to vectors array with proper column names
vectors_with_ids = [
    {"id": i + 1, "vector_mpnet": vec.tolist()} for i, vec in enumerate(vectors)
]
{{< /code >}}

{{< code language="typescript" >}}
try {
  // Let's switch to the all-mpnet-base-v2 model to embed the quotes
  console.log("Generating embeddings with transformers...");
  const { pipeline } = await import("@xenova/transformers");
  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-mpnet-base-v2",
  );

  // Generate embeddings for all quotes
  const quotes = df.map((row) => row.quote);
  const outputs = await Promise.all(
    quotes.map((quote) =>
      extractor(quote, {
        pooling: "mean",
        normalize: true,
      }),
    ),
  );
  const embeddings = outputs.map((output) => Array.from(output.data));
  vectorDim = embeddings[0].length;
  console.log(`Vector dimension: ${vectorDim}`);

  // Create embedding_with_id for all quotes
  const embedding_with_id = df.map((row, i) => ({
    id: row.id,
    vector_mpnet: embeddings[i],
  }));
{{< /code >}}

### Adding the New Vector Column

Now let's add the new vector column with the different model:

{{< code language="python" >}}
# Add vector column and merge data
table.add_columns(
    {"vector_mpnet": f"arrow_cast(NULL, 'FixedSizeList({vector_dim}, Float32)')"}
)

table.merge_insert(
    "id"
).when_matched_update_all().when_not_matched_insert_all().execute(vectors_with_ids)
{{< /code >}}

{{< code language="typescript" >}}
  // Add the vector column to the table
  await table.addColumns([
    {
      name: "vector_mpnet",
      valueSql: `arrow_cast(NULL, 'FixedSizeList(${vectorDim}, Float32)')`,
    },
  ]);

  // Update all rows with their embeddings
  await table
    .mergeInsert("id")
    .whenMatchedUpdateAll()
    .whenNotMatchedInsertAll()
    .execute(embedding_with_id);
} catch (error) {
  console.log(
    "Failed to load transformers, using dummy vectors instead:",
    error,
  );
  // Create dummy embeddings for all quotes
  const dummyEmbeddings = df.map(() => Array(vectorDim).fill(100));
  const embedding_with_id = df.map((row, i) => ({
    id: row.id,
    vector_mpnet: dummyEmbeddings[i],
  }));
  // Add the vector column to the table
  await table.addColumns([
    {
      name: "vector_mpnet",
      valueSql: `arrow_cast(NULL, 'FixedSizeList(${vectorDim}, Float32)')`,
    },
  ]);

  await table
    .mergeInsert("id")
    .whenMatchedUpdateAll()
    .whenNotMatchedInsertAll()
    .execute(embedding_with_id);
}
{{< /code >}}

### Checking Version Changes

Let's see how this new model affects our versioning:

{{< code language="python" >}}
# Check versions after schema change
versions = table.list_versions()
version_count_after_alter_embed = len(versions)
version_after_alter_embed = table.version
print(
    f"Number of versions after switching model: {version_count_after_alter_embed}"
)
print(f"Current version: {version_after_alter_embed}")

# The table should now include a vector_mpnet column containing
# embeddings generated by the all-mpnet-base-v2 model
print(table.schema)
{{< /code >}}

{{< code language="typescript" >}}
// Check versions after schema change
const versionsAfterSchemaChange = await table.listVersions();
const versionCountAfterSchemaChange = versionsAfterSchemaChange.length;
console.log(
  `Total number of versions after schema change: ${versionCountAfterSchemaChange}`,
);

// The table should now include a vector_mpnet column containing
// embeddings generated by the all-mpnet-base-v2 model
console.log(await table.schema())
{{< /code >}}

## Delete Data From the Table

Let's demonstrate how deletions also create new versions:

### Going Back to Latest Version

First, let's return to the latest version:

{{< code language="python" >}}
# Go back to the latest version
table.checkout_latest()
{{< /code >}}

{{< code language="typescript" >}}
// Go back to the latest version
await table.checkoutLatest();
{{< /code >}}

### Deleting Data

Now let's delete some data to see how it affects versioning:

{{< code language="python" >}}
# Let's delete data from the table
table.delete("author != 'Richard Daniel Sanchez'")
rows_after_deletion = table.count_rows()
print(f"Number of rows after deletion: {rows_after_deletion}")
{{< /code >}}

{{< code language="typescript" >}}
// Let's delete data from the table
await table.delete("author != 'Richard Daniel Sanchez'");
const rowsAfterDeletion = await table.countRows();
console.log(`Number of rows after deletion: ${rowsAfterDeletion}`);
{{< /code >}}

### Version History and Operations

Throughout this guide, we've demonstrated various operations that create new versions in LanceDB. 
Here's a summary of the version history we created:

1. **Initial Creation** (v1): Created table with quotes data and basic schema
2. **First Update** (v2): Changed "Richard" to "Richard Daniel Sanchez"
3. **Data Append** (v3): Added new quotes from both characters
4. **Schema Evolution** (v4): Added `vector_minilm` column for embeddings
5. **Embedding Merge** (v5): Populated `vector_minilm` with embeddings
6. **Version Rollback** (v6): Restored to v3 (pre-vector state)
7. **Alternative Schema** (v7): Added `vector_mpnet` column
8. **Alternative Merge** (v8): Populated `vector_mpnet` embeddings
9. **Data Cleanup** (v9): Kept only Richard Daniel Sanchez quotes

Each version represents a distinct state of your data, allowing you to:

- Track changes over time
- Compare different embedding strategies
- Revert to previous states
- Maintain data lineage for ML reproducibility

{{< admonition note "System Operations" >}}
System operations like index updates and table compaction automatically increment the table version number. These background processes are tracked in the version history, though their version numbers are omitted from this example for clarity.
{{< /admonition >}}
