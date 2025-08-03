import Parser from 'rss-parser';
import feeds from './feeds.js';

const parser = new Parser();

export default async function scrapeFeeds() {
  const articles = [];
  
  for (const feed of feeds) {
    try {
      console.log(`📡 Scraping ${feed.tag} feed...`);
      const data = await parser.parseURL(feed.url);
      
      // Get recent articles (last 24 hours)
      const recentArticles = data.items
        .filter(item => {
          const pubDate = new Date(item.pubDate || item.isoDate);
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return pubDate > oneDayAgo;
        })
        .slice(0, 2); // Max 2 per feed
      
      recentArticles.forEach(item => {
        articles.push({
          title: item.title,
          link: item.link,
          content: item.contentSnippet || item.content || item.summary || '',
          tag: feed.tag,
          pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
          author: item.creator || item.author || 'Unknown'
        });
      });
      
    } catch (error) {
      console.error(`❌ Error parsing feed ${feed.url}:`, error.message);
    }
  }
  
  console.log(`📰 Found ${articles.length} recent articles`);
  return articles;
}