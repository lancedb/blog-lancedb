---
title: "Geneva: LanceDB's Feature Engineering Package"
sidebar_title: Feature Engineering
description: Learn how to transform raw data into meaningful features for AI models using LanceDB's feature engineering capabilities. Scale your feature engineering workflows with distributed processing and UDFs.
weight: 201
---

Geneva improves the productivity of AI engineers by streamlining feature engineering tasks. It is designed to reduce the time required to prototype, perform experiments, scale up, and move to production.

Geneva uses Python User Defined Functions (UDFs) to define features as columns in a Lance dataset. Adding a feature is straightforward:

Prototype your Python function in your favorite environment.
Wrap the function with small UDF decorator.
Register the UDF as a virtual column using Table.add_columns().
Trigger a backfill operation.
Prototyping your Python function

Build your Python feature generator function in an IDE or notebook using your project's Python versions and dependencies.

That's it.

Geneva will automate much of the dependency and version management needed to move from prototype to scale and production.