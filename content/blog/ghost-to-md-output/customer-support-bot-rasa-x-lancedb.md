---
title: "Customer Support Bot : RASA X LanceDB"
date: 2024-12-31
author: Rithik Kumar
categories: ["Engineering"]
draft: false
featured: false
image: /assets/blog/customer-support-bot-rasa-x-lancedb/preview-image.png
meta_image: /assets/blog/customer-support-bot-rasa-x-lancedb/preview-image.png
description: "Unlock about customer support bot : rasa x lancedb. Get practical steps, examples, and best practices you can use now."
---

Have you ever wondered how businesses manage to provide instant, accurate, and personalized customer support around the clock? This article will teach us how to make an **Advanced Customer Support Chatbot** using **Rasa**, **LanceDB**, and **OpenAI’s Large Language Models (LLMs)**.

## What is RASA?

**Rasa** is an open-source framework designed to build intelligent, contextual, and scalable chatbots and virtual assistants. Unlike some one-size-fits-all solutions, Rasa offers the flexibility to customize your bot’s behavior, making it perfectly tailored to your business needs.

1. **Open-Source Goodness:** Free to use and highly customizable.
2. **Natural Language Understanding (NLU):** Rasa interprets user inputs to identify intents and extract relevant entities, enabling the chatbot to understand the purpose behind each query.
3. **Dialogue Management:** Rasa manages the flow of conversation, maintaining context across multiple interactions and ensuring coherent and context-aware responses.
4. **Custom Actions:** Through its `actions.py` file, Rasa executes custom actions that perform specific tasks, such as connecting with databases, APIs, and other services like LanceDB and OpenAI’s LLMs.

## Quick Overview

This guide explains the process of building an **Advanced Customer Support Chatbot** by integrating **Rasa**, a robust conversational framework; **LanceDB**, a high-performance vector database; and **OpenAI’s LLM**, a state-of-the-art language model.
![](__GHOST_URL__/content/images/2024/12/NLU--2--1.jpg)How RASA performs custom actions to do the query on Lance Table and then perform API call to LLM to generate refined response
So, you’ve got Rasa, LanceDB, and OpenAI LLMs ready to join forces. How do these components work together to create a seamless customer support chatbot? Let’s break it down:

1. **User Interaction:**
- A customer sends a query to the chatbot, such as *“How do I reset my password?”*

2. **Rasa NLU and Core:**
- Rasa NLU interprets the intent and extracts relevant entities (if any) and then Rasa core decides if it's time to trigger custom action or give direct response.

3. **Fetching Knowledge from LanceDB:**
- Using the intent and entities, Rasa triggers a custom action that queries LanceDB for specific support information related to user query (password resets).

4. **Generating a Smart Response with OpenAI:**
- The retrieved information from LanceDB is then fed into OpenAI’s LLM, which crafts a comprehensive and personalized response for the customer.

5. **Delivering the Response:**
- The chatbot sends the generated response back to the customer, ensuring they receive clear and helpful guidance.

This integration ensures that your chatbot is not only responsive but also intelligent, capable of handling a wide array of customer inquiries with ease.

## Let's begin

Now we are clear about the flow of this project, let's delve into coding it. Make sure you have OPENAI_API key for this project.

#### Install dependencies

    pip install rasa lancedb openai==0.28 python-dotenv -q

If installing on colab you will need to restart the session after installing the packages - ***ctrl + M.***

#### Initialize a new Rasa project which sets up the necessary directory structure and files.

    rasa init --no-prompt

This command sets up the basic directory structure with sample data.  To verify the setup, you can train the initial model and interact with the sample bot:

    rasa train
    rasa shell

#### Create a .env file and store necessary environment variables in it

    OPENAI_API_KEY = "sk-*********"

#### Step 1 - Embed all the customer support data in LanceDB which can be queried by RASA custom actions later

**LanceDB** serves as the knowledge base for the chatbot, storing FAQs and support information. The following steps outline the setup process:

    # Import necessary libraries
    import os
    import subprocess
    import time
    import threading
    import lancedb
    import requests
    import json
    from lancedb.pydantic import LanceModel, Vector
    from lancedb.embeddings import get_registry

    # Initialize LanceDB
    db = lancedb.connect("./content/lancedb")  # Local storage within Colab

    # Initialize the language model for generating embeddings
    model = get_registry().get("sentence-transformers").create(name="BAAI/bge-small-en-v1.5", device="cpu")

    # Create table from schema
    class Documents(LanceModel):
        vector: Vector(model.ndims()) = model.VectorField()
        content: str = model.SourceField() # Field to store the actual content/response

    company_support_data = [
        { "content": "To reset your password, navigate to the login page and click on 'Forgot Password'. You'll receive an email with instructions to create a new password." },
        { "content": "To update your account information, log in to your profile and click on 'Edit Profile'. From there, you can change your email, phone number, and other personal details." }
        #,.... rest of the data
    ]

    # Knowledge data from the data above
    knowledge_data = company_support_data

    # Define table name
    table_name = "knowledge_base"

    # Retrieve existing table names
    existing_tables = db.table_names()

    if table_name not in existing_tables:
        # Create a new table with the schema and insert data
        tbl = db.create_table(table_name, schema=Documents)
        tbl.add(knowledge_data)
        print(f"Created new table '{table_name}' and inserted data.")
    else:
        # Append data to the existing table
        table = db.open_table(table_name)
        table.add(knowledge_data, mode="overwrite")
        print(f"Overwrited data to the existing table '{table_name}'.")

We will be using pre-trained **Sentence Transformer model** (BAAI/bge-small-en-v1.5) to convert textual support data into vector embeddings. You can change it accordingly.

The code above will create a table - "knowledge_base" in the DB and insert all the customer support information in this table.

#### Step 2 - Configure RASA files according to our use case

- **domain.yml** - The domain.yml file serves as the core configuration for your Rasa chatbot. It defines the chatbot’s intents, entities, slots, responses, actions, forms, and policies.

    version: "3.0"
    language: "en"
    intents:
      - greet
      - ask_knowledge
      - goodbye

    entities:
      - project
      - service
    responses:
      utter_greet:
        - text: "Hello! How can I assist you today?"
      utter_goodbye:
        - text: "Goodbye! Have a great day!"
        - text: "Bye! Let me know if you need anything else."
        - text: "See you later! Feel free to reach out anytime."
    actions:
      - action_search_knowledge

- **endpoints.yml** - It specifies the URLs and connection details for services like the custom action server (actions.py), enabling Rasa to communicate with it.

    action_endpoint:
      url: "http://localhost:5055/webhook"

- **data/stories.yml** - The stories.yml file contains training stories that define example conversational paths your chatbot can take.

    version: "3.0"
    stories:
      - story: Greet and ask question
        steps:
          - intent: greet
          - action: utter_greet
          - intent: ask_knowledge
          - action: action_search_knowledge

      - story: ask question
        steps:
          - intent: ask_knowledge
          - action: action_search_knowledge

      - story: Goodbye
        steps:
          - intent: goodbye
          - action: utter_goodbye

      - story: greet and goodbye
        steps:
          - intent: greet
          - action: utter_greet
          - intent: goodbye
          - action: utter_goodbye

- **data/rules.yml **- The rules.yml file defines rule-based conversations that specify exact steps the chatbot should follow in certain situations. Unlike stories, rules are strict paths that Rasa should follow without deviation.

    version: "3.0"
    rules:
      - rule: Greet
        steps:
          - intent: greet
          - action: utter_greet

      - rule: Goodbye
        steps:
          - intent: goodbye
          - action: utter_goodbye

      - rule: Answer Knowledge Questions
        steps:
          - intent: ask_knowledge
          - action: action_search_knowledge

- **data/nlu.yml** - The nlu.yml file contains Natural Language Understanding (NLU) training data. It includes examples of user inputs categorized by intents and annotated with entities to train Rasa’s NLU component.

    version: "3.0"
    nlu:
      - intent: greet
        examples: |
          - hello
          - hi
          - hey
          - good morning
          - good evening
          - greetings

      - intent: goodbye
        examples: |
          - bye
          - goodbye
          - see you later
          - catch you later
          - see ya
          - take care

      - intent: ask_knowledge
        examples: |
          - I need help with my account
          - Can you assist me with billing?
          - How do I reset my password?
          - I'm facing issues with my order
          - Tell me about your support services
          - How can I contact customer service?
          - What are your support hours?
          - I have a question about Project Alpha
          - Help me understand Project Beta
          - How can I track my purchase?

- **config.yml** - The config.yml file defines the pipeline and policies used by Rasa for processing natural language inputs and managing dialogue workflows.

    version: "3.0"
    language: "en"
    pipeline:
    - name: WhitespaceTokenizer
    - name: RegexFeaturizer
    - name: LexicalSyntacticFeaturizer
    - name: CountVectorsFeaturizer
    - name: CountVectorsFeaturizer
      analyzer: char_wb
      min_ngram: 1
      max_ngram: 4
    - name: DIETClassifier
      epochs: 100
    - name: EntitySynonymMapper
    - name: ResponseSelector
      epochs: 100

    policies:
    - name: RulePolicy
    - name: UnexpecTEDIntentPolicy
      max_history: 5
      epochs: 100
    - name: TEDPolicy
      max_history: 5
      epochs: 100
    assistant_id: 20241227-151505-young-attachment

#### Step 3 - Implement Custom Actions (actions.py) file

- **actions/actions.py file** - The actions.py file is where you define custom actions for your Rasa chatbot. Custom actions are Python functions that can execute arbitrary logic, here we will query LanceDB database and then call OpenAI api for refined/personalized response.

Let's breakdown and see how to implement actions.py

- **Import necessary libraries and functions**
- **Loading Environment Variables:** Utilizes `python-dotenv` to securely load sensitive information such as the OpenAI API key from a `.env` file.

    from typing import Any, Text, Dict, List
    from rasa_sdk import Action, Tracker
    from rasa_sdk.executor import CollectingDispatcher
    import lancedb
    import logging
    from google.colab import userdata
    import openai
    import os
    from dotenv import load_dotenv

    # Load environment variables from .env
    load_dotenv()

    # Configure logging
    logger = logging.getLogger(__name__)
    logging.basicConfig(level=logging.INFO)

    class ActionSearchKnowledge(Action):
        def name(self) -> Text:
            return "action_search_knowledge"

We will implement 3 functions in this class

- **Initialization (`__init__`):**
- Sets up the OpenAI API key.
- Establishes a connection to LanceDB and accesses the `knowledge_base` table.

        def __init__(self):

            # Initialize OpenAI API key from environment variables
            self.openai_api_key = os.getenv("OPENAI_API_KEY")
            if not self.openai_api_key:
                logger.error("OpenAI API key not found. Please set OPENAI_API_KEY in your environment.")
            openai.api_key = self.openai_api_key

            # Initialize LanceDB connection once
            try:
                self.db = lancedb.connect("./content/lancedb")
                self.table_name = "knowledge_base"
                if self.table_name not in self.db.table_names():
                    logger.error(f"Table '{self.table_name}' does not exist in LanceDB.")
                    self.table = None
                else:
                    self.table = self.db.open_table(self.table_name)
                    logger.info(f"Connected to table '{self.table_name}' in LanceDB.")
            except Exception as e:
                logger.error(f"Error connecting to LanceDB: {e}")
                self.table = None

- **Run Method (`run`):**
- **Get User Message:** Retrieve user message from the tracker.
- **Knowledge Retrieval:** Performs a semantic search in LanceDB to find the most relevant piece of information based on the user’s query.
- **Response Generation:** Sends the retrieved information to generate_response(...) or gives direct response decided by relevance of the user's query on LanceDB table.
- **Error Handling:** Gracefully manages any errors by informing the user and logging the issue for further investigation.

      def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get the latest user message
        user_message = tracker.latest_message.get('text')
        logger.info(f"User message: {user_message}")

        if not user_message:
            dispatcher.utter_message(text="Sorry, I didn't catch that. Could you please repeat?")
            return []

        try:
            # Perform similarity search in LanceDB
            query_result = self.table.search(user_message).limit(1).to_pandas()

            # Filter results based on the _distance parameter (smaller _distance means more similar)
            relevant_content = [query_result.loc[0, "content"] if query_result.loc[0, "_distance"] < 0.65 else None][0]
            response_text = "Null"

            # If we find relevant content , sent it to LLM or Else send automated reply
            if not relevant_content == None:
                logger.info(f"Retrieved answer from knowledge base.")
                # Use OpenAI to generate a more refined response
                response_text = self.generate_response(user_message, relevant_content)
            else:
                # If user has ask not a relevant question, reply with the following
                response_text = "I'm sorry, I don't have an answer to that question."
                logger.info(f"No matching content found in knowledge base.")

            # Send the answer back to the user
            dispatcher.utter_message(text=response_text)

        except Exception as e:
            logger.error(f"Error during search operation: {e}")
            dispatcher.utter_message(text="Sorry, something went wrong while processing your request.")

        return []

- **`generate_response` Method:**
- Constructs a prompt combining the user’s question and the relevant knowledge base content.
- Calls OpenAI’s API to generate a refined response.
- Implements a fallback mechanism in case of API failures.

      def generate_response(self, user_message: Text, relevant_content: Text) -> Text:
        """
        Use OpenAI's API to generate a refined response based on user message and relevant content.
        """
        try:
            system_prompt = "You are an company support assistant that provides helpful and accurate answers based on the provided information. You talk professionally and like a customer support executive."

            prompt = (
                f"User Question: {user_message}\n"
                f"Relevant Information: {relevant_content}\n\n"
                f"Provide a detailed and helpful response to the user's question based on the relevant information above."
            )

            response = openai.ChatCompletion.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=450,
                temperature=0.7,
            )

            generated_text = response.choices[0].message['content'].strip()
            logger.info("Generated response using OpenAI API.")
            return generated_text

        except Exception as e:
            logger.error(f"Error generating response with OpenAI API: {e}")
            return relevant_content  # Fallback to relevant content if OpenAI fails

#### Step 4 - Training RASA Model

After setting up the configuration and integrating necessary components, the next step is to train the Rasa model.

    rasa train

- The training process compiles the `nlu.yml`, `stories.yml`, and other configuration files to create a model that can interpret user intents, extract entities, and manage dialogue flows.
- A confirmation message indicates the successful creation of the model, typically stored in the `models` directory.

#### Step 5 - Run Rasa Server and Action Server

To operationalize the chatbot, both the **Rasa Server** and the **Action Server** must be running concurrently. In environments like **Google Colab**, where running multiple persistent processes is challenging, leveraging Python’s threading capabilities facilitates simultaneous server execution.

    rasa run
    rasa run actions

Action server runs on port `5055` while the Rasa server run on port `5005`. Make sure they are free otherwise error might come.

### Step 6 - Interact with the bot and ask it questions

    # Function to send messages to the Rasa server
    def send_message(message):
        url = "http://localhost:5005/webhooks/rest/webhook"
        payload = {
            "sender": "test_user",
            "message": message
        }
        headers = {
            "Content-Type": "application/json"
        }
        try:
            response = requests.post(url, data=json.dumps(payload), headers=headers)
            return response.json()
        except requests.exceptions.ConnectionError:
            return {"error": "Could not connect to Rasa server."}

    # Example interactions
    print("User: Hi")
    assistant_response = send_message("Hi")
    if assistant_response:
        for resp in assistant_response:
            if isinstance(resp, dict) and "text" in resp:
                print("Assistant:", resp["text"])
            else:
                print("Assistant:", resp)

    print("\nUser: How do I reset my password? Explain in french")
    assistant_response = send_message("How do I delete my account? Explain in french")
    if assistant_response:
        print("Assistant:", end = " ")
        for resp in assistant_response:
            if isinstance(resp, dict) and "text" in resp:
                print(resp["text"])
            else:
                print(resp)

## Colab Walkthrough

[

Google Colab

![](__GHOST_URL__/content/images/icon/favicon-18.ico)

![](__GHOST_URL__/content/images/thumbnail/colab_favicon_256px-18.png)
](https://colab.research.google.com/github/lancedb/vectordb-recipes/blob/main/examples/RASA_Customer-support-bot/main.ipynb)
## Conclusion

Congratulations! 🎉 You’ve just navigated through the exciting process of building an **Advanced Customer Support Chatbot** using **Rasa**, **LanceDB**, and **OpenAI’s LLM**. By integrating these powerful tools, you’ve created a chatbot that delivers accurate, timely, and personalized support to the customer.
