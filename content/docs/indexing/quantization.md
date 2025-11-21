---
title: "Quantization"
sidebar_title: Quantization
description: "Learn about quantization when creating an index in LanceDB"
keywords: "quantization, rabitq"
weight: 5
aliases: ["/docs/concepts/indexing/rabitq/"]
---

Quantization compresses high‑dimensional float vectors into a smaller, approximate representation, where instead of storing every vector as a float32 or float64, it's stored in compressed form, without too much of a compromise in search quality.
Quantization is helpful when:
- You have a large dataset of relatively high-dimensional vectors (512, 768, 1024+)
- Index build time and query latency matter

LanceDB currently exposes multiple quantized vector index types, including:
- `IVF_PQ` – Inverted File index with Product Quantization (default). See the [vector indexing](/docs/indexing/vector-index/) page for examples on `IVF_PQ`
- `IVF_RQ` – Inverted File index with **RaBitQ** quantization (binary, 1 bit per dimension). See [below](#rabitq-quantization) for examples

`IVF_PQ` is the default indexing option in LanceDB, coming with quantization by default, and works well in many cases. However, in cases where more drastic compression is needed, RaBitQ is also a reasonable option.

## RaBitQ quantization

RaBitQ is a binary quantization method that represents each normalized embedding using **1 bit per dimension**, plus a couple of small corrective scalars. In practice, a 1024‑dimensional `float32` vector that would normally take 4 KB can be compressed to roughly a few hundred bytes with RaBitQ, while still maintaining reasonable recall.

### How RaBitQ works

When you build an `IVF_RQ` index:
- Embeddings are grouped around centroids (as in other IVF indexes).
- Each residual vector is normalized and mapped to the nearest vertex of a randomly rotated hypercube on the unit sphere.
- The sign pattern of that vector is stored as bits (1 bit per dimension).
- Two small corrective factors are stored:
  1. The distance from the original vector to its centroid
  2. The dot product between the normalized vector and its quantized version

At query time, the incoming embedding goes through the same transformation. Similarity is estimated using fast binary dot products plus the corrective factors, which restores much of the original metric quality—especially in higher dimensions.

Compared to `IVF_PQ`, RaBitQ:
- Avoids training expensive PQ codebooks
- Builds indexes faster and handles updates more easily
- Maintains or improves recall at high dimensionality under the same storage budget

For a deeper dive into the theory and some benchmark results,
see the blog post: 
[LanceDB's RaBitQ Quantization for Blazing Fast Vector Search](/blog/feature-rabitq-quantization/).

### Using RaBitQ

You can create an RaBitQ‑backed vector index by setting `index_type="IVF_RQ"` when calling `create_index`. 
`num_bits` controls how many bits per dimension are used:

{{< code language="python" >}}
import lancedb

# Connect to LanceDB
db = lancedb.connect("/path/to/db")
table = db.open_table("my_table")

table.create_index(
    vector_column_name="vector",
    index_type="IVF_RQ",
    num_bits=1,
)
{{< /code >}}
{{< code language="TypeScript" >}}
import * as lancedb from "@lancedb/lancedb";

async function createIvfRqIndex() {
  // Connect to LanceDB
  const db = await lancedb.connect("/path/to/db");
  const table = await db.openTable("my_table");

  await table.createIndex("vector", {
    config: lancedb.Index.ivfRq({
      numBits: 1,
    }),
  });
}

await createIvfRqIndex();
{{< /code >}}
{{< code language="Rust" >}}
use lancedb::{
    connect,
    index::{Index, vector::IvfRqIndexBuilder},
};

// Connect to LanceDB
let db = connect("/path/to/db").execute().await.unwrap();
let table = db.open_table("my_table").execute().await.unwrap();

table
  .create_index(
      &["vector"],
      Index::IvfRq(IvfRqIndexBuilder::default().num_bits(1)),
  )
  .execute()
  .await
  .unwrap();
{{< /code >}}

## API Reference

1 bit is the classic RaBitQ setting, but you could (at higher
computational cost) set it to 2, 4 or 8 bits if you want to
improve the fidelity for better precision or recall.
It's also possible to tune the number of IVF partitions in `IVF_RQ`,
similar to how you would do in `IVF_PQ`.
The full list of parameters to the algorithm
are listed below.

- `distance_type`: Literal["l2", "cosine", "dot"], defaults to "l2"  
  The distance metric to use for similarity comparison. Choose "l2" for Euclidean, "cosine" for cosine similarity, or "dot" for dot product.
- `num_partitions`: Optional[int], defaults to None  
  Number of IVF partitions (affects index build time and query accuracy). More partitions can improve recall but may increase build time.
- `num_bits`: int, defaults to 1  
  Bits per dimension for quantization (1 is standard RaBitQ). Higher values improve fidelity at the cost of more storage and computation.
- `max_iterations`: int, defaults to 50  
  Maximum number of iterations for training the quantizer. Increase for larger datasets or to improve quantization quality.
- `sample_rate`: int, defaults to 256  
  Number of samples per partition during training. Higher values may improve accuracy but increase training time.
- `target_partition_size`: Optional[int], defaults to None  
  Target number of vectors per partition. Adjust to control partition granularity and memory usage.