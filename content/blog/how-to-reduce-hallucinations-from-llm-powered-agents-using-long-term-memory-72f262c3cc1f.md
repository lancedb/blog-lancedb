---
title: "Reduce Hallucinations from LLM-Powered Agents Using Long-Term Memory"
date: 2023-07-19
author: LanceDB
categories: ["Engineering"]
draft: false
featured: false
image: /assets/blog/how-to-reduce-hallucinations-from-llm-powered-agents-using-long-term-memory-72f262c3cc1f/preview-image.png
meta_image: /assets/blog/how-to-reduce-hallucinations-from-llm-powered-agents-using-long-term-memory-72f262c3cc1f/preview-image.png
description: "Understand about reduce hallucinations from llm-powered agents using long-term memory. Get practical steps, examples, and best practices you can use now."
---

by Tevin Wang

## Introduction

A few weeks ago, I attended an AI Agents hackathon hosted in SF at the AGI house. There, I worked with a team on a medical multi-agent system that streamlined and automated a key clinical-research workflow — the collection and communication of clinical test data.

I learned that the development of these AI agent systems is extremely early stage, and although we have scaled exponentially in our AI tooling, infrastructure, and models, we have not seen many AI agents applied to real-world use cases. I believe that the biggest reason why is the** risk of hallucination**.

These systems may work in a large majority of runs, but hallucination and failure still happens. For many industries, like in the medical space, such risk is simply unacceptable. So, how can we work on improving our agents to reduce the risk of hallucination and increase probabilities of successful and safe run?

## Critique-based contexting

We’ve seen that using retrieval augmented generation can be a great way to add context to generative AI and reduce hallucination. I believe that we can use a similar concept within the context of AI agents. Let’s say we have a simple fitness trainer agent that searches Google for information about a fitness routine for a particular person with specific interests. Additionally, such agent is able to review its past actions and develop critiques that could help improve further actions.

The key here is creating a context based on these critiques — what is called **critique-based contexting**. Critique-based contexting is when we use vector databases to store long-term memory of critiques for agents. For similar people with similar interests, we inserts past critique information into the context window to help improve the actions of the agent as well as ground such actions in relevant past results.

This system can improve its specialized answer by using long-term memory and thus generate better results. For instance, in the medical space, people with different backgrounds likely need different communication styles. By adding critique-based context, we’ve enabled the system to better cater to those different backgrounds.

**Here’s a diagram of such system:**
![Critique-based contexting diagram](/assets/blog/how-to-reduce-hallucinations-from-llm-powered-agents-using-long-term-memory-72f262c3cc1f/Untitled--34-.png)
Critique-based contexting diagram, Credit: background by rawpixel.com
## Breakdown

1. A **LangChain agent **takes in client input that describes information about the client and the request. **LangChain **is an open source library/framework that simplifies building LLM-powered applications.
2. We use an **embedding model**, such as OpenAI `text-embedding-ada-002` model, to embed our client input into a vector embedding. **Vector embeddings** are high-dimensional representations of unstructured data generated from a trained model.
3. This embedding is now used to perform similarity search using [k-nearest neighbors](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm) within a vector database, like LanceDB. **Vector databases **store vector embeddings.
4. We then retrieve these similar results, which comes with information about actions and critiques and **input them as context** into our LangChain agent.
5. The agent **decides, evaluates, and performs** its next actions based on this critique context.
6. Once it’s done, it will evaluate and critique its actions. We take the embedding of the client input along with its actions and critiques to **insert into the vector database**.

## Fitness trainer example

We’ll now look at critique-based contexting via a simple example using LanceDB as a vector database.

LanceDB is a serverless vector database that makes data management for LLMs frictionless. It has multi-modal search, native Python and JS support, and many ecosystem integrations.

The full example is available in both Python (script and notebook) and JS [here](https://github.com/lancedb/vectordb-recipes/tree/main/examples/reducing_hallucinations_ai_agents/). We’ll be using Python in this post.

To start, you must have an OpenAI API key, which you can get for free by setting up an account [here](https://openai.com/blog/openai-api), and a SerpApi API key, which you can get for free by setting up an account [here](https://serpapi.com/).

Insert them as environment variables via a `.env` file:

```python
OPENAI_API_KEY = "<insert-key-here>"
SERPAPI_API_KEY = "<insert-key-here>"
```

Now let’s install some required python libraries, as we’ll be using OpenAI, LangChain, SerpApi for Google Search, and LanceDB. We’ll also need `dotenv` to retrieve our environment variables.

```python
pip install openai langchain google-search-results lancedb python-dotenv
```

Then, let’s import the required libraries for our LangChain agent.

```python
from langchain.agents import load_tools
from langchain.agents import initialize_agent
from langchain.agents import AgentType
from langchain.chat_models import ChatOpenAI
```

Now let’s import our environment variables via `load_dotenv()`.

```python
from dotenv import load_dotenv

load_dotenv()
```

We’ll now specify and connect to the path `data/agent-lancedb` to store our vector database.

```python
import lancedb

db = lancedb.connect("data/agent-lancedb")
```

To create embeddings out of the text, we’ll call the OpenAI embeddings API (ada2 text embeddings model) to get embeddings.

```python
import openai

def embed_func(c):
    rs = openai.Embedding.create(input=c, engine="text-embedding-ada-002")
    return [record["embedding"] for record in rs["data"]]
```

Now, we’ll create a LangChain tool that allows our agent to insert critiques, which uses a pydantic schema to guide the agent on what kind of results to insert.

In LanceDB the primary abstraction you’ll use to work with your data is a **Table**. A Table is designed to store large numbers of columns and huge quantities of data! For those interested, a LanceDB is columnar-based, and uses Lance, an open data format to store data.

This tool will create a Table if it does not exist and store the relevant information (the embedding, actions, and critiques).

```python
from langchain.tools import tool
from pydantic import BaseModel, Field

class InsertCritiquesInput(BaseModel):
    info: str = Field(description="should be demographics or interests or other information about the exercise request provided by the user")
    actions: str = Field(description="numbered list of langchain agent actions taken (searched for, gave this response, etc.)")
    critique: str = Field(description="negative constructive feedback on the actions you took, limitations, potential biases, and more")

@tool("insert_critiques", args_schema=InsertCritiquesInput)
def insert_critiques(info: str, actions: str, critique: str) -> str:
    """Insert actions and critiques for similar exercise requests in the future."""
    table_name = "exercise-routine"
    if table_name not in db.table_names():
        tbl = db.create_table(table_name, [{"vector": embed_func(info)[0], "actions": actions, "critique": critique}])
    else:
        tbl = db.open_table(table_name)
        tbl.add([{"vector": embed_func(info)[0], "actions": actions, "critique": critique}])
    return "Inserted and done."
```

Similarly, let’s create a tool for retrieving critiques. We’ll retrieve the actions and critiques from the top 5 most similar user inputs.

```python
class RetrieveCritiquesInput(BaseModel):
    query: str = Field(description="should be demographics or interests or other information about the exercise request provided by the user")

@tool("retrieve_critiques", args_schema=RetrieveCritiquesInput)
def retrieve_critiques(query: str) -> str:
    """Retrieve actions and critiques for similar exercise requests."""
    table_name = "exercise-routine"
    if table_name in db.table_names():
        tbl = db.open_table(table_name)
        results = tbl.search(embed_func(query)[0]).limit(5).select(["actions", "critique"]).to_df()
        results_list = results.drop("vector", axis=1).values.tolist()
        return "Continue with the list with relevant actions and critiques which are in the format [[action, critique], ...]:\n" + str(results_list)
    else:
        return "No info, but continue."
```

Let’s now use LangChain to load our tools in. This includes our custom tools as well as a Google Search tool that uses SerpApi. We will use OpenAI’s `gpt-3.5-turbo-0613` as our LLM.

```python
llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo-0613")
tools = load_tools(["serpapi"], llm=llm)
tools.extend([insert_critiques, retrieve_critiques])
```

Before we run our agent, let’s create a function that defines our prompt that we pass in to the agent, which allows us to pass in client information.

```python
def create_prompt(info: str) -> str:
    prompt_start = (
        "Please execute actions as a fitness trainer based on the information about the user and their interests below.\n\n"
        + "Info from the user:\n\n"
    )
    prompt_end = (
        "\n\n1. Retrieve using user info and review the past actions and critiques if there is any\n"
        + "2. Keep past actions and critiques in mind while researching for an exercise routine with steps which we respond to the user\n"
        + "3. Before returning the response, it is of upmost importance to insert the actions you took (numbered list: searched for, found this, etc.) and critiques (negative feedback: limitations, potential biases, and more) into the database for getting better exercise routines in the future. \n"
    )
    return prompt_start + info + prompt_end
```

Finally, let’s create our run_agent function. We’ll use the `STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION` agent in order to allow us to use multi-input tools (since we need to add client input, actions, and critiques as arguments when inserting critiques).

```python
def run_agent(info):
    agent = initialize_agent(
        tools,
        llm,
        agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
        verbose=True,
    )
    agent.run(input=create_prompt(info))
```

Let’s run. Feel free to use your own input!

Notice that in the first run, there wouldn’t be any critiques yet, since the database is empty. After the first run, critiques should appear.

```python
run_agent("My name is Tevin, I'm a 19 year old university student at CMU. I love running.")
```

Here are the results for a particular run when the context has been populated by previous runs:

```python
> Entering new  chain...
Action:
{
  "action": "retrieve_critiques",
  "action_input": "Tevin, 19, university student, running"
}
Observation: List with relevant actions and critiques which are in the format [[action, critique], ...]:
[["Searched for 'exercise routine for running enthusiasts', found 'The Ultimate Strength Training Plan For Runners: 7 Dynamite Exercises'", 'The routine provided is focused on strength training, which may not be suitable for all runners. It would be helpful to include some cardiovascular exercises and flexibility training as well.', 0.04102211445569992], ["Searched for 'exercise routine for running enthusiasts', found 'The Ultimate Strength Training Plan For Runners: 7 Dynamite Exercises'", 'The routine provided is focused on strength training, which may not be suitable for all runners. It would be helpful to include some cardiovascular exercises and flexibility training as well.', 0.04102211445569992], ["Searched for 'exercise routine for runners', found 'Core Work for Runners: 6 Essential Exercises'", 'The routine includes core exercises, which are beneficial for runners. However, it would be helpful to also include cardiovascular exercises and flexibility training.', 0.19422659277915955]]
Thought:Based on the user's information and interests, I need to research and provide an exercise routine that is suitable for a 19-year-old university student who loves running. I should also keep in mind the past actions and critiques to ensure a well-rounded routine. After that, I will insert the actions and critiques into the database for future reference.

Action:
{
  "action": "Search",
  "action_input": "exercise routine for university students who love running"
}
Observation: Work with maximum effort and intensity for 20 seconds and take an active rest for 10 seconds. Then when you are ready, begin again.
Thought:Based on my search, I found an exercise routine that may be suitable for you as a 19-year-old university student who loves running. The routine involves high-intensity interval training (HIIT), which is a great way to improve cardiovascular fitness and burn calories. Here's the routine:

1. Warm-up: Start with a 5-minute jog or brisk walk to warm up your muscles.
2. High Knees: Stand in place and lift your knees as high as possible, alternating legs. Do this for 20 seconds.
3. Active Rest: Take a 10-second break, walking or jogging in place.
4. Jumping Jacks: Stand with your feet together and arms by your sides. Jump your feet out to the sides while raising your arms overhead. Jump back to the starting position. Do this for 20 seconds.
5. Active Rest: Take a 10-second break, walking or jogging in place.
6. Burpees: Start in a standing position, then squat down and place your hands on the floor. Kick your feet back into a push-up position, then quickly bring them back in and jump up explosively. Do this for 20 seconds.
7. Active Rest: Take a 10-second break, walking or jogging in place.
8. Mountain Climbers: Get into a push-up position, then alternate bringing your knees in towards your chest as if you're climbing a mountain. Do this for 20 seconds.
9. Active Rest: Take a 10-second break, walking or jogging in place.
10. Repeat: Repeat the entire circuit (steps 2-9) for a total of 3-4 rounds.
11. Cool Down: Finish with a 5-minute jog or brisk walk to cool down and stretch your muscles.

Remember to listen to your body and modify the exercises as needed. Stay hydrated and take breaks if necessary. This routine can be done 2-3 times per week, alternating with your running sessions.

I hope you find this routine helpful! Let me know if you have any other questions.

Action:
{
  "action": "insert_critiques",
  "action_input": {
    "info": "Tevin, 19, university student, running",
    "actions": "Searched for 'exercise routine for university students who love running', found HIIT routine",
    "critique": "The routine provided is focused on HIIT, which may not be suitable for all university students. It would be helpful to include some strength training exercises and flexibility training as well."
  }
}

Observation: Inserted and done.
Thought:I have provided an exercise routine that involves high-intensity interval training (HIIT), which is suitable for a 19-year-old university student who loves running. However, I should note that the routine may not be suitable for all university students, as it focuses on HIIT. It would be beneficial to include some strength training exercises and flexibility training as well.

I have inserted the actions and critiques into the database for future reference. This will help improve the exercise routines provided in the future.

Let me know if there's anything else I can assist you with!

> Finished chain.
```

We have retrieved critiques related to past strength trainings for runners, such as:

```
    ["Searched for 'exercise routine for running enthusiasts', found 'The Ultimate Strength Training Plan For Runners: 7 Dynamite Exercises'", 'The routine provided is focused on strength training, which may not be suitable for all runners. It would be helpful to include some cardiovascular exercises and flexibility training as well.', 0.04102211445569992]
```
The critique given was that strength training might not be suitable for all runners, so the agent proceeded with a cardiovascular fitness routine that the agent thought was suitable:
```
    Based on my search, I found an exercise routine that may be suitable for you as a 19-year-old university student who loves running. The routine involves high-intensity interval training (HIIT), which is a great way to improve cardiovascular fitness and burn calories. Here's the routine:

    1. Warm-up: Start with a 5-minute jog or brisk walk to warm up your muscles.
    2. High Knees: Stand in place and lift your knees as high as possible, alternating legs. Do this for 20 seconds.
    3. Active Rest: Take a 10-second break, walking or jogging in place.
    4. Jumping Jacks: Stand with your feet together and arms by your sides. Jump your feet out to the sides while raising your arms overhead. Jump back to the starting position. Do this for 20 seconds.
    5. Active Rest: Take a 10-second break, walking or jogging in place.
    6. Burpees: Start in a standing position, then squat down and place your hands on the floor. Kick your feet back into a push-up position, then quickly bring them back in and jump up explosively. Do this for 20 seconds.
    7. Active Rest: Take a 10-second break, walking or jogging in place.
    8. Mountain Climbers: Get into a push-up position, then alternate bringing your knees in towards your chest as if you're climbing a mountain. Do this for 20 seconds.
    9. Active Rest: Take a 10-second break, walking or jogging in place.
    10. Repeat: Repeat the entire circuit (steps 2-9) for a total of 3-4 rounds.
    11. Cool Down: Finish with a 5-minute jog or brisk walk to cool down and stretch your muscles.
```
It then inserted some critiques backed into the database, now asking for flexibility and strength training.
```
    The routine provided is focused on HIIT, which may not be suitable for all university students. It would be helpful to include some strength training exercises and flexibility training as well.
```
You can see how when this process is refined, it can really help an agent improve its ability to perform the request and ground its request based on past results!

## Conclusion

I hope you got a chance to learn a bit more about critique-based contexting. Keep in mind that the use of critiques in prompt engineering is still very early stage and difficult to work with. However, the potential is there, and I believe AI agents can used in some really cool ways to impact society. Here’s a summary of this article:

- **Critique-based contexting** is the use of past critiques and past actions of similar in the context window of LLM prompts
- Such contexting can improve the actions taken by AI agents and **reduce hallucinations**
- We can use **vector databases **like LanceDB and **embedding models** like OpenAI’s ada2 text embeddings model to store and retrieve these similar critiques for context

Thanks for reading! If you have questions, feedback, or want help using LanceDB in your app, don’t hesitate to drop us a line at [contact@lancedb.com](mailto:contact@lancedb.com). And we’d really appreciate your support in the form of a Github Star on our [LanceDB repo](https://github.com/lancedb/lancedb) ⭐.
