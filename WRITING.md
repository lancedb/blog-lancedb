# Writing for LanceDB.com/blog

## Before you Write

Please put together a Google Doc with the blog draft and share it with your peers for review.
Then, after all the feedback is finalized - continue on with publishing.

## Publishing in Hugo

To write a blog post, you have to create its Markdown file in one location and then reference images in a separate static folder.

It may appear clumsy at first, but the entire publication process becomes super easy, particularly when fixing issues and collaborating with others on code and technical content.


## Step 1: Create the Markdown file

Go to `content/blog/`. Create a new file with a short, SEO-friendly name, such as `multimodal-lakehouse.md`.

## Step 2: Create the blog subdirectory

Go to `static/assets/blog`. Create a new folder with the same name, such as `static/assets/blog/multimodal-lakehouse/`.

## Step 3: Copy this front matter template

Go back to your main Markdown file and copy this on top.

```markdown
---
title: "What is the LanceDB Multimodal Lakehouse?"
date: 2025-06-23
draft: false 
featured: true 
categories: ["Engineering"]
image: /assets/blog/multimodal-lakehouse/preview-image.png
description: "Introducing the Multimodal Lakehouse - a unified platform for managing AI data from raw files to production-ready features, now part of LanceDB Enterprise."
author: David Myriel
author_avatar: "/assets/authors/david-myriel.jpg"
author_bio: "Writer."
author_github: "davidmyriel"
author_linkedin: "davidmyriel"
---

Your blog content starts here...
```

### Front matter specification

Here is an explanation of common configuration for the front matter:

| Field | Description | Notes |
|-------|-------------|-------|
| `title` | Blog post title | Make it short and SEO friendly |
| `date` | Publication date | Can't be a future date or the blog won't show |
| `featured` | Featured post status | `true` for big announcements on top, `false` for regular updates |
| `categories` | Post category | Check Reference section below |
| `image` | Preview image path | Points to `static/assets/blog/filename/` folder |
| `description` | SEO description | Can't be too long or it won't show properly |
| `author` | Author name | Add picture to `static/assets/authors/` |

Save everything. You should be able to run Hugo and see the empty blog post on the blog site.

### Featured Posts Logic

You can mark posts as **featured** to display them at the top of the blog.

#### How to set a post as featured

Add the `featured` field to the post front matter:

```yaml
featured: true

```
#### Sorting Rules:
 - By default, featured posts are sorted by date (newest first).
 - To control the order, set a weight value. 

 ```yaml
   featured: true
   weight: 10
 ```
 *Weight Rules:*
 - Weight must be a non-zero integer.
 - Lower weight = higher priority (appears first).
 - Posts without weight (or with 0) are placed after all weighted posts, sorted by date.

 *Exemple:* 
 - A post with weight: 1 will appear first.
 - Multiple posts with weights are sorted ascending by weight.
 - Unweighted posts follow, sorted by date.

 *Limit:*
 If there are more than 3 featured posts:
 - Only the top 3 (after sorting) appear in the featured block.
 - Additional featured posts are shown with the regular posts.


## Step 4: Add Your Images

Add your preview image as `preview-image.png` (recommended: 1200x630px). Then, add any other images your post needs to this folder.

Reference them in your post as: `![Alt text](/assets/blog/your-blog-post-title/image-name.png)`

## Step 5: Write Your Content

Write your blog post in Markdown. Between 750 and 1000 words is optimal.

Highly technical content should go under `/docs/`. If you are writing a blog post, then you shouldn't be exposing entire tutorials with long code blocks.

A code block in a blog post should serve to preview a feature or explain simple concepts. End-to-end instructions are for documentation.

Use these common elements:
   - **Headers**: `## Section Title`
   - **Code blocks**: ```python`your code here```
   - **Callouts**: `{{< admonition >}}Important note{{< /admonition >}}`
   - **Links**: `[Link text](https://url.com)`
   - **Images**: `![Alt text](/path/to/image.png)`

## Step 5: Publish

1. **Test locally** (optional):
   ```bash
   hugo server
   ```
   Visit `http://localhost:1313` to preview

2. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add blog post: Your Post Title"
   git push
   ```

3. **Deploy**: Vercel automatically deploys when you push to main branch

## Reference

### Categories
- `"Engineering"` - Technical deep dives
- `"Case Study"` - Customer success stories  
- `"Announcement"` - Product updates

### Author Setup
1. Add your photo to `static/assets/authors/your-name.jpg`
2. Fill out author fields in frontmatter
3. Include social media handles

### Image Guidelines
- **Preview image**: 1200x630px, PNG format
- **File size**: Keep under 500KB
- **Alt text**: Always include descriptive alt text

### Writing notes and warnings

Use admonitions for warnings and notes:

```markdown
{{< admonition >}}Important note{{< /admonition >}}
```

### Writing a single code block

This will render as a simple code block with a Python tab:

```markdown
{{< code language="python" >}}print("Hello"){{< /code >}}
```

### Writing three code tabs

This will make three tabs next to each other:

```markdown
{{< code language="python" >}}print("Hello"){{< /code >}}
{{< code language="typescript" >}}print("Hello"){{< /code >}}
{{< code language="rust" >}}print("Hello"){{< /code >}}
```

That's it! Your blog post will be live at `https://lancedb.com/blog/your-blog-post-title/` once deployed. 