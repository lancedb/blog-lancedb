---
title: "Announcing Lance SDK 1.0.0: What This Milestone Means for Developers and the Community"
date: 2025-12-10
draft: false
featured: true
categories: ["Engineering"]
image: /assets/blog/announcing-lance-sdk/preview-image.png
meta_image: /assets/blog/announcing-lance-sdk/preview-image.png
description: "We’re excited to announce that the core Rust SDK and the Python and Java binding SDKs are graduating to version 1.0.0, alongside a new, community-driven release strategy."
author: Weston Pace
author_avatar: "/assets/authors/weston-pace.jpg"
author_bio: "Data engineer from the open source space, working on LanceDB, Arrow, Substrait."
author_twitter: "westonpace"
author_github: "westonpace"
author_linkedin: "westonpace"
---

With Lance now powering production workloads across multiple organizations, the core storage layer has proven to be stable, mature, and resistant to breaking changes for a long time. As part of our ongoing evolution of the project—and following recent updates in [Lance community governance](https://lancedb.com/blog/lance-community-governance/) — we’re excited to announce that the core Rust SDK and the Python and Java binding SDKs are graduating to version 1.0.0, alongside a new, community-driven release strategy.

This post outlines what 1.0.0 represents, how releases will work moving forward, and how this affects related components such as the Lance file format, table format, and namespace specifications.

## Why 1.0.0? A Maturity Milestone for the Storage Layer

Reaching 1.0.0 signals that:

- The storage layer APIs have reached long-term stability.
- The system is widely deployed, with real production feedback validating its robustness.
- The community is aligned on a release governance model, ensuring transparency, predictability, and shared ownership.

This moment marks the transition from early rapid iteration to a more deliberate, versioned evolution of the SDK.

## Adopting Semantic Versioning (SemVer)

Starting with 1.0.0, Lance SDK releases will follow strict semantic versioning:

- MAJOR version — breaking API changes
- MINOR version — new, backward-compatible features
- PATCH version — bug fixes against a specific major/minor release

This new approach is designed to improve clarity and empower both individual contributors and downstream projects that depend on Lance.

The updated release process is intended to:

1. Enable community voting on stable release candidates before an official release.
2. Support patch releases for specific major/minor branches, allowing downstream teams to lock onto a stable version if needed.

{{< admonition >}}

**Note**: While release branches exist, the Lance project does not currently plan to actively backport patches unless they are critical.

{{< /admonition >}}

For more details, see [Lance release process](https://lance.org/community/project-specific/lance/release/) in the documentation.

## How LanceDB votes for the release