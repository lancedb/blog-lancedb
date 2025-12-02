---
title: 🎨 Semantic.Art, 💾 Stable Lance 2.1, 🎥 Ray+LanceDB powers Netflix
date: 2025-10-31
draft: false 
featured: false 
categories: ["Newsletter"]
image: "/assets/blog/newsletter-october-2025/newsletter-october-2025.png"
description: "Our October newsletter highlights Semantic.Art, Lance File 2.1, RaBitQ Quantization, upcoming events, latest product and community updates."
author: ["Jasmine Wang"]
author_avatar: "/assets/authors/jasmine-wang.png"
author_bio: "Ecosystem Engagement, Partnership, Community, DevRel"
author_github: "onigiriisabunny"
author_linkedin: "jasminechenwang"
---

## 🎨 Semantic.Art

Meet [semantic.art](https://lancedb.com/blog/semanticdotart/), a multi-feature multi-index retrieval art discovery engine that lets you search with a feeling or intent rather than matching keywords.

Powered by [LanceDB](https://www.linkedin.com/company/lancedb/). The core of the system involves dynamically understanding and inspecting a query's intent. It then chooses the best search path on the fly, blending vector, FTS, hybrid search, filtering, and custom rerankers.

<iframe width="560" height="315" src="https://www.youtube.com/embed/TqFO9fS94to?si=NE-sdFQ1bBCLUe1b" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[![SemanticDotArt: Rethinking Art Discovery with LanceDB](/assets/demos/sda_hero.jpg)](https://lancedb.com/blog/semanticdotart/)

## 💾 Lance File 2.1 Is Now Stable

Big news from the LanceDB team — Lance File Format 2.1 is officially stable!

This release solves one of the biggest challenges from 2.0: 👉 adding compression without sacrificing random access performance.

[![Lance File 2.1 Stable](/assets/blog/lance-file-2-1-stable/preview-image.png)](https://lancedb.com/blog/lance-file-2-1-stable/)

## LanceDB's 🐰RaBitQ Quantization for Blazing Fast Vector Search ⚡️

A new quantization technique in LanceDB engineering for high-performance search on large-scale, high-dimensional data.

[![LanceDB's RaBitQ Quantization for Blazing Fast Vector Search](/assets/blog/feature-rabitq-quantization/preview-image.png)](https://lancedb.com/blog/feature-rabitq-quantization/)

## ▶️ Recordings you might've missed!

<iframe width="560" height="315" src="https://www.youtube.com/embed/ga-hj7byOHw?si=8bJ9P7IwD6Q2Pqgw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> 

## 📅 Upcoming Events

[![Ray Summit 2025](/assets/blog/newsletter-october-2025/ray-summit-2025.png)](https://www.anyscale.com/ray-summit/2025/agenda)

[Ray Summit 2025](https://www.anyscale.com/ray-summit/2025/agenda) | Wednesday, November 5, 4:00 PM

LanceDB and Netflix are joining forces at Ray Summit to do a deep dive on what the Netflix Media Data Lake team is building.

[![LanceDB at PyData](/assets/blog/newsletter-october-2025/pydata.png)](https://pydata.org/seattle2025/schedule)

Look forward to three sessions from the LanceDB team at [PyData Seattle](https://pydata.org/seattle2025/schedule)!

 🎤 **Data Loading for Data Engineers**<br>
Weston Pace, Senior Software Engineer @ LanceDB | Friday, November 7, 10:10 AM

🎤 **Keynote Session: Never Send a Human to do an Agent’s Retrieval**<br>
Chang She, Co-Founder & CEO @ LanceDB | Saturday, November 8, 9:00 AM

🎤 **Supercharging Multimodal Feature Engineering with Lance and Ray**<br>
Jack Ye, Senior Software Engineer @ LanceDB | Saturday, November 8, 11:40 AM

[![LanceDB at KubeCon](/assets/blog/newsletter-october-2025/kubecon-2025.png)](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/)

Check out our two sessions at [KubeCon + CloudNativeCon North America 2025](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/)!

🎤 [**Highly Scalable AI Search Engine and AI Data Lake With Kubernetes and LanceDB**](https://kccncna2025.sched.com/event/27FXF/highly-scalable-ai-search-engine-and-ai-data-lake-with-kubernetes-and-lancedb-lu-qiu-chanchan-mao-lancedb)<br>
Lu Qiu, Database Engineer & ChanChan Mao, Developer  @ LanceDB | Tuesday, November 11, 5:45 PM

🎤 [**Building AI/ML Pipelines on Kubernetes**](https://kccncna2025.sched.com/event/27FdU/building-aiml-pipelines-on-kubernetes-susan-wu-ian-chakares-google-lu-qiu-lancedb-anant-vyas-lucy-sweet-uber)<br>
Lu Qiu (LanceDB), Susan Wu & Ian Chakares (Google), Anant Vyas & Lucy Sweet (Uber) | Thursday, November 13, 11:45 AM

[![Open Lakehouse + AI Mini Summit](/assets/blog/newsletter-october-2025/open-lakehouse-meetup.png)](https://luma.com/OLMS-1113)

[Open Lakehouse + AI Mini Summit](https://luma.com/OLMS-1113) | Thursday, November 13, 12:00 PM - 4:30 PM

Dive into the key capabilities of LanceDB's Multimodal Lakehouse—fast random-access at scale, vector + full-text search, and optimized schema primitives—so you can iterate rapidly without blowing your budget. 

Register: [https://luma.com/OLMS-1113](https://luma.com/OLMS-1113)

## 📊 LanceDB Enterprise Product News

| Feature | Description |
| :------ | :---------- |
| Clusters and manifests for Geneva | <ul><li>We have web pages and REST APIs for cluster management and manifests in Geneva</li></ul> | 
| Performance improvements | <ul><li>Optimized filtered reads with limit pushdown for better query efficiency.</li><li>Reduced index cache size for memory stability in high-load query nodes.</li></ul> |
| Operational improvements | <ul><li>Reduced **Docker image sizes** for faster downloads and deployments.</li><li>Improved **concurrent request monitoring** with gauges and adjusted logging performance. </li><li>Enhanced **PE metrics** for remote filtered reads and request performance.</li><li>Removed **torch and CUDA dependencies** from indexer image to reduce image size.</li><li>Added **Geneva metrics dashboards** and endpoint response code monitoring.</li><li>Introduced **admin commands** in <code>lancedb-cli</code>, starting with <code>health</code>.</li></ul> |

## 🫶 Community Contributions

- [Multi-path support](https://github.com/lancedb/lance/pull/4765) for Lance datasets, thanks to [@jaystarshot](https://github.com/jaystarshot) from Uber. 
- [Lance-Ray now supports distributed compaction](https://github.com/lancedb/lance-ray/pull/53) of Lance table, thanks to [@yingjianwu98](https://github.com/yingjianwu98) from Netflix.
- [Spark Data evolution](https://github.com/lancedb/lance-spark/pull/91) feature and [JSON document support in FTS index](https://github.com/lancedb/lance/pull/4752), thanks to [@fangbo](https://github.com/fangbo) & [@wojiaodoubao](https://github.com/wojiaodoubao) from Bytedance

A heartfelt thank you to our community contributors of lance and lancedb this past month:    

[@lyang24](https://github.com/lyang24)
[@wojiaodoubao](https://github.com/wojiaodoubao)
[@jaystarshot](https://github.com/jaystarshot)
[@yanghua](https://github.com/yanghua)
[@chunshao90](https://github.com/chunshao90)
[@ddupg](https://github.com/ddupg)
[@majin1102](https://github.com/majin1102)
[@yingjianwu98](https://github.com/yingjianwu98)
[@xloya](https://github.com/xloya)
[@ColdL](https://github.com/ColdL)
[@niebayes](https://github.com/niebayes)
[@yingjianwu98](https://github.com/yingjianwu98)
[@morales-t-netflix](https://github.com/morales-t-netflix)
[@wayneli-vt](https://github.com/wayneli-vt)
[@steFaiz](https://github.com/steFaiz)
[@zhangyue19921010](https://github.com/zhangyue19921010)
[@timsaucer](https://github.com/timsaucer)
[@wayneli-vt](https://github.com/wayneli-vt)
[@chenghao-guo](https://github.com/chenghao-guo)
[@jtuglu1](https://github.com/jtuglu1)
[@huyuanfeng2018](https://github.com/huyuanfeng2018)
[@valkum](https://github.com/valkum)
[@naaa760](https://github.com/naaa760)
[@edrogers](https://github.com/edrogers)
[@tlamarre91](https://github.com/tlamarre91)

## 🌟 Open Source Releases Spotlight

| Feature | Version | Description |
| :------ | :------ | :---------- |
| LanceDB | 0.22.2 | Allow bitmap indexes on large-string, binary, large-binary, and bitmap, support namespace database in rust.|
| Lance | 0.38.3 | Support multi-base write, allowing one Lance dataset to span across multiple buckets. Support zstd/lz4 compression. Support custom stop word in FTS index. Support shallow clone and branching in Python and Java. Support Blob API in Java. Support index against nested field. Support change data feed for inserted and updated rows. Better logging and auditing across code execution.|
| | 0.38.2 | Fix forward compatibility of FTS index changes in 0.38.0. |
| | 0.38.1 | Support fragment level column update. Support faster IVF-PQ indexing on GPU.
| | 0.38.0 | ❗ As of this release, the 2.1 version of the file format is considered stable. There will be no more breaking changes and the format should be readable by future versions of lance. In an upcoming release (possibly the next release) the 2.1 version will become the default. <br><br> Blob encoding for v2.1 file format. Performance improvement of FTS index (reduces the P95 latency by 32.3%). FTS index now supports specialized JSON document tokenizer. |
| Lance Namespace | 0.0.17-0.0.20 | Add support for Azure OneLake, refactor of rust library into main lance repo for better integration |
| Lance Ray | 0.0.7-0.0.8 | Support distributed compaction of Lance table |
| Lance Spark | 0.0.14-0.0.15 | Data Evolution in Apache Spark: users can run ALTER COLUMN FROM to add column and backfill column data at the same time |

