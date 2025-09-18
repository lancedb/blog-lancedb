---
title: "Multimodal Myntra Fashion Search Engine using LanceDB"
date: 2024-03-20
author: LanceDB
categories: ["Engineering"]
draft: false
featured: false
image: /assets/blog/multimodal-myntra-fashion-search-engine-using-lancedb/preview-image.png
meta_image: /assets/blog/multimodal-myntra-fashion-search-engine-using-lancedb/preview-image.png
description: "In this comprehensive guide, we aim to explain the process of creating a multi-modal search app and break it down into manageable steps."
---

In this comprehensive guide, we aim to explain the process of creating a multi-modal search app and break it down into manageable steps. The procedure involves several phases, including registering clip embeddings, setting up a data class and table, and executing a search query.

Using a vector database like LanceDB allows us to efficiently handle large volumes of data, paving the way for robust and efficient vector search. Clip embeddings, an integral part of our process, convert the images into embeddings that can be recognized by the vector database.

We'll also create a Streamlit app, which offers a more user-friendly GUI to access and use the search engine.

By the end of this blog, you should have a clear understanding of how to use LanceDB to create your own search engine, regardless of your dataset or use case. With LanceDB, you can see how simple it is to set up and query a vector database. Most of the boilerplate code is handled by LanceDB itself. Let's dive in.

To create the search engine, these are the steps we will be following -

1. **Define the Embedding Function** - We will use OpenAI CLIP to create the embeddings using `EmbeddingFunctionRegistry` for the images.
2. **Define the Schema** - We define the table schema.
3. **Create the Table** - We create the vector database using the embedding function and schema.
4. **Search the Query** - We can now do a multimodal vector search in the database.
5. **Streamlit App** - For a GUI

### Downloading the data

First, we will download the [Myntra Fashion Product Dataset](https://www.kaggle.com/datasets/hiteshsuthar101/myntra-fashion-product-dataset) from Kaggle and store it in the `input` folder. The folder shall contain the `Images` directory along with the `Fashion Dataset.csv` file. The dataset contains about 14.5K images, for the purpose of this blog we only take a 1000 samples out of it. For a more comprehensive search, you can increase the number of samples.

### 1. Register Clip EmbeddingTo store

g the images in the form of a vector database, we first need to convert it to an embedding. There are many ways to do it within LanceDB.

LanceDB supports 3 methods of working with embeddings.

1. You can manually generate embeddings for the data and queries. This is done outside of LanceDB.
2. You can use the built-in [embedding functions](https://lancedb.github.io/lancedb/embeddings/embedding_functions/) to embed the data and queries in the background (this is explained below)
3. For Python users, you can define your own [custom embedding function](https://lancedb.github.io/lancedb/embeddings/custom_embedding_function/)Python users can define their own custom embedding function, which extends the default embedding function.

For this project, we use the embedding function. We define a global embedding function registry with the OpenAI CLIP Model. With the EmbeddingFunctionRegistry function, you can generate the embeddings easily with just a few lines of code and do not need to worry about the boilerplate code.

    from lancedb.embeddings import EmbeddingFunctionRegistry

    def register_model(model_name):
        registry = EmbeddingFunctionRegistry.get_instance()
        model = registry.get(model_name).create()
        return model

### 2. Define the Schema

This embedding function defined above abstracts all the details about the models and dimensions required to define the schema. A schema basically tells LanceDB the structure of the table.

For this project, we will define the schema with two fields -

1. Vector Field - `VectorField` tells LanceDB to use the clip embedding function to generate query embeddings for the `vector` column
2. Source Field - `SourceField` ensures that when adding data, we automatically use the specified embedding function to encode `image_uri`

    from PIL import Image
    from lancedb.pydantic import LanceModel, Vector

    clip = register_model("open-clip")

    class Myntra(LanceModel):
        vector: Vector(clip.ndims()) = clip.VectorField()
        image_uri: str = clip.SourceField()

        @property
        def image(self):
            return Image.open(self.image_uri)

### 3. Create Table

Now that we have our embedding function and schema, we will create the table.

    import lancedb
    import pandas as pd
    from pathlib import Path
    from random import sample
    import argparse

    def create_table(database, table_name, data_path, schema=Myntra, mode="overwrite"):

        # Connect to the lancedb database
        db = lancedb.connect(database)

        # Check if the table already exists in the database
        if table_name in db:
            print(f"Table {table_name} already exists in the database")
            table = db[table_name]

        # if it does not exist then create a new table
        else:

            print(f"Creating table {table_name} in the database")

            # Create the table with the given schema
            table = db.create_table(table_name, schema=schema, mode=mode)

            # Define the Path of the images and obtain the Image uri
            p = Path(data_path).expanduser()
            uris = [str(f) for f in p.glob("*.jpg")]
            print(f"Found {len(uris)} images in {p}")

            # Sample 1000 images from the data
            # Select more samples for a wider search
            uris = sample(uris, 1000)

            # Add the data to the table
            print(f"Adding {len(uris)} images to the table")
            table.add(pd.DataFrame({"image_uri": uris}))
            print(f"Added {len(uris)} images to the table")

One thing to note is that you do not need to create the embeddings separately when using the embedding function; LanceDB takes care of that automatically.

### 4. Search Query

Now you can open and query the table

    # Connect to the Database and open the table
    db = lancedb.connect("~/.lancedb")
    table = db.open_table(table_name)

The OpenCLIP query embedding function supports querying via both text and images. We will make this project multimodal by providing text and image search.

    def run_vector_search(database, table_name, schema, search_query, limit=6, output_folder="output"):
        if os.path.exists(output_folder):
            for file in os.listdir(output_folder):
                os.remove(os.path.join(output_folder, file))
        else:
            os.makedirs(output_folder)

        db = lancedb.connect(database)
        table = db.open_table(table_name)
        rs = table.search(search_query).limit(limit).to_pydantic(schema)

        for i in range(limit):
            image_path = os.path.join(output_folder, f"image_{i}.jpg")
            rs[i].image.save(image_path, "JPEG")

### Streamlit App

Once this is done, we create a streamlit app to build an interface.

    import os
    import argparse
    import streamlit as st
    from PIL import Image

    def main(args):
        # Define the title and sidebar options
        st.sidebar.title('Vector Search')
        table_name = st.sidebar.text_input('Name of the table', args.table_name)
        search_query = st.sidebar.text_input('Search query', args.search_query)
        limit = st.sidebar.slider('Limit the number of results', args.limit_min, args.limit_max, args.limit_default)
        output_folder = st.sidebar.text_input('Output folder path', args.output_folder)

        # Image Based Search
        # Add an option for uploading an image for query
        uploaded_image = st.sidebar.file_uploader('Upload an image')
        if uploaded_image is not None:
            image = Image.open(uploaded_image)
            st.sidebar.image(image, caption='Uploaded Image', use_column_width=True)
            search_query = image  # Set the search query as the uploaded image

        # Run the vector search when the button is clicked
        if st.sidebar.button('Run Vector Search'):
            run_vector_search("~/.lancedb", table_name, Myntra, search_query, limit, output_folder)

        # Initialize session state for image index if it doesn't exist
        if 'current_image_index' not in st.session_state:
            st.session_state.current_image_index = 0

        # Display images in output folder
        if os.path.exists(output_folder):
            image_files = [f for f in os.listdir(output_folder) if f.endswith('.jpg') or f.endswith('.png')]
            if image_files:
                # Ensure the current index is within the bounds of available images
                num_images = len(image_files)
                st.session_state.current_image_index %= num_images
                image_file = image_files[st.session_state.current_image_index]
                image_path = os.path.join(output_folder, image_file)
                image = Image.open(image_path)
                st.image(image, caption=image_file, use_column_width=True)

                # Navigation buttons for previous and next images
                col1, col2 = st.columns(2)
                with col1:
                    if st.button('Previous'):
                        st.session_state.current_image_index = (st.session_state.current_image_index - 1) % num_images
                with col2:
                    if st.button('Next'):
                        st.session_state.current_image_index = (st.session_state.current_image_index + 1) % num_images
            else:
                st.write("No images found in the output folder.")

**Conclusion**

In conclusion, using LanceDB to create a multimodal fashion search engine for Myntra simplifies the process and improves efficiency. By taking advantage of capabilities such as vector search, automatic handling of embeddings, and the capacity to handle large volumes of data, we can streamline the development process and create a powerful tool for fashion search. Whether you're a seasoned programmer or a beginner, this guide offers a comprehensive walkthrough of the process, making it accessible. It underlines the power and simplicity of using LanceDB and serves as a stepping stone for creating your own search engines for different datasets or use cases.

### Code:

- [GitHub Repository](https://github.com/ishandutta0098/lancedb-multimodal-myntra-fashion-search-engine)

[

Google Colab

![](https://ssl.gstatic.com/colaboratory-static/common/005460c8a91a7de335dec68f82b6f6e5/img/favicon.ico)

![](https://colab.research.google.com/img/colab_favicon_256px.png)
](https://colab.research.google.com/drive/1qnaNasUy6aJOcaUYw9lMX_s4SWWGq3jY?usp=sharing)
### Queries:

For queries and doubts, you can reach out to me on

- [LinkedIn](https://www.linkedin.com/in/ishandutta0098/)
- [Twitter](https://x.com/ishandutta0098)
