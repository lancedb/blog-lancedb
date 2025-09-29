---
title: "Building a Multimodal Recipe Agent with LanceDB"
date: 2025-01-16
draft: true
featured: false
categories: ["Engineering"]
# image: /assets/blog/multimodal-recipe-agent/preview-image.png
# meta_image: /assets/blog/multimodal-recipe-agent/preview-image.png
description: "Build an intelligent recipe search agent that understands both text and images using LanceDB, sentence-transformers, and CLIP for local AI applications."
author: Erik Wang
author_bio: "Writer"
author_github: "erik-wang-lancedb"
---

Many AI applications today are cloud-dependent or require complex infrastructure to run, adding unnecessary complexity to initial prototyping. Traditional vector databases often require cloud services or some docker setup, complicating your app before you even get to your first line of code.

**LanceDB changes everything.** It's the only vector database that runs completely locally, sets up in seconds, and natively handles both text and images in the same table: no separate image folders, no cloud dependencies, no complex infrastructure. 

That's exactly what we'll build in this tutorial: a multimodal recipe search agent powered by [**LanceDB**](https://lancedb.com/) that can be up and running in just a few minutes.


<!-- ## Why LanceDB is the Game-Changer for Recipe Applications

**The Problem with Traditional Vector Databases:**
- **Pinecone, Weaviate, Qdrant**: Cloud-only, expensive, recipe data leaves your machine
- **Chroma, FAISS**: Text-only, require separate image storage systems for recipe photos
- **Complex Setup**: Docker containers, configuration files, external dependencies
- **Security Risk**: Your recipe data goes to external services

**LanceDB Solves Everything:**
- **100% Local**: Your recipe data never leaves your machine—perfect for proprietary recipes. When you're ready for production, your data is still in your infra.
- **Instant Setup**: `lancedb.connect("data/recipes.lance")` and you're running—no Docker, no config files
- **Native Multimodal Support**: Recipe text, images, and vectors in the same table—one retreival gets you everything you need
- **Lightning Fast**: Sub-100ms search on millions of recipe vectors
- **Zero Dependencies**: No external services, no API keys, no rate limits
- **Production Ready**: Scale seamlessly from local development to distributed production with LanceDB Cloud or enterprise.

**LanceDB is the only solution that gives you local privacy, instant setup, and native multimodal support for recipe applications.**

 -->

## Tech Stack

- **[LanceDB](https://lancedb.com/)** - Local vector database with native multimodal support
- **[sentence-transformers](https://www.sbert.net/)** - Text embeddings (`all-MiniLM-L6-v2`)
- **[CLIP](https://openai.com/research/clip)** - Image embeddings (`openai/clip-vit-base-patch32`)
- **[PydanticAI](https://ai.pydantic.dev/)** - Agent framework for intelligent search
- **[Streamlit](https://streamlit.io/)** - Interactive web interface
## Downloading and Loading Recipe Data

First, let's download the recipe dataset. We'll use the [Food Ingredients and Recipe Dataset with Images](https://www.kaggle.com/datasets/pes12017000148/food-ingredients-and-recipe-dataset-with-images) from Kaggle, which contains thousands of recipes with both text descriptions and food images. You can download through the kaggle CLI or just as a zip file from the website.

**This dataset contains:**
- **Title**: Recipe names
- **Cleaned_Ingredients**: Processed ingredient lists
- **Instructions**: Step-by-step cooking directions
- **Image_Name**: Filename of the corresponding food image

## Setting Up Embedding Models

We'll set up local embedding models to process our recipe data.

```python
class EmbeddingGenerator:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.text_model = SentenceTransformer("all-MiniLM-L6-v2").to(self.device)
        self.image_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(self.device)
        self.image_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

    def generate_text_embeddings(self, texts: List[str]) -> np.ndarray:
        embeddings = []
        for i in range(0, len(texts), BATCH_SIZE):
            batch = texts[i : i + BATCH_SIZE]
            batch_embeddings = self.text_model.encode(batch, convert_to_tensor=True, device=self.device)
            embeddings.append(batch_embeddings.cpu().numpy())
        return np.vstack(embeddings)

    def generate_image_embedding(self, image_path: Path) -> Optional[np.ndarray]:
        try:
            image = Image.open(image_path).convert("RGB")
            inputs = self.image_processor(images=image, return_tensors="pt", padding=True)
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            with torch.no_grad():
                image_features = self.image_model.get_image_features(**inputs)
                image_features = image_features / image_features.norm(dim=-1, keepdim=True)
            return image_features.cpu().numpy().flatten()
        except Exception:
            return None

    def embed_image_binary(self, image_path: Path) -> Optional[bytes]:
        try:
            with open(image_path, "rb") as f:
                return f.read()
        except Exception:
            return None

    def find_image(self, image_name: str) -> Optional[Path]:
        """Find image file in the dataset directory"""
        image_path = Path("data") / "images" / image_name
        return image_path if image_path.exists() else None

def generate_embeddings(recipes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Generate embeddings for all recipes"""
    generator = EmbeddingGenerator()

    # Generate text embeddings
    combined_texts = [recipe["combined_text"] for recipe in recipes]
    text_embeddings = generator.generate_text_embeddings(combined_texts)

    # Process each recipe
    for i, recipe in enumerate(recipes):
        # Add text embedding
        recipe["text_embedding"] = text_embeddings[i].tolist()
        
        # Process image if available
        image_name = recipe.get("image_name", "")
        if image_name and image_name != "nan":
            image_path = generator.find_image(image_name)
            if image_path:
                image_embedding = generator.generate_image_embedding(image_path)
                recipe["image_embedding"] = image_embedding.tolist() if image_embedding is not None else None
                recipe["image_binary"] = generator.embed_image_binary(image_path)
                recipe["image_path"] = str(image_path)
            else:
                recipe.update({"image_embedding": None, "image_binary": None, "image_path": None})
        else:
            recipe.update({"image_embedding": None, "image_binary": None, "image_path": None})

    return recipes
```

## Processing and Storing Recipe Data in LanceDB

**Now we're ready for LanceDB!** This is where the magic happens. With other vector databases, you'd need separate systems for recipe text and images, complex docker setups, or cloud dependencies. LanceDB makes it trivial:

```python
# Generate embeddings for all recipes
recipes_with_embeddings = generate_embeddings(recipes)

# Create PyArrow table and store in LanceDB
table = pa.Table.from_pylist(recipes_with_embeddings)
db = lancedb.connect("data/db")
db.create_table("recipes", table)
```

**What just happened?** In just a few lines of code, we created a complete multimodal vector database that can store recipe text, images, and vectors together. 

- **`lancedb.connect("data/db")`** - Instant local database connection, no cloud setup required
- **`db.create_table("recipes", table)`** - One command creates a table with text, images, and vector embeddings

No API keys, no Docker containers, no external services. Your recipe data stays completely private on your machine while gaining powerful search capabilities.

## Searching Over Your Dataset

LanceDB makes multimodal search incredibly simple. Here's how easy it is to search your recipe data:

```python
# Vector search - find recipes by semantic similarity
query_embedding = text_model.encode(["healthy pasta recipes"])
results = table.search(query_embedding, vector_column_name="text_embedding").limit(5)

# Image search - find similar recipes by photo
image_embedding = image_model.encode(image)
results = table.search(image_embedding, vector_column_name="image_embedding").limit(5)

# Full text search - use SQL if you want!
results = table.search().where("ingredients LIKE '%chicken%'").limit(5)
```

**That's it!** One line of code for text search, one line for image search. No complex joins, no separate image storage, no API calls to external service, with one `.search()` call LanceDB returns the title, ingredients, and image of the dish!

## Adding Intelligence with PydanticAI

Now we can turn our search functions into an intelligent agent. We use PydanticAI to quickly create an AI agent that can understand natural language and use our LanceDB search tools:

```python
from pydantic_ai import Agent

class RecipeSearchTools:
    def __init__(self):
        self.db = lancedb.connect("data/recipes.lance")
        self.table = self.db.open_table("recipes")
        self.text_model = SentenceTransformer("all-MiniLM-L6-v2")
        self.image_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    
    def search_recipes_by_text(self, query: str, limit: int = 5):
        query_embedding = self.text_model.encode([query])
        return self.table.search(query_embedding, vector_column_name="text_embedding").limit(limit).to_pandas()
    
    def search_recipes_by_image(self, image_path: str, limit: int = 5):
        image_embedding = self.image_model.encode(Image.open(image_path))
        return self.table.search(image_embedding, vector_column_name="image_embedding").limit(limit).to_pandas()

# Create tools from our search functions
tools_instance = RecipeSearchTools()

# Create the agent
agent = Agent(
    "gpt-4o-mini", # We can also use a local model here, using gpt for speed and performance.
    tools=[
        tools_instance.search_recipes_by_text,
        tools_instance.search_recipes_by_image,
    ],
    system_prompt="You are a helpful recipe assistant. Use the tools to search for recipes."
)

# Now users can chat naturally
result = agent.run_sync("Find me healthy pasta recipes with chicken")
```

**That's it!** The agent automatically understands user queries, calls the right search function, and returns formatted results. No complex prompt engineering or manual query parsing needed. We can put this into a quick UI next.

## Building the Recipe Chat Interface

With Streamlit, we can create an interactive recipe search interface:

```python
import streamlit as st
from simple_agent import agent

def main():
    """Main app function"""
    st.title("🍳 Simple Recipe Chat")
    st.write("Chat with the recipe assistant to find recipes!")

    # Sidebar for image upload
    with st.sidebar:
        st.header("Upload Image")
        uploaded_file = st.file_uploader(
            "Upload an image for recipe search",
            type=["jpg", "jpeg", "png"],
            help="Upload an image to search for similar recipes",
        )

        if uploaded_file:
            # Save uploaded file temporarily
            temp_path = f"temp_{uploaded_file.name}"
            with open(temp_path, "wb") as f:
                f.write(uploaded_file.getbuffer())
            st.session_state.uploaded_image = temp_path

            # Display uploaded image
            image = Image.open(uploaded_file)
            st.image(image, caption="Uploaded Image", use_container_width=True)

    # Display chat messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            if message["role"] == "assistant":
                display_enhanced_response(message["content"])
            else:
                st.markdown(message["content"])

    # Chat input
    if prompt := st.chat_input("Ask about recipes..."):
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": prompt})

        # Display user message
        with st.chat_message("user"):
            st.markdown(prompt)

        # Generate assistant response
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                try:
                    # If there's an uploaded image, pass the image path to the agent
                    context = prompt
                    if st.session_state.uploaded_image:
                        context = f"{prompt} (I have uploaded an image at path: {st.session_state.uploaded_image})"

                    # Get response from agent with conversation history
                    result = agent.run_sync(context, message_history=message_history)

                    # Extract the actual response text from AgentRunResult
                    response = result.output

                    # Display the response with enhanced formatting
                    display_enhanced_response(response)

                    # Add assistant response to chat history
                    st.session_state.messages.append(
                        {"role": "assistant", "content": response}
                    )

                except Exception as e:
                    error_msg = f"Sorry, I encountered an error: {str(e)}"
                    st.error(error_msg)
                    st.session_state.messages.append(
                        {"role": "assistant", "content": error_msg}
                    )
```

**The entire application runs locally with `streamlit run simple_app.py`**
<!--
## Adding Intelligence with PydanticAI

| Concern | Traditional Vector DBs | LanceDB |
|---------|---------------------|---------|
| **Setup** | Pinecone: API keys + cloud setup<br/>Chroma: Docker + config files<br/>Weaviate: Complex infrastructure | `lancedb.connect("data/recipes.lance")` - **One line** |
| **Privacy** | Recipe data leaves your machine<br/>GDPR compliance issues<br/>Security vulnerabilities | **100% local** - recipe data never leaves your machine |
| **Cost** | Pinecone: $70/month + per-query<br/>Weaviate Cloud: $25/month + usage<br/>Qdrant Cloud: $25/month + storage | **Completely free** - unlimited usage |
| **Multimodal** | Text-only (Chroma, FAISS)<br/>Separate image storage required<br/>Complex data management | **Native multimodal** - recipe text, images, vectors in one table |
| **Performance** | Network latency (100-500ms)<br/>Rate limits and throttling<br/>Cold start delays | **Sub-100ms local search**<br/>No rate limits<br/>Instant startup |
| **Deployment** | Docker containers<br/>Cloud dependencies<br/>Complex orchestration | **Single file** - runs anywhere Python runs |
| **Image Storage** | Separate S3 buckets<br/>Broken links in production<br/>Complex media management | **Binary data in database** - no separate storage needed |

## From Local to Production: LanceDB's Scaling Story

**The beauty of LanceDB is that it grows with you.** Start locally for rapid prototyping, then scale seamlessly when you're ready for production:

**Local Development (What we built):**
- Single file database: `recipes.lance`
- Instant setup with `lancedb.connect()`
- Perfect for prototyping and personal use
- Zero infrastructure complexity

**Production Scaling Options:**
- **LanceDB Cloud**: Managed service with automatic scaling, backups, and monitoring
- **Self-hosted clusters**: Deploy on your own infrastructure with full control
- **Hybrid approach**: Keep sensitive data local, scale non-sensitive workloads to cloud
- **Same API**: Your code works identically across all deployment scenarios

**Why This Matters for Recipe Apps:**
- **Start small**: Build and test your recipe agent locally with real data
- **Scale naturally**: Move to production without rewriting your code
- **Cost effective**: Pay only for what you use, when you need it
- **Data sovereignty**: Keep proprietary recipes local or choose your deployment model

**Other databases force you to choose between local development and production scaling. LanceDB gives you both.**

## Real-World Recipe Use Cases

**LanceDB enables powerful recipe applications:**

1. **Smart Recipe Search**: "Find me healthy pasta recipes with chicken" - semantic search through thousands of recipes
2. **Visual Recipe Discovery**: Upload a photo of a dish and find similar recipes
3. **Ingredient-Based Filtering**: "What can I make with eggs, flour, and milk?"
4. **Dietary Restrictions**: "Show me vegan recipes with high protein"
5. **Cooking Skill Level**: "Easy recipes for beginners"
6. **Cultural Cuisine**: "Traditional Italian pasta dishes"

**All running locally, privately, and instantly.** -->

{{< admonition tip "Code" >}}
The code snippets in this article are shortened for better understanding. If you'd like to experiment with the full runnable version, you can find the complete code [here](https://lancedb.com/).
{{< /admonition >}}

## Try LanceDB out yourself

- [LanceDB Quickstart](/docs/quickstart) – Install LanceDB locally and try your first vector search with Python 