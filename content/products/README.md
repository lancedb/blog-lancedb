# LanceDB Product Page Section Types Documentation

This documentation describes all available section types that can be used in LanceDB product pages front matter.

## Template Structure

Each section type corresponds to a template file in the `/partials/sections` folder. The `type` value in your front matter directly maps to the template filename:

```
type: hero-product  →  /partials/sections/hero-product.html
type: features-grid →  /partials/sections/features-grid.html
```

This naming convention makes it easy to locate and maintain the HTML templates for each section type.

## Section Categories

1. Hero Sections
   - `hero-product`: Primary hero with media
   - `hero-text`: Text-only hero

2. Content Sections
   - `features-grid`: Feature highlights in grid/columns
   - `code-product`: Code demonstrations
   - `video`: Video content
   - `image-section`: Full-width images
   - `how-it-works-product`: Step-by-step workflows

3. Social Proof
   - `testimonial`: Single testimonial
   - `testimonial-list`: Multiple testimonials
   - `logos`: Logo showcase

4. Product Information
   - `deploy`: Deployment options
   - `traine`: Training and integration options

5. Navigation & CTAs
   - `related-content`: Related articles/docs
   - `cta-product`: Call-to-action

## Common Optional Properties

All sections can include these optional properties:
- `bg_color`: Background color ("dark" or "dark-700")
- `no_padding_top`: Boolean to remove top padding

## Available Section Types

All sections can include these optional properties:
- `bg_color`: Background color ("dark" or "dark-700")
- `no_padding_top`: Boolean to remove top padding

*Note:For hero by default it use page .Title and .Description*

### 1. `hero-product`
Primary hero section for product pages.

**Properties:**
- `title` (optional): Main section title
- `description` (optional): Section description
- `cta`: Array of call-to-action buttons
  - `text`: Button text
  - `icon`: Boolean to show/hide icon
  - `href`: Button URL
  - `version`: Button style ("primary" or "secondary")
- `media`: Path to main image/SVG
- `media_mob` (optional): Path to mobile-specific image

Example:
```yaml
type: hero-product
bg_color: "dark-700"  # optional
no_padding_top: true  # optional
title: "Optional Title"
description: "Optional Description"
cta:
  - text: "Get Started"
    icon: true
    href: "https://accounts.lancedb.com/sign-up"
    version: "primary"
  - text: "Talk to Sales"
    icon: true
    href: "/contact"
    version: "secondary"
media: "vectors/hero-image.svg"
media_mob: "vectors/hero-image-mobile.svg"
```

### 2. `features-grid`
Grid or column layout for feature highlights.

**Properties:**
- `style`: Layout style ("columns" or "grid")
- `title`: Section title
- `description` (optional): Section description
- `items`: Array of feature items
  - `icon`: Feature icon path
  - `title`: Feature title
  - `text`: Feature description
  - `cta`: Optional call-to-action
    - `text`: Link text
    - `icon`: Boolean to show/hide icon
    - `href`: Link URL
    - `version`: Link style

Example:
```yaml
type: features-grid
bg_color: "dark-700"  # optional
no_padding_top: true  # optional
style: "columns"
title: "Built for Complex Retrieval"
items:
  - icon: "icons/feature.svg"
    title: "Feature Title"
    text: "Feature Description"
    cta:
      text: "Learn More"
      icon: true
      href: "/docs"
      version: "link"
```

### 3. `how-it-works-product`
Step-by-step product workflow section.

**Properties:**
- `bg_color`: Background color
- `title`: Section title
- `description` (optional): Section description
- `items`: Array of steps
  - `icon`: Step icon path
  - `title`: Step title
  - `text`: Step description

Example:
```yaml
type: how-it-works-product
bg_color: "dark-700"
title: "How It Works"
items:
  - icon: "icons/step1.svg"
    title: "Step Title"
    text: "Step Description"
```

### 4. `traine`
Product deployment and integration options.

**Properties:**
- `title`: Section title
- `description`: Section description
- `items`: Array of deployment options
  - `title`: Option title
  - `icon`: Option icon path
  - `text`: Option description
  - `content`: Content configuration
    - `type`: Content type ("logos" or "list")
    - `logos`: Array of logo paths (for logos type)
    - `title`: List title (for list type)
    - `list`: Array of list items (for list type)
  - `cta`: Call-to-action configuration

Example:
```yaml
type: traine
title: "Train Anywhere"
description: "Description"
items:
  - title: "Option Title"
    icon: "icons/option.svg"
    text: "Option Description"
    content:
      type: "logos"
      logos: ["logo1.svg", "logo2.svg"]
    cta:
      text: "Learn More"
      icon: true
      href: "/docs"
      version: "link"
```

### 5. `related-content`
Related articles and documentation section.

**Properties:**
- `bg_color`: Background color
- `title`: Section title
- `no_padding_top`: Boolean to remove top padding
- `posts`: Array of related content
  - `path`: Content path
  - `title` (optional): Custom title
  - `image` (optional): Custom image path
  - `cta_text` (optional): Custom CTA text

Example:
```yaml
type: related-content
bg_color: "dark"
title: "Related Content"
no_padding_top: true
posts:
  - path: "/blog/post"
  - path: "/docs/guide"
    title: "Custom Title"
    image: "/images/custom.jpg"
    cta_text: "Read More"
```

### 6. `testimonial`
Customer testimonial section.

**Properties:**
- `title`: Section title
- `text`: Testimonial quote
- `name`: Person's name
- `position`: Job title
- `logo`: Company logo path

Example:
```yaml
type: testimonial
title: "Customer Testimonial"
text: "Testimonial quote"
name: "John Doe"
position: "CTO"
logo: "/logos/company.svg"
```

### 7. `logos`
Logo showcase section. If no logos are specified, it will use the default logos from the homepage.

**Properties:**
- `speed`: Animation speed in milliseconds
- `text`: Section text
- `logos` (optional): Array of logo paths. If not provided, uses homepage logos.

Example:
```yaml
type: logos
bg_color: "dark"  # optional
no_padding_top: true  # optional
speed: 5000
text: "Our Partners"
# logos property is optional - will use homepage logos by default
logos: ["logo1.svg", "logo2.svg"]  # only if you want custom logos
```

### 2. `hero-text`
Text-only hero section.

**Properties:**
- `title` (optional): Main section title
- `description` (optional): Section description
- `cta`: Array of call-to-action buttons
  - `text`: Button text
  - `icon`: Boolean
  - `href`: Button URL
  - `version`: "primary" or "secondary"

Example:
```yaml
type: hero-text
title: "Optional Title"
description: "Optional Description"
cta:
  - text: "Get Started"
    icon: true
    href: "/signup"
    version: "primary"
```

### 9. `code-product`
Code demonstration section.

**Properties:**
- `bg_color`: Background color
- `title`: Section title
- `content`: Array of content items
  - `heading`: Content heading
  - `text`: Content description
- `code`:
  - `language`: Programming language
  - `source`: Path to source code file

Example:
```yaml
type: code-product
bg_color: "dark-700"
title: "Introducing LLM-as-UDF"
content:
  - heading: "Custom Transformations at Scale"
    text: "Description"
code:
  language: "python"
  source: "static/code-tabs/example.py"
```

### 10. `video`
Video section with optional CTA.

**Properties:**
- `bg_color`: Background color
- `title` (optional): Section title
- `description` (optional): Section description
- `video_id`: YouTube video ID
- `cta` (optional): Call-to-action button

Example:
```yaml
type: video
bg_color: "dark"
title: "Scale Without Limits"
video_id: "VIDEO_ID"
cta:
  text: "Try the Demo"
  icon: true
  href: "/signup"
  version: "primary"
```

### 11. `deploy`
Deployment options section.

**Properties:**
- `bg_color`: Background color
- `title`: Section title
- `description`: Section description
- `items`: Array of deployment options
  - `icon`: Option icon path
  - `title`: Option title
  - `text`: Description
  - `cta`: Call-to-action configuration

Example:
```yaml
type: deploy
bg_color: "dark-700"
title: "Deploy Anywhere"
description: "Deploy description"
items:
  - icon: "icons/option.svg"
    title: "Option Title"
    text: "Description"
    cta:
      text: "Learn More"
      icon: true
      href: "/docs"
      version: "primary"
```

### 12. `image-section`
Full-width image section.

**Properties:**
- `src`: Image/SVG path
- `src_mob` (optional): Mobile-specific image path

Example:
```yaml
type: image-section
src: "static/assets/vectors/image.svg"
src_mob: "static/assets/vectors/image-mobile.svg"
```

### 13. `testimonial-list`
Multiple testimonials section.

**Properties:**
- `title`: Section title
- `description` (optional): Section description
- `items`: Array of testimonials
  - `text`: Testimonial quote
  - `name`: Person's name
  - `position`: Job title
  - `logo`: Company logo path

Example:
```yaml
type: testimonial-list
title: "Why Top AI Companies Trust Lance"
items:
  - text: "Testimonial quote"
    name: "John Doe"
    position: "CTO"
    logo: "/logos/company.svg"
```

### 14. `cta-product`
Call-to-action section.

**Properties:**
- `no_padding_top` (optional): Boolean
- `title`: CTA title
- `cta`: Call-to-action configuration
  - `text`: Button text
  - `icon`: Boolean to show/hide icon
  - `href`: Button URL
  - `version`: Button style

Example:
```yaml
type: cta-product
title: "Ready to Get Started?"
cta:
  text: "Contact Us"
  icon: true
  href: "/contact"
  version: "primary"
```
