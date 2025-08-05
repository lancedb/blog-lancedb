# Embedded Medical assistant with GPT-OSS and LanceDB hybrid search

A Retrieval-Augmented Generation (RAG) application that uses GPT-OSS-20B via Ollama to answer medical research questions based on PubMed abstracts retrieved using LanceDB hybrid search

## Overview

This application creates a medical research assistant that can answer questions by searching through 10,000 PubMed abstracts. It uses LanceDB for vector storage and semantic search, combined with GPT-OSS-20B for generating responses.

## Setup

1. Install dependencies:
```bash
uv pip install -r requirements.txt
```

2. Run the ingestion script to create the vector database:
```bash
python ingest.py
```

3. Start the Streamlit application:
```bash
streamlit run rag_app.py
```

## Usage

1. Open the application in your browser
2. Select a search mode:
   - **Hybrid**: Best of both worlds (recommended)
   - **Vector**: Semantic similarity search
   - **Full-Text**: Exact keyword matching
3. Enter your medical research question
4. View the AI-generated response and source abstracts

## Tools used

- **Vector Database**: LanceDB with PubMed abstracts
- **Embedding Model**: all-MiniLM-L6-v2 for text embeddings
- **LLM**: GPT-OSS-20B for response generation
- **UI**: Streamlit for web interface
