---
title: Foundation of Compound AI Meetup Kicking Off, More LanceDB Integrations
slug: foundation-of-compound-ai-meetup-kicking-off-more-lancedb-integrations
date_published: 2024-10-10T14:20:51.000Z
date_updated: 2024-10-10T14:20:51.000Z
tags: Newsletter
---

## Community contributions

💡

[Dspy now works with LanceDB](https://github.com/stanfordnlp/dspy/pull/1444). LanceDB helps DSPy by quickly storing and retrieving information. This lets DSPy find relevant details faster, making prompts more accurate. This integration ensures that prompts meet user needs, leading to a better writing experience.

💡

Prefect released [ControlFlow 0.10](https://www.jlowin.dev/blog/controlflow-0-10-total-recall), a Python framework for building agentic AI workflows. This release introduces a major new feature: persistent memory for AI agents, and ControlFlow memory now integrates with LanceDB.

💡

A heartfelt thank you to our community contributors of lance and lancedb this month: [@ankitvij-db](https://github.com/ankitvij-db)[@jiachengdb](https://github.com/jiachengdb)[@dentiny](https://github.com/dentiny)[@tonyf](https://github.com/tonyf)[@dsgibbons](https://github.com/dsgibbons)[@rithikJha](https://github.com/rithikJha)[@sayandipdutta](https://github.com/sayandipdutta)[@gagan-bhullar-tech](https://github.com/gagan-bhullar-tech)[@PrashantDixit0](https://github.com/PrashantDixit0)[@mattbasta](https://github.com/mattbasta)[@jameswu1991](https://github.com/jameswu1991)[@bllchmbrs](https://github.com/bllchmbrs)[@antoniomdk](https://github.com/antoniomdk)[@ousiax](https://github.com/ousiax)[@rahuljo](https://github.com/rahuljo)[@philz](https://github.com/philz)

💡

 Check out [VARAG](https://github.com/adithya-s-k/VARAG), Vision first RAG Engine project powered by LanceDB

## Good reads

- Late interaction & efficient Multi-modal retrievers need more than a vector index. In late interaction rankers, the query embedding interacts with all document embeddings using a MaxSim operator that calculates cosine similarity. The results from these calculations are then summed across the query terms.

ColPali is a visual retriever model that combines:

1. **PaliGemma**: This model integrates the vision encoder with the Gemma-2B language model. It also includes projection layers that convert language model inputs into 128-dimensional vectors.
2. A late interaction mechanism inspired by ColBert.

[Read more](__GHOST_URL__/late-interaction-efficient-multi-modal-retrievers-need-more-than-just-a-vector-index/)

- Multi document agentic RAG: A walkthrough. Agentic RAG is a smarter version of regular RAG systems. Instead of just pulling up information, it carefully analyzes the question and uses smart strategies to give a better, more thoughtful answer.

[Read the blog](__GHOST_URL__/multi-document-agentic-rag-a-walkthrough/)

## Event recap

- The inaugural Foundation of Compound AI Meetup, hosted by LanceDB and Databricks on September 24th, was a great success! A special thanks to our speakers, Chang, Erik, and Kobie. Stay tuned for our next event in Oct 22nd!

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXehOlYgg4Efnvn4nudK-dGK2m7pUpo9I2rJOP4CsCUjiTT4TotrRuZ67l7tvF944ggIumN2BfX1kfvbSCULEFTuTAbUaTN2bMcw4rRNKqq9c2qCL1MInw9LBnXmp8eDE1lzflHcTtcGuH4g2xSnTsuBxuE?key=o--pG56DtXOa6F9Q5uDx_w)September Speakers
- In Octber, Compound AI Meetup series will take place in Mountain View on Oct 22nd. You will hear from the Cofounder/CEO of Continue, Cofounder/CTO of LanceDB, and Engineering manager from Databricks. 

[Register for the Oct event](https://lu.ma/hfqn3lj3)

## Latest releases

- Starting with Lance v0.18.0, new datasets will now use Lance file format v2.0 by default. This brings much faster scans as well as null support to all data types. This change will propagate to the next LanceDB SDK release in October.
