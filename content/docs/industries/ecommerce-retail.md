---
title: "E-Commerce & Retail: Visual + Textual Product Search"
description: "Learn how LanceDB enables retailers to index product descriptions, customer reviews, product images, and demo videos for powerful visual and textual product search capabilities."
sidebar_title: "E-Commerce & Retail"
hide_toc: true
weight: 2
---

Retailers index product descriptions, customer reviews, product images, and demo videos. Shoppers can upload a photo of an item to find similar products, search by descriptive terms ("red running shoes with white sole"), or filter results by both visual match and textual metadata like brand or price.

## How LanceDB Works:

Sequence:
1. Product images, descriptions, and demo videos are ingested into LanceDB
2. Product metadata (SKU, price, brand, category) is stored in Lance tables
3. User processes content: OCR for packaging text, ASR for demo videos, voice query transcription
4. Content is segmented into product variants and video scenes
5. Vector embeddings are generated and stored for images and text content
6. QA-verified attributes, color corrections, and approved labels are applied

## Sample Lance Schema:

```json
{
  "table": "retail_catalog",
  "fields": [
    {"name": "product_id", "type": "string"},
    {"name": "title", "type": "string"},
    {"name": "brand", "type": "string"},
    {"name": "price", "type": "number"},
    {"name": "category", "type": "string"},
    {"name": "images", "type": "array<bytes>"},
    {"name": "image_mimes", "type": "array<string>"},
    {"name": "image_embeddings", "type": "array<array<number>>"},
    {"name": "demo_video", "type": "bytes"},
    {"name": "demo_video_mime", "type": "string"},
    {"name": "specs_text", "type": "string"},
    {"name": "reviews_text", "type": "array<string>"},
    {"name": "review_embeddings", "type": "array<array<number>>"},
    {"name": "variant_info", "type": "object"},
    {"name": "sparse_terms", "type": "object"},
    {"name": "attributes_normalized", "type": "object"}
  ]
}
```

## Data Transformation Pipeline

### Initial Data
Basic product information and media that retailers typically store.

E-commerce businesses start with fundamental product data that customers need for basic browsing and purchasing decisions. This includes essential details like product names, prices, brands, and basic images. 

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `product_id` | string | Unique product identifier | "SKU_789" |
| `title` | string | Product name | "Nike Air Max 270" |
| `brand` | string | Brand name | "Nike" |
| `price` | number | Product price | 129.99 |
| `category` | string | Product category | "Running Shoes" |
| `product_images` | array<bytes> | Raw product photos | JPEG binary data |
| `description` | string | Basic product description | "Comfortable running shoes..." |

While sufficient for simple catalog browsing, this raw data doesn't capture the rich visual and textual information that modern shoppers expect when searching for products. Retailers often have additional media assets like demo videos, detailed specifications, and customer reviews that aren't fully utilized in traditional search systems.

### Extracted Features
Enhanced information derived through AI processing and analysis.

AI-powered feature extraction transforms basic product data into rich, searchable information that dramatically improves the shopping experience. 

Computer vision models analyze product images to identify colors, textures, and visual characteristics. Natural language processing extracts insights from reviews and descriptions. Video analysis captures product demonstrations and usage scenarios. 

| Field | Type | Description | Source |
|-------|------|-------------|---------|
| `image_embeddings` | array<array<number>> | Vector representations of product images | Computer vision model |
| `color_analysis` | array<string> | Dominant colors detected | Image color extraction |
| `texture_features` | array<number> | Surface texture characteristics | Image texture analysis |
| `packaging_text` | string | Text extracted from product packaging | OCR processing |
| `video_embeddings` | array<array<number>> | Vector representations of demo videos | Video analysis model |
| `review_sentiment` | array<number> | Sentiment scores from reviews | NLP sentiment analysis |
| `attribute_vectors` | array<number> | Normalized product attributes | Feature normalization |
| `sparse_terms` | object | Keyword frequency from descriptions | TF-IDF extraction |

This enhanced data enables visual search (finding products by photo), semantic search (understanding natural language queries), and personalized recommendations based on visual preferences and past behavior.