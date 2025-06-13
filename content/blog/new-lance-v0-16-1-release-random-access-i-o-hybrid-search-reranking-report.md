---
title: "New Lance v0.16.1 Release: Random Access I/O, Hybrid Search & Reranking Report"
date: 2024-03-25
draft: false
featured: false
image: /assets/blog/new-lance-v0-16-1-release-random-access-i-o-hybrid-search-reranking-report/new-lance-v0-16-1-release-random-access-i-o-hybrid-search-reranking-report.png
description: "Explore new Lance v0.16.1 release: random access I/O, hybrid search & reranking report with practical insights and expert guidance from the LanceDB team."
author: Weston Pace
---
## 🔥New release of Lance v0.16.1🔥

Lance v0.16.1 brings new features to help manage versions and Lance file format editions, a new optimized ETL pattern for updating columns, and an experimental API for distributed ANN index training. 

[Read the blog](__GHOST_URL__/lance-v0-16-1-feature-roundup/)

## 💡 Dive into the future of data management with LanceDB's random access I/O" 💡

Random access I/O has traditionally been ignored by columnar formats. One of the reasons we started the Lance file format and have been investigating new encodings is because we wanted a format with better support for random access. 

[Read the blog](__GHOST_URL__/the-case-for-random-access-i-o/)

## Community contributions

💡

A heartfelt thank you to our community contributors of lance and lancedb this month: [@gagan-bhullar-tech](https://github.com/gagan-bhullar-tech)[@mattbasta](https://github.com/mattbasta)[@rithikJha](https://github.com/rithikJha)[@rahuljo](https://github.com/rahuljo)[@h0rv](https://github.com/h0rv)[@tonyf](https://github.com/tonyf)[@dsgibbons](https://github.com/dsgibbons)[@dentiny](https://github.com/dentiny)[@maxburke](https://github.com/maxburke)[@jiachengdb](https://github.com/jiachengdb)

## Good reads

- A new report on [Improving retrievers with LanceDB hybrid search and Reranking](__GHOST_URL__/hybrid-search-and-reranking-report/). This report explores techniques to optimize the retriever's performance without requiring a complete dataset re-ingestion. The experiments on the SQuAD and Llama2-review datasets demonstrated significant improvement. An 11% increase in accuracy on SQuAD (from 81.22% to 92.35%) and a 16% increase in hit-rate on Llama2-review (from 58.63% to 75%) 

![Chart](https://lh7-rt.googleusercontent.com/docsz/AD_4nXdHhOSMMdmntKAZaPaW-Z4CD8iFFbRIJPr81X25R4ZHTv2ahtvmTroWMb-k7g3hCEipGv3_lXSyEhqiXU8_iniS2ZQSrsng4RBiYEwSG9zfxQeupb-C3RjVyUBVTvZez_GR6i9ir4YS-CPB9MpNxiTOPm9M?key=a_P4AHsxibRE0-uJOiPNww)
- Wonder what a summer internship looks like at LanceDB? Check out our intern Raunak Shah's blog [My summer internship experience at LanceDB](__GHOST_URL__/my-summer-internship-experience-at-lancedb-2/), where he shares his transformative experience interning at LanceDB this summer!

## Event recap

An innovative database changing the whole AI field: the idea behind LanceDB

How LanceDB tackles CAP Theorem

## Latest releases

- In Lance, you can tag versions of your datasets (as of Lance v0.16.0). [Blog post](__GHOST_URL__/lance-v0-16-1-feature-roundup/#version-tags).
- New *data_storage_version* parameter allows precise control of which version of Lance files to use in tables (as of Lance v0.16.0, LanceDB Python 0.12.0, LanceDB Node/Rust 0.9.0). [Blog post](__GHOST_URL__/lance-v0-16-1-feature-roundup/#v2-format-versioning-api).
- *merge_insert* can be used to update a subset of columns (as of Lance v0.16.0, LanceDB Python 0.12.0, LanceDB Node/Rust 0.9.0). [Blog post](__GHOST_URL__/lance-v0-16-1-feature-roundup/#update-subcolumns-with-mergeinsert).
