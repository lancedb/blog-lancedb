# --8<-- [start:feature_engineering]
table.add_columns({
    "title_frame": extract_key_frame("video", 0),
    "description": img2txt("title_frame"),
    "embedding": embed("description")
})
# --8<-- [end:feature_engineering]