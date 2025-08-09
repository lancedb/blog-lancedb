---
title: "Hospitality – Guest Experience and Operations Search"
description: "Learn how LanceDB enables hotels, resorts, and travel platforms to store and search property images, promotional videos, customer reviews, and service logs for powerful guest experience discovery."
sidebar_title: "Hospitality & Travel"
hide_toc: true
weight: 6
---

Hotels, resorts, and travel platforms store and search across property images, promotional videos, customer reviews, service logs, and audio feedback. A guest could search by describing a desired experience ("beachfront villa with private pool") to find matching rooms, or by uploading a photo of a resort to find similar destinations and relevant booking details.

## How LanceDB Works:

Sequence:
1. Property images, videos, menus, reviews, and service logs are ingested into the database
2. Property metadata (property ID, room ID, location, amenities) is captured and stored
3. Content processing begins: OCR for signage and menus, ASR for audio feedback, review parsing
4. Content is segmented into room types, amenity lists, review paragraphs, and video scenes
5. Vector embeddings are generated and stored for images, text, and video content
6. Staff-verified descriptions, tagged amenities, and updated media flags are applied

## Sample Lance Schema:

```json
{
  "table": "hospitality_experiences",
  "fields": [
    {"name": "property_id", "type": "string"},
    {"name": "room_id", "type": "string"},
    {"name": "location", "type": "string"},
    {"name": "amenities", "type": "array<string>"},
    {"name": "villa_image", "type": "bytes"},
    {"name": "villa_image_mime", "type": "string"},
    {"name": "trailer_video", "type": "bytes"},
    {"name": "trailer_video_mime", "type": "string"},
    {"name": "menu_pdf", "type": "bytes"},
    {"name": "menu_pdf_mime", "type": "string"},
    {"name": "reviews_text", "type": "array<string>"},
    {"name": "service_logs_text", "type": "array<string>"},
    {"name": "segments", "type": "array<object>"},
    {"name": "image_embeddings", "type": "array<array<number>>"},
    {"name": "text_embeddings", "type": "array<array<number>>"},
    {"name": "video_embeddings", "type": "array<array<number>>"},
    {"name": "sparse_terms", "type": "object"},
    {"name": "normalized_attributes", "type": "object"},
    {"name": "metadata", "type": "object"}
  ]
}
```

## Data Transformation Pipeline

### Initial Data
Basic property information and media that hospitality companies typically have.

Hospitality businesses maintain extensive collections of property information and media assets that are essential for marketing and guest decision-making but often underutilized for search and discovery. This includes property photos, promotional videos, restaurant menus, and basic amenity lists that guests rely on when choosing accommodations. While sufficient for basic property listings, this raw data doesn't capture the rich experiential details that modern travelers expect. Hotels and resorts often have additional content like guest reviews, service logs, and detailed amenity descriptions that could significantly enhance the booking experience if properly structured and searchable.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `property_id` | string | Unique property identifier | "PROP_123" |
| `room_id` | string | Room identifier | "ROOM_456" |
| `location` | string | Property location | "Miami Beach, FL" |
| `amenities` | array<string> | Basic amenity list | ["Pool", "WiFi"] |
| `property_images` | array<bytes> | Property photos | JPEG binary data |
| `promo_video` | bytes | Marketing video | MP4 binary data |
| `menu_pdf` | bytes | Restaurant menu | PDF binary data |

### Extracted Features
Enhanced guest experience insights derived through AI analysis.

AI-powered hospitality analytics transform basic property data into rich, searchable guest experience information that dramatically improves booking decisions and guest satisfaction. Computer vision models analyze property images to identify visual themes, room layouts, and amenity details. Natural language processing extracts insights from reviews, identifies guest preferences, and analyzes service feedback. Video analysis captures property ambiance, room tours, and experiential highlights. This transformation enables guests to find properties matching specific visual preferences, discover experiences through natural language queries, and receive personalized recommendations based on past behavior and preferences. The extracted features support dynamic pricing, targeted marketing, and enhanced guest service.

| Field | Type | Description | Source |
|-------|------|-------------|---------|
| `image_embeddings` | array<array<number>> | Vector representations of property images | Computer vision model |
| `text_embeddings` | array<array<number>> | Vector representations of reviews and text | NLP model |
| `video_embeddings` | array<array<number>> | Vector representations of promotional videos | Video analysis model |
| `experience_segments` | array<object> | Categorized guest experiences | Experience analysis |
| `sentiment_analysis` | array<number> | Guest satisfaction scores | Review sentiment analysis |
| `amenity_clusters` | array<object> | Grouped amenity categories | Amenity clustering |
| `seasonal_patterns` | array<object> | Booking and preference patterns | Temporal analysis |
| `sparse_terms` | object | Guest preference vectors | Preference TF-IDF |
