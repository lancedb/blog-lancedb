---
type: pricing
title: Simple Transparent Pricing
highlighted: Transparent
description: From the first POC to billion-scale production, a perfect option for every part of your AI journey
meta:
  title: "LanceDB Pricing: Vector Database & Lakehouse"
  description: "Simple, transparent pricing for LanceDB Cloud and Enterprise. From free tier to billion-scale production. Pay-as-you-go or custom enterprise plans."
  keywords: "LanceDB pricing, vector database pricing, AI platform pricing, cloud pricing, enterprise pricing, pay-as-you-go, serverless pricing, multimodal lakehouse pricing"
plans:
  - title: LanceDB Cloud
    description: Serverless search engine. Best for growing teams who want to search more and manage less.
    name: Usage-based
    details: Pay as you go
    features:
      title: "Everything in OSS, plus:"
      items:
        - Serverless retrieval with nothing to manage
        - Intuitive UI to explore your data
        - Automatic indexing and compaction
        - Python, TypeScript, and Rust SDKs
    link:
      text: Start Free
      icon: true
      version: primary
      href: https://accounts.lancedb.com/sign-up
  - title: LanceDB Enterprise
    description: The AI-Native Multimodal Lakehouse for enterprises with billions of vectors and multimodal workloads.
    name: Custom
    details: Contact us for pricing
    features:
      title: "Everything in LanceDB Cloud, plus:"
      items:
        - Complete control of your data
        - Multimodal SQL engine
        - Distributed data pre-processing engine
        - Optimized training infrastructure
        - Deploy on any cloud
    link:
      text: Contact Sales
      icon: true
      version: secondary
      href: /contact
calculator:
  calc_title: LanceDB Cloud Pricing Calculator
  result_title: Estimated Monthly Costs
  selects:
    - name: dimensions
      options:
        - value: 768
          label: 768
        - value: 1024
          label: 1024
        - value: 1536
          label: 1536
          selected: true
        - value: 2048
          label: 2048
    - name: attributes
      options:
        - value: 256
          label: 256B
        - value: 512
          label: 512B
          selected: true
        - value: 1024
          label: 1KB
  markers:
    - 10k
    - 100k
    - 1M
    - 10M
    - 100M
  sliders:
    - name: writes
      title: Vectors Written Per Month
      min: 0
      max: 4
      default: 2
      step: 1
      price: 100
    - name: queries
      title: Queries Per Month
      min: 0
      max: 4
      default: 2
      step: 1
      price: 25
    - name: storage
      title: Total Vectors Stored
      min: 0
      max: 4
      default: 2
      step: 1
      price: 33
  discount:
    value: 100.00
    title: Free Credits (one-time)
    price: 100
  actions:
    - version: secondary
      href: /contact
      text: Contact Sales
      icon: true 
    - version: primary
      href: https://accounts.lancedb.com/sign-up
      text: Sign Up
      icon: true 
---