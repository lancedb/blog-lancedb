---
title: Scalable Computer Vision with LanceDB & Voxel51
date: 2023-07-13
draft: false
featured: false
image: /assets/posts/1.png
description: Explore scalable computer vision with lancedb & voxel51 with practical insights and expert guidance from the LanceDB team.
author: Ayush Chaurasia
---
# Importance of dataset analysis in CV

Dataset analysis is an essential step in any computer vision project. It allows us to understand the data that we are working with, identify any potential problems, and make sure that the data is as representative as possible of the real world. This is especially important once the model architecture is fixed due to deployment constraints, as the best way to improve performance is via iteration on datasets.

Voxel51 is a set of open-source tools for computer vision. The FiftyOne query language allows you to explore and analyze your data in a variety of ways. You can use the query language to find specific images, objects, or features.

With this integration with LanceDB, Voxel51 can leverage its fast, robust and setup-free vector search capabilities.
![](https://miro.medium.com/v2/resize:fit:770/1*RFtus4W8XVeoG0Bc08IHdg.jpeg)
# LanceDB: The serverless vectorDB

LanceDB is an open-source, serverless, and a multi-modal vector database.

- It is built with persistent storage, which greatly simplifies retrieval, filtering and management of embeddings.
- It support for vector similarity search, full-text search and SQL.
- Native support for Javascript/Typescript

To enable the lancedb backend in voxel51, simply pass `backend="lancedb"` in supported operations

    import fiftyone.brain as fob
    
    fob.compute_similarity(
        ...
        backend="lancedb",
    )

# **Example use cases**

## Sort dataset by similarity
![](https://miro.medium.com/v2/resize:fit:770/1*WIKrLZEtkYGwlXaCDdctJQ.gif)
## Get similar images to a given id

    import fiftyone as fo
    import fiftyone.brain as fob
    
    fob.compute_similarity(
        ...
        backend="lancedb",
    )
    id = dataset.first().id
    view = dataset.sort_by_similarity(id, k=30)
    
    session = fo.launch_app(view)
    session.wait()

## Search by Text queries

    query = "a photo of a dog"
    view = dataset.sort_by_similarity(query, k=10, brain_key="lancedpb_index")

The integration allows various customizations that can be found in the docs.

## LanceDB interface integrates into the Python data ecosystem

LanceDB is compatible with python data ecosystem and can be used with pandas, numpy, and arrow.

    lancedb_index = fob.compute_similarity(…)
    table = lancedb_index.table
    
    # Integration with Python data ecosystem
    df = table.to_pandas() # get the table as a pandas dataframe
    pa = table.to_arrow() # get the table as an arrow table

More use cases and examples using voxel51 with LanceDB backend are available in the [integration docs](https://docs.voxel51.com/integrations/lancedb.html#lancedb-integration).

Visit LanceDB [repo](https://github.com/lancedb/lancedb) and [docs](https://lancedb.github.io/lancedb/) to see more examples and integration.
