// Throw Rock Experiment JavaScript

class ThrowRock {
    constructor() {
        this.score = 0;
        this.rocksThrown = 0;
        this.elementsHit = 0;
        this.throwableElements = [];
        this.isActive = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.prepareThrowableElements();
        this.showInstructions();
    }

    setupEventListeners() {
        // Start button
        document.getElementById('start-throwing').addEventListener('click', () => {
            this.startGame();
        });

        // Main click handler for throwing rocks
        document.addEventListener('click', (e) => {
            if (!this.isActive) return;
            
            // Don't throw rocks on UI elements like exit button
            if (e.target.closest('.terminal-header a') || 
                e.target.closest('#instructions') ||
                e.target.id === 'start-throwing') {
                return;
            }
            
            this.throwRock(e.clientX, e.clientY);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.location.href = '../index.html';
            }
            
            if (e.key === ' ' && this.isActive) {
                e.preventDefault();
                // Throw rock at center of screen
                this.throwRock(window.innerWidth / 2, window.innerHeight / 2);
            }
        });
    }

    prepareThrowableElements() {
        this.throwableElements = document.querySelectorAll('.throwable');
        
        // Add hover effects to show they're targetable
        this.throwableElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (this.isActive) {
                    gsap.to(element, {
                        boxShadow: '0 0 20px rgba(255, 255, 0, 0.5)',
                        duration: 0.3
                    });
                }
            });
            
            element.addEventListener('mouseleave', () => {
                gsap.to(element, {
                    boxShadow: 'none',
                    duration: 0.3
                });
            });
        });
    }

    showInstructions() {
        const instructions = document.getElementById('instructions');
        gsap.fromTo(instructions, 
            { opacity: 0 },
            { opacity: 1, duration: 0.5 }
        );
    }

    startGame() {
        this.isActive = true;
        
        // Hide instructions
        const instructions = document.getElementById('instructions');
        gsap.to(instructions, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                instructions.style.display = 'none';
            }
        });
        
        // Play start sound
        this.playSound('start');
        
        // Show game started message
        this.showMessage('🪨 Rock throwing mode activated! Click anywhere to throw!', 3000);
    }

    throwRock(targetX, targetY) {
        this.rocksThrown++;
        this.updateScore();
        
        // Create rock element
        const rock = document.createElement('div');
        rock.className = 'rock';
        
        // Start position (bottom center of screen)
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight - 50;
        
        rock.style.left = startX + 'px';
        rock.style.top = startY + 'px';
        
        document.body.appendChild(rock);
        
        // Animate rock flight
        const distance = Math.sqrt(Math.pow(targetX - startX, 2) + Math.pow(targetY - startY, 2));
        const flightTime = Math.min(1, distance / 1000); // Scale flight time by distance
        
        gsap.timeline()
            .to(rock, {
                x: targetX - startX,
                y: targetY - startY,
                rotation: 720, // Spinning rock
                duration: flightTime,
                ease: 'power2.out'
            })
            .call(() => {
                this.handleImpact(targetX, targetY, rock);
            });
        
        // Play throw sound
        this.playSound('throw');
    }

    handleImpact(x, y, rock) {
        // Create impact effect
        this.createImpactEffect(x, y);
        
        // Check what was hit
        const hitElement = this.findHitElement(x, y);
        
        if (hitElement) {
            this.hitElement(hitElement, x, y);
            this.elementsHit++;
        }
        
        // Remove rock
        if (rock.parentNode) {
            rock.parentNode.removeChild(rock);
        }
        
        // Update display
        this.updateScore();
        
        // Play impact sound
        this.playSound('impact');
    }

    createImpactEffect(x, y) {
        // Create impact ring
        const impact = document.createElement('div');
        impact.className = 'impact';
        impact.style.left = (x - 50) + 'px';
        impact.style.top = (y - 50) + 'px';
        
        document.body.appendChild(impact);
        
        // Remove after animation
        setTimeout(() => {
            if (impact.parentNode) {
                impact.parentNode.removeChild(impact);
            }
        }, 500);
        
        // Create glass shards
        this.createGlassShards(x, y);
    }

    createGlassShards(x, y) {
        const numShards = 8 + Math.floor(Math.random() * 8);
        
        for (let i = 0; i < numShards; i++) {
            const shard = document.createElement('div');
            shard.className = 'glass-shard';
            
            const size = 3 + Math.random() * 8;
            shard.style.width = size + 'px';
            shard.style.height = size + 'px';
            shard.style.left = x + 'px';
            shard.style.top = y + 'px';
            
            document.body.appendChild(shard);
            
            // Animate shard
            const angle = (Math.PI * 2 * i) / numShards;
            const velocity = 50 + Math.random() * 100;
            const dx = Math.cos(angle) * velocity;
            const dy = Math.sin(angle) * velocity + Math.random() * 50; // Add some randomness
            
            gsap.to(shard, {
                x: dx,
                y: dy,
                rotation: Math.random() * 360,
                opacity: 0,
                duration: 1 + Math.random(),
                ease: 'power2.out',
                onComplete: () => {
                    if (shard.parentNode) {
                        shard.parentNode.removeChild(shard);
                    }
                }
            });
        }
    }

    findHitElement(x, y) {
        // Get the element at the click position
        const elementsAtPoint = document.elementsFromPoint(x, y);
        
        // Find the first throwable element
        for (let element of elementsAtPoint) {
            if (element.classList.contains('throwable') && !element.classList.contains('cracked')) {
                return element;
            }
        }
        
        return null;
    }

    hitElement(element, x, y) {
        const points = parseInt(element.dataset.points) || 1;
        this.score += points;
        
        // Add crack effect
        element.classList.add('cracked');
        
        // Shake animation
        gsap.timeline()
            .to(element, {
                x: -5,
                duration: 0.05
            })
            .to(element, {
                x: 5,
                duration: 0.05
            })
            .to(element, {
                x: -3,
                duration: 0.05
            })
            .to(element, {
                x: 3,
                duration: 0.05
            })
            .to(element, {
                x: 0,
                duration: 0.05
            });
        
        // Show points gained
        this.showPoints(points, x, y);
        
        // Random chance to completely shatter
        if (Math.random() < 0.3) { // 30% chance
            setTimeout(() => {
                this.shatterElement(element);
            }, 500);
        }
    }

    shatterElement(element) {
        element.classList.add('shattered');
        
        // Bonus points for shattering
        const bonusPoints = 10;
        this.score += bonusPoints;
        
        const rect = element.getBoundingClientRect();
        this.showPoints(bonusPoints, rect.left + rect.width / 2, rect.top + rect.height / 2);
        
        // Remove element after animation
        setTimeout(() => {
            if (element.parentNode) {
                element.style.visibility = 'hidden';
            }
        }, 1000);
        
        this.updateScore();
    }

    showPoints(points, x, y) {
        const pointsDisplay = document.createElement('div');
        pointsDisplay.textContent = `+${points}`;
        pointsDisplay.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            color: #ffff00;
            font-weight: bold;
            font-size: 24px;
            pointer-events: none;
            z-index: 1002;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        `;
        
        document.body.appendChild(pointsDisplay);
        
        gsap.timeline()
            .to(pointsDisplay, {
                y: -50,
                opacity: 0,
                scale: 1.5,
                duration: 1,
                ease: 'power2.out',
                onComplete: () => {
                    if (pointsDisplay.parentNode) {
                        pointsDisplay.parentNode.removeChild(pointsDisplay);
                    }
                }
            });
    }

    showMessage(message, duration = 2000) {
        const messageEl = document.createElement('div');
        messageEl.innerHTML = `
            <div class="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-black px-6 py-3 rounded border-2 border-yellow-400 font-bold text-center z-50">
                ${message}
            </div>
        `;
        document.body.appendChild(messageEl);
        
        gsap.fromTo(messageEl, 
            { opacity: 0, y: -50 },
            { opacity: 1, y: 0, duration: 0.5 }
        );
        
        setTimeout(() => {
            gsap.to(messageEl, {
                opacity: 0,
                y: -50,
                duration: 0.5,
                onComplete: () => {
                    if (messageEl.parentNode) {
                        messageEl.parentNode.removeChild(messageEl);
                    }
                }
            });
        }, duration);
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('rocks-thrown').textContent = this.rocksThrown;
        document.getElementById('elements-hit').textContent = this.elementsHit;
        
        // Achievement checks
        this.checkAchievements();
    }

    checkAchievements() {
        if (this.score >= 100 && !this.achievements?.score100) {
            this.showMessage('🏆 Achievement: First Century! (100+ points)', 4000);
            this.achievements = { ...this.achievements, score100: true };
        }
        
        if (this.score >= 500 && !this.achievements?.score500) {
            this.showMessage('🏆 Achievement: Rock Master! (500+ points)', 4000);
            this.achievements = { ...this.achievements, score500: true };
        }
        
        if (this.elementsHit >= 10 && !this.achievements?.hit10) {
            this.showMessage('🏆 Achievement: Sharpshooter! (10+ hits)', 4000);
            this.achievements = { ...this.achievements, hit10: true };
        }
        
        if (this.rocksThrown >= 50 && !this.achievements?.throw50) {
            this.showMessage('🏆 Achievement: Rock Thrower! (50+ throws)', 4000);
            this.achievements = { ...this.achievements, throw50: true };
        }
    }

    playSound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            let frequency, duration, type_wave;
            
            switch(type) {
                case 'throw':
                    frequency = 200;
                    duration = 200;
                    type_wave = 'sine';
                    break;
                case 'impact':
                    frequency = 100;
                    duration = 300;
                    type_wave = 'square';
                    break;
                case 'start':
                    frequency = 400;
                    duration = 500;
                    type_wave = 'sawtooth';
                    break;
                default:
                    frequency = 300;
                    duration = 150;
                    type_wave = 'sine';
            }
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = type_wave;
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
        } catch (e) {
            console.log('Audio not available');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThrowRock();
});