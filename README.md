# LanceDB Homepage, Blog & Documentation

![LanceDB Hero](static/assets/hero.jpg)

## Overview

This repository contains the complete LanceDB web presence, featuring three integrated sites:

1. **Marketing Website** - Main homepage and product information
2. **Documentation Site** - Comprehensive guides, tutorials, and API reference
3. **Blog** - Technical articles, case studies, and updates

## Quickstart

### Prerequisites

- [Hugo Static Site Generator](https://gohugo.io/installation/) 

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lancedb/blog-lancedb.git
   cd website
   ```

2. **Start development server**
   ```bash
   hugo serve
   ```

3. **Build for production**
   ```bash
   hugo --minify
   ```

## Development

### Project Structure

```
├── content/           # Content files (markdown)
│   ├── blog/         # Blog posts
│   ├── docs/         # Documentation
│   └── _index.md     # Homepage content
├── layouts/          # Hugo templates
├── assets/           # CSS, JS, and other assets
├── static/           # Static files (images, etc.)
└── hugo.yaml         # Hugo configuration
```
## Deployment

The site is automatically deployed via:

- **Production**: Vercel (main branch)
- **Preview**: Vercel (pull requests)

## Contributing

We welcome contributions to improve the LanceDB website! Here's how you can help:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test locally**
   ```bash
   hugo serve
   ```
5. **Commit and push**
   ```bash
   git commit -m "Add your feature description"
   git push origin feature/your-feature-name
   ```
6. **Create a pull request**

### What We're Looking For

| Category | Description |
|----------|-------------|
| **Content improvements** | Better documentation, tutorials, blog posts |
| **Design enhancements** | UI/UX improvements, responsive fixes |
| **Performance optimizations** | Faster loading, better SEO |
| **Accessibility improvements** | Better screen reader support, keyboard navigation |
| **Bug fixes** | Broken links, layout issues, functionality problems |

**Thank you for contributing to LanceDB!** 🚀



