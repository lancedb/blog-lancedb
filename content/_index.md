---
enableSwiper: true
title: Designed for Multimodal. <br> Built for Scale.
description: From agents to models, from search to training, one platform for all your AI data and workloads
meta: # alternative meta 
  title: "LanceDB | Vector Database for RAG, Agents & Hybrid Search" # alternate meta title
  description: "Build fast, reliable RAG, agents, and search engines with LanceDB— a multimodal vector database with native versioning and S3-compatible object storage." # alternate meta description
  keywords: # meta keywords
  og_title: # Open Graph title
  og_description: # Open Graph description
  og_image: # Open Graph image
  og_twitter_image: # Twitter image
hero:
  cta:
    - text: Get Started
      icon: true
      href: https://accounts.lancedb.com/sign-up
      version: primary
    - text: Learn More
      icon: true
      href: /contact
      version: secondary
  vector: #static/assets/vectors/hero-bg.svg
  video: assets/video/blob.mp4
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
  description: Data lakes only handle tabular data, search engines just work with vectors, and neither work well with multimodal data. Researchers using today's infrastructure face more complexity, higher cost, and slower progress.
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
      description: Fast scans and random access. Large blob storage. Zero-copy fine-grained data-evolution at petabyte scale.
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
    href: https://accounts.lancedb.com/sign-up
    icon: true
    version: primary
    text: Create Your First Project
how_it_works:
  title: How LanceDB Works
  description: From prototype to production.
  items:
    - title: For Developers
      list:
        - heading: Connect to LanceDB
          text: Get started fast with a simple install and intuitive interface.
          icon: union.svg
        - heading: Ingest Data
          text: Grow your project to petabyte scale without worrying about infrastructure.
          icon: data.svg
        - heading: Build and Index
          text: Streamline your workflow and focus on high-value experimentation.
          icon: index.svg
      cta:
        text: Try LanceDB Cloud
        href: https://accounts.lancedb.com/sign-up
        version: primary
        icon: true
    - title: For Enterprises
      list:
        - heading: Choose Deployment Model
          text: Unlock the value in your sales calls, decks, contracts, and more.
          icon: question.svg
        - heading: Data Lake Compatible
          text: Keep you data private and secure. Works with your existing data lake.
          icon: integrate.svg
        - heading: Build and Scale
          text: Unlock massive scalability and unmatched price-performance.
          icon: scale.svg
      cta:
        text: Contact Sales
        href: /contact
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
      text: Massive scalability at a fraction of the cost
      lottie: /assets/lottie/second.json
    - number: 20
      prefix: PB
      text: Largest table under management
      lottie: /assets/lottie/third.json
compliance: 
  bg: grey
  title: Enterprise-Grade Compliance
  description: Safety and security guaranteed for your data.
  cards:
    - text: 
        mobile: SOC2 
        desktop: SOC2 Type II
      icon: aicpa.svg
    - text:
        mobile: GDPR 
        desktop: GDPR compliant
      icon: gdpr.svg
    - text: 
        mobile: HIPAA 
        desktop: HIPAA compliant
      icon: hipaa.svg
testimonials:
  title: Trusted By The Best
  items:
    - icon: static/assets/logos/worldlabs.svg
      text: "Lance has been a significant enabler for our multimodal data workflows. Its performance and feature set offer a dramatic step up from legacy formats like WebDataset and Parquet. Using Lance has freed up considerable time and energy for our team, allowing us to iterate faster and focus more on research."
      rating: 5
      author:
        name: Keunhong Park
        position: Member of Technical Staff
    - icon: static/assets/logos/harvey.svg
      text: "Law firms, professional service providers, and enterprises rely on Harvey to process a large number of complex documents in a scalable and secure manner. LanceDB’s search/retrieval infrastructure has been instrumental in helping us meet those demands."
      rating: 5
      author: 
        name: Gabriel Pereyra
        position: Co-Founder
    - icon: static/assets/logos/runway.svg
      text: "Lance transformed our model training pipeline at Runway. The ability to append columns without rewriting entire datasets, combined with fast random access and multimodal support, lets us iterate on AI models faster than ever. For a company building cutting-edge generative AI, that speed of iteration is everything."
      rating: 5
      author:
        name: Kamil Sindil
        position: Head of Engineering
blog:
  title: Official LanceDB Blog
  highlighted: true # use highlighted for this section
  posts: # if highlighted false use this posts, filterd by title
    - A Practical Guide to Training Custom Rerankers
    - November Feature Roundup
    - Test Post for code snippet
  cta: 
    text: Read the Blog
    icon: true
    version: primary
    href: /blog
cta:
  type: buttons
  title: Start Your Multimodal <br> Transformation Today
  description: Designed for Multimodal Data. Built for Production Scale.
  cta:
    - text: Get started
      icon: true
      version: primary
      href: https://accounts.lancedb.com/sign-up
    - text: Discover more
      icon: true
      version: secondary
      href: /contact
  vectors:
    left: assets/vectors/cta-left.svg
    right: assets/vectors/cta-right.svg

---