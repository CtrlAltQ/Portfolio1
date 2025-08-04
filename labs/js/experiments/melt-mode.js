// Melt Mode Experiment JavaScript

class MeltMode {
    constructor() {
        this.countdownTime = 5;
        this.isMelting = false;
        this.meltElements = [];
        this.emergencyStop = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startCountdown();
        this.prepareMeltElements();
    }

    setupEventListeners() {
        // Emergency stop button
        const emergencyBtn = document.getElementById('emergency-stop');
        emergencyBtn.addEventListener('click', () => {
            this.executeEmergencyStop();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.key === ' ') {
                e.preventDefault();
                this.executeEmergencyStop();
            }
            
            if (e.key === 'Enter' && !this.isMelting) {
                this.startMelting();
            }
        });
    }

    prepareMeltElements() {
        this.meltElements = document.querySelectorAll('.melt-element');
        
        // Add some visual preparation
        this.meltElements.forEach((element, index) => {
            gsap.set(element, { 
                transformOrigin: 'center bottom',
                position: 'relative'
            });
        });
    }

    startCountdown() {
        const timerElement = document.getElementById('timer');
        const countdownElement = document.getElementById('countdown');
        
        let timeLeft = this.countdownTime;
        
        const updateTimer = () => {
            timerElement.textContent = timeLeft;
            
            // Add urgency effects as time runs out
            if (timeLeft <= 3) {
                countdownElement.classList.add('animate-pulse');
                countdownElement.style.boxShadow = '0 0 20px rgba(255, 51, 51, 0.8)';
            }
            
            if (timeLeft <= 1) {
                countdownElement.style.background = '#ff0000';
                this.playAlarmSound();
            }
            
            timeLeft--;
            
            if (timeLeft < 0) {
                this.startMelting();
                return;
            }
            
            setTimeout(updateTimer, 1000);
        };
        
        updateTimer();
    }

    startMelting() {
        if (this.isMelting || this.emergencyStop) return;
        
        this.isMelting = true;
        
        // Hide countdown
        gsap.to('#countdown', { opacity: 0, duration: 0.5 });
        
        // Show emergency stop button
        const emergencyBtn = document.getElementById('emergency-stop');
        emergencyBtn.style.display = 'block';
        gsap.fromTo(emergencyBtn, 
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
        );
        
        // Add screen effects
        this.addScreenEffects();
        
        // Start melting elements with stagger
        this.meltElements.forEach((element, index) => {
            setTimeout(() => {
                if (!this.emergencyStop) {
                    this.meltElement(element);
                }
            }, index * 300 + Math.random() * 500);
        });
        
        // Show warning message
        this.showMeltWarning();
    }

    meltElement(element) {
        if (this.emergencyStop) return;
        
        // Create drip effects
        this.createDrips(element);
        
        // Apply melting animation
        element.classList.add('melting');
        
        // GSAP melting animation
        const tl = gsap.timeline();
        
        tl.to(element, {
            y: window.innerHeight + 100,
            scaleY: 2,
            scaleX: 0.8,
            rotationX: 45,
            opacity: 0,
            duration: 3,
            ease: 'power2.in',
            transformOrigin: 'center bottom'
        })
        .to(element, {
            filter: 'blur(5px) hue-rotate(45deg)',
            duration: 2
        }, 0);
        
        // Add random wobble during melt
        gsap.to(element, {
            x: `+=${Math.random() * 20 - 10}`,
            rotation: `+=${Math.random() * 10 - 5}`,
            duration: 0.1,
            repeat: 20,
            yoyo: true,
            ease: 'power2.inOut'
        });
    }

    createDrips(element) {
        const rect = element.getBoundingClientRect();
        const numDrips = 3 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < numDrips; i++) {
            const drip = document.createElement('div');
            drip.className = 'drip';
            drip.style.left = (rect.left + Math.random() * rect.width) + 'px';
            drip.style.top = (rect.bottom - 10) + 'px';
            drip.style.background = this.getRandomDripColor();
            
            document.body.appendChild(drip);
            
            // Remove drip after animation
            setTimeout(() => {
                if (drip.parentNode) {
                    drip.parentNode.removeChild(drip);
                }
            }, 2000);
        }
    }

    getRandomDripColor() {
        const colors = [
            'linear-gradient(to bottom, transparent, #ff3333)',
            'linear-gradient(to bottom, transparent, #ff6600)',
            'linear-gradient(to bottom, transparent, #ffff00)',
            'linear-gradient(to bottom, transparent, #ff0066)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    addScreenEffects() {
        // Add heat distortion effect to body
        gsap.to('body', {
            filter: 'hue-rotate(45deg) saturate(1.5)',
            duration: 5,
            ease: 'power2.inOut'
        });
        
        // Add random screen glitches
        this.startGlitchEffects();
        
        // Change background to fiery colors
        gsap.to('body', {
            background: 'radial-gradient(circle, #330000 0%, #000000 100%)',
            duration: 3
        });
    }

    startGlitchEffects() {
        const glitchInterval = setInterval(() => {
            if (this.emergencyStop) {
                clearInterval(glitchInterval);
                return;
            }
            
            document.body.style.filter = 'contrast(2) brightness(1.5) hue-rotate(90deg)';
            setTimeout(() => {
                document.body.style.filter = 'hue-rotate(45deg) saturate(1.5)';
            }, 50);
        }, 1000 + Math.random() * 2000);
    }

    showMeltWarning() {
        const warning = document.createElement('div');
        warning.innerHTML = `
            <div class="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white p-6 rounded border-4 border-yellow-400 text-center z-50">
                <div class="text-2xl font-bold mb-2">🔥 MELT PROTOCOL ENGAGED 🔥</div>
                <div class="text-lg">Reality.exe has stopped working</div>
                <div class="text-sm mt-2">Press SPACE or ESC for emergency stop</div>
            </div>
        `;
        document.body.appendChild(warning);
        
        // Remove warning after 4 seconds
        setTimeout(() => {
            if (warning.parentNode && !this.emergencyStop) {
                gsap.to(warning, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        if (warning.parentNode) {
                            warning.parentNode.removeChild(warning);
                        }
                    }
                });
            }
        }, 4000);
    }

    executeEmergencyStop() {
        if (this.emergencyStop) return;
        
        this.emergencyStop = true;
        this.isMelting = false;
        
        // Play emergency stop sound
        this.playEmergencySound();
        
        // Flash screen
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            z-index: 10000;
            opacity: 0;
        `;
        document.body.appendChild(flash);
        
        gsap.timeline()
            .to(flash, { opacity: 1, duration: 0.1 })
            .to(flash, { opacity: 0, duration: 0.2 })
            .to(flash, { opacity: 1, duration: 0.1 })
            .to(flash, { opacity: 0, duration: 0.3, onComplete: () => {
                flash.parentNode.removeChild(flash);
            }});
        
        // Stop all animations
        gsap.killTweensOf('*');
        
        // Remove all melting classes
        document.querySelectorAll('.melting').forEach(element => {
            element.classList.remove('melting');
        });
        
        // Reset all transforms
        gsap.set(this.meltElements, { 
            clearProps: 'all',
            filter: 'none'
        });
        
        // Reset body
        gsap.set('body', { 
            filter: 'none',
            background: 'black'
        });
        
        // Remove all drips
        document.querySelectorAll('.drip').forEach(drip => {
            drip.parentNode.removeChild(drip);
        });
        
        // Show success message
        this.showStoppedMessage();
    }

    showStoppedMessage() {
        const message = document.createElement('div');
        message.innerHTML = `
            <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 text-white p-8 rounded border-4 border-white text-center z-50">
                <div class="text-3xl font-bold mb-4">✅ EMERGENCY STOP SUCCESSFUL</div>
                <div class="text-lg mb-4">Reality has been restored</div>
                <div class="text-sm">The melting process has been halted</div>
                <button onclick="window.location.href='../index.html'" class="mt-4 bg-white text-green-600 px-6 py-2 rounded font-bold hover:bg-gray-100 transition-colors">
                    Return to Labs
                </button>
            </div>
        `;
        document.body.appendChild(message);
        
        // Hide emergency stop button
        gsap.to('#emergency-stop', { opacity: 0, duration: 0.5 });
        
        // Auto-return to labs after 10 seconds
        setTimeout(() => {
            gsap.to(message, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    window.location.href = '../index.html';
                }
            });
        }, 10000);
    }

    playAlarmSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            console.log('Audio not available');
        }
    }

    playEmergencySound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create a more complex emergency sound
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
                    oscillator.type = 'sawtooth';
                    
                    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.3);
                }, i * 100);
            }
        } catch (e) {
            console.log('Audio not available');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MeltMode();
});