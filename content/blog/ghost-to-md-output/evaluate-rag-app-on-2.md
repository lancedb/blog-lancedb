---
title: "End to End Evaluation Template for RAG Apps"
date: 2025-02-22
author: LanceDB
categories: ["Engineering"]
draft: false
featured: false
image: /assets/blog/evaluate-rag-app-on-2/preview-image.png
meta_image: /assets/blog/evaluate-rag-app-on-2/preview-image.png
description: "Explore about end to end evaluation template for rag apps. Get practical steps, examples, and best practices you can use now."
---

💡

This is a community post by Mahesh Deshwal

## Comprehensive Evaluation Metrics for RAG Applications Using LanceDB

In the world of Retrieval-Augmented Generation (RAG) applications, evaluating the performance and reliability of models is critical. Evaluation metrics play a crucial role in assessing and enhancing the performance of models and their it is a continuous, iterative process.

This involves two main types of evaluations: Offline and Online. Each type uses a variety of metrics to assess the system's effectiveness and quality. In this blog post, we'll delve deeply into these evaluation methods and metrics, with a particular focus on integrating LanceDB, a specialized vector database, to enhance performance.

## Understanding RAG Evaluation Metrics

**Offline Evaluation** is perfect for the early days of model development when you're testing features against pre-set data. It's like training wheels for your model - necessary, but not great for showing off. It is conducted in a controlled environment where models are tested against benchmark datasets. This method leverages a variety of metrics to assess the effectiveness and quality of the system components, including the Embedding Model, Vector Database, Rerankers, and Chunking Strategy.

### Key Metrics for Offline Evaluation

**Effectiveness Metrics**

1. **Hit Rate**: Measures the frequency with which relevant documents are retrieved.
2. **NDCG (Normalized Discounted Cumulative Gain)**: Evaluates the usefulness of ranked retrieval results.
3. **MRR (Mean Reciprocal Rank)**: Assesses the rank position of the first relevant document.
4. **Precision@K and Recall@K**: Quantify the system's ability to retrieve relevant documents among the top K results.

**Quality Metrics**

1. **Fluency and Complexity**: Ensure the generated text is linguistically fluent and appropriately complex for the target audience.
2. **Perplexity**: Indicates how well the model predicts a sample, with lower values suggesting better performance.
3. **BERTScore, BLEU, ROUGE, METEOR**: These metrics compare the generated responses with reference answers, evaluating their similarity and overlap in terms of word choice and sequence.
4. **Groundedness and Hallucination Rate**: Groundedness ensures responses are based on factual information, while the hallucination rate checks for unfounded or incorrect information in the response.
5. **Toxicity, Context Adherence, and Faithfulness**: Assess whether the responses are non-toxic, adhere closely to the context provided, and are factually accurate.

**Online Evaluation** is executed in real time, focusing on the system's operational performance and user interaction issues. This evaluation helps identify and address live problems such as slow response times, API failures, and system reliability under load.

### Key Metrics for Online Evaluation

1. **API Failure Rate**: Monitors the frequency of API errors or failures, which is crucial for maintaining system reliability.
2. **Latency**: Measures the time taken for the system to respond to requests, a key performance indicator in user experience.
3. **Throughput and Load Resistance**: Evaluate the system's capacity to handle a large number of requests simultaneously without degrading performance.
4. **Context Retrieval Efficiency**: Assesses the speed and accuracy with which relevant context is retrieved, impacting the overall response quality.

**Detailed Overview of Evaluation Classes and Metrics**

The evaluation process for RAG applications involves several classes, each focusing on different evaluation aspects:

**IOGuards**: Essential for safeguarding against prompt injections and ensuring that the model does not produce harmful or sensitive outputs. This class uses various models to detect issues like toxicity, bias, polarity, and sentiment in queries, contexts, and responses.

- Harmful Content Detection: Uses sentence embeddings to detect harmful queries or responses.
- Pattern Detection: Employs regex to reveal sensitive information patterns, such as credit card numbers or email addresses.
- Toxicity and Sentiment Analysis: Utilizes pre-trained models to assess the sentiment and potential toxicity of inputs and outputs.
- Polarity and Bias Detection: Evaluates the polarity of responses and detects any inherent biases.
- Prompt Injection Classification: Identifies and mitigates risks of prompt injection attacks using classification models.

Follow along with the below code
[

vectordb-recipes/applications/evaluate_RAG at main · lancedb/vectordb-recipes

High quality resources & applications for LLMs, multi-modal models and VectorDBs - lancedb/vectordb-recipes

![](__GHOST_URL__/content/images/icon/pinned-octocat-093da3e6fa40-5.svg)GitHublancedb

![](__GHOST_URL__/content/images/thumbnail/vectordb-recipes)
](https://github.com/lancedb/vectordb-recipes/tree/main/applications/evaluate_RAG)
    class IOGuards:
        def __init__(self):
            """
            A huge data for injection, harmful prompts is given at: https://github.com/verazuo/jailbreak_llms/tree/main/data
            """
            with st.spinner("Loading `IO Guard` model..."):
                self.sim_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

                self.harmful_in = self.sim_model.encode(["How to commit suicide",
                                                    "How to make bomb",
                                                    "how to do harm to someone something",
                                                    "how to kill someone", "how to hack a website router etc"])

                self.harmful_out = self.sim_model.encode(["This is how you can commit suicide",
                                                "There are multiple Ways to make bombs such as",
                                                "You can kill someone by using",
                                                "Ways to hack a website are given "])

                self.refusal = self.sim_model.encode(["I'm very sorry, but I cannot provide information or assistance on . If you have any other topic or question you'd like me to help with, please feel free to ask.",
                                            "Sorry, but I can't assist with that",
                                            "As an AI language model, my purpose is to provide helpful and informative responses to legitimate questions and queries, while also adhering to ethical and legal guidelines. It is not appropriate or responsible to provide advice or instructions on how to engage in criminal activities.",
                                            "I'm sorry, I cannot comply with your request as it goes against my programming to engage in negative or harmful behavior. My purpose is to assist and provide helpful responses."
                                            "I don't have the answer", "I can't answer that", "This can't be answered",
                                            "I don't the answer is present in the context"
                                            ])

            with st.spinner("Compiling`Guard Regexes` ..."):
                self.regexes = {
                    "credit": re.compile("\b((4\d{3}|5[1-5]\d{2}|2\d{3}|3[47]\d{1,2})[\s\-]?\d{4,6}[\s\-]?\d{4,6}?([\s\-]\d{3,4})?(\d{3})?)\b"),
                    "email" : re.compile("\b[a-z0-9._%\+\-—|]+@[a-z0-9.\-—|]+\.[a-z|]{2,6}\b"),
                    "ipv4": re.compile("\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b"),
                    "ipv6" : re.compile("\b([\d\w]{4}|0)(\:([\d\w]{4}|0)){7}\b")
                    }

            with st.spinner("Loading `Toxic Guard` model ..."):
                self.toxic_tokenizer = AutoTokenizer.from_pretrained("martin-ha/toxic-comment-model")
                self.toxic_model = AutoModelForSequenceClassification.from_pretrained("martin-ha/toxic-comment-model")
                self.toxic_pipeline =  TextClassificationPipeline(model=self.toxic_model, tokenizer=self.toxic_tokenizer)

            with st.spinner("Loading `Sentiment` model ..."):
                nltk.download('vader_lexicon')
                self.sentiment_analyzer = SentimentIntensityAnalyzer()

            with st.spinner("Loading `Polarity Guard` model ..."):
                self.polarity_regard = evaluate.load("regard")

            with st.spinner("Loading `Bias Guard` model ..."):
                self.bias_tokenizer = AutoTokenizer.from_pretrained("d4data/bias-detection-model")
                self.bias_model = TFAutoModelForSequenceClassification.from_pretrained("d4data/bias-detection-model")
                self.bias_pipeline = pipeline('text-classification', model = self.bias_model, tokenizer = self.bias_tokenizer)

            with st.spinner("Loading `Prompt Injection Guard` model ..."):
                self.inj_tokenizer = AutoTokenizer.from_pretrained("ProtectAI/deberta-v3-base-prompt-injection-v2")
                self.inj_model = AutoModelForSequenceClassification.from_pretrained("ProtectAI/deberta-v3-base-prompt-injection-v2")
                self.inj_classif = pipeline("text-classification", model=self.inj_model, tokenizer = self.inj_tokenizer,
                                            truncation=True, max_length=512, device = DEVICE)

        def harmful_refusal_guards(self, input, context, response, thresh = 0.8):
            resp = self.sim_model.encode(response)
            return {"harmful_query": np.any((self.sim_model.encode(input) @ self.harmful_in.T) > thresh),
            "harmful_context": np.any((self.sim_model.encode(context) @ self.harmful_out.T) > thresh),
            "harmful_response": np.any((resp @ self.harmful_out.T) > thresh),
            "refusal_response": np.any((resp @ self.refusal.T) > thresh)}

        def detect_pattern(self,output):
            """
            Help locate Phone, Email, Card, , IP, Address etc. Most useful for Output but can be used to mask info in Context and Query if using Third Part LLM
            https://help.relativity.com/RelativityOne/Content/Relativity/Relativity_Redact/Regular_expression_examples.htm
            """
            RES = {}
            for (key, reg) in self.regexes.items():
                pat = re.findall(reg, output)
                if pat: RES[key] = pat
            return RES

        def toxicity(self, input):
            """
            Can be used for Both Query and Response
            Models:
                1.  "alexandrainst/da-hatespeech-detection-small"
                2:  "martin-ha/toxic-comment-model"
            """
            return self.toxic_pipeline(input)

        def sentiment(self, text):
            """
            Can be used for Input or Output
            NOTE: This is different from the polarity below named as "regard"
            """
            return  self.sentiment_analyzer.polarity_scores(text)

        def polarity(self, input):
            if isinstance(input, str): input = [input]
            results = []
            for d in self.polarity_regard.compute(data = input)['regard']:
                results.append({l['label']: round(l['score'],2) for l in d})
            return results

        def bias(self, query):
            """
            Most needed for Response but can be used for Context and Input which might influence the Response
            """
            return self.bias_pipeline(query)

        def prompt_injection_classif(self, query):
            """
            Classification using: ProtectAI/deberta-v3-base-prompt-injection-v2
            """
            return self.inj_classif(query)

**TextStat**: Evaluates the readability and complexity of generated text. It uses traditional readability metrics to assess the fluency and understandability of outputs.

- Readability Scores: Metrics like Flesch Reading Ease, SMOG Index, and Automated Readability Index provide insights into how easily a text can be read and understood.
- Text Complexity: Measures such as average word length, sentence length, and word diversity offer a deeper understanding of text complexity.

    class TextStat():
        def __init__(self):
            """
            This metric calculates mostly the Quality of output based on traditional metrics to detect fluency, readability, simplicity etc
            """

        def calculate_text_stat(self, test_data):
            """
           To add:
                1. N-Gram (Lexical or Vocab) Diversity: Unique vs repeated %
                2. Grammatical Error %
                3. Text Avg Word Length, No of Words, No of unique words, average sentence length etc etc
            """
            return {"flesch_reading_ease":textstat.flesch_reading_ease(test_data),
            "flesch_kincaid_grade": textstat.flesch_kincaid_grade(test_data),
            "smog_index": textstat.smog_index(test_data),
            "coleman_liau_index" : textstat.coleman_liau_index(test_data),
            "automated_readability_index" : textstat.automated_readability_index(test_data),
            "dale_chall_readability_score" : textstat.dale_chall_readability_score(test_data),
            "difficult_words" : textstat.difficult_words(test_data),
            "linsear_write_formula" : textstat.linsear_write_formula(test_data),
            "gunning_fog" : textstat.gunning_fog(test_data),
            "text_standard" : textstat.text_standard(test_data),
            "fernandez_huerta" : textstat.fernandez_huerta(test_data),
            "szigriszt_pazos" : textstat.szigriszt_pazos(test_data),
            "gutierrez_polini" : textstat.gutierrez_polini(test_data),
            "crawford" : textstat.crawford(test_data),
            "gulpease_index" : textstat.gulpease_index(test_data),
            "osman" : textstat.osman(test_data)}

**ComparisonMetrics**: Invaluable for tasks like summarization and paraphrasing, providing insights into the similarity between different segments of text.

- Reference-Based Metrics: BERTScore, ROUGE, BLEU, METEOR, and BLEURT are used to compare the generated responses with reference texts, evaluating similarity and quality.
- Hallucination and Contradiction Detection: Models are employed to detect inconsistencies and unfounded claims in responses.
- String Similarity Metrics: Metrics like BM25, Levenshtein Distance, and Fuzzy Score assess syntactic similarity, useful for evaluating paraphrased or summarized content.

    class ComparisonMetrics:
        def __init__(self,):
            """
            1. Metrics which are Generation dependent and require Input and Generated
                Can be used for:
                    Query - Context, Query - Response, Response - Context

                Metrics Included:
                    BLUE, ROUGE, METEOR, BLEURT, BERTScore, Contradiction

            2. There are some metrics used for Contradiction and Hallucination detection
                Can be used with:
                    Query - Context, Query - Response, Response - Context

            3. String Comparison Metrics which are purely syntactic like BM-25 score, Levenstien Distance, Fuzzy score, Shingles
                Can be used in Paraphrasing, Summarisation etc
            """
            with st.spinner("Loading `Hallucination Detection` model ..."):
                self.hallucination_model =  CrossEncoder('vectara/hallucination_evaluation_model')

            with st.spinner("Loading `Contradiction Detection` model ..."):
                self.contra_tokenizer = AutoTokenizer.from_pretrained("MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7")
                self.contra_model = AutoModelForSequenceClassification.from_pretrained("MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7")

            with st.spinner("Loading `ROUGE` ..."): self.rouge = evaluate.load('rouge')
            with st.spinner("Loading `BLEU` ..."): self.bleu = evaluate.load("bleu")
            with st.spinner("Loading `BLEURT` ..."): self.bleurt = evaluate.load("bleurt", module_type="metric")
            with st.spinner("Loading `METEOR` ..."): self.meteor = evaluate.load('meteor')
            with st.spinner("Loading `BERTScore` ..."): self.bertscore = evaluate.load("bertscore")

        def hallucinations(self, input, response):
            return self.hallucination_model.predict([[input,response]])

        def contradiction(self, query, response):
            """
            Given a Query and Response, find it the response contradicts the query or not
                Can be used for Query - Response majorly but it useful for Context - Response and Query - Context too
            """
            input = self.contra_tokenizer(query, response, truncation=True, return_tensors="pt")
            output = self.contra_model(input["input_ids"])
            prediction = torch.softmax(output["logits"][0], -1).tolist()
            label_names = ["entailment", "neutral", "contradiction"]
            return {name: round(float(pred) * 100, 1) for pred, name in zip(prediction, label_names)}

        def ref_focussed_metrics(self, reference, response):
            if isinstance(reference, str): reference = [reference]
            if isinstance(response, str): response = [response]

            return {"bertscore": self.bertscore.compute(predictions = response, references=reference, lang="en"),
                    "rouge": self.rouge.compute(predictions = response, references=reference, use_aggregator=False),
                    "bleu": self.bleu.compute(predictions = response, references = reference, max_order=4),
                    "bleurt": self.bleurt.compute(predictions = response, references = reference),
                    "meteor": self.meteor.compute(predictions = response, references = reference)
                    }

        def string_similarity(self, reference, response):
            """
            """
            tokenized_corpus = [doc.split(" ") for doc in [reference]] # Only 1 reference is there so the whole corpus
            bm25 = BM25Okapi(tokenized_corpus) # build index

            return {"fuzz_q_ratio":fuzz.QRatio(reference, response),
            "fuzz_partial_ratio":fuzz.partial_ratio(reference, response),
            'fuzz_partial_token_set_ratio':fuzz.partial_token_set_ratio(reference, response),
            'fuzz_partial_token_sort_ratio':fuzz.partial_token_sort_ratio(reference, response),
            'fuzz_token_set_ratio':fuzz.token_set_ratio(reference, response),
            'fuzz_token_sort_ratio':fuzz.token_sort_ratio(reference, response),
            "levenshtein_distance": lev_distance(reference, response),
            "bm_25_scores" : bm25.get_scores(response.split(" ")) # not a very good indicator for QUERY but for CONTEXT versus response it can work well
            }

**AppMetrics**: Focuses on operational performance of the application, capturing metrics related to the speed and efficiency of various processes.

- Execution Times: Measures the time taken for each stage of processing, from input to output, helping identify bottlenecks.
- System Load and Failure Rates: Monitors system performance under load and tracks the frequency of failures or refusals to respond.
- Resource Usage: Evaluates the CPU, GPU, and memory usage during the application run to optimize resource allocation

    class AppMetrics:
        def __init__(self):
            """
            App specific metrics can be calculated like:
                1. Time to generate First token
                2. App failure rate
                3. How many times model denied to answer
                4. Time to taken from input to output
                5. No of requests sucessfully served
                6. No of times less than, exactly 'k' contexts recieved with >x% similarity
                7. No of times No context was found
                8. Time taken to fetc the contexts
                10. Time taken to generate the response
                11. Time taken to evaluate the metrics
                12. CPU, GPU, Memory usage
            """
            self.exec_times = {}

        @staticmethod
        def measure_execution_time(func):
            def wrapper(*args, **kwargs):
                start_time = time.time()
                result = func(*args, **kwargs)
                end_time = time.time()
                execution_time = end_time - start_time
                return result, round(execution_time, 5)
            return wrapper

 **LLMasJudge**: Uses language models as evaluators, allowing for comprehensive assessments of response quality and accuracy.

- Reasoning and Correctness: Ensures responses are logically consistent and based on robust reasoning.
- Fact-Checking and Hallucination Detection: Evaluates the factual accuracy of responses, ensuring they are based on the context provided.

    class LLMasEvaluator():
        """
        Using LLM as evaluators. It can be a custom fune tuned model on your task, rubrics etc
        or it can be a bigger LLM with specified prompts. It can be used to:
            1. Find if the response is related to query, context and answers fully
            2. Find if the reasoning is correct in response AKS Hallucination detection
            3. Find if all the facts are correct and are from context only

            etc etc
        """
        def __init__(self, llm):
            assert NotImplemented("This is more like a prompting thing to LLM. Easy to do, Skipping for now")
            self.llm = llm

        def run(self,prompt):
            """
            Prompt should have your QUERY, Context, Response
            Make a custom task specific prompt to pass to get the responses depending on task to task
            """
            return self.llm(prompt)

**TraditionalPipelines**:  While not fully implemented in the current evaluation pipeline, traditional NLP tasks like Named Entity Recognition (NER), Part-of-Speech (POS) tagging, and Topic Classification are crucial for understanding the content and structure of queries and responses.

- Topic Classification: Identifies common topics across queries, contexts, and responses, ensuring thematic consistency.
- NER and POS Tagging: Provides insights into the entities and grammatical structure of texts, useful for detailed offline analysis.

    class TraditionalPipelines():
        def __init__(self, model):
            """
            Models like NER, Topics, POS etc that are helpful in offline and online evaluations too
            """
            raise NotImplementedError("Pipeline Becomes Too heavy. Skipping for Now")
            self.topic_classif = pipeline("zero-shot-classification", model="MoritzLaurer/mDeBERTa-v3-base-mnli-xnli")

        def topics(self, input):
            """
            Apply Multi Label Topic Classification
            Helps in finding common Topics between:
                Query - Context, Query - Response, Response - Context, [Response Chunks]

            It can be done by calculating the similarity between Chunks of respponse to see whether they are talking of same thing or not
            """
            candidate_labels = ["politics", "economy", "entertainment", "environment"]
            return self.topic_classif(input, candidate_labels, multi_label = True)

        def NER(self, input):
            """
            Apply NER for inputs. Helps in finding common entities and their distribution among:
                Query - Context, Query - Response, Response - Context
            """
            pass

        def POS(self, input):
            """
            Add POS tagging. Not very useful but can be used to do analysis offline
            """
            pass

**LanceDB**: Enhancing Vector Database Operations, is integral to the RAG evaluation pipeline, serving as an efficient vector database for storing and retrieving embeddings. Its capabilities significantly enhance the performance of context retrieval processes.

**Advantages of Using LanceDB Fast Retrieval**

- LanceDB's approximate nearest neighbour (ANN) search algorithms enable rapid retrieval of relevant embeddings, crucial for real-time applications.
- Scalable Architecture: Designed to handle extensive datasets, LanceDB ensures scalability for applications with increasing data volumes.
- Seamless Integration: LanceDB easily integrates into the evaluation pipeline, facilitating efficient embedding storage and retrieval without disrupting other processes.

### Putting all the evaluations in a small app using `LanceDB` and `Streamlit`

    import streamlit as st
    from PyPDF2 import PdfReader
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain_community.vectorstores import LanceDB
    from langchain.chains.question_answering import load_qa_chain
    from langchain.prompts import PromptTemplate
    from langchain_openai import ChatOpenAI
    from langchain_community.embeddings import HuggingFaceEmbeddings
    from eval_metrics import *

    if 'api_key' not in st.session_state: st.session_state['api_key'] = None
    if 'user_turn' not in st.session_state: st.session_state['user_turn'] = False
    if 'pdf' not in st.session_state: st.session_state['pdf'] = None
    if "embed_model" not in st.session_state: st.session_state['embed_model'] = None
    if "vector_store" not in st.session_state: st.session_state['vector_store'] = None
    if "eval_models" not in st.session_state: st.session_state["eval_models"] = {"app_metrics": AppMetrics()}

    st.set_page_config(page_title="Document Genie", layout="wide")

    def get_pdf_text(pdf_docs):
        text = ""
        for pdf in pdf_docs:
            pdf_reader = PdfReader(pdf)
            for page in pdf_reader.pages:
                text += page.extract_text()
        return text

    @AppMetrics.measure_execution_time
    def build_vector_store(text):
        text_splitter = RecursiveCharacterTextSplitter(chunk_size = st.session_state['chunk_size'] , chunk_overlap= st.session_state['chunk_overlap'])
        text_chunks = text_splitter.split_text(text)
        st.session_state['vector_store']= LanceDB.from_texts(text_chunks, st.session_state["embed_model"])

    @AppMetrics.measure_execution_time
    def fetch_context(query):
        return st.session_state['vector_store'].similarity_search(query, k = st.session_state['top_k'])

    def get_conversational_chain():
        prompt_template = """
        Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
        provided context just say, "I don't think the answer is available in the context", don't provide the wrong answer\n\n
        Context:\n {context}?\n
        Question: \n{question}\n

        Answer:
        """
        model = ChatOpenAI(model="gpt-3.5-turbo-0125", temperature=0, openai_api_key=st.session_state['api_key'])
        prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
        chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
        return chain

    @AppMetrics.measure_execution_time
    def llm_output(chain, docs, user_question):
        return chain({"input_documents": docs, "question": user_question}, return_only_outputs=True)

    def user_input(user_question):
        contexts_with_scores, exec_time = fetch_context(user_question)
        st.session_state["eval_models"]["app_metrics"].exec_times["chunk_fetch_time"] = exec_time

        chain = get_conversational_chain()
        response, exec_time = llm_output(chain, contexts_with_scores, user_question)
        st.session_state["eval_models"]["app_metrics"].exec_times["llm_resp_time"] = exec_time

        st.write("Reply: ", response["output_text"])

        ctx = ""
        for item in contexts_with_scores:
            if len(item.page_content.strip()):
                ctx += f"<li>Similarity Score: {round(float(item.metadata['_distance']), 2)}<br>Context: {item.page_content}<br>&nbsp</li>"

        with st.expander("Click to see the context passed"):
            st.markdown(f"""<ol>{ctx}</ol>""", unsafe_allow_html=True)

        return contexts_with_scores, response["output_text"]

    def evaluate_all(query, context_lis, response):
        guard =  st.session_state["eval_models"]["guards"]
        stat =  st.session_state["eval_models"]["textstat"]
        comp =  st.session_state["eval_models"]["comparison"]
        context = "\n\n".join(context_lis) if len(context_lis) else "no context"

        RESULT = {}

        RESULT["guards"] = {
            "query_injection": guard.prompt_injection_classif(query),
            "context_injection": guard.prompt_injection_classif(context),
            "query_bias": guard.bias(query),
            "context_bias": guard.bias(context),
            "response_bias": guard.bias(response),
            "query_regex": guard.detect_pattern(query),
            "context_regex": guard.detect_pattern(context),
            "response_regex": guard.detect_pattern(response),
            "query_toxicity": guard.toxicity(query),
            "context_toxicity": guard.toxicity(context),
            "response_toxicity":  guard.toxicity(response),
            "query_sentiment": guard.sentiment(query),
            "query_polarity": guard.polarity(query),
            "context_polarity":guard.polarity(context),
            "response_polarity":guard.polarity(response),
            "query_response_hallucination" : comp.hallucinations(query, response),
            "context_response_hallucination" : comp.hallucinations(context, response),
            "query_response_hallucination" : comp.contradiction(query, response),
            "context_response_hallucination" : comp.contradiction(context, response),
        }

        RESULT["guards"].update(guard.harmful_refusal_guards(query, context, response))

        tmp = {}
        for key, val in comp.ref_focussed_metrics(query, response).items():
            tmp[f"query_response_{key}"] = val

        for key, val in comp.ref_focussed_metrics(context, response).items():
            tmp[f"context_response_{key}"] = val

        RESULT["reference_based_metrics"] = tmp

        tmp = {}
        for key, val in comp.string_similarity(query, response).items():
            tmp[f"query_response_{key}"] = val

        for key, val in comp.string_similarity(context, response).items():
            tmp[f"context_response_{key}"] = val

        RESULT["string_similarities"] = tmp

        tmp = {}
        for key, val in stat.calculate_text_stat(response).items():
            tmp[f"result_{key}"] = val
        RESULT["response_text_stats"] = tmp

        RESULT["execution_times"] = (st.session_state["eval_models"]["app_metrics"].exec_times)

        return RESULT

    def main():
        st.markdown("""## RAG Pipeline Example""")

        st.info("Note: This is a minimal demo focussing on ***EVALUATION*** so you can do simple Document QA which uses GPT-3.5 without any persistant memory hence no multi-turn chat is available there. If the question is out of context from the document, this will not work so ask the questions related to the document only. You can optimise the workflow by using Re-Rankers, Chunking Strategy, Better models etc but this app runs on CPU right now easily and is about, again, ***EVALUATION***", icon = "ℹ️")

        st.error("WARNING: If you reload the page, everything (model, PDF, key) will have to be loaded again. That's how `streamlit` works", icon = "🚨")

        with st.sidebar:
            st.title("Menu:")
            st.session_state['api_key'] = st.text_input("Enter your OpenAI API Key:", type="password", key="api_key_input")

            _ =  st.number_input("Top-K Contxets to fetch", min_value = 1, max_value = 50, value = 3, step = 1, key="top_k")
            _ = st.number_input("Chunk Length", min_value = 8, max_value = 4096, value = 512, step = 8, key="chunk_size")
            _ = st.number_input("Chunk Overlap Length", min_value = 4, max_value = 2048, value = 64, step = 1, key="chunk_overlap")

            st.session_state["pdf"] = st.file_uploader("Upload your PDF Files and Click on the Submit & Process Button", accept_multiple_files=True, key="pdf_uploader")

            if st.session_state["pdf"]:
                if st.session_state["embed_model"] is None:
                    with st.spinner("Setting up `all-MiniLM-L6-v2` for the first time"):
                        st.session_state["embed_model"] = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

                with st.spinner("Processing PDF files..."): raw_text = get_pdf_text(st.session_state["pdf"])
                with st.spinner("Creating `LanceDB` Vector strores from texts..."):
                    _, exec_time = build_vector_store(raw_text)
                    st.session_state["eval_models"]["app_metrics"].exec_times["chunk_creation_time"] = exec_time
                    st.success("Done")

        if not st.session_state['api_key']: st.warning("Enter OpenAI API Key to proceed")
        elif not st.session_state["pdf"]: st.warning("Upload a PDf file")
        else:
            st.markdown("""#### Ask a Question from the PDF file""")
            user_question = st.text_input("", key="user_question")

            if user_question and st.session_state['api_key']:  # Ensure API key and user question are provided
                with st.spinner("Getting Response from LLM..."):
                    contexts_with_scores, response = user_input(user_question)

                st.warning("There are 5 major types metrics computed below having multiple sub metrics. Also, 2 abstract classes are defined `LLMasEvaluator` (to use any LLM as a judge) and `TraditionalPipelines` (for Topics, NER, POS etc)", icon="🤖")
                metric_calc = st.button("Load Models & Compute Evaluation Metrics")
                if metric_calc:
                    if len(st.session_state["eval_models"]) <= 1:
                        st.session_state["eval_models"].update({
                            "guards": IOGuards(),
                            "textstat": TextStat(),
                            "comparison": ComparisonMetrics(),
                            # "llm_eval": LLMasEvaluator(),
                            # "traditional_pipeline": TraditionalPipelines(),
                            })

                    with st.spinner("Calculating all the matrices. Please wait ...."):
                        eval_result = evaluate_all(user_question, [item.page_content for item in contexts_with_scores], response)
                        st.balloons()

                    # with st.expander("Click to see all the evaluation metrics"):
                        st.json(eval_result)

    if __name__ == "__main__":
        main()

![](__GHOST_URL__/content/images/2025/02/eval.png)
Star 🌟 LanceDB recipes to keep yourself updated -
[

GitHub - lancedb/vectordb-recipes: High quality resources & applications for LLMs, multi-modal models and VectorDBs

High quality resources &amp; applications for LLMs, multi-modal models and VectorDBs - GitHub - lancedb/vectordb-recipes: High quality resources &amp; applications for LLMs, multi-modal models and…

![](__GHOST_URL__/content/images/icon/pinned-octocat-093da3e6fa40-7.svg)GitHublancedb

![](__GHOST_URL__/content/images/thumbnail/vectordb-recipes-2)
](https://github.com/lancedb/vectordb-recipes/)
## Conclusion

Evaluating RAG applications involves a multifaceted approach, employing a blend of offline and online metrics to ensure effectiveness and quality. The integration of LanceDB as the vector database enhances the system's performance, providing efficient and scalable solutions for managing embeddings. By understanding and utilizing these evaluation metrics, developers can significantly improve the performance and reliability of their RAG applications.
