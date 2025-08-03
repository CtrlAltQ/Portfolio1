import axios from 'axios';

export default async function sendTweet(post) {
  // Twitter API integration would go here
  // For now, we'll just log what would be tweeted
  
  if (!post) {
    console.log('⏭️  No post to tweet about');
    return;
  }

  try {
    // Construct tweet content
    const tweetContent = createTweetContent(post);
    
    console.log('🐦 Would tweet:');
    console.log('─'.repeat(50));
    console.log(tweetContent);
    console.log('─'.repeat(50));
    
    // TODO: Implement actual Twitter API call when credentials are available
    // const tweet = await postToTwitter(tweetContent);
    
    console.log(`✅ Tweet prepared for: ${post.title}`);
    return { success: true, content: tweetContent };
    
  } catch (error) {
    console.error('❌ Failed to prepare tweet:', error.message);
    return { success: false, error: error.message };
  }
}

function createTweetContent(post) {
  const maxLength = 280;
  const link = `https://jeremyclegg.dev/blog/posts/${post.slug}.html`; // Update with actual domain
  const linkLength = 23; // Twitter's t.co link length
  const availableLength = maxLength - linkLength - 10; // Buffer for hashtags
  
  // Create base tweet
  let tweet = `🚀 New blog post: ${post.title}`;
  
  // Add excerpt if there's room
  if (tweet.length < availableLength - 20) {
    const excerpt = post.excerpt.length > 50 
      ? post.excerpt.substring(0, 50) + '...' 
      : post.excerpt;
    tweet += `\n\n${excerpt}`;
  }
  
  // Add relevant hashtags based on category
  const hashtags = getHashtagsForCategory(post.category, post.tags);
  tweet += `\n\n${hashtags}`;
  
  // Add link
  tweet += `\n\n${link}`;
  
  return tweet;
}

function getHashtagsForCategory(category, tags = []) {
  const categoryHashtags = {
    'Tutorial': ['#WebDev', '#Tutorial', '#Coding'],
    'Career': ['#TechCareer', '#Developer', '#Growth'],
    'Personal': ['#TechLife', '#Developer', '#Journey'],
    'Philosophy': ['#TechPhilosophy', '#Developer', '#Thoughts'],
    'Literature': ['#Books', '#Reading', '#TechLife']
  };
  
  let hashtags = categoryHashtags[category] || ['#Tech', '#Developer'];
  
  // Add specific tag hashtags if they're common ones
  const tagHashtags = {
    'ai': '#AI',
    'ml': '#MachineLearning',
    'javascript': '#JavaScript',
    'webdev': '#WebDev',
    'github': '#GitHub',
    'career': '#TechCareer'
  };
  
  tags.forEach(tag => {
    if (tagHashtags[tag] && !hashtags.includes(tagHashtags[tag])) {
      hashtags.push(tagHashtags[tag]);
    }
  });
  
  // Limit to 3 hashtags to avoid spam appearance
  return hashtags.slice(0, 3).join(' ');
}

// Function to actually post to Twitter (requires API credentials)
async function postToTwitter(content) {
  // This would require Twitter API v2 credentials
  // Implementation would go here when ready
  
  if (!process.env.TWITTER_BEARER_TOKEN) {
    throw new Error('Twitter API credentials not configured');
  }
  
  // Example implementation:
  /*
  const response = await axios.post('https://api.twitter.com/2/tweets', {
    text: content
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.data;
  */
  
  throw new Error('Twitter API integration not yet implemented');
}