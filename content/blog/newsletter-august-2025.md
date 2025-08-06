---
title: "LanceDB Newsletter: August 2025"
date: 2025-08-05
draft: false
featured: false
categories: ["Announcement"]
image: /assets/blog/newsletter-august-2025/image-003.png
description: "Our August newsletter features a new case study with Dosu, recaps from events with Harvey and Databricks, and the latest product and community updates."
author: "The LanceDB Team"
author_avatar: ""
author_bio: ""
author_github: "lancedb"
author_linkedin: "lancedb"
---

Welcome to the August 2025 edition of the LanceDB newsletter! This month, we're excited to share a deep dive into how Dosu is leveraging LanceDB, recap some fantastic events, and highlight the latest updates to our products and community.

## Highlights

### Case Study: Dosu's Living Knowledge Base for Code

We are thrilled to showcase our latest case study with Dosu. By integrating LanceDB, Dosu has achieved:
-   **90% label accuracy** for context-aware labeling of GitHub issues.
-   **70% reduction** in manual issue triage, freeing up maintainers to focus on high-value work.
-   **Millisecond search** across millions of vectors for real-time indexing of code, docs, and discussions.

> "LanceDB powers the heart of our AI at Dosu. Its lightning-fast search, built-in versioning, and effortless scalability let us move faster, ship smarter, and deliver cutting-edge intelligence to millions of developers without compromise."
>
> **Devin Stein, Founder & CEO, Dosu**

Read the full story: [Case Study: Meet Dosu - the Intelligent Knowledge Base for Software Teams and Agents](https://lancedb.com/blog/case-study-dosu/)

![Dosu and LanceDB partnership](/assets/blog/newsletter-august-2025/image-002.png)

## Event Recap!

In case you missed them, recordings from our June events are now available!

-   **Scaling Enterprise-Grade RAG: Lessons from Legal Frontier**: A joint talk with Calvin Qi from Harvey at the AI Engineer World's Fair.
-   **LanceDB: A Complete Search and Analytical Store for Serving Production-scale AI Applications**: Our session at the Databricks DATA+AI SUMMIT with Chang She and Zhidong Qu.

![Harvey and LanceDB event](/assets/blog/newsletter-august-2025/image-005.png)
![Databricks and LanceDB event](/assets/blog/newsletter-august-2025/image-006.png)

## LanceDB Enterprise Product News

We've rolled out some powerful new features for LanceDB Enterprise:

-   **Seamless streaming ingestion**: Automatically optimize indexes during streaming writes for consistently fast performance.
-   **Blazing-fast range queries**: Execute range filters hundreds of times faster, supercharging vector search with metadata.
-   **Multivector support in JavaScript SDK**: Store and search multiple vector embeddings for a single item.
-   **Easy data exploration from LanceDB Cloud UI**: Filter table data with SQL and select specific columns for a customizable view.

## Community Contributions

A huge thank you to our amazing community contributors this month! Here are a few highlights:

-   **Enwen Jiao (@jiaoew1991)** from Luma.ai for contributions to Lance-Ray integration.
-   **Drew Gallardo (@geruh)** from AWS for work on AWS Glue integration.
-   **Kazuhito Takeuchi (@kazuhitoT)** for native integration with the Lindera tokenizer.
-   **Jinglun, Jin Ma, Bo Fang, Jay Ju, Chenghao Guo, and Vino Yang** from ByteDance for extensive work on Hive MetaStore integration, the Java SDK, SQL API, and dataset event tracing.

## Open Source Releases Spotlight

-   Lance now supports integration with various catalogs, including **Hive MetaStore (2.x and 3.x+), AWS Glue, and Unity catalog**.
-   The Lance Spark connector now supports **Spark 4.0 and Scala 2.13**.

That's all for this month. As always, we are grateful for your support and contributions. Stay connected with us for more exciting updates!
