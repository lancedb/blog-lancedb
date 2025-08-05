import lancedb
import pandas as pd
from datasets import load_dataset
from sentence_transformers import SentenceTransformer
from lancedb.pydantic import LanceModel, Vector
import pyarrow as pa

print("Loading PubMed Summarization dataset...")
try:
    dataset = load_dataset("ccdv/pubmed-summarization", split="train[:10000]")
    df = dataset.to_pandas()
except Exception as e:
    print(f"Failed to load dataset. Error: {e}")
    print("Please ensure you have an active internet connection.")
    exit()

print("Preprocessing medical data...")
df.rename(columns={'abstract': 'text'}, inplace=True)

df['title'] = df['article'].str.split().str[:10].str.join(' ') + '...'

df['text'] = df['text'].str.strip()
df = df.dropna(subset=['text', 'title'])
df = df[df['text'] != '']
df = df.reset_index(drop=True)
df['id'] = df.index.astype(str)

print(f"Loaded and processed {len(df)} medical abstracts.")

print("Loading embedding model...")
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

print("Connecting to LanceDB...")
db = lancedb.connect("./pubmed_db")

def embed_and_yield_batches(data_df: pd.DataFrame, batch_size: int = 128):
    for i in range(0, len(data_df), batch_size):
        chunk_df = data_df.iloc[i:i + batch_size]
        texts = chunk_df['text'].tolist()
        
        embeddings = embedding_model.encode(texts, show_progress_bar=False)
        
        batch = pa.RecordBatch.from_pydict({
            "id": chunk_df['id'].tolist(),
            "title": chunk_df['title'].tolist(),
            "text": texts,
            "vector": embeddings.tolist()
        })
        
        yield batch
        print(f"Processed and yielded batch {i//batch_size + 1} of {len(data_df)//batch_size + 1}", end='\r')

class MedicalData(LanceModel):
    id: str
    title: str
    text: str
    vector: Vector(embedding_model.get_sentence_embedding_dimension())

tbl = db.create_table("pubmed_abstracts", schema=MedicalData, mode="overwrite")

print(f"Starting scalable ingestion into LanceDB...")
tbl.add(embed_and_yield_batches(df))

print("\nCreating FTS index for keyword search...")
tbl.create_fts_index("text")

print("\nSetup complete! Your AI Medical Research Assistant's knowledge base is ready.")