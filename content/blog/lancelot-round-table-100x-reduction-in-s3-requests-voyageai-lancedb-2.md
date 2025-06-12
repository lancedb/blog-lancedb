---
title: "Lancelot Round Table, 100x Reduction in S3 Requests, VoyageAI LanceDB"
date: 2025-02-06
draft: false
featured: false
image: /assets/posts/the-lancelot-chronicles-your-quest-in-the-realm-of-open-source.png
description: Explore lancelot round table, 100x reduction in s3 requests, voyageailancedb with practical insights and expert guidance from the LanceDB team.
author: Jasmine Wang
---
To inaugurate the new year, we proudly unveiled the first ⚔️**Lancelot Round Table** in January, celebrating the founding knights who have been instrumental in shaping the future of AI infrastructure since LanceDB's inception. These Lancelot pioneers are driving innovation by implementing and collaborating with `lance` and `lancedb` across their organizations, democratizing access to advanced AI tools, empowering innovators worldwide, and expanding the frontiers of data management.
[![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXfFslzZNa83by1zD7Nd-o2LmlaDn_HB_xin1-T9vw17soWUWjwrBOPP2g7ytEeZSW0_qAgXMtaJflzDUcgsUitfoJnIDkbzpKciPyY0i68-gO0cSFKXaUHCpw9boXBDMGT0-UnY?key=8E02-T8ufzqoxZF5oomkC2io)](https://github.com/lancedb/lancedb/wiki)[

## The Lancelot Chronicles: Your Quest in the Realm of Open Source

Answering the Clarion Call In the vast open source realm, where bits and bytes flow like rivers of possibility, a new saga is unfolding. This is not just any tale – it’s the story of lance and lancedb, and you, brave knight, are the protagonist we’ve been waiting for. Open source

![](__GHOST_URL__/content/images/icon/lancedb-symbol--1--1.png)LanceDB BlogJasmine Wang

![](__GHOST_URL__/content/images/thumbnail/image--4-.png)
](__GHOST_URL__/the-lancelot-chronicles-your-quest-in-the-realm-of-open-source/)
Explore the Lancelot Chronicle

---

## LanceDB Enterprise Product News

🔥 **Enterprise customers upgrading to the new reactive indexer in LanceDB Enterprise reported 100x reduction in S3 requests**. We engineered LanceDB Enterprise for high-throughput data ingestion and indexing. The system ensures data persistence on durable object storage before confirming any write request. 

[LanceDB Enterprise Write Path](https://docs.lancedb.com/enterprise/architecture/architecture#write-path)

**🌱 New LanceDB Enterprise Changelog** - now you can keep a close eye on our enterprise updates. We’ve already made some exciting updates since the New Year! 

- Support hamming distance and binary vector
- GPU indexing support
- Multi-vector index support
- Optimized Build for AWS Graviton 4 and Google Cloud Axion Processors
- Support index over float16 vectors

[LanceDB Enterprise Changelog](https://docs.lancedb.com/changelog/changelog)

---

## Partnership Spotlight
![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXdCSx4BqDVFEFO5K_O0zmucdS2eBKR5wxYrV4c9pkr4LyrliswexurBQj4gVG7r0hbS09aCqj9eu1WE8uBD7Zw7PW-szWWe2Gbu8NnyNBXRIpKOG4VAM_8-OFsHwIjI0Tcos5WU9w?key=8E02-T8ufzqoxZF5oomkC2io)
🥳 **Vector Search with LanceDB using Voyage AI's Text and Multimodal Embeddings. **

- You can now directly define a [Voyage embedding](https://lancedb.github.io/lancedb/embeddings/available_embedding_models/text_embedding_functions/voyageai_embedding/) function and data model, all within LanceDB. Together, this creates a powerful ecosystem for semantic search, enabling developers to build intelligent, context-aware applications with minimal computational overhead.
- Using this new integration makes it incredibly easy to build, experiment, and scale your AI applications to billions of vectors and beyond.

[✨ Notebook](https://colab.research.google.com/github/lancedb/vectordb-recipes/blob/main/examples/voyagexlancedb/Voyage_x_LanceDB.ipynb)

---

## Community Contributions

💡

With the inaugural Lancelot Round Table, we invite you to make your mark in our vibrant open source community. For a comprehensive contribution guide and the most up-to-date Hall of Heroes, explore our official `lancedb`[wiki](https://github.com/lancedb/lancedb/wiki) page. 

💡

A heartfelt thank you to our community contributors of lance and lancedb this month:[@vjc578db](https://github.com/vjc578db)[@fecet](https://github.com/fecet)[@andrijazz](https://github.com/andrijazz)[@kemingy](https://github.com/kemingy)[@chenkovsky](https://github.com/chenkovsky)[@Jay-ju](https://github.com/Jay-ju)[@SaintBacchus](https://github.com/SaintBacchus)[@yanghua](https://github.com/yanghua)[@jeff1010322](https://github.com/jeff1010322)[@vaifai](https://github.com/vaifai)[@vincent0426](https://github.com/vincent0426)[@takaebato](https://github.com/takaebato)[@gagan-bhullar-tech](https://github.com/gagan-bhullar-tech)[@renato2099](https://github.com/renato2099)[@ahaapple](https://github.com/ahaapple)[@jgugglberger](https://github.com/jgugglberger)[@FuPeiJiang](https://github.com/FuPeiJiang)

---

## Open Source Updates

- Upsert with merge insert allows omitting nullable columns.
- Vector search can be applied to binary vectors using hamming distance.
- Can limit vector search results based on maximum distance (distance range).
- Typescript LanceDB supports hybrid search.
- Python LanceDB improved parity between async and sync Table API.
