---
title: RAG with GRPO Fine-Tuned Reasoning Model
date: 2025-03-24
draft: false
featured: false
image: /assets/posts/1.png
description: Explore rag with grpo fine-tuned reasoning model with practical insights and expert guidance from the LanceDB team.
author: Mahesh Deshwal
---
💡

This is a community post by Mahesh Deshwal

**Group Relative Policy Optimization** is the series of RL techniques for LLMs to guide them to specific goals. The process of creating a smart model these days is something like this:

1. Pre Training a model on a HUGE corpus to get a pre-trained model
2. Use the model created above on your data (usually Instructions or Que-Ans format) to fine-tune in an SFT (Supervised fine-tuning) manner.

Now let's say a question can be answered in 100 different ways by the above model, all of them are correct. For example, the answer can be one word, sarcastic, politically incorrect, harmful, etc. If you have to **GUIDE** the model to a specific set of rules for generation, you use the RL (Reinforcement Learning), where the popular techniques are PPO and DPO, and with DeepSeek, there comes GRPO.

### How does it work, roughly?

While using PPO or DPO, you don't have a ground truth label for the data. You generate more than 1 answer to a question. You then use a dedicated model (generally an LLM) that scores the answers and then based on the scores, you choose which answer is good. So it is basically selecting and rejecting similar answers based on some criteria.
![](__GHOST_URL__/content/images/2025/03/image_fx_.jpg)
But in GRPO, there is no Critique or Scorer. What they do is simply decide multiple rules (python functions) to give scores to each answer. Then generate `G` responses to a question, calculate all the scores, and convert them to one single weighted score which is the `Normalized Z score`. Then given if an answer's score is more or less than that Z score, they accept or reject. Let's understand each and every component of the GRPO equation with intuition and line-by-line code.

### Components of GRPO
![](__GHOST_URL__/content/images/2025/03/Screenshot-2025-03-06-at-1.30.07-AM--1--1.png)
Code snippets below are referred from [HuggingFace `GRPOTrainer`](https://github.com/huggingface/trl/blob/main/trl/trainer/grpo_trainer.py)

- Overall Objective (𝒥GRPO(θ)): This is the GRPO Loss function we need to improve our model. Each components of this loss are defined below.
    

- Question Sampling (q ∼ P(Q)): A question (AKA PROMPT) is randomly chosen from a pool of questions. This represents the problem or prompt that the model needs to answer.
    

- Group of Outputs ({oi} with G outputs): For each question, we generate several answers (G in total, GRPOTrainer uses 8 by default) using the model from the previous training step. These outputs are like multiple attempts at answering the same question. This is the Crux of the equation because we don't have a Ground truth so we rate THESE answers based on some pre defined function and compute the score for EACH of the Answer and then see if an answer is above or below Average score of group
      
- `self.sampling_params = SamplingParams(n=args.num_generations)`

- Reference Policy (πref): This is the model that we fine-tuned using SFT. It serves as a base to ensure that the model’s updates do start giving weird answers.
      
- `self.ref_model = AutoModelForCausalLM.from_pretrained(model_id, **model_init_kwargs)`

- Current Policy (πθ): This is the model we are actively training and updating. During output generation, we compare how the current policy behaves relative to the old policy "LOGIT by LOGIT"Loss is computed Logit vise
      
- `model = AutoModelForCausalLM.from_pretrained(model, **model_init_kwargs)`

- Old Policy (πθ_old): Same model as above BUT this is the version of from the previous epoch. It also has "G" answers to the Prompts but for the "PREVIOUS" epoch
    

- Token Advantage (ĤAi,t): This term represents the normalized reward (or advantage) associated with "EACH TOKEN". It indicates how much better or worse the generation related to Z score. One thing is that score is Given for final Generation BUT it is replicated as same for EACH Logit in the answer
      
- `advantages = (rewards - mean_grouped_rewards) / (std_grouped_rewards + 1e-4)`

- Clipping Range (1 – ε to 1 + ε): The ratio between the current and old policies is clipped within this range to prevent large, unstable updates. This ensures that each update is moderate and controlled.
      
- `torch.clamp(coef_1, 1 - self.epsilon, 1 + self.epsilon)`

- Scaling Factor (β): This factor scales the penalty from the KL divergence. It controls how strongly the model is regularized.
      
- `per_token_loss = per_token_loss + self.beta * per_token_kl`

- KL Divergence Penalty (𝔻KL[πθ || πref]): This term measures the difference between the current policy and the reference policy. By penalizing large differences, it helps keep the updated model close to the original fine-tuned model, ensuring that improvements are made without losing previously learned skills. It is also implemented **PER TOKEN**
- `per_token_kl = (torch.exp(ref_per_token_logps - per_token_logps) - (ref_per_token_logps - per_token_logps) - 1)
`

### Now let's fine tune some model on GRPO for Token Diversity and Length Constraints

You can use any model and tool of your choice but we'll use `PEFT: LoRA` using `HuggingFace TRL` to do it all on 1 GPU on Colab

    !pip install -qqq unsloth vllm --progress-bar off
    
    import torch
    import re
    from datasets import load_dataset, Dataset
    from trl import GRPOConfig, GRPOTrainer
    import torch
    from datasets import load_dataset
    from peft import LoraConfig, get_peft_model
    from transformers import AutoModelForCausalLM, AutoTokenizer
    
    
    max_seq_length = 512 # Can increase for longer reasoning traces
    lora_rank = 8 # Larger rank = smarter, but slower
    
    # Load model
    model_id = "HuggingFaceTB/SmolLM-135M-Instruct" # VERY Small model
    model = AutoModelForCausalLM.from_pretrained(
        model_id,
        torch_dtype="auto",
        device_map="auto",
    )
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    
    # Load LoRA
    lora_config = LoraConfig(
        task_type="CAUSAL_LM",
        r=8,
        lora_alpha=32,
        target_modules="all-linear",
    )
    model = get_peft_model(model, lora_config)
    print(model.print_trainable_parameters())
    
    
    # Load dataset
    dataset = load_dataset("mlabonne/smoltldr")
    print(dataset)
    

#### Reward Functions

Let's define some Reward functions. These will be applied to Each and Every generation and then used as weighted sum (default to 1 for each) to get advantage. You an use ANY reward function based on your choice but I'm just writing generic ones here

    def reward_len(completions, **kwargs):
        "Function to give rewards based on Length of the Answer"
        return [-abs(50 - len(completion)) for completion in completions]
    
    def reward_token_diversity(completions, **kwargs):
        "Rewards completions with a higher ratio of unique tokens"
        rewards = []
        for completion in completions:
            tokens = completion.split()
            if tokens:
                diversity = len(set(tokens)) / len(tokens)
                rewards.append(diversity * 100)  # scaling factor for reward
            else:
                rewards.append(0)
        return rewards

Now just off to training the model as usual with very few modifications

    max_prompt_length = 512
    
    
    training_args = GRPOConfig(
        learning_rate = 5e-6,
        adam_beta1 = 0.9,
        adam_beta2 = 0.99,
        weight_decay = 0.1,
        warmup_ratio = 0.1,
        lr_scheduler_type = "cosine",
        optim = "paged_adamw_8bit",
        logging_steps = 1,
        per_device_train_batch_size = 6,
        gradient_accumulation_steps = 1, # Increase to 4 for smoother training
        num_generations = 6, # Decrease if out of memory
        max_prompt_length = max_prompt_length,
        max_completion_length = 128,
        # num_train_epochs = 1, # Set to 1 for a full training run
        max_steps = 250,
        save_steps = 250,
        max_grad_norm = 0.1,
        report_to = "none", # Can use Weights & Biases
        output_dir = "outputs",
    )
    
    
    trainer = GRPOTrainer(
        model = model,
        processing_class = tokenizer,
        reward_funcs = [
            reward_len, reward_token_diversity,
        ],
        args = training_args,
        train_dataset=dataset["train"],
    )
    
    trainer.train()

### Model Inference

    from transformers import pipeline
    
    prompt = """
    # About the GOAT:
    
    Lionel Andrés "Leo" Messi[note 1] (Spanish pronunciation: [ljoˈnel anˈdɾes ˈmesi] ⓘ; born 24 June 1987) is an Argentine professional footballer who plays as a forward for and captains both Major League Soccer club Inter Miami and the Argentina national team. Widely regarded as the greatest player of all time, Messi set numerous records for individual accolades won throughout his professional footballing career such as eight Ballon d'Or awards and four the Best FIFA Men's Player awards.[note 2] He is the most decorated player in the history of professional football having won 45 team trophies,[note 3] including twelve league titles, four UEFA Champions Leagues, two Copa Américas, and one FIFA World Cup. Messi holds the records for most European Golden Shoes (6), most goals in a calendar year (91), most goals for a single club (672, with Barcelona), most goals (474), hat-tricks (36) and assists (192) in La Liga, most assists (18) and goal contributions (32) in the Copa América, most goal contributions (21) in the World Cup, most international appearances (191) and international goals (112) by a South American male, and the second-most in the latter category outright. A prolific goalscorer and creative playmaker, Messi has scored over 850 senior career goals and has provided over 380 assists for club and country.[16]
    
    Born in Rosario, Argentina, Messi relocated to Spain to join Barcelona at age 13, and made his competitive debut at age 17 in October 2004. He gradually established himself as an integral player for the club, and during his first uninterrupted season at age 22 in 2008–09 he helped Barcelona achieve the first treble in Spanish football. This resulted in Messi winning the first of four consecutive Ballons d'Or, and by the 2011–12 season he would set La Liga and European records for most goals in a season and establish himself as Barcelona's all-time top scorer. The following two seasons, he finished second for the Ballon d'Or behind Cristiano Ronaldo, his perceived career rival. However, he regained his best form during the 2014–15 campaign, where he became the all-time top scorer in La Liga, led Barcelona to a historic second treble, and won a fifth Ballon d'Or in 2015. He assumed Barcelona's captaincy in 2018 and won a record sixth Ballon d'Or in 2019. During his overall tenure at Barcelona, Messi won a club-record 34 trophies, including ten La Liga titles and four Champions Leagues, among others. Financial difficulties at Barcelona led to Messi signing with French club Paris Saint-Germain in August 2021, where he would win the Ligue 1 title during both of his seasons there. He joined Major League Soccer club Inter Miami in July 2023.
    
    An Argentine international, Messi is the national team's all-time leading goalscorer and most-capped player. His style of play as a diminutive, left-footed dribbler drew career-long comparisons with compatriot Diego Maradona, who described Messi as his successor. At the youth level, he won the 2005 FIFA World Youth Championship and gold medal in the 2008 Summer Olympics. After his senior debut in 2005, Messi became the youngest Argentine to play and score in a World Cup in 2006. Assuming captaincy in 2011, he then led Argentina to three consecutive finals in the 2014 FIFA World Cup, the 2015 Copa América and the Copa América Centenario, all of which they would lose. After initially announcing his international retirement in 2016, he returned to help his country narrowly qualify for the 2018 FIFA World Cup, which they would exit early. Messi and the national team finally broke Argentina's 28-year trophy drought by winning the 2021 Copa América, which helped him secure his seventh Ballon d'Or that year. He then led Argentina to win the 2022 Finalissima, as well as the 2022 FIFA World Cup, his country's third overall world championship and first in 36 years. This followed with a record-extending eighth Ballon d'Or in 2023, and a victory in the 2024 Copa América.
    """
    
    messages = [
        {"role": "user", "content": prompt},
    ]
    
    
    merged_model = trainer.model.merge_and_unload()
    generator = pipeline("text-generation", model= merged_model, tokenizer=tokenizer)
    
    
    generated_text = generator(messages)
    
    print(generated_text)

### Using the model as a RAG with LanceDB

Smooth as a 🍰 🚶.

Let's take a look at some interesting use cases. You are a screenplay writer and you have an idea about a movie but don't want the cliche scenario. Maybe you don't care about Older movies so you fetch the movies from the last 30 years or so using `PREFILTER`. Given we had lexical diversity AND length based rewards in GRPO, we're now not only creative in words but always to the point too. So let's test our ideas of "what not to write about" as:

    !pip install lancedb sentence-transformers -qqq
    
    import pandas as pd
    from sentence_transformers import SentenceTransformer
    import lancedb
    from lancedb.pydantic import LanceModel, Vector
    from lancedb.embeddings import get_registry
    import torch
    
    
    df = pd.read_csv("hf://datasets/vishnupriyavr/wiki-movie-plots-with-summaries/wiki_movie_plots_deduped_with_summaries.csv").sample(10)
    df.rename(columns = {"Release Year": "release_year", "Title": "title", "Plot": "movie_plot"},  inplace = True)
    df = df.loc[:, ["release_year", "title", "movie_plot"]]
    
    
    db = lancedb.connect("/tmp/db")
    model = get_registry().get("sentence-transformers").create(name="BAAI/bge-small-en-v1.5", device="cuda" if torch.cuda.is_available() else "cpu")
    
    class TableSchema(LanceModel):
        movie_plot: str = model.SourceField()
        vector: Vector(model.ndims()) = model.VectorField()
        title: str
        release_year: int
    
    table = db.create_table("movie_plots", schema=TableSchema)
    table.add(data=df)
    
    query = "What's common in movies where the protagonist turns out to be the bad guy"
    context = "\n\n".join([f"## Movie- {i+1}:\n{item['movie_plot']}" for i,item in enumerate(table.search(query).where(f"release_year < {1990}").limit(5).to_list())])
    
    # NOW you pass this Query + Context to the model and get to the point results
    
    messages = [
        {"role": "user", "content": f"Given the Query: {query}\n\nAnd the context\n#Context{context}\n\nAnswer concisely but creatively"}
        ]
    
    
    generated_text = generator(messages)
    
    print(generated_text)
    
    

Would really love to know what your result was for this query with your fine-tuned model 😄
