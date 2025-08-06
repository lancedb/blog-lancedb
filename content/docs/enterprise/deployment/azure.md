---
title: "LanceDB Enterprise: Azure Deployment Guide"
sidebar_title: "Deploying on Azure"
description: "Learn how to deploy LanceDB Enterprise on Azure with AKS, Private Link, and Blob Storage. Includes architecture diagrams and deployment options."
weight: 1
---

# Azure LanceDB Enterprise - Simplified Architecture

LanceDB Enterprise can be deployed on Azure using Azure Kubernetes Service (AKS) with Azure Blob Storage for data persistence and Azure Private Link for secure connectivity.

## General Architecture Overview

```mermaid
graph TB
    subgraph "Client VPC"
        Client[Client Applications]
    end
    
    subgraph "Server VPC"
        PLS[Azure Private Link Service]
        
        subgraph "AKS Cluster"
            LDB[LanceDB Enterprise<br/>Query Nodes, Plan Executors,<br/>Lance Agent, Indexer Pods]
        end
        
        EH[Azure EventHub<br/>for LanceDB internal<br/>message passing]
        
        BS[Azure Blob Storage]
        
        WI[Azure Workload Identity]
    end
    
    Client ==>|Private Link| PLS
    PLS ==> LDB
    LDB <-->|Read/Write| BS
    LDB -->|Async Events| EH
    EH -->|Process| LDB
    
    WI -.->|RBAC| BS
    WI -.->|Assigned| LDB
    
    style Client fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style PLS fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style LDB fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style EH fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    style BS fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style WI fill:#f1f8e9,stroke:#558b2f,stroke-width:2px
```

### Key Components

- **LanceDB architecture** is deployed in an AKS cluster within its own VPC
- **Client applications** connect to the cluster securely using Azure Private Link
- **AKS cluster** is granted Azure Blob Storage read/write permissions using Azure Workload Identity
- **Azure EventHub** can be used as the message queue by LanceDB Enterprise for internal message communication (alternative: self-hosted Kafka cluster in AKS)

## Read Path Architecture

```mermaid
graph LR
    subgraph "Client Network"
        C[Client App]
    end
    
    subgraph "Azure AKS Cluster"
        PL[Private Link<br/>Service]
        QN[Query Nodes<br/>Phalanx]
        PE[Plan Executors<br/>Distributed Cache]
    end
    
    subgraph "Storage"
        BS[Azure Blob<br/>Storage]
    end
    
    C -->|Private<br/>Connection| PL
    PL --> QN
    QN -->|Query<br/>Request| PE
    PE -->|Read<br/>Data| BS
    
    style C fill:#e3f2fd
    style PL fill:#f3e5f5
    style QN fill:#fff3e0
    style PE fill:#fff3e0
    style BS fill:#e8f5e9
```

### Read Path Flow

1. **Client Application** sends query request through Private Link
2. **Query Nodes** receive and process the request
3. **Plan Executors** optimize and execute the query
4. **Azure Blob Storage** provides data access with distributed caching

## Write Path Architecture

```mermaid
graph LR
    subgraph "Client Network"
        C[Client App]
    end
    
    subgraph "Azure AKS Cluster"
        PL[Private Link<br/>Service]
        QN[Query Nodes<br/>Phalanx]
        LA[Lance Agent]
        IP[Indexer Pods<br/>On-Demand]
    end
    
    subgraph "Messaging"
        EH[Azure EventHub<br/>Write Events]
    end
    
    subgraph "Storage"
        BS[Azure Blob<br/>Storage]
    end
    
    C -->|Private<br/>Connection| PL
    PL --> QN
    QN -->|Sync<br/>Write| BS
    QN -->|Async<br/>Events| EH
    EH -->|Consume| LA
    LA -->|Launch| IP
    IP -->|Index &<br/>Optimize| BS
    
    style C fill:#e3f2fd
    style PL fill:#f3e5f5
    style QN fill:#fff3e0
    style LA fill:#fff3e0
    style IP fill:#fff3e0
    style EH fill:#fce4ec
    style BS fill:#e8f5e9
```

### Write Path Flow

Query nodes write data synchronously to Azure Blob Storage while asynchronously sending data modification events to Azure EventHub (or self-hosted Kafka cluster). These write events are processed by the Lance Agent, which launches indexing pods or data optimization pods to optimize data for better read performance.

## Deployment Options

### Storage Architecture Support

```mermaid
graph TB
    subgraph "Multi-Account & Multi-Container Support"
        SA1[Storage Account 1]
        SA2[Storage Account 2]
        SA3[Storage Account N]
        
        SA1 --> C1A[Container A]
        SA1 --> C1B[Container B]
        SA1 --> C1C[Container C]
        
        SA2 --> C2A[Container X]
        SA2 --> C2B[Container Y]
        
        SA3 --> C3A[Container 1]
        SA3 --> C3B[Container 2]
    end
    
    style SA1 fill:#e8f5e9
    style SA2 fill:#e8f5e9
    style SA3 fill:#e8f5e9
```

### Deployment Models

LanceDB Enterprise supports three deployment models on Azure:

#### 1. Fully Managed Service
- **Infrastructure and storage** in LanceDB's Azure account
- **Complete management** by LanceDB team
- **Simplest setup** for customers

#### 2. BYOC (Bring Your Own Cloud)
- **Infrastructure and storage** in customer's Azure account
- **Managed by LanceDB** or customer
- **Full control** over data residency

#### 3. Hybrid - Bring Your Own Container
- **Infrastructure** in LanceDB's account
- **Storage containers** in customer's account
- **Available on request** (not implemented yet but not hard to implement)

{{< admonition >}}
For private deployments, high performance at extreme scale, or if you have strict security requirements, [contact us about LanceDB Enterprise](mailto:contact@lancedb.com).
{{< /admonition >}}