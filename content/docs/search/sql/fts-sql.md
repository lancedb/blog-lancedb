---
title: Full-Text Search with SQL (Beta)
sidebar_title: FTS with SQL (Beta)
weight: 8
---

{{< admonition tip "Only in LanceDB Enterprise" >}}
This is a preview feature that is only available in LanceDB Enterprise.
{{< /admonition >}}

{{< admonition warning "Beta Feature - SQL Syntax Subject to Change" >}}
This feature is currently in beta. The SQL syntax and JSON query format may change in future releases as we continue to refine and improve the FTS SQL interface. We recommend testing thoroughly and being prepared to update your queries when upgrading to newer versions.
{{< /admonition >}}

LanceDB provides support for Full-Text Search via SQL queries using the `fts()` User-Defined Table Function (UDTF). This allows you to incorporate keyword-based search (based on BM25) in your SQL queries for powerful text retrieval.

## Table Setup

First, set up your FlightSQL client connection. See [SQL Queries documentation](/docs/search/sql/sql-queries/) for detailed client setup instructions.

For the examples below, we assume you have a `run_query()` helper function that executes SQL and returns results.

### Creating the Table

Create a table with text data:

{{< code language="python" >}}
run_query("""
    CREATE TABLE my_docs (
        id INT,
        text STRING,
        category STRING,
        author STRING
    )
""")
{{< /code >}}

### Inserting Data

Insert sample documents:

{{< code language="python" >}}
run_query("""
    INSERT INTO my_docs VALUES
    (1, 'The happy puppy runs merrily in the park', 'animals', 'Alice'),
    (2, 'A curious kitten jumps quickly over the fence', 'animals', 'Bob'),
    (3, 'The puppy catches a ball with great enthusiasm', 'sports', 'Alice'),
    (4, 'Dogs and cats are wonderful companions', 'animals', 'Charlie'),
    (5, 'Puppy training requires patience and dedication', 'training', 'Alice'),
    (6, 'The clever cat runs crazily around the house', 'animals', 'Bob'),
    (7, 'Running in the park is excellent exercise', 'sports', 'Charlie'),
    (8, 'Machine learning models process text efficiently', 'technology', 'David'),
    (9, 'The fuzzy puppy loves to play with toys', 'animals', 'Alice'),
    (10, 'Natural language processing enables text search', 'technology', 'David')
""")
{{< /code >}}

### Creating FTS Index

Create a full-text search index on the text column:

{{< code language="python" >}}
run_query("CREATE INDEX ON my_docs USING fts (text)")
{{< /code >}}

{{< admonition "note" "Phrase Queries Require Position Information" >}}
To use phrase queries (exact phrase matching), create the index with `with_position = true`:

```sql
CREATE INDEX ON my_docs USING fts (text) WITH (with_position = true)
```

Without position information, phrase queries will not work. See the [Phrase Queries](#phrase-queries) section below for details.
{{< /admonition >}}

## Basic Full-Text Search

Use the `fts()` UDTF in SQL queries with JSON-formatted search queries:

{{< code language="python" >}}
from lancedb.query import MatchQuery

# Create a match query and convert to JSON
query = MatchQuery("puppy", "text")
json_query = query.to_json()

# Execute FTS query via SQL
result = run_query(f"""
    SELECT id, text, category, _score
    FROM fts('my_docs', '{json_query}')
    ORDER BY _score DESC
    LIMIT 2
""")

print(result.to_pandas())
# Output (4 documents match "puppy", showing top 2):
#    id                                            text category   _score
# 0   5 Puppy training requires patience and dedication training 0.908106
# 1   3  The puppy catches a ball with great enthusiasm   sports 0.908106
{{< /code >}}

{{< admonition "important" "Getting Relevance Scores and Ordering Results" >}}
FTS queries compute a BM25 relevance score for each matching document. To use these scores effectively:

1. **Always select `_score`**: The `_score` column must be explicitly included in your SELECT clause
2. **Always order by `_score DESC`**: Without explicit ordering, results are returned in arbitrary order

```sql
-- ✅ CORRECT: Select _score and order by it
SELECT id, text, _score FROM fts('table', 'query') ORDER BY _score DESC

-- ❌ WRONG: No _score selected - you won't see relevance scores
SELECT id, text FROM fts('table', 'query')

-- ❌ WRONG: _score selected but not ordered - results in arbitrary order
SELECT id, text, _score FROM fts('table', 'query')
```
{{< /admonition >}}

## Advanced Query Types

### Fuzzy Search

Fuzzy search allows you to find matches even when the search terms contain typos:

{{< code language="python" >}}
from lancedb.query import MatchQuery

# Search with fuzzy matching (allows 2 character edits)
query = MatchQuery("pupy", "text", fuzziness=2)
json_query = query.to_json()

result = run_query(f"""
    SELECT id, text, _score
    FROM fts('my_docs', '{json_query}')
    ORDER BY _score DESC
    LIMIT 10
""")

print(result.to_pandas())
# Output - fuzzy matching finds "puppy" despite the typo "pupy":
#    id                                            text   _score
# 0   9         The fuzzy puppy loves to play with toys 2.932387
# 1   1        The happy puppy runs merrily in the park 0.908106
# 2   5 Puppy training requires patience and dedication 0.908106
# 3   3  The puppy catches a ball with great enthusiasm 0.908106
# Note: Row 9 has a higher score because it contains both "fuzzy" and "puppy"
{{< /code >}}

### Phrase Queries

Search for exact phrases in documents:

{{< code language="python" >}}
from lancedb.query import PhraseQuery

# Search for exact phrase
query = PhraseQuery("happy puppy", "text")
json_query = query.to_json()

result = run_query(f"""
    SELECT id, text, _score
    FROM fts('my_docs', '{json_query}')
    ORDER BY _score DESC
    LIMIT 10
""")
{{< /code >}}

{{< admonition "note" >}}
For phrase queries to work, the FTS index must be created with `with_position=true`:
```sql
CREATE INDEX ON my_docs USING fts (text) WITH (with_position = true)
```
{{< /admonition >}}

#### Phrase Queries with Slop

Allow some flexibility in phrase matching with the `slop` parameter:

{{< code language="python" >}}
from lancedb.query import PhraseQuery

# Allow up to 2 words between "puppy" and "park"
query = PhraseQuery("puppy park", "text", slop=2)
json_query = query.to_json()

result = run_query(f"""
    SELECT id, text, _score
    FROM fts('my_docs', '{json_query}')
    ORDER BY _score DESC
    LIMIT 10
""")
{{< /code >}}

### Boolean Queries

Combine multiple queries using boolean logic:

#### AND Queries

{{< code language="python" >}}
from lancedb.query import MatchQuery

# Find documents containing both "puppy" AND "happy"
query = MatchQuery("puppy", "text") & MatchQuery("happy", "text")
json_query = query.to_json()

result = run_query(f"""
    SELECT id, text, _score
    FROM fts('my_docs', '{json_query}')
    ORDER BY _score DESC
    LIMIT 10
""")
{{< /code >}}

#### OR Queries

{{< code language="python" >}}
from lancedb.query import MatchQuery

# Find documents containing either "puppy" OR "kitten"
query = MatchQuery("puppy", "text") | MatchQuery("kitten", "text")
json_query = query.to_json()

result = run_query(f"""
    SELECT id, text, category, _score
    FROM fts('my_docs', '{json_query}')
    ORDER BY _score DESC
    LIMIT 10
""")

print(result.to_pandas())
# Output shows results matching either term:
#    id                                            text category   _score
# 0   2   A curious kitten jumps quickly over the fence  animals 1.874457  # Contains "kitten"
# 1   9         The fuzzy puppy loves to play with toys  animals 0.908106  # Contains "puppy"
# 2   5 Puppy training requires patience and dedication training 0.908106  # Contains "puppy"
# 3   1        The happy puppy runs merrily in the park  animals 0.908106  # Contains "puppy"
# 4   3  The puppy catches a ball with great enthusiasm   sports 0.908106  # Contains "puppy"
{{< /code >}}

### Boost Queries

Control relevance by boosting or demoting certain terms:

{{< code language="python" >}}
from lancedb.query import MatchQuery, BoostQuery

# Boost documents with "puppy", demote those with "kitten"
query = BoostQuery(
    positive=MatchQuery("puppy", "text"),
    negative=MatchQuery("kitten", "text"),
    negative_boost=0.2
)
json_query = query.to_json()

result = run_query(f"""
    SELECT id, text, _score
    FROM fts('my_docs', '{json_query}')
    ORDER BY _score DESC
    LIMIT 10
""")
{{< /code >}}

### Multi-Match Queries

Search across multiple columns simultaneously:

{{< code language="python" >}}
from lancedb.query import MultiMatchQuery

# Search "puppy" in both text and category columns
query = MultiMatchQuery("puppy", ["text", "category"])
json_query = query.to_json()

result = run_query(f"""
    SELECT id, text, category, _score
    FROM fts('my_docs', '{json_query}')
    ORDER BY _score DESC
    LIMIT 10
""")
{{< /code >}}

#### Multi-Match with Field Boosting

{{< code language="python" >}}
from lancedb.query import MultiMatchQuery

# Boost matches in "text" column 2x more than "category"
query = MultiMatchQuery("puppy", ["text", "category"], boosts=[2.0, 1.0])
json_query = query.to_json()

result = run_query(f"""
    SELECT id, text, category, _score
    FROM fts('my_docs', '{json_query}')
    ORDER BY _score DESC
    LIMIT 10
""")
{{< /code >}}

## Combining FTS with SQL

FTS queries can be combined with standard SQL features like WHERE clauses, GROUP BY, and JOINs:

{{< code language="python" >}}
from lancedb.query import MatchQuery

query = MatchQuery("puppy", "text")
json_query = query.to_json()

# Combine FTS with WHERE clause to filter by category
result = run_query(f"""
    SELECT id, text, category, _score
    FROM fts('my_docs', '{json_query}')
    WHERE category = 'animals'
    ORDER BY _score DESC
    LIMIT 10
""")
{{< /code >}}

## Query Parameters Reference

For detailed information about query parameters and options for `MatchQuery`, `PhraseQuery`, `BoostQuery`, and `MultiMatchQuery`, see the [Full-Text Search documentation](/docs/search/full-text-search/#query-types).

## Related Documentation

- [Full-Text Search Overview](/docs/search/full-text-search/) - Learn about FTS capabilities and query types
- [SQL Queries](/docs/search/sql/sql-queries/) - General SQL query documentation
- [Hybrid Search](/docs/search/hybrid-search/) - Combine FTS with vector search
