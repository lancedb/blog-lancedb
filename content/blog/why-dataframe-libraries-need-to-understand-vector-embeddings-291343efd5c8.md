---
title: Open Vector Data Lakes
date: 2023-05-21
draft: false
featured: false
image: /assets/blog/1.png
description: Explore open vector data lakes with practical insights and expert guidance from the LanceDB team.
author: Ziheng Wang
---

This post is an expanded version of the upcoming joint talk [Quokka](https://github.com/marsupialtail/quokka) + [LanceDB](https://github.com/lancedb/lancedb) talk at the [Data+AI Summit](https://www.databricks.com/dataaisummit/) this June.

# Vector embeddings are here to stay

Vector embeddings are here to stay. It is hard to conceive of constructing recommendation system, search engine, or LLM-based app in this day and age without using vector embeddings and approximate/exact nearest neighbor search. Vector embeddings are the easiest way to do retrieval on unstructured data formats like text and images, and there are countless ways to generate them that get better each day.

# Current approaches won’t scale

There are three main reasons that I believe the incumbent vector databases can’t succeed in the long-term.

First and foremost is cost — vector databases today resemble OLTP databases with strong focus on ingest speed, write consistency and point query latency. However, when their size starts to blow up, so do their costs. Just take a look at pricing for Pinecone.

Second is vendor lock-in — with the exception of LanceDB, the long term storage format for vector databases are closed to all analytics tools other than that vector database. Do you really want to lock up such an important part of your data in this way? Or have to store a separate copy?

Third is flexibility — In the structured data world, *data lakes* have become popular as a long-term storage for OLTP stores like Postgres or MySQL. The data lake has much worse transactional performance for online workloads, but support cheap long term storage and relatively efficient querying. Most importantly, the long term storage is in an open format decoupled from the OLTP store, allowing different tools to compete and excel at different tasks, like dashboard reporting or machine learning training. None of this would be possible if your S3 was full of MySQL pages or Postgres WALs.

# We need better vector embedding tools

It’s clear from the get-go that vector embeddings are a whole new data type, and significant changes to current data systems are needed to support them well. Hundreds of millions of investment dollars have poured into making a new generation of databases that are optimized around vectors. Existing SQL/noSQL players like Redis, Elastic, Postgres, Clickhouse, DuckDB have all built extensions that support vector operations. It is certainly a very active space.

However, I want to focus this post on DataFrames, and why they’re currently so bad at handling vector data. It used to be that DataFrame libraries lead databases in features (Python UDFs). However, in the case of vector embeddings, I believe they are falling behind.

## Storage

For starters, there’s no agreement on what the type of vector embeddings should be as a column in a DataFrame. In Pandas, they get cast into an “object” datatype, which is opaque and not amenable to optimizations. Apache Arrow probably has the best idea, representing the vector embeddings as a FixedSizeList datatype (this is what LanceDB uses). Recently it has also introduced the “Tensor” datatype in Release 12.0.0. Unfortunately most people use Polars to operate on Arrow data, and Polars does not support FixedSizeList or Tensor, only List, though there is an ongoing draft [PR](https://github.com/pola-rs/polars/pull/8342) to address this. In Spark we probably will use the ArrayType, which doesn’t enforce length. Concretely this also means that files written by some systems will be unreadable by others, and it’s a nightmare to convert between different dataframe libraries.

## Compute

Once the storage/memory type is settled, we should allow DataFrame-native computations on the vector embedding column. Most people currently just do .to_numpy() on that column from the dataframe and start using ad-hoc numpy/faiss code. Then the resulting numpy array is stitched with other metadata back into a dataframe to continue processing in the relational world.

This is the only option today, but it is quite suboptimal. Imagine having to convert a numerical column to numpy every time you want to do a filter operation. At what point do you ditch the dataframe library altogether and start doing everything in numpy? Of course, .to_numpy() only works on single-machine libraries like Polars and Pandas. If you are using Spark, good luck. Maybe write a UDF or something?

## Bottom line

DataFrame engines should support native operations on vector embedding columns, such as exact/approximate nearest neighbor searches or range searches. Recently, a new format [Lance](https://github.com/eto-ai/lance) has come out as strong alternatives to Parquet that has native support for vector indices. That means any Arrow compatible DataFrame engine can immediately gain vector search capabilities if it was able to push the right syntax down to Lance.

# Quokka’s Vector Operations

As a proof of concept and hopefully an example for other DataFrame engines, I have started implementing vector-embedding-native operations in Quokka.

## What is Quokka

For those unfamiliar, Quokka is a distributed DataFrame system currently largely supporting the Polars API, with an aspiring [SQL](https://github.com/marsupialtail/quokka/blob/master/pyquokka/sql.py) interface. It is fault tolerant and usually much faster than SparkSQL if data fits in memory. You can also use Quokka locally, just do `pip3 install pyquokka` and familiarize yourself with the API [here](https://marsupialtail.github.io/quokka/simple/). Similar to Spark and Polars, Quokka has a lazy API so it can optimize a user's query before running it by pushing down filters, selecting columns early and reordering joins.

Since Quokka is very much based on Polars, the data type for embeddings is currently a Polars List (FixedSizeList is forthcoming). If it encounters data with other formats, it will try to convert them under the hood.

## Lance IO

Quokka supports ingest from the [Lance](https://github.com/eto-ai/lance) format. Lance is an on-disk alternative to Parquet specifically optimized for AI data with an optional vector index built on the vector embedding column. If you are working with vector embedding data, you should strongly consider using Lance.

To read a Lance dataset into a Quokka DataStream, just do `qc.read_lance("vec_data.lance")`. You can also read many Lance datasets on object storage into the same Quokka DataStream: `qc.read_lance("s3://lance_data/*")`.

## Embeddings-related Compute in Quokka

Quokka currently supports just one operation `vector_nn_join` on vector embedding data. You can perform a `vec_nn_join` between a Quokka DataStream and a Polars DataFrame: `a.vec_nn_join(df, vec_column = "vec", k = 1, probe_side = "left")`, assuming `a["vec"]` and `df["vec"]` are vectors. If the `probe_side` is left, this will for every row in the Quokka DataStream find `k` nearest neighbors in the Polars DataFrame based on the vector columns. If the `probe_side` is right, this will find `k` nearest neighbors in the Quokka DataStream for every row in the DataFrame.

But hey! Why can’t we join a DataStream against a DataStream? In Quokka, DataStreams are reserved for very large data sources that don’t fit in memory. A `vector_nn_join` between DataStreams would be extremely computationally expensive even with indexes.

## Push it down!

If the source of the DataStream has indices (Lance), the `vector_nn_join` will be pushed down to be an approximate nearest neighbor search to the source. Otherwise, it will be an exact nearest-neighbor search with the good old `numpy.dot`.

The vector embedding API is very much a work in progress. If people are interested, future APIs under consideration are `vector_range_join` and `vector_groupby` based on clustering. Check out the code examples [here](https://github.com/marsupialtail/quokka/blob/master/apps/vectors/do_lance.py). Contributions welcome!

# What I hope this enables: open vector data lakes

So what would a real vector data lake look like? Vector embeddings should be stored in Parquet, or Lance, as a native data type. Metadata formats such as Delta Lake or Iceberg should support rich indices to be added by the user, and support versioning on these indexes. Query engines such as Trino and SparkSQL should be able to do nearest neighbor search on the vector data, just like how they are able to filter or join relational data.

Of course, vector databases are still needed to provide operational access to the latest data, just like Oracle/Postgres/MySQL. However, old data should be periodically ETL’ed out of those systems to the data lake. Data engineering teams are already experts at doing it.

Quokka is the first system that tries to allow people to do something like this, but I don’t think it will be the last, or the best. Executing on this vision needs collaboration from open data lake formats Iceberg and Delta, file formats like Parquet and query engines like Quokka, Trino and SparkSQL. But the open data community moves fast, and I have high hopes for the future!
