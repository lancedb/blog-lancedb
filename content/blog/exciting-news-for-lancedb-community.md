---
title: Exciting News for LanceDB Community!
date: 2024-04-02
draft: false
featured: false
image: /assets/posts/1.png
description: Explore exciting news for lancedb community! with practical insights and expert guidance from the LanceDB team.
author: Jasmine Wang
---
Dear LanceDB Community,

We are thrilled to announce some significant updates in our open-source software, LanceDB, the database designed for multimodal AI/ML data processing based on the Lance file format. In response to community feedback and to enhance the user experience,  we are introducing a brand-new Rust client and transitioning our Python and Node libraries to be built upon this Rust foundation.

🐍 Python Client Updates:

- Asynchronous Python API: Responding to community requests, we have introduced an asynchronous Python client that simplifies parallel request handling and enhances performance.
- Migration Efforts: The new asynchronous Python API is now officially documented and supported, offering improved functionality and better integration with features like hybrid search and automatic embeddings calculation.

🦀 Rust Client Enhancements:

- Official Rust Support: Introducing the new official Rust client packaged as "lancedb," replacing the deprecated "vectordb" crate for improved maintenance and compatibility.
- Thorough Documentation: The new Rust client is extensively documented, ensuring clear and straightforward changes for users. Efforts are underway to integrate with Rust libraries like serde and polars for enhanced ecosystem compatibility.

🟢 Node Client Transition:

- Phasing Out “vectordb”: The current Node package "vectordb" is being phased out in favor of the new "lancedb" package built with napi for easier maintenance and improved functionality.
- Migration Guide: Users are encouraged to migrate to the "lancedb" package, which offers enhanced documentation, quality-of-life features, and future-proofing for upcoming feature integrations.

🚀 Summary of Benefits Across Clients:

- Enhanced user experience with more user-friendly APIs
- Improved documentation for easier integration and development
- Official support ensuring stability and backward compatibility
- Acceptance of feature requests and PRs for continuous improvement

This migration paves the way for exciting new features and improved performance. We want to be transparent that this transition will necessitate some breaking changes. The specifics of these changes and the migration process will vary depending on the language being used.

We are committed to ensuring a smooth transition and are dedicated to providing support throughout this process. Your feedback and support are invaluable as we continue to evolve LanceDB into a more robust and user-friendly database for multimodal AI.

Thank you for being part of the LanceDB community, and we look forward to embarking on this journey of innovation together!

Warm regards,

The LanceDB Team 🚀🔍
