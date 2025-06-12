---
title: Streamlining Our SDKs
date: 2024-07-16
draft: false
featured: false
image: /assets/blog/1.png
description: Explore streamlining our sdks with practical insights and expert guidance from the LanceDB team.
author: cory grinstead
---
In the fast-evolving landscape of software development, maintaining multiple SDKs in various languages can be a challenging endeavor, especially for a small startup! Each bespoke implementation comes with its own set of intricacies, making updates and bug fixes a time-consuming process. To address these challenges, we've embarked on a journey to rewrite our SDKs in Python and JavaScript as thin wrappers around our Rust SDK.

## Why Refactor?

Over time, our SDKs have grown in complexity, with each language implementation diverging from the others. This has made it difficult to maintain feature parity across all SDKs. By rewriting our SDKs to be thin wrappers over our Rust SDK, we can consolidate our codebase and ensure that all SDKs are in sync with the latest features and bug fixes.

Moreover, this refactor significantly simplifies the process of adding support for new languages. As a highlight, we are excited to announce that we are actively working on new Java bindings. This would not have been practical with the previous architecture, but now it's within reach, thanks to the unified Rust core.

While refactoring may seem like a technical detail, it has significant implications for our users and the future of our SDKs. Unifying our SDKs around a core Rust implementation allows us to streamline current operations and ensure consistent feature development across all supported languages.

One of the key features we can now implement is full-text search, which has been limited to Python only. Centralizing our code in Rust makes implementing and optimizing full-text search much easier. We are moving this functionality into the Rust core, so it can be exposed across all clients.

In essence, this strategic shift is not just about simplifying our code base today; it's about unlocking new possibilities and delivering more powerful features in the future.

## What impact does this have on existing users?

### TypeScript Users

Existing users of the npm package `vectordb` will need to migrate to the new `@lancedb/lancedb`*(npm)* package. We've made efforts to keep the public APIs as similar as possible to minimize friction during this transition. While the old SDK will continue to receive bug fixes and support for now, it will eventually be phased out as we focus our efforts on the new one.

### Python Users

Python users will not see much of a public change as we are continuing to use the `lancedb` PyPI package. However, there will be some internal refactors. The `sync` API is currently built using our old architecture. Most of our efforts going forward will bring the `async` API to feature parity with the `sync` API. Eventually, the `sync` API will become a wrapper over the `async` API. At that point, Python users will be free to choose the `sync` or `async` API without having to worry about differences in feature support.

### Rust Users

Rust users should use the `lancedb` crate. The previous `vectordb` crate was removed from support in February 2024.

## Need Help?

If you have any issues or questions during the migration, please reach out to us on [Discord](https://discord.com/invite/zMM32dvNtd) or [GitHub](https://github.com/lancedb). We're here to help and ensure a smooth transition.
