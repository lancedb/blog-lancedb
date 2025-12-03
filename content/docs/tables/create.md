---
title: Working With Tables in LanceDB
sidebar_title: "Table Management"
description: Learn about different methods to create tables in LanceDB, including from various data sources and empty tables.
weight: 1
aliases: ["/docs/concepts/tables/create/", "/docs/concepts/tables/create"]
---

In LanceDB, tables store records with a defined schema that specifies column names and types. You can create LanceDB tables from these data formats:

- Pandas DataFrames
- [Polars](https://pola.rs/) DataFrames
- Apache Arrow Tables

The Python SDK additionally supports:

- PyArrow schemas for explicit schema control
- `LanceModel` for Pydantic-based validation

## Create a LanceDB Table

Initialize a LanceDB connection and create a table


{{< code language="python" >}}
import lancedb

uri = "data/sample-lancedb"
db = lancedb.connect(uri)
{{< /code >}}

{{< code language="typescript" >}}
import * as lancedb from "@lancedb/lancedb";
import * as arrow from "apache-arrow";

const uri = "data/sample-lancedb";
const db = await lancedb.connect(uri);
{{< /code >}}

LanceDB allows ingesting data from various sources - `dict`, `list[dict]`, `pd.DataFrame`, `pa.Table` or a `Iterator[pa.RecordBatch]`. Let's take a look at some of the these.

### From list of tuples or dictionaries

{{< code language="python" >}}
data = [
    {"vector": [1.1, 1.2], "lat": 45.5, "long": -122.7},
    {"vector": [0.2, 1.8], "lat": 40.1, "long": -74.1},
]
db.create_table("test_table", data)
db["test_table"].head()
{{< /code >}}

{{< code language="typescript" >}}
import * as lancedb from "@lancedb/lancedb";
const db = await lancedb.connect("data/sample-lancedb");

const _tbl = await db.createTable(
  "myTable",
  [
    { vector: [3.1, 4.1], item: "foo", price: 10.0 },
    { vector: [5.9, 26.5], item: "bar", price: 20.0 },
  ],
  { mode: "overwrite" },
);
{{< /code >}}

### From a Pandas DataFrame

{{< code language="python" >}}
import pandas as pd

data = pd.DataFrame(
    {
        "vector": [[1.1, 1.2, 1.3, 1.4], [0.2, 1.8, 0.4, 3.6]],
        "lat": [45.5, 40.1],
        "long": [-122.7, -74.1],
    }
)
db.create_table("my_table_pandas", data)
db["my_table_pandas"].head()
{{< /code >}}

{{< admonition info "Note" >}}
Data is converted to Arrow before being written to disk. For maximum control over how data is saved, either provide the PyArrow schema to convert to or else provide a PyArrow Table directly.
{{< /admonition >}}

{{< admonition info "Vector Column Type" >}}
The **`vector`** column needs to be a [Vector](/docs/integrations/frameworks/pydantic/#vector-field) (defined as [pyarrow.FixedSizeList](https://arrow.apache.org/docs/python/generated/pyarrow.list_.html)) type.
{{< /admonition >}}

#### From a custom schema

{{< code language="python" >}}
import pyarrow as pa

custom_schema = pa.schema(
    [
        pa.field("vector", pa.list_(pa.float32(), 4)),
        pa.field("lat", pa.float32()),
        pa.field("long", pa.float32()),
    ]
)

tbl = db.create_table("my_table_custom_schema", data, schema=custom_schema)
{{< /code >}}

{{< code language="typescript" >}}
import * as lancedb from "@lancedb/lancedb";
import {
  Schema,
  Field,
  Float32,
  FixedSizeList,
} from "apache-arrow";

const db = await lancedb.connect("data/sample-lancedb");

const customSchema = new Schema([
  new Field("vector", new FixedSizeList(4, new Field("item", new Float32()))),
  new Field("lat", new Float32()),
  new Field("long", new Float32()),
]);

const table = await db.createTable("my_table_custom_schema", data, {
  schema: customSchema,
});
{{< /code >}}

### From a Polars DataFrame

LanceDB supports [Polars](https://pola.rs/), a modern, fast DataFrame library
written in Rust. Just like in Pandas, the Polars integration is enabled by PyArrow
under the hood. A deeper integration between LanceDB Tables and Polars DataFrames
is on the way.

{{< code language="python" >}}
import polars as pl

data = pl.DataFrame(
    {
        "vector": [[3.1, 4.1], [5.9, 26.5]],
        "item": ["foo", "bar"],
        "price": [10.0, 20.0],
    }
)
tbl = db.create_table("my_table_pl", data)
{{< /code >}}

### From an Arrow Table
You can also create LanceDB tables directly from Arrow tables.
LanceDB supports float16 data type!

{{< code language="python" >}}
import pyarrow as pa

import numpy as np

dim = 16
total = 2
schema = pa.schema(
    [pa.field("vector", pa.list_(pa.float16(), dim)), pa.field("text", pa.string())]
)
data = pa.Table.from_arrays(
    [
        pa.array(
            [np.random.randn(dim).astype(np.float16) for _ in range(total)],
            pa.list_(pa.float16(), dim),
        ),
        pa.array(["foo", "bar"]),
    ],
    ["vector", "text"],
)
tbl = db.create_table("f16_tbl", data, schema=schema)
{{< /code >}}

{{< code language="typescript" >}}
import * as lancedb from "@lancedb/lancedb";
import { Schema, Field, Int32, Float16, FixedSizeList } from "apache-arrow";

const db = await lancedb.connect("data/sample-lancedb");
const dim = 16;
const total = 10;
const f16Schema = new Schema([
  new Field("id", new Int32()),
  new Field(
    "vector",
    new FixedSizeList(dim, new Field("item", new Float16(), true)),
    false,
  ),
]);
const data = lancedb.makeArrowTable(
  Array.from(Array(total), (_, i) => ({
    id: i,
    vector: Array.from(Array(dim), Math.random),
  })),
  { schema: f16Schema },
);
const _table = await db.createTable("f16_tbl", data);
{{< /code >}}

### From Pydantic Models

When you create an empty table without data, you must specify the table schema.
LanceDB supports creating tables by specifying a PyArrow schema or a specialized
Pydantic model called `LanceModel`.

For example, the following Content model specifies a table with 5 columns:
`movie_id`, `vector`, `genres`, `title`, and `imdb_id`. When you create a table, you can
pass the class as the value of the `schema` parameter to `create_table`.
The `vector` column is a `Vector` type, which is a specialized Pydantic type that
can be configured with the vector dimensions. It is also important to note that
LanceDB only understands subclasses of `lancedb.pydantic.LanceModel`
(which itself derives from `pydantic.BaseModel`).

{{< code language="python" >}}
from lancedb.pydantic import Vector, LanceModel

import pyarrow as pa

class Content(LanceModel):
    movie_id: int
    vector: Vector(128)
    genres: str
    title: str
    imdb_id: int

    @property
    def imdb_url(self) -> str:
        return f"https://www.imdb.com/title/tt{self.imdb_id}"


tbl = db.create_table("movielens_small", schema=Content)
{{< /code >}}

#### Nested schemas

Sometimes your data model may contain nested objects. For example, you may want to store the document string and the document source name as a nested Document object:

```python
from pydantic import BaseModel

class Document(BaseModel):
    content: str
    source: str
```

This can be used as the type of a LanceDB table column:

{{< code language="python" >}}
class NestedSchema(LanceModel):
    id: str
    vector: Vector(1536)
    document: Document


tbl = db.create_table("nested_table", schema=NestedSchema)
{{< /code >}}

{{< code language="typescript" >}}
import { Struct, Utf8 } from "apache-arrow";

const schema = new Schema([
  new Field("id", new Utf8()),
  new Field(
    "vector",
    new FixedSizeList(1536, new Field("item", new Float32()))
  ),
  new Field(
    "document",
    new Struct([
      new Field("content", new Utf8()),
      new Field("source", new Utf8()),
    ])
  ),
]);

const data = [
    { id: "1", vector: Array(1536).fill(0), document: { content: "foo", source: "bar" } },
];

const table = await db.createTable("nested_table", data, { schema });
{{< /code >}}

This creates a struct column called "document" that has two subfields
called "content" and "source":

{{< code language="bash" >}}
In [28]: tbl.schema
Out[28]:
id: string not null
vector: fixed_size_list<item: float>[1536] not null
    child 0, item: float
document: struct<content: string not null, source: string not null> not null
    child 0, content: string not null
    child 1, source: string not null
{{< /code >}}

#### Validators

Note that neither Pydantic nor PyArrow automatically validates that input data
is of the correct timezone, but this is easy to add as a custom field validator:

{{< code language="python" >}}
from datetime import datetime
from zoneinfo import ZoneInfo

from lancedb.pydantic import LanceModel
from pydantic import Field, field_validator, ValidationError, ValidationInfo

tzname = "America/New_York"
tz = ZoneInfo(tzname)

class TestModel(LanceModel):
    dt_with_tz: datetime = Field(json_schema_extra={"tz": tzname})

    @field_validator('dt_with_tz')
    @classmethod
    def tz_must_match(cls, dt: datetime) -> datetime:
        assert dt.tzinfo == tz
        return dt

ok = TestModel(dt_with_tz=datetime.now(tz))

try:
    TestModel(dt_with_tz=datetime.now(ZoneInfo("Asia/Shanghai")))
    assert 0 == 1, "this should raise ValidationError"
except ValidationError:
    print("A ValidationError was raised.")
    pass
{{< /code >}}

When you run this code it should print "A ValidationError was raised."

#### Pydantic custom types

LanceDB does NOT yet support converting pydantic custom types. If this is something you need,
please file a feature request on the [LanceDB Github repo](https://github.com/lancedb/lancedb/issues/new).

### Using Iterators / Writing Large Datasets

It is recommended to use iterators to add large datasets in batches when creating your table in one go. This does not create multiple versions of your dataset unlike manually adding batches using `table.add()`

LanceDB additionally supports PyArrow's `RecordBatch` Iterators or other generators producing supported data types.

Here's an example using using `RecordBatch` iterator for creating tables.

{{< code language="python" >}}
import pyarrow as pa

def make_batches():
    for i in range(5):
        yield pa.RecordBatch.from_arrays(
            [
                pa.array(
                    [[3.1, 4.1, 5.1, 6.1], [5.9, 26.5, 4.7, 32.8]],
                    pa.list_(pa.float32(), 4),
                ),
                pa.array(["foo", "bar"]),
                pa.array([10.0, 20.0]),
            ],
            ["vector", "item", "price"],
        )


schema = pa.schema(
    [
        pa.field("vector", pa.list_(pa.float32(), 4)),
        pa.field("item", pa.utf8()),
        pa.field("price", pa.float32()),
    ]
)
db.create_table("batched_tale", make_batches(), schema=schema)
{{< /code >}}

{{< code language="typescript" >}}
import { RecordBatch, Vector, Utf8, Float32, List } from "apache-arrow";

async function* makeBatches() {
  for (let i = 0; i < 5; i++) {
    yield new RecordBatch({
      vector: Vector.from({
        values: [
          [3.1, 4.1, 5.1, 6.1],
          [5.9, 26.5, 4.7, 32.8],
        ],
        type: new List(new Float32()),
      }),
      item: Vector.from({ values: ["foo", "bar"], type: new Utf8() }),
      price: Vector.from({ values: [10.0, 20.0], type: new Float32() }),
    });
  }
}

const schema = new Schema([
  new Field("vector", new FixedSizeList(4, new Field("item", new Float32()))),
  new Field("item", new Utf8()),
  new Field("price", new Float32()),
]);

const db = await lancedb.connect("data/sample-lancedb");
await db.createTable("batched_table", makeBatches(), { schema });
{{< /code >}}

You can also use iterators of other types like Pandas DataFrame or Pylists directly in the above example.

## Open existing tables

If you forget the name of your table, you can always get a listing of all table names.

{{< code language="python" >}}
print(db.table_names())
{{< /code >}}

{{< code language="typescript" >}}
console.log(await db.tableNames());
{{< /code >}}

Then, you can open any existing tables.

{{< code language="python" >}}
tbl = db.open_table("test_table")
{{< /code >}}

{{< code language="typescript" >}}
const tbl = await db.openTable("my_table");
{{< /code >}}

## Creating empty table
You can create an empty table for scenarios where you want to add data to the table later. An example would be when you want to collect data from a stream/external file and then add it to a table in batches.

An empty table can be initialized via a PyArrow schema.

{{< code language="python" >}}
import lancedb

import pyarrow as pa

schema = pa.schema(
    [
        pa.field("vector", pa.list_(pa.float32(), 2)),
        pa.field("item", pa.string()),
        pa.field("price", pa.float32()),
    ]
)
tbl = db.create_table("test_empty_table", schema=schema)
{{< /code >}}
{{< code language="typescript" >}}
const schema = new arrow.Schema([
  new arrow.Field("id", new arrow.Int32()),
  new arrow.Field("name", new arrow.Utf8()),
]);

const emptyTbl = await db.createEmptyTable("empty_table", schema);
{{< /code >}}

Alternatively, you can also use Pydantic to specify the schema for the empty table. Note that we do not
directly import `pydantic` but instead use `lancedb.pydantic` which is a subclass of `pydantic.BaseModel`
that has been extended to support LanceDB specific types like `Vector`.

{{< code language="python" >}}
import lancedb

from lancedb.pydantic import Vector, LanceModel

class Item(LanceModel):
    vector: Vector(2)
    item: str
    price: float


tbl = db.create_table("test_empty_table_new", schema=Item.to_arrow_schema())
{{< /code >}}

Once the empty table has been created, you can add data to it, as explained in the next section on [working with data](/docs/tables/update).

## Drop a table

Use the `drop_table()` method on the database to remove a table.

{{< code language="python" >}}
db.drop_table("my_table")
{{< /code >}}
{{< code language="typescript" >}}
await db.dropTable("myTable");
{{< /code >}}

This permanently removes the table and is not recoverable, unlike deleting rows.
By default, if the table does not exist an exception is raised. To suppress this,
you can pass in `ignore_missing=True`.

