---
title: "Ingesting Data in LanceDB Tables"
sidebar_title: "Working with Data"
description: "Learn how to update and modify data in LanceDB. Includes incremental updates, batch modifications, and best practices for data maintenance."
weight: 2
aliases: ["/docs/concepts/tables/update/", "/docs/concepts/tables/update", "/docs/tables/sql.md"]
---

Once you have created a table, there are several ways to modify its data. You can:

- Ingest and add new records to your table;
- Update existing records that match specific conditions;
- Use the powerful Merge Insert function for more complex operations like upserting or replacing ranges of data.

These operations allow you to keep your table data current and maintain it exactly as needed for your use case. Let's look at each of these operations in detail.

{{< admonition note >}}
These examples demonstrate common usage patterns. For complete API details and advanced options, refer to our [Python](/docs/api/python/python/) and [TypeScript](/docs/js/globals/) SDK documentation.
{{< /admonition >}}

[^1]: The `vectordb` package is a legacy package that is deprecated in favor of `@lancedb/lancedb`. The `vectordb` package will continue to receive bug fixes and security updates until September 2024. We recommend all new projects use `@lancedb/lancedb`. See the [migration guide](/docs/migration/) for more information.

## Connecting to LanceDB

Before performing any operations, you'll need to connect to LanceDB. The connection method depends on whether you're using LanceDB Cloud or the open source version.

{{< code language="python" >}}
import lancedb

# Connect to LanceDB Cloud
db = lancedb.connect(
    uri="db://your-project-slug",
    api_key="your-api-key",
    region="us-east-1"
)
{{< /code >}}

{{< code language="typescript" >}}
import * as lancedb from "@lancedb/lancedb"

// Connect to LanceDB Cloud
const db = await lancedb.connect({
    uri: "db://your-project-slug",
    apiKey: "your-api-key",
    region: "us-east-1"
});
{{< /code >}}

You can also connect locally using LanceDB OSS:

{{< code language="python" >}}
import lancedb

# Connect to local LanceDB
db = lancedb.connect("./data")  # Local directory for data storage
{{< /code >}}

{{< code language="typescript" >}}
import * as lancedb from "@lancedb/lancedb"

// Connect to local LanceDB
const db = await lancedb.connect("./data");  // Local directory for data storage
{{< /code >}}

## Data Insertion

### Basic Data Insertion

Let's start with the simplest way to insert data into a LanceDB table:

{{< code language="python" >}}
import lancedb
import pyarrow as pa

# connect to LanceDB Cloud
db = lancedb.connect(
    uri="db://your-project-slug",
    api_key="your-api-key",
    region="us-east-1"
)

# create an empty table with schema
data = [
    {"vector": [3.1, 4.1], "item": "foo", "price": 10.0},
    {"vector": [5.9, 26.5], "item": "bar", "price": 20.0},
    {"vector": [10.2, 100.8], "item": "baz", "price": 30.0},
    {"vector": [1.4, 9.5], "item": "fred", "price": 40.0},
]

schema = pa.schema([
    pa.field("vector", pa.list_(pa.float32(), 2)),
    pa.field("item", pa.utf8()),
    pa.field("price", pa.float32()),
])

table_name = "basic_ingestion_example"
table = db.create_table(table_name, schema=schema, mode="overwrite")
table.add(data)
{{< /code >}}

{{< code language="typescript" >}}
import * as lancedb from "@lancedb/lancedb"
import { Schema, Field, Float32, FixedSizeList, Utf8 } from "apache-arrow";

const db = await lancedb.connect({
  uri: "db://your-project-slug",
  apiKey: "your-api-key",
  region: "us-east-1"
});

console.log("Creating table from JavaScript objects");
const data = [
    { vector: [3.1, 4.1], item: "foo", price: 10.0 },
    { vector: [5.9, 26.5], item: "bar", price: 20.0 },
    { vector: [10.2, 100.8], item: "baz", price: 30.0},
    { vector: [1.4, 9.5], item: "fred", price: 40.0},
]

const tableName = "js_objects_example";
const table = await db.createTable(tableName, data, {
    mode: "overwrite"
});

console.log("\nCreating a table with a predefined schema then add data to it");
const tableName2 = "schema_example";

// Define schema
// create an empty table with schema
const schema = new Schema([
    new Field(
    "vector",
    new FixedSizeList(2, new Field("float32", new Float32())),
    ),
    new Field("item", new Utf8()),
    new Field("price", new Float32()),
]);

// Create an empty table with schema
const table2 = await db.createEmptyTable(tableName2, schema, {
    mode: "overwrite",
});

// Add data to the schema-defined table
const data2 = [
    { vector: [3.1, 4.1], item: "foo", price: 10.0 },
    { vector: [5.9, 26.5], item: "bar", price: 20.0 },
    { vector: [10.2, 100.8], item: "baz", price: 30.0},
    { vector: [1.4, 9.5], item: "fred", price: 40.0},
]

await table2.add(data2);
{{< /code >}}

{{< admonition info "Vector Column Type" >}}
The vector column needs to be a pyarrow.FixedSizeList type.
{{< /admonition >}}

### Using Pydantic Models

Pydantic models provide a more structured way to define your table schema:

```python
from lancedb.pydantic import Vector, LanceModel

import pyarrow as pa

# Define a Pydantic model
class Content(LanceModel):
    movie_id: int
    vector: Vector(128)
    genres: str
    title: str
    imdb_id: int

    @property
    def imdb_url(self) -> str:
        return f"https://www.imdb.com/title/tt{self.imdb_id}"

# Create table with Pydantic model schema
table_name = "pydantic_example"
table = db.create_table(table_name, schema=Content, mode="overwrite")
```

### Using Nested Models

You can use nested Pydantic models to represent complex data structures. 
For example, you may want to store the document string and the document source name as a nested Document object:

```python
from pydantic import BaseModel

class Document(BaseModel):
    content: str
    source: str
```

This can be used as the type of a LanceDB table column:

```python
class NestedSchema(LanceModel):
    id: str
    vector: Vector(128)
    document: Document

# Create table with nested schema
table_name = "nested_model_example"
table = db.create_table(table_name, schema=NestedSchema, mode="overwrite")
```

This creates a struct column called `document` that has two subfields called `content` and `source`:

```bash
In [28]: table.schema
Out[28]:
id: string not null
vector: fixed_size_list<item: float>[128] not null
    child 0, item: float
document: struct<content: string not null, source: string not null> not null
    child 0, content: string not null
    child 1, source: string not null
```

### Batch Data Insertion

It is recommended to use iterators to add large datasets in batches when creating 
your table in one go. Data will be automatically compacted for the best query performance.

#### Python Batch Insertion

{{< code language="python" >}}
import pyarrow as pa

def make_batches():
    for i in range(5):  # Create 5 batches
        yield pa.RecordBatch.from_arrays(
            [
                pa.array([[3.1, 4.1], [5.9, 26.5]],
                        pa.list_(pa.float32(), 2)),
                pa.array([f"item{i*2+1}", f"item{i*2+2}"]),
                pa.array([float((i*2+1)*10), float((i*2+2)*10)]),
            ],
            ["vector", "item", "price"],
        )

schema = pa.schema([
    pa.field("vector", pa.list_(pa.float32(), 2)),
    pa.field("item", pa.utf8()),
    pa.field("price", pa.float32()),
])
# Create table with batches
table_name = "batch_ingestion_example"
table = db.create_table(table_name, make_batches(), schema=schema, mode="overwrite")
{{< /code >}}
{{< code language="typescript" >}}
console.log("\nBatch ingestion example with product catalog data");
const tableName = "product_catalog";

// Vector dimension for product embeddings (realistic dimension for text embeddings)
const vectorDim = 128;

// Create random embedding vector of specified dimension
const createRandomEmbedding = (dim: number) => Array(dim).fill(0).map(() => Math.random() * 2 - 1);

// Create table with initial batch of products
const initialBatch = Array(10).fill(0).map((_, i) => ({
    product_id: `PROD-${1000 + i}`,
    name: `Product ${i + 1}`,
    category: ["electronics", "home", "office"][i % 3],
    price: 10.99 + (i * 5.99),
    vector: createRandomEmbedding(vectorDim)
}));

const table = await db.createTable(tableName, initialBatch, { 
    mode: "overwrite"
});

// Second batch - 25 more products
const batch2 = Array(25).fill(0).map((_, i) => ({
    product_id: `PROD-${2000 + i}`,
    name: `Premium Product ${i + 1}`,
    category: ["electronics", "kitchen", "outdoor", "office", "gaming"][i % 5],
    price: 25.99 + (i * 7.49),
    vector: createRandomEmbedding(vectorDim)
}));

await table.add(batch2);

// Third batch - 15 more products in a different category
const batch3 = Array(15).fill(0).map((_, i) => ({
    product_id: `PROD-${3000 + i}`,
    name: `Budget Product ${i + 1}`,
    category: ["essentials", "budget", "basics"][i % 3],
    price: 5.99 + (i * 2.50),
    vector: createRandomEmbedding(vectorDim)
}));

await table.add(batch3);
{{< /code >}}

{{< admonition warning "Batch size" >}}
LanceDB Cloud is a multi-tenant environment with a 100MB payload limit. Adjust your batch size accordingly.
{{< /admonition >}}

## Data Modification

### Update Operations

This can be used to update zero to all rows depending on how many rows match the where clause. The update queries follow the form of a SQL UPDATE statement. The `where` parameter is a SQL filter that matches on the metadata columns. The `values` or `values_sql` parameters are used to provide the new values for the columns.

{{< admonition warning "Warning" >}}
Updating nested columns is not yet supported.
{{< /admonition >}}

| Parameter    | Type   | Description                                                                                                                                                                       |
| ------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `where`      | `str`  | The SQL where clause to use when updating rows. For example, `'x = 2'` or `'x IN (1, 2, 3)'`. The filter must not be empty, or it will error.                                     |
| `values`     | `dict` | The values to update. The keys are the column names and the values are the values to set.                                                                                         |
| `values_sql` | `dict` | The values to update. The keys are the column names and the values are the SQL expressions to set. For example, `{'x': 'x + 1'}` will increment the value of the `x` column by 1. |

{{< admonition info "SQL syntax" >}}
See [SQL filters](/docs/tables/sql/) for more information on the supported SQL syntax.
{{< /admonition >}}

{{< code language="python" >}}
import lancedb
import pandas as pd

# Create a table from a pandas DataFrame
data = pd.DataFrame({"x": [1, 2, 3], "vector": [[1, 2], [3, 4], [5, 6]]})

tbl = db.create_table("test_table", data, mode="overwrite")
# Update the table where x = 2
tbl.update(where="x = 2", values={"vector": [10, 10]})
# Get the updated table as a pandas DataFrame
df = tbl.to_pandas()
print(df)
{{< /code >}}
{{< code language="typescript" >}}
import * as lancedb from "@lancedb/lancedb";

const db = await lancedb.connect("./.lancedb");

const data = [
    {x: 1, vector: [1, 2]},
    {x: 2, vector: [3, 4]},
    {x: 3, vector: [5, 6]},
];
const tbl = await db.createTable("my_table", data)

await tbl.update({ 
    values: { vector: [10, 10] },
    where: "x = 2"
});
{{< /code >}}

Output:

```json
    x  vector
0  1  [1.0, 2.0]
1  3  [5.0, 6.0]
2  2  [10.0, 10.0]
```

### Updating Using SQL 

The `values` parameter is used to provide the new values for the columns as literal values. You can also use the `values_sql` / `valuesSql` parameter to provide SQL expressions for the new values. For example, you can use `values_sql="x + 1"` to increment the value of the `x` column by 1.

```python
# Update the table where x = 2
tbl.update(values_sql={"x": "x + 1"})
print(tbl.to_pandas())
```

Output:

```json
    x  vector
0  2  [1.0, 2.0]
1  4  [5.0, 6.0]
2  3  [10.0, 10.0]
```

{{< admonition info "Note" >}}
When rows are updated, they are moved out of the index. The row will still show up in ANN queries, but the query will not be as fast as it would be if the row was in the index. If you update a large proportion of rows, consider rebuilding the index afterwards.
{{< /admonition >}}

### Delete Operations

Remove rows that match a condition.

{{< code language="python" >}}
table = db.open_table("update_table_example")

# delete data
predicate = "price = 30.0"
table.delete(predicate)
{{< /code >}}
{{< code language="typescript" >}}
table = await db.openTable("update_table_example");

// delete data
const predicate = "price = 30.0";
await table.delete(predicate);
{{< /code >}}

{{< admonition warning "Soft Deletion" >}}
Delete operations soft delete rows. Rows are hard deleted later by compaction and cleanup operations that happen in the background on LanceDB Cloud and Enterprise. The default retention on Cloud is 30 days. During this time, these rows are still accessible to query or restore by accessing old table versions (see [Versioning & Reproducibility in LanceDB](/docs/tables/versioning/)).
{{< /admonition >}}

{{< admonition warning "Index Deletion" >}}
If a table is emptied, its existing indexes are removed. Recreate indexes after ingesting new data.
{{< /admonition >}}

## Merge Operations

The merge insert command is a flexible API that can be used to perform `upsert`, 
`insert_if_not_exists`, and `replace_range_ operations`.

{{< admonition tip "Use scalar indexes to speed up merge insert" >}}
The merge insert command performs a join between the input data and the target table `on` the key you provide. This requires scanning that entire column, which can be expensive for large tables. To speed up this operation, create a scalar index on the join column, which will allow LanceDB to find matches without scanning the whole table.

Read more about scalar indices in the [Scalar Index](/docs/indexing/scalar-index/) guide.
{{< /admonition >}}

{{< admonition tip "HTTP 400 on Merge Insert" >}}
You may receive an HTTP 400 error from merge insert: `Bad request: Merge insert cannot be performed because the number of unindexed rows exceeds the maximum of 10000`. Verify that the scalar index on the join column is up to date before retrying.
{{< /admonition >}}

{{< admonition info "Embedding Functions" >}}
Like the create table and add APIs, the merge insert API will automatically compute embeddings if the table has an embedding definition in its schema. If the input data doesn't contain the source column, or the vector column is already filled, the embeddings won't be computed.
{{< /admonition >}}

### Upsert

`upsert` updates rows if they exist and inserts them if they don't. To do this with merge insert, 
enable both `when_matched_update_all()` and `when_not_matched_insert_all()`.

#### Setting Up the Example Table

{{< code language="python" >}}
# Create example table
users_table_name = "users_example"
table = db.create_table(
    users_table_name,
    [
        {"id": 0, "name": "Alice"},
        {"id": 1, "name": "Bob"},
    ],
    mode="overwrite",
)
print(f"Created users table with {table.count_rows()} rows")
{{< /code >}}
{{< code language="typescript" >}}
// Create example table
const table = await db.createTable("users", [
    { id: 0, name: "Alice" },
    { id: 1, name: "Bob" },
]);
{{< /code >}}

#### Preparing Data for Upsert

{{< code language="python" >}}
# Prepare data for upsert
new_users = [
    {"id": 1, "name": "Bobby"},  # Will update existing record
    {"id": 2, "name": "Charlie"},  # Will insert new record
]
{{< /code >}}
{{< code language="typescript" >}}
// Prepare data for upsert
const newUsers = [
    { id: 1, name: "Bobby" },  // Will update existing record
    { id: 2, name: "Charlie" },  // Will insert new record
];
{{< /code >}}

#### Performing the Upsert Operation

{{< code language="python" >}}
# Upsert by id
(
    table.merge_insert("id")
    .when_matched_update_all()
    .when_not_matched_insert_all()
    .execute(new_users)
)

# Verify results - should be 3 records total
print(f"Total users: {table.count_rows()}")  # 3
{{< /code >}}
{{< code language="typescript" >}}
// Upsert by id
await table
    .mergeInsert("id")
    .whenMatchedUpdateAll()
    .whenNotMatchedInsertAll()
    .execute(newUsers);

// Verify results - should be 3 records total
const count = await table.countRows();
console.log(`Total users: ${count}`);  // 3
{{< /code >}}

### Insert-if-not-exists

This will only insert rows that do not have a match in the target table, thus 
preventing duplicate rows. To do this with merge insert, enable just 
`when_not_matched_insert_all()`.

#### Setting Up the Example Table

{{< code language="python" >}}
# Create example table
table = db.create_table(
    "domains",
    [
        {"domain": "google.com", "name": "Google"},
        {"domain": "github.com", "name": "GitHub"},
    ],
)
{{< /code >}}
{{< code language="typescript" >}}
// Create example table
const table = await db.createTable(
    "domains", 
    [
    { domain: "google.com", name: "Google" },
    { domain: "github.com", name: "GitHub" },
    ]
);
{{< /code >}}

#### Preparing Data for Insert-if-not-exists

{{< code language="python" >}}
# Prepare new data - one existing and one new record
new_domains = [
    {"domain": "google.com", "name": "Google"},
    {"domain": "facebook.com", "name": "Facebook"},
]
{{< /code >}}
{{< code language="typescript" >}}
// Prepare new data - one existing and one new record
const newDomains = [
    { domain: "google.com", name: "Google" },
    { domain: "facebook.com", name: "Facebook" },
];
{{< /code >}}

#### Performing the Insert-if-not-exists Operation

{{< code language="python" >}}
# Insert only if domain doesn't exist
table.merge_insert("domain").when_not_matched_insert_all().execute(new_domains)

# Verify count - should be 3 (original 2 plus 1 new)
print(f"Total domains: {table.count_rows()}")  # 3
{{< /code >}}
{{< code language="typescript" >}}
// Insert only if domain doesn't exist
await table.merge_insert("domain")
    .whenNotMatchedInsertAll()
    .execute(newDomains);

// Verify count - should be 3 (original 2 plus 1 new)
const count = await table.countRows();
console.log(`Total domains: ${count}`);  // 3
{{< /code >}}

### Replace Range

You can also replace a range of rows in the target table with the input data. 
For example, if you have a table of document chunks, where each chunk has both 
a `doc_id` and a `chunk_id`, you can replace all chunks for a given `doc_id` with updated chunks. 

This can be tricky otherwise because if you try to use `upsert` when the new data has fewer 
chunks you will end up with extra chunks. To avoid this, add another clause to delete any chunks 
for the document that are not in the new data, with `when_not_matched_by_source_delete`.

#### Setting Up the Example Table

{{< code language="python" >}}
# Create example table with document chunks
table = db.create_table(
    "chunks",
    [
        {"doc_id": 0, "chunk_id": 0, "text": "Hello"},
        {"doc_id": 0, "chunk_id": 1, "text": "World"},
        {"doc_id": 1, "chunk_id": 0, "text": "Foo"},
        {"doc_id": 1, "chunk_id": 1, "text": "Bar"},
        {"doc_id": 2, "chunk_id": 0, "text": "Baz"},
    ],
)
{{< /code >}}
{{< code language="typescript" >}}
// Create example table with document chunks
const table = await db.createTable(
    "chunks", 
    [
    { doc_id: 0, chunk_id: 0, text: "Hello" },
    { doc_id: 0, chunk_id: 1, text: "World" },
    { doc_id: 1, chunk_id: 0, text: "Foo" },
    { doc_id: 1, chunk_id: 1, text: "Bar" },
    { doc_id: 2, chunk_id: 0, text: "Baz" },
    ]
);
{{< /code >}}

#### Preparing Data for Replace Range

{{< code language="python" >}}
# New data - replacing all chunks for doc_id 1 with just one chunk
new_chunks = [
    {"doc_id": 1, "chunk_id": 0, "text": "Zoo"},
]
{{< /code >}}
{{< code language="typescript" >}}
// New data - replacing all chunks for doc_id 1 with just one chunk
const newChunks = [
    { doc_id: 1, chunk_id: 0, text: "Zoo" }
];
{{< /code >}}

#### Performing the Replace Range Operation

{{< code language="python" >}}
# Replace all chunks for doc_id 1
(
    table.merge_insert(["doc_id"])
    .when_matched_update_all()
    .when_not_matched_insert_all()
    .when_not_matched_by_source_delete("doc_id = 1")
    .execute(new_chunks)
)

# Verify count for doc_id = 1 - should be 1 
print(f"Chunks for doc_id = 1: {table.count_rows('doc_id = 1')}")  # 1
{{< /code >}}
{{< code language="typescript" >}}
// Replace all chunks for doc_id 1
await table.merge_insert(["doc_id"])
    .whenMatchedUpdateAll()
    .whenNotMatchedInsertAll()
    .whenNotMatchedBySourceDelete("doc_id = 1")
    .execute(newChunks);

// Verify count for doc_id = 1 - should be 1 
const count = await table.countRows("doc_id = 1");
console.log(`Chunks for doc_id = 1: ${count}`);  // 1
{{< /code >}}

{{< admonition tip "Batch Size Recommendation" >}}
We suggest the best batch size to be 500k for optimal performance.
{{< /admonition >}}

