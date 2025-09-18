---
title: Chat with your stats using Langchain dataframe agent & LanceDB hybrid search
date: 2024-06-30
author: LanceDB
categories: ["Community"]
draft: false
featured: false
---

![](__GHOST_URL__/content/images/2024/06/image-4-2.png)
In this blog, we’ll explore how to build a chat application that interacts with CSV and Excel files using LanceDB’s hybrid search capabilities. With LanceDB, performing direct operations on large-scale columnar data efficiently.

A common issue with directly loading data using pandas or similar methods is that they work well only on a small scale. But what if you have billions of rows? How would you go about handling such large datasets?

This is where a comes into play. You can efficiently retrieve relevant information from larger datasets by utilizing LanceDB’s hybrid search and Full-Text Search (FTS) methods. Once the data is retrieved, it can be passed to a pandas agent for further processing.

Let’s discuss these concepts hands-on using sample export-import data for demonstration purposes. We will take sample export-import data for the demo.

Below is sample data related to export import which has HS codes
![](https://cdn-images-1.medium.com/max/1000/1*BqcZKYB3XLQLJSWAheGUrQ.png)
Our objective is to extract the HS code for each commodity while also considering the share and percentage. You can choose any columns that suit your use case. Now, let's proceed to use LanceDB for storing and indexing this data.

#### Full-Text Search (FTS) for Commodity

I used Full-Text Search (FTS) for the ‘Commodity’ field. This FTS will check the query and if anything is related to it, it will try to fetch or retrieve the relevant data. You can always set the FTS based on your use case to ensure that the most relevant information is retrieved efficiently.

#### Reranker model and hybrid search
![](__GHOST_URL__/content/images/2024/06/1_Zh4Jju6uiCYFO9HHvO5sIA.webp)
We use a reranker model, specifically the `LinearCombinationReranker`, to enhance the search results. This reranker allows you to adjust the weight between text search (BM-25) and semantic (vector) search. A weight of 0 means pure text search, while a weight of 1 means pure semantic search. By using a hybrid search, we combine the strengths of both search methods to provide more accurate and relevant results.

For more details on the reranker model and hybrid search, you can check out the [LanceDB documentation on hybrid search](https://lancedb.github.io/lancedb/hybrid_search/hybrid_search/).

#### Code Breakdown

1. Creating an Embedding Function:

    func = registry.get("sentence-transformers").create(device="cpu")

1. Defining the Data Model: 

    class Words(LanceModel):     
      HSCode: int = func.SourceField()     
      Year_2022_2023: str = func.SourceField()     
      Year_2023_2024: str = func.SourceField()     
      Commodity: str = func.SourceField()     
      vector: Vector(func.ndims()) = func.VectorField()
    

**Creating a Table and Adding Data**:

    table = db.create_table("exim", schema=Words, mode="overwrite") table.add(data=df)

1. **Creating an FTS Index**:

- `table.create_fts_index("Commodity")`

I want to do FTS on `Commodity` column so I selected it

1. **Using a Reranker for Hybrid Search**:

    reranker = LinearCombinationReranker(weight=0.3) 
    query = 'what is HS code of sugar' 
    lance_reranker_op = table.search(query, query_type="hybrid")\
                      .rerank(reranker=reranker)\ 
                      .limit(5)\                   
                      .to_pandas() 
    
    lance_reranker_op

This code demonstrates how to set up and use LanceDB for hybrid search, leveraging both FTS and semantic search with a reranker to get accurate results from your dataset.

### Using the Results with a Pandas DataFrame Agent

Now we can pass our results DataFrame to a pandas DataFrame agent for further processing.

First, let’s clean up the DataFrame by removing columns that are not important for the next steps:

    df = lance_reranker_op.drop(columns=['_relevance_score', 'vector'])
    
    # The cleaned DataFrame
    result_from_lancedb = df
    lance_reranker_op = lance_reranker_op.copy()

Next, we will set up the pandas DataFrame agent using LangChain:

    from langchain.agents.agent_types import AgentType
    from langchain_experimental.agents.agent_toolkits import create_pandas_dataframe_agent
    from langchain_openai import ChatOpenAI
    import pandas as pd
    from langchain_openai import OpenAI
    
    
    agent = create_pandas_dataframe_agent(
        ChatOpenAI(temperature=0, model="gpt-3.5-turbo-0613"),
        result_from_lancedb,
        verbose=True,
        agent_type=AgentType.OPENAI_FUNCTIONS,
        handle_parsing_errors=True,
        allow_dangerous_code=True
    )

output:

    > Entering new AgentExecutor chain...
    
    Invoking: `python_repl_ast` with `{'query': "df[df['Commodity'] == 'OTHER COCONUTS']['HSCode'].values[0]"}`
    
    
    80119The HS code of "OTHER COCONUTS" is 80119.
    
    > Finished chain.
    {'input': 'what is Hs code of OTHER COCONUTS ',
     'output': 'The HS code of "OTHER COCONUTS" is 80119.'}
    

That’s how you can build a system to interact with your data using LanceDB’s hybrid search capabilities. If your data is in CSV format, this approach is particularly helpful. Additionally, you can experiment with different hybrid methods and ranked models to compare your results and find the most effective solution for your use case.

For more detailed guides, visit our blog where we cover various methods and tools for data interaction and improvement. You can also explore our [vectorDB recipes](https://github.com/lancedb/vectordb-recipes) on GitHub for more generative AI and vector database-related projects.

For the full executable script  refer to our [Google Colab Notebook](https://colab.research.google.com/drive/1iqXfTkKqbNOiit_jTUFWRvTmhkk8kovX?usp=sharing)
[

Google Colab

![](https://ssl.gstatic.com/colaboratory-static/common/be01a7b5f02fab7b1eb2b8a2ae88eb58/img/favicon.ico)

![](https://colab.research.google.com/img/colab_favicon_256px.png)
](https://colab.research.google.com/drive/1TOc91IV0x4XHYMvmtgdKgR7gjlIv64_B?usp=sharing)
Stay tuned for more updates and tutorials on leveraging vector databases for efficient data retrieval and interaction!
