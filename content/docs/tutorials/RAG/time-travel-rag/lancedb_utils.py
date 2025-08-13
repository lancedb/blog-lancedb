

import lancedb
import os
import shutil
from typing import List, Dict, Any, Optional
import pandas as pd

def initialize_database(db_uri: str):
    print("--- Initializing Database Environment ---")
    if os.path.exists(db_uri):
        shutil.rmtree(db_uri)
        print(f"Removed old database at {db_uri}")
    os.makedirs(db_uri, exist_ok=True)
    return lancedb.connect(db_uri)

def create_table(db: lancedb.DBConnection, table_name: str, data: List[Dict[str, Any]]) -> Optional[lancedb.table.Table]:
    if not data:
        print("No data provided to create table. Aborting.")
        return None
    try:
        print(f"\nCreating table '{table_name}'...")
        tbl = db.create_table(table_name, data=data)
        print(f"✅ Table '{table_name}' created. Version: {tbl.version}, Rows: {len(tbl)}")
        return tbl
    except Exception as e:
        print(f"Error creating table '{table_name}': {e}")
        return None

def add_to_table(table: lancedb.table.Table, data: List[Dict[str, Any]]):
    if not data:
        print("No data provided to add to table.")
        return
    try:
        table.add(data)
        print(f"✅ Data added to '{table.name}'. New Version: {table.version}, Total Rows: {len(table)}")
    except Exception as e:
        print(f"Error adding data to table '{table.name}': {e}")

def open_table_at_version(db: lancedb.DBConnection, table_name: str, version: int) -> Optional[lancedb.table.Table]:
    try:
        print(f"\nAttempting to open '{table_name}' and checkout version {version}...")
        tbl = db.open_table(table_name)
        tbl.checkout(version)
        print(f"✅ Successfully checked out Version {version} of '{table_name}'. Total rows: {len(tbl)}")
        return tbl
    except Exception as e:
        print(f"Could not open table '{table_name}' at version {version}. Error: {e}")
        return None

def search_table(table: lancedb.table.Table, query_vector, limit: int = 2) -> pd.DataFrame:
    print(f"Querying table '{table.name}' (Version {table.version})...")
    return table.search(query_vector).limit(limit).to_pandas()
