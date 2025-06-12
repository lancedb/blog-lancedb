---
date: 1970-01-01
author: Weston Pace
---
---
title: Columnar File Readers in Depth: Structural Encoding
date: 2024-03-14
draft: false
featured: false
image: /assets/blog/1.png
description: Explore columnar file readers in depth: structural encoding with practical insights and expert guidance from the LanceDB team.
author: David Myriel
---

Structural encoding describes how the "structure" of arrays are encoded into buffers and placed into file.  The choice of structural encoding places rules on how data is compressed, how I/O is scheduled, and what kind of data we need to cache in RAM.  Parquet, ORC, and the Arrow IPC format all define different styles of structural encoding.  Lance is unique in that we have two different kinds of structural encoding that we choose between based on the data we need to write.  In this blog post we will describe the structural encodings currently in use by Lance, why we need two, and how they compare to other approaches.

💡

This is part of a series of posts on the details we've encountered building a columnar file reader.
1. [Parallelism without Row Groups](__GHOST_URL__/file-readers-in-depth-parallelism-without-row-groups/)
2. [APIs and Fusion](__GHOST_URL__/columnar-file-readers-in-depth-apis-and-fusion/)
3. [Backpressure](__GHOST_URL__/columnar-file-readers-in-depth-backpressure/)
4. [Compression Transparency](__GHOST_URL__/columnar-file-readers-in-depth-compression-transparency/)
5. [Column Shredding](__GHOST_URL__/columnar-file-readers-in-depth-column-shredding/)
6. [Repetition & Definition Levels](__GHOST_URL__/columnar-file-readers-in-depth-repetition-definition-levels/)
7. Structural Encoding (this article)

## What is Structural Encoding?

When we are writing a Lance file we write a single leaf array at a time and we buffer up data until we have enough to justify a "disk page" (Parquet would call these column chunks).  Each disk page is quite large (~8MB by default) in order to minimize IOPS when performing full scans.  In the previous articles we described how we can take this leaf array and convert it into a collection of compressed buffers.  However, we now need to take that collection of buffers and write it into a "disk page" (which is basically one big buffer in our file).
![](__GHOST_URL__/content/images/2025/06/Structural-Encoding-Overview.png)
### Structural Encoding Defines I/O Patterns

The structural encoding we choose is important because it defines the I/O patterns that we can support.  For example, let's look at a very simple structural encoding.  We will write 2 bytes to tell us how many buffers we have, 4 bytes per buffer to describe the buffer length, and then lay out the buffers one after the other.

    ┌───────────────────────────┐              
    │# of buffers (2 bytes)     │       ▲      
    │───────────────────────────│       │      
    │bytes in buffer 0 (4 bytes)│       │      
    │───────────────────────────│       │      
    │bytes in buffer 1 (4 bytes)│       │      
    │───────────────────────────│       │      
    │...                        │       │      
    │───────────────────────────│       │      
    │bytes in buffer N (4 bytes)│   ~ 8 MB Data
    │───────────────────────────│       │      
    │buffer 0                   │       │      
    │───────────────────────────│       │      
    │buffer 1                   │       │      
    │───────────────────────────│       │      
    │...                        │       │      
    │───────────────────────────│       │      
    │buffer N                   │       │      
    └───────────────────────────┘       ▼      

This is super simple and very extensible.  It's got a number of things going for it.  However, there is one rather big problem.  *How can we read a single value?*

Unfortunately, we know nothing about the makeup of the buffers.  Are these buffers transparent or opaque?  We don't know.  Is there some fixed number of bytes per value in each buffer?  We don't know.  The only thing we can do is read the entire 8MB of data, decode and decompress the entire 8MB of data, and then select the value we want.  As a result, this approach generally gives bad random access performance because there is too much **read amplification**.

💡

*Read amplification* is a bit of jargon that describes reading more than just the data we want. For example, if we need to read 8MB of data to access a single 8 byte nullable integer, then we have *a lot* of read amplification, the 8 byte read is amplified into 8MB.

### Structural Encoding can Constrain Compression

Since the structural encoding is where we figure out which bytes we need to read from disk it is highly related to several of the encoding concepts we described in earlier posts.  Let's review:

- Transparent compression (e.g. bit packing) ensures a value is not "spread out" when compressed.  Opaque encoding (e.g. delta encoding) allows the value to be spread out but could potentially be more efficient.
- Reverse shredding (or zipping) buffers allows us to recombine multiple transparently compressed buffers into a single buffer.  This avoids a value getting spread out but it requires extra work per-value to zip and unzip.
- Repetition and definition levels are a way to encode validity and offset information in a form that is already zipped.  However, this form is not zero-copy from the Arrow representation and requires some conversion cost.

Each of these options has some potential trade offs.  In Lance, when we pick structural encoding, we also solidify these choices.  As a result, in Lance, we don't expect there to be a single structural encoding.  It is a pluggable layer and there are already two implementations (technically three since we use a unique structural encoding for all-null disk pages).

# Mini Block: Tiny Types Tolerate Amplification

# Full Zip: Large Types Allow More Work Per Value
