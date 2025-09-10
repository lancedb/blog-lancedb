---
title: "Netflix’s Media Data Lake, CodeRabbit Case Study, Lance Namespace"
date: 2025-09-08
draft: false
featured: false
categories: ["Newsletter"]
image: "/assets/blog/netflix-mediadata-lake-coderabbit-case-study-lance-namespace/image5.png"
description: "Our September newsletter highlights LanceDB powering Netflix's Media Data Lake, a case study on CodeRabbit's AI-powered code reviews, and updates on Lance Namespace and Spark integration."
author: "Jasmine Wang"
author_avatar: "/assets/authors/jasmine-wang.png"
author_bio: "Ecosystem Engagement, Partnership, Community, DevRel"
author_github: "onigiriisabunny"
author_linkedin: "jasminechenwang"
---


## [LanceDB Powers Netflix Media Data Lake](https://lancedb.com/blog/case-study-netflix/) 

> To enable the next generation of media analytics and machine learning, we are building the **Media Data Lake** at Netflix — a data lake designed specifically for media assets at Netflix using [LanceDB](https://lancedb.com/). We have partnered with our data platform team on integrating LanceDB into our [Big Data Platform](https://netflixtechblog.com/all?topic=big-data). 
> 
> - **Media ML Data Engineering, Netflix**

![](/assets/blog/netflix-mediadata-lake-coderabbit-case-study-lance-namespace/image11.png)  

A deep dive on Netflix’s Media ML Data Engineering, a new specialization that bridges the gap between traditional data engineering and the unique demands of media-centric machine learning, and how they build the Media Data Lake with LanceDB. 

Read the Netflix Tech Blog [From Facts & Metrics to Media Machine Learning: Evolving the Data Engineering Function at Netflix](https://netflixtechblog.com/from-facts-metrics-to-media-machine-learning-evolving-the-data-engineering-function-at-netflix-6dcc91058d8d)

## [Case Study: How CodeRabbit Leverages LanceDB for AI-Powered Code Reviews](https://lancedb.com/blog/case-study-coderabbit/)

![](/assets/blog/netflix-mediadata-lake-coderabbit-case-study-lance-namespace/image3.png)

> "LanceDB transformed how we handle context at scale. While other vector databases hit cost and performance walls, LanceDB scales effortlessly with our growth—from startup to enterprise. Its multimodal capabilities and deployment flexibility were game-changers, enabling us to deliver the depth of analysis our customers expect while maintaining sub-second response times across millions of code reviews."
> 
> **[Rohit Khanna, VP of Engineering ](https://www.linkedin.com/in/rrkhanna/), [CodeRabbit](https://www.coderabbit.ai/)**

## [Manage Lance Tables in Any Catalog using Lance Namespace and Spark](https://lancedb.com/blog/introducing-lance-namespace-spark-integration/)

Lance Namespace is an open specification built on top of the storage-based Lance table and file format. It provides a standardized way for metadata services like Apache Hive MetaStore, Apache Gravitino, Unity Catalog, AWS Glue Data Catalog, and others to store and manage Lance tables. This means you can seamlessly use Lance tables alongside your existing [**data lakehouse infrastructure**](https://lancedb.com/blog/multimodal-lakehouse/) .  

![](/assets/blog/netflix-mediadata-lake-coderabbit-case-study-lance-namespace/image4.png)

## 🎤 Event Recap\!

LanceDB made a small tour around the world in Aug. Started with a workshop with dltHub at Berlin PyData Con. Then a stop in Amsterdam to present at the inaugural Open Lakehouse Meetup with Databricks and DuckDB, followed by a keynote at AI\_Dev Con. Our last stop was London started with a meetup generously hosted by AWS London, and we wrapped up the tour with our VLDB workshop on the [Lance paper](https://arxiv.org/abs/2504.15247).        

![](/assets/blog/netflix-mediadata-lake-coderabbit-case-study-lance-namespace/image15.png) 


## Coming up in Sep: 


Join us on September 25 for the live webinar: [𝗔𝗽𝗮𝗰𝗵𝗲 𝗦𝗽𝗮𝗿𝗸™ 𝗮𝗻𝗱 𝗟𝗮𝗻𝗰𝗲 𝗦𝗽𝗮𝗿𝗸 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗼𝗿\! 🚀](https://www.linkedin.com/events/apachespark-andlancesparkconnec7363659816340258816/theater/)
Lance Spark Connector brings Lance’s AI-native multimodal storage to Spark. We’ll cover how Spark can work efficiently with embeddings, images, videos, and documents using Lance’s random access, indexing, and vector/blob support.  

![](/assets/blog/netflix-mediadata-lake-coderabbit-case-study-lance-namespace/image12.png)

## Good Reads

[Feature Engineering with Geneva](https://lancedb.com/blog/geneva-feature-engineering/)  
![](/assets/blog/netflix-mediadata-lake-coderabbit-case-study-lance-namespace/image8.png)  


[Columnar File Reader in Depth – Structural Encoding](https://lancedb.com/blog/columnar-file-readers-in-depth-structural-encoding/)  
![](/assets/blog/netflix-mediadata-lake-coderabbit-case-study-lance-namespace/image14.png) 

[LanceDB WikiSearch: Native Full-Text Search on 41M Wikipedia Docs](https://lancedb.com/blog/feature-full-text-search/)  
![](/assets/blog/netflix-mediadata-lake-coderabbit-case-study-lance-namespace/image2.png)

## LanceDB Enterprise Product News

| Feature | Description |
| :---- | :---- |
| Faster and more accurate Full-Text Search (FTS) | Complex FTS queries (50–100 terms) now run 3–8x faster with improved relevance and ranking. |
| Simpler data loading | Insert, merge, and create tables seamlessly without worrying about dataset size or batch tuning. |
| Flexible search results | Support for \`limit\` and \`offset\`  in both vector and full-text search allows easy pagination of large result sets. |
| Better observability for \`merge\_insert\`  | Use \`explain\_plan\` and \`analyze\_plan\` to visualize execution and identify performance bottlenecks. |

## Community contributions

GEO Data Type support coming to Lance\! ([git](https://github.com/lancedb/lance/discussions/4482)) Thanks to the contributions from our community [@ddupg](https://github.com/ddupg) and [@jaystarshot](https://github.com/jaystarshot), **Lance now supports Geo type**. Geo index and query optimizations are coming soon too\! A shoutout for the individual contributors from **Bytedance** and **Uber** for making this possible\!  

A heartfelt thank you to our community contributors of lance and lancedb this past month:   [@majin1102](https://github.com/majin1102) [@fangbo](https://github.com/fangbo) [@wojiaodoubao](https://github.com/wojiaodoubao) [@pimdh](https://github.com/pimdh)[@ebyhr](https://github.com/ebyhr) [@yanghua](https://github.com/yanghua) [@HaochengLIU](https://github.com/HaochengLIU) [@imededin](https://github.com/imededin) [@HubertY](https://github.com/HubertY) [@chenghao-guo](https://github.com/chenghao-guo) [@lorinlee](https://github.com/lorinlee) [@vlovich](https://github.com/vlovich) [@adrian-wang](https://github.com/adrian-wang) [@ddupg](https://github.com/ddupg) [@LeoReeYang](https://github.com/LeoReeYang) [@emmanuel-ferdman](https://github.com/emmanuel-ferdman) [@adi-ray](https://github.com/adi-ray) [@yuvalif](https://github.com/yuvalif) [@Heisenberg208](https://github.com/Heisenberg208) [@mocobeta](https://github.com/mocobeta)  [@MarkMcCaskey](https://github.com/MarkMcCaskey) [@reedloden](https://github.com/reedloden)

## 

## Open Source Releases Spotlight 

| LanceDB | 0.22.0 | Integration with Lance Namespace, support multi-level namespace management.  |
| :---- | :---- | :---- |
| Lance | 0.35.0 | JSONB data type and index support, Apache OpenDAL integration, lance-tools CLI command, contains\_tokens UDF for full text search |
| | 0.34.0 | Shallow clone support, zone map index support, row level conflict resolution for Delete, metadata diff API |
| | 0.33.0 | File format 2.1 official release (2.1 files written with earlier versions of the library may not be readable due to breaking changes during development). Java transaction commit API for all commit types. |
| Lance Namespace | 0.0.6 \- 0.0.14 | Python and Rust SDK release |
| Lance Ray | 0.0.1 \- 0.0.5 | Integration with Lance Namespace |
| Lance Spark | 0.0.2 \- 0.0.11 | Support CREATE TABLE with fixed size vector column, support UPDATE and DELETE. |
