---
title: "⚖️ Harvey’s Enterprise-Grade RAG on LanceDB, 💼 Dosu Case Study, Minimax&LumaLabs❤️Lance-Ray"
date: 2025-08-05
draft: false
featured: false
categories: ["Newsletter"]
image: "/assets/blog/newsletter-august-2025/JulyNews.png"
description: "Our August newsletter features a new case study with Dosu, recaps from events with Harvey and Databricks, and the latest product and community updates."
author: "Jasmine Wang"
author_avatar: "/assets/authors/jasmine-wang.png"
author_bio: "Ecosystem Engagement, Partnership, Community, DevRel"
author_github: "onigiriisabunny"
author_linkedin: "jasminechenwang"
---

## 💼 LanceDB Powers the Heart of AI at Dosu

- 90% label accuracy
- 70% less manual triage
- Millisecond search on millions of vectors

Those are the numbers became real the moment the team switched to LanceDB inside Dosu. Learn more about how Dosu uses LanceDB as their living knowledge for codebases in this new [Case Study: Meet Dosu - the Intelligent Knowledge Base for Software Teams and Agents](https://lancedb.com/blog/case-study-dosu/)

> "LanceDB powers the heart of our AI at [Dosu](https://www.dosu.ai). Its lightning-fast search, built-in versioning, and effortless scalability let us move faster, ship smarter, and deliver cutting-edge intelligence to millions of developers without compromise."
>
> **[Devin Stein, Founder & CEO](https://www.linkedin.com/in/devstein/), [Dosu](https://dosu.dev/)**


![Dosu Case Study](/assets/blog/newsletter-august-2025/Dosucase.png)



## 🎤 Event Recap!

In case you missed some of the cool events in June, the recordings are finally out! Check out the joint talks we did with Harvey and Databricks on how LanceDB helps scale enterprise AI systems in production!

-   **<span style="color: #ff6f1a; font-weight: bold;">[Scaling Enterprise-Grade RAG: Lessons from Legal Frontier](https://youtu.be/W1MiZChnkfA)</span>**: A joint talk with [Calvin Qi](https://www.linkedin.com/in/calvinqi/) from [Harvey](https://www.harvey.ai) at the AI Engineer World's Fair.
    {{< youtube W1MiZChnkfA >}}
-   **<span style="color: #ff6f1a; font-weight: bold;">[Lakehouse Architecture for AI Data: Search, Analytics, Processing, Training](https://youtu.be/SvXhXIJM7hA)</span>**: Our session at the <span style="color: #ff6f1a; font-weight: bold;">Databricks</span> DATA+AI SUMMIT with [Chang She](https://www.linkedin.com/in/changshe/) and [Zhidong Qu](https://www.linkedin.com/in/zhidong-qu/).
    {{< youtube SvXhXIJM7hA >}}




## 📰 Product News: New Enterprise Features

| Feature                                      | Description                                                                                                                         |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Seamless streaming ingestion**             | Automatically optimize indexes during streaming writes, providing consistently fast performance even under continuous data flow.     |
| **Blazing-fast range queries**               | Range filters like "value >= 1000 and value < 2000" now can execute hundreds of times faster, supercharging vector search with metadata filtering. |
| **Multivector support in JavaScript SDK**    | LanceDB JavaScript/TypeScript SDK enables you to store and search multiple vector embeddings for a single item.                      |
| **Easy data exploration from LanceDB Cloud UI** | Filter table data with SQL and select specific columns for a customizable view of your LanceDB datasets.                             |

## Community Contributions

- [@jiaoew1991](https://github.com/jiaoew1991) Enwen Jiao previously worked on Data Engine at Minimax and now at Luma.ai. He has made multiple contributions to support Lance-Ray integration: `add_column` supports Ray to add columns to existing tables in a distributed manner [PR1](https://github.com/lancedb/lance-ray/pull/21), and `add_dataset_options parameter` supports exposing more native parameters when reading lance tables based on version and tag [PR2](https://github.com/lancedb/lance-ray/pull/27) .
- [@geruh](https://github.com/geruh) Drew Gallardo from AWS worked on AWS Glue integration with Lance [PR1](https://github.com/lancedb/lance-namespace/pull/167), [PR2](https://github.com/lancedb/lance-namespace/pull/158)
- [@kazuhitoT](https://github.com/kazuhitoT) Kazuhito Takeuchi for native integration with Lindera tokenizer [PR1](https://github.com/lancedb/lance/pull/3932), [PR2](https://github.com/lancedb/lance/pull/4144)
- A heartfelt thank you to our community contributors of lance and lancedb this past month: [@yanghua](https://github.com/yanghua) [@fangbo](https://github.com/fangbo) [@emmanuel-ferdman](https://github.com/emmanuel-ferdman) [@adi-ray](https://github.com/adi-ray) [@ddupg](https://github.com/ddupg) [@chenghao-guo](https://github.com/chenghao-guo) [@LeoReeYang](https://github.com/LeoReeYang) [@majin1102](https://github.com/majin1102) [@HaochengLIU](https://github.com/HaochengLIU) [@Jay-ju](https://github.com/Jay-ju) [@SaintBacchus](https://github.com/SaintBacchus) [@Sbargaoui](https://github.com/Sbargaoui) [@lalitx17](https://github.com/lalitx17) [@allenanswerzq](https://github.com/allenanswerzq) [@bjurkovski](https://github.com/bjurkovski) [@TaoKevinKK](https://github.com/TaoKevinKK) [@wojiaodoubao](https://github.com/wojiaodoubao) [@KazuhitoT](https://github.com/KazuhitoT) [@niyue](https://github.com/niyue) [@kilavvy](https://github.com/kilavvy) [@b4l](https://github.com/b4l) [@Dig-Doug](https://github.com/Dig-Doug) [@xhwhis](https://github.com/xhwhis)[@tristanz](https://github.com/tristanz) [@chenkovsky](https://github.com/chenkovsky) [@aniaan](https://github.com/aniaan) [@yihong0618](https://github.com/yihong0618) [@Kilerd](https://github.com/Kilerd) [@CyrusAttoun](https://github.com/CyrusAttoun) [@kemingy](https://github.com/kemingy) [@wengh](https://github.com/wengh) [@geruh](https://github.com/geruh)

## Open Source Releases Spotlight

| Project | Version | Updates |
| ------- | ------- | ------- |
| LanceDB | [v0.21.2](https://github.com/lancedb/lancedb/releases/tag/v0.21.2) | Various improvements including support for [ngram tokenizer](https://github.com/lancedb/lancedb/pull/2507), [multivector for Javascript](https://github.com/lancedb/lancedb/pull/2527), [session support in python and javascript](https://github.com/lancedb/lancedb/pull/2530) |
| LanceDB | [v0.21.1](https://github.com/lancedb/lancedb/releases/tag/v0.21.1) | Various improvements including [batch Ollama embed calls](https://github.com/lancedb/lancedb/pull/2453) |
| Lance | [v0.32.0](https://github.com/lancedb/lance/releases/tag/v0.32.0) | Breaking changes: use [FilteredReadExec in the planner](https://github.com/lancedb/lance/pull/3813) & [consolidated index cache](https://github.com/lancedb/lance/pull/4047) |
| Lance | [v0.31.1](https://github.com/lancedb/lance/releases/tag/v0.31.1) | New documentation website built with mkdocs |

