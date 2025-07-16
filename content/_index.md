---
title: The Single Source of Truth for All Your AI Data
description: From agents to models, from search to training, one platform for all your AI data and workloads
hero:
  cta:
    - text: Get started
      icon: true
      href: /contact
      version: primary
    - text: Discover more
      icon: true
      href: "#"
      version: secondary
  vector: static/assets/vectors/hero-bg.svg
logos:
  speed: 3000
  caption: Tomorrow's AI is being built on LanceDB today
  items: # all icons for logos should be in static/assets/logos
    - runway.svg 
    - midjourney.svg
    - worldlabs.svg
    - characterai.svg
    - bytedance.svg
    - harvey.svg
    - ubs.svg
lakehouse:
  title: The AI-Native <br> Multimodal Lakehouse
  description: AI thrives on more than text. It needs multimodal data. Today’s complex workloads demand more than a database. They need a new foundation built for AI at scale.
  image: images/lakehouse.png
  image_mob: images/lakehouse-mob.png
  image_alt: Multimodal Lakehouse
  interact: static/assets/vectors/lakehouse.svg
  interact_mob: static/assets/vectors/lakehouse-mob.svg
infrastructure:
  title: AI Needs Better <br> Data Infrastructure
  description: Data lakes only handle tabular data, search engines just work with vectors, andneither work well with multimodal data. Researchers using today'sinfrastructure face more complexity, higher cost, and slower progress.
  badges:
    - icon: binary.svg
      text: Chunking
    - icon: database.svg
      text: Vector storage
    - icon: apps.svg
      text: Model training
    - icon: search.svg
      text: Hybrid search
    - icon: folder-dev.svg
      text: Embedding pipelines
    - icon: stack.svg
      text: Multimodal data
    - icon: code.svg
      text: Ad-hoc scripts
solution:
  title: A Unified Solution
  description: LanceDB provides one place for all your AI data and workloads so your team can move fast from idea to petabyte-scale production.
  speed: 7000
  code:
    language: python
    source: static/code-tabs/tabs.py
  items:
    - tab: Storage
      title: The new columnar standard for multimodal data
      description: Fast scans and random access. Large blob storage. Zero-copy fine-grained data-evolution at petabyte scale
      code: 
    - tab: Search
      title: Advanced retrieval for AI
      description: Blazing fast hybrid search, filter, and rerank over billions of vectors. Compute-storage separation for up to 100x savings.
      code:
    - tab: Feature Engineering
      title: Automated feature engineering
      description: Declarative, distributed and versioned pre-processing for faster feature experimentation and iteration cycles. Native support for LLM-as-UDF.
      code:
    - tab: Analytics
      title: Explore, curate, and analyze with ease
      description: High performance SQL for multimodal data.
      code:
    - tab: Training
      title: Optimized training pipelines
      description: Faster dataloading, global shuffling, and integrated filters for large scale training using pytorch or JAX.
      code: 
  cta: 
    href: "#"
    icon: true
    version: primary
    text: Create your first project
how_it_works:
  title: How It Works
  description: Whatever your needs, we know how to make things work better.
  items:
    - title: For Developers
      list:
        - heading: Connect to LanceDB
          text: Get started fast with a simple install and intuitive interface
          icon: union.svg
        - heading: Ingest Data
          text: Streamline your workflow and focus on high-value experimentation
          icon: data.svg
        - heading: Build and Index
          text: Easily scale from megabytes to petabytes—without complexity
          icon: index.svg
      cta:
        text: Try LanceDB Cloud
        href:
        version: primary
        icon: true
    - title: For Enterprises
      list:
        - heading: Choose your deployment model
          text: Enterprises hold vast amounts of untapped data—images, transcripts, contracts, and more—with huge AI potential. 
          icon: question.svg
        - heading: Integrate with your Data Lake  
          text: Enterprises hold vast amounts of untapped data—images, transcripts, contracts, and more—with huge AI potential. 
          icon: integrate.svg
        - heading: Build and scale
          text: Unlock top-tier price-performance for multimodal workloads
          icon: scale.svg
      cta:
        text: Contact Sales
        href:
        version: primary
        icon: true
scale:
  title: Built for Enterprise Scale
  speed: 2000
  cards:
    - number: 20000
      prefix: "+"
      text: Highest search QPS on a single table
      lottie: /assets/lottie/first.json
    - number: 100
      prefix: "%"
      text: Scale growth at a fraction of the cost
      lottie: /assets/lottie/second.json
    - number: 20
      prefix: PB
      text: Largest table under management
      lottie: /assets/lottie/third.json
    
---