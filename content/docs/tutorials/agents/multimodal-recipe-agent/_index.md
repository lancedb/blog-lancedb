---
title: "Multimodal Recipe Agent"
sidebar_title: "Recipe Agent"
description: "Build an AI agent that understands both text and images to help users find recipes using LanceDB and PydanticAI"
weight: 1
---

Learn how to build a sophisticated AI agent that can understand both text and images to help users discover recipes. This tutorial demonstrates how to combine LanceDB's multimodal capabilities with PydanticAI to create an intelligent recipe assistant.

## What You'll Build

### Colab Tutorial (Sample Data)
- **Interactive Learning**: Step-by-step notebook with sample recipes
- **Core Concepts**: Learn multimodal agent development
- **No Setup Required**: Run directly in your browser

### Full Demo Application (Real Dataset)
- **Complete Streamlit App**: Full chat interface with image upload
- **Real Recipe Dataset**: Thousands of actual recipes with images
- **Production Features**: Error handling, logging, and deployment considerations
- **Multimodal Search**: Both text and image-based recipe discovery

## Tutorial Overview

### Colab Tutorial (Quick Start)
Interactive notebook covering:
1. **Data Preparation**: Work with sample recipe data
2. **Embedding Generation**: Create text and image embeddings
3. **LanceDB Setup**: Store multimodal data efficiently
4. **Agent Development**: Build a PydanticAI agent with custom tools
5. **Testing**: Try the agent with sample queries

### Full Demo (Complete Application)
Complete codebase including:
1. **Real Dataset**: Download and process thousands of recipes
2. **Streamlit Interface**: Full chat application with image upload
3. **Production Features**: Error handling, logging, and monitoring
4. **Deployment Ready**: Complete with all necessary files

## Prerequisites

- Python 3.8+
- Basic understanding of vector databases
- Familiarity with AI agents (helpful but not required)

## Quick Start

### Option 1: Interactive Tutorial (Google Colab)
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1pxavAGoXa-KSh_4HxNpvP2AjHPcIRpbq?usp=sharing)

**Perfect for learning!** This Colab notebook provides a step-by-step tutorial with sample data. No setup required - just click and start learning about multimodal agents.

### Option 2: Full Demo Application (Local Setup)

#### Download the Complete Tutorial
[Download Tutorial Files](https://github.com/lancedb/blog-lancedb/tree/main/content/docs/tutorials/agents/multimodal-recipe-agent)

#### Setup Instructions
```bash
# 1. Extract the downloaded files to a folder
# 2. Navigate to the folder in terminal
cd multimodal-recipe-agent

# 3. Install dependencies with uv
uv sync

# 4. Download the Kaggle dataset
# Visit: https://www.kaggle.com/datasets/pes12017000148/food-ingredients-and-recipe-dataset-with-images
# Extract recipes.csv to the data/ folder

# 5. Import the dataset
uv run python import.py

# 6. Run the complete Streamlit chat application
uv run streamlit run app.py
```

**Complete experience!** This gives you the full Streamlit chat interface with a real recipe dataset. Requires downloading the dataset from Kaggle but provides the complete production-ready application.

### Dataset Information
- **Source**: [Kaggle Recipe Dataset](https://www.kaggle.com/datasets/pes12017000148/food-ingredients-and-recipe-dataset-with-images)
- **Size**: Thousands of recipes with images
- **Format**: CSV file with recipe data and image references

## Code Files

This tutorial includes complete, runnable code:

- **`multimodal-recipe-agent.ipynb`** - Interactive Jupyter notebook tutorial
- **`agent.py`** - Complete PydanticAI agent implementation
- **`app.py`** - Streamlit chat interface
- **`import.py`** - Data import and processing script
- **`pyproject.toml`** - Modern Python project configuration
- **`uv.lock`** - Locked dependency versions for reproducible builds
- **`README.md`** - Complete project documentation

## Folder Structure

When you download the tutorial, organize your files like this:

```
multimodal-recipe-agent/
├── multimodal-recipe-agent.ipynb  # Interactive tutorial
├── agent.py                       # Core agent implementation
├── app.py                         # Streamlit chat interface
├── import.py                      # Data processing script
├── pyproject.toml                 # Project configuration
├── uv.lock                        # Dependency lock file
├── README.md                      # Project documentation
└── data/                          # Generated data (created after import)
    ├── recipes.csv               # Recipe dataset
    ├── images/                   # Recipe images
    └── recipes.lance             # LanceDB database
```

## Key Technologies

- **LanceDB**: Multimodal vector database for efficient storage and retrieval
- **PydanticAI**: Modern AI agent framework with type safety
- **Sentence Transformers**: Text embeddings for semantic search
- **CLIP**: Vision-language model for image understanding
- **Streamlit**: Interactive web application framework

Ready to build your first multimodal AI agent? Let's get started!

[View Tutorial Notebook](./multimodal-recipe-agent.ipynb)

