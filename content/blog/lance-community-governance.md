---
title: "Building the Future Together: Introducing Lance Community Governance"
date: 2025-11-18
draft: false
featured: true
categories: ["Announcement"]
image: /assets/blog/lance-community-governance/preview-image.png
meta_image: /assets/blog/lance-community-governance/preview-image.png
description: "Announcing the formal governance structure for the Lance community, establishing clear pathways for contribution and leadership with a three-tier system of contributors, maintainers and PMC."
author: Jack Ye
author_avatar: "/assets/authors/jack-ye.jpg"
author_bio: "Software Engineer @ LanceDB"
author_github: "jackye1995"
author_linkedin: "https://www.linkedin.com/in/yezhaoqin"
---

Over the last three years, Lance has created a truly unique community where data infrastructure engineers and AI/ML engineers come together to make lakehouse architectures work in the AI era. Today, we’re excited to announce the formal governance structure for the Lance community to help it thrive, even further.

What started off as an idea to develop a better format for machine learning and AI has now become the fastest-growing open format with a vibrant community, spanning hundreds of contributors and dozens of companies. From top-level frontier model labs like RunwayML, Midjourney, Harvey.ai, and World Labs, to large enterprises building ML/AI applications like UBS, Netflix and Uber, to data infrastructure powerhouses like Databricks, AWS and ByteDance, Lance brings together diverse perspectives, united by a common goal: building the de facto standard format for multimodal AI.

As Lance continues to mature and its adoption accelerates, we believe it's time to establish clear pathways for community involvement and leadership that reflect our collaborative, inclusive values.

## A Community That Values All Contributions

One of the core principles of our governance is that **contributions may come in many forms, and all of them are valuable**. When we think about "contributions", we're not just talking about code. Bug reports, feature requests, documentation, design work, organizing meetups, giving talks, supporting users on Discord, and many other activities — all of these count as meaningful contributions to the Lance ecosystem.

To reflect this philosophy, we've established a three-tier governance structure:

- **Contributors**: Anyone who has made a contribution to Lance in any of the above-mentioned forms
- [**Maintainers**](https://lance.org/community/maintainers): Contributors who have made sustained and valuable contributions to the community
- [**Project Management Committee (PMC)**](https://lance.org/community/pmc): Maintainers who have demonstrated leadership and help guide the project's long-term direction

This structure resembles that of the projects in the [Apache Software Foundation](https://www.apache.org/), and what we described above is very much in line with [the Apache Way](https://www.apache.org/theapacheway/) and "Community over Code" spirit - which is not surprising if you check out the backgrounds of Lance maintainers and PMC members 😉. 

From that, we've actually gone a step further to **separate roles from permissions**. Maintainer status is a recognition of sustained, valuable contributions - not just code commits. Some maintainers are additionally granted write access to repositories (what's commonly known as "committers" in many other projects) - this is just an extra permission granted to help them better support the community's growth.

Similarly, other maintainers may be granted permissions to manage community spaces, handle trademarks, or oversee other aspects of the project. This separation ensures that we can recognize contributions of all types while distributing responsibilities based on individual strengths and interests. **You can advance through the governance tiers without writing a single line of code** - whether through community support, documentation, advocacy, or any other valuable contribution.

This isn't just a new principle for us - our [Lancelot program](https://github.com/lancedb/lancedb/wiki?ref=blog.lancedb.com) has been operating on this inclusive philosophy for over two years, recognizing contributions beyond code. That experience made it straightforward to identify our initial maintainers and PMC members, as we already had a track record of celebrating diverse contributions to the community.

## Consensus-Driven Decision Making

With this governance structure, we've formally defined our [voting process](https://lance.org/community/voting) for important matters including releases, changes to the maintainers and PMC, and future modifications to Lance’s governance. Any PMC member can veto a proposal, which requires consensus gathering to move the proposal forward - ensuring that no single entity can unilaterally make critical decisions.

We've heard from people in the community asking whether we plan to donate Lance to a foundation, often driven by concerns about potential license changes. With this governance model, **such a unilateral license change simply cannot happen** - any PMC member from any company can block it.

As for whether Lance should join a foundation, and which one - that's now a question the Lance community can thoughtfully consider, together. There are great examples like [Substrait](https://github.com/substrait-io/substrait), which has no foundation affiliation but maintains excellent community governance, and there are also projects within foundations that still have strong control by a single commercial entity. At the end of the day, it's the community and its *governance* that matter most, not an affiliation to a foundation. We're in no rush, and we'll let the community guide this decision, if and when the time comes.

## Empower Contributors in the AI Era

The AI and ML space moves fast, and our development infrastructure is designed to keep pace. The Lance community values **automation and rapid iteration** as first-class principles, both for releasing software and for making contributions.

Our [release process](https://lance.org/community/release) minimizes human intervention through GitHub Actions automation that handles version bumping, changelog generation, and artifact publishing. Maintainers can publish or preview beta releases at any time for early testing, while stable releases follow a streamlined voting process with clear timelines — as short as same-day approval for critical patches, 3 days for minor versions, and 1 week for major versions. This allows us to ship improvements quickly while maintaining quality through community verification and PMC oversight.

We're also embracing AI-assisted development by making our [contribution process](https://lance.org/community/contributing) AI-friendly. From code agent integrations (check out our `AGENTS.md` files) to AI-driven automations in our GitHub workflows, we're continuously working to lower friction for contributors. In a field where new frameworks and techniques emerge constantly, being able to contribute and release rapidly is crucial. Whether you're using AI coding assistants or contributing traditionally, we want the Lance codebase to be accessible and easy to work with.

## Fast Track for New Initiatives

Similar to how we learned from the Apache Software Foundation for designing our community governance hierarchy, we also consulted foundations like the [Cloud Native Computing Foundation](https://www.cncf.io/) for managing project portfolios. We've created a pathway for rapid experimentation and innovation through our [subproject structure](https://lance.org/community#subprojects). We recognize that as core projects mature and become more complex, it can become harder for newcomers to make their first meaningful contributions. At the same time, the AI/ML ecosystem is moving fast, with new integrations and use cases emerging constantly.

Our **subproject** model addresses this by providing a lower barrier to entry for new initiatives. Contributors can quickly start new subprojects with relaxed contribution requirements and the ability to move fast. For example, [lance-graph](https://github.com/lance-format/lance-graph) was started by Uber and is now drawing developers from companies like LinkedIn, while the [Lance data viewer](https://github.com/lance-format/lance-data-viewer) was started by an individual developer and is being extended for enterprise use cases based on community feedback. Subprojects can even grant write access to contributors who may not yet be maintainers, enabling rapid iteration.

When a subproject demonstrates maturity through proper CI/CD, testing standards, automated releases, production adoption, and sustained community contributions, it can graduate to become a core project through a PMC vote. Importantly, **graduation doesn't diminish the contributions of subproject contributors** - their work remains recognized regardless of the project's tier.

This dual-track approach maintains a healthy balance:

- Core projects like `lance` maintain high quality bars, ensuring that contributors who dive deep into complex format specifications, performance optimizations, and foundational innovations receive the recognition their challenging work deserves
- Subprojects provide accessible entry points and rapid experimentation grounds where new contributors can make immediate impacts

We believe this structure keeps Lance vibrant and accessible while protecting the depth and rigor needed in our core components. Whether you're building a new integration or optimizing the core formats, there's a place for your contributions.

## What About LanceDB?

You might wonder how this governance change impacts the LanceDB open source project. The short answer: it doesn't, at least not yet.

Architecturally, we want Lance to remain a pure format specification with its core SDK and engine connectors. LanceDB is a full lakehouse implementation on top of the Lance format to deliver an end-to-end AI-Native Multimodal Lakehouse. Similar to how Apache Iceberg and Apache Polaris are separate projects, or how Delta Lake and Unity Catalog maintain distinct boundaries, this separation between Lance and LanceDB makes sense from a technical perspective.

To make this distinction clear, we've created dedicated infrastructure for each project:

- Lance now has its own website ([lance.org](https://lance.org/)), GitHub organization ([lance-format](https://github.com/lance-format)), and even a Discord server [Lance Format](https://discord.gg/lance)
- LanceDB will still maintain its own website separately ([lancedb.com](https://lancedb.com/)), GitHub organization ([lancedb](https://github.com/lancedb)), and Discord server [LanceDB](https://discord.gg/zMM32dvNtd), catering to LanceDB's user community.

As for LanceDB's community development, we're taking it one step at a time. Right now, the LanceDB community is still growing, with by far the most contributions coming from LanceDB Inc. (the company). As the project matures and attracts more diverse contributors, the governance work we've done for Lance provides a clear pathway for how we can evolve LanceDB's community structure in the future.

## Grateful for Our Community

We want to express our deep appreciation for everyone who has contributed to getting Lance to this point. There are countless community members who have filed issues, answered questions, built integrations, adopted Lance in their projects, spread the word, and contributed in so many other ways. Every contribution matters, and we're grateful for all of them.

The [maintainers](https://lance.org/community/maintainers) and [PMC members](https://lance.org/community/pmc) you see in our governance documentation have each earned their positions through sustained, meaningful contributions - whether through code, community building, documentation, advocacy, or technical leadership. These are not ceremonial titles - each person listed has made real, valuable contributions that have shaped Lance into what it is today.

**What this governance structure provides is a formal pathway for recognition and leadership.** If you've been contributing to Lance but aren't yet on these lists, this framework now gives you a clear path forward. Whether you want to become a maintainer, join the PMC, or start a new subproject, there are now transparent guidelines and processes to help you take on a leadership role and receive formal recognition for your work.

## Get Involved

We're excited about this next chapter for Lance. If you're interested in getting more involved, here's how:

- Visit the new Lance documentation website at [lance.org](https://lance.org/)
- Join our new [Lance Format Discord server](https://discord.gg/lance) for day-to-day discussions
- Read the [Community Governance documentation](https://lance.org/community) to understand the structure and how to get involved
- Subscribe to the [community event calendar](https://calendar.google.com/calendar/u/0?cid=Y29tbXVuaXR5QGxhbmNlLm9yZw) to join upcoming meetups and discussions
- All Lance-related projects have been moved to the [lance-format GitHub organization](https://github.com/lance-format) — remember to update your bookmarks, and don't forget to give us a star!
- Start contributing today in whatever way fits your skills and interests

The future of Lance is community-driven, and we can't wait to see where we go together. Whether you're contributing code, documentation, designs, advocacy, or supporting the community in some way, you're helping build the de facto standard format for multimodal AI.

Thank you for being part of the Lance community!
