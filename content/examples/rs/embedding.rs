use std::{iter::once, sync::Arc};

use arrow_array::{Float64Array, Int32Array, RecordBatch, RecordBatchIterator, StringArray};
use arrow_schema::{DataType, Field, Schema};
use futures::StreamExt;
use lancedb::{
    arrow::IntoArrow,
    connect,
    embeddings::{openai::OpenAIEmbeddingFunction, EmbeddingDefinition, EmbeddingFunction},
    query::{ExecutableQuery, QueryBase},
    Result,
};

#[tokio::main]
async fn main() -> Result<()> {
    // --8<-- [start:embedding]
    let tempdir = tempfile::tempdir().unwrap();
    let tempdir = tempdir.path().to_str().unwrap();
    let api_key = std::env::var("OPENAI_API_KEY").expect("OPENAI_API_KEY is not set");
    let embedding = Arc::new(OpenAIEmbeddingFunction::new_with_model(
        api_key,
        "text-embedding-3-large",
    )?);

    let db = connect(tempdir).execute().await?;
    db.embedding_registry()
        .register("openai", embedding.clone())?;

    let table = db
        .create_table("vectors", make_data())
        .add_embedding(EmbeddingDefinition::new(
            "text",
            "openai",
            Some("embeddings"),
        ))?
        .execute()
        .await?;

    let query = Arc::new(StringArray::from_iter_values(once("something warm")));
    let query_vector = embedding.compute_query_embeddings(query)?;
    let mut results = table
        .vector_search(query_vector)?
        .limit(1)
        .execute()
        .await?;

    let rb = results.next().await.unwrap()?;
    let out = rb
        .column_by_name("text")
        .unwrap()
        .as_any()
        .downcast_ref::<StringArray>()
        .unwrap();
    let text = out.iter().next().unwrap().unwrap();
    println!("Closest match: {}", text);
    Ok(())
    // --8<-- [end:embedding]
}
