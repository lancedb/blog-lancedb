---
title: GraphRAG, Full-Text Search, LanceDBCharacter.AI
date: 2024-08-06
draft: false
featured: false
image: /assets/blog/1.png
description: Explore graphrag, full-text search, lancedbcharacter.ai with practical insights and expert guidance from the LanceDB team.
author: Jasmine Wang
---
## 🔥LanceDB as the Local Vector Database of Choice of GraphRAG🔥

Microsoft Research open sourced their GraphRAG project last week, and we are excited that the GraphRAG team has decided to launch with LanceDB as the local vectordb of choice! 

[Check the example](https://lnkd.in/gmrsTcqz)

## 🔬Experimental Native Full Text Search Released in Lance🔬

- As implemented from scratch in Rust, it works with S3 / GCS directly.  
- FTS will be available in Python, Typescript and Java SDKs in August.
- Experimental encoding for struct column for faster random access.

[Try it out](https://github.com/lancedb/lance/issues/1195)

## Community contributions

💡

**FSST: **Thank you [@broccoliSpicy](https://github.com/broccoliSpicy) for making FSST [available](https://github.com/lancedb/lance/pull/2470). With FSST, we see sizable compression over large string columns, which is especially useful for AI datasets that store text prompts. 

💡

A heartfelt thank you to our community contributors of lance and lancedb this month: [@jiachengdb](https://github.com/jiachengdb)[@broccoliSpicy](https://github.com/broccoliSpicy)[@BitPhinix](https://github.com/BitPhinix)[@niyue](https://github.com/niyue)[@gagan-bhullar-tech](https://github.com/gagan-bhullar-tech)[@inn-0](https://github.com/inn-0)[@MagnusS0](https://github.com/MagnusS0)[@nuvic](https://github.com/nuvic)[@JoanFM](https://github.com/JoanFM)[@thomasjpfan](https://github.com/thomasjpfan)[@sidharthrajaram](https://github.com/sidharthrajaram)[@forrestmckee](https://github.com/forrestmckee)

## Good reads

We appreciate the feedback from our community and have been diligently working on several initiatives over the past month! We have embarked on a journey to rewrite our SDKs with the goal of achieving better cross-language consistency. Additionally, we are excited to announce the release of Lance v0.15.0, which includes significant performance enhancements and new capabilities. Be sure to check out our two engineering blogs for more details!

- [Streamlining Our SDKs](__GHOST_URL__/streamlining-our-sdks/)
- [Lance v0.15.0](__GHOST_URL__/lance-v0-15-0/)

## Event recap

LancedB + Character.AI - [The Hierarchy of Needs for Training Dataset Development](https://www.youtube.com/watch?v=i2vBaFzCEJw)

The Data Exchange with Ben Lorica: [Unlocking the Power of Unstructured Data](https://www.youtube.com/watch?v=B-QckhCfw9M)

## Latest releases

- More advanced encodings in Lance V2 format: [FSST](https://github.com/lancedb/lance/issues/2415), Bitpacking, Dictionary and packed struct encodings
- New rerankers available for customization: [Reciprocal Rank Fusion reranker](https://lancedb.github.io/lancedb/reranking/rrf/) and [Jina reranker](https://lancedb.github.io/lancedb/reranking/jina/) 
- [Huggingface transformers](https://github.com/lancedb/lancedb/pull/1462) in Typescript SDK
