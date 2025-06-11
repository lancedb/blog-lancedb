---
date: 2023-12-12
author: Ayush Chaurasia
---
---
title: MemGPT: OS inspired LLMs that manage their own memory
date: 2024-03-14
draft: false
featured: false
image: /assets/posts/1.png
description: Explore memgpt: os inspired llms that manage their own memory with practical insights and expert guidance from the LanceDB team.
author: David Myriel
---

by Ayush Chaurasia

In the landscape of artificial intelligence, large language models (LLMs) have undeniably reshaped the game. However, a notable challenge persists — their restricted context windows limit their effectiveness in tasks requiring extended conversations and thorough document analysis.

[MemGPT](https://github.com/cpacker/MemGPT), an open source python package aims to solve this problem by using a concept drawing inspiration from traditional operating systems’ hierarchical memory systems. This technique optimizes data movement between fast and slow memory, providing the illusion of expansive memory resources.
![](https://miro.medium.com/v2/resize:fit:770/1*RvDrywTt1wbW2j0uKZ9-wQ.png)MemGPT is a system that tackles the limited context window of traditional LLMs by allowing them to manage their own memory. It does this by adding a tiered memory system and functions to a standard LLM processor. The main context is the fixed-length input, and MemGPT analyzes the outputs at each step, either yielding control or using a function call to move data between the main and external contexts. It can even chain function calls together and wait for external events before resuming. In short, MemGPT gives LLMs the ability to remember and process more information than their usual limited context allows. This opens up new possibilities for tasks that require long-term memory or complex reasoning.
# Conversational agent with virtually unlimited memory!

[MemGPT](https://github.com/cpacker/MemGPT) can update context and search for information from its previous interactions when needed. This allows it to perform as a powerful conversational agent with unbound context.

The authors assess MemGPT, on these two criteria:

• Does MemGPT leverage its memory to improve conversation consistency? Can it remember relevant facts, preferences, and events from past interactions to maintain coherence?

• Does MemGPT produce more engaging dialogue by taking advantage of memory? Does it spontaneously incorporate long-range user information to personalize messages?
![](https://miro.medium.com/v2/resize:fit:770/1*kZhTIVAmMLlPM5CGqiwm4A.png)The above example illustrates a deep memory retrieval task. The user asks a question that can only be answered using information from a prior session (no longer in-context). Even though the answer is not immediately answerable using the in-context information, MemGPT can search through its recall storage containing prior conversations to retrieve the answer.
# External Data Sources

MemGPT supports pre-loading data into archival memory. In order to make data accessible to your agent, you must load data and then attach the data source to your agent.

External data sources are vectorized and stored for the agent to perform semantic search when user queries require assistance

## Built-in support for LanceDB
![](https://miro.medium.com/v2/resize:fit:770/1*8kW8NQPW25PJn5vFEAGbWg.png)
MemGPT uses [lancedb](http://lancedb.com/) as the default archival storage for storing and retrieving external data. It not only provides a seamless setup-free experience but the persisted HDD storage allows you scale from gigabytes to terabytes to petabytes without blowing out your budget or sacrificing performance.

# MemGPT in Action

After installing MemGPT (*mymemgpt* on pypi), you configure it using *memgpt configure *command.

Here’s an example that configures an agent and simply adds something to the archival memory. Then, it asks something related to it and memGPT understands what to return

## Using external data source

Let’s ingest the intro of memGPT docs as an external data source and ask question about it. The best part is that once you load an external data it stays available for you to load it in any other agent too. And you can load multiple data sources for an agent.
![](https://miro.medium.com/v2/resize:fit:770/1*H0djUI2u0uinm50VuhWXRg.png)
You can use special commands followed by a slash to perform specific actions. For example here in this example, I’ve used the `/attach` command to attach an external vectorized data source.

# Customizations

MemGPT allows you to customize it to your needs. You can [create your own presets ](https://memgpt.readthedocs.io/en/latest/presets/)by setting a system prompt tuned to your use case.

It also supports various LLMs like OpenAI, Azure, Local LLMs including LLama.cpp and also custom LLM servers.

## Give it a try!

To give memGPT a try, you can follow the installation steps in the [quickstart](https://github.com/cpacker/MemGPT). The github repo also provides and up-to-date future roadmap of the tool and links to discord community if you’d like to get involved.

Learn more about the features and roadmap of MemGPT on their [GitHub](https://github.com/cpacker/MemGPT). Don’t forget for drop a 🌟.
