---
title: "WeRide's Data Platform Transformation: How LanceDB Fuels Model Development Velocity"
date: 2024-12-10
draft: false
featured: false
categories: ["Case Study", "Autonomous Vehicles"]
image: /assets/blog/werides-data-platform-transformation-how-lancedb-fuels-model-development-velocity/werides-data-platform-transformation-how-lancedb-fuels-model-development-velocity.png
description: "Discover how WeRide, a leading autonomous driving company, leveraged LanceDB to revolutionize their data platform, achieving 90x improvement in ML developer productivity and reducing data mining time from 1 week to 1 hour."
author: ["Qian Zhu"]
author_avatar: "/assets/authors/qian-zhu.jpg"
author_bio: "Software Engineer at LanceDB specializing in cloud infrastructure, autonomous vehicle data platforms, and vector database optimization."
author_twitter: "qianzhu56"
author_github: "qianzhu56"
author_linkedin: "qianzhu56"
---

{{< admonition info "Case Study Collaboration" >}}
This is a case study contributed by the following authors:
- [**Fei Chen**](https://www.linkedin.com/in/fei-chen-90364325/), Director of Infrastructure @ WeRide
- [**Qian Zhu**](https://www.linkedin.com/in/qianzhu56/), Software Engineer @ LanceDB
{{< /admonition >}}

![WeRide Fleet](/assets/blog/werides-data-platform-transformation-how-lancedb-fuels-model-development-velocity/weride-quote.png)

## Introduction

Established in 2017, [WeRide](https://www.weride.ai/) (Nasdaq: WRD) is a leading global commercial-stage company that develops autonomous driving technologies from level 2 to level 4. WeRide is the only tech company in the world that holds the driverless permits in China, the UAE, Singapore and the U.S., conducting autonomous driving R&D, tests and operations in over 30 cities of 7 countries around the world. WeRide has operated a self-driving fleet for more than 1,700 days.

As a pioneer in autonomous driving technologies and applications, WeRide excels at fast iteration on model development, particularly on the data loop. In 2023, as the massive amount of complex, multi-modal data continued to grow, *Fei Chen*, director of the data infrastructure team at WeRide, spearheaded the solution of a data platform that can serve lighting fast search (in ms) with high query-per-second (QPS) for data that satisfying specific criteria, e.g. rare data that can be used to train a long tail case, and is cost-effective, and easy to maintain.

## The Challenge

### Revolutionize Data Platform to Support Data Mining

The most challenging problem with autonomous driving is addressing the endless long-tail scenarios. Such scenarios require mining data to identify patterns in sensor data, such as camera images and radar, lidar readings. A data platform to support data mining would meet:

{{< admonition warning "Critical Requirements" >}}
- **Low Latency:** Achieve millisecond P99 latency for top-1000 results retrieval using text-to-image or image-based queries against datasets containing billions of data
- **Hybrid Querying:** Support combined vector and metadata filtering for precise and efficient data retrieval
- **Low I/O:** Minimize bandwidth consumption per second to align with WeRide's high-speed storage system used for feeding model training data
- **Cost Performance:** Deliver a cost-effective solution that scales to accommodate growing business needs while minimizing maintenance overhead
{{< /admonition >}}

As WeRide's data infrastructure team explored solutions to support data mining for long-tail scenarios in autonomous driving, the team quickly realized that traditional SQL-based search was insufficient. Instead, a vector database was necessary to provide rapid search capabilities for the massive amounts of multi-modal data generated after converting text and images into embeddings.

## The Solution

### LanceDB as the Vector Database in the Revolutionized Data Platform

When Fei and his team began searching for a vector database, they had clear requirements: it needed to be cost-effective, support multi-modal data, and provide blazing fast vector search with metadata filtering. After evaluating the available options, WeRide chose to partner with LanceDB to power the search engine within their data platform.

Choosing LanceDB wasn't just about solving WeRide's immediate data mining challenges; it was a strategic decision with long-term implications. With the anticipated growth of WeRide's autonomous driving fleet, Fei and his team foresee LanceDB playing a pivotal role in diverse applications, including driving behavior analysis and user-centric ride customization. They strongly believe that LanceDB will remain an indispensable tool for a wide range of applications.

### Implementation Architecture

To search for data that matches a rare scenario, for example, people lying on the ground, the pipeline would use text-to-image or image-to-image search. The images and videos collected from autonomous vehicles are converted as vectors. All embeddings along with metadata is ingested into LanceDB, backed by the in-house storage cluster built by the data infrastructure team. LanceDB then indexes the data for fast search. As new data gets added, the re-index is triggered on a weekly and monthly basis. During a search, the text or image will first be embedded then do a similar search with all embeddings. Usually, such search will be combined with applying filters on certain metadata fields. Returned search results, e.g. top 1000, will then go through the feature engineering process to be fed into models for training.

*WeRide's data platform architecture showing how LanceDB powers multi-modal search across autonomous vehicle sensor data.*

![WeRide Architecture](/assets/blog/werides-data-platform-transformation-how-lancedb-fuels-model-development-velocity/architecture.png)

> "Lance has helped us streamline our data analysis process, allowing us to quickly and efficiently identify valuable data to enhance our autonomous driving technology"
> 
> — Fei Chen, Director of Data Infrastructure @ WeRide

## Results & Impact

By integrating LanceDB as the vector database in their data platform, WeRide is able to streamline the data analysis process, quickly and efficiently identify valuable data to enhance the autonomous driving technology:

### Performance Metrics

- **Productivity improvement:** WeRide has seen **90x** improvement to ML developer productivity for data exploration and debugging with LanceDB serving fast and high quality search
- **Performance improvement:** WeRide has also seen **3x** reduction in ML training time by improving data I/O
- **Time-to-value:** The time on data mining for safety critical edge cases was **reduced from 1 week to 1 hour**

### Strategic Benefits

Beyond its technical advantages, LanceDB's ease of maintenance and seamless scalability have been crucial as WeRide's data volume expanded exponentially.

> "The strategic partnership with LanceDB has provided a robust foundation for future innovation, empowering WeRide's continued business growth."
> 
> — Fei Chen, Director of Data Infrastructure @ WeRide
