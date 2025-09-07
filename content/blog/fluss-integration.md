---
title: "Unlocking Real-time AI analytics with Apache Fluss, Apache Flink and Lance"
date: 2025-09-04
draft: false
featured: false
categories: ["Engineering"]
image: /assets/blog/lance-namespace-lancedb-and-ray/preview-image.png
meta_image: /assets/blog/lance-namespace-lancedb-and-ray/preview-image.png
description: "TODO"
author: Cheng Wang
author_avatar: "/assets/authors/jack-ye.jpg"
author_bio: "Software Engineer @ Tencent, Apache Fluss "
author_github: "jackye1995"
author_linkedin: "https://www.linkedin.com/in/yezhaoqin"
---

With the advent of the generative AI era, 
nearly all digital applications are integrating AI innovations to enhance their capabilities. 
The successful deployment of AI applications relies heavily on data, 
particularly for enterprise decision-making systems where high-quality, fresh data is critical. 
For instance, in customer service and risk control systems, 
AI models that lack access to real-time customer inputs will struggle to make accurate decisions.

Apache Fluss addresses this need as a purpose-built streaming storage for real-time analytics. 
Serving as the real-time data layer for lakehouse architectures, 
Fluss features an intelligent tiering service that ensures seamless integration between stream and lake storage. 
This service automatically and continuously converts Fluss data into the lakehouse format, 
enabling the "shared data" feature:

- Fluss as lakehouse's real-time layer: Fluss provides high-throughput, low-latency ingestion and processing on streaming data, becoming the real-time front-end for the lakehouse.
- Lakehouse as Fluss's historical layer: The lakehouse provides optimized long-term storage with minute-level freshness, acting as the historical batch data foundation for real-time layer.

Complementing the Fluss ecosystem, Lance emerges as the next-generation AI lakehouse platform 
specialized for machine learning and AI applications. It efficiently handles multimodal data (text, images, vectors) and 
delivers high-performance queries such as lightning-fast vector search.

Combining Lance and Apache Fluss unlocks true real-time AI analytics. 
Consider Retrieval-Augmented Generation (RAG), 
a popular generative AI framework that enhances the capabilities of large language models (LLMs) 
by incorporating up-to-date information during the generation process. 
RAG uses vector search to understand a user's query context and retrieve relevant information to feed into LLMs. 
With Fluss and Lance, RAG systems can now:

1.Perform efficient vector search on Lance's historical data leveraging its powerful indexes.
2.Compute live insights on Fluss's real-time, unindexed streaming data.
3.Combine results from both sides to enrich LLMs with the most timeless and comprehensive information.

In this blog, we'll demonstrate how to stream images into Fluss, 
and subsequently load the data from the Lance dataset into Pandas DataFrames 
to make the image data easily accessible for further processing and analysis in your machine learning workflows.

## Minio Setup

### Step 1: Install MinIO Locally

Check out the [official documentation](https://min.io/docs/minio/macos/index.html) for detailed instructions.

### Step 2: Start the MinIO Server

Run this command, specifying a local path to store your Minio data:

```bash
export MINIO_REGION_NAME=us-west-1
export MINIO_ROOT_USER=minio 
export MINIO_ROOT_PASSWORD=minioadmin 
minio server /tmp/minio-tmp
```

### Step 3: Verify MinIO Running with WebUI

When your MinIO server is up and running, you'll see endpoint information and login credentials:

```
API: http://192.168.3.40:9000  http://127.0.0.1:9000 
   RootUser: minio 
   RootPass: minioadmin 

WebUI: http://192.168.3.40:64217 http://127.0.0.1:64217            
   RootUser: minio 
   RootPass: minioadmin 
```

### Step 4: Create Bucket

Open the WebUI link and log in with these credentials.
You can create a lance bucket through the WebUI.

## Fluss and Lance Setup

### Step 1: Install Fluss Locally

Check out the [official documentation](https://fluss.apache.org/docs/install-deploy/deploying-local-cluster/) for detailed instructions.

### Step 2: Configure Lance Data Lake

Edit your `<FLUSS_HOME>/conf/server.yaml` file and add these settings:

```yaml
datalake.format: lance

datalake.lance.warehouse: s3://lance
datalake.lance.endpoint: http://localhost:9000
datalake.lance.allow_http: true
datalake.lance.access_key_id: minio
datalake.lance.secret_access_key: minioadmin
datalake.lance.region: eu-west-1
```

This configures Lance as the datalake format on MinIO as the warehouse.

### Step 3: Start Fluss

```bash
<FLUSS_HOME>/bin/local-cluster.sh start
```

### Step 4: Install Flink Fluss Connector

Download the Flink 1.20 binary package from the [official website](https://flink.apache.org/downloads/).
Download [Fluss Connector Jar](https://fluss.apache.org/downloads) and copy it to Flink classpath `<FLINK_HOME>/lib`.

### Step 5: Configure Flink Fluss Connector

The Fluss Lance connector utilizes Apache Arrow Java API, 
which relies on direct memory. 
Ensure sufficient off-heap memory for the Flink Task Manager by 
configuring the `taskmanager.memory.task.off-heap.sizeparameter`
in `<FLINK_HOME>/conf/config.yaml`:

```yaml
# Increase available task slots.
numberOfTaskSlots: 5
taskmanager.memory.task.off-heap.size: 128m
```

### Step 6: Start Flink

Start Flink locally with:

```bash
<FLINK_HOME>/bin/start-cluster.sh
```

### Step 7: Verify Flink Running

Open your browser to http://localhost:8081 and make sure the cluster is running.


## Launching the Fluss Tiering Service

### Step 1: Get the Tiering Job Jar

Download the [Fluss Tiering Job Jar](https://fluss.apache.org/downloads)

### Step 2: Submit the Job

```bash
./bin/flink run <path_to_jar>/fluss-flink-tiering-0.8.jar \
    --fluss.bootstrap.servers localhost:9123 \
    --datalake.format lance \
    --datalake.lance.warehouse s3://lance \
    --datalake.lance.endpoint http://localhost:9000 \
    --datalake.lance.allow_http true \
    --datalake.lance.secret_access_key minioadmin \
    --datalake.lance.access_key_id minio \
    --datalake.lance.region eu-west-1 \
    --table.datalake.freshness 30s
```

### Step 3: Confirm Deployment

Check the Flink UI for the Fluss Lake Tiering Service job. 
Once it's running, your local tiering pipeline is good to go.

## Multimodal Data Processing

We'll walk through a Python code example that demonstrates how to stream a dataset of images into Fluss, 
and subsequently load the tiered Lance dataset into a Pandas DataFrame for further processing.

### Step 1: Create Connection

Create the Connection and Table (with Fluss Python client)

```python
import asyncio
import fluss
import pyarrow as pa

def create_connection(config_spec):
	# Create connection
	async def _inner():
		config = fluss.Config(config_spec)
		conn = await fluss.FlussConnection.connect(config)
		return conn
	
	return asyncio.run(_inner())

def create_table(conn, table_path, pa_schema):
	# Create a Fluss Schema
	fluss_schema = fluss.Schema(pa_schema)
	# Create a Fluss TableDescriptor
	table_descriptor = fluss.TableDescriptor(
		fluss_schema,
		properties={
			"table.datalake.enabled": "true",
			"table.datalake.freshness": "30s"
		}
	)
	
	async def _inner():
		# Get the admin for Fluss
		admin = await conn.get_admin()
		
		# Create a Fluss table
		try:
			await admin.create_table(table_path, table_descriptor, True)
			print(f"Created table: {table_path}")
		except Exception as e:
			print(f"Table creation failed: {e}")

	asyncio.run(_inner())
```

### Step 2: Process Image

```python
import os

def process_images(schema: pa.Schema):
	# Get the current directory path
	current_dir = os.getcwd()
	images_folder = os.path.join(current_dir, "image")

	# Get the list of image files
	image_files = [filename for filename in os.listdir(images_folder)
		  		 if filename.endswith((".png", ".jpg", ".jpeg"))]

	# Iterate over all images in the folder with tqdm
	for filename in tqdm(image_files, desc="Processing Images"):
		# Construct the full path to the image
		image_path = os.path.join(images_folder, filename)

		# Read and convert the image to a binary format
		with open(image_path, 'rb') as f:
			binary_data = f.read()

		image_array = pa.array([binary_data], type=pa.binary())

		# Yield RecordBatch for each image
		yield pa.RecordBatch.from_arrays([image_array], schema=schema)
```

This `process_images` function is the heart of our data conversion process. 
It is responsible for iterating over the image files in the specified directory, 
reading the data of each image, and converting it into a PyArrow `RecordBatch` object on the binary scale.

### Step 3: Writing to Fluss

The `write_to_fluss` function creates a `RecordBatchReader` from the `process_images` generator 
and writes the resulting data to Fluss `fluss.images_minio` table. 

```python
def write_to_fluss(conn, table_path, pa_schema):
	# Get table and create writer‘
	async def _inner():
		table = await conn.get_table(table_path)
		append_writer = await table.new_append_writer()
		try:
			print("\n--- Writing image data ---")
			for record_batch in process_images(pa_schema):
				append_writer.write_arrow_batch(record_batch)
		except Exception as e:
			print(f"Failed to write image data: {e}")
		finally:
			append_writer.close()
	
	asyncio.run(_inner())
```

### Step 4: Check Job Completion

Wait a little while for the tiering job to finish. 
Then, go to the Minio UI, and you'll see the Lance Files in your `lancebucket`.

### Step 5: Loading into Pandas

The final step in the process is to load the data from the Lance datasets into Pandas `DataFrame`, 
making the image data easily accessible for further processing and analysis in machine learning workflows.

```python
import lance
import pandas as pd

def loading_into_pandas():
	uri = "s3://lance/fluss/" + table_name + ".lance"
	ds = lance.dataset(uri, storage_options={"access_key_id": "minio", "secret_access_key": "minioadmin", "endpoint": "http://localhost:9000", "allow_http": "true",})

	# Accumulate data from batches into a list
	data = []
	for batch in ds.to_batches(columns=["image"], batch_size=10):
    	tbl = batch.to_pandas()
    	data.append(tbl)

	# Concatenate all DataFrames into a single DataFrame
	df = pd.concat(data, ignore_index=True)
	print("Pandas DataFrame is ready")
	print("Total Rows: ", df.shape[0])

```

The `loading_into_pandas` function demonstrates how to load the image data from the Lance dataset into a Pandas `DataFrame`. 
It first creates a Lance dataset object from Minio. 
Then, it iterates over batches of data, converting each batch into a Pandas `DataFrame` and appending it to a list. 
Finally, it concatenates all the DataFrames in the list into a single DataFrame, 
making the image data accessible for further processing or analysis.

### Putting It All Together

If you would like to run the whole script, use this main function in your python script:

```python

if __name__ == "__main__":
	config_spec = {
		"bootstrap.servers": "127.0.0.1:9123",
	}
	conn = create_connection(config_spec)
	table_path = fluss.TablePath("fluss", table_name)
	pa_schema = pa.schema([('image', pa.binary())])
	create_table(conn, table_path, pa_schema)
	write_to_fluss(conn, table_path, pa_schema)
	sleep(60)
	df = loading_into_pandas()
	print(df.head())
	conn.close()
```

## Conclusion