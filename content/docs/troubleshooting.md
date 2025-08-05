---
title: Troubleshooting 
weight: 301
---

Most issues happen very frequently. There's a chance we covered the solution in our docs and dedicated FAQ sections:

| Product | Description |
|---------|-------------|
| [LanceDB OSS FAQ](/docs/faq/faq-oss/) | For open source users |
| [LanceDB Cloud FAQ](/docs/faq/faq-cloud/) | For cloud service users |
| [LanceDB Enterprise FAQ](/docs/faq/faq-enterprise/) | For enterprise users |

## Getting Technical Support

If you are using LanceDB OSS or LanceDB Cloud, the best place to get help is in our [Discord community](https://discord.com/invite/G5DcmnZWKB), under the relevant language channel for Python, TypeScript, or Rust. By asking in the language-specific channel, you're more likely to get a quick response from someone who knows the answer.

If you are a LanceDB Enterprise user, please contact our support team at [support@lancedb.com](mailto:support@lancedb.com) for dedicated assistance. 

## General Issues

### Slow or Unexpected Query Results

If you have slow queries or unexpected query results, it can be helpful to
print the resolved query plan. 

LanceDB provides two powerful tools for query analysis and optimization: `explain_plan` and `analyze_plan`.

Read the full guide on [Query Optimization](/docs/guides/optimize-queries/).

### Python's Multiprocessing Module

Multiprocessing with `fork` is not supported. You should use `spawn` instead.

### Logging in LanceDB Cloud

To provide more information, especially for LanceDB Cloud related issues, enable
debug logging. You can set the `LANCEDB_LOG` environment variable:

```shell
export LANCEDB_LOG=debug
```

You can turn off colors and formatting in the logs by setting

```shell
export LANCEDB_LOG_STYLE=never
```
