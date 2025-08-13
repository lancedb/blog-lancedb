

import config
import fetch_docs
import embed_ingest
import lancedb_utils
from datetime import datetime, timedelta
import textwrap
import pandas as pd

def find_next_publication_date(start_date_str: str, max_days_to_search: int = 7) -> (str, list):
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
    for i in range(1, max_days_to_search + 1):
        check_date = start_date + timedelta(days=i)
        date_str = check_date.strftime('%Y-%m-%d')
        docs = fetch_docs.fetch_documents(date_str, per_page=500)
        if docs:
            return date_str, docs
    return None, []

def print_search_result(result_df: pd.DataFrame, version: str):
    print(f"\n--- Top Result for Version: {version} ---")
    if result_df.empty:
        print("No results found for this version.")
        return

    top_result = result_df.iloc[0]
    print(f"📄 Title: {top_result['title']}")
    print(f"🗓️  Date: {top_result['publication_date']}")
    print(f"📏 Distance: {top_result['_distance']:.4f}")
    print("📝 Abstract:")
    

    abstract = top_result.get('abstract') or "[No abstract available for this document]"
    
    wrapped_abstract = textwrap.fill(abstract, width=100)
    print(wrapped_abstract)
    print("--------------------------------------")


def run_workflow():
    db = lancedb_utils.initialize_database(config.DB_URI)
    prod_model = embed_ingest.get_embedding_model(config.PRODUCTION_MODEL)

    print("\n--- STEP 1: Initial Data Ingestion ---")
    initial_docs = []
    last_publication_date = config.REPRODUCIBLE_START_DATE
    
    last_publication_date, initial_docs = find_next_publication_date(last_publication_date)
    if not initial_docs:
        print("Failed to fetch any data to create an initial table. Exiting.")
        return
    
    initial_data = embed_ingest.embed_documents(prod_model, initial_docs)
    tbl = lancedb_utils.create_table(db, config.TABLE_NAME, initial_data)
    if not tbl:
        return

    print("\n--- STEP 2: Simulating Sequential Daily Updates ---")
    
    last_publication_date, update_docs_1 = find_next_publication_date(last_publication_date)
    if update_docs_1:
        update_data_1 = embed_ingest.embed_documents(prod_model, update_docs_1)
        lancedb_utils.add_to_table(tbl, update_data_1)

    last_publication_date, update_docs_2 = find_next_publication_date(last_publication_date)
    if update_docs_2:
        update_data_2 = embed_ingest.embed_documents(prod_model, update_docs_2)
        lancedb_utils.add_to_table(tbl, update_data_2)
        
    print("\n\n========================================================")
    print("= PART 1: AUDITING KNOWLEDGE BASE ACROSS TIME  =")
    print("========================================================")
    
    query_text = "cybersecurity reporting requirements for public companies"
    print(f"\nRunning audit for query: '{query_text}'")
    query_vector = prod_model.encode(query_text)

    for version_num in range(1, tbl.version + 1):
        tbl_to_search = lancedb_utils.open_table_at_version(db, config.TABLE_NAME, version=version_num)
        if tbl_to_search:
            search_results = lancedb_utils.search_table(tbl_to_search, query_vector, limit=1)
            print_search_result(search_results, f"V{version_num} ({config.PRODUCTION_MODEL})")

    print("\n✅ Date-based audit complete. Results show how knowledge evolves over time.")

    print("\n\n=============================================================")
    print("= PART 2: A/B TESTING DIFFERENT EMBEDDING MODELS  =")
    print("=============================================================")
    
    latest_prod_data = tbl.to_pandas().to_dict('records')
    
    exp_model = embed_ingest.get_embedding_model(config.EXPERIMENTAL_MODEL)
    experimental_data = embed_ingest.embed_documents(exp_model, latest_prod_data)
    
    try:
        db.drop_table(config.EXPERIMENTAL_TABLE_NAME)
    except Exception:
        pass 
        
    exp_tbl = lancedb_utils.create_table(db, config.EXPERIMENTAL_TABLE_NAME, experimental_data)
    
    if exp_tbl:
        print("\nComparing search results for the same data with different models:")
        
        prod_search_result = lancedb_utils.search_table(tbl, query_vector, limit=1)
        print_search_result(prod_search_result, f"Latest Prod V{tbl.version} ({config.PRODUCTION_MODEL})")
        
        exp_query_vector = exp_model.encode(query_text)
        exp_search_result = lancedb_utils.search_table(exp_tbl, exp_query_vector, limit=1)
        print_search_result(exp_search_result, f"Experimental ({config.EXPERIMENTAL_MODEL})")

    print("\n✅ A/B test complete. Notice the difference in relevance (distance score) between models.")


if __name__ == "__main__":
    run_workflow()
