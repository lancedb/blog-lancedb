---
title: "Storage Management and Optimization"
sidebar_title: "Storage Management"
description: "Comprehensive guide to managing disk usage, optimizing table storage, and understanding the relationship between versioning and storage in LanceDB. Includes best practices for efficient data operations."
weight: 4
aliases: ["/docs/concepts/tables/storage-management/", "/docs/concepts/tables/storage-management"]
---

## Overview

As your LanceDB tables grow and evolve through inserts, updates, and deletes, understanding storage management becomes essential for maintaining optimal performance and controlling disk usage. This guide explains how LanceDB's storage works, the relationship between versioning and disk space, and proven strategies for managing storage efficiently at scale.

{{< admonition tip "Quick Solution" >}}
Running `table.optimize()` compacts your data, merges fragments, and significantly reduces storage usage while improving query performance. This operation is the primary tool for storage management in LanceDB.
{{< /admonition >}}

## Understanding Storage Growth in LanceDB

### How Versioning Affects Storage

LanceDB automatically versions every table operation—appends, updates, deletions, and schema changes. This versioning system provides powerful capabilities like time-travel debugging and atomic rollbacks, but it also has storage implications.

**Key points about versions:**

- Each version contains **metadata** plus the **new/updated data** from that transaction
- Versions are **not full duplicates** of your data
- However, 100 versions means **100x the metadata overhead** of a single version
- Old data fragments remain on disk until compaction

### Common Causes of Storage Growth

LanceDB tables can grow significantly when operations accumulate without periodic optimization:

1. **Multiple fragments**: Each insert operation can create new data fragments
2. **Version metadata**: Each operation increments the version and adds metadata
3. **Deleted row markers**: Updates and deletes don't immediately remove old data
4. **Unmerged fragments**: Small fragments accumulate without automatic merging

**Example of inefficient insertion pattern:**
```python
# This pattern creates many small fragments and versions
for i in range(1000):
    table.add([{"id": i, "vector": embedding, "text": f"Item {i}"}])
    # Each add creates a new fragment and version!
```

This approach results in:
- 1000+ fragments (many very small)
- 1000+ versions with associated metadata
- Significant storage overhead that can be avoided

## The Solution: Table Optimization and Compaction

### What `table.optimize()` Does

The `optimize()` function performs **compaction**, which:

1. ✅ **Removes deleted rows** from fragments
2. ✅ **Removes dropped columns** from fragments  
3. ✅ **Merges small fragments** into larger, more efficient ones
4. ✅ **Reduces metadata overhead**
5. ✅ **Improves query performance**

{{< admonition note "Compaction Creates a New Version" >}}
Running `optimize()` creates a new table version. This is a system operation that consolidates your data into a more efficient format.
{{< /admonition >}}

### Measuring Storage Impact

Here's how to measure the storage impact of optimization:

{{< code language="python" >}}
import os
import lancedb
import numpy as np

def get_directory_size(path):
    """Calculate total directory size in bytes."""
    total = 0
    try:
        for entry in os.scandir(path):
            if entry.is_file():
                total += entry.stat().st_size
            elif entry.is_dir():
                total += get_directory_size(entry.path)
    except PermissionError:
        pass
    return total

# Connect to database
db = lancedb.connect("./my_lancedb")

# Create sample data
data = [
    {"id": i, "vector": np.random.rand(128).tolist(), "text": f"Item {i}"}
    for i in range(10000)
]

# Create table with initial data
table = db.create_table("items", data=data[:1000], mode="overwrite")

# Add data in batches
for i in range(1, 10):
    batch = data[i*1000:(i+1)*1000]
    table.add(batch)

# Check storage before optimization
size_before = get_directory_size("./my_lancedb")
print(f"Storage before optimization: {size_before / 1024**2:.2f} MB")
print(f"Number of versions: {len(table.list_versions())}")

# Optimize the table
table.optimize()

# Check storage after optimization
size_after = get_directory_size("./my_lancedb")
print(f"Storage after optimization: {size_after / 1024**2:.2f} MB")
print(f"Reduction: {((size_before - size_after) / size_before) * 100:.1f}%")
print(f"Number of versions: {len(table.list_versions())}")
{{< /code >}}

{{< code language="typescript" >}}
import * as lancedb from "@lancedb/lancedb";
import * as fs from "fs";

async function getDirectorySize(dirPath: string): Promise<number> {
  let totalSize = 0;
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = `${dirPath}/${file.name}`;
    if (file.isDirectory()) {
      totalSize += await getDirectorySize(filePath);
    } else {
      totalSize += fs.statSync(filePath).size;
    }
  }
  return totalSize;
}

// Connect to database
const db = await lancedb.connect("./my_lancedb");

// Create initial data
const initialData = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  vector: Array.from({ length: 128 }, () => Math.random()),
  text: `Item ${i}`,
}));

const table = await db.createTable("items", initialData, { mode: "overwrite" });

// Add data in batches
for (let i = 1; i < 10; i++) {
  const batch = Array.from({ length: 1000 }, (_, j) => ({
    id: i * 1000 + j,
    vector: Array.from({ length: 128 }, () => Math.random()),
    text: `Item ${i * 1000 + j}`,
  }));
  await table.add(batch);
}

// Check storage before optimization
const sizeBefore = await getDirectorySize("./my_lancedb");
console.log(`Storage before optimization: ${(sizeBefore / 1024 ** 2).toFixed(2)} MB`);
console.log(`Number of versions: ${(await table.listVersions()).length}`);

// Optimize the table
await table.optimize();

// Check storage after optimization
const sizeAfter = await getDirectorySize("./my_lancedb");
console.log(`Storage after optimization: ${(sizeAfter / 1024 ** 2).toFixed(2)} MB`);
console.log(`Reduction: ${(((sizeBefore - sizeAfter) / sizeBefore) * 100).toFixed(1)}%`);
console.log(`Number of versions: ${(await table.listVersions()).length}`);
{{< /code >}}

**Typical results:**
- Storage reduction: 60-95% depending on workload
- Fragment count: Reduced to < 100 fragments
- Query performance: 2-10x faster on optimized tables

## Best Practices for Storage Management

### 1. Use Batch Inserts

**❌ Avoid single-row inserts:**
```python
# This creates many small fragments
for item in items:
    table.add([item])  # Creates a new fragment each time
```

**✅ Use batch inserts instead:**
```python
# This creates fewer, larger fragments
batch_size = 1000
for i in range(0, len(items), batch_size):
    batch = items[i:i+batch_size]
    table.add(batch)
```

### 2. Regular Optimization Schedule

For workloads with frequent updates:

{{< code language="python" >}}
# Option 1: Optimize after bulk operations
table.add(large_batch)
table.optimize()

# Option 2: Periodic optimization
import schedule
import time

def optimize_tables():
    db = lancedb.connect("./my_lancedb")
    for table_name in db.table_names():
        table = db.open_table(table_name)
        table.optimize()
        print(f"Optimized {table_name}")

# Run optimization daily at 2 AM
schedule.every().day.at("02:00").do(optimize_tables)

while True:
    schedule.run_pending()
    time.sleep(3600)
{{< /code >}}

{{< code language="typescript" >}}
// Optimize after bulk operations
await table.add(largeBatch);
await table.optimize();

// Periodic optimization with node-cron
import cron from "node-cron";

async function optimizeTables() {
  const db = await lancedb.connect("./my_lancedb");
  const tableNames = await db.tableNames();
  
  for (const tableName of tableNames) {
    const table = await db.openTable(tableName);
    await table.optimize();
    console.log(`Optimized ${tableName}`);
  }
}

// Run optimization daily at 2 AM
cron.schedule("0 2 * * *", optimizeTables);
{{< /code >}}

### 3. Monitor Fragment Count

Keep your fragment count under 100 for optimal performance:

{{< code language="python" >}}
import lancedb

db = lancedb.connect("./my_lancedb")
table = db.open_table("my_table")

# Get table statistics (if available in your LanceDB version)
stats = table.stats
if hasattr(stats, 'num_fragments'):
    print(f"Fragment count: {stats.num_fragments}")
    
    if stats.num_fragments > 100:
        print("⚠️  Fragment count high - running optimization...")
        table.optimize()
{{< /code >}}

{{< code language="typescript" >}}
const db = await lancedb.connect("./my_lancedb");
const table = await db.openTable("my_table");

// Monitor and optimize based on fragment count
// (exact API may vary by version)
const stats = await table.stats();
console.log(`Fragment count: ${stats.numFragments}`);

if (stats.numFragments > 100) {
  console.log("⚠️  Fragment count high - running optimization...");
  await table.optimize();
}
{{< /code >}}

### 4. Optimize Options

You can customize the optimization process:

{{< code language="python" >}}
# Basic optimization
table.optimize()

# Optimize with custom settings (check your LanceDB version for available options)
table.optimize(
    target_rows_per_fragment=1024 * 1024,  # Target 1M rows per fragment
    max_rows_per_group=1024,               # Rows per group within fragments
)
{{< /code >}}

{{< code language="typescript" >}}
// Basic optimization
await table.optimize();

// Optimize with custom settings
await table.optimize({
  targetRowsPerFragment: 1024 * 1024,  // Target 1M rows per fragment
  maxRowsPerGroup: 1024,               // Rows per group within fragments
});
{{< /code >}}

## Understanding Versions and Storage

### Versions Don't Duplicate Data

It's important to understand that versions in LanceDB are **lightweight**:

- Version 1: Contains full data + metadata
- Version 2: Contains only **changes** from version 1 + metadata
- Version 3: Contains only **changes** from version 2 + metadata

This is similar to Git commits—each version tracks deltas, not full copies.

### When to Keep Versions

Versions are valuable for:

- **Reproducibility**: Recreate exact training/inference states
- **Debugging**: Time-travel to investigate production issues
- **Rollback**: Revert bad updates or schema changes
- **Compliance**: Maintain audit trails

### Version Metadata Overhead

While individual versions are lightweight, metadata accumulates:

- Each version has manifest files, transaction logs
- 100 versions = 100x the metadata files
- This metadata must be scanned during queries
- More versions = slower metadata operations

**This is why optimization matters**—it consolidates versions and reduces metadata overhead.

## Versioning and Storage Configuration

Versioning is a core architectural feature of LanceDB and the Lance format, providing:

- ACID transactions
- Concurrent reads/writes
- Consistency guarantees
- Time-travel capabilities

**Important**: Versioning cannot be fully disabled as it's fundamental to LanceDB's operation. However, storage growth from versioning can be effectively managed through optimization strategies.

### Strategies for Minimizing Versioning Overhead

For environments where storage efficiency is critical:

**1. Aggressive Optimization**
```python
# Optimize immediately after bulk operations
table.add(data)
table.optimize()
```

**2. Table Replacement for Static Data**
```python
# For datasets that don't require version history
db.drop_table("my_table")
db.create_table("my_table", new_data)
```

**3. Cloud Storage Options**
For large-scale deployments, LanceDB Cloud or cloud object storage backends (S3, GCS, Azure Blob) provide efficient storage management with built-in optimization capabilities.

{{< admonition info "Future Enhancements" >}}
The LanceDB team is continually working on storage optimizations. Features like automatic compaction and version retention policies may be added in future releases. Check the [changelog](/docs/changelog) for updates.
{{< /admonition >}}

## Troubleshooting Storage Issues

### Problem: Unexpectedly Large Database Directory

**Symptoms:**
- Database directory larger than expected for the dataset size
- Disk space filling up faster than anticipated
- Many small files in Lance data directory

**Solution:**
```python
import lancedb

db = lancedb.connect("./my_lancedb")
table = db.open_table("my_table")

# Check version count
versions = table.list_versions()
print(f"Total versions: {len(versions)}")

# Optimize to compact
print("Running optimization...")
table.optimize()

# Verify improvement
print(f"New version count: {len(table.list_versions())}")
print("Storage should be significantly reduced")
```

### Problem: Limited Storage Reduction After Optimization

**Possible causes:**

1. **Optimization created a new version** (expected behavior)
   - The optimization operation itself adds a version
   - Previous version data may still be present temporarily

2. **Filesystem space reclamation delay**
   - Some filesystems delay releasing freed space
   - Monitor over several minutes to see final impact

3. **Appropriate storage for data size**
   - Large datasets with high-dimensional vectors naturally require significant space
   - Consider compression or quantization techniques for additional reduction

### Problem: Too Many Versions Slowing Queries

**Symptoms:**
- Queries slower than expected
- Metadata operations taking longer
- High I/O during simple queries

**Solution:**
```python
# Check version count
table = db.open_table("my_table")
version_count = len(table.list_versions())

if version_count > 100:
    print(f"Warning: {version_count} versions detected")
    print("Running optimization to consolidate...")
    table.optimize()
```

### Problem: Optimize Takes Too Long

For very large tables, optimization can be time-consuming:

**Strategies:**

1. **Run during off-peak hours**
   ```python
   # Schedule optimization during maintenance windows
   import schedule
   schedule.every().sunday.at("01:00").do(table.optimize)
   ```

2. **Optimize incrementally**
   - Add data in smaller batches
   - Optimize after each batch
   - Prevents massive cleanup jobs

3. **Use LanceDB Cloud/Enterprise**
   - Automatic background optimization
   - No downtime required
   - Managed maintenance windows

## Storage Management Checklist

Use this checklist for optimal storage management:

- [ ] **Use batch inserts** (≥1000 rows per batch when possible)
- [ ] **Run `optimize()` after bulk operations**
- [ ] **Schedule regular optimization** (daily/weekly based on write volume)
- [ ] **Monitor fragment count** (keep under 100 fragments)
- [ ] **Monitor version count** (optimize if > 50-100 versions)
- [ ] **Profile storage usage** regularly
- [ ] **Consider cloud storage** for large datasets
- [ ] **Document optimization schedule** in runbooks

## LanceDB Cloud: Automatic Optimization

{{< admonition tip "LanceDB Cloud" >}}
[LanceDB Cloud](https://lancedb.com/cloud) automatically handles compaction and optimization in the background:

- **Zero-downtime optimization**: Tables remain queryable during compaction
- **Automatic scheduling**: Runs optimization based on workload patterns  
- **Storage efficiency**: Managed storage with automatic cleanup
- **No manual intervention**: Set it and forget it

This eliminates the need for manual storage management scripts.
{{< /admonition >}}

## Performance Impact of Optimization

### Query Performance Improvements

After optimization, expect:

- **2-10x faster scans** on large tables
- **Reduced metadata overhead** for all operations
- **Better cache utilization** due to fewer, larger fragments
- **Lower I/O** from reading consolidated files

### Optimization Performance Characteristics

- **Time**: ~1-5 minutes per GB of data (varies by hardware)
- **I/O**: Reads entire table, writes compacted version
- **CPU**: Moderate CPU usage during merge operations
- **Memory**: Requires memory for sorting and merging

**Recommendation**: For tables > 100GB, run optimization during scheduled maintenance windows.

## Related Topics

- [Table Versioning](/docs/tables/versioning): Deep dive into LanceDB's versioning system
- [Lance Format](/docs/overview/lance): Understanding the underlying columnar format
- [Indexing](/docs/indexing): Creating and maintaining indexes
- [Query Optimization](/docs/search/optimize-queries): Improving query performance

## Summary

Effective storage management in LanceDB requires understanding how versioning and fragments affect disk usage:

- **Storage growth is expected** with frequent operations due to versioning and fragment creation
- **`table.optimize()` is the primary tool** for compacting data and reducing storage overhead
- **Batch inserts** are more efficient than single-row operations
- **Regular optimization** should be part of your maintenance routine
- **Versioning is fundamental** to LanceDB's architecture and provides important guarantees
- **Monitor metrics** like fragment count and version count to guide optimization timing
- **LanceDB Cloud** provides automated optimization for production deployments

By following the best practices in this guide—using batch inserts, running regular optimizations, and monitoring storage metrics—you can maintain efficient storage usage while leveraging the full power of LanceDB's versioning capabilities.
