---
title: Train Models Smarter and Faster
description: Train and fine-tune smarter and faster
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
    media: vectors/training-fine-tuning.svg # media for now can be svg of image
    #media_mob: if needed
  - type: features-grid
    bg_color: dark-700 # dark; naming from figma, by default "dark"
    style: columns # grid 
    title: Built for Complex Retrieval # optional field
    #description: optional field
    items:
      - icon: icons/database-backup.svg
        title: Named SQL Views
        text: Create reusable datasets for each model run. Manage experiments without duplicating data or rewriting queries.
        cta: 
          text: Geneva Docs
          icon: true
          href: /docs
          version: link
      - icon: icons/shapes.svg
        title: Blob Access Without Load
        text: Stream large files directly from cloud storage. Skip downloads and keep I/O costs low.
        cta: 
          text: Geneva Docs
          icon: true
          href: /docs
          version: link
      - icon: icons/chart-bar-stacked.svg
        title: Low Latency Prep
        text: Filter and shuffle data at training time. Keep preprocessing fast and GPUs fully utilized.
        cta: 
          text: Geneva Docs
          icon: true
          href: /docs
          version: link
      - icon: icons/arrow-down-up.svg
        title: 5M+ IOPS Cache Fleet
        text: High-throughput cache built for cost efficiency. Handle extreme concurrency with ease.
        cta: 
          text: Enterprise Docs
          icon: true
          href: /docs
          version: link
  - type: how-it-works-product
    bg_color: dark-700
    title: How It Works
    #description: oprional
    items: 
    - icon: icons/union.svg
      title: Connect to your Data Lake
      text: Ingest and index multimodal data directly from S3, GCS, Azure Blob, or on-prem storage—no migration headaches.
    - icon: icons/wave.svg
      title: Turn on your Lakehouse
      text: Leverage enterprise-grade performance, distributed I/O, and multimodal dataset management for training pipelines.
    - icon: icons/setup.svg
      title: Train and fine-tune at scale
      text: Feed optimized datasets into PyTorch, JAX, TensorFLow, or Hugging Face—enabling faster iteration and better models.
  - type: traine
    title: Train Anywhere
    description: Your stack can reset easy. LanceDB has a rich ecosystem and mature integrations.
    items: 
      - title: LanceDB Open Source
        icon: icons/opn-source.svg
        text: The foundation for AI-native data — open, blazing fast, and ready to build anywhere.
        content:
          type: logos
          logos: 
            - polars.svg
            - apache_spark_logo.svg
            - google_jax_logo.svg
            - tensorflow.svg
            - pytorch_logo_icon.svg
            - happy.svg
            - pandas.svg
        cta: 
          text: Available Integrations
          icon: true
          href: /docs
          version: link
      - title: LanceDB Enterprise
        icon: icons/private.svg
        text: A data platform without limits — advanced engines, enterprise security, and world-class support.
        content:
          type: list
          title: "Features include:"
          list: 
            - Multimodal SQL engine
            - Optimized training cache
            - Deploy on any cloud
            - Distributed data pre-processing engine
            - Dedicated infrastructure
            - Enterprise security
        cta: 
          text: Premium Feature List
          icon: true
          href: /docs
          version: link
  - type: related-content
    bg_color: dark
    title: Why leading AI teams train with LanceDB Enterprise
    no_padding_top: true
    posts: # Can be customizable or take all info from post page
      - path: "/blog/case-study-netflix" # all info from post
        cta_text: Read the Blog
      - path: /docs/reference # custom fields
        title: "Lance, Parquet, Iceberg: A Technical Comparison"
        image: /images/blog-thumb.jpg
        cta_text: Read the Lance Paper
  - type: testimonial
    title: Why leading AI teams train with LanceDB Enterprise
    text: “We checked lots of other solutions, and they all became exorbitantly expensive for datasets >100M embeddings. LanceDB was the only option that could store 1B embeddings with 100x lower cost and zero ops. That’s why we love LanceDB!”
    name: Chris Moody
    position: CTO & Co-founder
    logo: /logos/logoipsum.svg
  - type: logos
    no_padding_top: true
    speed: 5000
    text: Tomorrow's AI is being built on LanceDB today
    #logos: optional, by default will take logos from homepage
  - type: cta-product
    title: Train your models like your business depends on it.
    cta:
      text: Contact Us
      icon: true
      href: /contact
      version: primary
---
