// Debug Squash Experiment JavaScript

class DebugSquash {
    constructor() {
        this.score = 0;
        this.bugsSquashed = 0;
        this.combo = 0;
        this.comboTimer = null;
        this.gameTime = 0;
        this.gameTimer = null;
        this.isGameActive = false;
        this.bugs = [];
        this.spawnTimer = null;
        this.bossCountdown = 10;
        this.activeBosses = [];
        
        this.bugTypes = {
            syntax: { emoji: '🐛', points: 10, speed: 2, color: '#ffff00' },
            logic: { emoji: '🕷️', points: 20, speed: 3, color: '#ff6600' },
            memory: { emoji: '🦟', points: 30, speed: 5, color: '#ff0066' },
            race: { emoji: '🪲', points: 50, speed: 4, color: '#0066ff', erratic: true }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showGameModal();
    }

    setupEventListeners() {
        // Start button
        document.getElementById('start-debugging').addEventListener('click', () => {
            this.startGame();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.endGame();
                window.location.href = '../index.html';
            }
            
            if (e.key === ' ' && this.isGameActive) {
                e.preventDefault();
                this.spawnBug(); // Manual bug spawn for testing
            }
        });
    }

    showGameModal() {
        const modal = document.getElementById('game-modal');
        gsap.fromTo(modal, 
            { opacity: 0 },
            { opacity: 1, duration: 0.5 }
        );
    }

    startGame() {
        this.isGameActive = true;
        
        // Hide modal
        const modal = document.getElementById('game-modal');
        gsap.to(modal, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                modal.style.display = 'none';
            }
        });
        
        // Start game timers
        this.startGameTimer();
        this.startBugSpawning();
        
        // Play start sound
        this.playSound('start');
        
        this.updateDisplay();
    }

    startGameTimer() {
        this.gameTimer = setInterval(() => {
            this.gameTime++;
            this.updateTimeDisplay();
        }, 1000);
    }

    startBugSpawning() {
        this.spawnTimer = setInterval(() => {
            if (this.isGameActive) {
                this.spawnBug();
            }
        }, 2000 - Math.min(this.gameTime * 10, 1500)); // Spawn rate increases over time
    }

    spawnBug() {
        // Check if we should spawn a boss
        if (this.bossCountdown <= 0) {
            this.spawnBossBug();
            this.bossCountdown = 10;
            return;
        }

        const bugTypeKeys = Object.keys(this.bugTypes);
        const randomType = bugTypeKeys[Math.floor(Math.random() * bugTypeKeys.length)];
        const bugData = this.bugTypes[randomType];
        
        const bug = this.createBugElement(randomType, bugData);
        this.bugs.push(bug);
        
        this.animateBug(bug, bugData);
    }

    spawnBossBug() {
        const bug = this.createBugElement('boss', {
            emoji: '🕸️',
            points: 100,
            speed: 2,
            color: '#ff0066',
            health: 3
        });
        
        bug.classList.add('boss-bug');
        bug.dataset.health = '3';
        bug.dataset.maxHealth = '3';
        
        this.bugs.push(bug);
        this.activeBosses.push(bug);
        
        this.animateBug(bug, { speed: 2, erratic: true });
        
        // Boss announcement
        this.showComboText('BOSS BUG APPEARED!', 2000);
        this.playSound('boss');
    }

    createBugElement(type, data) {
        const bug = document.createElement('div');
        bug.className = 'bug';
        bug.textContent = data.emoji;
        bug.dataset.type = type;
        bug.dataset.points = data.points;
        bug.style.color = data.color;
        
        // Random spawn position (edges of screen)
        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        switch(side) {
            case 0: // top
                bug.style.left = Math.random() * screenWidth + 'px';
                bug.style.top = '-50px';
                break;
            case 1: // right
                bug.style.left = screenWidth + 'px';
                bug.style.top = Math.random() * screenHeight + 'px';
                break;
            case 2: // bottom
                bug.style.left = Math.random() * screenWidth + 'px';
                bug.style.top = screenHeight + 'px';
                break;
            case 3: // left
                bug.style.left = '-50px';
                bug.style.top = Math.random() * screenHeight + 'px';
                break;
        }
        
        // Click handler
        bug.addEventListener('click', (e) => {
            e.preventDefault();
            this.squashBug(bug);
        });
        
        document.body.appendChild(bug);
        return bug;
    }

    animateBug(bug, data) {
        const startX = parseFloat(bug.style.left);
        const startY = parseFloat(bug.style.top);
        
        // Random target position
        const targetX = Math.random() * (window.innerWidth - 100);
        const targetY = Math.random() * (window.innerHeight - 100);
        
        const distance = Math.sqrt(Math.pow(targetX - startX, 2) + Math.pow(targetY - startY, 2));
        const duration = distance / (data.speed * 50); // Adjust speed calculation
        
        let animation;
        
        if (data.erratic) {
            // Erratic movement for race conditions
            animation = gsap.timeline({ repeat: -1 })
                .to(bug, {
                    x: targetX - startX,
                    y: targetY - startY,
                    duration: duration,
                    ease: 'none'
                })
                .to(bug, {
                    x: Math.random() * window.innerWidth - startX,
                    y: Math.random() * window.innerHeight - startY,
                    duration: duration * 0.5,
                    ease: 'power2.inOut'
                });
        } else {
            // Normal movement
            animation = gsap.to(bug, {
                x: targetX - startX,
                y: targetY - startY,
                duration: duration,
                ease: 'none',
                repeat: -1,
                yoyo: true,
                onRepeat: () => {
                    // Change target on repeat
                    const newTargetX = Math.random() * (window.innerWidth - 100);
                    const newTargetY = Math.random() * (window.innerHeight - 100);
                    gsap.set(animation, {
                        x: newTargetX - parseFloat(bug.style.left),
                        y: newTargetY - parseFloat(bug.style.top)
                    });
                }
            });
        }
        
        // Remove bug if it escapes (after some time)
        setTimeout(() => {
            if (bug.parentNode && !bug.classList.contains('squashed')) {
                this.bugEscaped(bug);
            }
        }, (duration + 5) * 1000);
    }

    squashBug(bug) {
        if (bug.classList.contains('squashed')) return;
        
        const bugType = bug.dataset.type;
        const points = parseInt(bug.dataset.points);
        const rect = bug.getBoundingClientRect();
        
        // Handle boss bugs
        if (bugType === 'boss') {
            const currentHealth = parseInt(bug.dataset.health);
            const newHealth = currentHealth - 1;
            bug.dataset.health = newHealth;
            
            if (newHealth > 0) {
                // Boss not defeated yet
                this.createSplat(rect.left + rect.width/2, rect.top + rect.height/2);
                this.showPointsPopup(25, rect.left + rect.width/2, rect.top + rect.height/2);
                this.score += 25;
                this.playSound('hit');
                
                // Visual feedback for boss hit
                gsap.timeline()
                    .to(bug, { scale: 1.2, duration: 0.1 })
                    .to(bug, { scale: 1, duration: 0.1 })
                    .to(bug, { opacity: 0.5, duration: 0.1 })
                    .to(bug, { opacity: 1, duration: 0.1 });
                
                this.updateDisplay();
                return;
            } else {
                // Boss defeated
                this.activeBosses = this.activeBosses.filter(b => b !== bug);
                this.showComboText('BOSS DEFEATED!', 2000);
            }
        }
        
        // Regular squash
        bug.classList.add('squashed');
        this.bugsSquashed++;
        this.score += points;
        this.bossCountdown--;
        
        // Combo system
        this.combo++;
        if (this.comboTimer) clearTimeout(this.comboTimer);
        this.comboTimer = setTimeout(() => {
            this.combo = 0;
            this.updateDisplay();
        }, 2000);
        
        // Show effects
        this.createSplat(rect.left + rect.width/2, rect.top + rect.height/2);
        this.showPointsPopup(points * (1 + this.combo * 0.1), rect.left + rect.width/2, rect.top + rect.height/2);
        
        // Combo bonuses
        if (this.combo >= 5) {
            this.showComboText(`${this.combo}x COMBO!`, 1000);
            this.score += this.combo * 10; // Bonus points
        }
        
        // Remove bug
        setTimeout(() => {
            if (bug.parentNode) {
                bug.parentNode.removeChild(bug);
            }
            this.bugs = this.bugs.filter(b => b !== bug);
        }, 500);
        
        this.playSound('squash');
        this.updateDisplay();
    }

    bugEscaped(bug) {
        if (bug.parentNode) {
            bug.parentNode.removeChild(bug);
        }
        this.bugs = this.bugs.filter(b => b !== bug);
        
        // Penalty for escaped bugs
        this.combo = 0;
        this.playSound('escape');
        
        // Show escaped message
        const rect = bug.getBoundingClientRect();
        this.showPointsPopup('ESCAPED!', rect.left + rect.width/2, rect.top + rect.height/2, '#ff0000');
    }

    createSplat(x, y) {
        const splat = document.createElement('div');
        splat.className = 'splat';
        splat.style.left = (x - 15) + 'px';
        splat.style.top = (y - 15) + 'px';
        
        document.body.appendChild(splat);
        
        setTimeout(() => {
            if (splat.parentNode) {
                splat.parentNode.removeChild(splat);
            }
        }, 1000);
    }

    showPointsPopup(points, x, y, color = '#00ff88') {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = typeof points === 'number' ? `+${Math.floor(points)}` : points;
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';
        popup.style.color = color;
        
        document.body.appendChild(popup);
        
        gsap.timeline()
            .to(popup, {
                y: -50,
                opacity: 0,
                duration: 1,
                ease: 'power2.out',
                onComplete: () => {
                    if (popup.parentNode) {
                        popup.parentNode.removeChild(popup);
                    }
                }
            });
    }

    showComboText(text, duration = 1000) {
        const comboDisplay = document.getElementById('combo-display');
        comboDisplay.textContent = text;
        
        gsap.timeline()
            .to(comboDisplay, { opacity: 1, scale: 1.2, duration: 0.3, ease: 'back.out(1.7)' })
            .to(comboDisplay, { opacity: 0, scale: 1, duration: 0.5, delay: duration/1000 });
    }

    updateDisplay() {
        document.getElementById('score').textContent = Math.floor(this.score);
        document.getElementById('bugs-squashed').textContent = this.bugsSquashed;
        document.getElementById('combo').textContent = this.combo;
        document.getElementById('boss-countdown').textContent = this.bossCountdown;
    }

    updateTimeDisplay() {
        const minutes = Math.floor(this.gameTime / 60).toString().padStart(2, '0');
        const seconds = (this.gameTime % 60).toString().padStart(2, '0');
        document.getElementById('time').textContent = `${minutes}:${seconds}`;
    }

    endGame() {
        this.isGameActive = false;
        
        if (this.gameTimer) clearInterval(this.gameTimer);
        if (this.spawnTimer) clearInterval(this.spawnTimer);
        if (this.comboTimer) clearTimeout(this.comboTimer);
        
        // Remove all bugs
        this.bugs.forEach(bug => {
            if (bug.parentNode) {
                bug.parentNode.removeChild(bug);
            }
        });
        this.bugs = [];
        this.activeBosses = [];
    }

    playSound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            let frequency, duration, waveType;
            
            switch(type) {
                case 'start':
                    frequency = 400;
                    duration = 500;
                    waveType = 'sawtooth';
                    break;
                case 'squash':
                    frequency = 200;
                    duration = 200;
                    waveType = 'square';
                    break;
                case 'hit':
                    frequency = 300;
                    duration = 150;
                    waveType = 'sine';
                    break;
                case 'boss':
                    frequency = 150;
                    duration = 800;
                    waveType = 'sawtooth';
                    break;
                case 'escape':
                    frequency = 100;
                    duration = 400;
                    waveType = 'triangle';
                    break;
                default:
                    frequency = 250;
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new DebugSquash();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        game.endGame();
    });
});