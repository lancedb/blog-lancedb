---
title: "Lance File 2.1 is Now Stable"
date: 2025-10-02
draft: false
featured: false
categories: ["Engineering"]
image: /assets/blog/lance-file-2-1-stable/preview-image.png
description: "The 2.1 file version is now stable, learn what that means for you and what's coming next."
author: Weston Pace
author_avatar: "/assets/authors/weston-pace.jpg"
author_bio: "Data engineer from the open source space, working on LanceDB, Arrow, Substrait."
author_twitter: "westonpace"
author_github: "westonpace"
author_linkedin: "westonpace"
---

The 2.1 version of the Lance file format has been [in beta](/lance-file-2-1-smaller-and-simpler/) for a while now and we're excited to announce that it is now stable. This means we've [documented the spec](https://lancedb.github.io/lance/format/file/encoding/) and any potential breaking changes will now be part of 2.2 and we are committing to backwards compatibility of 2.1.

## Compression Without Impacting Random Access

A [recent paper](https://dl.acm.org/doi/10.1145/3749163) measured random access performance recently and stated:

> **Lance is the fastest** because it does not have cascading encoding or compression like the others, enabling direct
> offset calculation for certain types (e.g., integers) and minimizing read amplification."

This lack of compression was a significant limitation of 2.0. That's why the primary reason behind the 2.1 format
has been to introduce cascading encoding and compression _without sacrificing random access performance_. We wrote
more about the [structural encodings](/file-readers-in-depth-structural-encoding/) that enable this feature and
studied this in more depth in our [research paper](https://arxiv.org/abs/2504.15247). I'm happy to report that we
were able to achieve our goal and avoid impacts to random access performance.

**I guess this means we're still the fastest.**

### Other Benefits

In addition to the compression benefits, there are a few other minor benefits added in the 2.1 format:

- Fewer IOPS when reading nested data (lists and structs)
- Support for distinguishing between null structs and null values.
- Optional repetition index caching to further reduce IOPS of variable-width data at the expense of more memory usage.

## How to Upgrade

The data storage version is set on a per-dataset basis. If you are happy with your dataset performance with 2.0, there
is no push to upgrade. We will of course continue to maintain 2.0. If you would like to take advantage of the new
features in 2.1 then you will need to make a copy of your dataset. The simplest way to do this is to do something
like this:

```python
import lance

ds = lance.dataset("my_2_0_dataset")
lance.write_dataset(ds, "my_2_1_dataset", data_storage_version="2.1")
```

## Should I Upgrade?

Some workflows will not significantly benefit. Vector embeddings, images, and audio are all pre-compressed and
often make up the majority of the data in a dataset, so there may not be much total impact. Compressing the smaller
columns will still speed up scans of those columns but not all workflows rely on scans if they make good use of
secondary indices.

The most likely workflows to benefit will be those that scan smaller columns as these workloads
are typically bound by the disk bandwidth. You may want to try converting a subset of your data to see if there is a
meaningful reduction in size or performance.

## Ensuring a Smooth Transition (Even if you Don't Upgrade)

The 0.38.0 release of Lance is the first release to fully support reading 2.1 files. You could potentially
run into trouble if you are reading dataset with older versions of Lance while writing 2.1 files with newer
versions of Lance.

As a result, we recommend upgrading all of your software to 0.38.0 or higher before you start writing 2.1
files. To facilitate this, we are not making 2.1 the default file format in 0.38.0. You will still need to
opt-in to 2.1 when writing a dataset:

```python
# In 0.38.0 you still need to opt-in to 2.1
lance.write_dataset(data, "my_2_1_dataset", data_storage_version="2.1")
```

We will be changing the default in the near future (potentially the next release). If you are planning on
keeping old versions of Lance around for some time you should ensure you explicitly set the 2.0 version:

```python
# You should explicitly set the data storage version to 2.0 if you
# plan on running a mixed environment with both older and newer versions
# of Lance.
lance.write_dataset(data, "my_2_0_dataset", data_storage_version="2.0")
```

In both cases this is only a concern for creating new datasets. Adding data to an existing dataset or updating
data will always use the data storage version of the dataset.

## What's Next?

Work on 2.2 has already begun. It is too early to say what will be in it for sure but we are excited to share
some previews of ideas we are working on.

### We want to make it simpler to migrate

We expect 2.1 to be the last version that will require a dataset copy to upgrade. 2.1 has established an overall
structure for file readers that will be consistent regardless of what new encodings are added. As a result,
we are hoping to support [mixed-version datasets](https://github.com/lancedb/lance/issues/4870) by the time we
release 2.2.

### Some cases need better compression

Our goal in 2.1 was to establish the overall strategy for compression and define nice easy-to-implement traits for
compression algorithms. We also implemented a number of popular lightweight compression techniques. However, there
are still gaps in our compression coverage that we hope to fill in 2.2. If you love columnar compression and are
interested in contributing, then a lot of these gaps might be nice starting issues. Look for some of the
`good_first_issue` tags in the [2.2 milestone](https://github.com/lancedb/lance/milestone/9).

### We want to fully support struct packing

We have supported struct packing for fixed-width fields for a while now. However, without support for variable-width
fields it is difficult to use the packing feature to it's fullest potential. We hope to
[add support](https://github.com/lancedb/lance/issues/2862) for variable-width fields soon. This will allow for
flexible trade-offs between row-major and column-major storage. This is important for use cases like model
training from cloud storage which can be dominated by random access read patterns on smaller materialized subsets
of the data.

### We plan to investigate better JSON encoding

We've been ramping up our [JSON support](https://github.com/lancedb/lance/discussions/3841) in the table format
with the addition of JSON indexes. We are also exploring how we can best store JSON data in the file format.
Common examples include JSONB and the new Parquet Variant data type. We hope to have more details on this in the future.

## Join the Conversation

We're always happy to chat more on our [Discord](https://discord.gg/G5DcmnZWKB) and on [Github](https://github.com/lancedb/lance). Feel free to ask for more details or help us find better ways to do things! If something doesn't work or could be faster then let us know too.
