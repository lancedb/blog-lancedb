# App Gallery Guide

The App Gallery pulls its content from `data/app_gallery/apps.yaml`. Each entry in that file renders a card on `/docs/demos/` and a matching link in the left sidebar.

## Add a New Demo

1. **Create or identify the detail page**
   - Prefer re-using existing blog posts in `content/blog/` so the card links straight to long-form content.
   - If you need a new post, add it under `content/blog/<slug>.md` with standard blog front matter (`title`, `description`, `image`, etc.).

2. **Add an entry to `data/app_gallery/apps.yaml`**
   ```yaml
   - key: my-demo
     title: "My Demo Title"          # optional — falls back to the linked page title
     detail_page: "blog/my-demo"     # path relative to `content/`
     description: "One-line teaser"  # optional — falls back to linked page description
     thumb: "/assets/demos/my.png"  # optional — falls back to linked page image/meta_image
     features:
       - Short bullets that appear under the card
       - Aim for 2–4 callouts
     tags:
       - search
       - production
     live_app: "https://example.com" # optional
   ```

3. **Sync assets (optional)**
   - Store thumbnails in `static/assets/demos/` or reference an existing image path.
   - When you skip `thumb`, the gallery will try `image` → `meta_image` from the linked page.

4. **Run `hugo` locally** to verify the card, sidebar link, and Live App button render correctly.

## Editing or Removing Demos
- Update the relevant entry in `data/app_gallery/apps.yaml` to change copy, links, or features.
- Remove the entry to drop a card (the sidebar updates automatically).

## Tips
- Keep `key` unique; it's used to differentiate entries during future automation.
- Tags are optional but power the in-page filter chips.
- Use full URLs for `live_app` so the "Live App" button opens in a new tab.
