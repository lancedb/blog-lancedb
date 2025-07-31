---
title: "Advanced Guides"
description: "Core concepts and fundamental understanding of LanceDB"
weight: 6
---

| Guide | Description | Topics Covered |
|:------|:------------|:---------------|
| **[Embedding Data](./embedding/)** | Complete reference for LanceDB's embedding API | • Embedding Function Registry<br>• Available Providers (OpenAI, Cohere, Sentence Transformers)<br>• Multi-modal Embeddings<br>• Custom Embedding Functions<br>• Schema Configuration |
| **[Reranking Results](./reranking/)** | Improve search relevance by re-ordering results | • Built-in Rerankers (Cohere, CrossEncoder, ColBERT)<br>• Multi-vector Reranking<br>• Custom Reranker Implementation<br>• Performance Optimization |
| **[Query Optimization](./optimize-queries.md)** | Analyze and optimize query performance | • `explain_plan` for query analysis<br>• `analyze_plan` for performance tuning<br>• Execution plan interpretation<br>• Index optimization strategies<br>• Performance metrics and debugging |

## Quick Navigation

### Embedding & Vectorization
- **[Quickstart Guide](./embedding/quickstart.md)** - Get started with embeddings in minutes
- **[Complete Reference](./embedding/)** - Full embedding API documentation

### Search & Reranking
- **[Reranking Overview](./reranking/)** - Improve search relevance with rerankers
- **[Custom Rerankers](./reranking/custom-reranker.md)** - Build your own reranking models

### Performance & Optimization
- **[Query Optimization](./optimize-queries.md)** - Analyze and tune query performance
- **[Execution Plans](./optimize-queries.md#reading-the-execution-plan)** - Understand query execution flow
- **[Performance Metrics](./optimize-queries.md#analyze_plan)** - Monitor and debug performance issues

## What's Next?

After exploring these guides, you might want to:

- **Build Applications** - Check out our [tutorials](/docs/tutorials/) for end-to-end examples
- **Explore Integrations** - See how LanceDB works with [various frameworks](/docs/integrations/)
- **Learn Core Concepts** - Deep dive into [search concepts](/docs/concepts/search/) and [indexing](/docs/concepts/indexing/)