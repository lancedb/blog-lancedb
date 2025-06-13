---
title: LanceDB Cloud Public Beta, Lance 2.1 , Game Studio Case Study
date: 2025-04-03
draft: false
featured: false
image: /assets/blog/lancedb-cloud-public-beta-lance-2-1-game-studio-case-study/lancedb-cloud-public-beta-lance-2-1-game-studio-case-study.png
description: Explore lancedb cloud public beta, lance 2.1 , game studio case study with practical insights and expert guidance from the LanceDB team.
author: Jasmine Wang
---
## ☁️ LanceDB Cloud Public Beta

The wait is over! LanceDB Cloud is now in Public Beta! No more wait list; just sign-up, get an API key, and start building AI with LanceDB Cloud - Serverless Retrieval for Multimodal AI!

[Try LanceDB Cloud (Public Beta) Now](https://accounts.lancedb.com/sign-up)

---

## Good Reads

### 👀Lance 2.1 Preview

If you think Lance Format 2.0 was magic, wait till you see Lance 2.1(beta).  We are achieving faster full scans than Parquet and gained support for storing large binary data like audio, image, and video.
[![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXeo6pIleHnELadSTFv1gJk9ND2JjF1klt2O9g8xiP7uXqMYhhXvfuC6IPix1BS6JY4i0BBjFXUYocCsJj0Zgx2gUKEWQBLKC9pRzxp-1FWvlnmOlpDroO3_KHfkjl7QtThC_kyG?key=RTVI5Pv23Ppl3wh7-hRqhXlJ)](__GHOST_URL__/lance-file-2-1-smaller-and-simpler/)*Lance FIle 2.1 Engineering Blog*
### 🎮Second Dinner's Secret Weapon: LanceDB-Powered RAG for Faster, Smarter Game Development

What if you could go from months of development to hours? That's exactly what award winning game studio **Second Dinner** achieved with **LanceDB Cloud**:

- ✅ Prototyping new features in **hours** (instead of months)
- ✅ **100x faster QA** with a simple API call
- ✅ AI-driven workflows **3 to 5x more cost-effective** than alternatives

> "LanceDB isn't just a tool—it's our cheat code." – Xiaoyang Yang, VP of AI, Data, Security at Second Dinner

[![](__GHOST_URL__/content/images/2025/04/Screenshot-2025-03-20-at-9.48.05-PM.png)](__GHOST_URL__/second-dinners-secret-weapon-lancedb-powered-rag-for-faster-smarter-game-development/)*Second Dinner Case Study*
---

## LanceDB Enterprise Product News

### 🔥 New LanceDB Enterprise & LanceDB Cloud Features

- Enhanced Full-Text Search (FTS): Fuzzy Search & Boosting Now Available
- New SDK APIs:  `explain_plan`,   `analyze_plan`,   `restore` : 
- Scalar Indexing for UUID of FixedSizeBinary type
- Support S3-compatible object store

[Learn More](https://docs.lancedb.com/changelog/changelog)

### 🧮Updated LanceDB Cloud Pricing Calculator 

Our updated pricing ensures a **fair, scalable, and value-aligned** cost structure:

- **Storage**: Now includes attributes in data storage size.
- **Writes**: $6 per million **1536D** vectors written.
- **Queries**: Charged based on the data read and returned per query:
- Read size: **$0.25/TB**
- Return size: **$0.1/GB**
- Minimum read size per query: **64MB**

---

## Community Contributions

💡

[HoneyHive x LanceDB](https://www.honeyhive.ai/post/moving-ai-applications-to-prod-with-lancedb-and-honeyhive): HoneyHive is an AI monitoring platform that helps developers track, manage, and improve AI applications. It offers tools for performance monitoring, dataset management, debugging, and collaboration to ensure AI systems run smoothly. By integrating LanceDB, developers can now easily trace and analyse your retrieval calls in a few simple steps. 

💡

Check out Isaac Flath's insights on semantic search for technical content in his new [blog](https://isaacflath.com/blog/blog_post?fpath=posts%2F2025-03-17-Retrieval101.ipynb), where he explains: 1. Why traditional search fails; 2. Vector embeddings with LanceDB; 3. Why that's not enough; 4. Chunking, hybrid search, and re-ranking. 

💡

A heartfelt thank you to our community contributors of lance and lancedb this month: [@bclavie](https://github.com/bclavie)[@yanghua](https://github.com/yanghua)[@Akagi201](https://github.com/Akagi201)[@schorfma](https://github.com/schorfma)[@gagan-bhullar-tech](https://github.com/gagan-bhullar-tech)[@samuelcolvin](https://github.com/samuelcolvin)[@bclavie](https://github.com/bclavie)[@msu-reevo](https://github.com/msu-reevo)[@niyue](https://github.com/niyue)[@Jay-ju](https://github.com/Jay-ju)[@alex766](https://github.com/alex766)[@SaintBacchus](https://github.com/SaintBacchus)[@TD-Sky](https://github.com/TD-Sky)[@timsaucer](https://github.com/timsaucer)[@ascillitoe](https://github.com/ascillitoe)[@lyang24](https://github.com/lyang24)

---

## Upcoming Events

On April 17th, LanceDB is co-hosting an in-person meetup with Anyscale,  learn how to build scalable, performant LLM APIs using **Ray + LanceDB**
[![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXefZy_BBnHtZSZEEdaGrJeVLAvSQIvIRtEgLUTN6I8-Kv5JPUmRbIbR6w8bzesjoTjlqlIXIZBhybnCWxHifwtiKWXy0_xxXr0MKjMizpAwNW5efzLC_lFtF8FWgaKWYlqqfdrVmw?key=RTVI5Pv23Ppl3wh7-hRqhXlJ)](https://lu.ma/u0cjfsqo)
---

## Open Source Releases Spotlight 

- TypeScript SDK: 
- Binary vector support: LanceDB's TypeScript SDK now natively supports binary vector indexing and querying with production-grade efficiency.
- Accepts Arrow data type in *`alterColumns`*.

- Python users can utilize the PyArrow schema to add a new column to the table schema.
- Allow streaming larger-than-memory writes when adding data to a table.
