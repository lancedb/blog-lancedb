---
title: Custom Datasets for efficient LLM training using Lance
date: 2024-03-08
draft: false
featured: false
image: /assets/blog/1.png
description: Explore custom datasets for efficient llm training using lance with practical insights and expert guidance from the LanceDB team.
author: Chang She
---
## Introduction

Large Language Models have become the talk of the town in the past year and a half and the ML world has seen all sorts of funny little Open (and closed) Source LLMs released. Training an LLM however, is not as easy and straightforward as using it for inference or even fine-tuning it.

One of the early key hurdles one faces when training an LLM on their own (in a hobbyist-esque fashion) is loading the data into their LLM during training. You could always train a smaller, more efficient LLM on a smaller GPU but you will be severely limited by how your data is loaded into the model.

Of course, there are many approaches to this but if you want to train your own little LLM on a subset of a larger dataset (for instance a subset of [`codeparrot/github-code`](https://huggingface.co/datasets/codeparrot/github-code) dataset which has a total of 1TB of code data from GitHub), you would need to first download that entire dataset, split it and then use the much smaller subset for training/fine-tuning.

Unless of course, you are disk space poor or someone with a low attention span and doesn’t want to download the whole dataset of a terabyte only to really ever use 50GBs of it. In this case, you are at the right place!

## An outline

Before we dive into this, let’s have a rough outline of the format we want the data in.

First, we would like the text/code data to be pre-processed, tokenized and saved in one large array(-like) structure with tokens in it. This will make it extremely easy to train the LLM since now you can just load `k` tokens for your training tokens (`x`) (where `k` is the context length, 1024, 2048, etc) and `idx+k+1` tokens for your target tokens (`y`) (where idx is the current index of the tokens and y will be 1 token into the future but same length as `x`).

The above arrangement will be pretty easy to pass into an LLM for training if, like me, you write your training scripts yourself.

Second, we should be able to access any chunk of tokens from the dataset without having to load that entire dataset (50 or maybe 100GB) into the memory. Ideally, we would like to make this random access based on indices instead of using offset-magic (like we do when using `numpy.memmap`).

## Lance comes to the rescue

This is where Lance comes to the rescue. Lance is a modern columnar data format that is optimized for ML workflows and datasets. It is written in Rust ensuring great I/O and processing speeds with the ease of using a simpler Python API. Lance using the Arrow data format in the back end. You can read more about Lance file format [here](https://lancedb.github.io/lance/format.html).

One of the very nice things that lance offers is that you can access the data from a lance dataset just by specifying the indices and it will only load the data at said indices instead of the entire dataset which is exactly what our second requirement was!

## Coding it out

Enough talking, let’s now see how to do this step by step!

### Creating and saving the dataset

First, we’ll import all the necessary frameworks and define the tokenizer and the dataset we will be using.

    import lance
    import pyarrow as pa
    
    from tqdm.auto import tqdm
    
    import datasets
    from transformers import AutoTokenizer
    
    # Change based on your need
    tokenizer = AutoTokenizer.from_pretrained(
        "EleutherAI/gpt-neox-20b"
    )
    
    # Only load the Python code files from codeparrot dataset
    dataset = load_dataset(
        "codeparrot/github-code", 
        streaming=True, 
        split="train", 
        languages=["Python"]
    )
    dataset = dataset.shuffle(seed=42)
    
    

**Note**: In the above code snippet, make sure that `streaming` is set to `True` in `load_dataset` function otherwise it will start downloading the entire codeparrot dataset! Learn more about the streaming mode [here](https://huggingface.co/docs/datasets/en/stream).

Now, let’s define a function that tokenizes the dataset. Remember, we haven’t downloaded the whole dataset so instead of using that function with `.map()` on the dataset, we’ll just return the `input_ids` that the tokenizer returns.

    def tokenize(sample):
        return tokenizer(sample['code'])['input_ids']
    

The actual code of each sample is in the `code` attribute.

Now that we have a dataset and tokenizer function ready, let’s write a function that does all this process for as many samples as we need. I’ll do all this processing in one single function because there just aren’t too many steps, but if you need to do more pre-processing, feel free to divide this into multiple functions!

We’ll also specify how many total samples we need in our subset. I am going ahead with 5M samples for now.

    total_samples = 5_000_000 # 5 Million samples
    
    def process_samples():
        current_sample = 0
        for sample in tqdm(dataset, total=total_samples):
            # If we have added all 5M samples, stop
            if current_sample == total_samples:
                break
            # Tokenize the current sample
            tokenized_sample = tokenize(sample)
            # Increement the counter
            current_sample += 1
            # Yield a PyArrow RecordBatch
            yield pa.RecordBatch.from_arrays(
                [tokenized_sample], 
                names=["value"]
            )
    
    # Define the dataset schema
    schema = pa.schema([
        pa.field("value", pa.int64())
    ])
    

A few things to note from above:

- 
The `process_samples` function doesn’t directly receive any arguments because it will be converted to a Pyarrow `RecordBatchReader` which is a fancy way of saying an ‘iterator that follows a schema’.

- 
The `names` argument just describes the name of the fields in your Batch. In this case, our batch only consists of `input_ids` but I have named it `value` to avoid any confusion.

- 
Schema describes what type of data (with what field name and data type) will be present in our Pyarrow table.

Finally, let’s convert our `process_samples()` function to `RecordBatchReader` which can iterate over the dataset and then write that dataset to disk.

    # The reader takes in a schema and the function
    reader = pa.RecordBatchReader.from_batches(
        schema, 
        process_samples()
    )
    
    # Write the dataset to disk
    lance.write_dataset(
        reader, 
        "code_parrot_5M_subset.lance", 
        schema
    )
    

Once we run the above snippet, it will start reading the samples one by one, tokenize them and then save them to a Pyarrow table that will be saved as the Lance dataset.

### Loading the dataset

Loading the dataset will require a bit of a list of trickery, the function below.

    # First make a dataset descriptor and see row count
    dataset = lance.dataset("code_parrot_5M_subset.lance")
    print(dataset.count_rows()) # Should be 5M total samples
    
    def load_data(dataset, indices):
        # Load the data at these indices
        data = dataset.take(indices).to_pylist()
        # A little short-cut to get the tokens in one list
        data = list(map(lambda x: x['value'], data))
        return data
    

In the above function, we will pass in the dataset descriptor defined before it and the indices we need to fetch. These indices can be a normal list or a numpy array.

## Conclusion

And there you have it! Processing, saving and loading any subset of a very very large 🤗 dataset in under 70 lines of code without using any more than 3GB of RAM!

You can find the complete script [here](https://gist.github.com/tanaymeh/5285a073f4ad7d7e8aa7e952fe220aa4).
