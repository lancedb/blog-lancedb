---
title: "Multi-Lingual Search With Cohere and LanceDB"
date: 2023-12-03
author: LanceDB
categories: ["Engineering"]
draft: false
featured: false
image: /assets/blog/multi-lingual-search-with-cohere-and-lancedb-efaca566e30c/preview-image.png
meta_image: /assets/blog/multi-lingual-search-with-cohere-and-lancedb-efaca566e30c/preview-image.png
description: "by Kaushal Choudhary."
---

by Kaushal Choudhary

## Overview

[**Cohere**](https://txt.cohere.com/multilingual/)** **provides a Multi-Lingual Embedding model which promises to cross the language barriers in language models which were predominantly based on English. Their models support over 100 languages and can deliver [3X better performance](https://txt.cohere.com/multilingual/#benchmarks) than existing open-source models. We are going to use the cohere API to build, test and create a python app with this model on multilingual data, embedding and retrieving through LanceDB.

This model possesses the capability to comprehend and extract valuable insights from various languages, akin to their proficiency in English.

Cohere’s multilingual model excels in three key tasks:

1. [**Multilingual Semantic Search**](https://docs.cohere.com/docs/multilingual-semantic-search)**:** Elevating the standard of search outcomes, Cohere’s multilingual model swiftly generates precise results irrespective of the language used in the search query or the source content.
2. [**Aggregating Customer Feedback**](https://docs.cohere.com/docs/customer-feedback-aggregation)**:** Deploying Cohere’s multilingual model streamlines the organization of customer feedback across a multitude of languages, presenting a simplified solution for a significant challenge in international operations.
3. [**Cross-Lingual Zero-Shot Content Moderation**](https://docs.cohere.com/docs/cross-lingual-content-moderation)**:** Tackling the identification of harmful content in global online communities is a formidable task.

## Notebook Walk-through

Let’s jump straight to Code snippets.

> Follow along with this* *[**Colab**](https://colab.research.google.com/github/lancedb/vectordb-recipes/blob/main/examples/multi-lingual-wiki-qa/main.ipynb).

We will be using the Wikipedia dataset in English and French.

    from datasets import load_dataset

    en = dataset = load_dataset("wikipedia", "20220301.en", streaming=True,)
    fr = load_dataset("wikipedia", "20220301.fr", streaming=True)

    datasets = {"english": iter(en['train']), "french": iter(fr['train'])}

Looking at the dataset format

    next(iter(en['train']))

    {'id': '12',
     'url': 'https://en.wikipedia.org/wiki/Anarchism',
     'title': 'Anarchism',
     'text': 'Anarchism is a political philosophy and movement that is sceptical
    of authority and rejects all involuntary, coercive forms of hierarchy.
    Anarchism calls for the abolition of the state, which it holds to be
    unnecessary, undesirable, and harmful. As a historically left-wing movement,
    placed on the farthest left of the political spectrum, it is usually described
    alongside communalism and libertarian Marxism as the libertarian wing (
    libertarian socialism)...'}

    next(iter(fr['train']))

    {'id': '3',
     'url': 'https://fr.wikipedia.org/wiki/Antoine%20Meillet',
     'title': 'Antoine Meillet',
     'text': "Paul Jules Antoine Meillet, né le  à Moulins (Allier) et mort le  à
    Châteaumeillant (Cher), est le principal linguiste français des premières
    décennies du . Il est aussi philologue.\n\nBiographie \nD'origine bourbonnaise
    , fils d'un notaire de Châteaumeillant (Cher), Antoine Meillet fait ses études
    secondaires au lycée de Moulins.\n\nÉtudiant à la faculté des lettres de Paris
     à partir de 1885 où il suit notamment les cours de Louis Havet, il assiste
    également à ceux de Michel Bréal ..."}

## LanceDB Embeddings API

We use LanceDB’s embedding API for seamless data ingestion and vectorization, enabling efficient querying. This API automates the process of converting data into numerical vectors, crucial for tasks like similarity search.

LanceDB embedding API leverages Pydantic schema and ingests vectorizer’s information in the table. This basically allows you to perform implicit vectorisation of input types. This allows you to simply forget about the embedding function once set, make it disappear in the background.

[**documentation**](https://lancedb.github.io/lancedb/embeddings/)

***Cohere Example:***

Now, let’s create a embedding using the Cohere’s multilingual model as well.

> the LanceDB embedding API automatically vectorize queries, after ingesting embedding functions

    #call the cohere multilingual model from registry
    registry = EmbeddingFunctionRegistry().get_instance()
    cohere = registry.get("cohere").create() # uses multi-lingual model by default (768 dim)

    #create the schema for lancedb table
    class Schema(LanceModel):
        vector: Vector(cohere.ndims()) = cohere.VectorField()
        text: str = cohere.SourceField()
        url: str
        title: str
        id: str
        lang: str

    #connect to the db and create the table based on the defined schema
    db = lancedb.connect("~/lancedb")
    tbl_cohere = db.create_table("wikipedia-cohere", schema=Schema, mode="overwrite")

Let’s Ingest the Data.

    from tqdm.auto import tqdm
    import time
    # let's use cohere embeddings. Use can also set it to openai version of the table
    tbl = tbl_cohere
    batch_size = 1000
    num_records = 10000
    data = []

    for i in tqdm(range(0, num_records, batch_size)):

        for lang, dataset in datasets.items():

            batch = [next(dataset) for _ in range(batch_size)]

            texts = [x['text'] for x in batch]
            ids = [f"{x['id']}-{lang}" for x in batch]
            data.extend({
               'text': x['text'], 'title': x['title'], 'url': x['url'], 'lang': lang, 'id': f"{lang}-{x['id']}"
            } for x in batch)

        # add in batches to avoid token limit
        # 'text' will be automatically vectorized by LanceDB embedding API
        tbl.add(data)
        data = []
        time.sleep(20) # wait for 20 seconds to avoid rate limit

Searching the multi-lingual space

    it = iter(fr['train'])
    for i in range(5):
        next(it)
    query = next(it)
    query

Let’s take the first line from the embedded text

    L'Armée républicaine irlandaise (, IRA ; ) est le nom porté, depuis le début
    du , par plusieurs organisations paramilitaires luttant par les armes contre
    la présence britannique en Irlande du Nord.

this translates in English

    The Irish Republican Army (, IRA; ) is the name worn, since the beginning of
    the 19th century, by several paramilitary organizations fighting with arms
    against the British presence in Northern Ireland.

Let’s see if the results that are semantically closer to this in our dataset.

    db = lancedb.connect("~/lancedb")
    tbl = db.open_table("wikipedia-cohere") # We just open the existing
    rs = tbl.search(query["text"]).limit(3).to_list()

We can load the table even in a different session because LanceDB’s built in embedding function API has implementation/support for cohere embedding models out of the box. Using embedding API allows you to ingest the function itself so the table knows how to vectorize the inputs- making the embedding function disappear in the background.

    for r in rs:
        print(f" **TEXT id-{r['id']}** \n {r['text']} \n")

    **TEXT id-french-12**
     L'Armée républicaine irlandaise (, IRA ; ) est le nom porté, depuis le début du , par plusieurs organisations paramilitaires luttant par les armes contre la présence britannique en Irlande du Nord. Les différents groupes se référent à eux comme Óglaigh na hÉireann (« volontaires d'Irlande »).

     L' appelée aussi Old IRA, issue de l'union en 1916 entre l' (proche du Parti travailliste irlandais) et les Irish Volunteers (alors généralement proches de l'IRB), est active entre  et , pendant la guerre d'indépendance irlandaise. Si ceux qui ont accepté le traité anglo-irlandais forment les Forces de Défense irlandaises, une partie de l'organisation, refusant cet accord, se constitue en une nouvelle Irish Republican Army, illégale.
     L'Irish Republican Army anti-traité apparaît entre avril et  du fait du refus du traité anglo-irlandais par une partie de l'Old IRA. Elle participe ainsi à la guerre civile irlandaise de  à . Elle maintient son activité dans les deux Irlandes (État libre d'Irlande, indépendant, et Irlande du Nord, britannique), mais concentre son action sur les intérêts britanniques, surtout en Irlande du Nord. En 1969 l'organisation se divise, donnant naissance à lOfficial Irish Republican Army et à la Provisional Irish Republican Army, minoritaire, moins socialiste et plus activiste.
     LOfficial Irish Republican Army, proche de l'''Official Sinn Féin, plus socialiste et moins nationaliste que la Provisional Irish Republican Army, mène des campagnes d'attentats principalement entre 1969 et 1972 durant le conflit nord-irlandais, avant de décréter un cessez-le-feu.
     La Provisional Irish Republican Army, minoritaire après la scission de 1969 (d'où son nom de provisional, « provisoire ») devient rapidement grâce à son militantisme la principale organisation armée républicaine du conflit nord-irlandais. Le terme de provisional est d'ailleurs abandonné vers la fin des années 1970. Elle fut active de 1969 à 1997 (date du cessez-le-feu définitif), puis déposa définitivement les armes en 2005. Refusant le processus de paix, deux organisations scissionnèrent d'avec la PIRA : la Real Irish Republican Army et la Continuity Irish Republican Army.
     ...

     **TEXT id-english-14732**
     The Irish Republican Army (IRA; ) was an Irish republican revolutionary paramilitary organisation. The ancestor of many groups also known as the Irish Republican Army, and distinguished from them as the "Old IRA", it was descended from the Irish Volunteers, an organisation established on 25 November 1913 that staged the Easter Rising in April 1916. In 1919, the Irish Republic that had been proclaimed during the Easter Rising was formally established by an elected assembly (Dáil Éireann), and the Irish Volunteers were recognised by Dáil Éireann as its legitimate army. Thereafter, the IRA waged a guerrilla campaign against the British occupation of Ireland in the 1919–1921 Irish War of Independence.

    Following the signing in 1921 of the Anglo-Irish Treaty, which ended the War of Independence, a split occurred within the IRA. Members who supported the treaty formed the nucleus of the Irish National Army. However, the majority of the IRA was opposed to the treaty. The anti-treaty IRA fought a civil war against the Free State Army in 1922–23, with the intention of creating a fully independent all-Ireland republic. Having lost the civil war, this group remained in existence, with the intention of overthrowing the governments of both the Irish Free State and Northern Ireland and achieving the Irish Republic proclaimed in 1916.

    Origins

    The Irish Volunteers, founded in 1913, staged the Easter Rising, which aimed at ending British rule in Ireland, in 1916. Following the suppression of the Rising, thousands of Volunteers were imprisoned or interned, leading to the break-up of the organisation. It was reorganised in 1917 following the release of first the internees and then the prisoners. At the army convention held in Dublin in October 1917, Éamon de Valera was elected president, Michael Collins Director for Organisation and Cathal Brugha Chairman of the Resident Executive, which in effect made him Chief of Staff.

    Following the success of Sinn Féin in the general election of 1918 and the setting up of the First Dáil (the legislature of the Irish Republic), Volunteers commenced military action against the Royal Irish Constabulary (RIC), the paramilitary police force in Ireland, and subsequently against the British Army. It began with the Soloheadbeg Ambush, when members of the Third Tipperary Brigade led by Séumas Robinson, Seán Treacy, Dan Breen and Seán Hogan, seized a quantity of gelignite, killing two RIC constables in the process.

    The Dáil leadership worried that the Volunteers would not accept its authority, given that, under their own constitution, they were bound to obey their own executive and no other body. In August 1919, Brugha proposed to the Dáil that the Volunteers be asked to swear allegiance to the Dáil, but one commentator states that another year passed before the movement took an oath of allegiance to the Irish Republic and its government in "August 1920". In sharp contrast, a contemporary in the struggle for Irish independence notes that by late 1919, the term "Irish Republican Army (IRA)" was replacing "Volunteers" in everyday usage. This change is attributed to the Volunteers, having accepted the authority of the Dáil, being referred to as the "army of the Irish Republic", popularly known as the "Irish Republican Army".

    A power struggle continued between Brugha and Collins, both cabinet ministers, over who had the greater influence. Brugha was nominally the superior as Minister for Defence, but Collins's power base came from his position as Director of Organisation of the IRA and from his membership on the Supreme Council of the Irish Republican Brotherhood (IRB). De Valera resented Collins's clear power and influence, which he saw as coming more from the secretive IRB than from his position as a Teachta Dála (TD) and minister in the Aireacht. Brugha and de Valera both urged the IRA to undertake larger, more conventional military actions for the propaganda effect but were ignored by Collins and Mulcahy. Brugha at one stage proposed the assassination of the entire British cabinet. This was also discounted due to its presumed negative effect on British public opinion. Moreover, many members of the Dáil, notably Arthur Griffith, did not approve of IRA violence and would have preferred a campaign of passive resistance to the British rule. The Dáil belatedly accepted responsibility for IRA actions in April 1921, just three months before the end of the Irish War of Independence.

    ...

     **TEXT id-english-5859**
     The Continuity Irish Republican Army (Continuity IRA or CIRA), styling itself as the Irish Republican Army (), is an Irish republican paramilitary group that aims to bring about a united Ireland. It claims to be a direct continuation of the original Irish Republican Army and the national army of the Irish Republic that was proclaimed in 1916. It emerged from a split in the Provisional IRA in 1986 but did not become active until the Provisional IRA ceasefire of 1994. It is an illegal organization in the Republic of Ireland and is designated a terrorist organization in the United Kingdom, New Zealand and the United States. It has links with the political party Republican Sinn Féin (RSF).

    Since 1994, the CIRA has waged a campaign in Northern Ireland against the British Army and the Police Service of Northern Ireland (PSNI), formerly the Royal Ulster Constabulary. This is part of a wider campaign against the British security forces by dissident republican paramilitaries. It has targeted the security forces in gun attacks and bombings, as well as with grenades, mortars and rockets. The CIRA has also carried out bombings with the goal of causing economic harm and/or disruption, as well as many punishment attacks on alleged criminals.

    To date, it has been responsible for the death of one PSNI officer. The CIRA is smaller and less active than the Real IRA, and there have been a number of splits within the organisation since the mid-2000s.

    Origins
    The Continuity IRA has its origins in a split in the Provisional IRA. In September 1986, the Provisional IRA held a General Army Convention (GAC), the organisation's supreme decision-making body. It was the first GAC in 16 years. The meeting, which like all such meetings was secret, was convened to discuss among other resolutions, the articles of the Provisional IRA constitution which dealt with abstentionism, specifically its opposition to the taking of seats in Dáil Éireann (the parliament of the Republic of Ireland). The GAC passed motions (by the necessary two-thirds majority) allowing members of the Provisional IRA to discuss and debate the taking of parliamentary seats, and the removal of the ban on members of the organisation from supporting any successful republican candidate who took their seat in Dáil Éireann.

    The Provisional IRA convention delegates opposed to the change in the constitution claimed that the convention was gerrymandered "by the creation of new IRA organisational structures for the convention, including the combinations of Sligo-Roscommon-Longford and Wicklow-Wexford-Waterford." The only IRA body that supported this viewpoint was the outgoing IRA Executive. Those members of the outgoing Executive who opposed the change comprised a quorum. They met, dismissed those in favour of the change, and set up a new Executive. They contacted Tom Maguire, who was a commander in the old IRA and had supported the Provisionals against the Official IRA (see Irish republican legitimatism), and asked him for support. Maguire had also been contacted by supporters of Gerry Adams, then president of Sinn Féin, and a supporter of the change in the Provisional IRA constitution.

    Maguire rejected Adams' supporters, supported the IRA Executive members opposed to the change, and named the new organisers the Continuity Army Council. In a 1986 statement, he rejected "the legitimacy of an Army Council styling itself the Council of the Irish Republican Army which lends support to any person or organisation styling itself as Sinn Féin and prepared to enter the partition parliament of Leinster House." In 1987, Maguire described the "Continuity Executive" as the "lawful Executive of the Irish Republican Army."

    1986 establishments in Ireland ...

The closest match to the text itself is the text we used to search. The second closest match in an English text with a similar meaning referring to IRA.

You can get the [**Cohere** ](https://dashboard.cohere.com/welcome/login?redirect_uri=%2F)API key and get started with these models.

Visit our [**GitHub** ](https://github.com/lancedb)and if you wish to learn more about LanceDB python and Typescript library.
For more such applied GenAI and VectorDB applications, examples and tutorials visit [**VectorDB-Recipes.**](https://github.com/lancedb/vectordb-recipes/tree/main)** **Don’t forget to leave a star at the repo.

Lastly, for more information and updates, follow our** **[**LinkedIn**](https://www.linkedin.com/company/lancedb/) and [**Twitter.**](https://twitter.com/lancedb)
