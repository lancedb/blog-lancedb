---
title: You can now delete rows in Lance and LanceDB!
date: 2023-06-28
author: LanceDB
categories: ["Engineering"]
draft: false
featured: false
---

by Will Jones

Starting in Lance 0.5.0, you can delete rows in Lance datasets. Up until now, we’ve only supported adding new data (new rows with append or newStarting in Lance 0.5.0, you can delete rows in Lance datasets. Up until now, we’ve only supported adding new data (new rows with append or new columns with [merge](https://lancedb.github.io/lance/read_and_write.html#adding-new-columns)) or overwriting the whole dataset. Now we support deleting individual rows or fragments. This is one of the first in a series of features we are releasing to make it easier to manage large scale AI datasets.

The basics of delete are very simple: given a dataset, you can specify a SQL predicate and all of those rows will be deleted.

    >>> import lance
    >>> import pandas as pd
    >>> data = pd.DataFrame({
    ...     'x': [1, 2, 3],
    ...     'y': ['a', 'b', 'c']
    ... })
    >>> dataset = lance.write_dataset(data, 'my_dataset', mode="overwrite")
    >>> dataset.to_table().to_pandas()
       x  y
    0  1  a
    1  2  b
    2  3  c
    >>> dataset.delete("x = 2")
    >>> dataset.to_table().to_pandas()
       x  y
    0  1  a
    1  3  c

Deletion in Lance is non-destructive. We keep a snapshot of each version of the dataset, so you can always go back to previous versions.

    >>> old_dataset = lance.dataset("my_dataset", version=dataset.version - 1)
    >>> old_dataset.to_table().to_pandas()
       x  y
    0  1  a
    1  2  b
    2  3  c

Lance uses SQL expressions, which allows for complex predicates during deletion.

    >>> dataset.delete("(x = 1) OR (y in ('a', 'b', 'e'))")
    >>> dataset.to_table().to_pandas()
       x  y
    0  3  c

See [our documentation](https://lancedb.github.io/lance/read_and_write.html#filter-push-down) for a full list of supported SQL in predicates.

# Implementation and expected performance

How does Lance implement deletion? When we delete rows, we save a new file called a deletion file for each affected fragment. The file contains the row ids of all deleted rows.

By writing these deletion files, we avoid rewriting data files, which is expensive on its own but also has special ramifications for Lance. If a data file is rewritten, the row ids are changed, invalidating the ANN indices for those files. So if we rewrote the data files, we’d also have to update the indices.

To see which fragments in the datasets have deletion files, use the **get_fragments()** method. From our previous example, if we compare the fragments in the **old_dataset** versus the new **dataset**, we’ll see the new dataset now has an additional **deletion_file** but the **data_files** remains the same.

    >>> old_dataset.get_fragments()
    [LanceFileFragment(id=0,
                       data_files=['605be8b8-8b01-47b3-b4a8-45af4b2acdea.lance'])]
    >>> dataset.get_fragments()
    [LanceFileFragment(id=0, 
                       data_files=['605be8b8-8b01-47b3-b4a8-45af4b2acdea.lance'],
                       deletion_file='_deletions/0-14-16447660214542675320.arrow')]

Reading these new deletion files can add a small amount of latency to queries, so we cache this metadata. This means that tables that have deletions will have a little bit of cold start latency. We’ll be benchmarking and improving this in the near future.

In cases where a predicate aligns with the write pattern, we can avoid writing deletion files entirely; instead just eliminating an entire fragment. For example, imagine there is a sensor dataset that dumps data with a timestamp every hour. If we pass a deletion predicate on the timestamp column, we can just eliminate the particular data fragments that are part of the dump. The dataset might be written like:

    >>> from datetime import datetime, timedelta
    >>> import shutil
    >>> import pyarrow as pa

    >>> def new_data(timestamp: datetime) -> pa.Table:
    ...     nrows = 10_000
    ...     return pa.table({
    ...         "insertion_timestamp": pa.array([timestamp] * nrows),
    ...         "locxal_id": pa.array(range(nrows), pa.uint64()),
    ...     })>>> for hours in range(10):
    ...     timestamp = datetime(2023, 1, 1) + timedelta(hours=hours)
    ...     data = new_data(timestamp)
    ...     dataset = lance.write_dataset(data, 'time_series', mode="append")
    ...>>> dataset.head(9).to_pandas()
      insertion_timestamp  locxal_id
    0          2023-01-01          0
    1          2023-01-01          1
    2          2023-01-01          2
    3          2023-01-01          3
    4          2023-01-01          4
    5          2023-01-01          5
    6          2023-01-01          6
    7          2023-01-01          7
    8          2023-01-01          8

Initially, there will be 10 fragments, once for each hour:

    >>> dataset.get_fragments()
    [LanceFileFragment(id=0, data_files=['7e2d7a80-7545-4c97-9c4c-a83795177c51.lance']),
     LanceFileFragment(id=1, data_files=['049d47dc-9757-4188-bdc2-0a3f95124ef6.lance']),
     LanceFileFragment(id=2, data_files=['3c7f9a43-f709-474a-92e5-fa79d21d54c8.lance']),
     LanceFileFragment(id=3, data_files=['5b529fc4-2bd9-4d9b-a5e9-f0ea0e422384.lance']),
     LanceFileFragment(id=4, data_files=['c6b8f9e6-3146-44fe-a637-40c4d08aeb36.lance']),
     LanceFileFragment(id=5, data_files=['989292c8-0d40-4c35-aea1-c1e4b00138f5.lance']),
     LanceFileFragment(id=6, data_files=['48bf4832-5d67-4d46-99ae-53d9c0be2514.lance']),
     LanceFileFragment(id=7, data_files=['7fbfdca7-31f7-43e0-aa8e-f186df92652a.lance']),
     LanceFileFragment(id=8, data_files=['ee85d31c-19e1-418b-b6d7-9b930ae75ec4.lance']),
     LanceFileFragment(id=9, data_files=['ee93cb15-c0fe-47d6-8cb1-870c0d400ccf.lance'])]

Then after deleting the first 5 hours, there will only be 5 fragments remaining. Notice none of them have any deletion files.

    >>> dataset.delete("insertion_timestamp < cast('2023-01-01 05:00:00' as timestamp)")
    >>> dataset.get_fragments()
    [LanceFileFragment(id=5, data_files=['989292c8-0d40-4c35-aea1-c1e4b00138f5.lance']),
     LanceFileFragment(id=6, data_files=['48bf4832-5d67-4d46-99ae-53d9c0be2514.lance']),
     LanceFileFragment(id=7, data_files=['7fbfdca7-31f7-43e0-aa8e-f186df92652a.lance']),
     LanceFileFragment(id=8, data_files=['ee85d31c-19e1-418b-b6d7-9b930ae75ec4.lance']),
     LanceFileFragment(id=9, data_files=['ee93cb15-c0fe-47d6-8cb1-870c0d400ccf.lance'])]

By deleting whole fragments, we avoided the need for any deletion files. This workflow can avoid any latency hit but works only for particular workloads.

Admittedly, without partition values, it’s hard to see what columns the fragment boundaries align with. Once partitioning is added to Lance datasets, such a query could be written without having to know the details of the write pattern, making it much easier to work with.

# Future directions

Next on our roadmap, we’ll be implementing partitioning and updates.

Partitioning will make many write patterns easier to implement, such as deleting or overwriting partitions. It will also provide faster queries and scans with predicates, as we can eliminate whole partitions based on partition values.

Updates will allow changing the value of a subset of a few rows. This will pave the way for more complex ETL patterns such as upserts and merge operations columns with [merge](https://lancedb.github.io/lance/read_and_write.html#adding-new-columns)) or overwriting the whole dataset. Now we support deleting individual rows or fragments. This is one of the first in a series of features we are releasing to make it easier to manage large scale AI datasets.

The basics of delete are very simple: given a dataset, you can specify a SQL predicate and all of those rows will be deleted.

    >>> import lance
    >>> import pandas as pd
    >>> data = pd.DataFrame({
    ...     'x': [1, 2, 3],
    ...     'y': ['a', 'b', 'c']
    ... })
    >>> dataset = lance.write_dataset(data, 'my_dataset', mode="overwrite")
    >>> dataset.to_table().to_pandas()
       x  y
    0  1  a
    1  2  b
    2  3  c
    >>> dataset.delete("x = 2")
    >>> dataset.to_table().to_pandas()
       x  y
    0  1  a
    1  3  c

Deletion in Lance is non-destructive. We keep a snapshot of each version of the dataset, so you can always go back to previous versions.

    >>> old_dataset = lance.dataset("my_dataset", version=dataset.version - 1)
    >>> old_dataset.to_table().to_pandas()
       x  y
    0  1  a
    1  2  b
    2  3  c

Lance uses SQL expressions, which allows for complex predicates during deletion.

    >>> dataset.delete("(x = 1) OR (y in ('a', 'b', 'e'))")
    >>> dataset.to_table().to_pandas()
       x  y
    0  3  c

See [our documentation](https://lancedb.github.io/lance/read_and_write.html#filter-push-down) for a full list of supported SQL in predicates.

# Implementation and expected performance

How does Lance implement deletion? When we delete rows, we save a new file called a deletion file for each affected fragment. The file contains the row ids of all deleted rows.

By writing these deletion files, we avoid rewriting data files, which is expensive on its own but also has special ramifications for Lance. If a data files is rewritten, the row ids are changes, invalidating the ANN indices for those files. So if we rewrote the data files, we’d also have to update the indices.

To see which fragments in the datasets have deletion files, use the **get_fragments()** method. From our previous example, if we compare the fragments in the **old_dataset** versus the new **dataset**, we’ll see the new dataset now has an additional **deletion_file** but the **data_files** remains the same.

    >>> old_dataset.get_fragments()
    [LanceFileFragment(id=0,
                       data_files=['605be8b8-8b01-47b3-b4a8-45af4b2acdea.lance'])]
    >>> dataset.get_fragments()
    [LanceFileFragment(id=0, 
                       data_files=['605be8b8-8b01-47b3-b4a8-45af4b2acdea.lance'],
                       deletion_file='_deletions/0-14-16447660214542675320.arrow')]

Reading these new deletion files can add a small amount of latency to queries, so we cache this metadata. This means that tables that have deletions will have a little bit of cold start latency. We’ll be benchmarking and improving this in the near future.

In cases where a predicate aligns with the write pattern, we can avoid writing deletion files entirely; instead just eliminating an entire fragment. For example, imagine there is a sensor dataset that dumps data with a timestamp every hour. If we pass a deletion predicate on the timestamp column, we can just eliminate the particular data fragments that are part of the dump. The dataset might be written like:

    >>> from datetime import datetime, timedelta
    >>> import shutil
    >>> import pyarrow as pa
    
    >>> def new_data(timestamp: datetime) -> pa.Table:
    ...     nrows = 10_000
    ...     return pa.table({
    ...         "insertion_timestamp": pa.array([timestamp] * nrows),
    ...         "locxal_id": pa.array(range(nrows), pa.uint64()),
    ...     })
    
    >>> for hours in range(10):
    ...     timestamp = datetime(2023, 1, 1) + timedelta(hours=hours)
    ...     data = new_data(timestamp)
    ...     dataset = lance.write_dataset(data, 'time_series', mode="append")
    ...
    
    >>> dataset.head(9).to_pandas()
      insertion_timestamp  locxal_id
    0          2023-01-01          0
    1          2023-01-01          1
    2          2023-01-01          2
    3          2023-01-01          3
    4          2023-01-01          4
    5          2023-01-01          5
    6          2023-01-01          6
    7          2023-01-01          7
    8          2023-01-01          8

Initially, there will be 10 fragments, once for each hour:

    >>> dataset.get_fragments()
    [LanceFileFragment(id=0, data_files=['7e2d7a80-7545-4c97-9c4c-a83795177c51.lance']),
     LanceFileFragment(id=1, data_files=['049d47dc-9757-4188-bdc2-0a3f95124ef6.lance']),
     LanceFileFragment(id=2, data_files=['3c7f9a43-f709-474a-92e5-fa79d21d54c8.lance']),
     LanceFileFragment(id=3, data_files=['5b529fc4-2bd9-4d9b-a5e9-f0ea0e422384.lance']),
     LanceFileFragment(id=4, data_files=['c6b8f9e6-3146-44fe-a637-40c4d08aeb36.lance']),
     LanceFileFragment(id=5, data_files=['989292c8-0d40-4c35-aea1-c1e4b00138f5.lance']),
     LanceFileFragment(id=6, data_files=['48bf4832-5d67-4d46-99ae-53d9c0be2514.lance']),
     LanceFileFragment(id=7, data_files=['7fbfdca7-31f7-43e0-aa8e-f186df92652a.lance']),
     LanceFileFragment(id=8, data_files=['ee85d31c-19e1-418b-b6d7-9b930ae75ec4.lance']),
     LanceFileFragment(id=9, data_files=['ee93cb15-c0fe-47d6-8cb1-870c0d400ccf.lance'])]

Then after deleting the first 5 hours, there will only be 5 fragments remaining. Notice none of them have any deletion files.

    >>> dataset.delete("insertion_timestamp < cast('2023-01-01 05:00:00' as timestamp)")
    >>> dataset.get_fragments()
    [LanceFileFragment(id=5, data_files=['989292c8-0d40-4c35-aea1-c1e4b00138f5.lance']),
     LanceFileFragment(id=6, data_files=['48bf4832-5d67-4d46-99ae-53d9c0be2514.lance']),
     LanceFileFragment(id=7, data_files=['7fbfdca7-31f7-43e0-aa8e-f186df92652a.lance']),
     LanceFileFragment(id=8, data_files=['ee85d31c-19e1-418b-b6d7-9b930ae75ec4.lance']),
     LanceFileFragment(id=9, data_files=['ee93cb15-c0fe-47d6-8cb1-870c0d400ccf.lance'])]

By deleting whole fragments, we avoided the need for any deletion files. This workflow can avoid any latency hit, but works only for particular workloads.

Admittedly, without partition values, it’s hard to see what columns the fragment boundaries align with. Once partitioning is added to Lance datasets, such a query could be written without having to know the details of the write pattern, making it much easier to work with.

# Future directions

Next on our roadmap, we’ll be implementing partitioning and updates.

Partitioning will make many write patterns easier to implement, such as deleting or overwriting partitions. It will also provide faster queries and scans with predicates, as we can eliminate whole partitions based on partition values.

Updates will allow changing the value of a subset of a few rows. This will pave the way for more complex ETL patterns such as upserts and merge operations.
