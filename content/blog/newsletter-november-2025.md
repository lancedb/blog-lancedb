---
title: 🛡️Lance Community Governance, Lance + Iceberg 🧊, Netflix’s Multimodal Search Demo 🔍
date: 2025-12-03
draft: false 
featured: false 
categories: ["Newsletter"]
image: "/assets/blog/newsletter-november-2025/preview-image.png"
description: "Our November newsletter highlights Lance community governance, a deep dive on Lance and Iceberg, a demo of Netflix's multimodal search, previous talk recordings, and the latest product and community updates."
author: "ChanChan Mao"
author_avatar: "/assets/authors/chanchan-mao.jpg"
author_bio: "DevRel"
author_github: "ccmao1130"
author_linkedin: "chanchanmao"
---

## Introducing Lance Community Governance 🛡️

We’ve launched a dedicated Lance discord focused entirely on the format, feature discussions, proposals, and real-world use cases. In addition, Lance now also has its own website and GitHub organization to maintain its own ecosystem for its user community.

- Read the announcement here: [https://lancedb.com/blog/lance-community-governance/](https://lancedb.com/blog/lance-community-governance/)
- Learn more about the community: [https://lance.org/community/](https://lance.org/community/)
- Join the new Lance discord: [discord.gg/lance](https://discord.gg/lance)
- Give Lance format a star: [https://github.com/lance-format](https://github.com/lance-format)

[![Lance Community Governance](/assets/blog/lance-community-governance/preview-image.png)](https://lancedb.com/blog/lance-community-governance/)


## From BI to AI: A Modern Lakehouse Stack with Lance and Iceberg 🧊

The modern lakehouse stack is composed of six layers. File formats, table formats, and catalog specs are just storage definitions. All compute power actually lives in the object store, catalog services, and compute engines.

[![Lakehouse stack](/assets/blog/from-bi-to-ai-lance-and-iceberg/lakehouse_stack.png)](https://lancedb.com/blog/from-bi-to-ai-lance-and-iceberg/)

What makes Lance different is that it spans all three storage layers at once: file format, table format, and catalog spec. Iceberg operates at two: table format and catalog spec.

Iceberg remains a strong choice for large-scale OLAP and BI workloads. Lance complements it by addressing AI and multimodal data requirements with an Arrow-native layout, high-performance indexing, and built-in interop with Parquet.

Together, both formats can coexist in the same lakehouse stack: Iceberg for BI, Lance for AI. 

[![Lance and Iceberg](/assets/blog/from-bi-to-ai-lance-and-iceberg/preview-image.png)](https://lancedb.com/blog/from-bi-to-ai-lance-and-iceberg/)

## Netflix's Multimodal Search Demo 🔍

Here is a demo that Pablo Delgado from Netflix put together for Netflix and LanceDB's joint talk at Ray Summit 2025 (you can find the session recording below). This video highlights how to search through hundreds of terabytes of multimodal data with negligible latency and perform multimodal data understanding at scale.

The demonstration showcases a sophisticated multimodal embedding system that enables semantic search across Netflix's vast video catalog. The system supports multiple embedding modes (text-to-text, text-to-image, image-to-image, and image-to-text) allowing researchers to query content using either natural language descriptions or visual references. Each video frame is enriched with metadata that captures not only visual content but also contextual details like scene composition, lighting, mood, and subject matter.

<iframe width="560" height="315" src="https://www.youtube.com/embed/XK4L53z6eso?si=XcHc7Uu1hgCwESkU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## ▶️ Recordings you might've missed!

<iframe width="560" height="315" src="https://www.youtube.com/embed/1hBesu2Erg0?si=KSwMvVm9BivJ5XC7" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/uapsxFc1D5o?si=hPJs9ED2kk7DlFwu" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/pt_v-x0pT2Y?si=BrLjpo9fv6XJoA_t" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


## 📊 LanceDB Enterprise Product News

| Feature | Description |
| :------ | :---------- |
| tbd | |

## 🫶 Community Contributions

- tbd

A heartfelt thank you to our community contributors of lance and lancedb this past month:    

[@mykolaskrynnyk](https://github.com/mykolaskrynnyk) 
[@valkum](https://github.com/valkum) 
[@fzowl](https://github.com/fzowl)
[@rm-dr](https://github.com/rm-dr)
[@ozkatz](https://github.com/ozkatz)
[@ddupg](https://github.com/ddupg)
[@majin1102](https://github.com/majin1102)
[@shiyajuan123](https://github.com/shiyajuan123)
[@jaystarshot](https://github.com/jaystarshot)
[@wojiaodoubao](https://github.com/wojiaodoubao)
[@zhangyue19921010](https://github.com/zhangyue19921010)
[@fenfeng9](https://github.com/fenfeng9)
[@fangyinc](https://github.com/fangyinc)
[@HaochengLIU](https://github.com/HaochengLIU)
[@Pmathsun](https://github.com/Pmathsun)
[@ztorchan](https://github.com/ztorchan)
[@yanghua](https://github.com/yanghua)
[@timsaucer](https://github.com/timsaucer)
[@fangbo](https://github.com/fangbo)
[@steFaiz](https://github.com/steFaiz)
[@niyue](https://github.com/niyue)
[@xloya](https://github.com/xloya)
[@oceanusxiv](https://github.com/oceanusxiv)
[@luohao](https://github.com/luohao)
[@rahil-c](https://github.com/rahil-c)
[@BorenTsai](https://github.com/BorenTsai)
[@Maxwell-Guo](https://github.com/Maxwell-Guo)
[@teh-cmc](https://github.com/teh-cmc)
[@camilesing](https://github.com/camilesing)


## 🌟 Open Source Releases Spotlight

| Feature | Version | Description |
| :------ | :------ | :---------- |
| tbd | | |

