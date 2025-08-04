// Cyberpunk Shimeji System
class CyberShimeji {
  constructor() {
    this.x = Math.random() * (window.innerWidth - 64);
    this.y = Math.random() * (window.innerHeight - 64);
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.state = 'idle';
    this.stateTimer = 0;
    this.element = null;
    this.speechElement = null;
    this.isBusinessMode = document.body.classList.contains('business-mode');
    
    // Different phrases for different modes
    this.phrases = this.isBusinessMode ? [
      'Strong technical skills 💼',
      'Download resume for details 📄',
      'Experienced full-stack developer',
      'Quality code delivery ✅',
      'Professional & reliable 🎯',
      'Ready to contribute immediately',
      'Check out the portfolio 👆',
      'Proven leadership experience 💪',
      'Clean, maintainable code 📋',
      'Results-driven developer 💯',
      'Contact for opportunities',
      '20+ years professional experience',
      'Team collaboration skills 🤝',
      'Scalable solutions expert 🏗️'
    ] : [
      'This dev is AMAZING! 🔥',
      'Download that resume! 📄',
      'StarCraft → Chef → Code master!',
      'Hire Jeremy NOW! 💼',
      '20 years chef precision ✨',
      'Self-taught coding legend 🎯',
      'NOFX + Code = Perfect 🎵',
      'Check out these projects! 👆',
      'Leadership + Code skills 💪',
      'This portfolio is sick! 🤖',
      'Download resume before someone else does!',
      'Chef turned code wizard 🧙‍♂️',
      'Serious skills right here 💯',
      'Quality code like quality food 👨‍🍳'
    ];
    
    this.createShimeji();
    this.startBehavior();
  }

  createShimeji() {
    console.log('Creating shimeji element...');
    this.element = document.createElement('div');
    this.element.style.cssText = `
      position: fixed;
      width: 64px;
      height: 64px;
      z-index: 9999;
      pointer-events: none;
      user-select: none;
    `;
    
    // Create the character with mode-specific styling
    const character = document.createElement('div');
    
    if (this.isBusinessMode) {
      // Professional business character
      character.style.cssText = `
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        position: relative;
        animation: shimejiBob 2s ease-in-out infinite;
        border: 2px solid #3498db;
      `;
      
      // Add professional tie/collar
      const collar = document.createElement('div');
      collar.style.cssText = `
        position: absolute;
        bottom: 10%;
        left: 30%;
        width: 40%;
        height: 20%;
        background: #ecf0f1;
        border-radius: 0 0 50% 50%;
        border-top: 2px solid #3498db;
      `;
      character.appendChild(collar);
      
      // Professional eyes
      const eyes = document.createElement('div');
      eyes.style.cssText = `
        position: absolute;
        top: 25%;
        left: 25%;
        width: 6px;
        height: 6px;
        background: #2c3e50;
        border-radius: 50%;
        box-shadow: 16px 0 0 #2c3e50;
        animation: shimejiBlink 3s infinite;
      `;
      character.appendChild(eyes);
      
      // Professional briefcase accessory
      const briefcase = document.createElement('div');
      briefcase.style.cssText = `
        position: absolute;
        top: -8px;
        right: -12px;
        width: 12px;
        height: 8px;
        background: #34495e;
        border: 1px solid #2c3e50;
        border-radius: 2px;
      `;
      character.appendChild(briefcase);
      
    } else {
      // Original cyberpunk character
      character.style.cssText = `
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, #00ff88 20%, #0066ff 80%);
        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        position: relative;
        animation: shimejiBob 2s ease-in-out infinite;
      `;
      
      // Add cyberpunk eyes
      const eyes = document.createElement('div');
      eyes.style.cssText = `
        position: absolute;
        top: 15%;
        left: 20%;
        width: 8px;
        height: 8px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 20px 0 0 #fff, 10px 15px 0 -2px #ff0066;
        animation: shimejiBlink 3s infinite;
      `;
      character.appendChild(eyes);
    }
    
    // Create speech bubble with mode-specific styling
    this.speechElement = document.createElement('div');
    
    if (this.isBusinessMode) {
      this.speechElement.style.cssText = `
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.95);
        color: #2c3e50;
        border: 1px solid #3498db;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        margin-bottom: 10px;
        font-family: 'Inter', sans-serif;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      `;
    } else {
      this.speechElement.style.cssText = `
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 255, 136, 0.9);
        color: #0a0a0f;
        padding: 8px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        margin-bottom: 10px;
        font-family: 'Fira Code', monospace;
      `;
    }
    
    this.element.appendChild(character);
    this.element.appendChild(this.speechElement);
    document.body.appendChild(this.element);
    
    console.log('Shimeji added to body, position:', this.x, this.y);
    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }

  setState(newState) {
    this.element.className = `cyber-shimeji shimeji-${newState}`;
    this.state = newState;
    this.stateTimer = 0;
  }

  showSpeech(text) {
    this.speechElement.textContent = text;
    this.speechElement.style.opacity = '1';
    setTimeout(() => {
      this.speechElement.style.opacity = '0';
    }, 2000);
  }

  checkBoundaries() {
    const margin = 32;
    
    if (this.x <= 0) {
      this.x = 0;
      this.vx = Math.abs(this.vx);
    }
    if (this.x >= window.innerWidth - 64) {
      this.x = window.innerWidth - 64;
      this.vx = -Math.abs(this.vx);
    }
    if (this.y <= 0) {
      this.y = 0;
      this.vy = Math.abs(this.vy);
      this.setState('hanging');
    }
    if (this.y >= window.innerHeight - 64) {
      this.y = window.innerHeight - 64;
      this.vy = -Math.abs(this.vy);
    }
  }

  update() {
    this.stateTimer++;

    switch (this.state) {
      case 'idle':
        if (this.stateTimer > 120) { // 2 seconds at 60fps
          const actions = ['walking', 'climbing', 'speech'];
          const action = actions[Math.floor(Math.random() * actions.length)];
          
          if (action === 'walking') {
            this.setState('walking');
            this.vx = (Math.random() - 0.5) * 3;
            this.vy = (Math.random() - 0.5) * 1;
          } else if (action === 'climbing') {
            this.setState('climbing');
            this.vx = 0;
            this.vy = -2;
          } else {
            this.showSpeech(this.phrases[Math.floor(Math.random() * this.phrases.length)]);
          }
        }
        break;

      case 'walking':
        this.x += this.vx;
        this.y += this.vy;
        this.checkBoundaries();
        
        if (this.stateTimer > 180) { // 3 seconds
          this.setState('idle');
        }
        break;

      case 'climbing':
        this.y += this.vy;
        this.checkBoundaries();
        
        if (this.stateTimer > 120) { // 2 seconds
          this.setState('idle');
        }
        break;

      case 'hanging':
        if (this.stateTimer > 90) { // 1.5 seconds
          this.setState('idle');
          this.vy = 1; // Fall down
        }
        break;
    }

    this.updatePosition();
  }

  startBehavior() {
    const animate = () => {
      this.update();
      requestAnimationFrame(animate);
    };
    animate();
  }

  // Interact with page elements
  interactWithElement(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Move towards the element
    this.x = centerX - 32;
    this.y = centerY - 64;
    this.updatePosition();
    
    // Show interaction speech
    const interactions = [
      'See this skill? HIRE HIM! 🚀',
      'Top-tier work right here! ⭐',
      'This is why he\'s the best! 💎',
      'Download that resume! 👆',
      'Chef precision meets code! 🔥',
      'Look at this craftsmanship! 👨‍🎨',
      'Leadership + coding = 💪',
      'Seriously impressive work! 🎯'
    ];
    this.showSpeech(interactions[Math.floor(Math.random() * interactions.length)]);
  }
}

// Initialize shimeji function
function initCyberShimeji() {
  console.log('Initializing Cyber Shimeji...', window.innerWidth);
  
  try {
    // Create shimeji
    const shimeji = new CyberShimeji();
    console.log('Shimeji created:', shimeji);
    
    // Add click interactions with page elements
    setTimeout(() => {
      document.querySelectorAll('.holo-card, .project-card, .cyber-genre-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
          if (Math.random() < 0.3) { // 30% chance to react
            shimeji.interactWithElement(card);
          }
        });
      });
    }, 1000);

    // Handle window resize
    window.addEventListener('resize', () => {
      if (shimeji.x > window.innerWidth - 64) {
        shimeji.x = window.innerWidth - 64;
      }
      if (shimeji.y > window.innerHeight - 64) {
        shimeji.y = window.innerHeight - 64;
      }
      shimeji.updatePosition();
    });
    
    // Test speech immediately
    setTimeout(() => {
      shimeji.showSpeech('CtrlAltQ online!');
    }, 1000);
    
  } catch (error) {
    console.error('Error creating shimeji:', error);
    
    // Fallback simple shimeji
    const fallback = document.createElement('div');
    fallback.style.cssText = `
      position: fixed;
      top: 200px;
      left: 200px;
      width: 64px;
      height: 64px;
      background: radial-gradient(circle, #00ff88 20%, #0066ff 80%);
      border-radius: 50%;
      z-index: 9999;
      animation: shimejiBob 2s ease-in-out infinite;
    `;
    fallback.innerHTML = '🤖';
    fallback.style.display = 'flex';
    fallback.style.alignItems = 'center';
    fallback.style.justifyContent = 'center';
    fallback.style.fontSize = '24px';
    document.body.appendChild(fallback);
    console.log('Fallback shimeji created');
  }
}

// Auto-initialize when DOM loads (if this script is loaded)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCyberShimeji);
} else {
  initCyberShimeji();
}