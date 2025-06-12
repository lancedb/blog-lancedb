---
title: Multi-Speaker, Context-Aware AI Podcast Generation
date: 1970-01-01
draft: false
featured: false
image: /assets/blog/1.png
description: Explore multi-speaker, context-aware ai podcast generation with practical insights and expert guidance from the LanceDB team.
author: Shresth Shukla
---
AI content generation is not new in 2025, which we are calling the year of AI Agents. There are multiple AI companies specializing in content generation across multiple modalities, including text, image, video, and audio. Almost everything these days can be easily generated using the right set of AI tools. The best thing to do at this moment is to utilize some of these advanced models to build personalized AI products, as the available tools offer different capabilities.

Have you seen the trending Lex Fridman podcast with Indian Prime Minister Narendra Modi that gained huge attention due to its multilingual capabilities using AI?
![](__GHOST_URL__/content/images/2025/03/image-13.png)Thanks AI for the motivation :)
Today, we'll build something similar for ourselves. We'll be creating a multi-speaker, context-aware podcast generation tool that converts Medium blogs into damn perfect podcasts, including any number of speakers required, while also understanding my previous blogs.
![](__GHOST_URL__/content/images/2025/03/image-4.png)
Obviously, I did some research to see if something like this already exists. Google has a product called Illuminate, which converts computer science research papers into two-person conversations. I'm sure you're aware of NotebookLM by Google, which can easily create a two-speaker podcast based on your input data. And there are many more such tools.

But I hope you’ve guessed the problem—it will only include the content of your current blog.

Imagine if you were creating this podcast, you would talk about multiple things beyond just the blog content. For example, you might have done something similar before and would want to mention it during the podcast—just like a normal human would in a conversation.

That’s exactly what we’ll build today: C**ontext-Aware Podcast Generation** that understands my other blogs and can refer to them naturally during the podcast, making it sound more real and engaging.

Something like this –
![](__GHOST_URL__/content/images/2025/03/image.png)
I created these 2 sample podcasts using the code shared in this blog. Jump directly to **1:45** in the first one to understand what I mean by **Context-Aware AI Podcast Generation** (ignore the third speaker, please—she was in a hurry, lol). I've attached the Colab notebook at the end of this blog if you want to try it out in parallel or build something on top of it. I loved my voice in 2nd one btw xd.

1. Generated using Eleven Labs Voices

![audio-thumbnail](__GHOST_URL__/content/media/2025/03/podcast_thumb.png)

Podcast

0:00
/145.266939
1×

1. Generated using Smallest AI Voices

Podcast smallest

0:00
/197.511837
1×

### How to begin?

We'll break the whole process into multiple sub-parts. Think about how NotebookLM might be doing this and how we can add more context to the process.

You provide your blog text as input. First, it will generate a podcast script based on your data, then it will map the script's content to different speakers. All the tools I found offer **2 speakers** by default. But what if I want more speakers in my podcast? I'm an extrovert and would love to talk to more people.

So, we won’t stick to 2 as the default. Instead, I'll take **3** as the default, but you can choose **N** speakers for your podcast, no matter what. Additionally, I'll store information about my previous blogs in a **LanceDB vector database** and use it for **context retrieval** whenever we create a new podcast.

Once we've created our script, we need to generate audio for each speaker. I don't want all speakers to have the same voice—I want each one to have a different and consistent voice throughout.

There are multiple TTS options available, like ElevenLabs, Google Cloud Text-to-Speech (used by NotebookLM), Smallest.ai, and Bhashini (for Indian voices), etc. For this demo, I'll proceed with ElevenLabs because of its awesome set of fine-tuned audio models.

Once we've chosen the model, we'll generate audio for each speaker based on the script and then merge them together to create a **full multi-speaker AI podcast**. Sounds interesting, right?

Here’s the high-level flow of our solution –
![](__GHOST_URL__/content/images/2025/03/podcast_flow-1.png)
### **Creating a Vector Store for Context Retrieval and Script Generation**

This is one of the most important steps in our solution. We need to create a database of our previous blogs, which should be able to provide references to the LLM when searching for specific keywords from the new blog.
![](__GHOST_URL__/content/images/2025/03/image-8.png)we are using URLs to get the data
We'll be using LanceDB Cloud for this. You can get your API key for LanceDB from the website and connect your database in a single line of code. 

    #use it if working with cloud version
    db = lancedb.connect(
      uri="<your uri>",
      api_key=lance_api,
      region="us-east-1"
    )

First, we'll experiment with LanceDB to understand how context retrieval works, and then we'll decide on the best approach to use. Here, I've used Hybrid Search to extract relevant context using keywords and vectors from my previous blogs. 

Here’s how you can do this –

    #note that this is just part of the code and not the complete code. Please visit Notebook for end to end implementation.
    
    # Define your table schema data example
    # Each record has: title, headings, content, and url, and corresponding vector embedding for content.
    
    from lancedb.pydantic import LanceModel, Vector
    from lancedb.embeddings import get_registry
    
    embeddings = get_registry().get("sentence-transformers").create() 
    
    #it is important to create schema and define source fields that needs to be converted  into embedding vectors.
    class Article(LanceModel):
        title: str
        headings: list[str]
        content: str = embeddings.SourceField()
        url: str
        embedding: Vector(embeddings.ndims()) = embeddings.VectorField()
    
    data = blog_content
    table = db.create_table("articles", data=data, mode="overwrite", schema=Article)
    
    #using hybrid search approach to take top 3 
    from lancedb.rerankers import LinearCombinationReranker
    
    reranker = LinearCombinationReranker(
        weight=0.7
    )  
    
    #in this case you need to pass both FTS column and Vector Column Name
    # Weight = 0 Means pure Text Search (BM-25) and 1 means pure Sementic (Vector) Search. Clearly you can experiment with different reranking algorithms here but we'll keep it simple since it serves the purpose.
    
    results = table.search(
        "warehouse deployment",
        query_type="hybrid",fts_columns=["headings","content"], vector_column_name = "embedding"
    ).rerank(reranker=reranker).limit(3).to_pandas()
    
    #and i think this serves the purpose of giving relevant context to my podcast script. Now you can enhance this based on other data for more personalization.
    
    

This is the kind of output we can get from the database when querying for specific keywords.
![](__GHOST_URL__/content/images/2025/03/image-3.png)
I have used 7 of my blogs to prepare my sample dataset. I kept a related blog on Fabric Warehouse to test whether retrieval is working correctly and if I am getting relevant information from the database. To my surprise, the script generated after passing context to the model along with the input was damn impressive. Look at these examples—how beautifully it has mentioned context from a previous blog on a similar topic during the conversation.
![](__GHOST_URL__/content/images/2025/03/image-7.png)example - 1![](__GHOST_URL__/content/images/2025/03/image-16.png)example -2 
We used Gemini models to convert my text into a podcast script.
![](__GHOST_URL__/content/images/2025/03/image-10-1.png)Generating Script from Blog Text and Retrieved Context
Here's the code used to create a sample script using Gemini –

    #check colab for complete code on how to use this. 
    
    def generate_conversation(article, podcast_name, speakers, additional_context):
        # Create LangChain Gemini model
        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro",
            google_api_key=gemini_api_key,
            temperature=0.9,
        )
        
        # Create system prompt
        number_of_speakers = len(speakers)
        speaker_names = ", ".join([s["name"] for s in speakers])
        host_name = speakers[0]["name"] if speakers else "Host"
        
        context_text = additional_context
    
        # # Format additional context from LanceDB for prompt
        # context_text = ""
        # if additional_context:
        #     context_text = "Here are some relevant contexts from previous blogs that should be referenced in the podcast:\n\n"
        #     for idx, ctx in enumerate(additional_context, 1):
        #         context_text += f"{idx}. Title: {ctx['title']}\n   Excerpt: {ctx['excerpt']}\n\n"
        
        system_prompt = f"""You are an experienced podcast script writer for Lance DB
        Your task is to create an engaging conversation between different people based on the article provided.
    
        The speakers are: given as input.
        - first name of the pseaker list is the host of the podcast.
        - Make the conversation between 30000-50000 characters for this demo (normally would be longer)
        - Use short sentences that can be easily used with speech synthesis
        - Include conversational fillers (um, uh, well, hmm) occasionally to make it sound natural
        - Show excitement and engagement during the conversation
        - Do not mention last names
        - Avoid formal introductions like "Thanks for having me on the show"
        - Make sure the script discusses the main article thoroughly
    
        The response must be in JSON format with an array of objects, each containing:
        - "speaker": the name of the speaker (must match exactly one of: {speaker_names})
        - "text": what they say (a short paragraph or a few sentences at a time)
        """
    
        # Create prompt template
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", f"""Here's the article content to discuss:\n\n{article}
            <article end>
    
            Here's for your reference the additional context from previous blogs when relevant during the conversation.
            {context_text}
    
            Number of Speakers in the podcast are - {number_of_speakers}
            Speakers are - {speaker_names}
            """)
                ])
        
        # Create output parser
        output_parser = JsonOutputParser()
        
        # Create chain
        chain = prompt | llm | output_parser
        
        # Execute chain
        response = chain.invoke({"article": article, "number_of_speakers" : number_of_speakers, "context_text" : additional_context, "speaker_names" : speaker_names})
        
        return response
    
    

The above code will generate a script that looks like this – 
![](__GHOST_URL__/content/images/2025/03/image-5.png)
To make the script generation process run on its own, we can perform a keyword search on the input blog content. This means that every time a user uploads or provides a new blog, I'll use a keyword extraction model to extract the top 3 or top 5 keywords, which I'll then use for a hybrid search on my vector database.

I've used KeyBERT for this and directly used the extracted keywords to query the table and prepare my context information.

    
    def extract_keywords(text, num_keywords=5):
        """
        Extracts important keywords/phrases from the given text using KeyBERT.
        
        Parameters:
            text (str): The input text for keyword extraction.
            num_keywords (int): The number of keywords/phrases to extract.
    
        Returns:
            list: A list of extracted keywords/phrases.
        """
        keywords = kw_model.extract_keywords(text, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=num_keywords)
        return [kw[0] for kw in keywords]  # Extract only the keyword phrases
    
    

check colab for full implementation

---

### Generating AI Audio for the Podcast

Perfect! The major part of our process is done. Now, we need to add voices to the speakers.

There are multiple options—you can clone your own voice and use it to generate the podcast in your voice (similar to how Lex's podcast cloned PM Modi's voice for English dubbing), or you can use a set of available voices from TTS model providers.

I used **ElevenLabs **(free trial version) to build sample podcasts and generate different voices for the three speakers in my podcast. You can refer to the code for the full implementation and see how you can do it too, even with different model providers.

Note that if you're using a free trial, you might encounter an error like this while generating audio from the script for all speakers together. (Completely normal, chillax!) –
![](__GHOST_URL__/content/images/2025/03/image-1.png)Error when using FREE Trial 
So maybe buy its subscription if you're planning to build it end-to-end for users or even for yourself, or use the free TTS models available. For example, I'll be trying this with Bhashini in the future and updating the code to test it with Indian languages too.

If you're still paying attention, you might have noticed that we have different speakers and their text in the script. To ensure each speaker has a consistent voice, we need to use different models for each of them.

To do this, we need to define voice IDs for ElevenLabs so it can use a specific voice and call the API based on who's speaking. We generate multiple audio files, processing each speaker’s lines one by one, and then merge them to create the full podcast. Sequence matters here, and we need to handle this properly on our end.
![](__GHOST_URL__/content/images/2025/03/image-11-1.png)
Here's the code snippet to do this  – 

    # ElevenLabs TTS function
    def synthesize_speech_elevenlabs(text, voice_id, index, speaker_name):
        try:
            elevenlabs_url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
            elevenlabs_headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": elevenlabs_api_key
            }
            
            data = {
                "text": text,
                "model_id": "eleven_turbo_v2_5",
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.75
                }
            }
            response = requests.post(
                elevenlabs_url, 
                json=data, 
                headers=elevenlabs_headers
            )
            
            if response.status_code != 200:
                print(f"Error with ElevenLabs API: {response.text}")
                return None
                
            filename = f"audio-files/{index}_{speaker_name}.mp3"
            with open(filename, "wb") as out:
                for chunk in response.iter_content(chunk_size=1024):
                    if chunk:
                        out.write(chunk)
            return filename
    
        except Exception as e:
            print(f"Error with ElevenLabs synthesis: {str(e)}")
            return None
    
    speakers_map={"Shresth" : {"service" : "elevenlabs", "voice_id" : "Zp1aWhL05Pi5BkhizFC3"},
                  "Arjun" : {"service" : "elevenlabs", "voice_id" : "PpXxSapWoo4j3JoF2LPQ"},
                  "Geet" : {"service" : "elevenlabs", "voice_id" : "TRnaQb7q41oL7sV0w6Bu"}
                  }
    
    # Function to generate the podcast audio from conversation data
    def generate_audio(conversation, speakers_map):
        # if os.path.exists('audio-files'):
        #     shutil.rmtree('audio-files')
        os.makedirs('audio-files', exist_ok=True)
        
        file_paths = []
        
        for index, part in enumerate(conversation):
            speaker_name = part['speaker']
            text = part['text']
            
            # Find the voice configuration for this speaker
            if speaker_name in speakers_map:
                voice_config = speakers_map[speaker_name]
                if voice_config["service"] == "elevenlabs":
                    file_path = synthesize_speech_elevenlabs(
                        text,
                        voice_config["voice_id"], 
                        index, 
                        speaker_name
                    )
                else:  # Google TTS
                    voice_name = voice_config["voice_name"].split(" (")[0]  # Extract just the voice name
                    file_path = synthesize_speech_google(
                        text, 
                        voice_name, 
                        index, 
                        speaker_name
                    )
                
                if file_path:
                    file_paths.append(file_path)
        
        if not file_paths:
            print("No audio files were generated.")
            return None
        return output_file

Here's how the audio files will be created with the correct index to maintain sequence –
![](__GHOST_URL__/content/images/2025/03/image-2.png)
Once we have the audio files created for each speaker based on the script, we now need to merge them to create our full podcast.

    # Function to sort filenames naturally
    def natural_sort_key(filename):
        return [int(text) if text.isdigit() else text for text in re.split(r'(\d+)', filename)]
    
    # Function to merge audio files
    def merge_audios(audio_folder, output_file):
        combined = AudioSegment.empty()
        audio_files = sorted(
            [f for f in os.listdir(audio_folder) if f.endswith(".mp3") or f.endswith(".wav")],
            key=natural_sort_key
        )
        
        for filename in audio_files:
            audio_path = os.path.join(audio_folder, filename)
            audio = AudioSegment.from_file(audio_path)
            combined += audio
        combined.export(output_file, format="mp3")
        return output_file
    
    output_file = "podcast.mp3"
    merge_audios("audio-files", output_file)

And that’s it! Do you wonder if we can do the same thing in multiple languages? That means, using these functions, we can generate the podcast in any language of your choice, not just English. You simply need to translate the script and use TTS models for the specific language to build this. *(Planning to build, xd?)*

I'm amazed by the fact that now I can bring Elon Musk on a podcast with me to discuss how LanceDB works, lol.
![](__GHOST_URL__/content/images/2025/03/elon-2.png)
Here’s the Colab link for the complete implementation –
[

Google Colab

![](__GHOST_URL__/content/images/icon/favicon-28.ico)

![](__GHOST_URL__/content/images/thumbnail/colab_favicon_256px-28.png)
](https://colab.research.google.com/github/shuklaji28/vectordb-recipes/blob/main/examples/Multi_Speaker_Context_Aware_Podcast_Generation/Multi_Speaker_Context_Aware_Podcast_Generation.ipynb)
### What more could be done? 

I hope you got the idea of what context-aware podcast generation is and how vector databases are actually useful in making the podcast sound more natural and real. Now, with the availability of agents and realistic models, there's no end to the possibilities of what could be done, but here’s something I’d recommend you try to take this project forward –

1. Add more content sources to build context. Having references from blogs is definitely helpful, but I believe this could be enhanced by incorporating data from multiple platforms, not just Medium blogs. For example, using Agents to extract more information about the central topic from the internet or adding insights from previous podcasts, which can also be managed using vector databases. For now, Medium works, but to make it more real, I believe there should be more content for personalization, enhancing the overall podcast experience.
2. Creating another table inside the current database for storing these podcast conversations and using it as context in the next podcast generation. You can automate this process using AI agents as well.
3. Updating data in the table to automatically add new blogs from your feed while ensuring no duplicate data is stored in LanceDB.
4. Using YouTube API to automatically upload the generated podcast to YouTube/Spotify. 

Thanks to the internet, I found some amazing references to build this. If you’re planning to build an application or product on top of it, you can simply use the helper functions provided in the notebook. Till then, see you in the next blog!
