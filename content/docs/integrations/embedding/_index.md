---
title: "Embedding Providers"
description: "Supported embedding providers for LanceDB"
weight: 20
---

# Supported Embedding Providers and Models

LanceDB supports a wide range of embedding providers to help you generate vector embeddings for your data. Choose the provider that best fits your use case and requirements.

## Supported Providers

| Provider | Description |
|----------|-------------|
| **[OpenAI](/docs/embedding/openai)** | Text embedding models (text-embedding-ada-002, text-embedding-3-small, text-embedding-3-large) |
| **[Sentence Transformers](/docs/embedding/sentence-transformers)** | BERT-based sentence embedding models with mean pooling |
| **[VoyageAI](/docs/embedding/voyageai)** | Transformer-based text embedding models (voyage-large-2, voyage-code-2) |
| **[IBM](/docs/embedding/ibm)** | BERT-based text embedding models via Watson AI services |
| **[Instructor](/docs/embedding/instructor)** | Instruction-tuned BERT models for task-specific embeddings |
| **[Jina](/docs/embedding/jina)** | Multilingual BERT models optimized for semantic similarity |
| **[Ollama](/docs/embedding/ollama)** | Local inference of embedding models (nomic-embed-text, all-minilm) |
| **[AWS](/docs/embedding/aws)** | Titan text embedding models via Amazon Bedrock API |
| **[Cohere](/docs/embedding/cohere)** | Multilingual text embedding models (embed-english-v3.0, embed-multilingual-v3.0) |
| **[Gemini](/docs/embedding/gemini)** | Multimodal embedding models for text and image inputs |
| **[Hugging Face](/docs/embedding/huggingface)** | Access to transformer-based embedding models from Hugging Face Hub |
| **[OpenCLIP](/docs/embedding/openclip)** | CLIP-based multimodal models for text-image embeddings |
| **[ImageBind](/docs/embedding/imagebind)** | Unified embedding model for text, image, audio, video, depth, and thermal data |

## Getting Started

To use any of these embedding providers with LanceDB, you'll need to:

1. Install the required dependencies for your chosen provider
2. Set up authentication (if required)
3. Configure the embedding model in your LanceDB application

Each provider's documentation page contains specific setup instructions, code examples, and configuration options.
