---
title: "Chunking Analysis: Which is the right chunking approach for your language?"
date: 2025-01-27
draft: false
featured: false
categories: ["Engineering"]
image: /assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/chunking-analysis-which-is-the-right-chunking-approach-for-your-language.png
description: "Explore chunking analysis: which is the right chunking approach for your language? with practical insights and expert guidance from the LanceDB team."
author: Shresth Shukla
author_avatar: "/assets/authors/community.jpg"
author_bio: "AI/ML engineer passionate about multilingual NLP and retrieval systems. Contributes to the LanceDB community with practical insights on chunking strategies and RAG applications."
author_twitter: ""
author_github: ""
author_linkedin: ""
---

Before we even start discussing the right chunking approach for your language, the first question that should come to mind is **whether the chunking approach depends on the language or not**. Also, how much do you think the chunking method affects retrieval across languages when building RAG applications?

You'll find people using the same approach in all languages, and often it works, but is it the right approach? Do we have any analysis to back this approach? Have you ever thought of trying out new chunking methods, especially when working on a language-specific project? We'll do that today. By the end of this blog, you'll have answers to two questions:

1. Does chunking depend on the language?
2. Which is the right chunking approach for your language?

In this blog, we'll analyze and compare major chunking approaches like fixed character splitting, semantic, and clustering methods. We'll test if specific chunking approaches suit certain languages, using text in English, Hindi, French, and Spanish.

We'll review the basics and explore how chunking impacts retrieval in RAGs. First, we'll examine how chunk sizes affect the number of chunks across languages. Next, we'll analyze how chunking the same text in Hindi, French, or Spanish produces different results and similarity scores. Finally, we'll cover advanced chunking methods like semantic and clustering approaches.

{{< admonition info "Key Finding" >}}
This analysis highlights that chunking significantly impacts retrieval, especially in a multilingual context.
{{< /admonition >}}

I've attached the link to the Colab notebook at the end of the blog if you want to try it yourself and discover the best approach for your needs.

### Quick Intro

We have come a long way from when chunking and RAG were just buzzwords. Today, they are a reality, with more companies building RAG systems using advanced strategies across multiple languages. Almost every day (hehe), a new paper with "RAG" in its title gets published.

![RAG Papers Growth](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-2.png)

In case you're unaware, chunking in the context of building retrieval systems generally refers to **breaking down longer texts into smaller pieces** (chunks) and saving them as dense vector representations using techniques like transformer-based models or word embeddings. I'm assuming you already know this.

![OpenAI Chunking Example](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-3.png)
*Image from OpenAI Blog*

We'll be using *sentence transformers'*,* multilingual embeddings* for this analysis, but you can definitely experiment with other multilingual embeddings available in the market for this. It maps sentences & paragraphs to a 384-dimensional dense vector space and can be used for tasks like clustering or semantic search. There's no specific reason behind choosing this model but I wanted an embedding model that I could use for these 4 languages (Hindi, English, Spanish and French), and turned out it could serve the purpose.

I looked over the internet to see if there is any analysis I can read to understand how different languages behave when it comes to chunking, but sadly I wasn't able to find one. To understand why we even need such analysis, we need to understand how languages behave, and that's exactly what we'll do today. We'll see how languages behave differently, which confirms that we might need to process texts in different languages separately. Then we'll move on to trying out chunking approaches on these texts.

![Language Behavior Analysis](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-4.png)

The most common approach that people use these days is.......... I think you can make a guess! It's *RecursiveCharacterTextSplitter()*. This analysis will help you understand how different languages behave when we use *RecursiveCharacterTextSplitter() *in our code and what could be the best chunk size for it. Refer to the code to do it on your text and experiment further.

And while we start our analysis, it's important to know what approaches exist and when or when not to try those approaches. Overall, there are the following major chunking methods that exist, and we'll try some of them today -

1. CharacterTextSplitter()
2. TokenTextSplitter()
3. RecursiveCharacterTextSplitter()
4. Semantic Chunking
5. Clustering Based Approaches (CRAG)
6. LLM-based chunking (Agent assisted)

### How do you find the best chunk size for RecursiveCharacterTextSplitter()?

Before we understand how languages behave, let's first see in detail what happens when we use different languages with *RecursiveCharacterTextSplitter()*, and then we'll understand why it might be happening in the second section of this blog.

I believe, and I have seen myself, that people often use this approach directly while building their projects and then experiment with chunk sizes. I've seen people using this in production, so it seems to be the best fit for analyzing fixed character splitting. I analyzed all four languages, and things turned out interesting.

![Sample English Text](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-5.png)
*Sample English Text Used*

I used different chunk sizes for processing and stored the chunks in the LanceDB database as vectors. I stored them in different tables so that I could later query and identify which chunk gave the highest similarity score. At the time, I used a 50-character overlap for all of the chunk sizes during my analysis. The notebook is all yours to explore and experiment with other chunk overlaps!

We can divide the text into chunks and save them into LanceDB using the following code–

```python
import os
from typing import List, Dict, Any, Tuple
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain.schema import Document
import lancedb
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import nltk

nltk.download('punkt_tab')

def process_text(text: str,
                chunk_sizes: List[int],
                model_name: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
                db_path: str = "/content/lancedb_data",
                language: str = "text") -> Dict:
    
    # Initialize
    embeddings = HuggingFaceEmbeddings(model_name=model_name)
    db = lancedb.connect(db_path)
    processed_data = {}

    # Preprocess text
    text = text.replace("\n", " ")
    for chunk_size in chunk_sizes:
        print(f"\nCreating chunks of size {chunk_size}")

        # Create chunks
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=50
        )
        chunks = splitter.create_documents([text])
        chunk_texts = [chunk.page_content for chunk in chunks]
        embeddings_list = embeddings.embed_documents(chunk_texts)

        # Store in LanceDB. For each language and for that specific chunk we'll create a single table and store all chunks there.
        table_name = f"{language}_chunks_{chunk_size}"
        df = pd.DataFrame({
            "text": chunk_texts,
            "vector": embeddings_list,
            "chunk_index": range(len(chunks)),
            "char_length": [len(chunk) for chunk in chunk_texts]
        })

        db.create_table(table_name, data=df, mode="overwrite") 
        #table with same name will be overwritten when we rerun the query over another text.

        # Store metadata
        processed_data[chunk_size] = {
            "num_chunks": len(chunks),
            "table_name": table_name,
            "avg_length": df['char_length'].mean()
        }

    return processed_data
```

The summary of processing English language chunks across these 4 sizes looks like this:

![English Chunk Summary](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-7.png)

When we used a chunk size of 100, the English text was divided into 227 chunks. As we increase the chunk size, the number of chunks starts reducing, which is expected since more text fits into a single chunk.

But what happens when we process the same text in multiple languages? Let's say we take four languages: English, Hindi, French, and Spanish. We processed the same text as in English across all these languages, and the results turned out to be quite interesting. 👀

![Language Chunk Distribution](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-9.png)
*Distribution of no. of chunks vs chunk sizes across languages*

{{< admonition important "Language Behavior Insight" >}}
There's a noticeable difference with smaller chunk sizes. With a chunk size of 100, all four languages were split into multiple chunks (i.e., 227, 236, 253, and 238). The same piece of information was stored in fewer or more chunks depending on the language.
{{< /admonition >}}

This pattern changes as we increase the chunk size. When the chunk size increases from 100 to 400, we observe that the difference in the number of chunks becomes less significant with the Recursive Character Text Splitter. English and Hindi texts were split into almost the same number of chunks after a size of 100, while French and Spanish behaved somewhat similarly after 100.

An initial observation is that English and Hindi are quite similar in nature, both in how they contain and present information. While this isn't a generalization, similar analyses could be conducted to understand how other languages behave and how they store the same information.

We can't judge which chunk size to choose until we test the retrieval process and analyze how it is affected by increasing chunk size. Our embedding data is stored in LanceDB as tables for each language and each chunk size.

![LanceDB Tables](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-10.png)

Code to query from tables stored in LanceDB–

```python
def search_chunks(query: str,
                 chunk_size: int,
                 language: str = "text",
                 model_name: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
                 db_path: str = "/content/lancedb_data",
                 top_k: int = 3) -> Dict:

    # Initialize
    embeddings = HuggingFaceEmbeddings(model_name=model_name)
    db = lancedb.connect(db_path)

    # Get query embedding
    print(f"Processing query: '{query}'")
    query_embedding = embeddings.embed_query(query)

    # Search in LanceDB
    table_name = f"{language}_chunks_{chunk_size}"
    table = db.open_table(table_name)
    results = table.search(query_embedding).metric('cosine').limit(top_k).to_pandas()

    # Calculate similarity scores
    similarities = 1 - results['_distance'].values

    # Prepare results
    search_results = {
        'texts': results['text'].tolist(),
        'similarity_scores': similarities.tolist(),
        'char_lengths': results['char_length'].tolist(),
        'query': query,
        'chunk_size': chunk_size,
        'avg_similarity': np.mean(similarities)
    }
    
    return search_results
```

Refer notebook for implementation.

Before we move on to comparisons, here's what the result for one chunk size looks like. I searched for the question "**एजीआई क्या है?**". For a chunk size of 400 in the Hindi language, we have the following results:

![Hindi Query Results](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-11.png)

If we examine the combined results for a chunk size of 400 for the same question — "What is AGI?" across all the other languages, they look like this. Note that this plot is based solely on the results for a chunk size of 400. Do you notice anything unusual? Any strange behavior?

![Cross-Language Results](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-13.png)

Let's take a pause and look at the results we got through the retrieval. 

![English Results](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-14.png)
*Results for English*

![Hindi Results](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-15.png)
*Results for Hindi*

![French Results](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-16.png)
*Results for French*

![Spanish Results](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-17.png)
*Results for Spanish*

If you look at the retrieved results for chunk size 400, English and Hindi clearly performed better than French and Spanish. Another quick observation from here is that the first retrieved result in the case of correct answers differs greatly from the other two chunks, which do not contain relevant text and are unrelated to the question.

Quick note — We are using the cosine distance metric provided by **LanceDB** to compare vectors. It also offers other distance metrics that you can use per your use case or experimentation.

![LanceDB Distance Metrics](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-18-1.png)
*Other metrics provided by LanceDB*

Starting with the **Hindi** language, for the query — "**एजीआई क्या है?**", the similarity scores for multiple chunk sizes look like this:

![Hindi Similarity Scores](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-19.png)

{{< admonition tip "Chunk Size Finding" >}}
The top (first) retrieved chunk consistently has the highest similarity score. However, **the average score reveals that smaller chunk sizes generally yield better results with higher similarity scores compared to larger chunk sizes.** This suggests that smaller chunk sizes may improve overall retrieval precision, though they risk losing context.
{{< /admonition >}}

On the other hand, larger chunks contain more context and information but might not achieve the best average similarity search score.  

What about English? — look at this chart below.

![English Similarity Scores](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-20.png)

Let's take a look at the combined plot for all four languages.

![Combined Language Analysis](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-21.png)

The initial interpretation of this plot shows that we get different results with different chunk sizes for each language. Even though we used the same text and queried on the same chunk sizes, in each language, **one chunk size performed better than the others, and there is no direct solution to determine the best size universally.**

However, one clear insight from the above analysis is that, across the four languages processed, Spanish and French behaved differently compared to English and Hindi, both in terms of chunking and retrieval.

I think now, we are in a good position to ask why this might be happening and how languages actually differ from each other.

### How Languages Behave?

You should understand that language structure, particularly morphology (the study of word formation), plays a crucial role in chunking. **Morphology determines how words are formed and how they change to express different meanings, tenses, or cases. **This can affect the length and number of chunks, as words in some languages might be more compact or more descriptive than in others.

![Language Structure Impact](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-22.png)

In our case, if you notice, English and Hindi share certain grammatical structures and sentence patterns that make their **chunking behavior more similar.** Both languages use a Subject-Object-Verb (SOV) structure, and while there are inflections in Hindi, they do not lead to drastically different chunking behavior compared to English.

While, at the same time both **French** and **Spanish** have more complex morphology compared to **English** or **Hindi**, meaning they have a larger number of word forms depending on factors such as gender, number, verb conjugation, and case. These features make chunking and text segmentation different in these languages.

Let's take an example to understand this better. For the sentence, ***"I eat apples"***, in English language, the subject ("I") comes first, followed by the verb ("eat"), and then the object ("apples"). This structure is simple and consistent. In Hindi it would be — **"मैं सेब खाता हूँ।". **Here, the subject ("मैं") comes first, followed by the object ("सेब"), and finally the verb ("खाता हूँ"). The verb is always at the end, which makes it different from English. In French, it'd be — **"Je mange des pommes". **French follows the SVO order, just like English. However, when adjectives are involved, they often come **after** the noun. While in Spanish, it'd be — **"Yo como manzanas". **Spanish also follows SVO but with some flexibility. Spanish allows dropping the subject ("Yo"), while English, Hindi, and French typically do not.

Note that these (French and Spanish) also follow SVO, but with more frequent adjective-noun inversion and **different punctuation rules**, which can make chunking different because the chunks may need to account for these structural nuances.

That's why we need something that not only splits our text using some character limit but also understands the context and what is being talked about. That's where Semantic Chunking would come into play.

![Advanced Chunking Approaches](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-25.png)
*Things are gonna be interesting now.*

## Advanced Chunking: Semantic and Clustering based approach

I'm sure you'd agree with me that limiting chunking to the number of characters may result in an overall loss of information and context between chunks. I mean, it doesn't really make sense to split text randomly in between. So, we need some approach that also understands the meaning and the context of these sentences. One such way is by doing Semantic Chunking.

First, we split the text into individual sentences using (not mandatory) NLTK's sentence tokenizer. This preserves natural language boundaries rather than breaking text arbitrarily using the number of characters. Here, we can experiment with different models and especially language-specific models available for tokenization. 

For example, NLTK provides the option to pass a language as a parameter while splitting into sentences. We'll use the "*sent_tokenize()*" function here. It relies on pre-trained language models to determine sentence boundaries. It not only searches for punctuations like '? , . !', but also accounts for abbreviations like "Mr." and "U.S.A" to make sure these are not interpreted as boundaries, which might happen if you use simple regex code.

There's another alternative to NLTK, i.e., to use spaCy models. spacy also provides language-specific tokenizers, and definitely, you can experiment with that if you want to.

I tried it on all 4 languages bypassing the language as a parameter and got almost similar results, so I combined approaches for those languages. In Hindi, punctuation is not like full stops (.), instead, it has "|" (danda) punctuation. I used `sent_tokenize()` for all other three languages and a simple regex splitter for Hindi.

Once we split the larger text into sentences, the next step is to combine these sentences based on semantic meaning to make groups that make more sense. Ideally, there are multiple ways of doing this. Two of them are  – 

1. **Sequential Semantic Chunking**: One way could be grouping sentences in sequential order based on similarity. That means if the similarity between the first chunk and the second chunk is more than the threshold point, we group them together. If it's less than the threshold, we create the next group.
2. **Semantic and Clustering Combined**: Another way could be making clusters of our sentences and then grouping those sentences together based on these clusters to form a chunk. So, we create embeddings, and based on these embedding vectors, we further divide them into a certain number of clusters, which we combine to form chunks at the end. We combine sentences in each cluster together. One argument could be around defining the number of clusters, but I have tried to find the number of clusters programmatically by passing minimum and maximum chunk sizes.

### Sequential Semantic Chunking

We'll try both of the approaches one by one. Starting with the first approach, it is recommended to use when the order of content is more important because in this approach, we combine the chunks in sequential order. Ideal use cases could be, for example, if you are processing chat messages, you might want to retain the order of your text.

The high-level flow of semantic chunking would look like this – 

![Sequential Semantic Chunking](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/semantic_chunking.png)
*Sequential Semantic Chunking*

Clearly, we'll take the text and divide it into sentences. Since there are chances that many sentences will be created during the splitting of the text, we'll group those sentences in sequence if they are discussing the same topic. Remember those large number of chunks being created when we used fixed character text splitters? Around 200-something, right? What do you think will happen this time? Initially, when we split the text into sentences, we got 90 chunks for English. (Already reduced xd)

Here's the code snippet that you can refer to for this approach. (use Colab for full code and testing it)–

```python
import re
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def store_embeddings(chunks: List[str], table_name: str, model_name: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2", overwrite=True):
    # Create embeddings
    model = SentenceTransformer(model_name)
    embeddings = model.encode(chunks)

    # Connect to LanceDB
    db = lancedb.connect("./lancedb")

    # If table exists and overwrite is True, recreate it
    
    if table_name in db.table_names() and overwrite:
        db.drop_table(table_name)
    # Create new table
    table = db.create_table(
        table_name,
        data=[{
            "text": chunk,
            "vector": embedding
        } for chunk, embedding in zip(chunks, embeddings)]
    )
    return table

#check colab for full code.

def combine_chunks(chunks: list) -> list:
    for i in range(len(chunks)):
        combined_chunk = ""
        if i > 0:
            combined_chunk += chunks[i - 1]["chunk"]
        combined_chunk += chunks[i]["chunk"]
        if i < len(chunks) - 1:
            combined_chunk += chunks[i + 1]["chunk"]
        chunks[i]["combined_chunk"] = combined_chunk

    return chunks

def add_embeddings_to_chunks(model, chunks: list) -> list:
    combined_chunks_text = [chunk["combined_chunk"] for chunk in chunks]
    chunk_embeddings = model.encode(combined_chunks_text, show_progress_bar=True)
    for i, chunk in enumerate(chunks):
        chunk["embedding"] = chunk_embeddings[i]
    return chunks

def calculate_cosine_distances(chunks: list) -> list:
    distances = []
    for i in range(len(chunks) - 1):
        current_embedding = chunks[i]["embedding"]
        next_embedding = chunks[i + 1]["embedding"]

        similarity = cosine_similarity([current_embedding], [next_embedding])[0][0]
        distance = 1 - similarity

        distances.append(distance)
        chunks[i]["distance_to_next"] = distance

    return distances
```

To explain a bit about the process going on here – For each pair of consecutive embeddings, the cosine similarity is calculated. Once we get the similarity, we can calculate the distance between each sentence. Then we calculate the threshold value. The threshold is calculated as the percentile value (e.g., the 90th percentile) of the cosine distances. It is essentially a filter to identify "significant transitions" in the text, where the semantic similarity between consecutive sections drops sharply. Then we iterate over the distances and compare each one to the threshold value. If a distance exceeds the threshold, it indicates a significant semantic transition, and its position is added to crossing points.

![Semantic Chunking Analysis](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-26.png)
*Check Colab for full code*

Look at this chart above. Did you notice something? Once we do semantic chunking, we get 11 crossing points, and here we combine similar sentences together. That means these were the points where there was a slight change in context, and other things would have been discussed in the text. For each crossing point, we'll create a new chunk from there to the next crossing point. This helps in two ways– 

1. First, we have reduced the number of chunks drastically.
2. More information related to that specific context is now available in those chunks instead of simply splitting based on character count.

For English, I got 90 sentences initially and 11 chunks of different sizes. A few are very large in size, and a few are small in terms of content, which might be because we started discussing new content in the later part of our text. Still, there are multiple ways to improve the current approach, and it's important to do so because we might get chunks that are often too large in size, which may create issues later.

![Hindi Language Analysis](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-27.png)
*Plot for Hindi Language - only 4 chunks*

So while this approach made more sense than RecursiveCharacterTextSplitter(), it has its own issues, like very high variance in chunk sizes due to solely matching on the semantics of sentences. That means a few chunks are over 4000 characters long, while some are only 400. The good part of doing this analysis over all the languages is that there's a similar pattern being observed while processing all of these languages.

![French Analysis](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-29.png)
*For French*

![English Analysis](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-30.png)
*For English*

![Spanish Analysis](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-31.png)
*For Spanish*

![Hindi Analysis](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-34.png)
*For Hindi*

They all behaved similarly and had 10-11 chunks at the end, which were far better than many chunks with irrelevant information. The only issue is that we haven't defined any chunk size limit here. I'll leave this experimentation to you to create chunks based on both semantics and chunk sizes and then examine the results.

But this approach might not work always. The reason being, what if I started talking about one topic, mixed it with some other topic, and then came back to discussing the same topic again? That means the content should be chunk in such a way that if I ask a certain question about that context, I should get all the details about that particular topic in a chunk, which we might miss due to semantic chunking. What is the solution then? A smart solution would be Clustering-based chunking.

### **Semantic and Clustering Combined**

I read about the clustering-based approach in this paper titled - [CRAG](https://arxiv.org/pdf/2406.00029v1).

![CRAG Paper](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-28.png)
*It's a good read if you are looking to try it out this approach.*

This paper was introduced in May 2024 and provides a detailed insight into how using a clustering-based approach could help you ***reduce your LLM call costs*** by reducing the number of tokens being sent.

Logically, there are various ways of doing clustering, and it depends on your use case or type of content. Ideally, if you think about it, there could be infinite ways of doing this, depending on what works and what doesn't. For example– 

1. You can create embeddings of all the text data initially and then create clusters and divide them into chunks. (Does this remind you of any recent paper? Late chunking?)
2. Or you can split your text into sentences and then create clusters on top of their embeddings.
3. Or maybe you can think of other approaches, xd.

I'll try the second one today. We have the text, we'll divide it into sentences, and then we'll use different clustering approaches, with the simplest and most effective one being K-means, and group sentences belonging to similar clusters. That makes sense, right?

A major issue is, that we might need to define the number of chunks as a parameter while using K-means, which we can choose to find programmatically by taking minimum and maximum chunk size preferences as parameters. Another alternative could be trying different clustering approaches like DBSCAN or any other.

Flow in this approach would be like this – 

![Clustering Based Approach](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/clustering_based_appraoch.png)
*High level flow of this chunking approach*

Let's do it. We'll first take the text and divide it into sentences. I used the following code depending on the language.

```python
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
import numpy as np
from typing import List
import nltk
import re
from nltk.tokenize import sent_tokenize

#This is just a part of code. Check notebook for full code for testing.

class SemanticTransformerChunker:
    def __init__(
        self,
        model_name: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
        min_chunk_size: int = 100,
        max_chunk_size: int = 2000,
        threshold_percentile: int = 90
    ):
        
    def determine_optimal_clusters(
        self,
        text_length: int,
        num_sentences: int
    ) -> int:

        """
        Determine optimal number of clusters based on text length
        and desired chunk sizes
        """

        avg_chars_per_sentence = text_length / num_sentences
        min_sentences = max(2, self.min_chunk_size / avg_chars_per_sentence)
        max_sentences = self.max_chunk_size / avg_chars_per_sentence

        return max(2, min(
            num_sentences // 2,  # Don't create too many clusters
            int(num_sentences / min_sentences)  # Ensure minimum chunk size
        ))

    def chunk_text(
        self,
        text: str,
        num_chunks: int = None
    ) -> List[str]:

        # Split into sentences (for those 3 languages)
        sentences = self.split_into_sentences(text)

        if len(sentences) < 3:
            sentences = self.split_hindi_text(text)
            print("splitting hindi text into sentences")

        # Get sentence embeddings
        embeddings = self.get_embeddings(sentences)

        # Determine number of clusters if not provided. it's better to determine this programmatically but we'll see how this might be concerning as well.
        if num_chunks is None:
            num_chunks = self.determine_optimal_clusters(
                len(text),
                len(sentences)
            )

        # Cluster sentences -- #if num_chunks given is more than no. of sentences, we'll take count of sentences as clusters.
        kmeans = KMeans(
            n_clusters=min(num_chunks, len(sentences)),

            random_state=42
        )

        clusters = kmeans.fit_predict(embeddings)
        # Sort sentences by cluster and position
        sentence_clusters = [(sent, cluster, i) for i, (sent, cluster)
                           in enumerate(zip(sentences, clusters))]
        sentence_clusters.sort(key=lambda x: (x[1], x[2]))

        # Combine sentences into chunks
        chunks = []
        current_chunk = []
        current_cluster = sentence_clusters[0][1]

        for sentence, cluster, _ in sentence_clusters:
            if cluster != current_cluster:
                chunks.append(" ".join(current_chunk))
                current_chunk = []
                current_cluster = cluster
            current_chunk.append(sentence)
            
        if current_chunk:
            chunks.append(" ".join(current_chunk))
        return chunks
```

Initially, we got 87 sentences from our text. The next step is to create embeddings and pass these embeddings to the clustering function. After using this approach, we got 43 clusters for the English language, which is neither too small nor too big. I did this same analysis over other languages too. It performed a bit weirdly for Hindi, but for the rest of the languages, it performed decently.

![Hindi Clustering Results](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-38.png)
*For Hindi, it only created 7 chunks*

![French Clustering Results](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-39.png)
*For French we got 42 chunks*

![Spanish Clustering Results](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-40.png)
*For Spanish, we got 42 chunks*

Now I'm thinking we've done enough chunk analysis; let's check retrieval over these chunks to figure out if they really make sense or not. I saved all the embedding vectors into **LanceDB** and created tables with the language in its name. You can look at the code for that. I asked 3 questions to see if I'm getting the perfect chunk or not. The first five chunks for the question "**What is AGI**" are— 

![AGI Query Results 1](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-41.png)

![AGI Query Results 2](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-42.png)

I believe the first 3-4 chunks contain enough information to answer the question "What is AGI?" On asking a different question, say, "**Does AGI control itself?**" we got—

![AGI Control Query](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-43.png)

This perfectly makes sense since the context is talking about the query being asked.

![Query Results Analysis](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-44.png)

For each query asked, it got decent results in the top 3 chunks. Oh wait, I hope you haven't forgotten the title of this blog. We were looking for some analysis to figure out whether we should try any specific chunking approach for any language. Let's look at the final approach, and then we'll come back to the questions.

### LLM based Chunking

People often call this approach "Agentic Chunking." As the name suggests, in this approach, we utilize LLMs during the chunking process to create quality chunks, so they can provide better retrieval.

Usually, there are two common approaches available on the internet– 

1. You give your entire text and ask it to split it into N number of chunks. (which doesn't make sense practically.)
2. You use LLM to create propositions that add meaning to individual sentences and then you create chunks from those sentences.

The second approach is quite popular these days. You use **LLM to create propositions** for your sentences. When we do this, the sentences can stand on their own meaning, meaning you don't necessarily need much context to understand what is being talked about or who the sentence is referring to.

For example, if our text looks like this – "Aman is a good guy. He recently met a boy named Akhil. They started playing chess. Aman liked chess. He plays chess at grandmaster level."

When we pass this text to the LLM to create propositions, it would come out like this –

![LLM Propositions Example](/assets/blog/chunking-analysis-which-is-the-right-chunking-approach-for-your-language/image-46.png)
*Can you notice the difference?*

['Aman is a good guy.', 'Aman met a boy named Akhil.', 'They started playing chess.', 'Aman liked chess.', 'Aman plays chess at grandmaster level.']

Did you notice the second sentence in the lineup? In our text, it was "*He recently met a boy named Akhil,*" while in the propositions, it turned out to be "*Aman met a boy named Akhil,*" which does not need surrounding context to understand who is being referred to. I hope you got the point.

Code to create propositions– 

```python
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.output_parsers import CommaSeparatedListOutputParser
from typing import List
import google.generativeai as genai
from tqdm import tqdm
from langchain import hub
from langchain.pydantic_v1 import BaseModel

#check colab for full code
def create_propositions(text: str, llm: ChatGoogleGenerativeAI) -> List[str]:
    """Extract propositions from text using Gemini"""
    output_parser = CommaSeparatedListOutputParser()

    try:
        # Get propositions from Gemini
        prompt = get_proposition_prompt(text)
        # prompt = hub.pull("wfh/proposal-indexing")

        response = llm.invoke(prompt)

        response = response.content #make sure you add .content since the response it AI message
        # Parse and clean propositions
        propositions = output_parser.parse(response)
        propositions = [p.strip() for p in propositions if p.strip()]
        return propositions

    except Exception as e:
        print(f"Error processing text: {e}")
        return []
```

Check Colab for full code

Once we have these propositions, we can follow the same steps as in the semantic or clustering approaches to group them and create the final chunks. But I wouldn't recommend this approach, as using it on a large corpus of text would cost you heavy $$$. Similarly, passing the whole text to LLMs and asking it to provide stopping points or chunks directly won't be cost-efficient either.

{{< admonition warning "Cost Consideration" >}}
If you believe token costs will eventually drop to zero, you'd love this approach. But until then, I think it's better to go for a cost-effective and quality option. While this approach might give better chunks, it's not worth spending too much on chunking instead of querying.
{{< /admonition >}}

Still, I've included the code to create propositions if you want to try it yourself.

We have tested multiple approaches, and we've done enough analysis to call it a day. But what do you think? Do you find something that might help you start working on that language-specific project? Well, read further.

### What could be interpreted now?

From our analysis, we can see that different languages behave differently especially when it comes to chunking and retrieval. For some languages, like Hindi, smaller chunk sizes give better precision (which is nearly true for all the languages), while for languages like English, larger chunks (like 400 or more) worked better because they capture more context (not always), improving overall average retrieval accuracy in *RecursiveCharacterTextSplitter().*

We also saw how using semantic or clustering-based approaches gives better chunks than fixed character text splitters. While languages behaved similarly when it came to the chunking approach, there were a few sub-steps that were different for each language. For example, splitting text into sentences. My recommendation would be to open that notebook, make a copy of it, make some modifications, try it out on your text, and see if you find something. 

I hope this [notebook](https://colab.research.google.com/drive/1DRT5e4_up84afkCMJtP_uTUjvNvPuVWW?usp=sharing) helps you get started with your experimentation. But if you are someone who's not interested in doing research and just want to start with some approach, the following content is for you.

Clearly, there's no "one-size-fits-all" formula here. If you are using Recursive, you might want to play with chunk sizes. If you are using another approach, you might need to experiment with other parameters.

**What can be done:** To find the best chunk size for each language, we need to explore more (on the same notebook xd) and consider the language's structure and the type of content being processed. The way to split content depends largely on the context in which we are splitting it.

The choice of embedding model also plays a big role in how well the retrieval works. Multilingual embeddings may treat different languages in different ways, leading to variations in chunking and retrieval results. I tried using another embedding model from Sentence Transformers, and *while the overall results were similar, there were slight differences in the similarity scores.* We also have some good multilingual embedding models, like those from Cohere, which we can explore further.

There is a trade-off between chunk size and context. Smaller chunks give higher precision but may lose some context, while larger chunks contain more context but may not match as well for retrieval and often contains irrelevant text which might act as distraction to LLMs. We can have different segment lengths within a single database to improve overall retrieval instead of fixing any specific chunk size. That's what we did in case of semantic chunking. We didn't actually pass any chunk size parameters.

Finally, Spanish, French, English, and Hindi behaved both differently at times and similarly at other times in terms of chunking and retrieval. This shows that not just context, but some languages might need special approaches to get the best results.

**What can be done: **We can look into the specific features of each language, like sentence structure and word formation, and come up with better preprocessing strategies to improve chunking and retrieval, especially for languages like Spanish and French. Using language specific models would help you get better chunks.

It is also worth noting that as much as the quality of answers depends on chunks, it also depends on the **retrieval process** we are choosing. The way we store these chunks in vector databases matters a lot. There are improved versions and better ways to create indexes and retrieve correct chunks from vector databases before passing them to LLM. You might need to spend some time reading about that too and then conclude your decision on going with any one approach. We'll do it in another blog maybe.

Now, coming to those 2 questions we asked at the start of this blog:

{{< admonition conclusion "Research Findings" >}}
**Does chunking depend on language?** – I'd say yes. Not completely, but some part of it definitely depends on language, and it matters a lot how you split your text into sentences in a way that makes sense. Choosing different tokenizers will help improve the quality of the overall chunk. So, the answer would be – YES!

And the second question, **which is the right chunking approach for your language?** – I'd say it depends on your use case and type of content. While chunking depends on language, it also depends on what your content is, whether it is structured or unstructured, whether your document contains text in multiple languages, or if it contains graphics that need to be handled separately, or if it is code written in Python or any other language.
{{< /admonition >}}

We have different splitters these days, and they are used for different purposes. But if you are working on text-only use cases where you want to know which chunking approach to choose before spending much time on it, I'll recommend you use the Colab notebook to upload your text files and test it out yourself. You'll get the answer.

Here's the link to the [Colab](https://colab.research.google.com/drive/1DRT5e4_up84afkCMJtP_uTUjvNvPuVWW?usp=sharing) Notebook :)

[Google Colab](https://colab.research.google.com/drive/1DRT5e4_up84afkCMJtP_uTUjvNvPuVWW?usp=sharing)

## Key Takeaways

But still, if you are someone looking for a direct answer, I'll give you a starting point. If you work on –

1. **English** - If you use *RecursiveCharacterTextSplitter()* with your application. If you don't want to use Recursive, use the clustering-based approach directly. It gave the best results and is the most cost-effective approach available.
2. **Hindi** - I'd not recommend *Recursive* here unless it's the worst case and you have no time. For this, try out different text splitters using NLTK or spaCy models and then start with the Semantic Chunk first. If it doesn't perform well, you can definitely consider clustering-based approaches.
3. **French** and **Spanish** - Notice that these languages are kind of similar when compared with English. If you are someone working on them for the first time, go with clustering-based approaches for both of them. They performed very decently.

Overall, I hope this blog has given you a sense of direction to analyze and find the correct chunk size and chunk approach for your language using **LanceDB**. You can go ahead and experiment further with more questions on the same text or with your own text. Feel free to share your results and findings if you perform further analysis on other languages or different questions.

#### References 

1. [Research Papers](https://arxiv.org/pdf/2406.00029v1), 
2. [Blogs](https://towardsdatascience.com/improving-rag-chunking-with-clustering-03c1cf41f1cd), and 
3. an awesome [notebook](https://github.com/FullStackRetrieval-com/RetrievalTutorials/blob/main/tutorials/LevelsOfTextSplitting/5_Levels_Of_Text_Splitting.ipynb) by Full stack retrieval.
