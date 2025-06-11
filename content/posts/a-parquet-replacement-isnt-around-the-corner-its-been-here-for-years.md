---
title: A Parquet Replacement isn't Around the Corner (it's been here for years)
date: 2024-05-15
draft: false
featured: false
categories: ["Engineering"]
image: /assets/posts/1.png
description: Explore a parquet replacement isn't around the corner (it's been here for years) with practical insights and expert guidance from the LanceDB team.
author: Weston Pace
---

At Lance we use a custom file format for storage instead of using [Parquet](https://parquet.apache.org/). This can be quite a terrifying prospect for developers. To understand why this fear is unfounded, let's look at an example data solution that you might find in practice today (or, as we will see, a few years ago).

![Parquet is everywhere](/assets/posts/data-ecosystem-and-parquet.png)

## Parquet is (was) Everywhere

Parquet is used all throughout this solution. It is used for everything from temporary local storage, to inter-process communication, to long term cold storage of data. It is used by many different components and many different languages. This is because Parquet offers two great features:

- It gives reasonable compression, making it a great choice for compressed file transfer or long term storage of data.
- It is a multi-vendor open source standard, with several independent implementations, administered by the Apache Software Foundation, and not going to change or go anywhere anytime soon.

If you were to tell someone developing that solution that you wanted to replace Parquet they would understandably be terrified. The reality though, is that this has been happening already. Let's take a more modern look at the above solution.

![Arrow has replaced Parquet for IPC and in-memory](/assets/posts/data-ecosystem-and-arrow.png)

## The Arrow Ecosystem

The first, and most noticeable change, is that [Arrow](https://arrow.apache.org/) has replaced parquet for IPC and in-memory representation. This is because Arrow data is easy to compute with and tools like [Arrow Flight](https://arrow.apache.org/docs/format/Flight.html) make it easy to transmit efficiently. This, of course, is not a 100% replacement, and since Arrow and Parquet interoperate gracefully it doesn't need to be. Also note that Arrow and Parquet share one big feature:

- It is a multi-vendor open source standard, with several independent implementations, administered by the Apache Software Foundation, and not going to change or go anywhere anytime soon.

This is important because it means that developers can spread these technologies throughout their solution, across many different languages and tools, without fear that they are building a core dependency on something that will go away some day or change on a whim.

## The Final Frontier

There remains one big spot that Arrow has not replaced. This is **bulk storage of data that must be efficiently retrieved**. Parquet has support for statistics pushdown, storage-first encodings like bit-packing, and rich powerful streaming readers. This has made parquet the choice for storage technology in table formats like Iceberg and Delta Lake.

![Data is hard and Parquet is not a panacea](/assets/posts/data-is-hard.png)

However, as it turns out, efficient retrieval from a large dataset is a hard problem. The best solution can often depend on the query workload. This has led to several behaviors.

- Some database implementations, such as Snowflake, use [their own proprietary format](https://docs.snowflake.com/en/user-guide/intro-key-concepts#database-storage) for storage.
- Some implementations, such as DuckDb, can use Parquet, but recommend [their own format](https://duckdb.org/docs/internals/storage.html) for best performance.
- Finally, some implementations use Parquet, but expect Parquet files to be written in a very specific way if you want good performance (correct row group size, must have correct set of new v2 features which are not universally supported) or they might even require a specific implementation of a parquet reader (e.g. only some parquet readers support loading individual pages).

## A New Replacement?

This has led some to speculate that a replacement for Parquet is just around the corner. The emergence of new open formats like our own [Lance](/lance-v2/) and Meta's [Nimble](https://github.com/facebookexternal/nimble) have been pointed to as potential examples. This is problematic for a few reasons:

### Arrow already exists

Parquet took off originally because there was a huge demand for a universal format, not just for the search problem but mainly for the IPC and transitory storage problem. That problem has been solved by Arrow (or is solved well enough by Parquet) and no one wants to replace Arrow.

### There may not be a single solution

The best way to store data is closely related to how you plan on querying the data. As an example, both Lance and Nimble are columnar storage formats but they were both designed with different primary use cases. It may be that one format is flexible enough to tackle all of the use cases but it will be some time before these new formats evolve enough to do so. In the meantime, users may have to pick the appropriate format based on their need.

![Parquet Split](/assets/posts/parquet-split.png)

## What to do?

If this post gives you anxiety then you'll be relieved to know that the solution is a simple application of tried and true software development principles.

### Decouple

Arrow is the universal format. You should only resort to something other than Arrow when you need to solve the "storing large amounts of data for efficient retrieval" problem. In most data solutions that problem only needs to be solved in a very small number of places (e.g. in a search or scan node or in a database). Don't use Parquet (or any other format) if you can get away with using Arrow.

### Abstract

Create an abstraction representing what you need from a file format (e.g. filter + range in / stream of data out). Hide your concrete file implementation behind this abstraction. If you need to switch from Parquet/Lance/Nimble/Whatever to some new format it should have minimal impact.

### Benchmark

Create benchmarks based on your real world use cases. Evaluate different formats based on these benchmarks. If you've done the above steps correctly then this should be straightforward. Pick the best storage format for your use case.
