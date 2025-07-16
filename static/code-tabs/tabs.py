# --8<-- [start:storage]
table.add_columns({
  "title_frame": extract_key_frame("video", 0),
  "description": img2txt("title_frame"),
  "embedding": embed("description")
})
# --8<-- [end:storage]
# --8<-- [start:search]
(table.search("flying cars", query_type="hybrid")
  .where("date > '2025-01-01'")
  .reranker("cross_encoder_tuned")
  .select(["id"]).limit(10)
  .to_pandas())
# --8<-- [end:search]
# --8<-- [start:feature_engineering]
ds = lance.dataset("s3://bucket/path.lance")
@lance.batch_udf()
def multiply_by_two(x: pa.RecordBatch) -> pa.RecordBatch:
    return pa.RecordBatch.from_arrays(
        [pc.multiply(x["id"], 2)], ["two"]
    )
ds.add_columns(multiply_by_two)
# --8<-- [end:feature_engineering]
# --8<-- [start:analytics]
db.sql("SELECT decode('audio_track', 'wav') "
       "FROM table WHERE id in ('1', '5', '324')")
# --8<-- [end:analytics]
# --8<-- [start:training]
for batch in DataLoader(table.where("video_height>=720").shuffle()):
  inputs, targets = batch["description"], batch["title_frame"]
  outputs = model(inputs)
  ...
# --8<-- [end:training]