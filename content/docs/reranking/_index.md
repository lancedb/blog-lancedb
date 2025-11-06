---
title: "Reranking Search Results"
sidebar_title: "Reranking Results"
description: "Use a reranker to improve search relevance by re-ordering search results."
weight: 104
aliases: ["/docs/guides/reranking/", "/docs/guides/reranking"]
---

Reranking re-orders search results to improve relevance, often using a more powerful model than the one used for the initial search. LanceDB has built-in support for reranking with models from Cohere, Sentence-Transformers, and more.

### Quickstart

To use a reranker, you perform a search and then pass the results to the `rerank()` method.

```python
import lancedb
from lancedb.rerank import CohereReranker

db = lancedb.connect("/tmp/lancedb")
table = db.open_table("my_table")

query = "what is the capital of france"

# Search with reranking
reranker = CohereReranker()
reranked_results = table.search(query).limit(10).rerank(reranker=reranker).to_df()
```

### Supported Rerankers

LanceDB supports several rerankers out of the box. Here are a few examples:

| Reranker               | Default Model                          |
| ---------------------- | -------------------------------------- |
| `CohereReranker`       | `rerank-english-v2.0`                  |
| `CrossEncoderReranker` | `cross-encoder/ms-marco-MiniLM-L-6-v2` |
| `ColbertReranker`      | `colbert-ir/colbertv2.0`               |

You can find more details about these and other rerankers in the [**Integrations**](../../integrations/) section.


### Multi-vector reranking
Most rerankers support reranking based on multiple vectors. To rerank based on multiple vectors, you can pass a list of vectors to the `rerank` method. Here's an example of how to rerank based on multiple vector columns using the `CrossEncoderReranker`:

```python
from lancedb.rerankers import CrossEncoderReranker

reranker = CrossEncoderReranker()

query = "hello"

res1 = table.search(query, vector_column_name="vector").limit(3)
res2 = table.search(query, vector_column_name="text_vector").limit(3)
res3 = table.search(query, vector_column_name="meta_vector").limit(3)

reranked = reranker.rerank_multivector([res1, res2, res3],  deduplicate=True)
```

## Creating Custom Rerankers

LanceDB also you to create custom rerankers by extending the base `Reranker` class. The custom reranker should implement the `rerank` method that takes a list of search results and returns a reranked list of search results. This is covered in more detail in the [Creating Custom Rerankers](/docs/reranking/custom-reranker/) section.