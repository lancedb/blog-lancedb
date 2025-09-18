---
title: "Developers, Ditch the Black Box: Welcome to Continue"
slug: lancedb-x-continue
date_published: 2024-05-23T14:50:56.000Z
date_updated: 2024-12-12T01:10:47.000Z
tags: Case Study, Blog
---

Remember flipping through coding manuals? Those quickly became relics with the rise of Google and Stack Overflow, a one-stop shop for developer queries. Now, the tides are turning again as LLMs are rapidly becoming the primary source for coding assistance.

Existing closed-source API-based LLM developer tools are frustratingly opaque. We copy-paste from ChatGPT, which does not disclose its sources or thought process. Copilot throws out suggestions, but on what basis? Meanwhile, as we use these tools, we contribute valuable code and implicit feedback that trains their LLMs. Yet, this data remains private.

Surely, there needs to be a better way. Developers deserve **transparency, hackability, and control**. We need to understand the "why" behind LLM suggestions, have the freedom to tinker, and own the data that fuels these powerful models and their outputs.

That's where **Continue** steps in. A new generation of LLM developer tools puts control back in the hands of developers.

## Continue: A modular AI software development system

The basic use-case of continue is that it removes the need of repetitive copy/pasting from ChatGPT or similar services. Instead, you can simply highlight the context and ask questions in the sidebar or have an edit streamed directly to your editor. 

Continue is available as** open-source **[**VSCode**](https://marketplace.visualstudio.com/items?itemName=Continue.continue)** and **[**JetBrains**](https://plugins.jetbrains.com/plugin/22707-continue-extension)** extensions. **
![](__GHOST_URL__/content/images/2024/05/Screenshot-2024-05-22-at-4.26.28-PM.png)
Continue also provides powerful tools for managing context. For example, you can type ‘`@issue`’ to quickly reference a GitHub issue as you are prompting the LLM, ‘`@README.md`’ to reference such a file, or ‘`@google`’ to include the results of a Google search.

Continue works with any LLM, including local models using ggml or open-source models hosted on your own cloud infrastructure, allowing you to remain 100% private if security is a concern.
![](__GHOST_URL__/content/images/2024/05/Screenshot-2024-05-12-at-3.09.33-PM.png)
It automatically gathers information about how you code. This includes things like the steps you take and the choices you make. This data is stored locally on your machine (in a folder called "`.continue/dev_data`").

By combining this data with the code you commit, Continue can actually improve the Large Language Model (LLM) used by your team. This means the AI coding assistant everyone uses will get smarter and more helpful over time, based on your contributions!

#  Continue 
 ❤️ 
 LanceDB 
![](__GHOST_URL__/content/images/2024/05/Screenshot-2024-05-12-at-3.18.44-PM.png)
As Continue offers local-first IDE extensions, most of the codebase is written in Typescript, and the data is stored locally in the `~/.continue` folder. The tooling choices are made such that there are no separate processes required to handle database operations.  It uses SQLite as a transactional database because there are libraries with great Typescript support, it is embedded, and is stored gracefully as a single file. Continue's codebase retrieval features are powered by LanceDB, as it is the only vectorDB with an embedded Typescript library that is capable of fast lookup times while being stored on disk and also supports SQL-like filtering.

## Further customizations

Continue offers a ton of room for further customization. You can write your own:

- Slash commands (e.g., ‘`/commit`’ to write a summary and commit message for staged changes; ‘`/docs`’ to grab the contents of a file and update documentation pages that depend on it; ‘`/ticket`’ to generate a full-featured ticket with relevant files and high-level instructions from a short description)
- Context sources (e.g., GitHub issues, Jira, local files, StackOverflow, documentation pages)
- Templated system message (e.g., “Always give maximally concise answers. Adhere to the following style guide whenever writing code: `{{ /Users/nate/repo/styleguide.md }}`”
- Tools (e.g., add a file, run unit tests, build, and watch for errors)

Learn more about using Continue
[

Overview | Continue

Continue can be deeply customized

![](https://docs.continue.dev/img/favicon.ico)Continue

![](https://docs.continue.dev/img/continue-social-card.png)
](https://docs.continue.dev/customization/overview)
