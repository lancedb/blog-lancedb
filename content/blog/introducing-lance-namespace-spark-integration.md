---
title: "Manage Lance Tables in Any Catalog using Lance Namespace and Spark"
date: 2025-08-08
draft: false
featured: false
categories: ["Engineering"]
image: /assets/blog/introducing-lance-namespace-spark-integration/preview-image.png
meta_image: /assets/blog/introducing-lance-namespace-spark-integration/preview-image.png
description: "Access and manage your Lance tables in Hive, Glue, Unity Catalog, or any catalog service using Lance Namespace with the latest Lance Spark connector."
author: Jack Ye
author_avatar: "/assets/authors/jack-ye.jpg"
author_bio: "Software Engineer @ LanceDB"
author_github: "jackye1995"
author_linkedin: "https://www.linkedin.com/in/yezhaoqin"
---

Data management in AI and analytics workflows often involves juggling multiple systems and formats. 

Today, we're excited to introduce [Lance Namespace](https://lancedb.github.io/lance/format/namespace/), 
an open specification that standardizes access to collections of [Lance tables](/docs/concepts/tables/), 
making it easier than ever to [integrate Lance](/docs/overview/lance/) with your existing data infrastructure.

## What is Lance Namespace?

Lance Namespace is an open specification built on top of the storage-based Lance table and file format. 
It provides a standardized way for metadata services like Apache Hive MetaStore, Apache Gravitino, Unity Catalog, 
AWS Glue Data Catalog, and others to store and manage Lance tables. 
This means you can seamlessly use Lance tables alongside your existing [data lakehouse infrastructure](/blog/multimodal-lakehouse/).

### Why "Namespace" Instead of "Catalog"?

While the data lake world traditionally uses hierarchical structures with catalogs, databases, and tables, 
the ML and AI communities often prefer flatter organizational models like simple directories.
Lance Namespace embraces this flexibility by providing a multi-level namespace abstraction 
that adapts to your data organization strategy,
whether that's a simple directory structure or a complex multi-level hierarchy.

## Current Implementations and Building Your Own

Lance Namespace currently supports several implementations out of the box:

- **Directory Namespace**: Simple file-based organization
- **REST Namespace**: Connect to any server that is compliant with the [REST specification](https://lancedb.github.io/lance/format/namespace/impls/rest/), including [LanceDB Cloud and LanceDB Enterprise](https://lancedb.com/pricing/).
- **Hive 2.x and 3.x MetaStore**: Integration with Apache Hive
- **AWS Glue Catalog**: Native [AWS Glue](https://aws.amazon.com/glue/) support

### Building Custom Namespaces

You can build your own namespace implementation in two ways:

1. **REST Server**: Implement the Lance REST Namespace OpenAPI specification to create a standardized server that any Lance tool can connect to
2. **Native Implementation**: Build a direct implementation as a library

When deciding between building an adapter (REST server proxying to your metadata service) versus a native implementation, 
consider factors like multi-language support needs, tooling compatibility, security requirements, and performance sensitivity. 
See the [Lance REST Namespace documentation](https://lancedb.github.io/lance/format/namespace/impls/rest/#choosing-between-an-adapter-vs-an-implementation) for detailed guidance on this decision.

## Integration with Apache Spark

One of the most highly requested features in the Lance community that is enabled by Lance Namespace is 
seamless integration with Apache Spark, with the ability to use Lance not just as a data format plugin, 
but as a complete Spark table catalog that users can access and manage Lance tables in Spark, run proper SQL analytics,
and use Spark MLlib in the training process. 
Here we walk through how you can do that now with Lance Namespace.

## Getting Started: A Practical Example

Let's walk through a simple example of using Lance Namespace with Spark to manage and query Lance tables.

If you'd like to get started quickly without worrying about the setup, 
we've prepared a Docker image with everything pre-configured. 
Check out our [Lance Spark Connector Quick Start guide](https://lancedb.github.io/lance/integrations/spark/#quick-start) 
to get up and running in minutes.

### Step 1: Set Up Your Spark Session

First, configure Spark with the Lance Namespace catalog. Here's an example using a directory-based namespace:

```python
from pyspark.sql import SparkSession

# Create a Spark session with Lance catalog
spark = SparkSession.builder \
    .appName("lance-namespace-demo") \
    .config("spark.jars.packages", "com.lancedb:lance-spark-bundle-3.5_2.12:0.0.6") \
    .config("spark.sql.catalog.lance", "com.lancedb.lance.spark.LanceNamespaceSparkCatalog") \
    .config("spark.sql.catalog.lance.impl", "dir") \
    .config("spark.sql.catalog.lance.root", "/path/to/lance/data") \
    .config("spark.sql.defaultCatalog", "lance") \
    .getOrCreate()
```

This creates a Spark catalog `lance` that is configured to talk with the directory at `/path/to/lance/data`,
and also sets it as the default catalog in the current Spark session.

### Step 2: Create and Manage Tables

With the catalog configured, you can now create and manage Lance tables using familiar SQL commands:

```python
# Create a Lance table
spark.sql("""
    CREATE TABLE embeddings (
        id BIGINT,
        text STRING,
        embedding ARRAY<FLOAT>,
        timestamp TIMESTAMP
    )
    TBLPROPERTIES (
      'embedding.arrow.fixed-size-list.size'='3'
    )
""")

# Insert data into the table
spark.sql("""
    INSERT INTO embeddings 
    VALUES 
        (1, 'Hello world', array(0.1, 0.2, 0.3), current_timestamp()),
        (2, 'Lance and Spark', array(0.4, 0.5, 0.6), current_timestamp())
""")
```

Notice that when the user specifies an embedding column `embedding ARRAY<FLOAT>`,
with the table property `'embedding.arrow.fixed-size-list.size'='3'`,
it creates a fixed-size vector column in the underlying Lance format table that is optimized for [vector search performance](/docs/concepts/search/).

### Step 3: Query Your Data

Query Lance tables just like any other Spark table:

```python
# Query using SQL
results = spark.sql("""
    SELECT id, text, size(embedding) as dim
    FROM embeddings
    WHERE id > 0
""")
results.show()

# Or use the DataFrame API
df = spark.table("embeddings")
filtered_df = df.filter(df.id > 0).select("id", "text")
filtered_df.show()
```

### Step 4: Integration with ML Workflows

Lance's columnar format and vector support make it ideal for ML workflows:

```python
from pyspark.sql import functions as F

# Simulate generation of new embeddings
new_embeddings_df = spark.sql("""
    SELECT 
        3 as id,
        'Machine learning with Lance' as text,
        array(0.7, 0.8, 0.9) as embedding,
        current_timestamp() as timestamp
    UNION ALL
    SELECT 
        4 as id,
        'Vector databases are fast' as text,
        array(0.2, 0.4, 0.6) as embedding,
        current_timestamp() as timestamp
""")

# Append new embeddings to the Lance table
new_embeddings_df.writeTo("embeddings").append()

# Verify the combined dataset and compute embedding statistics
spark.sql("""
    SELECT 
        COUNT(*) as total_records,
        ROUND(AVG(aggregate(embedding, 0D, (acc, x) -> acc + x * x)), 3) as avg_l2_norm,
        ROUND(MIN(embedding[0]), 2) as min_first_dim,
        ROUND(MAX(embedding[0]), 2) as max_first_dim
    FROM embeddings
""").show()
```

## Advanced Namespace Configurations

Here are some other configuration examples for connecting to a few Lance namespace implementations:

### Directory Namespace on S3 Cloud Storage

```python
spark = SparkSession.builder \
    .config("spark.sql.catalog.lance.impl", "dir") \
    .config("spark.sql.catalog.lance.root", "s3://bucket/lance-data") \
    .config("spark.sql.catalog.lance.storage.access_key_id", "your-key") \
    .config("spark.sql.catalog.lance.storage.secret_access_key", "your-secret") \
    .getOrCreate()
```

### LanceDB Cloud REST Namespace

```python
spark = SparkSession.builder \
    .config("spark.sql.catalog.lance.impl", "rest") \
    .config("spark.sql.catalog.lance.uri", "https://your-database.api.lancedb.com") \
    .config("spark.sql.catalog.lance.headers.x-api-key", "your-api-key") \
    .getOrCreate()
```

### AWS Glue Namespace

```python
spark = SparkSession.builder \
    .config("spark.sql.catalog.lance.impl", "glue") \
    .config("spark.sql.catalog.lance.region", "us-east-1") \
    .config("spark.sql.catalog.lance.root", "s3://your-bucket/lance") \
    .getOrCreate()
```

## Benefits for AI and Analytics Teams

Lance Namespace with Spark integration brings several key benefits:

1. **Unified Data Management**: Manage Lance tables alongside your existing data assets
2. **Flexibility**: Choose the namespace backend that fits your infrastructure
3. **Performance**: Leverage Lance's table and file format with Spark's distributed processing
4. **Simplicity**: Use familiar SQL and DataFrame APIs
5. **Scalability**: Handle everything from local experiments to production workloads

For more information on [LanceDB's features](/docs/overview/features) and capabilities, check out our [comprehensive documentation](/docs/).

## What's Next?

Lance Namespace is designed to be extensible and community-driven. We're actively working on:

- Additional namespace implementations: Unity Catalog, Apache Gravitino, and Apache Polaris work in progress
- Enhanced [vector search capabilities](/docs/concepts/search/) within Spark
- Tighter integration with ML frameworks with features like data evolution
- Support for more compute engines beyond Spark

If you're interested in [getting started](/docs/quickstart/) with LanceDB or exploring our [enterprise features](/docs/overview/enterprise/), we have comprehensive guides available.

## Thank You to Our Contributors

We'd like to extend our heartfelt thanks to the community members who have contributed to making Lance Namespace 
and the Spark integration a reality:

- **Bryan Keller** from Netflix
- **Drew Gallardo** from AWS
- **Jinglun** and **Vino Yang** from ByteDance

Your contributions have been instrumental in making Lance Namespace a robust solution for the community.

## Get Involved

Lance Namespace is open source and we welcome all kinds of contributions! 
Whether you're interested in adding new namespace implementations, improving the Spark connector,
building integration with more engines, or just trying it out, we'd love to hear from you.

- **Documentation**: [Lance Namespace](https://lancedb.github.io/lance/format/namespace)
- **Documentation**: [Lance Spark Connector](https://lancedb.github.io/lance/integrations/spark)
- **Roadmap**: [Lance Namespace](https://github.com/lancedb/lance-namespace/issues/168)
- **Roadmap**: [Lance Spark Connector](https://github.com/lancedb/lance-spark/issues/47)

## Conclusion

Lance Namespace bridges the gap between modern AI workloads and traditional data infrastructure. 
By providing a standardized way to manage Lance tables and seamless integration with Apache Spark, 
it makes it easier than ever to build scalable AI and analytics pipelines.

Try it out today and let us know what you think! Whether you're building a recommendation system, 
managing embeddings for [RAG applications](/docs/tutorials/rag/), or analyzing large-scale datasets, 
Lance Namespace and Spark provide the foundation you need for success.