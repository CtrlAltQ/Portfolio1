# AltQ Blog Automation System

🤖 Automated blog generation system for the CtrlAltQ portfolio. This system scrapes RSS feeds, generates blog posts using AI, and can automatically commit to git and tweet about new content.

## Features

- 📡 **RSS Feed Scraping**: Monitors tech feeds for interesting articles
- ✍️ **AI Content Generation**: Creates blog posts in Jeremy's voice using OpenRouter
- 📝 **JSON/HTML Output**: Generates structured blog posts for the portfolio
- 🔄 **Git Integration**: Automatically commits and pushes new posts
- 🐦 **Twitter Integration**: Can tweet about new posts (when configured)
- 🎨 **Cyberpunk Theme**: Maintains the portfolio's aesthetic

## Setup

1. **Install Dependencies**
   ```bash
   cd automation
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Required Environment Variables**
   - `OPENROUTER_API_KEY`: Your OpenRouter API key for AI generation

4. **Optional Environment Variables**
   - `TWITTER_BEARER_TOKEN`: For auto-tweeting (feature not yet implemented)

## Usage

### Basic Usage
Generate blog posts only:
```bash
npm start
# or
node index.js
```

### With Git Auto-Commit
Generate posts and automatically commit to git:
```bash
node index.js --push
```

### Full Automation
Generate, commit, and tweet:
```bash
node index.js --push --tweet
```

### Help
```bash
node index.js --help
```

## How It Works

1. **Feed Scraping** (`scrape.js`): Monitors RSS feeds for articles published in the last 24 hours
2. **Content Generation** (`summarize.js`): Uses AI to create blog posts in Jeremy's voice
3. **File Generation**: Creates both JSON metadata and HTML pages
4. **Git Integration** (`push.js`): Optionally commits and pushes changes
5. **Social Media** (`tweet.js`): Optionally tweets about new posts

## Output Structure

Generated files:
```
blog/posts/
├── {slug}.html          # Individual blog post page
├── {slug}.json          # Post metadata
└── manifest.json        # Updated blog index
```

## RSS Feeds Monitored

- **AI**: VentureBeat AI feed
- **Dev**: Hacker News frontpage
- **GitHub**: GitHub blog
- **ML**: MarkTechPost
- **JavaScript**: JavaScript Weekly
- **WebDev**: CSS-Tricks

## Customization

### Adding New Feeds
Edit `feeds.js` to add new RSS sources:
```javascript
export default [
  { tag: 'your-tag', url: 'https://example.com/feed.xml' }
];
```

### Modifying AI Voice
Update the prompt in `summarize.js` to change the writing style or tone.

### Custom Categories
Edit the `getCategoryFromTag()` function in `summarize.js` to customize post categorization.

## Troubleshooting

### Common Issues

1. **"OPENROUTER_API_KEY not found"**
   - Make sure your `.env` file exists and contains the API key
   - Check that the `.env` file is in the `automation/` directory

2. **Git push fails**
   - Ensure you have a git remote configured
   - Check that you have push permissions to the repository

3. **No articles found**
   - This is normal if no new articles were published in the last 24 hours
   - You can modify the time filter in `scrape.js` for testing

4. **AI generation fails**
   - Check your OpenRouter API key and account balance
   - Verify the API endpoint is accessible

### Manual Testing

Test individual components:
```bash
# Test feed scraping
node -e "import('./scrape.js').then(m => m.default().then(console.log))"

# Test AI generation (requires valid article data)
node -e "import('./summarize.js').then(m => m.default({title:'Test', content:'Test content', tag:'dev', link:'https://example.com'}).then(console.log))"
```

## Development

### File Structure
- `index.js`: Main automation orchestrator
- `scrape.js`: RSS feed scraping logic
- `summarize.js`: AI content generation
- `push.js`: Git integration
- `tweet.js`: Twitter integration
- `feeds.js`: RSS feed configuration

### Adding Features
The system is modular. Each step can be run independently or modified without affecting others.

## Security Notes

- Never commit API keys to git
- Use environment variables for all secrets
- The `.env` file is gitignored by default

## License

MIT License - see main portfolio LICENSE file.