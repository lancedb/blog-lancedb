---
title: Feature Engineering Without the Overhead
description: From Python to Petabytes, instantly
enableSwiper: true
sections:
  - type: hero-product
    # title: optional field
    # description: optional field
    cta:
      - text: Get Started
        icon: true
        href: https://accounts.lancedb.com/sign-up
        version: primary
      - text: Talk to Sales
        icon: true
        href: /contact
        version: secondary
    media: images/lakehouse.png
    media_mob: images/lakehouse-mob.png
  - type: code-product
    bg_color: dark-700
    title: Introducing LLM-as-UDF
    content:
      - heading: Custom Transformations at Scale
        text: Apply your own Python functions directly to multimodal datasets without exporting or duplicating data.
      - heading: Distributed Processing
        text: Run UDFs across large datasets in parallel using Ray or Spark, cutting feature generation time from days to hours.
      - heading: Inline Feature Creation
        text: Generate, update, and store new features right inside LanceDB for immediate use in training or analytics.
    code:
      language: python
      source: static/code-tabs/feature-engineering.py
  - type: features-grid
    bg_color: dark
    style: grid
    title: Key Features # optional field
    #description: optional field
    items:
    - icon: icons/pipeline.svg
      title: Declarative Pipelines
      text: Define workflows once and scale to 100K+ cores. No code changes needed to scale.
      cta: 
        text: Feature Docs
        icon: true
        href: /docs
        version: link
    - icon: icons/evolution-schema.svg
      title: Schema Evolution
      text: Add or change features without re-ingesting. Iterate on models with minimal engineering.
      cta: 
        text: Feature Docs
        icon: true
        href: /docs
        version: link
    - icon: icons/orchestra.svg
      title: Built-in Orchestration
      text: Preemption and cheeckpointing come standard. Keep training resilient without extra work.
      cta: 
        text: Feature Docs
        icon: true
        href: /docs
        version: link
    - icon: icons/scheduling.svg
      title: GP Scheduling
      text: Run jobs when GPUs are free or underused. Optimize for cost and throughput.
      cta: 
        text: Feature Docs
        icon: true
        href: /docs
        version: link
  - type: video
    bg_color: dark-700
    #description: optional
    video_id: 6SweXJhboTA
  - type: logos
    speed: 5000
    text: Tomorrow's AI is being built on LanceDB today
    #logos: optional, by default will take logos from homepage
  - type: testimonial
    text: “We checked lots of other solutions, and they all became exorbitantly expensive for datasets >100M embeddings. LanceDB was the only option that could store 1B embeddings with 100x lower cost and zero ops. That’s why we love LanceDB!”
    name: Chris Moody
    position: CTO & Co-founder
    logo: /logos/logoipsum.svg
  - type: cta-product
    title: Let your team focus on features, not infrastructure.
    cta:
      text: Contact Us
      icon: true
      href: /contact
      version: primary
---
