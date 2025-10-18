# How to Add a Demo Page

## Steps

1. Create a new `.md` file in `content/docs/demos/`
   - Example: `content/docs/demos/my-demo.md`

2. Add the required front matter at the top:

```yaml
---
title: Your Demo Title
sidebar_title: Sidebar Display Name
description: Short one-line description of the demo
thumb: /assets/docs/demos/your-image.png
features:
  - First key feature of this demo
  - Second key feature
  - Third key feature
tags:
  - tag1
  - tag2
  - tag3
  - lancedb
live_app: "https://your-demo-url.com"
---
```

## Front Matter Fields

- **title**: Main title displayed on the page
- **sidebar_title**: Shorter title for sidebar navigation
- **description**: Brief description for SEO and previews
- **thumb**: Path to thumbnail image (store in `/assets/docs/demos/`)
- **features**: List of 3-5 key features (bullet points)
- **tags**: Relevant tags for filtering and categorization
- **live_app**: URL to live demo (use `"#"` if no live app)

## Example

See `content/docs/demos/copilot.md` or `content/docs/demos/wikipedia.md` for complete examples.

## After Creating

3. Add your thumbnail image to `/assets/docs/demos/`
4. Write your content below the front matter using Markdown
