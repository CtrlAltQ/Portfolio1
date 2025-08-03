#!/usr/bin/env node

import scrapeFeeds from './scrape.js';
import generatePost from './summarize.js';
import pushToGit, { checkGitStatus, createBlogBranch } from './push.js';
import sendTweet from './tweet.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function runBlogAutomation() {
  console.log('🤖 Starting AltQ Blog Automation System');
  console.log('═'.repeat(50));
  
  try {
    // Check if we have required environment variables
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('❌ OPENROUTER_API_KEY not found in environment variables');
      console.log('💡 Create a .env file with: OPENROUTER_API_KEY=your_key_here');
      process.exit(1);
    }
    
    // Step 1: Scrape RSS feeds for new articles
    console.log('📡 Step 1: Scraping RSS feeds...');
    const articles = await scrapeFeeds();
    
    if (articles.length === 0) {
      console.log('ℹ️  No new articles found. Exiting.');
      return;
    }
    
    console.log(`📰 Found ${articles.length} articles to process`);
    
    // Step 2: Generate blog posts from articles
    console.log('\n✍️  Step 2: Generating blog posts...');
    const newPosts = [];
    
    for (const article of articles) {
      try {
        const post = await generatePost(article);
        if (post) {
          newPosts.push(post);
          console.log(`   ✅ Generated: ${post.title}`);
        }
      } catch (error) {
        console.error(`   ❌ Failed to generate post for: ${article.title}`);
        console.error(`   Error: ${error.message}`);
      }
    }
    
    if (newPosts.length === 0) {
      console.log('⚠️  No posts were generated successfully. Exiting.');
      return;
    }
    
    console.log(`\n🎉 Successfully generated ${newPosts.length} blog post${newPosts.length > 1 ? 's' : ''}`);
    
    // Step 3: Commit and push to Git (optional)
    if (process.argv.includes('--push') || process.argv.includes('-p')) {
      console.log('\n📤 Step 3: Pushing to Git...');
      try {
        await pushToGit(newPosts);
      } catch (error) {
        console.error('❌ Git push failed:', error.message);
      }
    } else {
      console.log('\n⏭️  Step 3: Skipping Git push (use --push to enable)');
      checkGitStatus();
    }
    
    // Step 4: Tweet about new posts (optional)
    if (process.argv.includes('--tweet') || process.argv.includes('-t')) {
      console.log('\n🐦 Step 4: Tweeting about new posts...');
      for (const post of newPosts) {
        try {
          await sendTweet(post);
        } catch (error) {
          console.error(`❌ Tweet failed for ${post.title}:`, error.message);
        }
      }
    } else {
      console.log('\n⏭️  Step 4: Skipping tweets (use --tweet to enable)');
    }
    
    // Summary
    console.log('\n🎊 Blog Automation Complete!');
    console.log('═'.repeat(50));
    console.log(`📝 Generated: ${newPosts.length} post${newPosts.length > 1 ? 's' : ''}`);
    console.log(`📂 Location: blog/posts/`);
    console.log('💡 Run with --push to auto-commit to git');
    console.log('💡 Run with --tweet to auto-tweet new posts');
    
    return newPosts;
    
  } catch (error) {
    console.error('\n💥 Blog automation failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// CLI interface
function showHelp() {
  console.log(`
🤖 AltQ Blog Automation System

Usage: node automation/index.js [options]

Options:
  --push, -p     Automatically commit and push to git
  --tweet, -t    Automatically tweet about new posts  
  --help, -h     Show this help message

Examples:
  node automation/index.js                    # Generate posts only
  node automation/index.js --push             # Generate and commit to git
  node automation/index.js --push --tweet     # Full automation

Environment Variables Required:
  OPENROUTER_API_KEY    Your OpenRouter API key for AI generation

Optional Environment Variables:
  TWITTER_BEARER_TOKEN  For auto-tweeting (not yet implemented)

Files Created:
  blog/posts/{slug}.html      Individual blog post pages
  blog/posts/{slug}.json      Post metadata
  blog/posts/manifest.json    Blog index with all posts
  `);
}

// Handle CLI arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  showHelp();
  process.exit(0);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runBlogAutomation();
}

export default runBlogAutomation;