---
title: Lance Format Deep Dive, Samsara & Summer Events Circuit
date: 2025-06-04
draft: false
featured: true
categories: ["Announcement"]
image: /assets/posts/lance-format-deep-dive-samsara-lancedb-summer-events-circuit.png
description: Join us for a deep dive into the Lance format, learn about our partnership with Samsara, and catch us at major summer tech events. Get expert insights on building scalable AI systems with LanceDB.
author: Jasmine Wang
---
## 🎤 Catch Us on Stage This June!

We’re thrilled to be speaking at several top-tier events this month — alongside our customers — sharing real-world insights from scaling enterprise AI systems in production.

If you’re attending the **AI Engineering World Fair (June 3–5)**, **Data + AI Summit (June 9–12)**, or the **Toronto Machine Learning Summit (June 13–18)**, don’t miss our sessions across multiple tracks. Come say hi and learn what we’ve been building!

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXcxObVKgXQS62CFGnypyVF4gJoWzEQ1UjAiZWLgfF-0Sf2tNhz25Ysa0dJLApewTGZZDUM7S4Yrm5vdbcgqmLpm5t3LZSXlFDDLzEASyfN7QyiPjWV8D9MMd2OhmoWn-8BRPufw?key=KvdVauO0TI5I2R9O9akh7g)

![](__GHOST_URL__/content/images/2025/06/Screenshot-2025-06-02-at-7.54.23---PM-1.png)

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXctNzvrMU8wJ6C2H2FXMaAsLlkHcnLoMWJGbRId3sBQ1Qy3AiIpTTa5NTW2A2zdrb2HDrf-DUPutWZJQLEVRfTXWPZywlqD1_rQ8ComtQjr5Tyd5IeQI-gHfaVoyOAZREZ7Tkst?key=KvdVauO0TI5I2R9O9akh7g)

![](__GHOST_URL__/content/images/2025/06/Screenshot-2025-06-03-at-2.50.16---PM.png)

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXebzbjdu_XnnjhckwnaO6aQ2z2_80bd_4BD_ebf3SAt_tbxWgfy1NkaiJx_PaHOCu6iNKh0MgyLUGbQkj9tiRjiuVDX1KlEOePvK9h7QKCgENlvNwpmqNopgyIbYWzG714CPmMokA?key=KvdVauO0TI5I2R9O9akh7g)

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXfpVfvgHjUDujRoscVYegeO6tMCKCQCKPUQgJwtHqmu-5DUKntcPuw1_t7YYZdfrqKdf7-7qkyIGtveQpXvCTRyHhVT7UMBDxcJhwFFy0RucwMUkzLol7Pqi5eVJjKDem1lEl_e?key=KvdVauO0TI5I2R9O9akh7g)

---

## ⚙️ Lance Format Deep Dives

In addition to our highly requested deep dives into the Lance format, we also shared our perspective on the future of open source table formats — inspired by feedback and questions from the Iceberg community.

Curious where things are headed? Dig in 👇
[

Columnar File Readers in Depth: Column Shredding

Record shredding is a classic method used to transpose rows of potentially nested data into a flattened tree of buffers that can be written to the file. A similar technique, cascaded encoding, has recently emerged, that converts those arrays into a flattened tree of compressed buffers. In this article we

![](__GHOST_URL__/content/images/icon/lancedb-symbol--1--9.png)LanceDB BlogWeston Pace

![](__GHOST_URL__/content/images/thumbnail/0_0.jpeg)
](__GHOST_URL__/columnar-file-readers-in-depth-column-shredding/)[

Columnar File Readers in Depth: Repetition & Definition Levels

Repetition and definition levels are a method of converting structural arrays into a set of buffers. The approach was made popular in Parquet and is one of the key ways Parquet, ORC, and Arrow differ. In this blog I will explain how they work by contrasting them with validity & offsets

![](__GHOST_URL__/content/images/icon/lancedb-symbol--1--10.png)LanceDB BlogWeston Pace

![](__GHOST_URL__/content/images/thumbnail/A-knights-helmet-but-the-knight-s-face-is-a-black-void-with-the-word-NULL--cute-style.jpeg)
](__GHOST_URL__/columnar-file-readers-in-depth-repetition-definition-levels/)[

The Future of Open Source Table Formats: Apache Iceberg and Lance

As the scale of data continues to grow, open-source table formats have become essential for efficient data lake management. Apache Iceberg has emerged as a leader in this space, while new formats like Lance are introducing optimizations for specific workloads. In this post, we’ll explore how Iceberg and Lance

![](__GHOST_URL__/content/images/icon/lancedb-symbol--1--11.png)LanceDB BlogJack Ye

![](__GHOST_URL__/content/images/thumbnail/u2181395255_httpss.mj.runEZdJGapTysE_The_background_is_iceber_4f277ec6-a0ee-407d-8b54-69911e69694e_0--1--1-1-1.png)
](__GHOST_URL__/the-future-of-open-source-table-formats-iceberg-and-lance/)
---

## 🎥 Event Recap: AI at Scale with Samsara

The Samsara team is harnessing LanceDB to simplify and streamline AI data infrastructure for massive, real-world datasets.

In May, our cofounder **Chang She** joined **Samsara’s AI Speaker Series**, where he shared cutting-edge insights on **multimodal AI** and the evolving landscape of **AI agents**.

Missed it? Catch the recording below 👇

Scaling AI Data Infrastructure: A Multimodal Approach

---

## 🔐 LanceDB Enterprise Product News

- **Smoother concurrent upserts**: Upsert operations are now conflict-free in typical workloads, so you can write without worrying about collisions.
- **Significantly reduced storage costs**: Reduce object store operations by up to 95% with small files loaded with a single I/O instead of multiple IOPS - ideal for small-table workloads.
- **Filter binary data with ease**: Now query large binary columns directly in your filters – no workarounds needed.
- **Optimized GCP deployment tuning:** Fine-tune weak consistency and concurrency limits to better balance performance, cost, and flexibility.
- **Intuitive embedding visualization: **New UMAP visualizations help you explore and understand vector data at a glance.

[
                            Learn more
                        ](https://docs.lancedb.com/changelog/changelog)

0:00

                            /0:15
1×

Embedding Visualization shown in LanceDB Cloud (Beta)

---

## 👥 Community Contributions

💡

A heartfelt thank you to our community contributors of `lance` and `lancedb` this month: [@yanghua](https://github.com/yanghua)[@frankliee](https://github.com/frankliee)[@leaves12138](https://github.com/leaves12138)[@Jay-ju](https://github.com/Jay-ju)[@KazuhitoT](https://github.com/KazuhitoT)[@majin1102](https://github.com/majin1102)[@upczsh](https://github.com/upczsh)[@renato2099](https://github.com/renato2099)[@HaochengLIU](https://github.com/HaochengLIU)[@omahs](https://github.com/omahs)[@xaptronic](https://github.com/xaptronic)[@acoliver](https://github.com/acoliver)

---

## 🛠️ Open Source Releases Spotlight 

- **Boolean logic for full-text search**: Combine filters with AND/OR or &/| — full-text search now works the way you think.

    fts_query = MatchQuery("puppy", "text") & MatchQuery("happy", "text")

- **Faster, smarter full-text indexing: **Compression and optimized search algorithms speed up index builds and boost performance at scale.
- **No more stalled upserts: **A new timeout setting ensures `merge_insert` operations won’t hang forever.

    table.merge_insert(id)
            .when_matched_update_all()
            .when_not_matched_insert_all()
            .execute(new_data, timeout=timedelta(seconds=10))
        )

- **Flexible phrase matching: **Control how loose or tight your matches are with the `slop` parameter.

     fts_query=PhraseQuery("frodo was happy", "text", slop=2)

- **Spark compatibility built in: **Works with multiple Spark versions out of the box — just drop in the bundled JAR and go**. **[**Quick start**](https://github.com/lancedb/lance-spark/blob/main/README.md#quick-start)** →**
