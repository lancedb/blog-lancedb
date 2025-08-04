---
title: "Synthetic Data Kit"
sidebar_title: "Synthetic Data Kit"
weight: 6
---

### meta-llama/synthetic-data-kit

This is a tool from Meta LLAMA that helps you generate high-quality synthetic datasets for fine-tuning large language models (LLMs). It simplifies the process of preparing data for fine-tuning by providing a command-line interface (CLI) with a modular four-command flow.

One of the key features of the `synthetic-data-kit` is its use of the Lance format for storing and ingesting datasets. This allows for efficient storage and retrieval of data, which is crucial when working with large datasets.

### Key Features:

*   **Data Ingestion:** The toolkit can ingest various file formats, including PDF, HTML, YouTube transcripts, DOCX, PPT, and TXT.
*   **Fine-tuning Format Creation:** It can create different fine-tuning formats, such as question-answer (QA) pairs, QA pairs with Chain-of-Thought (CoT), and summarization formats.
*   **Data Curation:** The tool uses Llama as a judge to curate high-quality examples, ensuring the quality of the generated dataset.
*   **Flexible Saving Options:** You can save the generated datasets in various formats compatible with your fine-tuning workflow, including Hugging Face, JSONL, and JSON.

### How it Works:

The synthetic-data-kit follows a simple four-step process:

1.  **Ingest:** Import your input files into the toolkit. The data is stored in the Lance format for efficient processing.
2.  **Create:** Generate diverse fine-tuning datasets, such as reasoning, summarization, and QA pairs, from the ingested documents.
3.  **Curate:** Use Llama to filter and select high-quality examples from the generated dataset.
4.  **Save-as:** Export the curated dataset in your preferred format.

### Usage

The `synthetic-data-kit` uses Lance format to store and manage the data that you ingest. The workflow is a series of commands that build on each other, starting with the `ingest` command.

Here is an example of the end-to-end workflow:

1.  **Ingest Data into a LanceDB dataset**

    This command takes a directory of source files and creates a LanceDB dataset from them.

    ```bash
    synthetic-data-kit ingest docs/report.pdf --multimodal
    # This will create a Lance dataset at data/parsed/report.lance
    # with 'text' and 'image' columns.
    
    #Generate multimodal-qa pairs from the ingested data
    synthetic-data-kit create data/parsed/report.lance --type multimodal-qa
    ```

2.  **Create fine-tuning data**

    This command uses the LanceDB dataset created in the previous step to generate synthetic data in the desired format.

    ```bash
    synthetic_data create data/parsed/report.lance
    ```

3.  **Curate the data**

    This step uses a language model to curate the generated data and ensure its quality.

    ```bash
    synthetic_data curate report.json
    ```

4.  **Save the final dataset**

    Finally, save the curated data to a file in the desired format.

    ```bash
    synthetic_data save-as  report.json --save_path ./my_finetuning_data.jsonl
    ```

This workflow allows you to go from a collection of documents to a high-quality, fine-tuning dataset with just a few commands. The use of LanceDB in the background makes the process efficient and scalable.

### Getting Started:

To get started with the synthetic-data-kit, you can clone the GitHub repository and install the necessary dependencies. You will also need to have access to a Llama model, either running locally or through a hosted API.

[GitHub Repository](https://github.com/meta-llama/synthetic-data-kit)
