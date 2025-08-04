// Watching Eye Experiment JavaScript

class WatchingEye {
    constructor() {
        this.eyeCursor = null;
        this.eyeInner = null;
        this.eyeBloodshot = null;
        this.scanningText = null;
        this.isActive = false;
        this.blinkInterval = null;
        this.judgementTimer = null;
        this.bloodshotTimer = null;
        
        this.mood = 'neutral'; // neutral, suspicious, angry, pleased, tired
        this.focusTarget = 'SCANNING...';
        this.watchTime = 0;
        
        this.elementJudgements = {
            'innocent-card': { mood: 'pleased', message: 'The eye approves of your innocent browsing.' },
            'suspicious-card': { mood: 'suspicious', message: 'The eye is watching you more closely now...' },
            'sketchy-button': { mood: 'angry', message: 'The eye does not approve of your clicking habits!' },
            'hidden-content': { mood: 'suspicious', message: 'You cannot hide from the eye. It sees all.' },
            'approved-card': { mood: 'pleased', message: 'The eye is pleased with your choice.' },
            'questionable-card': { mood: 'suspicious', message: 'The eye is uncertain about this...' }
        };
        
        this.judgementMessages = {
            neutral: ['The eye watches...', 'Observing...', 'Scanning behavior...'],
            suspicious: ['The eye is suspicious...', 'Questionable activity detected...', 'The eye narrows...'],
            angry: ['The eye disapproves!', 'Unacceptable behavior!', 'The eye glares with anger!'],
            pleased: ['The eye approves', 'Good choice', 'The eye is satisfied'],
            tired: ['The eye grows weary...', 'So much to watch...', 'The eye needs rest...']
        };
        
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.showInstructions();
    }

    setupElements() {
        this.eyeCursor = document.getElementById('eye-cursor');
        this.eyeInner = this.eyeCursor.querySelector('.eye-inner');
        this.eyeBloodshot = this.eyeCursor.querySelector('.eye-bloodshot');
        this.scanningText = document.getElementById('scanning-text');
    }

    setupEventListeners() {
        // Start button
        document.getElementById('start-watching').addEventListener('click', () => {
            this.startWatching();
        });

        // Mouse movement
        document.addEventListener('mousemove', (e) => {
            if (this.isActive) {
                this.updateEyePosition(e.clientX, e.clientY);
                this.trackPupil(e.clientX, e.clientY);
            }
        });

        // Element interactions
        document.querySelectorAll('.watching-element').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                if (this.isActive) {
                    this.handleElementHover(e.target);
                }
            });

            element.addEventListener('mouseleave', () => {
                if (this.isActive) {
                    this.handleElementLeave();
                }
            });

            element.addEventListener('click', (e) => {
                if (this.isActive) {
                    this.handleElementClick(e.target);
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.location.href = '../index.html';
            }
        });
    }

    showInstructions() {
        const modal = document.getElementById('instructions-modal');
        gsap.fromTo(modal, 
            { opacity: 0 },
            { opacity: 1, duration: 0.5 }
        );
    }

    startWatching() {
        this.isActive = true;
        
        // Hide instructions
        const modal = document.getElementById('instructions-modal');
        gsap.to(modal, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                modal.style.display = 'none';
            }
        });
        
        // Show eye cursor
        this.eyeCursor.style.display = 'block';
        
        // Start eye behaviors
        this.startBlinking();
        this.startRandomJudgements();
        this.startBloodshotTimer();
        this.startWatchTimer();
        
        // Play start sound
        this.playSound('start');
        
        // Initial eye positioning
        this.updateEyePosition(window.innerWidth / 2, window.innerHeight / 2);
        
        this.showJudgement('The eye is now watching...', 3000);
    }

    updateEyePosition(x, y) {
        if (!this.eyeCursor) return;
        
        // Update cursor position
        gsap.to(this.eyeCursor, {
            left: x - 30,
            top: y - 30,
            duration: 0.1,
            ease: 'power2.out'
        });
    }

    trackPupil(mouseX, mouseY) {
        if (!this.eyeInner) return;
        
        const eyeRect = this.eyeCursor.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;
        
        const deltaX = mouseX - eyeCenterX;
        const deltaY = mouseY - eyeCenterY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Limit pupil movement within the eye
        const maxDistance = 8;
        const limitedDistance = Math.min(distance, maxDistance);
        
        const pupilX = (deltaX / distance) * limitedDistance || 0;
        const pupilY = (deltaY / distance) * limitedDistance || 0;
        
        gsap.to(this.eyeInner, {
            x: pupilX,
            y: pupilY,
            duration: 0.1,
            ease: 'power2.out'
        });
    }

    startBlinking() {
        this.blinkInterval = setInterval(() => {
            this.blink();
        }, 2000 + Math.random() * 4000); // Random blinks every 2-6 seconds
    }

    blink() {
        if (!this.eyeCursor) return;
        
        this.eyeCursor.classList.add('blinking');
        this.playSound('blink');
        
        setTimeout(() => {
            if (this.eyeCursor) {
                this.eyeCursor.classList.remove('blinking');
            }
        }, 300);
    }

    startRandomJudgements() {
        this.judgementTimer = setInterval(() => {
            const messages = this.judgementMessages[this.mood];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            this.showScanningText(randomMessage);
        }, 5000 + Math.random() * 10000); // Random judgements every 5-15 seconds
    }

    startBloodshotTimer() {
        this.bloodshotTimer = setTimeout(() => {
            this.makeEyeBloodshot();
        }, 30000); // Eye gets bloodshot after 30 seconds
    }

    startWatchTimer() {
        setInterval(() => {
            this.watchTime++;
            
            // Eye gets tired after watching for too long
            if (this.watchTime > 60 && this.mood !== 'tired') { // 1 minute
                this.changeMood('tired');
                this.showJudgement('The eye grows weary from watching...', 4000);
            }
        }, 1000);
    }

    makeEyeBloodshot() {
        if (!this.eyeBloodshot) return;
        
        gsap.to(this.eyeBloodshot, {
            opacity: 0.7,
            duration: 2,
            ease: 'power2.inOut'
        });
        
        this.showJudgement('The eye is getting bloodshot from watching too much...', 4000);
    }

    handleElementHover(element) {
        const elementData = element.dataset.element;
        this.focusTarget = elementData || 'Unknown Element';
        this.updateStatus();
        
        // Show scanning text
        this.showScanningText('ANALYZING...');
        
        // Check if this element has a judgement
        if (elementData && this.elementJudgements[elementData]) {
            setTimeout(() => {
                const judgement = this.elementJudgements[elementData];
                this.changeMood(judgement.mood);
                this.showScanningText(judgement.message);
            }, 1000);
        }
    }

    handleElementLeave() {
        this.focusTarget = 'SCANNING...';
        this.updateStatus();
        this.hideScanningText();
    }

    handleElementClick(element) {
        const elementData = element.dataset.element;
        
        // Eye reacts to clicks
        this.dilateEye();
        this.playSound('click');
        
        if (elementData && this.elementJudgements[elementData]) {
            const judgement = this.elementJudgements[elementData];
            this.changeMood(judgement.mood);
            this.showJudgement(judgement.message, 4000);
        } else {
            // Generic click reaction
            const reactions = [
                'The eye sees your click...',
                'Click detected and judged.',
                'The eye remembers this action.',
                'Your clicking behavior is noted.'
            ];
            this.showJudgement(reactions[Math.floor(Math.random() * reactions.length)], 3000);
        }
    }

    dilateEye() {
        if (!this.eyeInner) return;
        
        gsap.timeline()
            .to(this.eyeInner, { scale: 1.3, duration: 0.1 })
            .to(this.eyeInner, { scale: 1, duration: 0.3 });
    }

    changeMood(newMood) {
        this.mood = newMood;
        this.updateStatus();
        
        // Change eye appearance based on mood
        const eyeOuter = this.eyeCursor.querySelector('.eye-outer');
        
        switch(newMood) {
            case 'angry':
                eyeOuter.style.borderColor = '#ff0000';
                eyeOuter.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.8)';
                break;
            case 'suspicious':
                eyeOuter.style.borderColor = '#ffaa00';
                eyeOuter.style.boxShadow = '0 0 25px rgba(255, 170, 0, 0.6)';
                break;
            case 'pleased':
                eyeOuter.style.borderColor = '#00ff00';
                eyeOuter.style.boxShadow = '0 0 25px rgba(0, 255, 0, 0.6)';
                break;
            case 'tired':
                eyeOuter.style.borderColor = '#666666';
                eyeOuter.style.boxShadow = '0 0 15px rgba(102, 102, 102, 0.4)';
                break;
            default:
                eyeOuter.style.borderColor = '#ff0066';
                eyeOuter.style.boxShadow = '0 0 20px rgba(255, 0, 102, 0.5)';
        }
    }

    updateStatus() {
        const statusElement = document.getElementById('eye-status');
        const moodElement = document.getElementById('eye-mood');
        const focusElement = document.getElementById('focus-target');
        
        if (statusElement) statusElement.textContent = '👁 WATCHING';
        if (focusElement) focusElement.textContent = this.focusTarget;
        
        if (moodElement) {
            const moodEmojis = {
                neutral: '😐 NEUTRAL',
                suspicious: '🤨 SUSPICIOUS',
                angry: '😠 ANGRY',
                pleased: '😊 PLEASED',
                tired: '😴 TIRED'
            };
            moodElement.textContent = moodEmojis[this.mood];
        }
    }

    showScanningText(text) {
        if (!this.scanningText) return;
        
        this.scanningText.textContent = text;
        
        gsap.killTweensOf(this.scanningText);
        gsap.to(this.scanningText, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        // Position near the eye
        const eyeRect = this.eyeCursor.getBoundingClientRect();
        this.scanningText.style.left = (eyeRect.right + 10) + 'px';
        this.scanningText.style.top = (eyeRect.top - 10) + 'px';
    }

    hideScanningText() {
        if (!this.scanningText) return;
        
        gsap.to(this.scanningText, {
            opacity: 0,
            y: -10,
            duration: 0.3,
            ease: 'power2.in'
        });
    }

    showJudgement(message, duration = 3000) {
        const judgement = document.createElement('div');
        judgement.className = 'judgement-popup';
        judgement.innerHTML = `
            <div class="text-lg mb-2">👁 EYE JUDGEMENT</div>
            <div>${message}</div>
        `;
        
        // Position in center of screen
        judgement.style.left = '50%';
        judgement.style.top = '30%';
        judgement.style.transform = 'translate(-50%, -50%)';
        
        document.body.appendChild(judgement);
        
        gsap.fromTo(judgement, 
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
        );
        
        setTimeout(() => {
            gsap.to(judgement, {
                opacity: 0,
                scale: 0.8,
                duration: 0.5,
                onComplete: () => {
                    if (judgement.parentNode) {
                        judgement.parentNode.removeChild(judgement);
                    }
                }
            });
        }, duration);
    }

    playSound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            let frequency, duration, waveType;
            
            switch(type) {
                case 'start':
                    frequency = 300;
                    duration = 800;
                    waveType = 'sine';
                    break;
                case 'blink':
                    frequency = 150;
                    duration = 100;
                    waveType = 'sine';
                    break;
                case 'click':
                    frequency = 500;
                    duration = 150;
                    waveType = 'square';
                    break;
                default:
                    frequency = 200;
                    duration = 200;
                    waveType = 'sine';
            }
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = waveType;
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
        } catch (e) {
            console.log('Audio not available');
        }
    }

    cleanup() {
        if (this.blinkInterval) clearInterval(this.blinkInterval);
        if (this.judgementTimer) clearInterval(this.judgementTimer);
        if (this.bloodshotTimer) clearTimeout(this.bloodshotTimer);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const watchingEye = new WatchingEye();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        watchingEye.cleanup();
    });
});