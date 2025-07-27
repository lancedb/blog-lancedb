---
title: "REST API"
description: "LanceDB Cloud REST API Documentation"
weight: 9
sidebar_collapsed: true
---

# LanceDB Cloud REST API

The LanceDB Cloud API is a RESTful API that allows users to access and modify data stored in LanceDB Cloud.

## Interactive API Documentation

{{< api-docs title="LanceDB Cloud API" >}}

## Quick Reference

### Base URL
```
https://{db}.{region}.api.lancedb.com
```

### Authentication
All API requests require an API key passed in the `x-api-key` header.

### Key Endpoints

| Operation | Endpoint | Method |
|-----------|----------|--------|
| List Tables | `/v1/table/` | `GET` |
| Create Table | `/v1/table/{name}/create/` | `POST` |
| Query Data | `/v1/table/{name}/query/` | `POST` |
| Insert Data | `/v1/table/{name}/insert/` | `POST` |
| Create Index | `/v1/table/{name}/create_index/` | `POST` |

### Data Formats
- **Request**: Arrow IPC stream (`application/vnd.apache.arrow.stream`) for data operations
- **Response**: Arrow file (`application/vnd.apache.arrow.file`) for queries, JSON for metadata

### Index Types
- **Vector**: `IVF_PQ`, `IVF_HNSW_SQ`
- **Scalar**: `BTREE`, `BITMAP`, `LABEL_LIST`
- **Text**: `FTS`

### Distance Metrics
- `L2`: Euclidean distance
- `Cosine`: Cosine similarity
- `Dot`: Dot product