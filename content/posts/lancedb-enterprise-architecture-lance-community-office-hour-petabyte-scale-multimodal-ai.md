---
title: LanceDB Enterprise Architecture, Lance Community Office Hour, Petabyte Scale Multimodal AI
date: 2024-11-05
draft: false
featured: false
image: /assets/posts/1.png
description: Explore lancedb enterprise architecture, lance community office hour, petabyte scale multimodal ai with practical insights and expert guidance from the LanceDB team.
author: Jasmine Wang
---
## 🔥LanceDB Enterprise Documentation

LanceDB Enterprise transforms your data lake into a high performance vector database that can operate at extreme scale. Serve millions of tables and tens of billions of rows in a single index, improve retrieval quality using hybrid search with blazing fast metadata filters, and up to 200x cheaper with object storage.

[LanceDB Enterprise Architecture](https://docs.lancedb.com/enterprise/architecture/architecture)

## 👩‍💻Lance Community Office Hour 

We kicked off our first monthly community office hour in Oct, in which the LanceDb team talked about what we're currently working on, discussed rough plans and future roadmap, and answered questions from anyone in the Lance and LanceDB community. The next one is coming up soon, come say hi! 

[November Office Hour](https://lu.ma/xsww4yz2)

## Community contributions

💡

A heartfelt thank you to our community contributors of lance and lancedb this month: [@niyue](https://github.com/niyue)[@SaintBacchus](https://github.com/SaintBacchus)[@dsgibbons](https://github.com/dsgibbons)[@erikml-db](https://github.com/erikml-db)[@alexwilcoxson-rel](https://github.com/alexwilcoxson-rel)[@o-alexandrov](https://github.com/o-alexandrov)[@do-me](https://github.com/do-me)[@rithikJha](https://github.com/rithikJha)[@jameswu1991](https://github.com/jameswu1991)[@gagan-bhullar-tech](https://github.com/gagan-bhullar-tech)[@akashsara](https://github.com/akashsara)[@sayandipdutta](https://github.com/sayandipdutta)[@rjrobben](https://github.com/rjrobben)[@PrashantDixit0](https://github.com/PrashantDixit0)[@akashsara](https://github.com/akashsara)

## Good reads

Another deep dive into the Lance file format and explain how Lance uses backpressure to balance parallelism, speedy I/O, streaming computation, and limited RAM usage.
[

Columnar File Readers in Depth: Backpressure

Streaming data applications can be tricky. When you can read data faster than you can process the data then bad things tend to happen. The most common scenario is you run out of memory and your process crashes. When the process doesn’t crash, it often breaks performance (e.g. swapping

![](__GHOST_URL__/content/images/size/w256h256/2024/04/lancedb-symbol--1-.png)LanceDB BlogWeston Pace

![](__GHOST_URL__/content/images/size/w1200/2024/09/Designer-4-.jpeg)
](__GHOST_URL__/columnar-file-readers-in-depth-backpressure/)
## Event recap
[

Bring Vector Search And Storage To The Data Lake With Lance

Summary
The rapid growth of generative AI applications has prompted a surge of investment in vector databases. While there are numerous engines available…

![](https://www.dataengineeringpodcast.com/apple-touch-icon.png)Data Engineering Podcast

![](https://assets.podhome.fm/f6ff0caa-931b-4c08-bfdd-08dc7f5cd336/638557928872209534cover.jpg?1271615768)
](https://www.dataengineeringpodcast.com/episodepage/bring-vector-search-and-storage-to-the-data-lake-with-lance)
Lance Format Deep Dive Podcast with Weston Pace

Multimodal AI in Production with LanceDB and Ray, by Chang She & Lei Xu

## Upcoming events
[

Composable AI Infra for Agents · Luma

Join us for an evening of talks about the composable AI infrastructure for agents, hosted by dltHub & LanceDB at the Continue office. Learn about the different…

![](https://lu.ma/apple-touch-icon.png)dltHub

![](https://social-images.lu.ma/cdn-cgi/image/format=auto,fit=cover,dpr=1,background=white,quality=75,width=800,height=419/api/event-one?calendar_avatar=https%3A%2F%2Fcdn.lu.ma%2Favatars-default%2Fcommunity_avatar_3.png&amp;calendar_name&amp;color0=%23a4a1a4&amp;color1=%23c1d39c&amp;color2=%230c2227&amp;color3=%23cef355&amp;host_avatar=https%3A%2F%2Fimages.lumacdn.com%2Favatars%2Fc1%2F429c08b5-d3e4-47ac-9358-6c0177fb7c0d&amp;host_name=dltHub&amp;img=https%3A%2F%2Fimages.lumacdn.com%2Fgallery-images%2Fuf%2Fe3669461-2913-4b97-b00a-babcdbb5f5af&amp;name=Composable%20AI%20Infra%20for%20Agents)
](https://lu.ma/y3sh3tpj)
LanceDB + dltHub + Dosu, Nov 7th, San Francisco
[

Compound AI Systems: November/SF · Luma

Welcome to the third event in the Compound AI Systems meetup series for Fall/Winter 24/25!
Join experts in data and AI for an in-person deep dive into AI infra…

![](https://lu.ma/apple-touch-icon.png)Ester Shmulyian

![](https://social-images.lu.ma/cdn-cgi/image/format=auto,fit=cover,dpr=1,background=white,quality=75,width=800,height=419/api/event-one?calendar_avatar=https%3A%2F%2Fcdn.lu.ma%2Favatars-default%2Fcommunity_avatar_5.png&amp;calendar_name=Compound%20AI%20Systems&amp;color0=%23242323&amp;color1=%236e7272&amp;color2=%23414343&amp;color3=%23f3f3f3&amp;host_avatar=https%3A%2F%2Fcdn.lu.ma%2Favatars-default%2Favatar_15.png&amp;host_name=Ester%20Shmulyian&amp;img=https%3A%2F%2Fimages.lumacdn.com%2Fgallery-images%2F87%2F247532fb-2a79-4de4-91b1-752855f5b1b8&amp;name=Compound%20AI%20Systems%3A%20November%2FSF)
](https://lu.ma/wsbaj6hr)
LanceDB + Databricks monthly meetup, Nov 19th, San Francisco

## Latest releases

*Lance releases:*

- [v0.18.1 (2024-10-03)](https://github.com/lancedb/lance/releases/tag/v0.18.1)
- [SQL now supports list element access.](https://github.com/lancedb/lance/pull/2966)
- [Filter pushdown enabled for scans of Lance V2 files.](https://github.com/lancedb/lance/pull/2913)
- [Zstd block compression supported, if opted in for particular columns.](https://github.com/lancedb/lance/pull/2878)

- [v0.18.2 (2024-10-03)](https://github.com/lancedb/lance/releases/tag/v0.18.2)
- [v0.19.1 (2024-10-21)](https://github.com/lancedb/lance/releases/tag/v0.19.1)
- [Full-text search tokenizer is now customizable. It allows setting case-sensitivity, stemming, stop word removal, and ascii-folding.](https://github.com/lancedb/lance/pull/2992)
- [Adds a new BlobFile API that can read and seek over large binary values. Useful, for example, to extract individual frames from video columns.](https://github.com/lancedb/lance/pull/2983)
- [Can now add new columns based on existing data frame, without requiring an expensive join.](https://github.com/lancedb/lance/pull/3010)

*LanceDB releases:*

- [v0.11.0 (2024-10-09)](https://github.com/lancedb/lancedb/releases/tag/v0.11.0)
- [Python v0.14.0](https://github.com/lancedb/lancedb/releases/tag/python-v0.14.0)
- From Lance:
- SQL now supports list element access.
- Filter pushdown enabled for scans of Lance V2 files.
- Zstd block compression supported, if opted in for particular columns.

- [v0.12.0 (2024-10-29)](https://github.com/lancedb/lancedb/releases/tag/v0.12.0)
- [Python v0.15.0](https://github.com/lancedb/lancedb/releases/tag/python-v0.15.0)
- LanceDB’s native tokenizer is now configurable in Python sync API, allowing you to choose whether to enable stemming and stop word removal, as well as other settings. The default tokenizer no longer performs stemming or stop word removal. This will come soon to Nodejs and async Python.
