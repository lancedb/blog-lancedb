---
title: November Feature Roundup
date: 2024-12-03
draft: false
featured: false
image: /assets/blog/november-feature-roundup/november-feature-roundup.png
description: Explore november feature roundup with practical insights and expert guidance from the LanceDB team.
author: ["Will Jones"]
---
## Lance

On November 13th, we released Lance 0.19.2. This release includes several new features and improvements, including:

- Flexible handling of data for inserts
- An experimental storage type for video columns and other large blobs
- Full-text search includes not-yet-indexed data

A full list of changes can be found in [the release notes](https://github.com/lancedb/lance/releases/tag/v0.19.2).

### **Inserting data, without the footguns**

Up until now, Lance has been pretty strict about schemas. When you appended to a table:

- You had to provide all the fields in the schema.
- You had to provide them in the same order as the dataset schema.
- You had to match the exact nullability for each field in the schema. If a field was non-nullable in the dataset, providing data with a nullable schema would fail, even if the actual values were never null.

This all changes starting in 0.19.2. Appending data is much more flexible. Now when you append new data:

- You can omit fields from the schema, even nested fields.
- You can provide fields in any order.
- You can provide different but compatible nullability. For example, if a field  is non-nullable in the dataset, you can insert data with a nullable field as  long as the actual values aren't null.

Users could already create tables with missing fields in some rows, as most tools know how to insert nulls:

```python
    import lance
    import pyarrow as pa
    
    data = [
        {"vec": [1.0, 2.0, 3.0], "metadata": {"x": 1, "y": 2}},
        {"metadata": {"x": 3}},
        {"vec": [2.0, 3.0, 5.0], "metadata": {"y": 4}},
    ]
    table = pa.Table.from_pylist(data)
    ds = lance.write_dataset(table, "./demo")
    ds.to_table().to_pandas()

                   vec               metadata
    0  [1.0, 2.0, 3.0]   {'x': 1.0, 'y': 2.0}
    1             None  {'x': 3.0, 'y': None}
    2  [2.0, 3.0, 5.0]  {'x': None, 'y': 4.0}

But what's new is you can create a table that is completely missing some fields and then insert data into the table. Notice how we can omit not only the `vec` field, but also the nested `metadata.x` field:

    new_data = [
        {"metadata": {"y": 6}},
    ]
    new_table = pa.Table.from_pylist(new_data)
    ds = lance.write_dataset(new_table, "./demo", mode="append")
    ds.to_table().to_pandas()

                   vec               metadata
    0  [1.0, 2.0, 3.0]   {'x': 1.0, 'y': 2.0}
    1             None  {'x': 3.0, 'y': None}
    2  [2.0, 3.0, 5.0]  {'x': None, 'y': 4.0}
    3             None    {'x': None, 'y': 6}
```

User feedback has taught us that this development is important for schema evolution. 

In many cases, an existing ETL (Extract, Transform, Load) process is designed to work with a specific schema. If you add a new field to the schema, you must carefully update the ETL process to handle the new field. If not, the ETL process might fail because it doesn't recognize the new field.

With the new ability to insert subschemas, you can now add new fields to the schema without breaking the ETL process. This means you can evolve your schema more easily and with less risk of errors.

This feature was developed by LanceDB engineers Weston Pace (@westonpace) and Will Jones (@wjones127). ([https://github.com/lancedb/lance/pull/3041](https://github.com/lancedb/lance/pull/3041), [https://github.com/lancedb/lance/pull/2467](https://github.com/lancedb/lance/pull/2467))

On top of this feature, we are planning on supporting inserting subschemas using merge insert. (This is tracked in [#2904](https://github.com/lancedb/lance/issues/2904).) Earlier this year, we already added support for updating subschemas using merge insert.

### **Fast analytical queries for video datasets**

0.19.2 introduced an experimental feature to solve a tricky problem: balancing file sizes when column values are very different in size. This is common with unstructured data like videos.

For example:

- An integer column might have values that are only 4 bytes each. With compression, they can be even smaller.
- A video column can have values that are megabytes each and not compressible.

This difference makes it hard to decide how many rows to put in each data file.
Column typeSize per valueRows for 10GBSize of 1 million rowsint324 B2.5 billion4 MBImage (100KB)100 KB100,00010 GBVideo (10MB)10 MB1,00010 PB
For the best performance, we want millions of rows per file for integer columns. A million rows would be just 4 MB without compression. But for video columns, a million rows would be 10 PB per file, which is too large for most storage systems. This means that previously, you had to choose a suboptimal file size for analytical columns if you had any very large columns.

The new balanced storage feature aims to solve this problem. Large columns can be assigned to a new "storage class" called "blob". The blob storage class is kept in separate files from main storage. The main storage will be limited by the default maximum of 1 million rows per file, while the blob storage will be limited by a maximum file size of 90 GB. This allows excellent scan performance for small columns, even if your dataset contains large unstructured data.

To opt into this feature for a particular column, you must add a metadata field to the schema. For example, here's how to construct the PyArrow schema:

```python
    import pyarrow as pa
    
    schema = pa.schema([
        pa.field("int_col", pa.int32()),
        pa.field("video_col", pa.large_binary(), metadata={"lance-schema:storage-class": "blob"}),
    ])
```

This feature is experimental and made available for prototyping. Additional work and testing will be done in the next few months before we will recommend it for production use.

This feature was developed by LanceDB engineer Weston Pace (@westonpace).

### Eliminating the lag to see new data in full text search

Up until now, searching with full text search only included data that was in the table when the index was created or updated. If you added new data to the table, those new rows would be missing from the search results. You could update the index and the results would appear, but this meant a delay between inserting data and being able to search it. It's also different than all other indices in Lance: vector search and scalar indices could both automatically search new data. With 0.19.2, full text search now includes not-yet-indexed data.

```python
    data = pa.table({"animal": ["wild horse", "domestic rabbit"]})
    ds = lance.write_dataset(data, "./demo_fts", mode="overwrite")
    ds.create_scalar_index("animal", index_type="INVERTED")
    ds.to_table(full_text_query="domestic rabbit and horse").to_pandas()

                animal    _score
    0  domestic rabbit  1.386294
    1       wild horse  0.693147

    new_data = pa.table({"animal": ["wild rabbit"]})
    ds = lance.write_dataset(new_data, "./demo_fts", mode="append")
    ds.to_table(full_text_query="domestic rabbit and horse").to_pandas()

                animal    _score
    0  domestic rabbit  1.386294
    1      wild rabbit  0.871385
    2       wild horse  0.693147
```

Eventually, you will still want to update the index to include the new data. This is partially for performance reasons. But importantly it also will improve search results. The search on new data only works for terms that have already been indexed. So if you have a new term that wasn't in any documents previously, searching that term will not return any results until you update the index.

This feature was developed by LanceDB engineer Yang Cen (@BubbleCal). ([#3036](https://github.com/lancedb/lance/pull/3036)). 

## LanceDB

On November 15th, we released LanceDB 0.13.0 (Rust/Node) and LanceDB Python 0.16.0. In addition to the features from Lance 0.19.2, these releases include several improvements to feature parity between the Python, Node, and Rust SDKs.

A full list of changes can be found in the release notes:

- [LanceDB 0.13.0](https://github.com/lancedb/lancedb/releases/tag/v0.13.0)
- [LanceDB Python 0.16.0](https://github.com/lancedb/lancedb/releases/tag/python-v0.16.0)

### Features from Lance

LanceDB 0.13.0 includes all the features from Lance 0.19.2. This includes then ability to insert subschemas and the full-text search improvements.

### Improvements in feature parity

We've made several more improvements to feature parity between the Python, Node, and Rust SDKs this release, which include:

- [Added `Table.optimize` to Python synchronous API](https://github.com/lancedb/lancedb/pull/1769)
- [`fast_search` query added in Python and Node APIs](https://github.com/lancedb/lancedb/pull/1623)
- [`post_filter` is now an option for full-text search queries in Python](https://github.com/lancedb/lancedb/pull/1783)
- [`with_row_id` query option support in Python and Node](https://github.com/lancedb/lancedb/pull/1784)
- [Pass multiple vectors to vector search query](https://github.com/lancedb/lancedb/pull/1811)

### New Rust-based remote client

v0.19.2 also included a major milestone in feature parity: the LanceDB remote client (used to connect to LanceDB Cloud and Enterprise) has been consolidated into a single Rust-based client. Previously Python, Node, and Rust had independent implementations, supporting different features. Now they all use the same underlying implementation, ensuring feature parity now and in the future.
