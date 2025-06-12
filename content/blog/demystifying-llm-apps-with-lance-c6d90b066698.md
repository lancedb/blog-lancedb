---
title: Demystifying LLM Apps with Lance
date: 2023-05-22
draft: false
featured: false
image: /assets/blog/1.png
description: Explore demystifying llm apps with lance with practical insights and expert guidance from the LanceDB team.
author: Chang She
---
There’s a lot of justifiable excitement around using LLMs as the basis for building a new generation of smart apps. While tools like LangChain or GPT-Index makes it easy to create prototypes, it’s useful to look behind the curtain to see what the wizard looks like before taking these apps into production. In this post, we’ll show you how to build a Q&A chatbot using just base-level OSS python tooling, OpenAI, and Lance.

**tl;dr** — if you just want to play with the worked example, you can find a [notebook on the lance github](https://github.com/eto-ai/lance/blob/main/notebooks/youtube_transcript_search.ipynb).

# Goal

We’ll build a question-answer bot with answers drawn from youtube transcripts. The result is going to be a Jupyter Notebook where you can get the answer to a question you ask AND it shows the top matching YouTube video starting at the relevant point.

# Data prep

To make things simple, we’ll just use a ready made dataset of YouTube transcripts on HuggingFace:

    from datasets import load_dataset
    data = load_dataset('jamescalam/youtube-transcriptions', split='train')

This dataset has 208619 transcript sentences (across 700 videos)

    Dataset({
        features: ['title', 'published', 'url', 'video_id', 'channel_id', 'id', 'text', 'start', 'end'],
        num_rows: 208619
    })

We’ll use pandas to create the context windows of size 20 with stride 4. That means every 4 sentences, it creates a “context” by concatenating the next 20 sentences together. Eventually, the answers will come from finding the right context and summarizing it.

    import numpy as np
    import pandas as pd
    
    window = 20
    stride = 4
    
    def contextualize(raw_df, window, stride):
        def process_video(vid):
            # For each video, create the text rolling window
            text = vid.text.values
            time_end = vid["end"].values
            contexts = vid.iloc[:-window:stride, :].copy()
            contexts["text"] = [' '.join(text[start_i:start_i+window])
                                for start_i in range(0, len(vid)-window, stride)]
            contexts["end"] = [time_end[start_i+window-1]
                                for start_i in range(0, len(vid)-window, stride)]        
            return contexts
        # concat result from all videos
        return pd.concat([process_video(vid) for _, vid in raw_df.groupby("title")])
    
    df = contextualize(data.to_pandas(), 20, 4)

A brief aside: it’s annoying that pandas does not provide rolling window functions on non-numeric columns because `process_video` should just be simple call to `pd.DataFrame.rolling` .
![](https://miro.medium.com/v2/resize:fit:548/0*0pVh2VKPjMRt1Gg9.gif)Me finding out pandas rolling windows calls text columns “nuisance”
With this we go from 200K+ sentences to <50K contexts

    >>> len(df)
    48935

# Embeddings

Here we’ll use the OpenAI embeddings API to turn text into embeddings. There are other services like Cohere providing similar functionality, or you can run your own.

The OpenAI python API requires an API key for authentication. For details, you can refer to their [documentation](https://platform.openai.com/docs/api-reference/authentication) to see how to set it up.

The documentation *looks* super simple:

    import openai
    openai.Embedding.create(input="text", engine="text-embedding-ada-002")

But of course, the OpenAI API is almost always out of capacity, or you’re being throttled, or there’s some cryptic JSON decode error. To make our lives easier, we can use the `ratelimiter` and `retry` packages in python:

    import functools
    import openai
    import ratelimiter
    from retry import retry
    
    embed_model = "text-embedding-ada-002"
    
    # API limit at 60/min == 1/sec
    limiter = ratelimiter.RateLimiter(max_calls=0.9, period=1.0)
    
    # Get the embedding with retry
    @retry(tries=10, delay=1, max_delay=30, backoff=3, jitter=1)
    def embed_func(c):    
        rs = openai.Embedding.create(input=c, engine=embed_model)
        return [record["embedding"] for record in rs["data"]]
    
    rate_limited = limiter(embed_func)

And we can also request batches of embeddings instead of just one at a time

    from tqdm.auto import tqdm
    import math
    
    # We request in batches rather than 1 embedding at a time
    def to_batches(arr, batch_size):
        length = len(arr)
        def _chunker(arr):
            for start_i in range(0, len(df), batch_size):
                yield arr[start_i:start_i+batch_size]
        # add progress meter
        yield from tqdm(_chunker(arr), total=math.ceil(length / batch_size))
        
    batch_size = 1000
    batches = to_batches(df.text.values.tolist(), batch_size)
    embeds = [emb for c in batches for emb in rate_limited(c)]

# Search

Once the embeddings are created, we have to make it searchable. At this point, most existing toolchains require you to spin up a separate service or store your vectors separately from the data separately from the vector index. This is where Lance comes in. We can merge the embeddings (vectors) with the original data and write it to disk. So the vectors you need for similarity search lives with the index to make it fast lives with the data you need to filter / return to the user.

    import lance
    import pyarrow as pa
    from lance.vector import vec_to_table
    
    table = vec_to_table(np.array(embeds))
    combined = pa.Table.from_pandas(df).append_column("vector", table["vector"])
    ds = lance.write_dataset(combined, "chatbot.lance")

This is sufficient to do vector search in Lance

    ds.to_table(nearest={"column": "vector",
                         "q": [<query vector>], 
                         "k": <how many results>}).to_pandas()

The above query retrieves the `k` rows whose `vector` is most similar to the query vector `q` .

But a brute force approach is a bit slow (~150ms). Instead, if you’re going to be making a bunch of requests, you can create an ANN index on the vector column:

    ds = ds.create_index("vector", index_type="IVF_PQ", 
                         num_partitions=64, num_sub_vectors=96)

If you run the same ANN search query, you should get a much faster answer now.

Because Lance is columnar, you can easily retrieve additional columns. By default, the `to_table` returns all columns plus an extra “score” column. You can choose to add a `columns` argument to `to_table` to select a subset of available columns. You can also filter the ANN results by passing a SQL where clause string to the `filter` parameter in `to_table` .
![](https://miro.medium.com/v2/resize:fit:733/0*Dv6u1VYGYRgXsOVZ.jpg)Me talking about Lance
# Prompting

Unless you’re already familiar with how LLM apps work, you might be asking “what do embeddings have to do with Q&A bots?” This is where prompt engineering comes in. There are lots of great material dedicated to prompt engineering so I’ll spare the details in this post. Here we’ll just go through a practical example.

The magic happens in 3 steps:

## 1. Embed the query text

Let’s say you want to ask “Which training method should I use for sentence transformers when I only have pairs of related sentences?” Since we’ve converted all the transcripts into embeddings, we’ll also do the same with the query text itself

    query = ("Which training method should I use for sentence transformers "
             "when I only have pairs of related sentences?")
    openai.Embedding.create(input=query, engine="text-embedding-ada-002")

## 2. Search for most similar context

We then use the query vector to find the most similar context

    context = ds.to_table(
            nearest={
                "column": "vector",
                "k": 3,
                "q": query_vector
            }).to_pandas()

## 3. Create a prompt for the OpenAI completion API

LangChain and similar tools have lots of Prompt templates for your use case. For the task at hand, we create our own

            "Answer the question based on the context below.\n\n"+
            "Context:\n"

And we plug in the text from step 2 above into the context. We then use OpenAI again to get the answer

    def complete(prompt):
        # query text-davinci-003
        res = openai.Completion.create(
            engine='text-davinci-003',
            prompt=prompt,
            temperature=0,
            max_tokens=400,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            stop=None
        )
        return res['choices'][0]['text'].strip()

An example usage would look like:

    >> query = "who was the 12th person on the moon and when did they land?"
    >> complete(query)
    'The 12th person on the moon was Harrison Schmitt, and he landed on December 11, 1972.'

## Putting it all together

Remember our question was, “Which training method should I use for sentence transformers when I only have pairs of related sentences?” Using the steps outlined above, I get back:

“NLI with multiple negative ranking loss”

And since Lance allows you to retrieve additional columns easily, I can not only show the most relevant YouTube video, but start it at the right place in the video:
![](https://miro.medium.com/v2/resize:fit:770/1*vy3vdkL1aYOtH_a0OF1s_g.png)
# Conclusions

In this post, we saw how to use Lance as a critical component to power an LLM-based app. In addition, we went through an end-to-end workflow peeling back the covers. For these types of search workflows, Lance is a great fit because 1) it’s super easy to use for ANN, 2) it’s columnar so you can add a ton of additional features, and 3) it has [lightning fast random access](https://medium.com/etoai/benchmarking-random-access-in-lance-ed690757a826) speed so the index can be disk-based and extremely scalable.

If you’d like to give it a shot, you can find the [Lance repo on github](https://github.com/eto-ai/lance). If you like us, we’d really appreciate a ⭐️ and your feedback!

Special thanks to Rob Meng for inspiring this post
