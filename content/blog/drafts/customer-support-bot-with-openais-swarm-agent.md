---
title: "Customer Support Bot with OpenAI's Swarm Agent"
date: 2024-11-04
author: LanceDB
categories: ["Community"]
draft: true
featured: false
image: /assets/blog/customer-support-bot-with-openais-swarm-agent/preview-image.png
meta_image: /assets/blog/customer-support-bot-with-openais-swarm-agent/preview-image.png
description: "Master about customer support bot with openai's swarm agent. Get practical steps, examples, and best practices you can use now."
---

💡

This is a community blog by Prashant Kumar

Difference between an assistant and a Swarm Agent- an assistant is a simple  sequential program without function calls. Agent Swarm resembles a modern modular program where specific tasks are managed by dedicated functions.

### What is OpenAI Swarm?

OpenAI Swarm is a framework for efficiently managing multiple AI agents. Its most crucial aspects are simplicity and control. It is designed to ***Create, Coordinate, and Control*** a group of agents that can share tasks and decisions in the simplest form.

Swarm focuses on two key ideas: ***Agents***, which perform specific functions, and ***Handoffs***, which allow one agent to pass a task to another based on the situation. This setup makes building flexible and complex AI systems with straightforward logic easier.

OpenAI Swarm is built for developers and researchers interested in exploring multi-agent systems. It is particularly well-suited for those working on AI assistants and task automation. While still, "*OpenAI’s Swarm is not intended for production use, this experimental framework for multi-agent systems could potentially revolutionize how tasks are distributed and executed in various industries".*

Swarm is designed for specific real-world use cases:

1. **Customer Support Bots:** Different agents handle inquiries like billing and technical issues, passing complex questions to the right specialist.
2. **Personal Shopper: **Agents that can help with making sales and refunding orders.

and many more ...

In this article, we'll explore the implementation of a Customer Support bot. We'll utilize OpenAI's data and build a support bot around it to answer user queries using Swarm agents.

### Implementation

[

Google Colab

![](https://ssl.gstatic.com/colaboratory-static/common/8f9c73a58195bb6a1915ebabd5eedb19/img/favicon.ico)

![](https://colab.research.google.com/img/colab_favicon_256px.png)
](https://colab.research.google.com/github/lancedb/vectordb-recipes/blob/main/examples/assistance-bot-with-swarm/assitant_bot_with_swarm.ipynb)
To implement a customer support bot for OpenAI using data in JSON format and ingesting it into a LanceDB table, here's a simple data ingestion pipeline:

    import pandas as pd
    import lancedb
    from lancedb.pydantic import LanceModel, Vector
    from lancedb.embeddings import get_registry

    from datasets import load_dataset

    EMBEDDING_MODEL = "text-embedding-ada-002"

    # load dataset
    dataset_name = "Prasant/openai-dataset"
    dataset = load_dataset(dataset_name)
    article_df = pd.DataFrame(dataset["train"])

    # ingest data inside table
    db = lancedb.connect("/tmp/db")
    func = get_registry().get("openai").create(name=EMBEDDING_MODEL)

    class Article(LanceModel):
        text: str = func.SourceField()
        vector: Vector(func.ndims()) = func.VectorField()
        title: str
        url: str

    table = db.create_table("help-center", schema=Article, mode="overwrite")
    table.add(article_df)

Now we have data ingested in the table. To create a customer service bot, we need two agents: a user Interface agent and a help center agent, both equipped with different tools. We’ll use the helper function `run_demo_loop` to set up an interactive Swarm session.

1. **User Interface Agent:** Manages initial user interactions and directs users to the help center agent based on their needs.
2. **Help Center Agent:** Offers detailed help and support, using various tools and integrating with a LanceDB VectorDB for retrieving documentation.

Here's a sample code for it

    import re

    import lancedb
    from swarm import Agent
    from swarm.repl import run_demo_loop

    db = lancedb.connect("/tmp/db")
    table = db.open_table("help-center")

    def query_lancedb(query, top_k=5):
        # Creates embedding vector from user query
        query_results = table.search(query).limit(top_k).to_pandas()

        return query_results

    def query_docs(query):
        """Query the knowledge base for relevant articles."""
        print(f"Searching knowledge base with query: {query}")
        query_results = query_lancedb(query)
        output = []

        print(query_results)
        for index, article in query_results.iterrows():
            output.append((article['title'], article['text'], article['url']))

        if output:
            title, content, _ = output[0]
            response = f"Title: {title}\nContent: {content}"
            truncated_content = re.sub(
                r"\s+", " ", content[:50] + "..." if len(content) > 50 else content
            )
            print("Most relevant article title:", truncated_content)
            return {"response": response}
        else:
            print("No results")
            return {"response": "No results found."}

    def send_email(email_address, message):
        """Send an email to the user."""
        response = f"Email sent to: {email_address} with message: {message}"
        return {"response": response}

    def submit_ticket(description):
        """Submit a ticket for the user."""
        return {"response": f"Ticket created for {description}"}

    def transfer_to_help_center():
        """Transfer the user to the help center agent."""
        return help_center_agent

    user_interface_agent = Agent(
        name="User Interface Agent",
        instructions="You are a user interface agent that handles all interactions with the user. Call this agent for general questions and when no other agent is correct for the user query.",
        functions=[transfer_to_help_center],
    )

    help_center_agent = Agent(
        name="Help Center Agent",
        instructions="You are an OpenAI help center agent who deals with questions about OpenAI products, such as GPT models, DALL-E, Whisper, etc.",
        functions=[query_docs, submit_ticket, send_email],
    )

    if __name__ == "__main__":
        run_demo_loop(user_interface_agent)

Here we are ready to start asking questions from Swarm agents, and this is how its results will look like
![](__GHOST_URL__/content/images/2024/10/Screenshot-from-2024-10-24-11-47-07.png)
However Swarm is still experimental, its lightweight design allows it to manage complex workflows with multiple agents effectively.

## Comparison with Other Multi-Agent Frameworks

Swarm is unique in its simplicity and modular design. Compared to other frameworks like AutoGPT or LangChain, Swarm focuses more on real-time agent coordination and handoffs, rather than complex pre-defined agent behavior. While LangChain is great for RAG tasks and large-scale data handling, Swarm excels in specific task orchestration, where agents interact and respond dynamically based on real-time conditions.

Checkout for example code and Drop us a 🌟
[

GitHub - lancedb/vectordb-recipes: High quality resources & applications for LLMs, multi-modal models and VectorDBs

High quality resources &amp; applications for LLMs, multi-modal models and VectorDBs - GitHub - lancedb/vectordb-recipes: High quality resources &amp; applications for LLMs, multi-modal models and…

![](https://github.githubassets.com/assets/pinned-octocat-093da3e6fa40.svg)GitHublancedb

![](https://opengraph.githubassets.com/5fd0da5be4838f8b45a2dbf566a9dcdd1117f99dad9fdfc09ee089650415e6a3/lancedb/vectordb-recipes)
](https://github.com/lancedb/vectordb-recipes)
