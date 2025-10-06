---
title: LanceDB Changelog
sidebar_title: Changelog
description: Track LanceDB's latest features, improvements, and bug fixes. Stay updated with our vector database's development progress and new capabilities.
weight: 302
---

## September 2025

### Highlights

RabitQ quantization is now supported for vector indices.  Full-text search latencies are now reduced significantly.  Scalar indices are now supported for JSON columns with type-aware indexing.

#### New Features

**Vector Index Enhancements**
- Added RabitQ quantization support for vector indices ([lance#4344](https://github.com/lancedb/lance/issues/4344))
- Introduced `target_partition_size` parameter for vector indices, making `num_partitions` optional with sensible defaults per index type ([lance#4616](https://github.com/lancedb/lance/issues/4616))
- Added support for nested field indexing using dot path notation (e.g., `parent.child`) for both scalar and vector indices ([lance#4682](https://github.com/lancedb/lance/issues/4682))

**Full-Text Search Improvements**
- Building FST at write time instead of read time reduces P95 latency by 32.3% (5708ms → 3863ms) and cuts token set file size in half ([lance#4811](https://github.com/lancedb/lance/issues/4811))
- Optimized doc set loading reduces cold-start P95 latency by 18.7% (3721ms → 2940ms) ([lance#4821](https://github.com/lancedb/lance/issues/4821))
- CPU-heavy FST building moved to blocking threads ([lance#4803](https://github.com/lancedb/lance/issues/4803))
- Added distributed FTS index building support ([lance#4578](https://github.com/lancedb/lance/issues/4578))
- Added UDTF for FTS queries ([lance#4684](https://github.com/lancedb/lance/issues/4684))
- Added JSON parser for FTS queries ([lance#4605](https://github.com/lancedb/lance/issues/4605))

**JSON Support**
- Added scalar index support for JSON columns with type-aware indexing ([lance#4621](https://github.com/lancedb/lance/issues/4621), [lance#4626](https://github.com/lancedb/lance/issues/4626))
- JSON features no longer require version 2.2 ([lance#4641](https://github.com/lancedb/lance/issues/4641))

**Storage and Performance**
- Added OpenDAL support for S3, Azure Blob, and GCS via `use_opendal=true` storage option ([lance#4597](https://github.com/lancedb/lance/issues/4597))
- Optimized S3 throughput with improved file naming ([lance#4737](https://github.com/lancedb/lance/issues/4737))
- Added hierarchical clustering performance improvements ([lance#4726](https://github.com/lancedb/lance/issues/4726))

**Index Management**
- Create indices from another source dataset, enabling delta indices for MemTable ([lance#4658](https://github.com/lancedb/lance/issues/4658))
- Added support for merging indices with provided unindexed fragments ([lance#4659](https://github.com/lancedb/lance/issues/4659))
- Distributed B-tree index creation achieving 10x build speed improvement in production testing ([lance#4667](https://github.com/lancedb/lance/issues/4667))
- Lazy loading for bitmap indices with column projection support ([lance#4699](https://github.com/lancedb/lance/issues/4699))

**Metadata and Configuration**
- Added table metadata support separate from schema metadata, with incremental update support for all metadata types ([lance#4350](https://github.com/lancedb/lance/issues/4350))
- Added manifest summary support accessible from `Version` ([lance#4754](https://github.com/lancedb/lance/issues/4754))
- Added `LANCE_LOG_FILE` environment variable for file logging ([lance#4721](https://github.com/lancedb/lance/issues/4721))

**Java Bindings**
- Exposed `merge_insert` API ([lance#4685](https://github.com/lancedb/lance/issues/4685))
- Added `compact` functionality ([lance#4703](https://github.com/lancedb/lance/issues/4703))
- Added scalar index support ([lance#4683](https://github.com/lancedb/lance/issues/4683))
- Added `enable_stable_row_ids` option to `WriteParams` ([lance#4674](https://github.com/lancedb/lance/issues/4674))
- Added support for distributed compaction ([lance#4706](https://github.com/lancedb/lance/issues/4706))
- Exposed additional `Operation::Update` fields including `fields_modified` and new fields from [lance#4589](https://github.com/lancedb/lance/issues/4589) ([lance#4788](https://github.com/lancedb/lance/issues/4788))
- Added fragment-level merge column interface ([lance#4649](https://github.com/lancedb/lance/issues/4649))

**Python Bindings**
- Added ability to pass `Session` when opening datasets for cache reuse ([lance#3927](https://github.com/lancedb/lance/issues/3927))
- Exposed `open_session` in Python ([lance#4581](https://github.com/lancedb/lance/issues/4581))
- Added `use_index` option for merge insert operations ([lance#4688](https://github.com/lancedb/lance/issues/4688))
- Bumped Python support to version 3.13 ([lance#4816](https://github.com/lancedb/lance/issues/4816))

**Format Changes – Version 2.1 Encoding**
- Added blob encoding support ([lance#4802](https://github.com/lancedb/lance/issues/4802))
- Added support for already-dictionary encoded data ([lance#4813](https://github.com/lancedb/lance/issues/4813))
- Applied bitpacking on rep/def for compression ([lance#4537](https://github.com/lancedb/lance/issues/4537))
- Enabled bitpacking in zero chunk ([lance#4694](https://github.com/lancedb/lance/issues/4694))
- Allowed out-of-line bitpacking to support tail chunks ([lance#4740](https://github.com/lancedb/lance/issues/4740))

**Bloom Filter Index**
- Added split block bloom filter support as an inexact scalar index ([lance#4530](https://github.com/lancedb/lance/issues/4530))
- Corrected underestimate of Bloom filter epsilon for improved accuracy ([lance#4734](https://github.com/lancedb/lance/issues/4734))

---

### Breaking Changes
- `Operation::UpdateConfig` and its Python/Java bindings now use different fields (backwards compatible when serialized) ([lance#4350](https://github.com/lancedb/lance/issues/4350))
- Added `MERGED` state to MemWAL index; `mark_mem_wal_as_flushed` renamed to `mark_mem_wal_as_merged` ([lance#4673](https://github.com/lancedb/lance/issues/4673))
- Stable row IDs: Added support for refreshing fragment bitmap for indices after updating ([lance#4589](https://github.com/lancedb/lance/issues/4589))
- `target_partition_size` parameter added for vector indices, changing recommended configuration ([lance#4616](https://github.com/lancedb/lance/issues/4616))

---

### Bug Fixes
- Fixed typo `"blfoat16"` → `"bfloat16"` in `datatypes.rs` ([lance#4852](https://github.com/lancedb/lance/issues/4852))
- Fixed index stats reporting incorrect partition size ([lance#4847](https://github.com/lancedb/lance/issues/4847))
- Fixed blocking call in async function ([lance#4841](https://github.com/lancedb/lance/issues/4841))
- Fixed aggregate gauge metrics in `bytes_read` for zonemap scans ([lance#4830](https://github.com/lancedb/lance/issues/4830))
- Fixed 64-bit offset interpretation bug in 2.1 decompression ([lance#4824](https://github.com/lancedb/lance/issues/4824))
- Fixed handling of all-preamble chunks in mini-block scheduling ([lance#4823](https://github.com/lancedb/lance/issues/4823))
- Fixed scalar index handling with null literals ([lance#4815](https://github.com/lancedb/lance/issues/4815))
- Fixed multiple 2.1 list decoder bugs ([lance#4784](https://github.com/lancedb/lance/issues/4784), [lance#4840](https://github.com/lancedb/lance/issues/4840))
- Fixed variable width full-zip reading with repetition but no definition ([lance#4698](https://github.com/lancedb/lance/issues/4698))
- Fixed creating empty chunks when values are evenly divisible ([lance#4775](https://github.com/lancedb/lance/issues/4775))
- Fixed duplicated source rows in merge insert ([lance#4687](https://github.com/lancedb/lance/issues/4687))
- Fixed rechunk sequences bug ([lance#4695](https://github.com/lancedb/lance/issues/4695))
- Fixed deadlock when multiple threads access single `LanceFileWriter` ([lance#4600](https://github.com/lancedb/lance/issues/4600))
- Fixed FTS boolean and boost queries not supporting phrases ([lance#4766](https://github.com/lancedb/lance/issues/4766))
- Fixed `FlatMatchQuery` to support List of Utf8 ([lance#4742](https://github.com/lancedb/lance/issues/4742))
- Fixed circular reference in index caching causing memory leaks ([lance#4680](https://github.com/lancedb/lance/issues/4680))
- Fixed decoding lists with all nulls ([lance#4679](https://github.com/lancedb/lance/issues/4679))
- Fixed SIMD support detection for AArch64 on iOS/tvOS ([lance#4725](https://github.com/lancedb/lance/issues/4725))
- Fixed preview release version handling ([lance#4750](https://github.com/lancedb/lance/issues/4750))
- Fixed `shallow_clone` referring to wrong base path ([lance#4617](https://github.com/lancedb/lance/issues/4617))
- Fixed GPU cosine distance training in vector index ([lance#4623](https://github.com/lancedb/lance/issues/4623))
- Fixed inconsistent naming for `rows_per_zone` in zone map index ([lance#4692](https://github.com/lancedb/lance/issues/4692))

---

### Performance Improvements
- Cached `num_cpus::get()` calls ([lance#4768](https://github.com/lancedb/lance/issues/4768))
- Avoided per-IOP clone of filename ([lance#4714](https://github.com/lancedb/lance/issues/4714))
- Sped up `ProjectionPlan` generation for full schema ([lance#4743](https://github.com/lancedb/lance/issues/4743))
- Added incremental metrics in `FilteredRead` for better limit query performance ([lance#4798](https://github.com/lancedb/lance/issues/4798))

---

### Refactoring and Documentation
- Renamed `lance_table::format::Index` to `IndexMetadata` to avoid confusion ([lance#4760](https://github.com/lancedb/lance/issues/4760))
- Reworked scalar index loading, training, and parsing into plugin trait system ([lance#4584](https://github.com/lancedb/lance/issues/4584))
- Distinguished row ID and row address terminology (part 1) ([lance#4352](https://github.com/lancedb/lance/issues/4352))
- Added vector index specs documentation ([lance#4810](https://github.com/lancedb/lance/issues/4810))
- Added scalar and system index spec documentation ([lance#4736](https://github.com/lancedb/lance/issues/4736))
- Updated `performance.md` for index cache section ([lance#4738](https://github.com/lancedb/lance/issues/4738))
- Added timestamp precision control to logging and improved logging docs ([lance#4669](https://github.com/lancedb/lance/issues/4669))
- Split Python indexing code into smaller components ([lance#4763](https://github.com/lancedb/lance/issues/4763))
- Refactored Java transaction JNI code for readability ([lance#4662](https://github.com/lancedb/lance/issues/4662))
- Adjusted Java module directory structure ([lance#4668](https://github.com/lancedb/lance/issues/4668))

---

### Releases
- **v0.37.0** – September 23, 2025
- **v0.36.0** – September 12, 2025
- **v0.35.0** – September 3, 2025


## Aug 2025

Full-Text Search runs dramatically faster, and index creation is now easier to manage.

### Features

#### Full-Text Search (FTS): 3-8x Faster with Better Accuracy
LanceDB's Full-Text Search now delivers dramatically faster performance and more relevant results. Complex queries with _50-100 terms_ run **3-8x faster** with optimized algorithms, while improved caching and scoring ensure higher quality results at interactive speeds.

* **Long query optimization**: - Complex queries with 50-100 terms now execute 3-8x faster through WAND algorithm improvements. [lance#4576](https://github.com/lancedb/lance/pull/4576)

* **Smart query execution**: Automatic fallback between WAND and flat search based on selectivity, with configurable thresholds and block-level pruning to skip unpromising document blocks. [lance#4551](https://github.com/lancedb/lance/pull/4551), [lance#4570](https://github.com/lancedb/lance/pull/4570)

* **Precision-Ranked Results**: Benefit from more relevant search rankings thanks to fixes in our BM25 scoring algorithm, ensuring the best answers surface first. [lance#4525](https://github.com/lancedb/lance/pull/4525)

* **Performance telemetry removal**: Eliminated 80% overhead from hot paths, achieving 4-5x speedup. [lance#4536](https://github.com/lancedb/lance/pull/4536)

#### API & Usability Improvements

* **Paginated search results**: Support for `limit` and `offset` in both vector and full-text search queries.

* **Custom index names**: Users can now set custom names for indices via API and SQL. Setting `train=false` disables training for certain index types.

* **Empty index creation**: Introduced the ability to create empty scalar indices, enabling users to define index structures upfront without initial data. [lance#4033](https://github.com/lancedb/lance/pull/4033)

* **More storage control**: Added new configuration options for object store caching and behavior. [lance#4509](https://github.com/lancedb/lance/pull/4509) #enterprise

* **Configurable timeouts**: Set an overall request timeout for remote clients in Python and Node.js SDKs. This enhancement gives users more robust control over request reliability and latency. [lancedb#2550](https://github.com/lancedb/lancedb/pull/2550)

#### Performance & Efficiency
* **Streaming for large operations**:  Process massive `insert`, `merge`, and `create_table` requests without loading the entire dataset into memory.

* **Empty projection support**: Introduced support for empty projections in queries, allowing users to execute queries that return no columns. This enhancement is particularly useful for operations like `insert` or `delete`, where the focus is on modifying data without retrieving any results.

* **Optimized remote queries**: Improved performance for indexed queries by optimizing cache use and enabling remote filtered reads.

* **Scalar index prewarming**: Preload frequently accessed scalar indices into memory on server startup for faster cold starts. #enterprise

#### Observability & Debugging

* **Enhanced Merge Insert Observability**: Introduced `explain_plan` and `analyze_plan` functions for `merge_insert` operations, enabling users to visualize and assess the execution plan and performance metrics of merge operations.[lance#4295](https://github.com/lancedb/lance/pull/4295)

* **Detailed CPU metrics**: The `analyze_plan()` output now includes cumulative CPU time for each operator. [lance#4519](https://github.com/lancedb/lance/pull/4519)

* **Granular FTS controls**: New tuning knobs and metrics for full-text search provide deeper insight and predictable performance. [lance#4555](https://github.com/lancedb/lance/pull/4555), [lance#4560](https://github.com/lancedb/lance/pull/4560)


#### Stability & Reliability
* **Automatic conflict resolution for `delete`**: Delete operations now handle conflicts gracefully to ensure data integrity. [lance#4407](https://github.com/lancedb/lance/pull/4407)

* **Expression depth limit**: Implemented a safeguard to prevent panics from excessively deep filter expressions. [lance#4403](https://github.com/lancedb/lance/pull/4403)

#### Cloud UI Improvement
* **Visual index creation**: Cloud users can create vector, scalar, and FTS index through an intuitive UI workflow.

---

### Bug Fixes

* **FTS Cache Performance**: Fixed a critical memory sizing issue that was causing premature cache evictions, increasing cache hit rates from ~5% to over 80% for dramatically faster repeated queries. [lance#4513](https://github.com/lancedb/lance/pull/4513)

* **File Reading Stability**: Resolved a panic that could occur when attempting to read from a file after its last row had been deleted.[#lance4452](https://github.com/lancedb/lance/pull/4452)

* **Search Cache Integrity**: Fixed cache conflicts between different data partitions that could lead to inconsistent search results and degraded performance.[#lance4490](https://github.com/lancedb/lance/pull/4490)

* **Accurate Performance Metrics**: Corrected inaccurate elapsed time reporting for IVF index nodes, ensuring reliable performance monitoring.[#lance4491](https://github.com/lancedb/lance/pull/4491)

* **Avoided column name collision in `merge_insert`**: Prevented potential column name conflicts in `merge_insert` operations by renaming an internal column, ensuring smooth data ingestion.[#lance4499](https://github.com/lancedb/lance/pull/4499)

* **Fixed index out-of-bounds error in posting iterator**: Fixed an index out-of-bounds error in the posting list iterator that could cause crashes during vector search queries. [#lance4587](https://github.com/lancedb/lance/pull/4587)

* **Fixed BTree Prewarm Offset Overflow**: Resolved an offset overflow issue when prewarming BTree indices, preventing crashes during startup.

* **Azure Cache Isolation**: Fixed a critical bug where databases with identical names in different Azure storage accounts were sharing a cache, preventing potential data corruption. #enterprise

* **Fixed incorrect boolean filter results**: Fixed bugs in negative filters (NOT EQUAL) that could cause missing rows or duplicates, ensuring accurate query results.

* **Fixed performance regression in indexed point lookups**: Resolved a regression that caused efficient indexed point lookups to incorrectly fall back to slow full table scans.


## July 2025

Performance improvements across vector search and indexing and enhanced Cloud UI.

### Features

#### Performance Optimizations
* **HNSW-Accelerated Partition Computation:** Partition computation is now accelerated with HNSW (Hierarchical Navigable Small World), cutting end-to-end indexing time by up to 50%. The optimization maintains high recall while significantly reducing CPU and memory usage during index creation. [lance#4089](https://github.com/lancedb/lance/pull/4089)

* **Up to 500× Faster Range Queries:** Range queries like "value >= 1000 and value < 2000" on 1M int32 values now execute in 100µs instead of 50ms, dramatically boosting hybrid search performance. [lance#4248](https://github.com/lancedb/lance/pull/4248)

* **Faster L2 Distance Computation:** >10% speedup in vector search by optimizing common-dimension batch L2 operations. [lance#4321](https://github.com/lancedb/lance/pull/4321)

* **B-tree Index Prewarm:** Frequently accessed index pages are now proactively cached in memory, improving query latency. [lance#4235](https://github.com/lancedb/lance/pull/4235)

* **Faster Merge Insert Updates:** Improved update-only operations with optimized join strategy—speeding up data merges with conditional logic. [lance#4253](https://github.com/lancedb/lance/pull/4253)

#### Infrastructure and Deployment Enhancements
* **Improved Cloud Load Balancing:** Better tenant isolation and fault tolerance across query nodes.

* **Streaming Ingestion with Automatic Index Optimization:** Automatic index updates during streaming ingestion for consistent performance. No block on other operations on the table, such as compaction.

* **Storage Handle Reuse:** Reduced overhead for bulk table creation by fixing excessive object store handle creation. [lancedb#2505](https://github.com/lancedb/lancedb/pull/2505)

* **GCP Autoscaling Support:** Enabled autoscaling in GCP deployments to automatically adjust resources based on demand, ensuring optimal performance and cost efficiency for customer's workloads. #enterprise

#### SDK and API 
* **Session-Based Cache Control:**  Python and TypeScript users can now customize caching behavior per session—ideal for large datasets and enterprise deployments. [lancedb#2530](https://github.com/lancedb/lancedb/pull/2530). Specifically:

  * **Automatic Conflict Resolution for Updates:** Update operations now support retries with exponential backoff to handle concurrent writes. [lance#4167](https://github.com/lancedb/lance/pull/4167)

  * **Multi-Vector Support (JavaScript):** Added multivector support to the JavaScript/TypeScript SDK. [lancedb#2527](https://github.com/lancedb/lancedb/pull/2527)

  * **Ngram Tokenizer for FTS:** Flexible tokenization for full-text search, supporting languages and use cases with partial or fuzzy matches. [lancedb#2507](https://github.com/lancedb/lancedb/pull/2507)

#### Cloud UI and User Experience
* **LanceDB Cloud UI Improvements:**  
    * **Enhanced Table Data Preview:** Added column filtering capabilities to the table data preview, enabling users to filter data with SQL and select only the columns they want to view.
    * **Multi-Organization Support:** Seamlessly switch between orgs at login for easier team collaboration and access control.

#### Documentation & Guides
* **[Multimodal Lakehouse Documentation](https://lancedb.github.io/geneva/):** New examples and guides for Geneva-powered feature engineering and multimodal workflows.

---

### Bug Fixes

#### Full-Text Search (FTS) Fixes
* **Index Creation Stability:** Fixed errors when entire FTS posting lists were deleted.[lance#4156](https://github.com/lancedb/lance/pull/4156)

* **Token Set Remapping:** Ensures proper index consistency when updating FTS data.[lance#4180](https://github.com/lancedb/lance/pull/4180)

* **Phrase Query Precision Fix:** Addressed floating point precision issues to avoid missed results; also fixed decompression edge cases. [lance#4223](https://github.com/lancedb/lance/pull/4223)

* **Phrase Query Error Message Fix:** Returns more informative error when phrase queries lack position support. [lance#4342](https://github.com/lancedb/lance/pull/4342) 

#### Index and Query 
* **B-tree Redundant Page Loads:** Eliminated duplicate page loads for better scalar index performance. [lance#4246](https://github.com/lancedb/lance/pull/4246)

* **Filtered Read Pagination Fix:** Respects `offset`/`limit` for pagination even when rows are deleted. [lance#4351](https://github.com/lancedb/lance/pull/4351)

#### SDK and API
* **Schema Alignment with Missing Columns:** Fixed a Node.js bug where schema alignment would fail when using embedding functions with Arrow table inputs that had missing columns. [lancedb#2516](https://github.com/lancedb/lancedb/pull/2516)

* **Python nprobes Fix:** Resolves validation errors when setting both min and max nprobes. [lancedb#2556](https://github.com/lancedb/lancedb/pull/2556)

* **Empty List Table Creation Fix:** Fixed crashes when creating tables from empty lists with predefined schemas.

 [lancedb#2548](https://github.com/lancedb/lancedb/pull/2548)

#### Data Consistency
* **Dataset Version Race Condition:** Prevents version rollbacks during concurrent queries. [lancedb#2479](https://github.com/lancedb/lancedb/pull/2479)

* **Case-Insensitive Filter Comparison Fix:** Ensures accurate matching for string filters regardless of text case.[lance#4278](https://github.com/lancedb/lance/pull/4278)

## June 2025

More advanced features added to Full-text Search and optimized BYOC deployment.

### Features

* **Full-Text Search (FTS) Enhancements:**  
  Expanded FTS capabilities with:
    * [Boolean logic for FTS](../guides/search/full-text-search.html#boolean-queries): Combine filters using `SHOULD`, `MUST`, and `MUST_NOT` for expressive, intuitive search. (Python users can also use `AND`/`OR` or `&`/`|`.)
    * [Flexible phrase matching](../guides/search/full-text-search.html#flexible-phrase-match): Phrase queries now support the `slop` parameter, allowing matches where terms are close together but not necessarily adjacent or in exact order, enabling typo-tolerant and flexible phrase search.
    * [Autocomplete-ready prefix search](../guides/search/full-text-search.html#prefix-based-match): Search for documents containing words that start with a specific prefix, enabling partial word and autocomplete-style queries (e.g., searching for "mach" matches "machine", "machinery", etc.).
    * Faster, smarter full-text indexing: Compression and optimized algorithms speed up index builds and boost search performance at scale.

* **Native Helm Chart Support:**  
  Added native Helm chart deployment for Kubernetes, streamlining BYOC (Bring Your Own Cloud) deployments and improving infrastructure management. #enterprise

* **KNN Scan Pushdown Optimization:**  
  Improved vector search performance and reduced memory usage by supporting KNN scan pushdown. #enterprise

* **Query Resource Limits:**  
  Introduced concurrent request limits and scan row constraints to prevent resource exhaustion and maintain system stability under high load. #enterprise

* **Improved Vector Search with Selective Filters:**  
  Split `nprobes` into `minimum_nprobes` and `maximum_nprobes` for more efficient vector search. The system starts with `minimum_nprobes` and increases up to `maximum_nprobes` if not enough results are found. [lancedb#2430](https://github.com/lancedb/lancedb/pull/2430)

* **Cloud Guardrails:**  
  Enforced API payload limits (100MB) to prevent heavy workloads from degrading cloud service quality, with extra checks on `merge_insert` to avoid introducing large workloads.

---

### Bug Fixes

* **Embedding Function Error with Existing Vector Column:**  
  Fixed a TypeScript SDK error when adding data that already includes the vector column and a registered embedding function is present. [lancedb#2433](https://github.com/lancedb/lancedb/pull/2433)

* **`create_table` Errors with Existing Tables:**  
  Fixed errors when using `create_table` with `mode=overwrite` or `exists_ok=true` on an existing table.

* **Indexing Skipped with Certain Compaction Configurations:**  
  Fixed an issue where indexing criteria were not included in `lance_agent`, causing the index to not be created as expected under certain compaction settings.

* **Failed Login After Changing Account:**  
  Fixed a login failure that occurred when a user signed up for LanceDB Cloud, dropped out, and then rejoined an organization with the same email via an invite.

* **Column Disordering in KNN Scanning:**  
  Fixed an error in plans that union indexed and unindexed data, where the KNNScan node returned data in a different order than its output schema. #enterprise

* **Divide-by-Zero on Empty Table:**  
  Fixed an issue where creating an index failed on an empty table, either after deleting the last row or when creating an index on an already empty table.


## May 2025

Revamped LanceDB Cloud onboarding, added Umap visualization and improved performance for `upsert` 

### Features
* **Reduced Commit Conflict Upsert**: Upsert operations to the same table are now designed to be conflict-free under typical concurrent workloads, enabling more reliable and higher-throughput parallel data ingestion and updates.
    * Added timeout parameter for `merge_insert` for better control over long-running upserts [\[lancedb#2378\]](https://github.com/lancedb/lancedb/pull/2378)
* **Reduced IOPS to object store**:
    * Optimized I/O Patterns for small tables: Significant improvements reduce total IOPS to the object store by up to 95%, especially benefiting small-table workloads. [\[lance#3764\]](https://github.com/lancedb/lance/pull/3764)
    * Scan cache: Introduced a scan cache to further minimize object store IOPS and accelerate query performance. #enterprise 
* **Faster & More Reliable Indexing**: 
    * Indexing is now more robust and efficient, with dynamic job sizing based on table and row size, plus increased retry logic for reliability.
    * IVF_PQ indexing performance: Eliminated unnecessary data copying during index creation, resulting in faster PQ training and reduced memory usage. [\[lance#3894\]](https://github.com/lancedb/lance/pull/3894)
* **Configurable Scan Concurrency**: Query nodes now support configurable concurrency limits for scan requests to plan executors, allowing for better resource management in enterprise deployments. #enterprise
    * New `grpc.concurrency_limit_per_connection` setting in the plan executor for fine-grained control.
* **Improved Enterprise Deployment**:
    * Automate deployment for AWS environments, making setup and scaling easier for enterprise users. 
    * GCP deployments now support configuration of weak consistency and concurrency limits for greater flexibility and cost control.
* **Filter on `large_binary` column**: Users can now filter on large binary columns in their queries. [\[lance#3797\]](https://github.com/lancedb/lance/pull/3797)
* **LanceDB Cloud UI**:
    * Revamped Cloud Onboarding: Streamlined LanceDB Cloud onboarding for a smoother user experience.
    * Added UMAP visualization to help users visually explore embeddings in their tables.


---

### Bug Fixes
* **Upsert Page Size Calculation**: Page size for upsert operations now correctly considers pod memory instead of node memory, reducing the risk of out-of-memory errors in the plan executor. #enterprise
* **Scalar Index**: 
    * Fixed incremental indexing for `LABEL_LIST` columns, ensuring scalar indices are updated correctly on data changes.
    * Addressed a bug in bitmap scalar index remapping, so partial remapping during compaction no longer drops rows unexpectedly.
* **Partition Count for Small Tables**: Improved partitioning logic ensures the correct number of partitions for small tables, leading to more efficient queries.
* **Accurate Error for Non-Existent Index**: Dropping a non-existent index now returns an IndexNotFound error (instead of a TableNotFound error). [\[lancedb#2380\]](https://github.com/lancedb/lancedb/pull/2380)
* **Index Consistency After Horizontal `merge_insert`**: Any index fragments associated with modified data are now properly removed during a horizontal merge_insert, preventing index corruption and ensuring indices always reflect the current state of the data. [\[lancedb#3863\]](https://github.com/lancedb/lancedb/pull/3863)
* **Fixed issues in create_index with empty tables**: 
    * Resolved an error that could occur when performing operations such as deleting the last row or creating an index on an empty table. The function now safely handles empty tables, preventing division-by-zero errors during these events.
    * Corrected a bug where events could be dropped if processed in the same batch as other events for empty tables. This was caused by Lance datasets evaluating to False when empty; the check now properly distinguishes between None and empty datasets, ensuring all events are processed as intended.

## April 2025

Enhanced Performance and Improved Version Control

### Features
* **Reduced Commit Conflicts**: Mitigated upsert-induced table conflicts through client/server-side retry mechanisms.
* **New SDK APIs**:
    * `table.tags.create/list/update/delete/checkout`: Enables semantic versioning through intuitive tagging instead of numeric versioning
    * `wait_for_index`: Ensures complete data indexing with configurable `wait_timeout`.
* **Performance Improvements**:
    * **Query Latency**: Eliminated full cache ring scans when nodes < replication factor.
    * **Full-Text Search**: Introduced configurable FTS index prewarming to accelerate search operations. #enterprise
    * **Table Creation**: Leveraged cached database connections to reduce overhead—ideal for bulk table creation scenarios.
* **Session-Level Object Store Caching**: Shared connection pools via weak references to object stores. Example: 100 tables → 1 S3 connection pool.
* **IVF_PQ float64 support**: Expanded vector indexing to float64 datasets (previously limited to float16/32).
* **Full-text search on string arrays**: Extended full-text search to support string array columns for efficient multi-value keyword search.
* **UI - Enhanced Table Preview**:
    * One-click vector copying from cells
    * Full row expansion on click (no truncation)
    * Consistent right-panel binary data display
* **UI - Direct Page Navigation**: Added page selector for instant access to specific data pages in table preview.

---

### Bug Fixes
* **Query Performance**:
    * Fixed hybrid search distance range filtering to properly respect lower and upper bounds. [\[lancedb#2356\]](https://github.com/lancedb/lancedb/pull/2356)
    * Enforced valid `k` parameters to prevent overflow. [\[lancedb#2354\]](https://github.com/lancedb/lancedb/pull/2354)
    * `BETWEEN clause`: Improved BETWEEN query handling to return 0 results when `start` > `end` instead of panicking. [\[lance#3706\]](https://github.com/lancedb/lance/pull/3706)
* **SDK/API Fixes**:
    * Fixed TypeScript SDK support for FTS advanced features (fuzzy search and boosting). [\[lancedb#2314\]](https://github.com/lancedb/lancedb/pull/2314)
    * Added scalar index support for small FixedSizeBinary columns (e.g., UUID). [\[lancedb#2297\]](https://github.com/lancedb/lancedb/pull/2297)
* **Index**:
    * Fixed IVF_PQ index on vector columns with NaN/INFs. [\[lance#3648\]](https://github.com/lancedb/lance/pull/3648)
    * Resolved GPU-based indexing crashes on non-contiguous arrays. [\[lance#3675\]](https://github.com/lancedb/lance/pull/3675) #enterprise
    * Fixed B-tree index corruption during null remapping. [\[lance#3704\]](https://github.com/lancedb/lance/pull/3704)
* **Cloud Dashboard**: Optimized chart rendering for better visibility in the Cloud usage dashboard.

## March 2025

Enhanced Full-Text Search and Advanced Query Debugging Features

### Features
* **Enhanced Full-Text Search (FTS): Fuzzy Search & Boosting Now Available**: it improves user experience with resilient, typo-tolerant searches and can surface the most contextually relevant results faster.
* **New SDK APIs**: 
    * `explain_plan`: Diagnose query performance and debug unexpected results by inspecting the execution plan.
    * `analyze_plan`: Analyze query execution metrics to optimize performance and resource usage. Such metrics include execution time, number of rows processed, I/O stats, and more.
    * `restore`: Revert to a specific prior version of your dataset and modify it from a verified, stable state.
* **Scalar Indexing for Extended Data Types**: LanceDB now supports scalar indexing on UUID columns of FixedSizeBinary type.
* **Binary vector support in TypeScript SDK**: LanceDB's TypeScript SDK now natively supports binary vector indexing and querying with production-grade efficiency.
* **Support S3-compatible object store**: Extended LanceDB Enterprise deployment to work with S3-compatible object stores, such as Tigris, Minio and etc. #enterprise

---

### Bug Fixes
* **Improved Merge insert performance**: Enhanced the merge-insert operation to reduce error rates during upsert operations, improving data reliability.[\[lance#3603\]](https://github.com/lancedb/lance/pull/3603).
* **Batch Ingestion Error**: Updated error codes for batch ingestion failures from 500 to 409 to accurately reflect resource conflict scenarios.
* **Cloud Signup Workflow Fix**: Resolved an issue where users encountered a blank page after organization creation during the Cloud signup process.
* **Table Preview Data Display Issue**: Fixed a bug causing the table preview page to show a generic "Something went wrong" error for datasets containing `datetime` columns, which previously prevented data inspection.
* **Rate Limit Error Clarity**: Added explicit error messaging for system rate limits (e.g., API keys per table), replacing vague notifications that confused users.

## February 2025

Multivector Search ready and Table data preview available in Cloud UI

### Features
* **Multivector Search is now live**: documents can be stored as contextualized vector lists. Fast multi-vector queries are supported at scale, powered by our XTR optimization.
* **`Drop_index` added to SDK**: users can remove unused or outdated indexes from your tables.
* **Explore Your Data at a Glance**: preview sample data from any table with a single click. #lancedb-cloud
* **Search by Project/Table in Cloud UI**: allow users to quickly locate the desired project/table. #lancedb-cloud

---

### Bug Fixes
* **FTS stability fix**: Resolved a crash in Full Text Search (FTS) during flat-mode searches.
* **`prefilter` parameter enforcement**: Fixed a bug where the prefilter parameter was not honored in FTS queries.
* **Vector index bounds error**: Addressed an out-of-bounds indexing issue during vector index creation.
* **`distance_range()` compatibility**: Fixed errors when performing vector searches with `distance_range()` on unindexed rows.
* **Error messaging improvements**: Replaced generic HTTP 500 errors with detailed, actionable error messages for easier debugging.

## January 2025

Support Hamming Distance and GPU based indexing ready

### Features
* **Support Hamming distance and binary vector**: Added `hamming` as a distance metric (joining `l2`, `cosine`, `dot`) for binary vector similarity search.
* **GPU-Accelerated IVF-PQ indexing**: Build IVF-PQ indexes 10x faster. #enterprise
* **AWS Graviton 4 & Google Axion build optimizations**: ARM64 SIMD acceleration cuts query costs. #enterprise
* **float16 Vector Index Supports**: reduce storage size while maintaining search quality.
* **Self-Serve Cloud Onboarding**: new workflow-based UI guides users for smooth experience. #lancedb-cloud

---

### Bug Fixes
* `list_indices` and `index_stats` now always fetch the latest version of the table by default unless a specific version is explicitly provided.
* **Error message fix**: Improved clarity for cases where `create_index` is called to create a vector index on tables with fewer than 256 rows.
* **TypeScript SDK fixes**: Resolved an issue where `createTable()` failed to correctly save embeddings and for `mergeInsert` not utilizing saved embeddings. [lancedb#2065](https://github.com/lancedb/lancedb/pull/2065)
* **Multi-vector schema inference**: Addressed an issue where the vector column could not be inferred for multi-vector indexes. [lancedb#2026](https://github.com/lancedb/lancedb/pull/2026)
* **Hybrid search consistency**: Fixed a discrepancy where hybrid search returned distance values inconsistent with standalone vector search. [lancedb#2061](https://github.com/lancedb/lancedb/pull/2061)

## December 2024

Performant SQL queries at scale and more cost-effective vector search

### Features
* **Run SQL with massive datasets**: added Apache Arrow flight-SQL protocol to run SQL queries with billions of data and return in seconds. #enterprise
* **Accelerate vector search**: added our Quantinized-IVF algorithm and other optimization techniques to improve QPS/core. #enterprise
* **Azure Stack Router Deployment**: route traffic efficiently to serve low query latency. #enterprise
* **Distance range filtering**: filter query results using `distance_range()` to return search results with a lowerbound, upperbound or a range [\[lance#3326\]](https://github.com/lancedb/lance/pull/3326).
* **Full-Text Search(FTS) indexing options**: configure tokenizers, stopword lists and more at FTS index creation.

---

### Bug Fixes
* **Full-text search parameters**: Fixed an issue where full-text search index configurations were not applied correctly. [lancedb#1928](https://github.com/lancedb/lancedb/pull/1928)
* **Float16 vector queries**: Addressed a bug preventing the use of lists of Float16 values in vector queries. [lancedb#1931](https://github.com/lancedb/lancedb/pull/1931)
* **Versioned `checkout` API**: Resolved inconsistencies in the `checkout` method when specifying the `version` parameter. [lancedb#1988](https://github.com/lancedb/lancedb/pull/1988)
* **Table recreation error**: Fixed an issue where dropping and recreating a table with the same name resulted in a table creation error.