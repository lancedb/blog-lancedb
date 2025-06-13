---
title: "LanceDB May Newsletter: New Funding, Lance Format v2, Ray-Lance, Daft-Lance"
date: 2024-03-25
draft: false
featured: false
image: /assets/blog/lancedb-may-newsletter-new-funding-lance-format-v2-ray-lance-daft-lance/lancedb-may-newsletter-new-funding-lance-format-v2-ray-lance-daft-lance.png
description: "Explore LanceDB May newsletter: new funding, Lance format v2, Ray-Lance, Daft-Lance with practical insights and expert guidance from the LanceDB team."
author: Weston Pace
---
## 🔥 Milestone Achieved with $8 Million Seed Round🔥

We're proud to announce that LanceDB has closed an $8 million seed round led by CRV, with additional backing from Y Combinator, Essence Venture Capital, and Swift Ventures. This brings total funding to $11M, enabling us to grow our team and better serve our customers and our community.

As the Database for Multimodal AI, we're on a mission to empower AI teams to easily search over billions of vectors, process petabytes of images, and train on trillions of tokens.

[Read more](__GHOST_URL__/new-funding-and-a-new-foundation-for-multimodal-ai-data/)

## 🚀 Lance v2 is Now in Beta

We've been talking for a while about a [new iteration of our file format](__GHOST_URL__/lance-v2/).  We're pleased to announce that the new v2 format is now in available as an opt-in feature for Lance (in release 0.12.1) and LanceDB (release 0.8.2) for users that want to try it out ahead of time and give us some early feedback.

[Try it out](__GHOST_URL__/lance-v2-is-now-in-beta/)

## Community contributions

💡

**Ray-Lance**: You can now use *ray.data.read_lance()* to read the Lance dataset into Ray Data. Thanks for the hard work from the Anyscale and the LanceDB teams.

💡

**Daft-Lance**: Daft dataframe users can now read from LanceDB. Thanks for[Jay Chia](https://github.com/jaychia) from Eventual for adding this feature

💡

**Trino-Lance:** Thank you [Rong Rong](https://github.com/walterddr) for making the Trino Lance connector [available](https://github.com/trinodb/trino/pull/21880) . With this connector, you can analyze and write LanceDB dataset in Trino. Creating indices and vector search are on the Roadmap as well! Stay tuned. 

💡

A heartfelt thank you to our community contributors of lance and lancedb this month: [@LuQQiu](https://github.com/LuQQiu)[@niyue](https://github.com/niyue)[@heiher](https://github.com/heiher)[@broccoliSpicy](https://github.com/broccoliSpicy)[@kafonek](https://github.com/kafonek)[@ChenZhongPu](https://github.com/ChenZhongPu)[@asmith26](https://github.com/asmith26)[@AmanKishore](https://github.com/AmanKishore)[@rohitrastogi](https://github.com/rohitrastogi)[@nehiljain](https://github.com/nehiljain)[@eltociear](https://github.com/eltociear)[@benpoulson](https://github.com/benpoulson)[@alexkohler](https://github.com/alexkohler)

## Good reads

Now that we've shared our plans for a [new file format](__GHOST_URL__/lance-v2/), Lance v2. We are also creating a series of deep dive posts on the design, challenges and limitations in many existing file readers, and how we plan to overcome these. Here are the first two in this series:

- [Columnar File Readers in Depth: Parallelism without Row Groups](__GHOST_URL__/file-readers-in-depth-parallelism-without-row-groups/)
- [Columnar File Readers in Depth: Scheduling vs Decoding](__GHOST_URL__/splitting-scheduling-from-decoding/)

## Event recap

Multimodal AI in Production meetup 05/14/2024

Foundations for Multimodal Lakehouse for AI, Data Council 2024

## Latest releases

- Lance: [HNSW refactoring](https://github.com/lancedb/lance/pull/2353) with better performance
- LanceDB: support database optimization in Python and NodeJS SDK
