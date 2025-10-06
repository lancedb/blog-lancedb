---
title: Enterprise Grade Vector Search
description: Use LanceDB as a vector database for low-latency, high-throughput multimodal search across structured and unstructured data
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
    media: vectors/vector-search.svg # media for now can be svg of image
    #media_mob: if needed
  - type: features-grid
    bg_color: dark-700 # dark; naming from figma, by default "dark"
    style: grid # columns 
    title: Built for Complex Retrieval # optional field
    #description: optional field
    items:
      - icon: icons/database-backup.svg
        title: One Query Engine
        text: Hybrid search across vector, full-text and metadata with extensive reranking support.
        cta: 
          text: Search Docs
          icon: true
          href: /docs
          version: link
      - icon: icons/shapes.svg
        title: Native Multimodal Support
        text: Works with images, video, audio, text and complex data like point clouds.
        cta: 
          text: Search Docs
          icon: true
          href: /docs
          version: link
      - icon: icons/chart-bar-stacked.svg
        title: Low Latency, High QPS
        text: 20K+ QPS, sub-second search latency, even at scale.
        cta: 
          text: Performance Docs
          icon: true
          href: /docs
          version: link
      - icon: icons/arrow-down-up.svg
        title: Retrieval at Massive Scale
        text: Petabyte-scale and object-store-native. Real-time retrieval for efficient chatbots and agentic systems.
        cta: 
          text: Demo Docs
          icon: true
          href: /docs
          version: link
  - type: video
    bg_color: dark
    title: Scale Without Limits #optional field
    #description: optional
    video_id: 6SweXJhboTA
    cta:
      text: Try the Demo
      icon: true
      href: https://accounts.lancedb.com/sign-up
      version: primary
  - type: deploy
    bg_color: dark-700
    title: Deploy Anywhere
    description: LanceDB runs wherever you build. Prototype to production in a few steps.
    items: 
    - icon: icons/opn-source.svg
      title: Open Source
      text: The foundation for AI-native data — open, blazing fast, and ready to build anywhere.
      cta:
        text: LanceDB OSS
        icon: true
        href: https://accounts.lancedb.com/sign-up
        version: primary
    - icon: icons/serverless.svg
      title: Serverless
      text: Effortless scale, serverless performance, and an elegant way to manage AI data.
      cta:
        text: LanceDB Cloud
        icon: true
        href: https://accounts.lancedb.com/sign-up
        version: primary
    - icon: icons/private.svg
      title: Private
      text: A data platform without limits — advanced engines, enterprise security, and world-class support.
      cta:
        text: LanceDB Enterprise
        icon: true
        href: https://accounts.lancedb.com/sign-up
        version: primary
  - type: logos
    bg_color: dark-700
    no_padding_top: true
    speed: 5000
    text: Tomorrow's AI is being built on LanceDB today
    #logos: optional, by default will take logos from homepage
  - type: testimonial
    text: “We checked lots of other solutions, and they all became exorbitantly expensive for datasets >100M embeddings. LanceDB was the only option that could store 1B embeddings with 100x lower cost and zero ops. That’s why we love LanceDB!”
    name: Chris Moody
    position: CTO & Co-founder
    logo: /logos/logoipsum.svg
  - type: cta-product
    no_paddint_top: true
    title: One engine for all your enterprise search needs.
    cta:
      text: Contact Us
      icon: true
      href: /contact
      version: primary
---
