---
title: "Vector Arithmetic with LanceDB: an Intro to Vector Embeddings"
date: 2024-07-02
author: Artitra Roy Gosthipaty
categories: ["Community"]
draft: false
featured: false
image: /assets/blog/vector-arithmetic-with-lancedb-an-intro-to-vector-embeddings/preview-image.png
meta_image: /assets/blog/vector-arithmetic-with-lancedb-an-intro-to-vector-embeddings/preview-image.png
description: "Build about vector arithmetic with lancedb: an intro to vector embeddings. Get practical steps, examples, and best practices you can use now."
---

💡

This is a community post by "Artitra Roy Gosthipaty"

## Introduction

Imagine living your life chained in a cave, facing a blank wall. The only things you see are shadows projected onto the wall by objects passing in front of a fire behind you.
![](__GHOST_URL__/content/images/2024/06/plato.webp)Plato's Allegory of the Cave ([Source](https://www.thoughtco.com/the-allegory-of-the-cave-120330))
This imagery is derived from [Plato's Allegory of the Cave](https://en.wikipedia.org/wiki/Allegory_of_the_cave), a profound philosophical story. Though it may seem dark and confined, it carries a deeper meaning. The shadows you see are mere abstractions, simplified versions of objects that are far richer and more complex in reality.

In a similar way, **embeddings** can be thought of as entities that provide a rich representation of the data we encounter in our everyday lives. They transform *complex*, *high-dimensional* data into a **simpler**, more **meaningful** form, allowing us to understand and manipulate it more effectively.

In the later sections of this tutorial, we'll conduct exciting experiments to demonstrate the power of embeddings. We'll start with semantic searches within our dataset, showcasing how to retrieve relevant results effortlessly.

    query = "people smiling"

![](__GHOST_URL__/content/images/2024/06/data-src-image-16b71471-0f63-4851-a700-cb4cc2b50e01.png)
    query = "cars on street"

![](__GHOST_URL__/content/images/2024/06/data-src-image-04168333-dd70-407e-b0a2-70cea0bb1c72.png)
Additionally, we'll create a prompt, performing vector arithmetic to subtract an object from the prompt and add a different object in its place, and explore the fascinating outcomes in the embedding space. These experiments will highlight the versatility and strength of embeddings in various practical applications.

    query = "many people happy"
    sub_query = "happy"
    rep_query = "sad"

![](__GHOST_URL__/content/images/2024/06/data-src-image-e89cc7c7-e6e9-46c2-8eb3-89896184d319.png)
    query = "many people happy"
    sub_query = "many people"
    rep_query = "single man"

![](__GHOST_URL__/content/images/2024/06/data-src-image-24441821-28ca-4dba-8802-ab6dad217d55.png)
In this tutorial, we will cover the following:

1. **What** are embeddings?
2. **How** do I store embeddings?
3. **Why** are they important?

## What are embeddings?

Embeddings are numerical representations (vectors or tensors) of data, often used in machine learning and deep learning to transform complex, high-dimensional information into a more *manageable* form.
![](__GHOST_URL__/content/images/2024/06/meme.jpg)Vectors or Tensors?
In deep learning (DL), embeddings are typically learned by neural networks, capturing the underlying relationships and patterns within the data. For example, in natural language processing (NLP), **word embeddings** convert words into dense vectors where similar words have similar vector representations.

This allows the model to understand semantic relationships between words, such as "king" and "queen" being related to royalty, or "Paris" and "France" being connected by geography.

Similarly, in the world of images, embeddings can represent images in a way that captures visual similarity, enabling tasks like *image search* or *clustering* similar images together.

### Text Embedding

Let's understand embeddings with code. For this tutorial we will be using the [SentenceTransformers](https://sbert.net/) library. It provides us with a number of embedding models. Luckily, LanceDB has an integration with SentenceTransformers, which makes our lives easier.

We first install and import our necessary libraries.

    $ pip install -U -q sentence-transformers
    $ pip install -U -q lancedb

Install the necessary packages

    import torch
    from lancedb.embeddings import get_registry

    DEVICE = "cuda:0" if torch.cuda.is_available() else "cpu"

Import libraries and set device

Here we build a utility function `get_embedding`. The function accepts text, and outputs the embedding of the text.

    def get_embedding(text):
        embedding = embedding_model.embedding_model.encode(
            text, convert_to_tensor=True
        ).cpu().numpy()
        return embedding

We have our setup ready. The one thing that we are missing is our embedding model. We will grab our model from the LanceDB integration. We will be using the `all-mpnet-base-v2` model for our use case, feel free to use any other model that you like.

> To know more about LanceDB and embedding refer to their [official documentation](https://lancedb.github.io/lancedb/embeddings/embedding_functions/).

    embedding_model = (
        get_registry()
        .get("sentence-transformers")
        .create(name="all-mpnet-base-v2", device="cuda:0")
    )

Let's take our embedding model for a ride, shall we? We will take three texts and compute the semantic distance between them.

> Semantic meaning changes with the task and dataset with which the model was trained. You might find some texts to be semantically similar which are not supposed to be. Now you know why.

    text1 = "king"
    text2 = "queen"
    text3 = "apple"

    embedding1 = get_embedding(text1)
    embedding2 = get_embedding(text2)
    embedding3 = get_embedding(text3)

    print(f"Similarity between `{text1}` and `{text2}`: {embedding1.dot(embedding2):.2f}")
    print(f"Similarity between `{text1}` and `{text3}`: {embedding1.dot(embedding3):.2f}")

Similarity between `king` and `queen`: 0.63 Similarity between `king` and `apple`: 0.21

## Ingest embeddings in LanceDB

Storing vector embeddings efficiently is crucial for leveraging their full potential in various applications. To **manage**, **query**, and **retrieve** embeddings effectively, especially when dealing with large-scale and multi-modal data, you need a robust solution.

LanceDB is an open-source vector database specifically designed for this purpose. It allows you to store, manage, and query embeddings, making it easier to integrate them with your data.

We will be taking LanceDB for a spin on our multi-modal dataset, and understand how to perform vector arithmetic with the embeddings.

    import os
    import io
    import lancedb
    import pandas as pd
    import pyarrow as pa
    from PIL import Image
    from matplotlib import pyplot as plt
    from lancedb.pydantic import LanceModel, Vector

## Multi-Modal Dataset

We will be working with the [Flickr-8k](https://paperswithcode.com/dataset/flickr-8k) dataset. It is a multi modal dataset, which consists of images and their corresponding captions.

I have used the [Kaggle dataset](https://www.kaggle.com/datasets/adityajn105/flickr8k) rather than downloading from source as I found it to be programatically more feasible. Just follow along to download the dataset.

    $ kaggle datasets download -d adityajn105/flickr8k
    $ unzip -q flickr8k.zip

> If you face any problem with the Kaggle API please refer to their [official documentation](https://www.kaggle.com/docs/api).

    IMAGE_DIR = "/content/Images"
    ANNOTATION_FILE = "/content/captions.txt"

Detour: The Flickr-8k dataset consists of `5` captions per image. I found it to be more efficient to group all the captions together for an image. This decreases the number of rows in the dataset. You can skip this section, and follow along with the original dataset too.

    df = pd.read_csv(ANNOTATION_FILE)
    df = df.groupby("image")["caption"].apply(list).reset_index(name="caption")
    df["caption"] = df["caption"].apply(lambda x: " ".join(x))

## Understanding the Schema

In any database, a schema defines the **structure** and **organization** of the data, specifying how data is stored, accessed, and managed. In the context of a vector database, the schema becomes particularly important as it needs to accommodate not just traditional data types but also complex structures like vector embeddings.

Consider the following code example, which defines a schema for storing image embeddings along with related data:

    class Schema(LanceModel):
        vector: Vector(embedding_model.ndims()) = embedding_model.VectorField()
        image_id: str
        image: bytes
        captions: str = embedding_model.SourceField()

Here, the schema is defined using a custom model class `Schema`. The `pa_schema` specifies the data types for each field:

- `vector`: A list of `768` float32 values representing the embedding vector.
- `image_id`: A string identifier for the image.
- `image`: Binary data representing the image itself.
- `captions`: A string containing descriptive text about the image.

The custom `Schema` class, inheriting from `LanceModel`, further organizes these fields. It uses a `Vector` type for the embedding vector, ensuring it aligns with the dimensions of the model's output. The `image_id` is a string, `image` is stored as bytes, and `captions` are linked to the source field of the embedding model.

## Ingesting Data into the Database

This section of the code is responsible for processing and ingesting the dataset into LanceDB. Let's break down the code and understand this approach:

    def process_dataset(dataset):
        for idx, (image_id, caption) in enumerate(dataset.values):
            try:
                with open(os.path.join(IMAGE_DIR, image_id), "rb") as image:
                    binary_image = image.read()

            except FileNotFoundError:
                print(f"image_id '{image_id}' not found in the folder, skipping.")
                continue

            image_id = pa.array([image_id], type=pa.string())
            image = pa.array([binary_image], type=pa.binary())
            caption = pa.array([caption], type=pa.string())

            yield pa.RecordBatch.from_arrays(
                    [image_id, image, caption],
                    ["image_id", "image", "captions"]
                )

This function, `process_dataset`, iterates through each entry in the dataset, reads the corresponding image file, and converts it into a **binary** format. If the image file is not found, it skips that entry.

It then creates arrays for the `image_id`, `image`, and `caption` fields and yields a `RecordBatch` containing these arrays. This batch processing is efficient for ingesting large datasets without running out of memory or creating many versions of dataset.

    db = lancedb.connect("embedding_dataset")
    tbl = db.create_table("table", schema=Schema, mode="overwrite")
    tbl.add(process_dataset(df))

Here, the code connects to or create a local LanceDB database connection named `embedding_dataset` and creates a table with the defined Schema. The `mode="overwrite"` ensures that any existing table with the same name is replaced. The `tbl.add(process_dataset(df))` line then adds the processed dataset to the table.

## Why This is a Good Practice

1. **Centralized Storage for all your data, not just vectors**: Everything—images, text, and embeddings—is stored in one place, with a defined schema, making it easier to manage and query. This centralized approach simplifies data handling and enhances efficiency.
2. **Automated Encoding**: LanceDB embedding API handles the encoding of data, eliminating the need for manual encoding. This reduces the chances of errors and ensures consistency across the dataset.
3. **Efficiency**: LanceDB consumes data as `RecordBatch` iterators in one go without creating multiple versions. It is recommended for ingesting large datasets, specifically larger-than-memory datasets.

## Semantic Search Made Simple

Semantic search is a powerful technique that allows us to **retrieve** data based on the meaning and context of the search query, rather than relying solely on keyword matching. This is particularly useful in scenarios where we want to find images, documents, or other data types that are semantically similar to a given query.

Manually implementing semantic search would be a complex and daunting task. It would require extensive work to encode both the search query and the dataset into a comparable format, and then efficiently compare them to find the most relevant results. This involves dealing with high-dimensional vector operations, managing large datasets, and ensuring that the comparisons are both accurate and performant.

With LanceDB, performing semantic search is pretty straightforward. The API design is intuitive.  Let's take a look at the following example:

    def show_image(image):
        stream = io.BytesIO(image)
        plt.imshow(Image.open(stream))
        plt.axis("off")
        plt.show()

Utility for images

    query = "dog running through sand"

    hit_lists = tbl.search(query) \
        .metric("cosine") \
        .limit(2) \
        .to_list()

    for hit in hit_lists:
        show_image(hit["image"])

![](__GHOST_URL__/content/images/2024/06/data-src-image-81dc5ee5-6b4f-47bb-aa31-234be2d6c18a.png)![](__GHOST_URL__/content/images/2024/06/data-src-image-3e82d66b-554e-4caa-831d-472ef22c6a7d.png)
In this code, we perform a semantic search for the query `"dog running through sand"`. The search function leverages LanceDB's capability to handle embeddings efficiently:

- **Encoding the Text**: Only the text query needs to be encoded. The embedding API takes care of converting it into the appropriate vector representation.
- **Performing the Search**: The `tbl.search(query)` method initiates the search, and by chaining methods like `.metric("cosine")` and `.limit(2)`, we specify the search criteria. Cosine similarity is used as the metric to find the most similar embeddings, and the results are limited to the top 2 hits.
- **Retrieving and Displaying Results**: The results are then converted to a list with `.to_list()`, and we loop through the hits to display the corresponding images.

This process is almost **instantaneous**, demonstrating the efficiency and elegance of LanceDB. The seamless integration of search capabilities with data storage ensures that you can quickly and effectively retrieve the most relevant data based on semantic meaning. LanceDB's design abstracts away the complexities, providing a user-friendly interface to perform powerful semantic searches with ease.

## Vector Arithmetic in Action

Get ready to be amazed! We're taking semantic search to the next level by performing vector arithmetic on embeddings. This approach allows us to manipulate the embeddings in ways that capture complex relationships and nuances in the data, bringing some truly exciting possibilities to life.

Let's dive into the code and see this in action:

    query = "dog running through sand"
    sub_query = "dog"
    rep_query = "human"

    query_emb = get_embedding(query)
    sub_query_emb = get_embedding(sub_query)
    rep_query_emb = get_embedding(rep_query)

    emb = query_emb - sub_query_emb + rep_query_emb

    hit_lists = tbl.search(emb) \
        .metric("cosine") \
        .limit(6) \
        .to_list()

    for hit in hit_lists:
        show_image(hit["image"])

![](__GHOST_URL__/content/images/2024/06/data-src-image-b785a4d5-51a5-4008-9c9a-61fe4fced8e9.png)

![](__GHOST_URL__/content/images/2024/06/data-src-image-7dd39e33-cd00-4a25-a1ab-aaae6f7372ec.png)

![](__GHOST_URL__/content/images/2024/06/data-src-image-e9ce45a7-7889-4f48-987c-08b3b71e858e.png)

![](__GHOST_URL__/content/images/2024/06/data-src-image-3275a95d-30dd-4851-852b-d55a7487e8f4.png)

![](__GHOST_URL__/content/images/2024/06/data-src-image-f2241563-1c7e-4cf6-8cfb-4faa76763304.png)

![](__GHOST_URL__/content/images/2024/06/data-src-image-800fb529-fd54-494d-9850-d47506c29e74.png)

    query = "many people happy"
    sub_query = "many people"
    rep_query = "single man"

    query_emb = get_embedding(query)
    sub_query_emb = get_embedding(sub_query)
    rep_query_emb = get_embedding(rep_query)

    emb = query_emb - sub_query_emb + rep_query_emb

    hit_lists = tbl.search(emb) \
        .metric("cosine") \
        .limit(6) \
        .to_list()

    for hit in hit_lists:
        show_image(hit["image"])

![](__GHOST_URL__/content/images/2024/06/data-src-image-fcfe6ce6-eb78-4ee9-aac7-92a8eb0b652c.png)

![](__GHOST_URL__/content/images/2024/06/data-src-image-15ec8c4c-781c-4da6-b26a-76d4725c118c.png)

![](__GHOST_URL__/content/images/2024/06/data-src-image-5f388a46-0b55-4b31-b121-ab086abb7b70.png)

![](__GHOST_URL__/content/images/2024/06/data-src-image-1a071274-a6cd-467d-ba93-55e0c8a8c138.png)

![](__GHOST_URL__/content/images/2024/06/data-src-image-7ef5f6f9-1e9f-45c3-92b5-bd70ed1058f4.png)

![](__GHOST_URL__/content/images/2024/06/data-src-image-aedccc6e-65a7-4f35-857b-fe208a0a397a.png)

In this example, we start with a query, "dog running through sand", and create embeddings for this query, a sub-query "dog", and a replacement query "human".

By performing the arithmetic operation `query_emb - sub_query_emb + rep_query_emb`, we effectively transform our original query into a new one. This operation intuitively means: replace "dog" with "human".

## Conclusion

Congratulations on making it through this tutorial on vector arithmetic using text embeddings! We've explored the fascinating world of embeddings, understanding their significance in deep learning and how they transform complex data into meaningful vectors.

We've seen how LanceDB, with its powerful and elegant design, simplifies the process of storing, managing, and querying these embeddings, making sophisticated tasks like semantic search and vector arithmetic both accessible and efficient.

Thank you for following along, and happy embedding!
