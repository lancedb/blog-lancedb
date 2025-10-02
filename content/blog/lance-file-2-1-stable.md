---
title: "Lance File 2.1 is Now Stable"
date: 2025-10-02
draft: false
featured: false
categories: ["Engineering"]
image: /assets/blog/lance-file-2-1-stable/lance-file-2-1-stable.png
description: "The 2.1 version is now stable, learn what that means for you and what's coming next."
author: Weston Pace
author_avatar: "/assets/authors/weston-pace.jpg"
author_bio: "Data engineer from the open source space, working on LanceDB, Arrow, Substrait."
author_twitter: "westonpace"
author_github: "westonpace"
author_linkedin: "westonpace"
---

The 2.1 version of the Lance file format has been [in beta](/lance-file-2-1-smaller-and-simpler/) for a while now and we're excited to announce that it is now stable. This means we any potential breaking changes will now be part of
2.2 and we are committing to backwards compatibility of 2.1.

## Compression Without Impacting Random Access

A [recent paper](https://dl.acm.org/doi/10.1145/3749163) measured random access performance recently and stated:

> **Lance is the fastest** because it does not have cascading encoding or compression like the others, enabling direct
> offset calculation for certain types (e.g., integers) and minimizing read amplification."

The primary reason behind the 2.1 format was to introduce cascading encoding and compression _without sacrificing
random access performance_. We wrote more about the [structural encodings](/file-readers-in-depth-structural-encoding/) that enable this feature and studied this in more depth in our [research paper](https://arxiv.org/abs/2504.15247). I'm happy to report that we were able to achieve our goal and avoid impacts to random access performance.

**I guess this means we're still the fastest.**

## How to Upgrade

The data storage version is set on a per-dataset basis. If you are happy wiht your dataset performance with 2.0, there
is no push to upgrade. We will of course continue to maintain 2.0. If you would like to take advantage of the new
features in 2.1 then you will need to make a copy of your dataset. The simplest way to do this is to do something
like this:

```python
import lance

ds = lance.dataset("my_2_0_dataset")
lance.write_dataset(ds, "my_2_1_dataset", data_storage_version="2.1")
```

## Ensuring a Smooth Transition

The 0.38.0 release of Lance is the first release to fully support reading 2.1 files. You could potentially
run into trouble if you are using older versions of Lance in combination with newer versions of Lance. As a result,
we recommend upgrading all of your software to 0.38.0 before you start writing 2.1 files. To facilitate this, we
are not making 2.1 the default file format in 0.38.0. You will still need to opt-in to 2.1 by setting the
`data_storage_version` parameter when writing a dataset. However, we will be changing the default in the near
future (potentially the next release). If you are planning on keeping old versions of Lance around for some time
you should ensure you explicitly set the `data_storage_version` parameter to 2.0 when writing your datasets.

## What's Next?

Work on 2.2 has already begun. It is too early to say what will be in it for sure but we are excited to share
some previews of ideas we are working on.

### Simpler Migration

We expect 2.1 to be the last version that will require a dataset copy to upgrade. 2.1 has established an overall
structure for file readers that we expect to be consistent regardless of what new encodings are added. As a result,
we are hoping to support [mixed-version datasets](https://github.com/lancedb/lance/issues/4870) by the time we
release 2.2.

### Even Better Compression

Our goal in 2.1 was to establish the overall strategy for compression and define nice easy-to-implement traits for
compression algorithms. We also implemented a number of popular lightweight compression techniques. However, there
are still gaps in our compression coverage that we hope to fill in 2.2.

### Better Struct Packing

We have supported struct packing for fixed-width fields for a while now. However, without support for variable-width
fields it is difficult to use the packing feature to it's fullest potential. We hope to add support for variable-width
fields soon. This will allow for flexible trade-offs between row-major and column-major storage. This is important
for use cases like model training from cloud storage which can be dominated by random access read patterns on smaller
materialized subsets of the data.

### JSON / Variant Support

We've been ramping up our JSON support in the table format with the addition of JSON indexes. We are also exploring
how we can best store JSON data in the file format. Common examples include JSONB and the new Parquet Variant data
type. We hope to have more details on this in the future.

---

**Join the Conversation!** 👩‍💻

We're always happy to chat more on our [Discord](https://discord.gg/G5DcmnZWKB) and on [Github](https://github.com/lancedb/lance). Feel free to ask for more details or help us find better ways to do things! If something doesn't work or could be faster then let us know too.
