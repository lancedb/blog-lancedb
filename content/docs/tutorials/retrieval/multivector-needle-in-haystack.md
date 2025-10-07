# Multi-modal Multi-vector search: finding needles in haystacks

In the development of advanced search and retrieval systems, moving from keyword matching to semantic understanding is a critical step. However, a key distinction exists between finding a relevant document and locating a specific piece of information within that document with precision. While there are techniques that perform well for retrieving documents, most of them work by extracting summarized semantic meaning of the document. This can be seen as these models trying to understand the "gist" of the documents. Both single-vector search and late-interaction approaches work well for these conditions with various tradeoffs involved. But there's another type of problem where the goal is not just to understand the overall topic of a document in general, but to also specifically account for the requested detail within the document. This "needle in a haystack" problem is a significant challenge, and addressing it is essential for building high-precision retrieval systems.

This guide provides a technical analysis of multi-vector search for high-precision information retrieval. We will examine various optimization strategies and analyze their performance. This guide should be seen as complementary to resources like the [Answer.AI blog on ColBERT pooling](https://www.answer.ai/posts/colbert-pooling.html), which explains how pooling strategies can be effective for document-level retrieval. Here, we will demonstrate why those same techniques can be counterproductive when precision at an intra-document, token level is the primary objective.

Find reproducible code [here](https://github.com/lancedb/research/tree/main/multivector-needle-haystack-bench)

## The Dataset

To properly test these strategies, we need a task where precision is not just a feature, but the entire goal.

### The Task: The Document Haystack Dataset

Our benchmark is built on the **AmazonScience/document-haystack** dataset, which contains 25 visually complex source documents (e.g., financial reports, academic papers). To create a rigorous test, our evaluation follows a per-document methodology:

*   We process each of the 25 source documents independently.
*   **Table Creation:** For a single source document (e.g., "AIG"), we ingest all pages from all of its page-length variants (from 5 to 200 pages long). This creates a temporary LanceDB table containing approximately 1,230 pages.
*   **The Task:** We then query this table using a set of "needle" questions, where the goal is to retrieve the **exact page number** containing the answer. A successful retrieval means the correct page number is within the top K results.
*   **Measurement:** We measure both retrieval accuracy (Hit@K) and the average search latency for each query against this table.
*   **Iteration:** Once the evaluation for one document is complete, the table is discarded, and the process repeats for the next source document.

**Dataset example**
The documents contain "text needles" like these

<img width="1208" height="951" alt="Screenshot 2025-10-07 at 11 03 27 AM" src="https://github.com/user-attachments/assets/f44cd1bc-257a-4a03-9b01-5c5ca767ab45" />
<img width="1289" height="1012" alt="Screenshot 2025-10-07 at 11 03 47 AM" src="https://github.com/user-attachments/assets/47f3a554-ff0e-4cf8-b2aa-0d4515da99c2" />

During evaluation, the queries processed are somewhat like this:
```
What is the secret currency in the document?
What is the secret object #3 in the document?
```
The intention of this task is to find the page which has the text needle that answers this questions


## Models and Architectures

Our testbed includes a baseline single-vector model and a family of advanced multi-vector models. 

### Single-Vector (Bi-Encoder) Baseline: `openai/clip-vit-base-patch32`

A bi-encoder maps an entire piece of content (a query, a document page) to a *single* vector. The search process is simple: pre-compute one vector for every page, and at query time, find the page vector closest to the query vector.

*   **Strength:** Speed and simplicity.
*   **Weakness:** This creates an **information bottleneck**. All the nuanced details, keywords, and semantic relationships on a page must be compressed into a single, fixed-size vector. For finding a needle, this is like trying to describe a specific person's face using only one word.

### Multi-Vector (Late-Interaction) Models

Multi-vector models, pioneered by ColBERT, take a different approach. Instead of one vector per page, they generate a *set of vectors* for each page—one for every token (or image patch).

*   **Mechanism (MaxSim):** The search process is more sophisticated. For each token in the query, the system finds the most similar token on the page. These maximum similarity scores are then summed up to get the final relevance score. This "late-interaction" preserves fine-grained, token-level details.
*   **The Models:** We used several vision-language models adapted for this architecture, including `ColPali`, `ColQwen2`, and `ColSmol`. While their underlying transformer backbones differ, they all share the ColBERT philosophy of representing documents as a bag of contextualized token embeddings.

<img width="757" height="299" alt="Screenshot 2025-10-07 at 11 46 59 AM" src="https://github.com/user-attachments/assets/cf09efc3-1187-49d5-8893-aa8f0756f249" />


## Different Retrieval Strategies Used

A full multi-vector search is powerful but computationally intensive. Here are five strategies for managing it, complete with LanceDB implementation details.


### 1. `base`: The Gold Standard (Full Multi-Vector Search)

This is the pure, baseline late-interaction search. It offers the highest potential for accuracy by considering every token.

**LanceDB Implementation:**
The key is to use a schema that supports a list of vectors for each entry.

```python
import lancedb
import pyarrow as pa

# Schema for multi-vector data
# Assumes embeddings are 128-dimensional
schema = pa.schema([
    pa.field("page_num", pa.int32()),
    pa.field("vector", pa.list_(pa.list_(pa.float32(), 128)))
])

db = lancedb.connect("./lancedb")
tbl = db.create_table("document_pages_base", schema=schema)

# Ingesting multi-token embeddings for a page
# multi_token_embeddings is a NumPy array of shape (num_tokens, 128)
tbl.add([{"page_num": 1, "vector": multi_token_embeddings.tolist()}])

# Searching with a multi-token query
# query_multi_vector is also shape (num_query_tokens, 128)
results = tbl.search(query_multi_vector).limit(5).to_list()
```

### 2. `flatten`: Mean Pooling

This strategy "flattens" the set of token vectors into a single vector by averaging them. This transforms the search into a standard, fast approximate nearest neighbor (ANN) search.

**LanceDB Implementation:**

```python
# Schema for single-vector data
schema_flat = pa.schema([
    pa.field("page_num", pa.int32()),
    pa.field("vector", pa.list_(pa.float32(), 128))
])
tbl_flat = db.create_table("document_pages_flat", schema=schema_flat)

# Ingesting the mean-pooled vector
mean_vector = multi_token_embeddings.mean(axis=0)
tbl_flat.add([{"page_num": 1, "vector": mean_vector.tolist()}])

# Searching with a single averaged query vector
query_mean_vector = query_multi_vector.mean(axis=0)
results = tbl_flat.search(query_mean_vector).limit(5).to_list()
```

### 3. `max_pooling` & 4. `cls_pooling`

These are variations of `flatten`. `max_pooling` takes the element-wise max across all token vectors, while `cls_pooling` simply uses the first vector in the sequence (corresponding to the `[CLS]` token). The implementation is identical to `flatten`, just with a different aggregation method (`.max(axis=0)` or `[0]`).

### 5. `rerank`: The Hybrid "Optimization"

This two-stage strategy aims for the best of both worlds. First, use a fast, pooled-vector search to find a set of promising candidates. Then, run the full, accurate multi-vector search on *only* those candidates.

**LanceDB Implementation:**
This requires a table with two vector columns.

```python
# Schema with both flat and multi-vector columns
schema_rerank = pa.schema([
    pa.field("page_num", pa.int32()),
    pa.field("vector_flat", pa.list_(pa.float32(), 128)),
    pa.field("vector_multi", pa.list_(pa.list_(pa.float32(), 128)))
])
tbl_rerank = db.create_table("document_pages_rerank", schema=schema_rerank)

# Ingest both vectors
tbl_rerank.add([
    {
        "page_num": 1,
        "vector_flat": multi_token_embeddings.mean(axis=0).tolist(),
        "vector_multi": multi_token_embeddings.tolist()
    }
])

# --- Two-Stage Search ---
# Stage 1: Fast search on the flat vector
query_flat = query_multi_vector.mean(axis=0)
candidates = tbl_rerank.search(query_flat, vector_column_name="vector_flat") \
                       .limit(100) \
                       .with_row_id(True) \
                       .to_pandas()

# Stage 2: Precise multi-vector search on candidates
candidate_ids = tuple(candidates["_rowid"].to_list())
final_results = tbl_rerank.search(query_multi_vector, vector_column_name="vector_multi") \
                          .where(f"_rowid IN {candidate_ids}") \
                          .limit(5) \
                          .to_list()
```

## The Results

For a "needle in a haystack" task, retrieval accuracy is the primary metric of success. The benchmark results reveal a significant performance gap between the full multi-vector search strategy and common optimization techniques.

### Baseline Performance: Single-Vector Bi-Encoder

First, we establish a baseline using a standard single-vector bi-encoder model, `openai/clip-vit-base-patch32`. This represents a common approach to semantic search but, as the data shows, is ill-suited for this task's precision requirements.

| Model | Strategy | Hit@1 | Hit@5 | Hit@20 | Avg. Latency (s) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `openai/clip-vit-base-patch32` | `base` | 1.6% | 4.7% | 11.8% | **0.008 s** |

With a Hit@20 rate of just under 12%, the baseline model struggles to reliably locate the correct page. This performance level is insufficient for applications requiring high precision.

### Multi-Vector Model Performance

We now examine the performance of multi-vector models using different strategies. The following table compares the `base` (full multi-vector), `flatten` (mean pooling), and `rerank` (hybrid) strategies across several late-interaction models.

| Model | Strategy | Hit@1 | Hit@5 | Hit@20 | Avg. Latency (s) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `vidore/colqwen2-v1.0` | `flatten` | 1.9% | 5.5% | 11.9% | 0.010 s |
| `vidore/colqwen2-v1.0` | `rerank` | 0.3% | 1.5% | 7.3% | 0.692 s |
| **`vidore/colqwen2-v1.0`** | **`base`** | **14.0%** | **65.4%** | **95.5%** | 0.668 s |
| `vidore/colpali-v1.3` | `flatten` | 1.7% | 4.5% | 9.3% | 0.008 s |
| `vidore/colpali-v1.3` | `rerank` | 0.6% | 2.3% | 6.9% | 0.949 s |
| **`vidore/colpali-v1.3`** | **`base`** | **11.3%** | **42.3%** | **65.6%** | 0.936 s |
| `vidore/colSmol-256M` | `flatten` | 1.6% | 4.7% | 10.5% | 0.008 s |
| `vidore/colSmol-256M` | `rerank` | 0.3% | 1.6% | 7.0% | 0.853 s |
| **`vidore/colSmol-256M`** | **`base`** | **14.4%** | **64.0%** | **91.7%** | 0.848 s |

The data shows a consistent pattern: the `base` strategy outperforms both `flatten` and `rerank` across all models, achieving a Hit@20 rate of over 90% in some cases. The pooling and reranking strategies perform no better than the single-vector baseline.

### In-Depth Analysis of Pooling Strategies

To further understand the failure of optimization techniques, we compared different methods for pooling token vectors into a single vector: `mean` (`flatten`), `max`, and `cls`.

| Model & Pooling Strategy | Hit@1 | Hit@5 | Hit@20 | Avg. Latency (s) |
| :--- | :--- | :--- | :--- | :--- |
| `vidore/colqwen2-v1.0` (`mean_pooling`) | 1.9% | 5.5% | 11.9% | 0.010 s |
| `vidore/colqwen2-v1.0` (`max_pooling`) | 1.4% | 4.2% | 11.2% | 0.011 s |
| `vidore/colqwen2-v1.0` (`cls_pooling`) | 0.1% | 0.6% | 2.7% | 0.008 s |
| **`vidore/colqwen2-v1.0` (`base`)** | **14.0%** | **65.4%** | **95.5%** | 0.668 s |

All pooling methods perform poorly, confirming that the aggregation of token vectors into a single representation loses the fine-grained detail required for this task.

**Analysis: Why "Optimizations" are Ineffective Here**

The strategies that seem like clever optimizations for general retrieval are, in fact, counterproductive for high-precision tasks.

1.  **The Failure of Pooling:** The `flatten` (mean pooling) strategy, along with `max_pooling` and `cls_pooling`, fails to improve upon the baseline. As explained in the Answer.AI blog on ColBERT pooling, pooling is a form of compression. For document-level retrieval, this compression creates a useful "summary." For our task, however, this averaging process **destroys the essential localization signal**. The subtle but critical differences between the token embeddings on one page and the next are smoothed over and lost. The resulting single vector represents the *topic* of the page, not the *specific needle* on it.

2.  **The Failure of `rerank`:** The `rerank` strategy, often presented as a hybrid solution, is the *worst-performing strategy*. Its Hit@20 is consistently below 10%. The reason is a fundamental flaw in its two-stage design for this task: the first stage uses a pooled vector to retrieve candidates. Since pooling eliminates the localization signal, the initial candidate set is effectively random. The powerful second-stage multi-vector search is then applied to a list of pages that is highly unlikely to contain the correct page, exemplifying the "garbage in, garbage out" principle.

3.  **The Superior Performance of `base` Search:** In our evaluation, the full, un-optimized `base` multi-vector search was the only strategy that demonstrated high performance. With a **Hit@20 of over 95%** for the best model, it shows that preserving every token vector is the most reliable way we observed to find the needle. We did not identify an effective shortcut for this class of problem.

### Latency

 The "optimizations" are fast but do not produce correct results. The only effective strategy has a clear and understandable computational cost.

| Strategy (on `vidore/colqwen2-v1.0`) | Avg. Search Latency (s) | Hit@20 Accuracy |
| :--- | :--- | :--- |
| `flatten` (Fast but Ineffective) | **0.010 s** | 11.9% |
| `rerank` (Slower and Ineffective) | 0.692 s | 7.3% |
| `base` (Accurate) | 0.668 s | **95.5%** |

*(Latency measured on NVIDIA H100 GPUs)*


## Practical Considerations: Latency, Complexity, and Scalability

While the accuracy of `base` multi-vector search is impressive, it's crucial to understand the practical limitations that come with its computational intensity. These models are not a universal replacement for traditional single-vector search but rather a specialized tool for specific problems.

### Search Latency and Computational Complexity

<img width="683" height="723" alt="Screenshot 2025-10-07 at 11 40 51 AM" src="https://github.com/user-attachments/assets/aee16ab9-b7a5-4fc9-afa3-6086c173fda0" />


As the benchmark data shows, the search latency for `base` multi-vector search is orders of magnitude higher than for single-vector (or pooled-vector) search. It's important to note that the reported ~670ms latency is an average from per-document evaluations. In this benchmark, each of the 25 documents is processed independently. All pages from a single document's variants (ranging from 5 to 200 pages) are ingested into a temporary table, resulting in a table size of approximately **1,230 rows (pages)** per evaluation. The search is performed on this table, and then the table is discarded. This highlights a significant performance cost even on a relatively small, per-document scale. This stems from a fundamental difference in computational complexity:

*   **Modern ANN Search (for single vectors):** Algorithms like HNSW (Hierarchical Navigable Small World) provide sub-linear search times, often close to `O(log N)`, where `N` is the number of items in the index. This allows them to scale to billions of vectors with millisecond-level latency.
*   **Late-Interaction Search (Multi-Vector):** The search process is far more intensive. For each query, it must compute similarity scores between query tokens and the tokens of many candidate documents. The complexity is closer to `O(M * Q * D)`, where `M` is the number of candidate documents to score, `Q` is the number of query tokens, and `D` is the average number of tokens per document. While optimizations exist to reduce `M`, the core calculation is fundamentally more expensive than a single vector distance calculation.

### When to Use Multi-Vector Search

Given these constraints, full multi-vector search is not a drop-in replacement for single-vector ANN search. It is best suited for:

*   **Small-Scale, High-Precision Tasks:** When the corpus of documents is manageable (thousands to tens of thousands, not billions) and the value of finding the *exact* piece of information is extremely high.
*   **Specialized Applications:** In domains like legal discovery, compliance, or scientific research, the cost of a slower, more computationally expensive search is easily justified by the need for precision. For example, finding a specific clause in one of 10,000 contracts is a perfect use case.
*   **Post-Retrieval Re-ranking:** While our `rerank` strategy showed that a poor first stage fails, multi-vector models can be used effectively as a re-ranking step *if* the initial retrieval stage is highly capable of recalling the correct document. However, this adds complexity to the system architecture.

For general-purpose, large-scale document retrieval where understanding the "gist" is sufficient, single-vector search remains the more practical and scalable solution.



### Conclusion

This benchmark highlights the critical importance of matching your retrieval strategy to your objective. Pooling and reranking remain valid techniques for *document-level* retrieval, where the goal is to find a relevant document. However, if the goal is to find specific information *within* a document, the detail provided by full multi-vector representations is essential.

In conclusion, building precise retrieval systems requires preserving the fine-grained detail of the source data. For needle-in-a-haystack problems, this means utilizing the full capabilities of late-interaction, multi-vector search.

## Appendix: Full Benchmark Results

<details>
<summary>Click to view the full benchmark data</summary>

| name                               |   _runtime |   _step |    _timestamp | _wandb             |   avg_inference_latency |   avg_search_latency | hit_rates                                                                                                                                   | model_name                   | strategy    |
|:-----------------------------------|-----------:|--------:|--------------:|:-------------------|------------------------:|---------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------|:-----------------------------|:------------|
| vidore/colqwen2-v0.1_base          |      13410 |       0 |   1.75873e+09 | {'runtime': 13410} |              0.0418646  |           0.751151   | {'1': 0.1355151515151515, '10': 0.888, '20': 0.9597575757575758, '3': 0.3936969696969697, '5': 0.6349090909090909}                          | vidore/colqwen2-v0.1         | base        |
| vidore/colqwen2-v1.0_rerank        |      13008 |       0 |   1.75873e+09 | {'runtime': 13008} |              0.0426252  |           0.692482   | {'1': 0.003393939393939394, '10': 0.03296969696969697, '20': 0.07296969696969698, '3': 0.010666666666666666, '5': 0.015272727272727271}     | vidore/colqwen2-v1.0         | rerank      |
| vidore/colpali-v1.3_flatten        |       2998 |       0 |   1.75872e+09 | {'runtime': 2998}  |              0.0296511  |           0.00833224 | {'1': 0.017454545454545455, '10': 0.06448484848484848, '20': 0.09333333333333334, '3': 0.034666666666666665, '5': 0.04509090909090909}      | vidore/colpali-v1.3          | flatten     |
| vidore/colqwen2-v0.1_rerank        |      13512 |       0 |   1.75873e+09 | {'runtime': 13512} |              0.0418855  |           0.662372   | {'1': 0.002909090909090909, '10': 0.026424242424242423, '20': 0.05987878787878788, '3': 0.0075151515151515155, '5': 0.014545454545454544}   | vidore/colqwen2-v0.1         | rerank      |
| vidore/colqwen2-v1.0_base          |      12933 |       0 |   1.75873e+09 | {'runtime': 12933} |              0.0416839  |           0.667898   | {'1': 0.14012121212121212, '10': 0.8846060606060606, '20': 0.9553939393939394, '3': 0.4111515151515152, '5': 0.6538181818181819}            | vidore/colqwen2-v1.0         | base        |
| vidore/colpali-v1.3_rerank         |      12090 |       0 |   1.75873e+09 | {'runtime': 12090} |              0.0310783  |           0.949047   | {'1': 0.006060606060606061, '10': 0.03878787878787879, '20': 0.06933333333333333, '3': 0.014545454545454544, '5': 0.022787878787878788}     | vidore/colpali-v1.3          | rerank      |
| vidore/colqwen2-v1.0_flatten       |       4846 |       0 |   1.75874e+09 | {'runtime': 4846}  |              0.0504031  |           0.010443   | {'1': 0.018666666666666668, '10': 0.07854545454545454, '20': 0.11903030303030304, '3': 0.041212121212121214, '5': 0.055030303030303034}     | vidore/colqwen2-v1.0         | flatten     |
| vidore/colqwen2-v0.1_base          |      10838 |       0 |   1.75874e+09 | {'runtime': 10838} |              0.04627    |           0.692836   | {'1': 0.13575757575757577, '10': 0.8870303030303031, '20': 0.96, '3': 0.3941818181818182, '5': 0.6351515151515151}                          | vidore/colqwen2-v0.1         | base        |
| vidore/colqwen2-v0.1_flatten       |       4828 |       0 |   1.75874e+09 | {'runtime': 4828}  |              0.0486335  |           0.0103028  | {'1': 0.018424242424242423, '10': 0.07224242424242425, '20': 0.10521212121212122, '3': 0.03903030303030303, '5': 0.05212121212121213}       | vidore/colqwen2-v0.1         | flatten     |
| vidore/colpali-v1.3_base           |      10253 |       0 |   1.75874e+09 | {'runtime': 10253} |              0.0312334  |           0.93611    | {'1': 0.11272727272727272, '10': 0.551030303030303, '20': 0.6555151515151515, '3': 0.29987878787878786, '5': 0.4232727272727273}            | vidore/colpali-v1.3          | base        |
| vidore/colqwen2-v0.1_flatten       |       4745 |       0 |   1.75874e+09 | {'runtime': 4745}  |              0.0472825  |           0.00990508 | {'1': 0.018424242424242423, '10': 0.07296969696969698, '20': 0.10496969696969696, '3': 0.03951515151515152, '5': 0.05236363636363636}       | vidore/colqwen2-v0.1         | flatten     |
| vidore/colqwen2.5-v0.2_base        |      17218 |       0 |   1.75875e+09 | {'runtime': 17218} |              0.0540356  |           0.694855   | {'1': 0.11903030303030304, '10': 0.7127272727272728, '20': 0.8366060606060606, '3': 0.336, '5': 0.5258181818181819}                         | vidore/colqwen2.5-v0.2       | base        |
| vidore/colqwen2.5-v0.2_rerank      |      16859 |       0 |   1.75875e+09 | {'runtime': 16859} |              0.0518383  |           0.71693    | {'1': 0.0026666666666666666, '10': 0.025212121212121213, '20': 0.060848484848484846, '3': 0.006787878787878788, '5': 0.01187878787878788}   | vidore/colqwen2.5-v0.2       | rerank      |
| vidore/colqwen2-v0.1_rerank        |       9484 |       0 |   1.75875e+09 | {'runtime': 9484}  |              0.0445599  |           0.691609   | {'1': 0.005333333333333333, '10': 0.030545454545454542, '20': 0.064, '3': 0.010666666666666666, '5': 0.017696969696969697}                  | vidore/colqwen2-v0.1         | rerank      |
| vidore/colSmol-256M_flatten        |       6822 |       0 |   1.75875e+09 | {'runtime': 6822}  |              0.0404544  |           0.00822329 | {'1': 0.01575757575757576, '10': 0.06836363636363636, '20': 0.10496969696969696, '3': 0.03442424242424243, '5': 0.04678787878787879}        | vidore/colSmol-256M          | flatten     |
| vidore/colSmol-500M_base           |      12681 |       0 |   1.75875e+09 | {'runtime': 12681} |              0.0408026  |           0.850902   | {'1': 0.136, '10': 0.8029090909090909, '20': 0.8993939393939394, '3': 0.3806060606060606, '5': 0.5975757575757575}                          | vidore/colSmol-500M          | base        |
| vidore/colSmol-500M_rerank         |      13066 |       0 |   1.75876e+09 | {'runtime': 13066} |              0.0440974  |           0.927632   | {'1': 0.003636363636363637, '10': 0.028606060606060607, '20': 0.07054545454545455, '3': 0.00896969696969697, '5': 0.015030303030303033}     | vidore/colSmol-500M          | rerank      |
| vidore/colSmol-256M_rerank         |      12646 |       0 |   1.75876e+09 | {'runtime': 12646} |              0.0391553  |           0.853279   | {'1': 0.003393939393939394, '10': 0.02909090909090909, '20': 0.07006060606060606, '3': 0.008727272727272728, '5': 0.015515151515151517}     | vidore/colSmol-256M          | rerank      |
| vidore/colqwen2.5-v0.2_flatten     |       6348 |       0 |   1.75876e+09 | {'runtime': 6348}  |              0.0509971  |           0.00772653 | {'1': 0.017696969696969697, '10': 0.06545454545454546, '20': 0.09284848484848485, '3': 0.03515151515151515, '5': 0.045575757575757575}      | vidore/colqwen2.5-v0.2       | flatten     |
| vidore/colSmol-256M_base           |      11554 |       0 |   1.75876e+09 | {'runtime': 11554} |              0.0366467  |           0.848463   | {'1': 0.1435151515151515, '10': 0.8426666666666667, '20': 0.9173333333333332, '3': 0.40824242424242424, '5': 0.6404848484848484}            | vidore/colSmol-256M          | base        |
| vidore/colSmol-500M_flatten        |       6395 |       0 |   1.75876e+09 | {'runtime': 6395}  |              0.0384664  |           0.00716238 | {'1': 0.018424242424242423, '10': 0.07345454545454545, '20': 0.11393939393939394, '3': 0.03903030303030303, '5': 0.05090909090909091}       | vidore/colSmol-500M          | flatten     |
| openai/clip-vit-base-patch32_base  |        815 |       0 |   1.75876e+09 | {'runtime': 815}   |              0.00533487 |           0.00794629 | {'1': 0.016, '10': 0.07636363636363637, '20': 0.11757575757575756, '3': 0.03296969696969697, '5': 0.04703030303030303}                      | openai/clip-vit-base-patch32 | base        |
| vidore/colqwen2-v0.1_max_pooling   |       8758 |       0 |   1.7595e+09  | {'runtime': 8758}  |              0.0985753  |           0.0106716  | {'1': 0.015515151515151517, '10': 0.07296969696969698, '20': 0.11248484848484848, '3': 0.032484848484848484, '5': 0.04703030303030303}      | vidore/colqwen2-v0.1         | max_pooling |
| vidore/colqwen2-v0.1_cls_pooling   |       8733 |       0 |   1.7595e+09  | {'runtime': 8733}  |              0.0947586  |           0.00869903 | {'1': 0.0014545454545454545, '10': 0.013575757575757576, '20': 0.028606060606060607, '3': 0.0038787878787878783, '5': 0.006787878787878788} | vidore/colqwen2-v0.1         | cls_pooling |
| vidore/colpali-v1.3_cls_pooling    |       4712 |       0 |   1.75949e+09 | {'runtime': 4712}  |              0.0690353  |           0.00903896 | {'1': 0.0026666666666666666, '10': 0.020363636363636365, '20': 0.04242424242424243, '3': 0.007757575757575757, '5': 0.01090909090909091}    | vidore/colpali-v1.3          | cls_pooling |
| vidore/colpali-v1.3_max_pooling    |       4728 |       0 |   1.75949e+09 | {'runtime': 4728}  |              0.0718573  |           0.0103053  | {'1': 0.011393939393939394, '10': 0.05672727272727273, '20': 0.08872727272727272, '3': 0.02666666666666667, '5': 0.03709090909090909}       | vidore/colpali-v1.3          | max_pooling |
| vidore/colqwen2-v1.0_max_pooling   |       8760 |       0 |   1.7595e+09  | {'runtime': 8760}  |              0.0981102  |           0.0106316  | {'1': 0.013575757575757576, '10': 0.06933333333333333, '20': 0.112, '3': 0.02812121212121212, '5': 0.041939393939393936}                    | vidore/colqwen2-v1.0         | max_pooling |
| vidore/colqwen2-v1.0_cls_pooling   |       8702 |       0 |   1.7595e+09  | {'runtime': 8702}  |              0.0913185  |           0.00842651 | {'1': 0.0014545454545454545, '10': 0.012848484848484849, '20': 0.02739393939393939, '3': 0.0038787878787878783, '5': 0.006303030303030303}  | vidore/colqwen2-v1.0         | cls_pooling |
| vidore/colqwen2-v0.1_max_pooling   |       7696 |       0 |   1.7595e+09  | {'runtime': 7696}  |              0.105203   |           0.011907   | {'1': 0.016242424242424242, '10': 0.07321212121212121, '20': 0.1132121212121212, '3': 0.03442424242424243, '5': 0.04945454545454545}        | vidore/colqwen2-v0.1         | max_pooling |
| vidore/colqwen2-v0.1_cls_pooling   |       7565 |       0 |   1.7595e+09  | {'runtime': 7565}  |              0.0983301  |           0.00963176 | {'1': 0.001212121212121212, '10': 0.011151515151515152, '20': 0.02327272727272727, '3': 0.003636363636363637, '5': 0.006303030303030303}    | vidore/colqwen2-v0.1         | cls_pooling |
| vidore/colqwen2.5-v0.2_max_pooling |        nan |     nan | nan           | nan                |            nan          |         nan          | nan                                                                                                                                         | nan                          | nan         |
| vidore/colSmol-256M_max_pooling    |      13982 |       0 |   1.75951e+09 | {'runtime': 13982} |              0.0999708  |           0.0121211  | {'1': 0.00993939393939394, '10': 0.05818181818181818, '20': 0.09187878787878788, '3': 0.025212121212121213, '5': 0.037575757575757575}      | vidore/colSmol-256M          | max_pooling |
| vidore/colSmol-256M_cls_pooling    |      13613 |       0 |   1.75951e+09 | {'runtime': 13613} |              0.0919328  |           0.0108457  | {'1': 0.001212121212121212, '10': 0.013575757575757576, '20': 0.028606060606060607, '3': 0.0038787878787878783, '5': 0.006787878787878788}  | vidore/colSmol-256M          | cls_pooling |
| vidore/colSmol-500M_max_pooling    |      14191 |       0 |   1.75951e+09 | {'runtime': 14191} |              0.111858   |           0.0121703  | {'1': 0.012363636363636365, '10': 0.07539393939393939, '20': 0.13187878787878787, '3': 0.02787878787878788, '5': 0.0416969696969697}        | vidore/colSmol-500M          | max_pooling |
| vidore/colSmol-500M_cls_pooling    |      13337 |       0 |   1.75951e+09 | {'runtime': 13337} |              0.103416   |           0.0103713  | {'1': 0.001212121212121212, '10': 0.013575757575757576, '20': 0.02787878787878788, '3': 0.0038787878787878783, '5': 0.006787878787878788}   | vidore/colSmol-500M          | cls_pooling |

</details>
