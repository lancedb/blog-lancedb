---
title: "Introducing Lance Data Viewer: A Simple Way to Explore Lance Tables"
date: 2025-09-24
draft: true
featured: false
categories: ["Engineering"]
image: ""
meta_image: ""
description: "I wanted something similar for Lance: a way to browse tables, check schemas, and quickly look at what’s inside."
author: "Gordon Murray"
author_avatar: ""
author_bio: "Infrastructure Engineer with a passion for building on AWS and Terraform, and a growing interest in data engineering"
author_twitter: "gortron"
author_github: "gordonmurray"
author_linkedin: "gordonmurray"
---

As I’ve been learning Lance one thing I wanted was an easy way to see inside my datasets. Something like DataGrip but for Lance tables. That need led me to build the Lance Data Viewer, a lightweight open source web UI you can run in a container to browse your Lance datasets and view schemas.

## Getting Started with Lance

I first came across Lance through LinkedIn. What caught my attention was the idea of storing data in S3. Its scalable, low cost, and common in data lake architectures but I was curious whether S3-backed databases could operate quickly enough to be application or customerfacing.

Another feature that stood out was Lance’s ability to store vector data. I work with OpenSearch, and while powerful, it can be time-consuming to maintain: indexes, shards, latency tuning. I wondered whether Lance could avoid those challenges while still delivering fast search.

## Learning by Building

To explore Lance, I created a couple of small projects:

* Image search: A site to upload images, generate vector embeddings, and store them in Lance. I was able to search across the images immediately, without complicated pipelines or infrastructure.
* To-do list: A simple app where tasks and comments are stored in Lance with vectors. Related tasks naturally surfaced together, and performance stayed fast even when running on a small VM.

These projects showed me that Lance isn’t just for vectors it can store normal data like strings, numbers, and timestamps as well.

##  The Need for a Viewer

As I experimented more, I was creating multiple Lance tables. With relational databases, I was used to being able to open a viewer like DataGrip to review data. I wanted something similar for Lance: a way to browse tables, check schemas, and quickly look at what’s inside.

That’s how Lance Data Viewer started, simply as a tool to help me debug my own datasets.

![Lance Data Viewer Screenshot](/assets/images/lance_data_viewer_screenshot.png)

## What Lance Data Viewer Does Today

* List datasets in a folder
* Inspect schema (columns, types, version)
* Browse rows with pagination and column selection
* Compact previews for vectors - instead of showing hundreds of numbers, the viewer renders a small sparkline or heatstrip so you can spot anomalies visually
* Multiple Lance versions supported - originally it only worked with Lance 0.3.1, but I updated it so you can now pull container images for different Lance versions.

One challenge I encountered early was Lance version compatibility. Different versions of Lance use different data formats, which is why Lance Data Viewer supports multiple Lance versions through different container tags. If you're working with older datasets, you might need the lancedb-0.16.0 or lancedb-0.3.4 containers.

The app is deliberately minimal:

* Backend: Python FastAPI
* Frontend: plain HTML, CSS, and JS. No frameworks
* Containerized: run with Docker, mount a folder of Lance data, and open in your browser


```
docker pull ghcr.io/lancedb/lance-data-viewer:latest
docker run --rm -p 8080:8080 \
  -v /path/to/your/lance:/data:ro \
  ghcr.io/lancedb/lance-data-viewer:latest
```

## Community Feedback

When I first shared the viewer on LinkedIn, I was surprised at the response. A number of impressions and encouraging feedback from the community, including the Lance maintainers. That validation has been motivating: what started as a small debugging tool might actually fill a gap for others too.

## What’s Next

There are plenty of ideas I’d like to explore:

* Import/export support (CSV, Parquet, etc.)
* Human-friendly views of transactions and indexes
* Guidance on which indexes make sense as data grows
* More advanced vector visualizations for spotting issues in embeddings

For now, Lance Data Viewer is read-only, but even in this simple state it has already helped me understand my data and modernize older projects.

## Closing

I built the Lance Data Viewer out of necessity while learning Lance through my side projects. It’s now open source, containerized, and supports multiple versions of Lance.

If you work with Lance and need a way to explore your tables, give it a try I’d love to hear your feedback and ideas.