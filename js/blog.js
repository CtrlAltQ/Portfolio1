// Blog Management System for CtrlAltQ Portfolio
class BlogManager {
  constructor() {
    this.posts = [];
    this.container = document.getElementById('blog-posts-container');
    this.noPostsDiv = document.getElementById('no-posts');
    this.postsPerPage = 9;
    this.currentPage = 1;
    this.init();
  }

  async init() {
    await this.loadPosts();
    this.renderPosts();
  }

  // Load blog posts from posts directory
  async loadPosts() {
    try {
      // Try to load posts manifest (for automated blog generation)
      const response = await fetch('./posts/manifest.json');
      if (response.ok) {
        const manifest = await response.json();
        this.posts = manifest.posts || [];
      } else {
        // Fallback: try to load individual posts
        this.posts = await this.discoverPosts();
      }
    } catch (error) {
      console.log('No posts manifest found, checking for individual posts...');
      this.posts = await this.discoverPosts();
    }
  }

  // Discover posts by trying common filenames
  async discoverPosts() {
    const potentialPosts = [
      'chef-to-developer-journey',
      'vonnegut-developer-author',
      'bukowski-code-failures',
      'cyberpunk-ui-css',
      'starcraft-to-code',
      'punk-rock-programming'
    ];

    const discoveredPosts = [];

    for (const slug of potentialPosts) {
      try {
        const response = await fetch(`./posts/${slug}.json`);
        if (response.ok) {
          const post = await response.json();
          discoveredPosts.push(post);
        }
      } catch (error) {
        // Post doesn't exist, continue
      }
    }

    return discoveredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Render blog posts
  renderPosts() {
    if (!this.container) return;

    if (this.posts.length === 0) {
      this.showNoPosts();
      return;
    }

    this.hideNoPosts();
    this.container.innerHTML = '';

    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    const postsToShow = this.posts.slice(startIndex, endIndex);

    postsToShow.forEach(post => {
      const postElement = this.createPostCard(post);
      this.container.appendChild(postElement);
    });

    // Add pagination if needed
    if (this.posts.length > this.postsPerPage) {
      this.renderPagination();
    }
  }

  // Create individual post card
  createPostCard(post) {
    const card = document.createElement('article');
    card.className = 'holo-card rounded-lg overflow-hidden transition-all duration-300 hover:transform hover:scale-105';
    
    const categoryColor = this.getCategoryColor(post.category);
    const readTime = this.calculateReadTime(post.content || post.excerpt || '');
    
    card.innerHTML = `
      <div class="h-48 bg-gradient-to-br ${categoryColor} relative overflow-hidden">
        <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div class="text-center">
            <i class="${this.getCategoryIcon(post.category)} text-4xl text-accent mb-2"></i>
            <span class="text-sm text-primary font-mono">${post.category}</span>
          </div>
        </div>
      </div>
      <div class="p-6">
        <div class="flex items-center space-x-4 mb-3">
          <span class="px-2 py-1 ${categoryColor.replace('from-', 'bg-').replace('to-', '').split(' ')[0]}/20 text-accent text-xs rounded border border-accent/30">${post.category}</span>
          <span class="text-xs text-gray-400">${this.formatDate(post.date)}</span>
          <span class="text-xs text-gray-400">${readTime} min read</span>
        </div>
        <h3 class="text-xl font-bold mb-3 text-primary hover:text-accent transition-colors">
          <a href="./posts/${post.slug}.html">${post.title}</a>
        </h3>
        <p class="text-gray-400 text-sm mb-4 leading-relaxed">${post.excerpt}</p>
        <div class="flex justify-between items-center">
          <a href="./posts/${post.slug}.html" class="text-accent text-sm hover:text-white transition-colors inline-flex items-center">
            Read More <i class="fas fa-arrow-right ml-2"></i>
          </a>
          <div class="flex space-x-2">
            ${post.tags ? post.tags.map(tag => `<span class="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">${tag}</span>`).join('') : ''}
          </div>
        </div>
      </div>
    `;

    return card;
  }

  // Get category-specific styling
  getCategoryColor(category) {
    const colors = {
      'Personal': 'from-accent/20 to-secondary/20',
      'Literature': 'from-secondary/20 to-tertiary/20',
      'Tutorial': 'from-accent/20 to-accent/40',
      'Career': 'from-tertiary/20 to-secondary/20',
      'Philosophy': 'from-secondary/20 to-accent/20'
    };
    return colors[category] || 'from-accent/20 to-secondary/20';
  }

  getCategoryIcon(category) {
    const icons = {
      'Personal': 'fas fa-user',
      'Literature': 'fas fa-book',
      'Tutorial': 'fas fa-code',
      'Career': 'fas fa-briefcase',
      'Philosophy': 'fas fa-brain'
    };
    return icons[category] || 'fas fa-file-alt';
  }

  // Calculate estimated read time
  calculateReadTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  // Format date
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  // Show/hide no posts message
  showNoPosts() {
    if (this.noPostsDiv) {
      this.noPostsDiv.style.display = 'block';
    }
  }

  hideNoPosts() {
    if (this.noPostsDiv) {
      this.noPostsDiv.style.display = 'none';
    }
  }

  // Render pagination (for future use)
  renderPagination() {
    const totalPages = Math.ceil(this.posts.length / this.postsPerPage);
    if (totalPages <= 1) return;

    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'flex justify-center mt-12 space-x-2';

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.className = `px-4 py-2 rounded-md transition-colors ${
        i === this.currentPage 
          ? 'bg-accent text-dark' 
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
      }`;
      button.textContent = i;
      button.addEventListener('click', () => {
        this.currentPage = i;
        this.renderPosts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      paginationContainer.appendChild(button);
    }

    this.container.parentNode.appendChild(paginationContainer);
  }
}

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
  // Initialize blog manager
  window.blogManager = new BlogManager();

  // Mobile menu toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('nav').offsetHeight;
        window.scrollTo({
          top: targetElement.offsetTop - headerHeight - 20,
          behavior: 'smooth'
        });
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
      }
    });
  });
});