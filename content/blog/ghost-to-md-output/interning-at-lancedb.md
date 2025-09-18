---
title: Interning at LanceDB
slug: interning-at-lancedb
date_published: 2024-12-20T18:50:25.000Z
date_updated: 2024-12-20T18:50:25.000Z
---

My name is Jun Wang, I am a master's student at Clark University, this fall semester I was very fortunate to have the opportunity working at LanceDB as a software engineer intern.

I worked on Lance, a modern columnar data format for ML and LLMs. Lance is set to be the file format for AI workloads, this is a ambitious goal and it has been very successful, with more than 3.5k projects use it on Github.

**A few things I worked on**

Encodings: Encodings are ways to compress data. The workload Lance targets requires good compression ratio and fast random access read.

    Strings: 
        Traditionally strings are compressed using dictionary encoding and block compression algorithms like snappy, zstd, lz4. However, dictionary encoding is only applicable when input data has low cardinality and block compression algorithms have huge decoding speed penalty during random access – we have to decompress the whole block to read any single row. 

[FSST](https://www.vldb.org/pvldb/vol13/p2649-boncz.pdf) is a string compression algorithm invented by [Peter Boncz](https://scholar.google.com/citations?user=DCIZE1kAAAAJ&amp;hl=en) et al at CWI, it builds a symbol table from the input data and substitutes the input substrings that match the symbol table with a one-byte symbol table index, thus providing both good compression ratio and fast random access. 

        I wrote the first Rust implementation of FSST algorithm and integrated it with Lance's MiniBlock page layout, experiments using the first column of [MS MACRO](https://microsoft.github.io/msmarco/) dataset show that Lance has less disk size and more than 60x faster random access speed.

![](__GHOST_URL__/content/images/2024/12/string_random_access_read_comparison-4.png)

    Integers:
        Integers are often compressed with encodings like bit-packing, frame-of-reference, and delta encoding. Bit-packing encoding packs the input data to the maximum bits they need, for example, when the input data is of type int32 and the data ranges between 0 ~ 1023, then we can use 10 bits to store each int32, squeezing them all together continuously on disk. 
        The challenge here is that to perform this "squeeze" and "unsqueeze", we do lots of bit by bit left/right shift, OR/AND and branching, which hinders the potential of modern CPU. 

[Fastlanes](https://www.vldb.org/pvldb/vol16/p2132-afroozeh.pdf?ref=blog.lancedb.com) algorithm is invented by [Azim Afroozeh](https://scholar.google.com/citations?user=h-vgI8UAAAAJ&amp;hl=en) and Peter Boncz at CWI, it groups every 1024 integers together and brilliantly interleaves them in a transposed order and thus enables compression and decompression of these 1024 values be done with SIMD operations. The decoding speed in their paper is astonishing, more than 100 billion integers per second.

        I integrated SpiralDB's [Fastlanes](https://github.com/spiraldb/fastlanes) implementation with the Lance MiniBlock page layout, experiments using 1 billion random generated integers between 0 and 2^20 shows that Lance file size is 2x smaller than parquet and around 170x faster for random access reads.

![](__GHOST_URL__/content/images/2024/12/integer_comparison-5.png)

Data statistics gathering
    To decide which encoding to use to compress the data and which page layout to use for storing the data, we need some understanding of the input data.  I designed and implemented a datatype agnostic way in Lance to gather input statistics that enables easy encoding selection and encoding cascade. For example, in Lance, the indices of dictionary encoding are compressed implicitly without any code to specify it, with each group of 1024 values having its own statistics for encoding algorithms to use.

**Working at LanceDB**
    The working experience at LanceDB is awesome and [We're hiring](https://lancedb.notion.site/Backend-Software-Engineer-Cloud-4c2d55c484374ffea2a4b91cf64ac934)!

    Rarely a software engineer gets the opportunity developing a popular file format and I feel very privileged working on Lance. [Weston](https://github.com/westonpace), with his expertise in this field, put unique thoughts designing and meticulously implementing Lance format 2.0 and 2.1.  He and other teammates give me tremendous help whenever I needed discussion and advice. 

    The vector database industry is just taking off and lots of engineering challenges remain unsettled, for aspiring computer scientists and software engineers craving for big puzzles to unleash their creativity, it's a great time now to get into this field.

**Computer systems programming**
    Programming in low level systems like Lance is quite a unique experience. A complete understanding of the codebase is needed while debugging only with "printf", writing encoding algorithms feels like a delicate dance with the CPU, and modern CPUs, powerful as a wild beast, also has a temper with what you feed them, how you orchestrate them.

    Software performance engineering is crucial in Lance not only because the speed boost and resource saving directly means saving money, but also because it enables use cases that are otherwise impossible.  For example, in autonomous vehicle navigation, real time vector search is used and it won't be feasible if the vector search latency is high.

    However, as Donald Knuth used to say: "premature (software) optimization is the root of all evil", software performance engineering is not a easy endeavor. Measuring and profiling needs to be rigorously done, or you misguide yourself going south for weeks. Writing code hacks like [bit hacks](https://graphics.stanford.edu/~seander/bithacks.html) is common, you feel you coded these tricks many times you start feeling confident at it, yet mishaps come and you shoot yourself in the foot, getting wrong results.

    Like when a con artist that lost his suits and props and has to start over on the street with only his words, system programming is "a cappella" with the computer hardware.

**Going Forward**
    Well, when you start your career at LanceDB, it's hard not to set yourself to be an exceptional software engineer. As I am wrapping up this internship, questions pop up like "what software systems I want to build?", "what software engineering challenges I want to tackle?". And my quest shall begin soon.

It's been a great honor working at LanceDB and I had great fun here. Special thanks goes to [Weston Pace](https://github.com/westonpace)!

*To reproduce the performance results in this article, benchmark code can be found *[*here*](https://github.com/broccoliSpicy/lance/tree/internship_summary_benchmark_code)*.*
