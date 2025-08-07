import streamlit as st
import lancedb
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from sentence_transformers import SentenceTransformer

st.set_page_config(
    page_title="AI Medical Research Assistant",
    page_icon="⚕️",
    layout="wide"
)
st.title("⚕️ AI Medical Research Assistant")
st.write("Ask questions about 10000 abstracts from PubMed. Choose your search mode below.")

search_mode = st.selectbox(
    "Select Search Mode:",
    ("Hybrid", "Vector", "Full-Text (FTS)"),
)

@st.cache_resource
def load_llm_and_tokenizer():
    st.info("Loading LLM and Tokenizer... (This may take a while without quantization)")
    model_id = "openai/gpt-oss-20b"
    
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    model = AutoModelForCausalLM.from_pretrained(
        model_id,
        torch_dtype=torch.float16, 
        device_map="auto",
    )
    return model, tokenizer

@st.cache_resource
def load_embedding_model():
    return SentenceTransformer('all-MiniLM-L6-v2')

@st.cache_resource
def connect_to_db():
    db = lancedb.connect("./pubmed_db")
    return db.open_table("pubmed_abstracts")

model, tokenizer = load_llm_and_tokenizer()
embedding_model = load_embedding_model()
tbl = connect_to_db()

def get_rag_response(query: str, mode: str):
    query_vector = embedding_model.encode(query)
    
    if mode == "Vector":
        results_df = tbl.search(query_vector).limit(5).to_pandas()
    elif mode == "Full-Text (FTS)":
        results_df = tbl.search(query, query_fts="fts").limit(5).to_pandas()
    elif mode == "Hybrid":
        results_df = tbl.search(query_type="hybrid").vector(query_vector).text(query).limit(10).to_pandas().head(5)

    context = "\n\n".join(
        [f"Title: {row['title']}\nAbstract: {row['text']}" for _, row in results_df.iterrows()]
    )
    source_info = [f"📄 **{row['title']}** (ID: {row['id']})" for _, row in results_df.iterrows()]
    
    prompt_template = f"""
    You are an expert AI assistant for medical researchers. Your task is to answer the user's question
    based ONLY on the provided context from PubMed abstracts.
    Do not use any outside knowledge. Be concise and factual.
    
    IMPORTANT: You are not a doctor. You do not provide medical advice.
    Your purpose is to summarize information from the provided texts for research purposes.
    If the context does not contain the answer, state that "The provided abstracts do not contain information on this topic."

    CONTEXT:
    ---
    {context}
    ---
    QUESTION: {query}
    ANSWER:
    """

    inputs = tokenizer(prompt_template, return_tensors="pt").to("cuda")
    output = model.generate(**inputs, max_new_tokens=250, temperature=0.7)
    response = tokenizer.decode(output[0], skip_special_tokens=True)

    answer = response.split("ANSWER:")[1].strip()
    return answer, source_info

query = st.text_input("Enter your research question:", placeholder="e.g., What are common treatments for hypertension?")

if query:
    with st.spinner(f"Performing {search_mode} search and generating answer..."):
        answer, sources = get_rag_response(query, search_mode)
        
        st.subheader("Summary from Abstracts:")
        st.markdown(answer)

        with st.expander("Retrieved Sources"):
            for source in sources:
                st.markdown(source)