// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

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
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});

// Add animation class when elements come into view
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Vanta.js RINGS background for hero section
window.addEventListener('DOMContentLoaded', () => {
  if (window.VANTA && document.getElementById('vanta-bg')) {
    VANTA.RINGS({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      backgroundColor: 0x111216,
      color: 0x00eaff,
      color2: 0x23242a
    });
  }
});

// Enhanced form handling with validation and feedback
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      showMessage('Please fill in all fields.', 'error');
      return;
    }
    
    if (!isValidEmail(email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.classList.add('animate-pulse');
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      submitButton.classList.remove('animate-pulse');
      showMessage('Thank you! Your message has been sent successfully.', 'success');
      form.reset();
    }, 2000);
  });
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function showMessage(text, type) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create new message
    const message = document.createElement('div');
    message.className = `form-message p-4 rounded-md mb-4 ${type === 'success' ? 'bg-green-900 border border-green-500 text-green-100' : 'bg-red-900 border border-red-500 text-red-100'}`;
    message.textContent = text;
    
    // Insert message before form
    form.parentNode.insertBefore(message, form);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
      if (message.parentNode) {
        message.remove();
      }
    }, 5000);
  }
});

// Active navigation highlighting
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const headerHeight = document.querySelector('nav').offsetHeight;
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - headerHeight - 50;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// GitHub API Integration
class GitHubPortfolio {
  constructor(username) {
    this.username = username;
    this.apiUrl = 'https://api.github.com';
    this.languageColors = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Python': '#3572A5',
      'Java': '#b07219',
      'C++': '#f34b7d',
      'C': '#555555',
      'HTML': '#e34c26',
      'CSS': '#1572B6',
      'PHP': '#4F5D95',
      'Ruby': '#701516',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'Swift': '#ffac45',
      'Kotlin': '#F18E33',
      'Dart': '#00B4AB',
      'Vue': '#4FC08D',
      'React': '#61DAFB',
      'Angular': '#DD0031'
    };
  }

  async fetchRepositories() {
    try {
      const response = await fetch(`${this.apiUrl}/users/${this.username}/repos?sort=updated&per_page=100`);
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      const repos = await response.json();
      
      // Filter out forks and select best repositories
      const originalRepos = repos.filter(repo => !repo.fork && !repo.archived);
      
      // Sort by stars, forks, and recent activity
      return originalRepos
        .sort((a, b) => {
          const scoreA = (a.stargazers_count * 2) + a.forks_count + (a.updated_at > a.created_at ? 1 : 0);
          const scoreB = (b.stargazers_count * 2) + b.forks_count + (b.updated_at > b.created_at ? 1 : 0);
          return scoreB - scoreA;
        })
        .slice(0, 6); // Take top 6 repositories
        
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw error;
    }
  }

  async fetchLanguages(repoName) {
    try {
      const response = await fetch(`${this.apiUrl}/repos/${this.username}/${repoName}/languages`);
      if (!response.ok) return {};
      return await response.json();
    } catch (error) {
      console.error(`Error fetching languages for ${repoName}:`, error);
      return {};
    }
  }

  createProjectCard(repo, languages = {}) {
    const languageArray = Object.keys(languages).slice(0, 3); // Show top 3 languages
    const description = repo.description || 'A cool project built with modern technologies';
    
    // Create language tags
    const languageTags = languageArray.map(lang => {
      const color = this.languageColors[lang] || '#6b7280';
      return `<span class="px-2 py-1 bg-dark rounded text-xs text-primary border" style="border-color: ${color}; color: ${color}">${lang}</span>`;
    }).join('');

    // Check for project screenshot
    const projectImage = `images/projects/${repo.name.toLowerCase()}.jpg`;
    const fallbackImage = `images/projects/${repo.name.toLowerCase()}.png`;

    return `
      <div class="project-card bg-darkLight rounded-lg overflow-hidden transition duration-300 ease-in-out">
        <div class="h-48 overflow-hidden bg-gradient-to-br from-dark to-darkLight relative">
          <img src="${projectImage}" 
               alt="${repo.name} screenshot" 
               class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
               onerror="this.onerror=null; this.src='${fallbackImage}'; this.onerror=function(){this.style.display='none'; this.nextElementSibling.style.display='flex';}">
          <div class="absolute inset-0 bg-gradient-to-br from-dark to-darkLight flex items-center justify-center" style="display:none;">
            <div class="text-center">
              <i class="fab fa-github text-6xl text-primary opacity-20 mb-4"></i>
              <div class="flex items-center justify-center space-x-4 text-sm text-gray-400">
                ${repo.stargazers_count > 0 ? `<span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>` : ''}
                ${repo.forks_count > 0 ? `<span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>` : ''}
              </div>
            </div>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold mb-2 text-primary">${repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
          <p class="text-primary mb-4 text-sm leading-relaxed">
            ${description.length > 100 ? description.substring(0, 100) + '...' : description}
          </p>
          <div class="flex flex-wrap gap-2 mb-4">
            ${languageTags}
          </div>
          <div class="flex space-x-3">
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="text-primary font-medium text-sm hover:text-accent transition-colors">
              View Code →
            </a>
            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="text-primary font-medium text-sm hover:text-accent transition-colors">Live Demo →</a>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  showLoading() {
    const container = document.querySelector('#projects-container');
    if (container) {
      container.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p class="text-primary">Loading projects from GitHub...</p>
        </div>
      `;
    }
  }

  showError(message) {
    const container = document.querySelector('#projects-container');
    if (container) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
          <p class="text-red-400 mb-4">${message}</p>
          <button onclick="window.githubPortfolio.loadProjects()" class="px-4 py-2 bg-primary text-dark rounded hover:bg-opacity-90 transition-colors">
            Try Again
          </button>
        </div>
      `;
    }
  }

  async loadProjects() {
    const container = document.querySelector('#projects-container');
    if (!container) return;

    this.showLoading();

    try {
      const repos = await this.fetchRepositories();
      
      if (repos.length === 0) {
        container.innerHTML = `
          <div class="col-span-full text-center py-12">
            <p class="text-primary">No public repositories found.</p>
          </div>
        `;
        return;
      }

      // Fetch languages for each repo and create cards
      const projectCards = await Promise.all(
        repos.map(async (repo) => {
          const languages = await this.fetchLanguages(repo.name);
          return this.createProjectCard(repo, languages);
        })
      );

      container.innerHTML = projectCards.join('');

    } catch (error) {
      this.showError('Failed to load projects from GitHub. Please try again later.');
    }
  }
}

// Initialize GitHub integration
// Replace 'your-github-username' with your actual GitHub username
window.githubPortfolio = new GitHubPortfolio('CtrlAltQ');

// Load projects when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Add a small delay to let other animations finish first
  setTimeout(() => {
    window.githubPortfolio.loadProjects();
  }, 1000);
});
