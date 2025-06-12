---
title: What is LanceDB?
date: 1970-01-01
draft: false
featured: false
image: /assets/posts/1.png
description: Explore what is lancedb with practical insights and expert guidance from the LanceDB team.
author: Weston Pace
---

Distinguishing between the sea of data technologies can be difficult, and it can be easy to confuse similar concept and libraries.  With this in mind we thought it would be a good idea to help clarify what problems LanceDB is trying to solve, and how it was built to do so.

**LanceDB is a serverless database, designed for modern AI data problems, capable of handling big data, with superior performance for a wide variety of use cases.**

## What are modern AI data problems?

It may be tempting to point our finger at the LLM craze but LanceDB was actually started well before LLMs became ubiquitous.  Our founders were attempting to build a dataset of images and small video clips that could be quickly searched, scanned, and sampled to support training AI models for autonomous vehicles.  There was no readily available solution that could handle this problem.

Since then we've come across many more use cases that aren't solved by traditional data solutions.  In particular:

- AI training workflows need to be able to efficiently and quickly scan the entire dataset for training and analysis.  However, AI inference workflows often need to quickly search and return a small set of results.  This combination of scan and search is not easy to solve and existing databases typically favor one or the other.
- Modern AI solutions need to support image, audio, and video data.  In addition to complex intermediate types such as tensors or vector embeddings.  These complex data types are either not supported by existing solutions or they perform poorly.
- AI developers have unique workflows.  Vector search and full text search can be added onto an existing database but complex solutions can be much more sophisticated than a simple search.  For example, combining the results of semantic search and full text search using a reranking algorithm, incrementally updating a vector index with isolation to prevent slow queries while the new data is being ingested, or recalculating a vector embedding in a distributed fashion.

## Is LanceDB a company, a database, or an open source project?

LanceDB is a [company](https://lancedb.com/company) that aims to modernize the foundational data layer for AI.  LanceDB is also the name of an open source database.  This database, and several other technologies that power it, are open source projects that LanceDB maintains.

### Lance Vs. LanceDB?

The two main open source projects that LanceDB supports are the libraries, [`lance`](https://github.com/lancedb/lance) and [`lancedb`](https://github.com/lancedb/lancedb).  Since both of these libraries are open source and solve similar problems, it can be confusing for new users to pick the right library.

For most users **lancedb** is the library they should use.  It is a database that has been built on top of the lower level lance library.  It offers a number of advantages:

- LanceDB has a simpler API, designed for AI & ML developers, that should be familiar to anyone that has worked with databases before.
- LanceDB adds a number of high level features such as reranking, automatic calculation of embedding, and rich integrations.
- LanceDB is supported in Rust, Node, and Python.

By contrast the **lance **library is a lower level library that implements both the Lance file format and the Lance table format.  It should be used by data engineers and developers that are building their own database or data solution.  The API is more complex and lower level and it requires more prior knowledge to use effectively.  However, the `lance` library is more flexible and powerful and features are typically added to the `lance` library before they are added to `lancedb`.

## Is Lance a Database or Table Format or File Format?

LanceDB is a database that is built on both the Lance table format and the Lance file format.  As a result, it is all three.  We've already described the features of the database in the previous section so we'll shortly breakdown the benefits of the table format and file format.

### Lance Table Format

The Lance table format is inspired by other table formats such as the Delta table format or Iceberg table format.  These other table formats are powerful but are missing a few key features that we needed for LanceDB.

- The Lance table format has first class support for secondary indices.  Most importantly this means we need a primary key that can keep consistent through updates and compactions so that those operations don't require a rewrite of the indices (we plan on blogging more about this soon).
- The Lance table format supports a wide variety of schema evolution options, most of which can be implemented without rewriting existing data.  For example, adding a new column or altering an existing column.
- The Lance table format will soon provide first class support for blobs to handle extremely large data types (e.g. video) which need to be compacted at a different rate.

### Lance File Format

The Lance file format is inspired by other file formats, most notably parquet.  However, similar to the table format, we found the parquet format (and parquet readers) were missing important features needed by LanceDB.  This is discussed more completely in a previous blog post (INSERT LINK).

- The Lance file format gets rid of row groups which are impossible to configure correctly when a file contains multi-modal data.
- The Lance file format supports encodings that are friendly to random access which is extremely important for search use cases.
- The Lance file reader is built to be much smarter about RAM usage, allowing users to scan large data efficiently and without breaking the system.

## Is LanceDB a Vector Index?

Yes and no.  It would be more accurate to say that *LanceDB has a vector index*.  A vector index speeds up searches into a database and isn't so useful by itself.  LanceDB has support for training and searching a variety of vector indices.  Because LanceDB is built on top of proven scalable data lakehouse principles we believe it is the only option that can affordably scale to billions of rows.

## Is LanceDB a Feature Store?

Because LanceDB is a full-fledged database it can also serve as an effective feature store.  In addition to rich schema evolution capabilities described earlier we also support a variety of scalar indices for fast lookups and filters.  In addition, the Lance formats are designed to efficiently scale to very wide schemas with many columns.
