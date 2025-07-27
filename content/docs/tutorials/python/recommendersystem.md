---
title: "Recommender Systems with LanceDB"
sidebar_title: "Recommender Systems"
description: "Deliver personalized experiences by efficiently storing and querying item embeddings"
weight: 7
---

LanceDB's powerful vector database capabilities can efficiently store and query item embeddings. Recommender Systems can utilize it and provide personalized recommendations based on user preferences  and item features  and therefore enhance the user experience. 

| Tutorial | Description |
|:------------------|:------------|
| [Movie Recommender System](https://github.com/lancedb/vectordb-recipes/blob/main/examples/movie-recommender) | Use collaborative filtering to predict user preferences, assuming similar users will like similar movies, and leverage Singular Value Decomposition (SVD) from Numpy for precise matrix factorization and accurate recommendations |
| [Movie Recommendation with Genres](https://github.com/lancedb/vectordb-recipes/tree/main/examples/archived_examples/movie-recommendation-with-genres) | Creates movie embeddings using Doc2Vec, capturing genre and characteristic nuances, and leverages VectorDB for efficient storage and querying, enabling accurate genre classification and personalized movie recommendations through similarity searches |
| [Product Recommender using Collaborative Filtering and LanceDB](https://github.com/lancedb/vectordb-recipes/blob/main/examples/product-recommender) | Using Collaborative Filtering and LanceDB to analyze your past purchases, recommends products based on user's past purchases. Demonstrated with the Instacart dataset in our example |
| [Arxiv Search with OpenCLIP and LanceDB](https://github.com/lancedb/vectordb-recipes/blob/main/examples/arxiv-recommender) | Build a semantic search engine for Arxiv papers using LanceDB, and benchmarks its performance against traditional keyword-based search on Nomic's Atlas, to demonstrate the power of semantic search in finding relevant research papers |
| [Food Recommendation System](https://github.com/lancedb/vectordb-recipes/tree/main/examples/archived_examples/Food_recommendation) | Build a food recommendation system with LanceDB, featuring vector-based recommendations, full-text search, hybrid search, and reranking model integration for personalized and accurate food suggestions |
