// AltQ Labs Core JavaScript

class LabsCore {
    constructor() {
        this.loadingMessages = [
            'Loading chaos engine...',
            'Initializing experiments...',
            'Calibrating danger levels...',
            'Summoning digital demons...',
            'Defragmenting reality...',
            'Compiling madness...',
            'Loading complete. Welcome to chaos.'
        ];
        
        this.soundEnabled = true;
        this.init();
    }

    init() {
        this.startLoadingSequence();
        this.setupEventListeners();
        this.startBackgroundEffects();
    }

    startLoadingSequence() {
        const loadingScreen = document.getElementById('loading-screen');
        const progressBar = document.querySelector('.loading-progress');
        const loadingText = document.querySelector('.loading-text');
        
        let progress = 0;
        let messageIndex = 0;
        
        const updateProgress = () => {
            progress += Math.random() * 20;
            
            if (progress >= 100) {
                progress = 100;
                progressBar.style.width = '100%';
                loadingText.textContent = this.loadingMessages[this.loadingMessages.length - 1];
                
                setTimeout(() => {
                    gsap.to(loadingScreen, {
                        opacity: 0,
                        duration: 1,
                        onComplete: () => {
                            loadingScreen.style.display = 'none';
                            this.startEntryAnimation();
                        }
                    });
                }, 1000);
                
                return;
            }
            
            progressBar.style.width = progress + '%';
            
            if (messageIndex < this.loadingMessages.length - 1) {
                loadingText.textContent = this.loadingMessages[messageIndex];
                messageIndex++;
            }
            
            setTimeout(updateProgress, 300 + Math.random() * 500);
        };
        
        setTimeout(updateProgress, 500);
    }

    startEntryAnimation() {
        // Animate ASCII logo
        gsap.fromTo('.ascii-logo', 
            { opacity: 0, y: -50 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
        );

        // Animate typing text
        this.typeText('.typing-text', 'WARNING: EXPERIMENTAL ZONE - PROCEED AT YOUR OWN RISK');

        // Stagger experiment cards
        gsap.fromTo('.experiment-card', 
            { opacity: 0, x: -100, rotationY: -90 },
            { 
                opacity: 1, 
                x: 0, 
                rotationY: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'back.out(1.7)',
                delay: 1
            }
        );

        // Animate control room section
        gsap.fromTo('.control-room-btn', 
            { opacity: 0, scale: 0 },
            { 
                opacity: 1, 
                scale: 1,
                duration: 0.6,
                ease: 'elastic.out(1, 0.3)',
                delay: 2
            }
        );
    }

    typeText(selector, text) {
        const element = document.querySelector(selector);
        const warningSpan = element.querySelector('.text-red-400');
        const textSpan = element.querySelector('.text-warning');
        const cursor = element.querySelector('.cursor');
        
        // Clear existing text
        textSpan.textContent = '';
        
        let index = 0;
        const typeChar = () => {
            if (index < text.length - 'WARNING: '.length) {
                textSpan.textContent += text['WARNING: '.length + index];
                index++;
                setTimeout(typeChar, 50 + Math.random() * 50);
            }
        };
        
        setTimeout(typeChar, 1500);
    }

    setupEventListeners() {
        // Experiment card interactions
        document.querySelectorAll('.experiment-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.playSound('hover');
                gsap.to(card, { scale: 1.02, duration: 0.3 });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, { scale: 1, duration: 0.3 });
            });

            card.addEventListener('click', () => {
                this.activateExperiment(card.dataset.experiment);
            });
        });

        // Activate buttons
        document.querySelectorAll('.activate-btn').forEach(btn => {
            btn.addEventListener('Click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.experiment-card');
                this.activateExperiment(card.dataset.experiment);
            });
        });

        // Control room button
        document.querySelector('.control-room-btn')?.addEventListener('click', (e) => {
            this.playSound('access');
            this.glitchTransition(() => {
                window.location.href = e.target.href;
            });
            e.preventDefault();
        });

        // Random glitch effects
        this.setupRandomGlitches();
    }

    setupRandomGlitches() {
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                this.randomGlitch();
            }
        }, 3000);
    }

    randomGlitch() {
        const elements = document.querySelectorAll('.experiment-card, .ascii-logo, .typing-text');
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        
        randomElement.classList.add('glitch');
        setTimeout(() => {
            randomElement.classList.remove('glitch');
        }, 300);
    }

    activateExperiment(experimentName) {
        this.playSound('activate');
        
        const card = document.querySelector(`[data-experiment="${experimentName}"]`);
        
        // Visual feedback
        gsap.to(card, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });

        // Add warning effect
        card.style.boxShadow = '0 0 30px rgba(255, 51, 51, 0.8)';
        setTimeout(() => {
            card.style.boxShadow = '';
        }, 500);

        // Navigate to experiment
        setTimeout(() => {
            this.glitchTransition(() => {
                window.location.href = `experiments/${experimentName}.html`;
            });
        }, 800);
    }

    glitchTransition(callback) {
        // Create screen glitch effect
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            z-index: 9999;
            opacity: 0;
        `;
        document.body.appendChild(overlay);

        // Glitch animation
        gsap.timeline()
            .to(overlay, { opacity: 1, duration: 0.1 })
            .to(overlay, { opacity: 0, duration: 0.05 })
            .to(overlay, { opacity: 1, duration: 0.1 })
            .to(overlay, { opacity: 0, duration: 0.05 })
            .to(overlay, { opacity: 1, duration: 0.2, onComplete: callback });
    }

    startBackgroundEffects() {
        // Animate system status
        this.animateSystemStatus();
        
        // Random screen flickers
        this.startScreenFlickers();
    }

    animateSystemStatus() {
        const statusElements = document.querySelectorAll('.blink');
        statusElements.forEach(element => {
            gsap.to(element, {
                opacity: 0.3,
                duration: 0.5,
                yoyo: true,
                repeat: -1,
                repeatDelay: 1.5
            });
        });
    }

    startScreenFlickers() {
        setInterval(() => {
            if (Math.random() < 0.05) { // 5% chance
                document.body.style.filter = 'brightness(1.5) contrast(2)';
                setTimeout(() => {
                    document.body.style.filter = '';
                }, 50);
            }
        }, 2000);
    }

    playSound(type) {
        if (!this.soundEnabled) return;
        
        // Web Audio API sound generation
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let frequency, duration;
        
        switch(type) {
            case 'hover':
                frequency = 800;
                duration = 100;
                break;
            case 'activate':
                frequency = 400;
                duration = 200;
                break;
            case 'access':
                frequency = 600;
                duration = 300;
                break;
            default:
                frequency = 500;
                duration = 150;
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LabsCore();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Konami code: ↑↑↓↓←→←→BA
    // For now, just Alt+L for quick labs access
    if (e.altKey && e.key === 'l') {
        e.preventDefault();
        document.querySelector('.control-room-btn')?.click();
    }
    
    // Escape key to exit
    if (e.key === 'Escape') {
        window.location.href = '../index.html';
    }
});