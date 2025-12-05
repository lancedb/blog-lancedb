---
title: "Announcing Lance SDK 1.0.0: What This Milestone Means for the Community"
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

## What about Lance 2.1?

A few months ago, we wrote on this blog about updates to Lance 2.0 / 2.1. These refer to the **file format** version of Lance, not the SDK.

Below, we further clarify the difference between the file format and SDK version numbers.

**Lance File Format (currently 2.1):** This version tracks on-disk binary compatibility, similar to Parquet format versions. It is not tied to the SDK version. It evolves independently and at a slower cadence. See [Lance File Format Versioning](https://lance.org/format/file/versioning/) for more.

**Lance Table Format:** The table format maintains full backward compatibility and avoids the use of linear version numbers, instead relying on feature flags for new table-level features. This ensures that we never break existing data or metadata. See [Lance Table Format Versioning](https://lance.org/format/table/versioning/) for details.

**Lance Namespace Spec:** Each namespace operation is versioned individually. It follows an upgrade strategy similar to the APIs in Iceberg REST Catalog spec. It also evolves independently of the SDK. See [Lance Namespace Spec Versioning](https://lance.org/format/namespace/operations/#operation-list) for more.

In summary, **only the SDK** is adopting SemVer 1.0.0. The file format, table format, and namespace spec continue to follow their own established versioning strategies.

## Cadence of Breaking Changes

Moving forward, breaking changes to the SDKs may occur multiple times per year, and will be introduced through a new major version bump (e.g., 2.0.0, 3.0.0).

Importantly:

- No breaking changes will ever invalidate or require rewriting existing Lance data.
- Only SDK-level (user-facing) APIs may change.
- Migration steps, if any, will remain straightforward, and published in the [Migration Guide](https://lance.org/guide/migration/).

This cadence allows the SDK to evolve rapidly while ensuring long-term stability of data on disk.
