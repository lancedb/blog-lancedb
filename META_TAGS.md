# Head Partials - Meta Tags & SEO Documentation

## SEO Meta Tags (seo-meta-tags.html)

Generates the page `<title>` tag and standard meta description/keywords.

### Front Matter Parameters

```yaml
meta:
  title: "Custom Page Title"           # Optional: Overrides default page title
  description: "Page description..."   # Optional: Custom meta description
  keywords: "keyword1, keyword2"       # Optional: SEO keywords
```

### Fallback Behavior

- **Title**: `meta.title` → `.Title` (page title)
- **Description**: `meta.description` → `description` → `.Summary` (truncated to 160 chars)
- **Keywords**: Uses `meta.keywords` if specified, otherwise omitted

## Open Graph & Twitter Meta Tags (og-meta-tags.html)

Generates Open Graph tags for Facebook, LinkedIn, and Twitter Card tags for rich social media previews.

### Front Matter Parameters

```yaml
meta:
  og_title: "Social Media Title"         # Optional: Overrides page title for social
  og_description: "Social description"   # Optional: Social media description
  og_image: "/images/social-card.jpg"    # Optional: Custom OG image
  og_twitter_image: "/images/twitter.jpg" # Optional: Separate Twitter image

open_graph:
  type: "article"                        # Optional: Default is "website"

image: "/images/default.jpg"             # General image fallback
author: "Author Name"                    # Optional: Article author
```

### Fallback Behavior

- **OG Title**: `meta.og_title` → `.Title`
- **OG Description**: `meta.og_description` → `.Description` → `.Summary` (truncated to 160 chars)
- **OG Image**: `meta.og_image` → `.Params.image` → `site.Params.meta_image`
- **Twitter Image**: `meta.og_twitter_image` → `.Params.image` → `site.Params.meta_twitter_image` → First image in content
- **OG Type**: `open_graph.type` → "website"

### Social Media Specifications

- **OG Image**: 1200x630px, JPEG format
- **Twitter Card**: summary_large_image

## Usage Examples

### Basic Page

```yaml
---
title: "My Blog Post"
description: "A brief description of my blog post"
image: "/images/blog-post-hero.jpg"
---
```

### Advanced Page with Custom Meta

```yaml
---
title: "My Blog Post"
description: "A brief description of my blog post"

meta:
  title: "My Blog Post | Custom SEO Title"
  description: "A custom SEO-optimized description different from the page description"
  keywords: "hugo, seo, meta tags"
  og_title: "Catchy Social Media Title!"
  og_description: "Engaging description optimized for social sharing"
  og_image: "/images/custom-social-card.jpg"

open_graph:
  type: "article"

author: "John Doe"
---
```

### Site-Wide Defaults

Set default fallback images in `hugo.yaml`:

```yaml
params:
  meta_image: "/images/default-og-image.jpg"
  meta_twitter_image: "/images/default-twitter-card.jpg"
```

## Notes

- Published/modified times automatically use page `.Date` and `.Lastmod`
- Twitter automatically falls back to first content image if no twitter image specified
- All URLs are automatically converted to absolute URLs
- HTML in descriptions is automatically escaped with `safeHTML`
