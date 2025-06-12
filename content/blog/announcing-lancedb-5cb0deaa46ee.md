---
title: Announcing LanceDB
date: 2023-05-01
draft: false
featured: false
image: /assets/blog/1.png
description: Explore announcing lancedb with practical insights and expert guidance from the LanceDB team.
author: Chang She
---
🙋 Are you building a generative AI app using an LLM or API? Are you working on a new recsys, a modern search engine, or a new analytical tool for unstructured data? Good news: you no longer have to struggle with Pinecone’s high cost, over the top complexity, or data privacy concerns.

🚀 [LanceDB](https://lancedb.com/) is a free and open-source vector database that you can run locally or on your own server. It’s lightning fast and is easy to embed into your backend server. Check out our [github repo](https://github.com/lancedb/lancedb) or `pip install lancedb` to get started.

For a quick demo, you can take a look at our sample [youtube transcript search app](https://github.com/lancedb/lancedb/blob/main/docs/src/notebooks/youtube_transcript_search.ipynb). We’ll be adding a lot more soon. For more details on the API, take a look at [LanceDB docs](https://lancedb.github.io/lancedb/).

### ❓ Why we built LanceDB

As we spoke to builders of ML/AI applications, a common refrain from users was struggling to get services like Pinecone even running. After a while, we realized that the retrieve-filter-hydrate workflow was often time a big bottleneck in productivity and app latency.

So we put our heads together. I was one of the original co-authors of the pandas library. Lei was a core-contributor to HDFS and led ML infrastructure at Cruise. Using our experience building data/ML tooling, we’ve built something totally new.
![](__GHOST_URL__/content/images/2024/02/1_tuJkPniCUTx9-sD1yLyDCg-1.png)
### LanceDB ❤️ builders

We’ve reimagined vector search from the ground up for better developer productivity, scalability, and performance. LanceDB is backed by [Lance format](https://github.com/eto-ai/lance) — a modern columnar data format that is an alternative to parquet. It’s optimized for high speed random access and management of AI datasets like vectors, documents, and images.

We then added our own Rust implementations of a number of SOTA ANN-index algorithms to support low-latency vector search. These indices are SSD-based and can easily scale wayyyy beyond memory.

What’s more, LanceDB allows you to store and filter other features along with vectors. Our users have been able to replace 3–4 different data stores with LanceDB alone and achieve a speedup at the same time.

### 🔥 Updates

Since our first release 2 weeks ago, many exciting things have been happening. Thanks to Minh Le from the community, we now have a LangChain integration. Our integration for LlamaIndex is also under review.

Our current focus is building a TypeScript implementation with a native-level experience — no python server necessary! If you have thoughts on what the right API should look like, hop on [this PR](https://github.com/lancedb/lancedb/pull/50) and let us know!

### 🛣️ Roadmap

Currently, we provide a python package called lancedb which is pip installable and delivers a great local workflow. Beyond what we’re working on right now, here’s what you can expect:

- Ecosystem **integrations** into OpenAI plugin / AutoGPT etc
- Richer set of **embedding functions** and **document processing** conveniences
- **Gallery** of generative AI apps powered by LanceDB
- Solutions for **cloud** deployment

### 🙏 We want to hear from you

We’d love to get your take on LanceDB. If you have questions, feedback, or want help using LanceDB in your app, don’t hesitate to drop us a line at [contact@lancedb.com](mailto:contact@lancedb.com). And we’d really appreciate your support in the form of a Github Star on our [LanceDB repo](https://github.com/lancedb/lancedb) ⭐
![](__GHOST_URL__/content/images/2024/02/1_tuJkPniCUTx9-sD1yLyDCg.png)
