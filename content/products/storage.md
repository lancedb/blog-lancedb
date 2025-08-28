---
title: Multimodal Storage Built for Scale
description: Blobs, tables, and metadata in one open format.
enableSwiper: true
sections:
  - type: hero-text
    #title:
    #description:
    cta:
      - text: Get Started
        icon: true
        href: https://accounts.lancedb.com/sign-up
        version: primary
      - text: Talk to Sales
        icon: true
        href: /contact
        version: secondary
  - type: logos
    no_padding_top: true
    speed: 5000
    text: Tomorrow's AI is being built on LanceDB today
    #logos: optional, by default will take logos from homepage
  - type: image-section
    src: static/assets/vectors/storage.svg # can be image or svg
    #src_mob: orptional for mobile
  - type: features-grid
    bg_color: dark-700 # dark; naming from figma, by default "dark"
    style: columns # grid
    #title: optional field
    #description: optional field
    items:
      - icon: icons/multy.svg
        title: Truly Multimodal
        text: Store and query any combination of data types. Native support for blob + structured data.
        cta:
          text: Overview Docs
          icon: true
          href: /docs
          version: link
      - icon: icons/file-stack.svg
        title: Just Files on Cloud
        text: No managed infra required. Compatible with popular block storage options.
        cta:
          text: Storage Docs
          icon: true
          href: /docs
          version: link
      - icon: icons/evolution.svg
        title: Zero-Copy Schema Evolution
        text: Add, update, or backfill features without ETL.
        cta:
          text: Schema Docs
          icon: true
          href: /docs
          version: link
      - icon: icons/open-arrows.svg
        title: Open and Interoperable
        text: Discuss all catalog and namespace options and other ways to hookup to the product.
        cta:
          text: Integrations
          icon: true
          href: /docs
          version: link
  - type: related-content
    bg_color: dark-700
    no_padding_top: true
    posts: # Can be customizable or take all info from post page
      - path: "/blog/case-study-netflix" # all info from post
        cta_text: Read the Blog
      - path: /docs/reference # custom fields
        title: "Lance, Parquet, Iceberg: A Technical Comparison"
        image: /images/blog-thumb.jpg
        cta_text: Read the Lance Paper
  - type: testimonial-list
    title: Why Top AI Companies Trust Lance
    #description: optinal
    items:
      - text: “We checked lots of other solutions, and they all became exorbitantly expensive for datasets >100M embeddings. LanceDB was the only option that could store 1B embeddings with 100x lower cost and zero ops. That’s why we love LanceDB!”
        name: Chris Moody
        position: CTO & Co-founder
        logo: /logos/midjourney.svg
      - text: “We checked lots of other solutions, and they all became exorbitantly expensive for datasets >100M embeddings. LanceDB was the only option that could store 1B embeddings with 100x lower cost and zero ops. That’s why we love LanceDB!”
        name: Chris Moody
        position: CTO & Co-founder
        logo: /logos/midjourney.svg
      - text: “We checked lots of other solutions, and they all became exorbitantly expensive for datasets >100M embeddings. LanceDB was the only option that could store 1B embeddings with 100x lower cost and zero ops. That’s why we love LanceDB!”
        name: Chris Moody
        position: CTO & Co-founder
        logo: /logos/midjourney.svg
      - text: “We checked lots of other solutions, and they all became exorbitantly expensive for datasets >100M embeddings. LanceDB was the only option that could store 1B embeddings with 100x lower cost and zero ops. That’s why we love LanceDB!”
        name: Chris Moody
        position: CTO & Co-founder
        logo: /logos/midjourney.svg
  - type: cta-product
    title: Don’t let storage define your project.
    cta:
      text: Contact Us
      icon: true
      href: /contact
      version: primary
---
