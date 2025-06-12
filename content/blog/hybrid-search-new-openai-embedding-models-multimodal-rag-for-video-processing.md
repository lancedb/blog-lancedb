---
title: Hybrid search, New OpenAI Embedding Models, Multimodal RAG for Video Processing
date: 2024-03-06
draft: false
image: /assets/blog/1.png
description: Explore hybrid search, new openai embedding models, multimodal rag for video processing with practical insights and expert guidance from the LanceDB team.
author: Chang She
---
## Highlights
![](https://lh7-us.googleusercontent.com/Z52mq8GFfB6T3y2cEKWDc107hEhya6tiwZWMdy5Z75JksvtHm2TxUrzf7rElQEikfiSmHrWQ4_PBWWeB5_OlrRGXzymyrZulr_pcIH3YYtLNy42IdHP6FZHwRW1a6k4vySS0TOz1sIklk_7Qmqg1D_k)
[Hybrid search with custom reranking](__GHOST_URL__/hybrid-search-and-custom-reranking-with-lancedb-4c10a6a3447e) (included in LanceDB Python version 0.6.0 release)

- Explore the potential of reranking to enhance retrieval quality and downstream generation in your LanceDB workflows with minimal code adjustments and latency additions, inviting community feedback on your implementations.

![](https://lh7-us.googleusercontent.com/Eg9JsXJ3DO09HQt_bjjZvz_6RzsCIrJ2ZDKLt9d4tgJwLCyV9BwG9anzD40BgZJMUvVEC5LXSDkLt5_n_R0suFKV8TdsRn9i9cuc5FccGgJdbCi3tExOgnCGRGNQNHVUB0YnC6iYAU971HuVix11mVQ)
[Benchmarking New OpenAI Embedding Models with LanceDB](__GHOST_URL__/openais-new-embeddings-with-lancedb-embeddings-api-a9d109f59305/)

- A short intro to new OpenAI embedding models and how LanceDB’s Embedding API simplifies working with embedding functions.

## User Insights
![](https://lh7-us.googleusercontent.com/gtUpr6v1rbgU7DIoqvl7ZjSM5iWwXatNibE8ZmcR7BwJilR2-Y3UAzwQkVOhzp-oPnR_sF01-M31yaSvGuWnWSNIXYosYYAKmeq9uaj0Ux1aujQxkOs-ILhOo0m6N6AbB87NXb4KE4dUN_bXhx7Bvq0)
[Ultralytics uses LanceDB as the query engine for Dataset Exploration API & Dashboard](https://docs.ultralytics.com/datasets/explorer/)

- With LanceDB, Ultralytics is able to run semantic search across 100s of thousands of images seamlessly without setup.

![](https://lh7-us.googleusercontent.com/31HDgYaF7S7-KQz7Hu0fzfgocojp6_rnwbDCWSg2czXoWJF1G08iMn52ohrg9jsrm84wWh5Q-YH1RdZU05oEeOkNc7kuI5nTMmKBGTZRlT7Ca_MCjh2zmegZF3Yq9JXkiNqam6TRrNZ_mwVfAOjm2Zg)
[Multimodal RAG for processing videos using OpenAI GPT4V and LanceDB vectorstore ](https://docs.llamaindex.ai/en/stable/examples/multi_modal/multi_modal_video_RAG.html)

- A Multimodal RAG architecture designed for video processing. It utilizes OpenAI GPT4V MultiModal LLM class that employs [CLIP](https://github.com/openai/CLIP) to generate multimodal embeddings using [LanceDB VectorStore](LanceDB VectorStore) for efficient vector storage.

## Good Reads

- [Create LLM apps using RAG](https://vipul-maheshwari.github.io/2024/02/14/rag-application-with-langchain)
- Exploring the Limits of Large Language Models: Understanding Hallucinations and Leveraging Retrieval Augmentation Generation (RAG) for Targeted Responses

- [Curating Custom Datasets for efficient LLM training using Lance](https://tanaymeh.github.io/blog/2024/02/08/p7.html)
- 1 Million tokenized Python files from the Codeparrot dataset in Lance format - A subset of [codeparrot/github-code](https://huggingface.co/datasets/codeparrot/github-code) dataset consisting of 1 Million tokenized Python files in [Lance](https://lancedb.com/) file format for blazing fast and memory efficient I/O.

## Latest releases

LanceDB 

- [Python SDK v0.6.0](https://github.com/lancedb/lancedb/releases/tag/python-v0.6.0)
- [Hybrid search with custom re-ranking](__GHOST_URL__/hybrid-search-and-custom-reranking-with-lancedb-4c10a6a3447e)
- [Upsert support](https://github.com/lancedb/lancedb/pull/906)

- [TypeScript SDK v0.4.11](https://github.com/lancedb/lancedb/releases/tag/v0.4.11)
- [Upsert support](https://github.com/lancedb/lancedb/pull/915)

[Lance Format v0.10.2](https://github.com/lancedb/lance/releases/tag/v0.10.1)

- Richer schema evolution functionality
- [add_columns](https://github.com/lancedb/lance/issues/1458)
- [alter_columns](https://github.com/lancedb/lance/pull/1903)
- [drop_columns](https://github.com/lancedb/lance/pull/1904)

- Initial support for [Rust-JVM interop](https://github.com/lancedb/lance/pull/1928)

## Contributor Spotlight
![](https://lh7-us.googleusercontent.com/W_rlvrwbIo9MYIpser4tEawCvG78wT7g45QZ1APLGPy6NU2eCBAMzxzxabCdckmoiIwz6oozO8hRN9Fw02vK7blSRAHm_o7GEQDgaOZBeq7M42gxCK0FxUghKFHWHHzM76vldeiOhMuB9-TZEXiSuE4)
Thank you, Beinan Wang (@beinan), for contributing the initial jni-based JVM integration for Lance format. This allows Lance to serve the Java and Scala communities better and provides the foundation for connectors to large-scale distributed query engines like Spark, Presto, and Trino. Thank you, Beinan!

## Follow Us

Give us a star on [GitHub](https://github.com/lancedb/lancedb)

Join the LanceDB [Discord](https://discord.gg/zMM32dvNtd)

Follow and subscribe to our [LanceDB YouTube Channel](https://www.youtube.com/@LanceDB)

Read our [Blog](__GHOST_URL__/)

Follow us on [X](https://twitter.com/lancedb)
