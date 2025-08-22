---
title: "Vector Databases: Strengths, Weaknesses & Where LanceDB Fits"
date: 2025-08-19
draft: false
categories: ["Engineering"]
description: "A brutally honest narrative from someone who ships RAG and search—and works at LanceDB"
image: /assets/blog/vector-database-tradeoffs/preview-image.png
meta_image: /assets/blog/vector-database-tradeoffs/preview-image.png
author: David Myriel
author_avatar: "/assets/authors/david-myriel.jpg"
author_bio: "Writer"
author_twitter: "davidmyriel"
author_github: "davidmyriel"
author_linkedin: "davidmyriel"
---

> A brutally honest narrative from someone who has seen it all.

On a Tuesday night not long ago, our Slack alert went off for a customer PoC channel. Nothing dramatic...just one of those “why is retrieval suddenly slow” situations that always seem to arrive five minutes before a stakeholder hits **Search**. Their stack looked familiar: [Postgres]() for the system of record, a vector add‑on for embeddings, a reranker, and a web API held together with duct tape and well‑meaning promises. We rolled back a change, the demo went fine, and after the adrenaline faded they asked the question everyone asks: 

[Do we really need a vector database?](/docs/overview/)

If you’ve read the debates, you already know the two loudest answers. There are two camps:

- *“Vectors are just a data type; keep them in the database you already know.”*

- *“You’ll hit a wall—use a purpose‑built engine.”* 

Both are right, depending on what you’re building and how hard you push it. This essay is the version I give founders and engineers who are knee‑deep in RAG or semantic search and need an answer that isn’t a sales pitch.

## Start with the boring thing—and measure

If your corpus is in the tens of millions or less, your latency target is somewhere between 200 and 500 ms, and your queries care a lot about business rules—stock status, entitlements, tenants, locales—then your **existing database** is a great place to start. pgvector in Postgres, SQLite‑VSS, Mongo vector, or Elasticsearch/OpenSearch k‑NN will get you to a working system faster than adding another service to your on‑call rotation. You’ll ship sooner, you’ll have one backup story, and your filtering logic will read like the rest of your code instead of a side quest.

But ship it with a seatbelt. Before you congratulate yourself, build a tiny evaluation harness. Take a few hundred queries with known good answers. Record recall\@k and p50/p95/p99 latencies with the **actual filters** you intend to use. Add a reranker and see how much it helps. Double your data and try again. You’ll learn more from that two‑hour experiment than from three weeks of threads arguing about who’s a scam.

## Why people add a vector database anyway

A year into a product, the reasons tend to rhyme. Latency and recall start to wobble as $N$ grows; updates and deletes create weird shadows; a handful of hot tenants drown everyone else; or the index becomes so big that warming it in RAM across regions feels like bailing out a boat with a coffee mug. Underneath the marketing, a “vector database” is just a runtime that tries to tame those problems: it takes approximate nearest neighbor algorithms and wraps them with memory mapping, caching, background builds, compaction, resource isolation, and an ingestion story that doesn’t make your SREs cry.

Think of it this way. In a lab, ANN is an algorithm problem. In production, it’s a **systems** problem: how do you keep tail latency low when the candidate set lives on SSD, when filters are selective, and when people are writing all day while others are reading? That’s the gap general‑purpose databases don’t always aim to close, because their north star is different.

## The filter cliff, told with a real query

A classic RAG call starts innocently: “Find me the top 20 sections related to this question, but only from product X, English, and the last six months, and don’t show anything the user’s plan doesn’t allow.” On a quiet dataset, a post‑filter is fine: fetch 1,000 neighbors, throw away the ones that fail the filter, pass the rest to a reranker. But as your filters become more selective, the effective recall collapses unless you overfetch aggressively—10,000, 20,000, more. Now the latency budget you thought you had goes up in smoke.

Engines that do well here don’t magically “support filtering.” They make the filter part of the search. Sometimes that’s coarse partitioning—route to the relevant shards by tenant, language, or time bucket so the working set is smaller. Sometimes it’s more surgical—storing postings or bitmaps alongside index cells so the candidate set respects the filter **before** you walk the graph or probe the lists. The difference between those two worlds is the difference between “works in dev” and “keeps working on Monday morning.”

## Updates, deletes, and the slow poison of staleness

ANN indexes love stability. Real systems don’t. You add documents, you fix typos, you redact something for compliance, you destroy a user’s data because the law says you must. If all you have is a big monolithic index that gets rebuilt on the weekend, you’re one crash away from a very awkward postmortem. Production‑ready vector runtimes have an ingest path that’s append‑friendly, with tombstones and background compaction so you can delete aggressively without tanking recall. They expose a notion of freshness—how far the live index lags behind the write‑ahead log—so you can decide whether to block, warn, or proceed. Without that, “eventually consistent” turns into “mysteriously inconsistent.”

## The cost no one puts on the pricing page

It’s fashionable to argue about invoice totals, but the hidden cost is almost always **network**. If your application calls out to another service for every query, you’re paying in latency, money, and failure modes—TLS handshakes, egress, retries, cold starts. If the only reason you stood up a new service was to shave 5–10 ms off ANN time, you probably lost that battle at the first hop. This is why “local‑first” architectures—embedding retrieval inside your app process, or at least next to it—feel disproportionately fast. The most reliable optimization in RAG is to remove a network boundary.

## Okay, so where does LanceDB actually fit?

Bias disclosed: I work at LanceDB. We designed it for engineers who want vectors **next to** their data and compute without adopting a whole new database religion. It’s embedded by default: you point it at your local disk or object storage, import your data in Arrow/Parquet‑friendly formats, build IVF/HNSW‑style indexes with optional quantization, and query with simple Python/TypeScript APIs. Because it’s columnar and Arrow‑native, you can keep structured columns alongside vectors, filter on them without dragging Postgres into the hot path, and round‑trip easily to DuckDB/Polars for analytics and evals.

Where LanceDB shines is exactly where many RAG teams live: one process per service, retrieval and reranking co‑located with your application, nightly or hourly rebuilds done in the same toolchain you already use for data science, and artifacts you can version and ship. You keep your system of record in the database you trust, feed LanceDB via ETL or change data capture, and avoid a second 24/7 on‑call surface until your numbers force your hand.

Where we’re **not** the right choice: when your hot path is fundamentally relational—multiple joins, window functions, transactions across many tables—or when you need global multi‑region replication, tight p99 SLAs at high QPS, and strict multi‑tenant fairness right now. In those cases you either stay in your RDBMS and accept its ANN limits, or you choose a distributed vector service and pay the complexity tax to get the isolation and knobs you need.

## A pragmatic way to decide

Here’s how I’d run the play if you asked me to help you choose, and you build RAG or search for a living:

1. **Prototype in the database you already use.** Put embeddings in pgvector (or your equivalent), write the filters you truly need, add a reranker, and build a tiny eval harness. Track recall\@k and p95/p99 with filters on. If you’re happy, stop here and ship.
2. **When network is your bottleneck, pull retrieval local.** If your traces say most of your budget is spent going across the wire, try an embedded vector store. Keep your SoR where it is; bring the retrieval index into your app process. Measure again.
3. **Only add a dedicated service when your numbers demand it.** If you need strict p99 at meaningful QPS, heavy filter selectivity, constant updates and deletes, or serious multi‑tenancy isolation, then a vector‑native runtime is not “gold‑plating”—it’s the tool for the job. But let the data shove you there, not fear of missing out.

Notice what’s missing from that plan: ideology. I don’t care if you use LanceDB, pgvector, or a hosted service, as long as you measure recall and latency under your real constraints and have a deletion story that would survive an audit.

## The hard truth about “chat with your docs”

Most RAG systems fail in boring ways. The embeddings weren’t tuned for your domain. The retriever ignores important structure like headings or tables. The filters don’t match how the authorization actually works. The reranker never got a chance because the candidate set was too small. None of those are fixed by swapping out the storage layer. Vector search is not a silver bullet; it’s one ingredient in a pipeline that needs **relevance engineering**: chunking, metadata design, hybrid dense+lexical retrieval, and a reranker that actually moves the needle.

If you do only one thing after reading this, build that evaluation harness. Put it in CI. Alert when recall drifts or freshness lags. Treat retrieval quality like uptime, because to your users it is.

## So, is a vector database a scam?

No. A vector database is an index plus a serving/runtime tuned for a specific shape of problem: large $N$, tight tail latency, steady churn, and, often, many tenants. If that’s your world, you’ll spend less time fighting with caches and compaction and more time improving retrieval quality. If it isn’t, the simplest, cheapest, most honest solution is to keep vectors where your data already lives and go build the parts your users notice.

LanceDB exists for the middle path: start local, stay close to your data and compute, keep your ops surface small, and scale only when the numbers make you. If that sounds like your team, we’ll fit in your toolbox without taking it over. And if it doesn’t, that’s okay too—just promise me you’ll measure before you migrate.











# Vector Databases: Strengths, Weaknesses & Where LanceDB Fits

*A direct, honest narrative for engineers building RAG and search — from someone who works at LanceDB*

Right before a customer demo, our alerts fired: retrieval latency had spiked. The stack was common—Postgres with pgvector, a reranker, and a simple web API. We rolled back a change, the demo ran, and the team asked a familiar question: **do we actually need a vector database, or should we keep using the database we already have?**

This article answers that question without marketing language. It focuses on what matters in production: latency, recall, filtering, updates/deletes, multi‑tenancy, cost, and operational load. It also explains where LanceDB helps and where it does not.

## Start with what you have, and measure

If your corpus is in the tens of millions or less, your latency target is 200–500 ms, and you rely on business filters (stock, entitlements, tenant, locale), **start in your existing database**. pgvector (Postgres), SQLite‑VSS, Mongo vector, or Elasticsearch/OpenSearch k‑NN will get you to a working system quickly. You keep one backup story, one access model, and filters are straightforward.

These are rules of thumb, not absolutes. Dimension size, recall targets, and filter selectivity affect feasibility. For scale planning: 30M × 768‑dim float32 ≈ **92 GB** of raw vectors; 30M × 1024‑dim ≈ **123 GB** (decimal). Quantization can reduce this; measure the recall impact on your data.

Add safeguards: build a small evaluation harness before declaring success. Take a few hundred queries with known good answers. Record recall\@k and p50/p95/p99 latencies **with your real filters on**. Add a reranker and measure the gain. Double the data and repeat. This short exercise gives you a clear baseline for future decisions.

## Why teams add a vector database later

Over time, the same issues appear:

* Latency and recall degrade as the corpus grows.
* Updates and deletes create inconsistency if the index is not built for churn.
* A few hot tenants affect others.
* The index does not fit comfortably in RAM, especially across regions.

If you host many tenants, enforce per‑tenant QPS limits and concurrency caps, and track p95/p99 by tenant.

A vector database is an ANN engine plus a runtime around it: memory mapping, caching, background builds, compaction, routing, isolation, and an ingestion path that supports production. It exists to keep tail latency low and recall stable under growth, filters, and constant writes.

## Filtering under load

A typical RAG query: “Top 20 sections related to this question, restricted to product X, English, last six months, and user entitlements.” With low selectivity, a post‑filter works: fetch 1,000 candidates, drop those that fail the filter, rerank. As selectivity increases, recall drops unless you fetch far more candidates, which increases latency and CPU. Additional context: when only \~1–5% of candidates survive filters, you typically must overfetch 10–50× to preserve recall, which drives CPU and p95/p99 up.

Systems that handle this well integrate filters into the search. Two common approaches:

* **Partition‑aware routing**: shard by tenant, language, or time bucket to reduce the working set before search.
* **Index‑aware filtering**: store postings/bitmaps alongside index cells so candidates respect filters **before** graph walks or list probes.

If you require strict relational joins, keeping vectors and metadata in the same engine is simpler and more reliable.

## Updates, deletes, and staleness

Real systems add, change, and delete data continuously. ANN indexes prefer stability. Production systems need:

* Append‑friendly ingestion paths.
* Tombstones plus background compaction.
* Versioned snapshots so readers stay consistent while writers rebuild.
* Freshness metrics (index lag) and alerts.

Without tombstones and background compaction, indexes accumulate stale entries; deletions are not honored at query time; recall drifts and users see inconsistent results after updates or deletions. Ship snapshots with checksums and validate crash‑safe recovery in CI and staging.

## Real costs: network and overhead

Many discussions focus on list prices. In practice, **network hops** dominate both latency and cost. If every query calls a separate service, you pay in latency, money, and reliability. The most effective optimization is to keep retrieval close to the application or close to the data. If most of your latency is the network hop, moving retrieval local yields more benefit than changing ANN algorithms. If compute dominates, index configuration and quantization choices matter more.

## Where LanceDB fits — and where it doesn’t

**What LanceDB optimizes for**

* **Local/embedded retrieval**: run in‑process or next to your service. No extra network hop.
* **Columnar + vector together**: vectors and structured columns live side‑by‑side in the Lance format (Arrow‑native). Filter and retrieve without involving a relational database in the hot path.
* **Practical indexing**: IVF‑Flat / IVF‑PQ and HNSW‑style indexes, optional quantization, background compaction.
* **Interoperability**: Arrow/Parquet‑friendly; easy round‑trips with Pandas/Polars/DuckDB for ETL and evaluation.
* **Developer workflow**: build indexes offline, snapshot them, A/B using a file‑level switch, and roll back quickly.

**Where LanceDB is not the right choice**

* Your hot path is heavily relational (multiple joins, window functions, cross‑table transactions). Keep vectors in your RDBMS or use LanceDB as a sidecar retriever only.
* You need multi‑region replication, strict p99 SLOs at high QPS, and strong multi‑tenant isolation on day one. Choose a distributed vector service or plan for that layer later.

## If you’re on the fence: what LanceDB changes in week one

If you already run pgvector or a similar solution and it works, the question is what you gain by moving retrieval next to your app without increasing operational load.

* **Traces show one fewer network hop.** Retrieval latency becomes more stable. You can allocate more budget to reranking.
* **Simpler build and rollout.** Build an index offline, snapshot it, toggle a setting to send a small share of traffic, and roll back by switching files if needed.
* **Metadata stays close.** Keep the columns you filter on (tenant, product, language, time window) with the vectors. Simple filters execute locally. Use the RDBMS for complex joins.
* **Updates and deletes are safer.** Append‑friendly ingest, tombstones, and background compaction maintain recall while complying with deletion requirements. You can monitor freshness lag.
* **Predictable cost.** No per‑query billing. Run it where your service runs. Start with a single process and local disk or object storage. Scale when measurements justify it.
* **Low lock‑in.** Your system of record does not move. If LanceDB is not a fit, remove the sidecar and continue with pgvector. The change set is small.

LanceDB does not replace a relational database. It removes a network hop for retrieval and gives you a clean, local runtime for ANN plus filters. If you later need a distributed vector tier, you can add it with the same evaluation harness.

## A practical decision path

1. **Prototype in your current database.** Implement filters and a reranker. Measure recall\@k and p95/p99 with filters enabled.
2. **If the network is the bottleneck, use an embedded store.** Keep the system of record where it is; run retrieval inside or next to the service. By “embedded” we mean a library in the same process (or host) reading columnar data on local disk or object storage. Re‑run the evaluation harness.
3. **Adopt a dedicated vector service only when required.** Do this when p99 and QPS targets fail with steps 1–2, filters are highly selective, churn is constant, or strict multi‑tenant isolation is mandatory. Make the decision based on measurements.

## Common problems with “chat with your docs”

Most failures are basic relevance issues, not storage choices:

* Embeddings not tuned for your domain.
* Poor chunking and missing structure (headings, tables).
* Filters that do not match real authorization.
* Candidate sets that are too small for the reranker to help.

Build and keep an evaluation harness: labeled queries, recall\@k/NDCG/MRR, and latency p50/p95/p99. Evaluate with filters on. Include churn tests (writes and deletes). Alert on recall drift and freshness lag.

## Is a vector database a scam?

No. A vector database is an index plus a runtime designed for large datasets, tight tail latency, frequent updates, and multi‑tenancy. If that matches your workload, it is the correct tool. If it does not, keep vectors in the database you already run and focus on relevance engineering.

**LanceDB’s position:** start local, keep vectors close to your data and compute, minimize operational surface, and scale only when measurements require it. If that describes your constraints, LanceDB will fit into your stack without dominating it. If not, stay with your current database or pick a distributed service that meets your SLOs. The key is to measure, decide, and iterate.
