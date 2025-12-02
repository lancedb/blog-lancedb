---
title: "Building Semantic Video Recommendations with TwelveLabs and LanceDB"
date: 2025-09-16
draft: false
featured: false
categories: ["Engineering"]
image: /assets/blog/geneva-twelvelabs/preview-image.png
meta_image: /assets/blog/geneva-twelvelabs/preview-image.png
description: "Build semantic video recommendations using TwelveLabs embeddings, LanceDB storage, and Geneva pipelines with Ray."
author: ["David Myriel"]
author_avatar: "/assets/authors/david-myriel.jpg"
author_bio: "Writer"
author_github: "davidmyriel"
author_linkedin: "davidmyriel"
---

{{< admonition tip "Notebook" >}}
The code snippets in this article are shortened to keep things clear and concise. If you’d like to experiment with the full runnable version, you can find the complete notebook [here](https://colab.research.google.com/drive/1jZiMT1QFYGvPgrps2Vpge9CtlRKFY1L0?usp=sharing#scrollTo=046o2pt62413).
{{< /admonition >}}

Traditional recommendation engines usually depend on metadata—titles, tags, or transcripts. While useful, those signals don’t capture the deeper meaning of what’s happening inside a video. Imagine if your system could actually understand the visuals, audio, and context of the content itself.

That’s exactly what we’ll build in this tutorial: a semantic video recommendation engine powered by [TwelveLabs](https://www.twelvelabs.io/), [LanceDB](/), and [Geneva](/docs/geneva).

- [TwelveLabs](https://www.twelvelabs.io/) provides multimodal embeddings that encode the narrative, mood, and actions in a video, going far beyond keyword matching.
- [LanceDB](/) stores these embeddings together with metadata and supports fast vector search through a developer-friendly Python API.
- [Geneva](/docs/geneva), built on [LanceDB](/) and powered by [Ray](/blog/lance-namespace-lancedb-and-ray/), scales the entire pipeline seamlessly from a single laptop to a large distributed cluster—without changing your code.

## Why this stack?

- [TwelveLabs](https://www.twelvelabs.io/): captures narrative flow and meaning, enabling natural queries like “a surfer riding a wave at sunset” to return relevant matches even without explicit tags.
- [LanceDB](/): a modern vector database built on [Apache Arrow](https://arrow.apache.org/), with:
	- A simple, intuitive Python interface.
	- Embedded operation—no external services required.
	- Native multimodal support for video, images, text, and vectors in the same table.
- [Geneva](/docs/geneva): extends LanceDB for distributed processing. With [Ray](/blog/lance-namespace-lancedb-and-ray/) under the hood, it parallelizes embedding generation and large-scale searches.

## Loading and Materializing Videos

The first step is to **load your dataset** into LanceDB. Here, we’re pulling in videos from [HuggingFace](https://huggingface.co/)’s [`HuggingFaceFV/finevideo`](https://huggingface.co/datasets/HuggingFaceFV/finevideo) dataset.

```python
def load_videos():
    dataset = load_dataset("HuggingFaceFV/finevideo", split="train", streaming=True)
    batch = []
    processed = 0

    for row in dataset:
        if processed >= 10:
            break

        video_bytes = row['mp4']
        json_metadata = row['json']

        batch.append({
            "video": video_bytes,
            "caption": json_metadata.get("youtube_title", "No description"),
            "youtube_title": json_metadata.get("youtube_title", ""),
            "video_id": f"video_{processed}",
            "duration": json_metadata.get("duration_seconds", 0),
            "resolution": json_metadata.get("resolution", "")
        })
        processed += 1

    return pa.RecordBatch.from_pylist(batch)
```

Here we stream the dataset to save memory and only process 10 rows for the demo. Each item stores the raw video bytes plus helpful metadata, producing a PyArrow RecordBatch that keeps video and metadata together.

Now we persist this dataset into **LanceDB using Geneva**:

```python
db = geneva.connect("/content/quickstart/")
tbl = db.create_table("videos", load_videos(), mode="overwrite")
```

`geneva.connect()` starts a local LanceDB instance, `create_table()` writes the dataset to `videos`, and `mode="overwrite"` resets the table.

At this point, we have a **LanceDB table of videos** ready for embedding and search.

## Embedding Videos with TwelveLabs

Next, we use **TwelveLabs’ Marengo model** to generate embeddings from the raw video files.

```python
task = client.embed.tasks.create(
    model_name="Marengo-retrieval-2.7",
    video_file=video_file,
    video_embedding_scope=["clip", "video"]
)

status = client.embed.tasks.wait_for_done(task.id)
result = client.embed.tasks.retrieve(task.id)

video_segments = [seg for seg in result.video_embedding.segments
                  if seg.embedding_scope == "video"]

embedding_array = np.array(video_segments[0].float_, dtype=np.float32)
```

Here we submit an embedding job to TwelveLabs, request both clip and whole‑video embeddings, then convert the result to a NumPy array for storage and search.

With **Geneva**, embeddings are automatically stored as another column:

```python
tbl.add_columns({"embedding": GenVideoEmbeddings(
    twelve_labs_api_key=os.environ['TWELVE_LABS_API_KEY']
)})
tbl.backfill("embedding", concurrency=1)
```

`add_columns()` adds an `embedding` column powered by `GenVideoEmbeddings`, and `backfill()` computes it for all rows (increase `concurrency` in production).

At this stage, every video in our LanceDB table has a **semantic embedding** attached.

## Searching with LanceDB

With embeddings stored, LanceDB can run vector search queries.

```python
query = "educational tutorial"
query_result = client.embed.create(
    model_name="Marengo-retrieval-2.7",
    text=query
)
qvec = np.array(query_result.text_embedding.segments[0].float_)

lance_db = lancedb.connect("/content/quickstart/")
lance_tbl = lance_db.open_table("videos")

results = (lance_tbl
          .search(qvec)
          .metric("cosine")
          .limit(3)
          .to_pandas())
```

Here we embed the query into `qvec`, open the `videos` table, run `.search(qvec)` with cosine similarity, and return the top matches as a pandas DataFrame. This is semantic search in action.

## Summarizing with Pegasus

Embeddings alone provide similarity, but they don’t explain *why* a result was returned. For better UX, TwelveLabs also provides **Pegasus**, a summarization model:

```
index = client.indexes.create(
    index_name=f"lancedb_demo_{int(time.time())}",
    models=[{"model_name": "pegasus1.2", "model_options": ["visual", "audio"]}]
)
```

`pegasus1.2` creates short multimodal summaries you can store alongside results to make recommendations easier to understand.

## Scaling with Geneva and Ray

Small datasets can be managed manually, but at **enterprise scale** you need automation. Geneva \+ Ray handle this:

| Concern | LanceDB only | With Geneva and Ray |
| ----- | ----- | ----- |
| Ingestion | Manual loaders | Declarative pipelines |
| Embeddings | Sequential | Parallel across many workers |
| Storage | Local tables | Distributed LanceDB tables |
| ML/Analytics | Custom scripts | Built-in distributed UDFs |

Here we declare the pipeline once and run it anywhere. Ray parallelizes the work so you can scale from a laptop to a large cluster without changing your code.

## Try it out

By combining [TwelveLabs](https://www.twelvelabs.io/), [LanceDB](/), and [Geneva](/docs/geneva) you can build a recommendation system that **understands video content directly**.

- [TwelveLabs Playground](https://playground.twelvelabs.io) – Sign up for an API key and start generating video embeddings right away 
- [LanceDB Quickstart](/docs/quickstart) – Install LanceDB locally and try your first vector search with Python 
- [Geneva Documentation](/docs/geneva) – Learn how to scale pipelines and run distributed embedding jobs with Ray 
- [Complete Notebook](https://colab.research.google.com/drive/1jZiMT1QFYGvPgrps2Vpge9CtlRKFY1L0?usp=sharing#scrollTo=046o2pt62413) – Explore the full runnable code with all the details 
