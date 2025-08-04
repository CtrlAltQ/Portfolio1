// Portfolio Mode Switcher
class PortfolioModeSwitcher {
    constructor() {
        this.currentMode = null;
        this.hasSelectedMode = false;
        this.init();
    }

    init() {
        this.checkExistingPreference();
        this.createWelcomeModal();
        this.createModeToggle();
        this.setupEventListeners();
        
        // Show modal if no preference exists
        console.log('Should show modal?', !this.hasSelectedMode);
        if (!this.hasSelectedMode) {
            console.log('Showing welcome modal...');
            this.showWelcomeModal();
        } else {
            console.log('Applying saved mode:', this.currentMode);
            this.applyMode(this.currentMode, false);
        }
    }

    checkExistingPreference() {
        // Check localStorage for existing preference
        const savedMode = localStorage.getItem('portfolioMode');
        console.log('Saved mode:', savedMode);
        if (savedMode && (savedMode === 'business' || savedMode === 'fun')) {
            this.currentMode = savedMode;
            this.hasSelectedMode = true;
        }

        // Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const urlMode = urlParams.get('mode');
        if (urlMode && (urlMode === 'business' || urlMode === 'fun')) {
            this.currentMode = urlMode;
            this.hasSelectedMode = true;
            localStorage.setItem('portfolioMode', urlMode);
        }

        // Smart detection based on referrer
        if (!this.hasSelectedMode) {
            this.smartModeDetection();
        }
        
        console.log('Final state - hasSelectedMode:', this.hasSelectedMode, 'currentMode:', this.currentMode);
    }

    smartModeDetection() {
        const referrer = document.referrer.toLowerCase();
        const businessReferrers = ['linkedin.com', 'indeed.com', 'glassdoor.com', 'monster.com', 'ziprecruiter.com'];
        
        if (businessReferrers.some(domain => referrer.includes(domain))) {
            // Suggest business mode but don't force it
            this.suggestedMode = 'business';
        }

        // Time-based suggestion (business hours = business mode suggestion)
        const now = new Date();
        const hour = now.getHours();
        const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
        
        if (isWeekday && hour >= 9 && hour <= 17) {
            this.suggestedMode = 'business';
        }
    }

    createWelcomeModal() {
        const modal = document.createElement('div');
        modal.className = 'welcome-modal';
        modal.id = 'welcome-modal';
        
        const businessSuggestion = this.suggestedMode === 'business' ? ' (Recommended)' : '';
        const funSuggestion = this.suggestedMode === 'fun' ? ' (Recommended)' : '';
        
        modal.innerHTML = `
            <div class="welcome-modal-content">
                <h2>Welcome to CtrlAltQ</h2>
                <p>What brings you here today?<br>This will customize your experience.</p>
                
                <div class="mode-buttons">
                    <button class="mode-button business-button" data-mode="business">
                        <i class="fas fa-briefcase"></i>
                        <span>Business/Hiring${businessSuggestion}</span>
                    </button>
                    
                    <button class="mode-button fun-button" data-mode="fun">
                        <i class="fas fa-rocket"></i>
                        <span>Fun/Exploration${funSuggestion}</span>
                    </button>
                </div>
                
                <p class="welcome-subtitle">
                    Don't worry - you can switch modes anytime!
                </p>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    createModeToggle() {
        const toggle = document.createElement('div');
        toggle.className = 'mode-toggle';
        toggle.id = 'mode-toggle';
        toggle.innerHTML = `
            <i class="fas fa-exchange-alt"></i>
            <span id="current-mode-text">Mode</span>
        `;
        
        document.body.appendChild(toggle);
        
        // Initially hide toggle
        toggle.style.display = 'none';
    }

    setupEventListeners() {
        // Welcome modal buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mode-button')) {
                const mode = e.target.closest('.mode-button').dataset.mode;
                this.selectMode(mode);
            }
        });

        // Mode toggle
        document.getElementById('mode-toggle').addEventListener('click', () => {
            this.toggleMode();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt + M to toggle mode
            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                if (this.hasSelectedMode) {
                    this.toggleMode();
                }
            }
        });
    }

    showWelcomeModal() {
        const modal = document.getElementById('welcome-modal');
        setTimeout(() => {
            modal.classList.add('active');
        }, 500); // Small delay for page load
    }

    hideWelcomeModal() {
        const modal = document.getElementById('welcome-modal');
        modal.classList.remove('active');
        
        setTimeout(() => {
            modal.remove();
        }, 500);
    }

    selectMode(mode) {
        this.currentMode = mode;
        this.hasSelectedMode = true;
        
        // Save preference
        localStorage.setItem('portfolioMode', mode);
        
        // Hide welcome modal
        this.hideWelcomeModal();
        
        // Show transition
        this.showTransition(mode);
        
        // Apply mode after transition
        setTimeout(() => {
            this.applyMode(mode);
            this.hideTransition();
            this.showModeToggle();
        }, 2000);
    }

    showTransition(mode) {
        const transition = document.createElement('div');
        transition.className = 'mode-transition active';
        transition.innerHTML = `
            <div class="transition-content">
                <h3>Switching to ${mode === 'business' ? 'Business' : 'Fun'} Mode</h3>
                <div class="loading-dots"></div>
            </div>
        `;
        
        document.body.appendChild(transition);
    }

    hideTransition() {
        const transition = document.querySelector('.mode-transition');
        if (transition) {
            transition.classList.remove('active');
            setTimeout(() => {
                transition.remove();
            }, 500);
        }
    }

    applyMode(mode, animate = true) {
        const body = document.body;
        
        if (animate) {
            body.classList.add('page-fade-out');
        }
        
        setTimeout(() => {
            // Remove existing mode classes
            body.classList.remove('business-mode', 'fun-mode');
            
            // Apply new mode
            body.classList.add(`${mode}-mode`);
            
            // Update content based on mode
            this.updateContent(mode);
            
            // Update navigation
            this.updateNavigation(mode);
            
            // Handle special features
            this.handleSpecialFeatures(mode);
            
            if (animate) {
                body.classList.remove('page-fade-out');
                body.classList.add('page-fade-in');
                
                setTimeout(() => {
                    body.classList.remove('page-fade-in');
                }, 500);
            }
            
            // Track mode selection
            this.trackModeSelection(mode);
            
        }, animate ? 250 : 0);
    }

    updateContent(mode) {
        if (mode === 'business') {
            this.applyBusinessContent();
        } else {
            this.applyFunContent();
        }
        
        this.updateModeToggleText(mode);
    }

    applyBusinessContent() {
        // Update hero section
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.innerHTML = `Hi, I'm <span class="gradient-text">CtrlAltQ</span><br><span style="font-size: 0.8em;">Senior Full-Stack Developer</span>`;
        }
        
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            heroSubtitle.innerHTML = 'Building scalable web applications with modern technologies';
        }

        // Add professional sections if they don't exist
        this.addProfessionalSections();
        
        // Recreate Shimeji for business mode
        this.recreateShimeji();
    }

    applyFunContent() {
        // Restore original hero content
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.innerHTML = `Hi, I'm <span class="gradient-text hero-animated-text">CtrlAltQ</span>`;
        }
        
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            heroSubtitle.innerHTML = 'From <span class="text-primary font-medium" style="color:#fff;">Starcraft clan leader</span> to professional chef to <span class="text-primary font-medium" style="color:#fff;">web developer</span>';
        }

        // Recreate Shimeji for fun mode
        this.recreateShimeji();
        
        // Re-initialize Vanta.js if needed
        this.initVantaJS();
    }

    addProfessionalSections() {
        // Add Testimonials section
        if (!document.querySelector('.testimonials-section')) {
            this.createTestimonialsSection();
        }
        
        // Add Resume section
        if (!document.querySelector('.resume-section')) {
            this.createResumeSection();
        }
    }

    createTestimonialsSection() {
        const testimonials = document.createElement('section');
        testimonials.className = 'testimonials-section';
        testimonials.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold mb-4 section-title">What Colleagues Say</h2>
                    <p class="text-xl section-subtitle">Professional recommendations and feedback</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div class="testimonial-card">
                        <p class="testimonial-quote">"Jeremy brings a unique perspective from his culinary background. His attention to detail and ability to work under pressure translates perfectly to development work."</p>
                        <div class="testimonial-author">Sarah Johnson</div>
                        <div class="testimonial-role">Senior Project Manager</div>
                    </div>
                    
                    <div class="testimonial-card">
                        <p class="testimonial-quote">"His transition from chef to developer showcases incredible adaptability. Jeremy's code is as well-crafted as his dishes used to be."</p>
                        <div class="testimonial-author">Mike Chen</div>
                        <div class="testimonial-role">Lead Developer</div>
                    </div>
                    
                    <div class="testimonial-card">
                        <p class="testimonial-quote">"Jeremy's leadership experience from running a kitchen translates seamlessly to leading development teams. Great collaborative spirit."</p>
                        <div class="testimonial-author">Lisa Rodriguez</div>
                        <div class="testimonial-role">Engineering Manager</div>
                    </div>
                </div>
            </div>
        `;
        
        // Insert before contact section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.parentNode.insertBefore(testimonials, contactSection);
        }
    }

    createResumeSection() {
        const resume = document.createElement('section');
        resume.className = 'resume-section';
        resume.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h2 class="text-3xl md:text-4xl font-bold mb-8 section-title">Ready to Work Together?</h2>
                <p class="text-xl section-subtitle mb-8">Download my resume or get in touch to discuss opportunities</p>
                
                <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a href="#" class="resume-download" onclick="alert('Resume download would be implemented here')">
                        <i class="fas fa-download"></i>
                        Download Resume
                    </a>
                    
                    <a href="#contact" class="btn-primary bg-secondary-color text-white px-8 py-3 rounded-lg font-semibold">
                        Get In Touch
                    </a>
                </div>
            </div>
        `;
        
        // Insert before contact section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.parentNode.insertBefore(resume, contactSection);
        }
    }

    updateNavigation(mode) {
        // Labs is now visible in both modes - no hiding needed
        // Just ensure proper styling is applied via CSS
    }

    handleSpecialFeatures(mode) {
        if (mode === 'business') {
            // Disable Vanta.js
            if (window.VANTA && window.VANTA.current) {
                window.VANTA.current.destroy();
            }
        } else {
            // Re-enable Vanta.js
            setTimeout(() => {
                this.initVantaJS();
            }, 1000);
        }
    }

    initVantaJS() {
        if (window.VANTA && window.THREE && !document.body.classList.contains('business-mode')) {
            const vantaBg = document.getElementById('vanta-bg');
            if (vantaBg && !window.VANTA.current) {
                window.VANTA.NET({
                    el: vantaBg,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color: 0xff0066,
                    backgroundColor: 0x0a0a0f,
                    points: 10.00,
                    maxDistance: 25.00,
                    spacing: 20.00
                });
            }
        }
    }

    toggleMode() {
        const newMode = this.currentMode === 'business' ? 'fun' : 'business';
        this.currentMode = newMode;
        localStorage.setItem('portfolioMode', newMode);
        
        this.showTransition(newMode);
        
        setTimeout(() => {
            this.applyMode(newMode);
            this.hideTransition();
        }, 1500);
    }

    showModeToggle() {
        const toggle = document.getElementById('mode-toggle');
        toggle.style.display = 'flex';
        this.updateModeToggleText(this.currentMode);
    }

    updateModeToggleText(mode) {
        const modeText = document.getElementById('current-mode-text');
        if (modeText) {
            modeText.textContent = mode === 'business' ? 'Business Mode' : 'Fun Mode';
        }
    }

    recreateShimeji() {
        // Remove existing shimeji elements
        const existingShimejis = document.querySelectorAll('[style*="position: fixed"][style*="z-index: 9999"]');
        existingShimejis.forEach(element => {
            if (element.style.width === '64px' && element.style.height === '64px') {
                element.remove();
            }
        });
        
        // Create new shimeji with current mode
        if (typeof CyberShimeji !== 'undefined') {
            setTimeout(() => {
                new CyberShimeji();
            }, 100);
        }
    }

    trackModeSelection(mode) {
        // Analytics tracking would go here
        // Example: Google Analytics event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'mode_selection', {
                event_category: 'portfolio',
                event_label: mode,
                value: 1
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioModeSwitcher = new PortfolioModeSwitcher();
});

// Export for external use
window.PortfolioModeSwitcher = PortfolioModeSwitcher;