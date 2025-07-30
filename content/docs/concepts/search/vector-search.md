---
title: "Vector Search in LanceDB"
sidebar_title: Vector Search
description: "Learn how to implement vector search in LanceDB. Includes similarity search, nearest neighbor queries, and performance optimization."
weight: 1
---

Vector search is a technique used to search for similar items based on their vector representations, called embeddings. It is also known as similarity search, nearest neighbor search, or approximate nearest neighbor search.

![](/assets/docs/vector-db-basics.png)

Raw data (e.g. text, images, audio, etc.) is converted into embeddings via an embedding model, which are then stored in a vector database like LanceDB. To perform similarity search at scale, an index is created on the stored embeddings, which can then used to perform fast lookups.

## Supported Distance Metrics

Distance metrics determine how LanceDB compares vectors to find similar matches. Euclidean or `l2` is the default, and used for general-purpose similarity, `cosine` for normalized embeddings, `dot` for raw similarity scores, or `hamming` for binary vectors. 

**Important:** Use the same distance metric that your embedding model was trained with. Most modern embedding models use cosine similarity, so `cosine` is often the best choice.

The right metric improves both search accuracy and query performance. Currently, LanceDB supports the following metrics:

| Metric | Description | Default |
|:-------|:------------|:--------|
| `l2` | [Euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance) - measures the straight-line distance between two points in vector space. Calculated as the square root of the sum of squared differences between corresponding vector components. | ✓ |
| `cosine` | [Cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity) - measures the cosine of the angle between two vectors, ranging from -1 to 1. Computed as the dot product divided by the product of vector magnitudes. | x |
| `dot` | [Dot product](https://en.wikipedia.org/wiki/Dot_product) - calculates the sum of products of corresponding vector components. Provides raw similarity scores without normalization, sensitive to vector magnitudes. | x |
| `hamming` | [Hamming distance](https://en.wikipedia.org/wiki/Hamming_distance) - counts the number of positions where corresponding bits differ between binary vectors. Only applicable to binary vectors stored as packed uint8 arrays. | x |

### Configure Distance Metric

By default, `l2` will be used as metric type. You can specify the metric type as
`cosine` or `dot` if required.

{{< code language="python" >}}
tbl.search(np.random.random((1536))).distance_type("cosine").limit(10).to_list()
{{< /code >}}

{{< code language="typescript" >}}
const results2 = await (
  tbl.search(Array(128).fill(1.2)) as lancedb.VectorQuery
)
  .distanceType("cosine")
  .limit(10)
  .toArray();
{{< /code >}}

Here you can see the same search but using `cosine` similarity instead of `l2` distance. The result focuses on vector direction rather than absolute distance, which works better for normalized embeddings.

## Vector Search With ANN Index

Instead of performing an exhaustive search on the entire database for each and every query, approximate nearest neighbour (ANN) algorithms use an index to narrow down the search space, which significantly reduces query latency. 

The trade-off is that the results are not guaranteed to be the true nearest neighbors of the query, but are usually "good enough" for most use cases.

Use ANN search for large-scale applications where speed matters more than perfect recall. LanceDB uses approximate nearest neighbor algorithms to deliver fast results without examining every vector in your dataset.

### Vector Search with Prefiltering

This is the default vector search setting. You can use prefiltering to boost query performance by reducing the search space before vector calculations begin. The system first applies your filter criteria to the dataset, then conducts vector search operations only on the remaining relevant subset.

{{< code language="python" >}}
import lancedb
from datasets import load_dataset

# Connect to LanceDB
db = lancedb.connect(
  uri="db://your-project-slug",
  api_key="your-api-key",
  region="us-east-1"
)

# Load query vector from dataset
query_dataset = load_dataset("sunhaozhepy/ag_news_sbert_keywords_embeddings", split="test[5000:5001]")
print(f"Query keywords: {query_dataset[0]['keywords']}")
query_embed = query_dataset["keywords_embeddings"][0]

# Open table and perform search
table_name = "lancedb-cloud-quickstart"
table = db.open_table(table_name)

# Vector search with filters (pre-filtering is the default)
search_results = (
    table.search(query_embed)
    .where("label > 2")
    .select(["text", "keywords", "label"])
    .limit(5)
    .to_pandas()
)

print("Search results (with pre-filtering):")
print(search_results)
{{< /code >}}
{{< code language="typescript" >}}
import * as lancedb from "@lancedb/lancedb";

// Connect to LanceDB
const db = await lancedb.connect({
  uri: "db://your-project-slug",
  apiKey: "your-api-key",
  region: "us-east-1"
});

// Generate a sample 768-dimension embedding vector (typical for BERT-based models)
// In real applications, you would get this from an embedding model
const dimensions = 768;
const queryEmbed = Array.from({ length: dimensions }, () => Math.random() * 2 - 1);

// Open table and perform search
const tableName = "lancedb-cloud-quickstart";
const table = await db.openTable(tableName);

// Vector search with filters (pre-filtering is the default)
const vectorResults = await table.search(queryEmbed)
  .where("label > 2")
  .select(["text", "keywords", "label"])
  .limit(5)
  .toArray();

console.log("Search results (with pre-filtering):");
console.log(vectorResults);
{{< /code >}}

This filters out rows where label ≤ 2 before doing vector search, then picks specific columns from the top 5 matches. 

The `.where("label > 2")` applies a filter before vector search, `.select(["text", "keywords", "label"])` chooses specific columns to return, and `.limit(5)` restricts results to the top `5` most similar vectors. 

As a result, you'll see a pandas DataFrame with just the data you want from the most similar vectors.

### Vector Search with Postfiltering

Use postfiltering to prioritize vector similarity by searching the full dataset first, then applying metadata filters to the top results. This approach ensures you get the most similar vectors before filtering, which can be crucial when similarity is more important than metadata constraints.

{{< code language="python" >}}
results_post_filtered = (
    table.search(query_embed)
    .where("label > 1", prefilter=False)
    .select(["text", "keywords", "label"])
    .limit(5)
    .to_pandas()
)

print("Vector search results with post-filter:")
print(results_post_filtered)
{{< /code >}}
{{< code language="typescript" >}}
const vectorResultsWithPostFilter = await (table.search(queryEmbed) as VectorQuery)
  .where("label > 2")
  .postfilter()
  .select(["text", "keywords", "label"])
  .limit(5)
  .toArray();

console.log("Vector search results with post-filter:");
console.log(vectorResultsWithPostFilter);
{{< /code >}}

Here you can see how to do vector search first to get the most similar vectors, then filter by label > 1 on those results. 

The `prefilter=False` parameter tells LanceDB to apply the filter after vector search instead of before, `.where("label > 1")` filters the top results by metadata, and `.select()` chooses which columns to include. 

In the end, you receive a pandas DataFrame with the best matches that also meet your metadata requirements.

**Read more:** [Filtering](../reference/postfiltering.md)

## Multivector Search 

Use multivector search when your documents contain multiple embeddings and you need sophisticated matching between query and document vector pairs. The late interaction approach finds the most relevant combinations across all available embeddings and provides nuanced similarity scoring.

Only `cosine` similarity is supported as the distance metric for multivector search operations.

{{< code language="python" >}}
query_multi = np.random.random(size=(2, 256))
results_multi = tbl.search(query_multi).limit(5).to_pandas()
{{< /code >}}

Here you can see how to take 2 query vectors and find the best matching pairs between them and document vectors using late interaction. The `np.random.random(size=(2, 256))` creates a 2×256 array with two random query vectors, `.limit(5)` returns the top 5 best document-query combinations, and `.to_pandas()` provides results in a DataFrame format. 

**Read more:** [Multivector Search](../reference/multivector-search.md)

## Advanced Search Scenarios

### Search With Distance Range

Use `distance_range` search when you need vectors within particular similarity bounds rather than just the closest neighbors. The system filters results to only include vectors that fall within your specified distance thresholds from the query.

{{< code language="python" >}}
query = np.random.random(256)

# Search for the vectors within the range of [0.1, 0.5)
tbl.search(query).distance_range(0.1, 0.5).to_arrow()

# Search for the vectors with the distance less than 0.5
tbl.search(query).distance_range(upper_bound=0.5).to_arrow()

# Search for the vectors with the distance greater or equal to 0.1
tbl.search(query).distance_range(lower_bound=0.1).to_arrow()
{{< /code >}}
{{< code language="typescript" >}}
import * as lancedb from "@lancedb/lancedb";

const results3 = await (
  tbl.search(Array(128).fill(1.2)) as lancedb.VectorQuery
)
  .distanceType("cosine")
  .distanceRange(0.1, 0.2)
  .limit(10)
  .toArray();
{{< /code >}}

This shows three ways to search within distance ranges: bounded, upper bound only, and lower bound only. 

The `distance_range()` method filters results by similarity thresholds - the first example finds vectors with distance between `0.1` and `0.5`, the second finds vectors closer than `0.5`, and the third finds vectors farther than `0.1`. 

Each approach returns Arrow tables with vectors that fall within your specified distance thresholds.

### Search With Binary Vectors

Use binary vector search for scenarios involving binary embeddings, such as those produced by hashing algorithms. The system stores these efficiently as packed uint8 arrays and uses Hamming distance calculations to determine vector similarity.

{{< admonition tip >}}
The dim of the binary vector must be a multiple of 8. A vector of dim 128 will be stored as a uint8 array of size 16.
{{< /admonition >}}

{{< code language="python" >}}
import lancedb
import numpy as np
import pyarrow as pa
import pytest

db = lancedb.connect("data/binary_lancedb")
schema = pa.schema(
    [
        pa.field("id", pa.int64()),
        # for dim=256, lance stores every 8 bits in a byte
        # so the vector field should be a list of 256 / 8 = 32 bytes
        pa.field("vector", pa.list_(pa.uint8(), 32)),
    ]
)
tbl = db.create_table("my_binary_vectors", schema=schema)

data = []
for i in range(1024):
    vector = np.random.randint(0, 2, size=256)
    # pack the binary vector into bytes to save space
    packed_vector = np.packbits(vector)
    data.append(
        {
            "id": i,
            "vector": packed_vector,
        }
    )
tbl.add(data)

query = np.random.randint(0, 2, size=256)
packed_query = np.packbits(query)
tbl.search(packed_query).distance_type("hamming").to_arrow()
{{< /code >}}

{{< code language="typescript" >}}
import * as lancedb from "@lancedb/lancedb";

import { Field, FixedSizeList, Int32, Schema, Uint8 } from "apache-arrow";

const schema = new Schema([
  new Field("id", new Int32(), true),
  new Field("vec", new FixedSizeList(32, new Field("item", new Uint8()))),
]);
const data = lancedb.makeArrowTable(
  Array(1_000)
    .fill(0)
    .map((_, i) => ({
      // the 256 bits would be store in 32 bytes,
      // if your data is already in this format, you can skip the packBits step
      id: i,
      vec: lancedb.packBits(Array(256).fill(i % 2)),
    })),
  { schema: schema },
);

const tbl = await db.createTable("binary_table", data);
await tbl.createIndex("vec", {
  config: lancedb.Index.ivfFlat({
    numPartitions: 10,
    distanceType: "hamming",
  }),
});

      const query = Array(32)
        .fill(1)
        .map(() => Math.floor(Math.random() * 255));
      const results = await tbl.query().nearestTo(query).limit(10).toArrow();
      // --8<-- [end:search_binary_data
      expect(results.numRows).toBe(10);
    }
  });
});
{{< /code >}}

Here you can see how to set up a table for binary vectors, pack them efficiently into bytes, and search using Hamming distance. 

The schema defines a 32-byte vector field (256 bits ÷ 8), `np.random.randint(0, 2, size=256)` creates binary vectors, `np.packbits()` compresses them to bytes, and `.distance_type("hamming")` specifies `hamming` distance for similarity calculation. 

The search produces an Arrow table with binary vectors ranked by how many bits differ from the query.

## Scaling Vector Search

### Batch Search

Use batch search to handle multiple query vectors simultaneously. This gives you significant efficiency gains over individual queries. LanceDB processes all vectors in parallel and organizes results with a `query_index` field that maps each result set back to its originating query.

{{< code language="python" >}}
# Load a batch of query embeddings
query_dataset = load_dataset(
    "sunhaozhepy/ag_news_sbert_keywords_embeddings", split="test[5000:5005]"
)
query_embeds = query_dataset["keywords_embeddings"]
batch_results = table.search(query_embeds).limit(5).to_pandas()
print(batch_results)
{{< /code >}}
{{< code language="typescript" >}}
 // Batch query
console.log("Performing batch vector search...");
const batchSize = 5;
const queryVectors = Array.from(
  { length: batchSize },
  () => Array.from(
    { length: dimensions },
    () => Math.random() * 2 - 1,
  ),
);
let batchQuery = table.search(queryVectors[0]) as VectorQuery;
for (let i = 1; i < batchSize; i++) {
  batchQuery = batchQuery.addQueryVector(queryVectors[i]);
}
const batchResults = await batchQuery
  .select(["text", "keywords", "label"])
  .limit(5)
  .toArray();
console.log("Batch vector search results:");
console.log(batchResults);
{{< /code >}}

This takes 5 query embeddings and finds the top 5 matches for each one in a single batch operation. 

The `load_dataset()` loads embeddings from a Hugging Face dataset, `query_embeds` contains `5` query vectors, and `.search(query_embeds)` processes all queries simultaneously. 

The final result is a pandas DataFrame with all results, including a `query_index` to tell you which query each result came from.

{{< admonition tip "Batch Query Results" >}}
When processing batch queries, the results include a `query_index` field 
to explicitly associate each result set with its corresponding query in 
the input batch. 
{{< /admonition >}}

### Search With Asynchronous Indexing

To optimize for speed over completeness, enable the `fast_search` flag in your query to skip searching unindexed data.

While vector indexing occurs asynchronously, newly added vectors are immediately 
searchable through a fallback brute-force search mechanism. This ensures zero 
latency between data insertion and searchability, though it may temporarily 
increase query response times. 

{{< code language="python" >}}
table.search(embedding, fast_search=True).limit(5).to_pandas()
{{< /code >}}
{{< code language="typescript" >}}
await table
  .query()
  .nearestTo(embedding)
  .fastSearch()
  .limit(5)
  .toArray();
{{< /code >}}

Here you can see how to turn on fast search mode to skip unindexed vectors and only look through indexed data for speed. 

The `fast_search=True` parameter tells LanceDB to only search indexed vectors, skipping any recently added data that hasn't been indexed yet. 

You'll obtain a pandas DataFrame with the top `5` matches from indexed vectors, but might miss data that was just added.


## Brute Force Search

### Search With No Index

The simplest way to perform vector search is to perform a brute force search, without an index, where the distance between the query vector and all the vectors in the database are computed, with the top-k closest vectors returned. 

This is equivalent to a k-nearest neighbours (kNN) search in vector space.

Choose brute force search when you need guaranteed 100% recall, typically with smaller datasets where query speed isn't the primary concern. The system scans every vector in the table and calculates precise distances to find the exact nearest neighbors.

{{< code language="python" >}}
tbl.search(np.random.random((1536))).limit(3).to_list()
{{< /code >}}
{{< code language="typescript" >}}
import * as lancedb from "@lancedb/lancedb";

const db = await lancedb.connect(databaseDir);
const tbl = await db.openTable("my_vectors");

const results1 = await tbl.search(Array(128).fill(1.2)).limit(3).toArray();
{{< /code >}}

This carries out a brute force search through every vector in the table to find the 3 closest matches to a random 1536-dimensional query. You'll get back a list of the most similar vectors with exact distances.

![](/assets/docs/knn_search.png)

As you can imagine, the brute force approach is not scalable for datasets larger than a few hundred thousand vectors, as the latency of the search grows linearly with the size of the dataset. This is where approximate nearest neighbour (ANN) algorithms come in.

### Bypass the Vector Index

Use `bypass_vector_index` to get exact, ground-truth results by performing exhaustive searches across all vectors. Instead of relying on approximate methods, the system directly compares your query against every vector in the table, ensuring 100% recall at the cost of increased query time.

{{< code language="python" >}}
table.search(embedding).bypass_vector_index().limit(5).to_pandas()
{{< /code >}}
{{< code language="typescript" >}}
await table
  .query()
  .nearestTo(embedding)
  .bypassVectorIndex()
  .limit(5)
  .toArray();
{{< /code >}}

This skips the approximate index and checks every single vector for exact, ground-truth results. 

The `.bypass_vector_index()` method forces LanceDB to perform an exhaustive search through all vectors instead of using the approximate nearest neighbor index, ensuring exact results but at the cost of slower performance. 

The outcome is a pandas DataFrame with the top 5 exact matches, guaranteeing 100% recall but taking longer to run.

This approach is particularly useful when:
- Evaluating ANN index quality
- Calculating recall metrics to tune `