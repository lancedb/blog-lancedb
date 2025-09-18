---
title: "Agentic RAG using LangGraph: Build autonomous Customer support agent"
date: 2025-01-26
author: LanceDB
categories: ["Engineering"]
draft: false
featured: false
image: /assets/blog/agentic-rag-using-langgraph-building-a-simple-customer-support-autonomous-agent/preview-image.png
meta_image: /assets/blog/agentic-rag-using-langgraph-building-a-simple-customer-support-autonomous-agent/preview-image.png
description: "Agent? What's that?"
---

### Agent? What's that?

In the current world where everything is running with and for AI, retrieval-augmented generation (RAG) systems have become essential for handling simple queries and generating contextually relevant responses. However, as ever evolving human we are, the need for complex, autonomous problem-solving has emerged. Here I present, behold the mighty: **AI Agents** — autonomous entities that redefine how we interact with technology. In simple terms, it's a sophisticated Graph and even simpler, complex and advanced `for` loops which use LLMs as the core of working.

#### What good are these then?

- **Autonomous Problem-Solving**: AI Agents operate independently, driven by goals rather than specific inputs, and adapt dynamically to new information and environments.
- **Multi-Step Task Execution**: They perform complex, multi-step tasks, maintain state across interactions, and utilize tools like machine learning and rule-based systems to achieve optimal outcomes.
- **Versatile Capabilities**: From browsing the internet and managing apps to conducting financial transactions and controlling devices, AI Agents are reshaping intelligent automation.

#### What's LangGraph?

There are many tools available in the market to build agents and among the famous ones are [LangGraph](https://www.langchain.com/langgraph), [AutoGen](https://github.com/microsoft/autogen), [Swarm](https://github.com/openai/swarm), [CrewAI](https://github.com/crewAIInc/crewAI) etc etc. You can choose any but we chose this one for granular control and Open Source. It basically create a Graph for your workflow and inside your Graph are:

1. `State` : `Pydantic Models` or `Typed Dict` to hold your variables and used for message passing
2. `Node` : It is just a function that does some work. It accepts a `State` object and modifies that State
3. `Tools` : There are pure Python functions or `Pydantic` models which your agents can call. You use the tools to do some Retrieval, Web Search, Calculator, Cal some APIs etc etc. You just have to write the definition of what it does and model will understand which tool **CAN** be used at any point of time.
4. `Edge` : You have pre-defined flows which tell you the execution order of functions (Nodes) in our case
5. `Conditional Edges`  or `Routers`: Instead of fixing in previous point, we make it conditional. So If you are at `Node-N`, you decide based on a condition where you want to go to out of Nodes `N_i....N_x`

**Where does the RAG Come in?**

You remember our `tools` and `Nodes` above? So we can use RAG either as a tool OR a Node. You'll see most of the tutorials using RAG as a tool however I want to show how can you use it as a `Node` and that too conditional.

### Lets build a use case: Email Agent

What is does is:

1. Fetch the unread emails from your inbox
2. Look at the type of email
3. If it is a Policy related email, it'll use RAG to refer to policies to Draft the Email otherwise just create a normal draft. If it's a SPAM or something else, just discard it..
4. Proofread the Draft. If it's good to send, send it else send it to redraft again. Ideally, you'd let the proof reader node know what are the criteria and then you'd send the reasoning why it was rejected so that Drafting model improves it. That would be out of scope of this blog (wait for next one 😄)
5. Once you get Okay from proof reader, send a reply. Ideally, you want an `interrupt` so that the human in the loop can review and THEN you send it but again, it's too much to cover here.
6. For sending, we just `print` for now

***And Yes, All of it is Autonomous ***
[

Google Colab

![](__GHOST_URL__/content/images/icon/favicon-22.ico)

![](__GHOST_URL__/content/images/thumbnail/colab_favicon_256px-22.png)
](https://colab.research.google.com/github/lancedb/vectordb-recipes/blob/main/examples/customer_support_agent_langgraph/LangGraph_LanceDB.ipynb)
Let's get some policies and build our RAG on top of that

    pip install -U colorama langgraph langchain-community langchain-openai langchain-anthropic tavily-python pandas openai lancedb sentence-transformers

    from langchain_core.messages import ToolMessage, SystemMessage, AIMessage, HumanMessage
    from langchain_core.runnables import RunnableLambda
    from langgraph.prebuilt import ToolNode
    from langchain_core.runnables import Runnable, RunnableConfig
    from typing import TypedDict, Annotated
    from langgraph.graph.message import AnyMessage, add_messages
    from langchain_openai import ChatOpenAI
    from langgraph.checkpoint.memory import MemorySaver
    from langgraph.graph import END, StateGraph, START
    from langgraph.prebuilt import tools_condition
    import torch

    # ------------ Vector Search ----------------

    import lancedb, re, requests
    from lancedb.pydantic import LanceModel, Vector
    from lancedb.embeddings import get_registry
    import numpy as np
    from langchain_core.tools import tool

    # ------- Vecot DB using Lance DB ------------
    model = get_registry().get("sentence-transformers").create(name="BAAI/bge-small-en-v1.5", device="cuda" if torch.cuda.is_available() else "cpu")

    class Policy(LanceModel):
        text: str = model.SourceField()
        vector: Vector(model.ndims()) = model.VectorField()

    response = requests.get(
        "https://storage.googleapis.com/benchmarks-artifacts/travel-db/swiss_faq.md"
    )
    response.raise_for_status()
    faq_text = response.text

    class VectorStoreRetriever:
        def __init__(self, db_path:str, table_name:str, model, docs: list, schema, ):
            self.db = lancedb.connect(db_path)
            self.table = self.db.create_table(table_name, schema = schema)
            self.table.add([{"text": txt} for txt in re.split(r"(?=\n##)", faq_text)])

        def query(self, query: str, k: int = 5) -> list[dict]:
            result = self.table.search(query).limit(k).to_list()
            return [{"page_content": item["text"], "similarity": 1- item["_distance"]} for item in result]

    retriever = VectorStoreRetriever("./lancedb", "company_policy", model, faq_text, Policy)

Now that we have our documents, ready, let's build some helpers including a Dummy Function to fetch your email. In real world, you replace it with your logic and APIs

    from typing import Optional, List
    from pydantic import BaseModel
    from langchain_core.prompts import PromptTemplate
    from langchain_openai import AzureChatOpenAI
    from langgraph.graph import END, StateGraph, START
    import os
    from dotenv import load_dotenv
    import random
    from typing import Annotated
    from langgraph.graph.message import AnyMessage, add_messages
    from typing_extensions import TypedDict
    from langchain_core.messages import ToolMessage, SystemMessage, AIMessage, HumanMessage
    from langchain_core.runnables import RunnableLambda
    from langgraph.prebuilt import ToolNode
    from langchain_core.runnables import Runnable, RunnableConfig
    from langgraph.checkpoint.memory import MemorySaver
    from langgraph.prebuilt import tools_condition
    import lancedb, re, requests
    from lancedb.pydantic import LanceModel, Vector
    from lancedb.embeddings import get_registry
    import numpy as np
    from langchain_core.tools import tool
    from google.colab import userdata # use os.environ.get()
    import os
    from colorama import Fore, Style

    memory = MemorySaver() # it'll save the all the states and history corresponding to a `thread_id`. We can get previous conversations if we use memory

    # llm = ChatOpenAI(model="gpt-3.5-turbo") # use any
    def setup_llm():
        return AzureChatOpenAI(
            api_key=userdata.get("AZURE_OPENAI_API_KEY"),
            api_version=userdata.get("AZURE_OPENAI_API_MODEL_VERSION"),
            azure_endpoint=userdata.get("AZURE_OPENAI_API_ENDPOINT"),
            azure_deployment=userdata.get("AZURE_OPENAI_API_DEPLOYMENT_NAME"),
            temperature=0.7
        )

    def create_dummy_random_emails():
        items = [
            {
                "subject": "Invoice Request for Recent Flight Booking",
                "body": "Dear SWISS Team, I recently booked a flight with SWISS (Booking Reference: LX123456) and would like to request an invoice for my records. Could you please guide me on how to obtain it? Thank you, Anna Müller"
            },
            {
                "subject": "Rebooking Inquiry for Upcoming Flight",
                "body": "Hello, I need to change the travel dates for my flight (Booking Reference: LX789012). Can you confirm if this is possible and what fees might apply? Best regards, John Smith"
            },
            {
                "subject": "Cancellation of Flight LX345678",
                "body": "Hi SWISS Customer Service, I need to cancel my flight (Booking Reference: LX345678) due to unforeseen circumstances. Could you please explain the cancellation process and any associated fees? Sincerely, Maria Gonzalez"
            },
            {
                "subject": "Request for Special Invoice for Italy",
                "body": "Dear SWISS, I booked a flight originating in Italy and require a special invoice for tax purposes. Can you assist me with this request? Kind regards, Luca Rossi"
            },
            {
                "subject": "Payment Issue with Credit Card",
                "body": "Hello, I tried to pay for my booking using my Visa card, but the payment failed. Can you confirm if the issue is with my card or the payment system? Thanks, Emily Brown"
            },
            {
                "subject": "Refund Status for Cancelled Flight",
                "body": "Dear SWISS, I cancelled my flight (Booking Reference: LX456789) two weeks ago and was told I would receive a refund. Could you provide an update on the status? Best, David Johnson"
            },
            {
                "subject": "Seat Reservation Inquiry",
                "body": "Hi, I have a booking (Reference: LX567890) and would like to confirm if my seat reservation will be retained after a rebooking. Please advise. Regards, Sophie Lee"
            },
            {
                "subject": "Upgrade Request for Economy Flex Fare",
                "body": "Dear SWISS, I booked an Economy Flex fare and would like to upgrade to Business Class. Can you guide me on how to proceed? Thank you, Michael Chen"
            },
            {
                "subject": "Group Booking Inquiry",
                "body": "Hello, I am planning to book flights for a group of 12 passengers. Can you provide details on group booking options and any discounts? Best, Sarah Wilson"
            },
            {
                "subject": "Issue with Online Booking Platform",
                "body": "Hi SWISS, I am unable to see my recent booking in my profile on the SWISS website. Can you help resolve this issue? Regards, Thomas Anderson"
            }
        ]
        chosen_items = [random.choice(items) for _ in range(random.randint(0,2))]
        return [Email(id=str(i), sender="some_user@example.mail", subject=item["subject"], body=item["body"]) for i, item in enumerate(chosen_items)]

**Let's setup our Email Agent:**

First one is our `Email` object which basically tells us what an Email is. The second one is the `State` which will be used inside the graph

    class Email(BaseModel):
        id: str
        sender: str
        subject: str
        body: str
        final_reply: str = ""
        status: str = "pending"  # pending, sent, failed, skipped
        failure_reason: str = ""

    class EmailState(BaseModel):
        emails: List[Email] = [] # List of the Unread above Email class
        processed_emails: List[Email] = [] # Final emails with the replies and denial reason
        current_email: Optional[Email] = None # Pop one everytime from the above list
        policy_context: Optional[str] = "" # Rag context for CURRENT email
        draft: str = "" # Current Draft of the Current Email
        trials: int = 0 # Trails done for Draft <-> Proof Read for current email
        allowed_trials: int = 3 # do Drft <-> Proof Read a max of 3 times
        sendable: bool = False # send the current email if True
        exit:bool = False # There are no unread emails left

Let's setup our Agent Classes and simple functions. Names and Prompts are self explanatory.  Out **LanceDB **RAG is used in the function `lookup_policy` to fetch policies if the query requires searching the internal policies.

    class EmailAgent:
        def __init__(self):
            self.llm = setup_llm() # Replace with your LLM you want

        def fetch_unread_emails(self) -> List[Email]:
          """
          Replace this with your Email LOGIC
          """
          return create_dummy_random_emails()

        def lookup_policy(self, subject: str, body:str) -> str:
            """Always Consult the company policies to answer the queries.
            Use this for drafting the emails"""
            prompt = PromptTemplate(template="Identify whether the given email is policy related or not. Identify if the email requires info which might be in the policy documents.\n\nSubject: {subject}\n\nBody:\n{body}\n\n. Do not output any reasoning etc. Strictly reply with Yes/No", input_variables=["email"])
            chain = prompt | self.llm
            response = chain.invoke({"subject": subject, "body": body})
            policy_related = response.content.strip().lower() == "yes"
            if policy_related:
              docs = retriever.query(f"Email Subject: {subject}\n\nEmail Body:\n{body}", k=2)
              return "\nPolicy Context:" + "\n\n".join([doc["page_content"] for doc in docs])
            return ""

        def draft_email(self, email_subject:str, email_body: str, email_context:str = "") -> str:
            if not email_context:
              prompt = PromptTemplate(template="You are a specialised chat agent named Saleem Shady' working for SWISS Airline. Write a well professional response to this user email:\n\nEmail Subject: {email_subject}\n\nEmail Body:\n{email_body}\n\nResponse:", input_variables=["email"])
            else:
              prompt = PromptTemplate(template="You are a specialised chat agent named Saleem Shady' working for SWISS Airline. Write a well professional response to this user email given the Context (which may or may not be required in answering)\n\n{email_context}\n\nEmail Subject: {email_subject}\n\nEmail Body:\n{email_body}\n\nResponse:", input_variables=["email"])

            chain = prompt | self.llm
            response = chain.invoke({"email_subject":email_subject,"email_body": email_body, "email_context": email_context})
            return response.content

        def validate_draft(self, initial_email: str, draft_email: str) -> bool:
            prompt = PromptTemplate(template="You are a Email Proofreader. Review this response:\n\nOriginal Email:\n{initial_email}\n\nDraft Response:\n{draft_email}\n\nIs this mail ready to send? Do not give your reasoning or views. Reply only with (Yes/No):", input_variables=["initial_email", "draft_email"])
            chain = prompt | self.llm
            response = chain.invoke({"initial_email": initial_email, "draft_email": draft_email})
            return response.content.strip().lower() == "yes"

Now let's setup our main `Workflow` which is why you came here. The below functions are Either `Nodes` or `Routers` . Which we'll get to know when we build the nodes and define edges

        agent = EmailAgent()

        def fetch_emails(state: EmailState) -> EmailState:
            emails = agent.fetch_unread_emails()
            state.emails = emails
            return state

        def process_next_email(state: EmailState) -> EmailState:
          if state.emails:
              state.current_email = state.emails.pop(0)
              state.policy_context = agent.lookup_policy(state.current_email.subject, state.current_email.body)
          else:
              state.exit = True
          return state

        def draft_email(state: EmailState) -> EmailState:
            if state.current_email:
                state.draft = agent.draft_email(state.current_email.subject, state.current_email.body, state.policy_context)
                state.trials += 1
            return state

        def validate_draft(state: EmailState) -> EmailState:
            if state.current_email and state.draft:
                state.sendable = agent.validate_draft(state.current_email.body, state.draft)
            return state

        def decide_next_step(state: EmailState) -> str:
            if state.sendable:
                print("\n\n-----------------------Sending Email ---------------\n\n")
                return "send"
            elif state.trials >= state.allowed_trials:
                state.current_email.status = "failed"
                state.current_email.failure_reason = "Failed after 3 attempts"
                print("\n\n*********************** Draft Failed after Max Tries ******************** \n\n")
                return "stop"
            else:
                return "rewrite"

        def send_or_skip_email(state: EmailState) -> EmailState:
            if state.current_email.status != "failed":
                print(f"\n\nSending email: {state.draft}")
                state.current_email.final_reply = state.draft
                state.current_email.status = "sent"
                state.processed_emails.append(state.current_email)

            # Reset state for the next email
            state.current_email = None
            state.draft = ""
            state.trials = 0
            state.policy_context = ""
            return state

Let's Define the `Nodes` and `Edges / Conditional Edges`

        workflow.add_node("fetch_emails", fetch_emails)
        workflow.add_node("process_next_email", process_next_email)
        workflow.add_node("draft_email", draft_email)
        workflow.add_node("validate_draft", validate_draft)
        workflow.add_node("send_or_skip_email", send_or_skip_email)

        workflow.add_edge(START, "fetch_emails")
        workflow.add_edge("fetch_emails", "process_next_email")

        workflow.add_conditional_edges(
            "process_next_email",
            lambda state: END if state.exit else "draft_email" ,
            {"draft_email": "draft_email", END: END}
            )

        workflow.add_edge("draft_email", "validate_draft")

        workflow.add_conditional_edges(
            "validate_draft",
            decide_next_step,
            {"send": "send_or_skip_email", "rewrite": "draft_email", "stop": "send_or_skip_email"}
        )

        workflow.add_edge("send_or_skip_email", "process_next_email")

        compiled_email_subgraph = workflow.compile()

Want to see how our graph looks?

    initial_state = EmailState()

    from IPython.display import Image, display
    try:
        display(Image(compiled_email_subgraph.get_graph(xray=True).draw_mermaid_png()))
    except Exception:
        pass

![](__GHOST_URL__/content/images/2025/01/download.png)
You can match the graph working with what we discussed the in the workflow. Let's put it to work. (Uncomment if you want to see the `State` at each point)

    print(Fore.GREEN + "Starting workflow..." + Style.RESET_ALL)
    for output in compiled_email_subgraph.stream(initial_state):
        for key, value in output.items():
            print(Fore.CYAN + f"Finished running: {key}" + Style.RESET_ALL)
            # print(Fore.YELLOW + f"State after {key}:" + Style.RESET_ALL)
            # print(value)

![](__GHOST_URL__/content/images/2025/01/Screenshot-from-2025-01-19-13-42-50.png)
You see, one failed after 3 times and one got sent successfulAgentic RAG using LangGraph: Build autonomous Customer support agently. Which means that you need to tweak your prompts, add the validator reasoning and guidance etc according to the data and use case
[

Google Colab

![](__GHOST_URL__/content/images/icon/favicon-23.ico)

![](__GHOST_URL__/content/images/thumbnail/colab_favicon_256px-23.png)
](https://colab.research.google.com/github/lancedb/vectordb-recipes/blob/main/examples/customer_support_agent_langgraph/LangGraph_LanceDB.ipynb)
### Final Notes

So now that we've built a working agent that takes care of things for you, one thing to notice is that it relies heavily on fetching the right context which is where LanceDB stands out as a powerful tool because of it's ability to efficiently handle (in memory) vector search thus making it an invaluable whether you're doing a quick POC or putting your stuff to production.

Keep yourself posted to learn some advanced Agentic concepts (like Human in the Loop, Memory, Multi Agents etc etc) further enhanced by LanceDB's powerful filtering to push RAG accuracy even further.
