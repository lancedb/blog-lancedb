---
title: "June 2025: $30M Series A, Multimodal Lakehouse Launch & Product Updates"
date: 2025-07-08
draft: false
featured: false
categories: ["Announcement"]
image: /assets/blog/newsletter-june-2025/social_preview.png
description: "LanceDB's June 2025 newsletter covering latest company news, product updates, open source releases, and community highlights."
author: David Myriel
author_avatar: "/assets/authors/david-myriel.jpg"
author_bio: "Writer"
author_github: "davidmyriel"
author_linkedin: "davidmyriel"
---

## LanceDB is Now a Series A Company

Over the past year, we have witnessed [the Lance columnar format](https://lancedb.com) become the new standard for multimodal data. As of June 2025, [Lance remains the fastest growing format](https://github.com/lancedb/lance) across the data ecosystem. During this period, our open source packages have been downloaded more than 20 million times. 

![Series A Funding Announcement](/assets/blog/series-a-funding/preview-image.png)

This milestone represents a significant validation of our vision to democratize multimodal AI development. The $30M Series A funding will accelerate our mission to build the most efficient and scalable data platform for AI applications. This investment will fuel our continued innovation in multimodal data processing, expand our enterprise offerings, and strengthen our global community of developers and data scientists.

{{% admonition Blog %}}
[Announcement from our Cofounder & CEO Chang She](https://lancedb.com/blog/series-a-funding/)
{{% /admonition %}}

## LanceDB Multimodal Lakehouse

As of June 24th, 2025, along with the celebration of LanceDB’s Series A, we are introducing the [Multimodal Lakehouse Suite of Products](https://lancedb.com/multimodal-lakehouse.html) into LanceDB Enterprise. 

![Multimodal Lakehouse Architecture](/assets/blog/multimodal-lakehouse/lancedb-enterprise.png)

The LanceDB Enterprise offering now consists of four features: Search, Exploratory Data Analysis, Feature Engineering and Training.

![LanceDB Multimodal Lakehouse Architecture](/assets/blog/multimodal-lakehouse/preview-image.png)

The Multimodal Lakehouse represents a breakthrough in unified data management for AI applications, seamlessly handling text, images, audio, and video data in a single platform. This comprehensive solution eliminates the complexity of managing multiple data silos and provides enterprises with the tools they need to build, train, and deploy multimodal AI models at scale. 

With built-in support for the latest AI frameworks and optimized performance for large-scale datasets, the Multimodal Lakehouse is designed to accelerate the development of next-generation AI applications.

{{% admonition Blog %}}
[What is the LanceDB Multimodal Lakehouse?](https://lancedb.com/blog/multimodal-lakehouse/)
{{% /admonition %}}

## LanceDB Enterprise Product News

| Feature | Description |
|---------|-------------|
| **Richer full-text search capabilities** | Unlock advanced FTS with boolean logic, flexible phrase matching, and autocomplete-ready prefix queries. |
| **Blazing-fast full-text search** | Optimized FTS engine now delivers P99 latencies under 50ms on 40M-row tables, lightning speed at scale. |
| **Streamlined Kubernetes deployments** | Native Helm chart support makes BYOC setups faster and easier to manage. A deployment can be up and running in a couple of hours. |
| **Smarter vector search with tight filters** | Fine-tune recall with new minimum_nprobes and maximum_nprobes controls for better results on queries with highly selective filters. |

## Open Source Releases:

| Project | Version | Updates |
|---------|---------|----------|
| Lance | [v0.31.0](https://github.com/lancedb/lance/releases/tag/v0.31.0) | Breaking changes: [refactor Dataset config api and expose it via pylance](https://github.com/lancedb/lance/pull/4041). |
| Lance | [v0.30.0](https://github.com/lancedb/lance/releases/tag/v0.30.0) | Breaking changes: [auto-remap indexes before scan](https://github.com/lancedb/lance/pull/3971) & [move file metadata cache to bytes capacity](https://github.com/lancedb/lance/pull/3949). |
| LanceDB | [v0.21.0](https://github.com/lancedb/lancedb/releases/tag/v0.21.0) | Various improvements to native full text search and native full text search is now the default <br> New documentation site: lancedb.github.io/documentation <br> Lance Trino connector and PostgreSQL extension|

## Events Recap

### From Text to Video: A Unified Multimodal Data Lake for Next-Generation AI

[Ryan Vilim from Character AI](https://character.ai) shares how their Data & AI Platform team builds self-service tools and infrastructure to power LLM training and research. He explains how they leverage data lakes, Spark, Trino, Kubernetes, and Lance to prepare, annotate, and serve massive multimodal datasets—while keeping workflows fast and researcher-friendly.

<iframe width="560" height="315" src="https://www.youtube.com/embed/P6GdGMvZG74?si=9WU7pjSNOp5l_iu5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

The talk also covers why Lance’s open multimodal lakehouse format fits their needs, enabling unified storage, search, and analytics at scale. Packed with practical insights on managing AI data pipelines, this session is perfect for anyone building or scaling AI systems.

### Building a Data Foundation for Multimodal Foundation Models

[Ethan Rosenthal from Runway](https://runwayml.com) delivers an in-depth exploration of the unsung heroes behind generative models: data pipelines. Skipping over models and flashy applications, he dives into the nuts and bolts of handling massive, unstructured datasets—video, text, embeddings, and metadata—used to train and iterate on state-of-the-art generative video and image systems. 

Drawing on his experience at Square and Runway, Ethan outlines the evolution from structured fraud-detection data to the complexities of multimodal AI, demonstrating why robust data infrastructure is the true backbone of model performance.

<iframe width="560" height="315" src="https://www.youtube.com/embed/6kf58xD5s3Q?si=OcRRt-dWPU3TM7SR" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Throughout the talk, Ethan shares pragmatic lessons on system design—covering topics like columnable storage formats (moving beyond tarballs and Parquet), schema evolution with LanceDB, efficient video decoding, asynchronous data loading to eliminate GPU bottlenecks, and on-the-fly augmentation for flexible experimentation. 

With candid insights and practical trade-offs, this session is essential for engineers and researchers building scalable, researcher-friendly pipelines for the next generation of generative AI.

## Community Contributions:

A heartfelt thank you to our community contributors of lance and lancedb this past month:

@renato2099, @wojiaodoubao, @Jay-ju, @b4l, @yanghua, @HaochengLIU, @ddupg, @bjurkovski  @kilavvy@wojiaodoubao, @leaves12138, @majin1102, @leopardracer, @luohao, @KazuhitoT, @frankliee

