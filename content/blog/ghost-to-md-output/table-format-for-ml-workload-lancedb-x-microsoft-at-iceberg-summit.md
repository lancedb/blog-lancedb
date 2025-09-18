---
title: Table Format for ML Workload, LanceDB x Microsoft at Iceberg Summit
date: 2025-03-11
author: LanceDB
categories: ["Announcement"]
draft: false
featured: false
---

## 🔥 New Blog: Designing a Table Format for ML Workloads

Zero-copy schema evolution, indices for everything, and parallelized operations - all designed for modern ML. We explain the why & how behind the Lance table format in our latest engineering blog. 
[![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXdx3fW8KgRgPtcC1J_iQyDjZ5-MaZmQ5WAYHsKcyXNbua7GB8T9Zg4GBxtLdBTqDp3gJlnCKDbibwhP5AVGLyeAn_mZwZTNu3kDRVz8nvXeX2UosVrBvhsSvyOHJnFniTye7JuwYw?key=tkZp4h4vA_vLk6VcW4_MtpiJ)](__GHOST_URL__/designing-a-table-format-for-ml-workloads/)Designing a Table Format for ML Workloads
---

## LanceDB Enterprise Product News

### 🔥 Multivector Search is now live:

Documents can be stored as contextualized vector lists. Fast multi-vector queries are supported at scale, powered by our XTR optimization.

### **🌱 **LanceDB Cloud UI has a new look

**Search by Project/Table in Cloud UI**: allow users to quickly locate the desired project/table.

**Explore Your Data at a Glance**: preview sample data from any table with a single click.

**`Drop_index` added to SDK**: users can remove unused or outdated indexes from your tables.

---

## Community Contributions

💡

A simple[**Model Context Protocol (MCP)**](https://github.com/kyryl-opens-ml/mcp-server-lancedb)server implementation for LanceDB has just been released, thanks to our community contributor [@truskovskiyk](https://github.com/truskovskiyk) It provides a semantic memory layer that lets LLMs store and retrieve information using vector embeddings. It works with Claude Desktop and any MCP-compatible application. 

💡

A heartfelt thank you to our community contributors of lance and lancedb this month: [@yanghua](https://github.com/yanghua)[@ascillitoe](https://github.com/ascillitoe)[@lyang24](https://github.com/lyang24)[@renato2099](https://github.com/renato2099)[@vjc578db](https://github.com/vjc578db)[@andrew-pienso](https://github.com/andrew-pienso)[@vaifai](https://github.com/vaifai)[@jeff1010322](https://github.com/jeff1010322)[@vincent0426](https://github.com/vincent0426)

---

## Upcoming Events
![](__GHOST_URL__/content/images/2025/03/Screenshot-2025-03-03-at-12.28.10-AM.png)
🥳 Microsoft Research Gray Systems Lab is partnering with LanceDB on this exploratory project to explore how to enhance Apache Iceberg's performance by leveraging next-generation file formats like Vortex and Lance. These formats are designed to meet the demands of modern AI/ML workloads and GPU-accelerated analytics, offering advantages such as random data access, support for wide tables, vector encodings, and optimized I/O for cloud environments. We will be presenting at the upcoming [Iceberg Summit on April 8th](https://www.icebergsummit2025.com/) in SF. 

---

## Open Source Releases Spotlight 

- Python async API now has Table.search() method just like synchronous API.
- Safer handling of secrets in Python and Node embeddings APIs.
- Support XTR based multivector retrieval
- Support Conditional Put on S3
- Support schema evolution in Java SDK
