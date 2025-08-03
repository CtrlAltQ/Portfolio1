# CtrlAltQ Blog System

## Overview
This blog system is designed for automated blog post generation and management. It supports dynamic loading of posts and provides a clean, cyberpunk-themed interface.

## Structure
```
blog/
├── index.html              # Main blog page
├── post-template.html      # Template for individual posts
├── posts/
│   ├── manifest.json       # Post metadata and index
│   ├── [slug].json         # Individual post metadata
│   └── [slug].html         # Individual post pages
└── README.md               # This file
```

## For Automated Blog Generation

### 1. Post Manifest (`posts/manifest.json`)
The system looks for a manifest file containing all post metadata:

```json
{
  "posts": [
    {
      "slug": "post-url-slug",
      "title": "Post Title",
      "excerpt": "Brief description...",
      "category": "Personal|Literature|Tutorial|Career|Philosophy",
      "date": "2025-01-01",
      "tags": ["tag1", "tag2"],
      "author": "Jeremy (CtrlAltQ)",
      "status": "published|coming-soon|draft"
    }
  ],
  "categories": ["Personal", "Literature", "Tutorial", "Career", "Philosophy"],
  "tags": ["all", "available", "tags"]
}
```

### 2. Individual Post Files
Each post should have both a `.json` metadata file and an `.html` content file:

**`posts/my-post.json`:**
```json
{
  "slug": "my-post",
  "title": "My Awesome Post",
  "excerpt": "This post is about...",
  "category": "Tutorial",
  "date": "2025-01-01",
  "tags": ["javascript", "tutorial"],
  "content": "Full post content here...",
  "author": "Jeremy (CtrlAltQ)"
}
```

**`posts/my-post.html`:**
Uses the `post-template.html` with replaced placeholders:
- `{{POST_TITLE}}` - Post title
- `{{POST_EXCERPT}}` - Post excerpt  
- `{{POST_CATEGORY}}` - Post category
- `{{POST_DATE}}` - Formatted date
- `{{POST_CONTENT}}` - Full post content
- `{{POST_TAGS}}` - Rendered tag elements
- `{{READ_TIME}}` - Calculated read time

## Adding New Posts

### Manual Method
1. Create `posts/new-post.json` with metadata
2. Create `posts/new-post.html` using the template
3. Update `posts/manifest.json` to include the new post

### Automated Method
Your automation system should:
1. Generate post metadata in the correct JSON format
2. Create HTML files from the template
3. Update the manifest.json file
4. Ensure proper slug formatting (lowercase, hyphens for spaces)

## Categories
- **Personal**: Life experiences, career journey, personal stories
- **Literature**: Book reviews, author analysis, literary connections to coding
- **Tutorial**: Technical how-tos, coding tutorials, guides
- **Career**: Professional development, job search, industry insights
- **Philosophy**: Thoughts on coding, life, creativity, punk rock ethos

## Styling
The blog uses the same cyberpunk theme as the main portfolio:
- Dark background (#0a0a0f)
- Neon green accent (#00ff88) 
- Blue secondary (#0066ff)
- Pink tertiary (#ff0066)
- Holographic card effects
- Terminal-style headers
- Glitch text animations

## JavaScript Features
- Dynamic post loading from manifest
- Fallback post discovery if no manifest exists
- Read time calculation
- Category-based styling
- Responsive grid layout
- Pagination support (for future use)
- Mobile-friendly navigation

## SEO Considerations
- Each post page has proper meta tags
- Structured URLs (/blog/posts/slug.html)
- Open Graph tags can be added to template
- Sitemap generation recommended for automation

## Future Enhancements
- RSS feed generation
- Search functionality  
- Tag filtering
- Comment system integration
- Social sharing buttons
- Related posts suggestions