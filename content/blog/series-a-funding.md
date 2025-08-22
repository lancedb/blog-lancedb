---
title: "LanceDB Raises $30M Series A to Build the Multimodal Lakehouse"
date: 2025-06-24
draft: false
featured: false
categories: ["Announcement"]
image: /assets/blog/series-a-funding/preview-image.png
meta_image: /assets/blog/series-a-funding/preview-image.png
description: "We have closed another funding round to accelerate development of the Multimodal Lakehouse - a unified platform for AI data infrastructure."
author: Chang She
author_avatar: "/assets/authors/chang-she.jpg"
author_bio: "CEO and Co-Founder of LanceDB."
author_twitter: "changhiskhan"
author_github: "changhiskhan"
author_linkedin: "changshe"
---

Today, I am proud to announce that LanceDB has closed a **$30 million Series A** round led by **Theory Ventures**, with additional participation from **CRV, YCombinator, Databricks Ventures, RunwayML, Zero Prime, Swift**, and many other amazing investors, all of whom share our vision for multimodal data.

## The New Open Source Standard for AI Data

Over the past year, we have witnessed Lance become the new standard for multimodal data. As of June 2025, **Lance remains the fastest growing format** across the data ecosystem. During this period, our open source packages have been downloaded more than 20 million times.

Four years ago my co-founder **Lei** and I asked a simple question: Why is working with embeddings, images, and video still so difficult, when compared to tabular data? The truth was simple: the industry was building on foundations meant for yesterday's data. We decided to start from first principles, which meant discarding formats like Parquet and WebDataset. This moment of clarity became the seed of LanceDB.

Now, **LanceDB Enterprise** runs at massive scale within leading Generative AI companies such as Runway, Midjourney, and Character.ai. These teams are searching over tens of billions of vectors and managing petabytes of training data for AI models. With LanceDB, they are moving faster, scaling more efficiently, and dramatically reducing infrastructure complexity and cost.

## The Game Has Changed

Since we started LanceDB, AI's rise has been nothing short of meteoric. In two decades of building data tools, I've never seen technology spread faster. Our customers taught us three things:

1. **Data variety** now includes embeddings, documents, images, and video, a much richer set than the tabular data seen previously.  
2. **Multimodal data volume** is 3-9 orders of magnitude larger than tabular data, surprising even small teams with petabytes to manage.  
3. **The velocity** of data generation is no longer gated on manual human action; LLMs and VLMs create new data at thousands of tokens per second and are getting faster all the time.

The generation and use of multimodal data is growing at an unprecedented pace, driven by the need to capture the full richness of meaning.

By 2025, an estimated 156 zettabytes (ZB) of data will be video—representing 90% of all data generated. That’s nearly three times more than in 2022 (53.6 ZB) and over four times more than in 2018 (37 ZB).

![multimodal-data-growth](/assets/blog/series-a-funding/data-size.jpg)

Source: [Accelerating Model Development and Fine-Tuning on Databricks with TwelveLabs](https://www.youtube.com/watch?v=gdIrpWvPD1M)

The data infrastructure we have today is not enough to meet this new challenge. Traditional data lakes are great for tabular data and BI tasks, but not great for AI workloads, online serving, and multimodal data. Simultaneously, vector databases are optimized for online search on vector data, but not appropriate for other needs. 

Tasks like feature engineering, data exploration, and training that are critical for building great AI are not well served by any of the existing infrastructure tooling.

The result is that engineers today need to stitch together multiple tools, spending all their time with plumbing instead of experimenting, shipping features, or improving the cognitive layer in the agent they're building.

## Introducing the Multimodal Lakehouse

Imagine you're building a complex AI application or training a large model. The ideal foundation would let you put your data from embeddings and documents to images and videos all in one place. On top of this **single source of truth**, you'd be able to run all the workloads you need from search to training without multiple systems. 

As you scale from experimentation to petabytes of data and tens of thousands of queries per second, you wouldn't need to worry about the underlying infrastructure. Everything would simply work.

**This is exactly what we're creating at LanceDB, and it's called the Multimodal Lakehouse.** Built on open-source Lance format, it is a unified engine designed specifically for AI, allowing you to store, retrieve, and compute over all your multimodal data.

![Multimodal Lakehouse Architecture](/assets/blog/series-a-funding/lancedb-enterprise.png)

The Multimodal Lakehouse combines the best of data lakes and vector databases into a single platform optimized for AI workloads, eliminating the need to manage multiple disparate systems.

To learn more about the Multimodal Lakehouse, [read our latest engineering blog](http://lancedb.com/blog/multimodal-lakehouse/).

## A Major Milestone

This investment marks a pivotal step in our mission to redefine data infrastructure for the AI era. We will accelerate our work on the Multimodal Lakehouse, deepen our commitment to the Lance open-source community, and help teams everywhere build AI applications faster, cheaper and easier.

Early Lakehouse features are already driving real-world production for our largest LanceDB Enterprise customers. To discover how it works for them, and what's coming next, [download our technical report on the Multimodal Lakehouse](/download/) with real-world learnings. 

With this funding, we're doubling down on:

- **Expanding the Multimodal Lakehouse** with new capabilities for feature engineering and model training
- **Growing our open-source community** around the Lance format
- **Scaling our enterprise platform** to support even larger AI workloads
- **Building partnerships** with leading AI companies and research institutions

> Let's build what's next, together. </br>
> Chang She


