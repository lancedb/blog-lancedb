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

### Key Commands

- `hugo serve` - Start development server
- `hugo serve --port 1314` - Use different port if 1313 is busy
- `hugo --minify` - Build optimized production site


### Content Guidelines

- **Blog Posts**: Add to `content/blog/` with proper frontmatter
- **Documentation**: Add to `content/docs/` following existing structure
- **Images**: Place in `static/assets/` with descriptive names
- **Styling**: Use SCSS in `assets/scss/` following BEM methodology

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

- **Content improvements** - Better documentation, tutorials, blog posts
- **Design enhancements** - UI/UX improvements, responsive fixes
- **Performance optimizations** - Faster loading, better SEO
- **Accessibility improvements** - Better screen reader support, keyboard navigation
- **Bug fixes** - Broken links, layout issues, functionality problems

### Content Guidelines

- **Write clearly** - Use simple, direct language
- **Include examples** - Code snippets and practical demonstrations
- **Add images** - Screenshots, diagrams, and visual aids
- **Test thoroughly** - Verify links, check responsive design
- **Follow existing patterns** - Match the current style and structure

### Getting Help

- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Ask questions in GitHub Discussions
- **Documentation**: Check existing docs in `content/docs/`
- **Community**: Join our [Discord](https://discord.gg/lancedb) or [Slack](https://lancedb.slack.com)

### Code of Conduct

We're committed to providing a welcoming and inclusive environment. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

**Thank you for contributing to LanceDB!** 🚀



