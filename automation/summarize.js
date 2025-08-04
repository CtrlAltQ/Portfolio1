import fs from 'fs';
import path from 'path';
import axios from 'axios';

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

function getCategoryFromTag(tag) {
  const categoryMap = {
    'ai': 'Tutorial',
    'ml': 'Tutorial', 
    'dev': 'Tutorial',
    'github': 'Career',
    'javascript': 'Tutorial',
    'webdev': 'Tutorial',
    'career': 'Career',
    'personal': 'Personal'
  };
  return categoryMap[tag] || 'Tutorial';
}

function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(' ').length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export default async function generatePost(article) {
  const slug = createSlug(article.title);
  const category = getCategoryFromTag(article.tag);
  const today = new Date().toISOString().split('T')[0];
  
  // Enhanced prompt for CtrlAltQ's voice
  const prompt = `Write a blog post in the voice of Jeremy (CtrlAltQ), a former chef turned developer who loves punk rock and has a cyberpunk aesthetic. 

Article to cover:
Title: ${article.title}
Link: ${article.link}
Content: ${article.content}

Write this with:
- A punk rock/cyberpunk attitude but stay professional
- Connect technical concepts to cooking/chef experience when relevant
- Use clear, engaging language
- Include practical takeaways
- Keep it authentic to someone who went from StarCraft clan leader → chef → developer
- End with a call to action

Structure: Hook, key insights, practical application, conclusion.
Length: 400-600 words.`;

  try {
    console.log(`✍️  Generating post for: ${article.title}`);
    
    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = res.data.choices[0].message.content;
    
    // Generate excerpt (first paragraph or 150 chars)
    const excerpt = content.split('\n\n')[0].substring(0, 150) + '...';
    
    // Create post metadata JSON
    const postData = {
      slug,
      title: article.title,
      excerpt,
      category,
      date: today,
      tags: [article.tag, 'automated', 'tech-insights'],
      author: "Jeremy (CtrlAltQ)",
      source: article.link,
      content,
      readTime: calculateReadTime(content)
    };

    // Create HTML content from template
    const templatePath = path.join(process.cwd(), '..', 'blog', 'post-template.html');
    const template = fs.readFileSync(templatePath, 'utf8');
    
    const htmlContent = template
      .replace(/{{POST_TITLE}}/g, article.title)
      .replace(/{{POST_EXCERPT}}/g, excerpt)
      .replace(/{{POST_CATEGORY}}/g, category)
      .replace(/{{POST_DATE}}/g, new Date(today).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }))
      .replace(/{{READ_TIME}}/g, calculateReadTime(content))
      .replace(/{{POST_CONTENT}}/g, `
        <div class="prose prose-invert prose-lg max-w-none">
          ${content.split('\n\n').map(p => `<p class="mb-6 leading-relaxed">${p}</p>`).join('')}
          
          <div class="mt-12 p-6 bg-gray-800 rounded-lg border border-accent/20">
            <p class="text-sm text-gray-400 mb-2">
              <i class="fas fa-link mr-2"></i>
              Original article: <a href="${article.link}" target="_blank" class="text-accent hover:text-white">${article.title}</a>
            </p>
            <p class="text-sm text-gray-400">
              🤖 This post was crafted by <strong>AltQ</strong>, my automated blog system.<br>
              Want a site powered by automation like this? <a href="../../index.html#contact" class="text-accent hover:text-white">Let's build yours →</a>
            </p>
          </div>
        </div>
      `)
      .replace(/{{POST_TAGS}}/g, postData.tags.map(tag => 
        `<span class="px-3 py-1 bg-gray-800 text-gray-400 text-sm rounded-full border border-gray-700">${tag}</span>`
      ).join(' '));

    // Save files
    const postsDir = path.join(process.cwd(), '..', 'blog', 'posts');
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    // Save JSON metadata
    fs.writeFileSync(path.join(postsDir, `${slug}.json`), JSON.stringify(postData, null, 2));
    
    // Save HTML post
    fs.writeFileSync(path.join(postsDir, `${slug}.html`), htmlContent);
    
    // Update manifest
    updateManifest(postData);
    
    console.log(`✅ Generated post: ${slug}`);
    return postData;
    
  } catch (error) {
    console.error('❌ Failed to generate post:', error.message);
    return null;
  }
}

function updateManifest(newPost) {
  const manifestPath = path.join(process.cwd(), '..', 'blog', 'posts', 'manifest.json');
  let manifest = { posts: [], categories: [], tags: [] };
  
  // Load existing manifest if it exists
  if (fs.existsSync(manifestPath)) {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  }
  
  // Add new post to beginning (newest first)
  manifest.posts.unshift(newPost);
  
  // Update categories and tags
  const allCategories = [...new Set(manifest.posts.map(p => p.category))];
  const allTags = [...new Set(manifest.posts.flatMap(p => p.tags))];
  
  manifest.categories = allCategories;
  manifest.tags = allTags;
  
  // Keep only last 50 posts to avoid huge manifest
  manifest.posts = manifest.posts.slice(0, 50);
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}