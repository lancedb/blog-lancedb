---
title: Search Features in LanceDB
sidebar_title: "Search"
description: "Comprehensive guide to all search capabilities in LanceDB including vector search, full-text search, hybrid search, and more."
weight: 1
---

| Search Feature | Description |
|----------------|-------------|
| [Vector Search](/docs/concepts/search/vector-search/) | Semantic similarity search using vector embeddings with support for multiple distance metrics (L2, cosine, dot product, hamming) |
| [Multivector Search](/docs/concepts/search/multivector-search/) | Search using multiple vector embeddings per document with late interaction models like ColBERT |
| [Full-Text Search (Native)](/docs/concepts/search/full-text-search/) | Keyword-based search using LanceDB's native BM25 implementation with pre-filtering capabilities |
| [Full-Text Search (Tantivy)](/docs/concepts/search/full-text-search-tantivy/) | Advanced full-text search using Tantivy engine with language-specific stemming and multi-column indexing |
| [Hybrid Search](/docs/concepts/search/hybrid-search/) | Combines vector and full-text search results using reranking algorithms like RRF |
| [Metadata Filtering](/docs/concepts/search/filtering/) | Filter search results based on metadata fields with pre-filtering and post-filtering options |
| [SQL Queries](/docs/concepts/search/sql-queries/) | Traditional SQL queries for analytical queries and data exploration (Enterprise only) |

## Where to Begin?

- Explore [Vector Search](/docs/concepts/search/vector-search/) for semantic similarity
- Learn [Full-Text Search](/docs/concepts/search/full-text-search/) for keyword matching
- Master [Hybrid Search](/docs/concepts/search/hybrid-search/) for combined capabilities
- Understand [Metadata Filtering](/docs/concepts/search/filtering/) for result refinement
