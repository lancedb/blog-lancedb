---
title: 🛡️ Newly Knighted Lancelot, ▶️TwelveLabs Semantic Video Recommendations, 🧠Cognee's AI Memory Layer with LanceDB
date: 2025-10-08T00:00:00Z
draft: false
featured: false
categories: ["Newsletter"]
image: "/assets/blog/newsletter-september-2025/september-newsletter-image-3.png"
description: “Our September newsletter welcomes new Lancelot members, highlights TwelveLabs semantic video recommendations, Cognee’s AI memory layer, and shares the latest product and community updates.”
author: "Jasmine Wang"
author_avatar: "/assets/authors/jasmine-wang.png"
author_bio: "Ecosystem Engagement, Partnership, Community, DevRel"
author_github: "onigiriisabunny"
author_linkedin: "jasminechenwang"
---

## 🛡️ Meet the Newly Knighted Lancelot

In May, we announced 3 new members to join our [Lancelot Round Table](https://github.com/lancedb/lancedb/wiki?ref=blog.lancedb.com). It is time again for us to welcome **four new noble members** to the Roundtable from Netflix, RunwayML, Luma AI, and Seven Research! A huge thank you to each of them for their continued support and contributions to `lance` and `lancedb`. For the full list of all Lancelot, please check our [github wiki page](https://github.com/lancedb/lancedb/wiki#lancelot-round-table).

⚔️ 🐎 Hail to the Knights of the Lancelot Roundtable!

![Alt text for Knights of the Lancelot Roundtable image](/assets/blog/newsletter-september-2025/september-newsletter-image-6.png)

## [Building Semantic Video Recommendations with TwelveLabs and LanceDB](https://lancedb.com/blog/geneva-twelvelabs/)

[![Alt text for Semantic Video Recommendations image](/assets/blog/newsletter-september-2025/september-newsletter-image-1.png)](https://lancedb.com/blog/geneva-twelvelabs/)

Tutorial: a semantic video recommendation engine powered by [TwelveLabs](https://www.twelvelabs.io/) , [LanceDB](https://lancedb.com/) , and [Geneva](https://lancedb.com/docs/geneva) .

*   [TwelveLabs](https://www.google.com/url?q=https://www.twelvelabs.io/&sa=D&source=editors&ust=1759910620606865&usg=AOvVaw3apCGFkGlAhOVK7b8Hrlbp) provides multimodal embeddings that encode the narrative, mood, and actions in a video, going far beyond keyword matching.
*   [LanceDB](https://www.google.com/url?q=https://lancedb.com/&sa=D&source=editors&ust=1759910620607076&usg=AOvVaw2-S5VIKyCqUPmtYGlg-a1M) stores these embeddings together with metadata and supports fast vector search through a developer-friendly Python API.
*   [Geneva](https://lancedb.com/docs/geneva), built on [LanceDB](https://www.google.com/url?q=https://lancedb.com/&sa=D&source=editors&ust=1759910620607367&usg=AOvVaw1n4tTHcknb-XQ1n4MfGz8L) and powered by [Ray](https://www.google.com/url?q=https://lancedb.com/blog/lance-namespace-lancedb-and-ray/&sa=D&source=editors&ust=1759910620607442&usg=AOvVaw2pkOhKVL4dLnwYqoNYVA8j) , scales the entire pipeline seamlessly from a single laptop to a large distributed cluster—without changing your code.

## [Productionalize AI Workloads with Lance Namespace, LanceDB, and Ray](https://lancedb.com/blog/lance-namespace-lancedb-and-ray/)

Most of the work in AI isn’t in the model. It’s in the data pipeline. Organizing billions of rows of data for indexing and retrieval isn't easy. This is where Ray and LanceDB come together:

*   Ray takes care of the heavy lifting: distribute data ingestion, embedding generation, and feature engineering across clusters.
*   LanceDB makes the results instantly queryable: fast vector search, hybrid search, and analytics at production scale.

[![Alt text for Lance Namespace, LanceDB, and Ray image](/assets/blog/newsletter-september-2025/september-newsletter-image-8.png)](https://lancedb.com/blog/lance-namespace-lancedb-and-ray)


## 🎤 Watch the Recordings!


<iframe width="560" height="315" src="https://www.youtube.com/embed/y5g7u3sWyrk?si=yobin3RePEsmnKlS" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


<iframe width="560" height="315" src="https://www.youtube.com/embed/mVN1P1HvpKg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


*   [Apache Spark Connector for Lance](https://www.linkedin.com/events/apachespark-andlancesparkconnec7363659816340258816/theater/)


![Alt text for Apache Spark Connector for Lance image](/assets/blog/newsletter-september-2025/spark-connector.png)

*   [OpenSource Startup Podcast](https://creators.spotify.com/pod/profile/ossstartuppodcast/episodes/E181-Why-Multimodal-Is-the-Future-of-AI-Data-Workloads-e3813id/a-ac59kq5)

<iframe width="560" height="315" src="https://www.youtube.com/embed/AJodQHXGnCA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 📚 Good Reads

#### [Setup Real-Time Multimodal AI Analytics with Apache Fluss (incubating) and Lance](https://lancedb.com/blog/fluss-integration/)

Real-time multimodal AI is finally practical! With [Apache Fluss (Incubating)](https://www.linkedin.com/company/apachefluss/) as the streaming storage layer and Lance as the AI-optimized lakehouse, you can stream data in right now, tier it automatically, and query it instantly for RAG, analytics, or training.

[![Alt text for Apache Fluss and Lance image](/assets/blog/newsletter-september-2025/september-newsletter-image-2.png)](https://lancedb.com/blog/fluss-integration/)

## 💼 Case Study

#### [How Cognee Builds AI Memory Layers with LanceDB](https://lancedb.com/blog/case-study-cognee/)

[![Alt text for Cognee Case Study image](/assets/blog/newsletter-september-2025/september-newsletter-image-5.png)](https://lancedb.com/blog/case-study-cognee/)

>"LanceDB gives us effortless, truly isolated vector stores per user and per test, which keeps our memory engine simple to operate and fast to iterate.”
>
>-Vasilije Markovic, Cognee CEO



#### [Distributed Training with LanceDB and Tigris | Tigris Object Storage](https://www.tigrisdata.com/blog/lancedb-training/)

Training multimodal datasets at scale is hard. They grow fast, they don’t fit on a single disk, and traditional workarounds (like network filesystems) introduce complexity and cost. But what if you could treat storage as infinite and let your infrastructure handle the hard parts for you?

That’s exactly what [Xe iaso](https://www.linkedin.com/in/xe-iaso/) shows in this new guide: how [LanceDB](https://www.linkedin.com/company/lancedb/) and [Tigris Data](https://www.linkedin.com/company/tigrisdata/) make large-scale distributed training simple. No more worrying about local storage limits, manual sharding, or egress fees—just seamless scaling from research to production.

[![Alt text for Distributed Training with LanceDB and Tigris image](/assets/blog/newsletter-september-2025/september-newsletter-image-4.png)](https://www.tigrisdata.com/blog/lancedb-training/)

## 📊 LanceDB Enterprise Product News

| Feature                                     | Description                                                                                                                                                                                                                             |
| :------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RabitQ quantization for vector indices      | RabitQ is an alternative to PQ that is more memory- and compute-efficient. See [https://arxiv.org/abs/2405.12497](https://arxiv.org/abs/2405.12497) for more details.                                                               |
| Significantly-reduced latencies for full-text search | Full-text search P95 latencies are now reduced by up to 32.3%. Cold start P95 latencies are now reduced by up to 18.7%.                                                                                                  |
| Scalar indices for JSON columns with type-aware indexing | LanceDB now has the ability to create JSON scalar indices that are type-aware, instead of assuming all extracts are strings. This should resolve the class of issues that are a result of no type awareness.                |
| KMeans algorithm runs significantly faster  | We improved the implementation of our KMeans algorithm to run ~30x faster than before, with even more gains at large k. This results in IVF-based vector indices being built more quickly. |

## 🫶 Community contributions

#### [Introducing Lance Data Viewer: A Simple Way to Explore Lance Tables](https://lancedb.com/blog/lance-data-viewer/)

When exploring LanceDB for his own projects, Gordon realized there was no simple way to peek inside Lance tables, something many of us take for granted with relational databases. Instead of waiting, he built it. **Lance Data Viewer**, an open-source, containerized web UI for browsing Lance datasets:

[![Alt text for Lance Data Viewer image](/assets/blog/newsletter-september-2025/september-newsletter-image-7.png)](https://lancedb.com/blog/lance-data-viewer/)

A heartfelt thank you to our community contributors of lance and lancedb this past month: [ @majin1102](https://github.com/majin1102) [ @wayneli-vt](https://github.com/wayneli-vt) [ @wojiaodoubao](https://github.com/wojiaodoubao) [ @chenghao-guo](https://github.com/chenghao-guo)[ @huyuanfeng2018](https://github.com/huyuanfeng2018)[ @ColdL](https://github.com/ColdL)[ @jtuglu1](https://github.com/jtuglu1)[ @xloya](https://github.com/xloya)[ @yanghua](https://github.com/yanghua)[ @steFaiz](https://github.com/steFaiz)[ @morales-t-netflix](https://github.com/morales-t-netflix)[ @felix-schultz](https://github.com/felix-schultz)[ @timsaucer](https://github.com/timsaucer) [ @HaochengLIU](https://github.com/HaochengLIU)[ @beinan](https://github.com/beinan)[ @fangbo](https://github.com/fangbo)[ @jaystarshot](https://github.com/jaystarshot)[ @lorinlee](https://github.com/lorinlee) [ @manhld0206](https://github.com/manhld0206)[ @naaa760](https://github.com/naaa760)[ @vlovich](https://github.com/vlovich)[ @pimdh](https://github.com/pimdh)

## 🌟 Open Source Releases Spotlight

|           |       |  |
| :-------- | :---------- | :-------------------------------------------------------------------------------------------------------------------- |
| LanceDB          | 0.22.1      | Shallow clone support, mTLS, custom request header support for remote database, Mean reciprocal rank reranker support |                                                                                                     |
| Lance     | 0.37        | New table metadata and incremental metadata update support, S3 throughput optimization, distributed compaction in Java, FTS UDTF support in DataFusion, scalar and vector index support for nested struct fields |
|           | 0.36        | Bloom filter index support, scalar index and compaction APIs in Java                                                  |
|           | 0.35        | New lance-tools CLI, JSONB read write support, JSON UDFs, scalar index for JSON, FTS index support for contains_token function, Apache OpenDAL support |
| Lance Namespace | 0.0.15-0.0.16 | Apache Gravitino, Apache Polaris, Google Dataproc support, simplified basic operations for REST namespace implementers |
| Lance Ray | 0.0.6       | Distributed build for FTS index, btree index, fragment level operations for customized write workflows        |
| Lance Spark | 0.0.12-0.0.13 | COUNT(\*) support, BINARY type with Lance Blob encoding read and write support                          |


