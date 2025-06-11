---
title: 2 Million Monthly Downloads to Celebrate the Holiday Season
date: 2024-12-03
draft: false
featured: false
image: /assets/posts/1.png
description: Explore 2 million monthly downloads to celebrate the holiday season with practical insights and expert guidance from the LanceDB team.
author: Jasmine Wang
---

We are so excited to announce that we surpassed **2 Million Downloads** per month across Python, Typescript, Java, and Rust. Our community is indexing **billions of vectors** and managing **petabytes of training data** for AI. It's an open secret that our users have known for some time now - LanceDB is the easiest way to add knowledge to your AI applications and Lance format is the new gold standard for multimodal AI data.

❤️ We're so grateful for our community, for contributions, feedback, and insights all along the journey. Drop us a line in discord and give us a star on GitHub.

![Counter Animation](/assets/posts/counter.gif)

## Community contributions

💡 **Thank you to our contributors**

A heartfelt thank you to our community contributors of lance and lancedb this past month: [@HoKim98](https://github.com/HoKim98) [@Jay-ju](https://github.com/Jay-ju) [@SaintBacchus](https://github.com/SaintBacchus) [@niyue](https://github.com/niyue) [@FuPeiJiang](https://github.com/FuPeiJiang) [@MaxPowerWasTaken](https://github.com/MaxPowerWasTaken) [@emmanuel-ferdman](https://github.com/emmanuel-ferdman) [@fzowl](https://github.com/fzowl) [@fzliu](https://github.com/fzliu) [@umuthopeyildirim](https://github.com/umuthopeyildirim) [@stevensu1977](https://github.com/stevensu1977) [@gagan-bhullar-tech](https://github.com/gagan-bhullar-tech) [@kursataktas](https://github.com/kursataktas)

💡 **Community Spotlight**

A shoutout to our community contributor for building a LanceDB Guru on Gurubase. It uses data from LanceDB's Github and documentation to answer questions. 🤖💬

[https://github.com/lancedb/lancedb/pull/1797](https://github.com/lancedb/lancedb/pull/1797)

## Good reads

AWS Startup Sr. Solution Architects [Kevin Shaffer-Morrison](https://www.linkedin.com/in/kshaffermorrison/) and [Giuseppe Battista](https://www.linkedin.com/in/giusedroid/overlay/about-this-profile/) built a [Full Stack Serverless Retrieval Augmented Generation Application on AWS](https://github.com/aws-samples/Serverless-Retrieval-Augmented-Generation-RAG-on-AWS?tab=readme-ov-file#full-stack-serverless-retrieval-augmented-generation-application-on-aws) featuring [LanceDB](https://www.linkedin.com/company/lancedb/) running on Lambda. If a $1000+ monthly bill is not where you want to splurge on, then maybe give this a spin.

### [Serverless Retrieval Augmented Generation (RAG) on AWS](https://community.aws/content/2d1B5srtVqbVYnlm9ixKNJf4p1M/serverless-retrieval-augmented-generation-rag-on-aws)

The year is 2024 and you're still paying for a vector database when you're not using it. Not anymore! In this post we explore a fully serverless solution for your Retrieval Augmented Generation (RAG) applications on AWS backed by Amazon Lambda, Amazon Bedrock, Amazon S3, and LanceDB.

## Event recap

### [LanceDB: Building developer-friendly, multi-modal vector databases](https://podcasts.apple.com/us/podcast/lancedb-building-developer-friendly-multi-modal-vector/id1691014756?i=1000676541906)

Podcast Episode · The Baking Soda Podcast: Featuring Startup Companies on the Rise · 11/11/2024 · 44m

The Baking Soda Podcast on Vector Base, Open Source and AI

## Upcoming events

### [Bridging Big Data and AI: Empowering PySpark with Lance Format for Multi-Modal AI Data Pipelines PyData Global 2024](https://global2024.pydata.org/cfp/talk/NCKHBL/)

PySpark has long been a cornerstone of big data processing, excelling in data preparation, analytics, and machine learning tasks within traditional data lake ecosystems. However, the rise of multimodal AI and vector search introduces new challenges that push beyond PySpark's native capabilities. Spark's new Python data source API opens the door for integration with emerging AI data lakes built on the multi-modal Lance format. Lance delivers unparalleled value with its zero-copy schema evolution capability and robust support for large record-size data (e.g., images, tensors, embeddings, etc), simplifying multimodal data storage. Its advanced indexing for semantic and full-text search, combined with rapid random access, enables high-performance AI data analytics to the level of SQL. This powerful combination bridges the gap between traditional big data processing and the demands of modern AI workloads, offering a streamlined approach to handling complex, multi-modal datasets. By unifying PySpark's robust processing capabilities with Lance's AI-optimized storage, data engineers and scientists can efficiently manage and analyze the diverse data types required for cutting-edge AI applications within a familiar big data framework.

### [Lance Format Office Hours](https://lu.ma/jdu19v2g)

Welcome to the first Lance Format Community Office Hour!

**Event Details**
- Location: Google Meet (virtual)
- Link: https://meet.google.com/akj-vned-gkg

**Agenda:**
The LanceDB team will be available to discuss Lance format, answer questions, and get feedback from the community.

## Latest releases

Last month's new releases span across Python, Rust, and Node with following major features and changes:

- Inserting data is now more flexible. Users can omit fields, ignore nullability differences, and provide fields out-of-order.
- Experimental balanced storage added to tackle balancing file sizes when tables have large blob columns.
- Full-text search indices now include unindexed data, just like vector and scalar indexes.
- Several improvements have been made to improve feature parity between Python, Rust, and Node SDKs.
- All LanceDB Cloud clients have been consolidated into a new implementation, providing feature parity between Python, Node, and Rust.

**For more details:**

- [Lance v0.19.2](https://github.com/lancedb/lance/releases/tag/v0.19.2)
- [LanceDB 0.13.0](https://github.com/lancedb/lancedb/releases/tag/v0.13.0)
- [LanceDB Python v0.16.0](https://github.com/lancedb/lancedb/releases/tag/python-v0.16.0)

[Nov Feature Roundup Blog](/november-feature-roundup/)
