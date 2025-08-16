---
title: "Time-Travel RAG With Versioned Data"
sidebar_title: "Time-Travel RAG"
description: "Learn how to build production-ready RAG systems with LanceDB's time-travel capabilities for regulatory compliance and audit trails."
weight: 1
---

> **Complete Code**: All the scripts and code for this tutorial are available in the [LanceDB documentation repository](https://github.com/lancedb/blog-lancedb/blob/main/content/docs/tutorials/RAG/time-travel-rag/_index.html). 

## Use Case: Financial Services Regulatory Knowledge Base

Imagine you're a major investment bank. Your team is tasked with building a critical Retrieval-Augmented Generation (RAG) system. This system must provide instant, accurate answers to compliance officers about ever-changing financial regulations. A wrong or out-of-date answer isn't just an inconvenience—it could lead to multi-million dollar fines, reputational damage, and regulatory audits.

Your knowledge base is a living entity, constantly evolving with:

* Daily regulatory updates from government bodies.
* New internal policy documents and interpretations.
* A/B testing of different embedding models and text chunking strategies to improve accuracy.

This dynamic environment creates a series of high-stakes challenges that standard [vector databases](/docs/overview/) are ill-equipped to handle.

## Main Pain Points

1. "Our RAG gave different answers yesterday versus today. Which version was used in the official compliance report?" Without versioning, you can't prove what the AI knew at a specific point in time, making audits impossible.

2. "The new embedding model we deployed corrupted half the vectors. Can we instantly roll back our 10TB dataset?" With traditional systems, a rollback means a painful, hours-long (or days-long) process of re-indexing from a backup, leading to significant downtime.

3. "Regulators want to audit an AI-assisted decision from three months ago. How can we prove what data the model had access to at that exact moment?" Reproducibility is key for compliance. You must be able to reconstruct the exact state of the knowledge base for any historical query.

4. "We need to A/B test a new chunking strategy, but we can't disrupt the production system or duplicate the entire dataset." Experimentation is vital for improvement, but it can't come at the cost of production stability or a massive infrastructure bill.

LanceDB's [zero-copy, automatic versioning](/docs/tables/versioning/) and [time-travel capabilities](/docs/tables/versioning/) directly address these critical enterprise pain points, providing the foundation for a reliable, auditable, and production-ready RAG system.

## The Dataset: The U.S. Federal Register

To make this use case realistic, we'll use a perfect real-world dataset: The U.S. Federal Register, the official daily journal of the United States Government.

It contains all new rules, proposed rules, and notices from federal agencies. It is the canonical source for regulatory changes, and it's updated every business day. It even has a public API, allowing us to simulate the real-time ingestion of new documents.

Example output of the workflow defined in [main.py](https://github.com/lancedb/blog-lancedb/blob/main/content/docs/tutorials/rag/time-travel-rag/main.py)

```bash
--- Initializing Database Environment ---
Removed old database at ./lancedb
Loading embedding model: all-MiniLM-L6-v2...

--- STEP 1: Initial Data Ingestion ---

Fetching 500 documents for publication date: 2024-08-19...
Successfully fetched 86 documents.
Embedding 86 documents...
Batches: 100%|███████████████████████████████████████████████████████████████████████████████████████| 3/3 [00:00<00:00,  7.12it/s]
Successfully embedded 86 documents.

Creating table 'federal_register'...
✅ Table 'federal_register' created. Version: 1, Rows: 86

--- STEP 2: Simulating Sequential Daily Updates ---

Fetching 500 documents for publication date: 2024-08-20...
Successfully fetched 102 documents.
Embedding 102 documents...
Batches: 100%|███████████████████████████████████████████████████████████████████████████████████████| 4/4 [00:00<00:00, 10.66it/s]
Successfully embedded 102 documents.
✅ Data added to 'federal_register'. New Version: 2, Total Rows: 188

Fetching 500 documents for publication date: 2024-08-21...
Successfully fetched 114 documents.
Embedding 114 documents...
Batches: 100%|███████████████████████████████████████████████████████████████████████████████████████| 4/4 [00:00<00:00, 10.19it/s]
Successfully embedded 114 documents.
✅ Data added to 'federal_register'. New Version: 3, Total Rows: 302


========================================================
= PART 1: AUDITING KNOWLEDGE BASE ACROSS TIME  =
========================================================

Running audit for query: 'cybersecurity reporting requirements for public companies'

Attempting to open 'federal_register' and checkout version 1...
✅ Successfully checked out Version 1 of 'federal_register'. Total rows: 86
Querying table 'federal_register' (Version 1)...

--- Top Result for Version: V1 (all-MiniLM-L6-v2) ---
📄 Title: Public Company Accounting Oversight Board; Extension of Approval Periods for Proposed Rules on a Firm's System of Quality Control and Related Amendments to PCAOB Standards, Proposed Rules on Amendments Related to Aspects of Designing and Performing Audit Procedures That Involve Technology-Assisted Analysis of Information in Electronic Form, and Proposed Rules on Amendment to PCAOB Rule 3502 Governing Contributory Liability
🗓️  Date: 2024-08-19
📏 Distance: 1.1667
📝 Abstract:
[No abstract available for this document]
--------------------------------------

Attempting to open 'federal_register' and checkout version 2...
✅ Successfully checked out Version 2 of 'federal_register'. Total rows: 188
Querying table 'federal_register' (Version 2)...

--- Top Result for Version: V2 (all-MiniLM-L6-v2) ---
📄 Title: Information Collection Being Reviewed by the Federal Communications Commission Under Delegated Authority
🗓️  Date: 2024-08-20
📏 Distance: 1.1436
📝 Abstract:
As part of its continuing effort to reduce paperwork burdens, and as required by the Paperwork
Reduction Act (PRA) of 1995, the Federal Communications Commission (FCC or the Commission) invites
the general public and other Federal agencies to take this opportunity to comment on the following
information collection. Comments are requested concerning: whether the proposed collection of
information is necessary for the proper performance of the functions of the Commission, including
whether the information shall have practical utility; the accuracy of the Commission's burden
estimate; ways to enhance the quality, utility, and clarity of the information collected; ways to
minimize the burden of the collection of information on the respondents, including the use of
automated collection techniques or other forms of information technology; and ways to further reduce
the information collection burden on small business concerns with fewer than 25 employees. The FCC
may not conduct or sponsor a collection of information unless it displays a currently valid control
number. No person shall be subject to any penalty for failing to comply with a collection of
information subject to the PRA that does not display a valid Office of Management and Budget (OMB)
control number.
--------------------------------------

Attempting to open 'federal_register' and checkout version 3...
✅ Successfully checked out Version 3 of 'federal_register'. Total rows: 302
Querying table 'federal_register' (Version 3)...

--- Top Result for Version: V3 (all-MiniLM-L6-v2) ---
📄 Title: Equipment, Systems, and Network Information Security Protection
🗓️  Date: 2024-08-21
📏 Distance: 1.0942
📝 Abstract:
This proposed rulemaking would impose new design standards to address cybersecurity threats for
transport category airplanes, engines, and propellers. The intended effect of this proposed action
is to standardize the FAA's criteria for addressing cybersecurity threats, reducing certification
costs and time while maintaining the same level of safety provided by current special conditions.
--------------------------------------

✅ Date-based audit complete. Results show how knowledge evolves over time. This demonstrates LanceDB's powerful [versioning capabilities](/docs/tables/consistency#versioning) for maintaining audit trails.


=============================================================
= PART 2: A/B TESTING DIFFERENT EMBEDDING MODELS  =
=============================================================
Loading embedding model: all-mpnet-base-v2...
Embedding 302 documents...
Batches: 100%|█████████████████████████████████████████████████████████████████████████████████████| 10/10 [00:03<00:00,  2.55it/s]
Successfully embedded 302 documents.

Creating table 'federal_register_experimental'...
✅ Table 'federal_register_experimental' created. Version: 1, Rows: 302

Comparing search results for the same data with different models:
Querying table 'federal_register' (Version 3)...

--- Top Result for Version: Latest Prod V3 (all-MiniLM-L6-v2) ---
📄 Title: Equipment, Systems, and Network Information Security Protection
🗓️  Date: 2024-08-21
📏 Distance: 1.0942
📝 Abstract:
This proposed rulemaking would impose new design standards to address cybersecurity threats for
transport category airplanes, engines, and propellers. The intended effect of this proposed action
is to standardize the FAA's criteria for addressing cybersecurity threats, reducing certification
costs and time while maintaining the same level of safety provided by current special conditions.
--------------------------------------
Querying table 'federal_register_experimental' (Version 1)...

--- Top Result for Version: Experimental (all-mpnet-base-v2) ---
📄 Title: Commission Information Collection Activities (FERC-725B); Comment Request; Extension
🗓️  Date: 2024-08-20
📏 Distance: 1.0827
📝 Abstract:
In compliance with the requirements of the Paperwork Reduction Act of 1995, the Federal Energy
Regulatory Commission (Commission or FERC) is soliciting public comment on the currently approved
information collection, FERC-725B, Mandatory Reliability Standards, Critical Infrastructure
Protection (CIP) (Update for CIP-012-1 to version CIP-012-02) Cyber Security--Communications between
Control Centers. The 60-day notice comment period ended on July 23, 2024, with no comments received.
--------------------------------------

✅ A/B test complete. Notice the difference in relevance (distance score) between models. This showcases how LanceDB enables [experimentation with different embedding models](/docs/embeddings/) without disrupting production systems.
```

## Related Documentation

To learn more about the concepts and features used in this tutorial:

- **[RAG Fundamentals](/docs/tutorials/rag/)** - Explore other RAG techniques and applications
- **[Vector Search](/docs/search/)** - Learn about LanceDB's search capabilities
- **[Embedding Models](/docs/integrations/embedding/)** - Understand different embedding strategies
- **[Table Management](/docs/tables/)** - Master LanceDB table operations and versioning
- **[Enterprise Features](/docs/enterprise/)** - Discover production-ready capabilities
- **[Performance Optimization](/docs/enterprise/benchmark)** - Learn about LanceDB's performance characteristics
