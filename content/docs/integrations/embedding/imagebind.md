---
title: ImageBind Embedding Models
sidebar_title: ImageBind
---

We have support for [imagebind](https://github.com/facebookresearch/ImageBind) model embeddings. You can download our version of the packaged model via - `pip install imagebind-packaged==0.1.2`.

This function is registered as `imagebind` and supports Audio, Video and Text modalities(extending to Thermal,Depth,IMU data):

| Parameter | Type | Default Value | Description |
|---|---|---|---|
| `name` | `str` | `"imagebind_huge"` | Name of the model. |
| `device` | `str` | `"cpu"` | The device to run the model on. Can be `"cpu"` or `"gpu"`. |
| `normalize` | `bool` | `False` | set to `True` to normalize your inputs before model ingestion. |

Below is an example demonstrating how the API works:

{{< code language="python" >}}
import lancedb
from lancedb.pydantic import LanceModel, Vector
from lancedb.embeddings import get_registry

db = lancedb.connect(tmp_path)
func = get_registry().get("imagebind").create()

class ImageBindModel(LanceModel):
    text: str
    image_uri: str = func.SourceField()
    audio_path: str
    vector: Vector(func.ndims()) = func.VectorField()

# add locally accessible image paths
text_list=["A dog.", "A car", "A bird"]
image_paths=[".assets/dog_image.jpg", ".assets/car_image.jpg", ".assets/bird_image.jpg"]
audio_paths=[".assets/dog_audio.wav", ".assets/car_audio.wav", ".assets/bird_audio.wav"]

# Load data
inputs = [
    {"text": a, "audio_path": b, "image_uri": c}
    for a, b, c in zip(text_list, audio_paths, image_paths)
]

#create table and add data
table = db.create_table("img_bind", schema=ImageBindModel)
table.add(inputs)
{{< /code >}}

{{< code language="typescript" >}}
import * as lancedb from "@lancedb/lancedb";
import {
  LanceSchema,
  getRegistry,
  register,
  EmbeddingFunction,
} from "@lancedb/lancedb/embedding";
import "@lancedb/lancedb/embedding/imagebind";
import { Utf8 } from "apache-arrow";

const db = await lancedb.connect("data/sample-lancedb");
const func = getRegistry().get("imagebind")?.create() as EmbeddingFunction;

const schema = LanceSchema({
  text: new Utf8(),
  image_uri: func.sourceField(new Utf8()),
  audio_path: new Utf8(),
  vector: func.vectorField(),
});

const inputs = [
  {
    text: "A dog.",
    image_uri: ".assets/dog_image.jpg",
    audio_path: ".assets/dog_audio.wav",
  },
  {
    text: "A car",
    image_uri: ".assets/car_image.jpg",
    audio_path: ".assets/car_audio.wav",
  },
  {
    text: "A bird",
    image_uri: ".assets/bird_image.jpg",
    audio_path: ".assets/bird_audio.wav",
  },
];

const table = await db.createTable("img_bind", inputs, { schema });
{{< /code >}}

Now, we can search using any modality:

#### image search
{{< code language="python" >}}
query_image = "./assets/dog_image2.jpg" #download an image and enter that path here
actual = table.search(query_image).limit(1).to_pydantic(ImageBindModel)[0]
print(actual.text == "dog")
{{< /code >}}

{{< code language="typescript" >}}
const queryImage = "./assets/dog_image2.jpg";
const results = await table.search(queryImage).limit(1).toArray();
console.log(results[0].text == "dog");
{{< /code >}}
#### audio search

{{< code language="python" >}}
query_audio = "./assets/car_audio2.wav" #download an audio clip and enter path here
actual = table.search(query_audio).limit(1).to_pydantic(ImageBindModel)[0]
print(actual.text == "car")
{{< /code >}}

{{< code language="typescript" >}}
const queryAudio = "./assets/car_audio2.wav";
const resultsAudio = await table.search(queryAudio).limit(1).toArray();
console.log(resultsAudio[0].text == "car");
{{< /code >}}
#### Text search
You can add any input query and fetch the result as follows:
{{< code language="python" >}}
query = "an animal which flies and tweets" 
actual = table.search(query).limit(1).to_pydantic(ImageBindModel)[0]
print(actual.text == "bird")
{{< /code >}}

{{< code language="typescript" >}}
const query = "an animal which flies and tweets";
const resultsText = await table.search(query).limit(1).toArray();
console.log(resultsText[0].text == "bird");
{{< /code >}}

If you have any questions about the embeddings API, supported models, or see a relevant model missing, please raise an issue [on GitHub](https://github.com/lancedb/lancedb/issues).
