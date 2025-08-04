// Control Room JavaScript

class ControlRoom {
    constructor() {
        this.state = {
            chaosLevel: 50,
            glitchIntensity: 25,
            temperature: 50,
            gravityEnabled: true,
            partyMode: false,
            colorMode: 'normal',
            realityStability: 89,
            cpuUsage: 34,
            memoryUsage: 67,
            uptime: 0
        };
        
        this.terminalLines = [];
        this.maxTerminalLines = 20;
        this.uptimeTimer = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startSystemMonitoring();
        this.logToTerminal('> Control Room fully operational');
        this.logToTerminal('> All systems responding normally');
        this.updateAllDisplays();
    }

    setupEventListeners() {
        // Knob controls
        this.setupKnob('chaos-knob', (value) => {
            this.state.chaosLevel = value;
            this.updateChaosLevel();
        });
        
        this.setupKnob('glitch-knob', (value) => {
            this.state.glitchIntensity = value;
            this.updateGlitchIntensity();
        });

        // Toggle switches
        this.setupToggle('gravity-toggle', (enabled) => {
            this.state.gravityEnabled = enabled;
            this.updateGravity();
        });
        
        this.setupToggle('party-toggle', (enabled) => {
            this.state.partyMode = enabled;
            this.updatePartyMode();
        });

        // Sliders
        document.getElementById('temp-slider').addEventListener('input', (e) => {
            this.state.temperature = parseInt(e.target.value);
            this.updateTemperature();
        });

        // Color mode buttons
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.state.colorMode = btn.dataset.mode;
                this.updateColorMode();
            });
        });

        // Emergency buttons
        document.getElementById('panic-btn').addEventListener('click', () => {
            this.panicButton();
        });
        
        document.getElementById('random-btn').addEventListener('click', () => {
            this.randomizeAll();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.location.href = '../index.html';
            }
            
            if (e.key === ' ') {
                e.preventDefault();
                this.panicButton();
            }
            
            if (e.key === 'r' || e.key === 'R') {
                this.randomizeAll();
            }
        });
    }

    setupKnob(knobId, callback) {
        const knob = document.getElementById(knobId);
        let isDragging = false;
        let startAngle = 0;
        let currentValue = parseInt(knob.dataset.value);

        knob.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = knob.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const rect = knob.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            
            const angleDiff = currentAngle - startAngle;
            const valueChange = (angleDiff * 180) / Math.PI;
            
            currentValue = Math.max(0, Math.min(100, currentValue + valueChange / 3));
            knob.dataset.value = Math.round(currentValue);
            
            this.updateKnobVisual(knob, currentValue);
            callback(Math.round(currentValue));
            
            startAngle = currentAngle;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Click to set value
        knob.addEventListener('click', (e) => {
            if (!isDragging) {
                const rect = knob.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                
                // Convert angle to value (0-100)
                let normalizedAngle = (angle + Math.PI/2) * (180/Math.PI);
                if (normalizedAngle < 0) normalizedAngle += 360;
                
                currentValue = Math.max(0, Math.min(100, (normalizedAngle / 360) * 100));
                knob.dataset.value = Math.round(currentValue);
                
                this.updateKnobVisual(knob, currentValue);
                callback(Math.round(currentValue));
            }
        });
    }

    updateKnobVisual(knob, value) {
        const rotation = (value / 100) * 270 - 135; // -135 to 135 degrees
        knob.style.setProperty('--rotation', `${rotation}deg`);
        knob.querySelector('::before').style.transform = `translateX(-50%) rotate(${rotation}deg)`;
        
        // Alternative method for better browser support
        const beforeElement = knob.querySelector('::before') || knob;
        beforeElement.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
    }

    setupToggle(toggleId, callback) {
        const toggle = document.getElementById(toggleId);
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            callback(toggle.classList.contains('active'));
        });
    }

    updateChaosLevel() {
        const value = this.state.chaosLevel;
        document.getElementById('chaos-value').textContent = value;
        document.getElementById('chaos-meter').style.width = `${value}%`;
        
        // Update reality stability based on chaos
        this.state.realityStability = Math.max(10, 100 - (value * 0.8));
        
        // Apply chaos effects to page
        if (value > 70) {
            document.body.style.filter = `hue-rotate(${value}deg) saturate(${1 + value/100})`;
            this.logToTerminal(`> WARNING: High chaos detected (${value}%)`);
            this.updateStatusLight('chaos-status', 'red');
        } else if (value > 40) {
            document.body.style.filter = `hue-rotate(${value/2}deg)`;
            this.updateStatusLight('chaos-status', 'yellow');
        } else {
            document.body.style.filter = 'none';
            this.updateStatusLight('chaos-status', 'green');
        }
        
        this.logToTerminal(`> Chaos level adjusted to ${value}%`);
        this.playSound('adjust');
    }

    updateGlitchIntensity() {
        const value = this.state.glitchIntensity;
        document.getElementById('glitch-value').textContent = value;
        
        // Apply glitch effects
        if (value > 50) {
            this.startGlitchEffect();
            this.logToTerminal(`> Glitch effects activated (${value}%)`);
        } else {
            this.stopGlitchEffect();
        }
        
        this.logToTerminal(`> Glitch intensity set to ${value}%`);
        this.playSound('adjust');
    }

    updateGravity() {
        const enabled = this.state.gravityEnabled;
        const status = document.getElementById('gravity-status');
        
        if (enabled) {
            status.textContent = 'NORMAL';
            document.body.style.transition = 'transform 2s ease';
            document.body.style.transform = 'translateY(0)';
            gsap.set('*', { clearProps: 'transform' });
        } else {
            status.textContent = 'REVERSED';
            // Make elements float upward
            gsap.to('.control-panel', {
                y: -20,
                rotation: Math.random() * 4 - 2,
                duration: 2,
                ease: 'power2.out',
                stagger: 0.2
            });
        }
        
        this.logToTerminal(`> Gravity ${enabled ? 'restored' : 'disabled'}`);
        this.playSound('toggle');
    }

    updatePartyMode() {
        const enabled = this.state.partyMode;
        
        if (enabled) {
            this.startPartyMode();
            this.logToTerminal('> PARTY MODE ACTIVATED! 🎉');
        } else {
            this.stopPartyMode();
            this.logToTerminal('> Party mode deactivated');
        }
        
        this.playSound('toggle');
    }

    updateTemperature() {
        const temp = this.state.temperature;
        document.getElementById('temp-value').textContent = `${temp}°C`;
        
        // Apply temperature effects
        if (temp > 70) {
            document.body.style.filter = `${document.body.style.filter} sepia(0.3) saturate(1.5)`;
            this.logToTerminal(`> High temperature warning: ${temp}°C`);
        } else if (temp < 30) {
            document.body.style.filter = `${document.body.style.filter} hue-rotate(200deg) brightness(0.8)`;
            this.logToTerminal(`> Low temperature detected: ${temp}°C`);
        }
        
        this.logToTerminal(`> Temperature adjusted to ${temp}°C`);
    }

    updateColorMode() {
        const mode = this.state.colorMode;
        
        switch(mode) {
            case 'normal':
                document.body.style.filter = 'none';
                break;
            case 'inverted':
                document.body.style.filter = 'invert(1) hue-rotate(180deg)';
                break;
            case 'psychedelic':
                document.body.style.filter = 'hue-rotate(90deg) saturate(2) contrast(1.5)';
                this.startPsychedelicMode();
                break;
        }
        
        this.logToTerminal(`> Color mode changed to ${mode.toUpperCase()}`);
        this.playSound('toggle');
    }

    startGlitchEffect() {
        const intensity = this.state.glitchIntensity;
        
        setInterval(() => {
            if (Math.random() < intensity / 100) {
                document.body.style.transform = `translateX(${Math.random() * 4 - 2}px)`;
                setTimeout(() => {
                    document.body.style.transform = 'translateX(0)';
                }, 100);
            }
        }, 500);
    }

    stopGlitchEffect() {
        document.body.style.transform = 'translateX(0)';
    }

    startPartyMode() {
        const colors = ['#ff0066', '#00ff88', '#0066ff', '#ffff00', '#ff6600'];
        let colorIndex = 0;
        
        this.partyInterval = setInterval(() => {
            document.body.style.borderTop = `5px solid ${colors[colorIndex]}`;
            document.querySelectorAll('.control-panel').forEach((panel, index) => {
                panel.style.borderColor = colors[(colorIndex + index) % colors.length];
            });
            colorIndex = (colorIndex + 1) % colors.length;
        }, 200);
        
        // Add disco ball effect
        document.body.classList.add('effect-active');
    }

    stopPartyMode() {
        if (this.partyInterval) {
            clearInterval(this.partyInterval);
            this.partyInterval = null;
        }
        
        document.body.style.borderTop = 'none';
        document.querySelectorAll('.control-panel').forEach(panel => {
            panel.style.borderColor = '#00ff88';
        });
        
        document.body.classList.remove('effect-active');
    }

    startPsychedelicMode() {
        let hue = 0;
        this.psychedelicInterval = setInterval(() => {
            document.body.style.filter = `hue-rotate(${hue}deg) saturate(2) contrast(1.5)`;
            hue = (hue + 5) % 360;
        }, 100);
    }

    panicButton() {
        this.logToTerminal('> PANIC BUTTON ACTIVATED!');
        this.logToTerminal('> Resetting all systems...');
        
        // Screen flash effect
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: red;
            z-index: 10000;
            opacity: 0;
        `;
        document.body.appendChild(flash);
        
        gsap.timeline()
            .to(flash, { opacity: 0.8, duration: 0.1 })
            .to(flash, { opacity: 0, duration: 0.2 })
            .to(flash, { opacity: 0.6, duration: 0.1 })
            .to(flash, { opacity: 0, duration: 0.3, onComplete: () => {
                flash.remove();
            }});
        
        // Reset all controls
        setTimeout(() => {
            this.resetAllControls();
            this.logToTerminal('> All systems reset to default');
            this.logToTerminal('> Reality stability restored');
        }, 1000);
        
        this.playSound('panic');
    }

    randomizeAll() {
        this.logToTerminal('> Randomizing all parameters...');
        
        // Randomize all values
        this.state.chaosLevel = Math.floor(Math.random() * 100);
        this.state.glitchIntensity = Math.floor(Math.random() * 100);
        this.state.temperature = Math.floor(Math.random() * 100);
        this.state.gravityEnabled = Math.random() > 0.5;
        this.state.partyMode = Math.random() > 0.7;
        
        const colorModes = ['normal', 'inverted', 'psychedelic'];
        this.state.colorMode = colorModes[Math.floor(Math.random() * colorModes.length)];
        
        this.updateAllControls();
        this.logToTerminal('> All parameters randomized!');
        this.playSound('random');
    }

    resetAllControls() {
        // Reset to default values
        this.state = {
            chaosLevel: 50,
            glitchIntensity: 25,
            temperature: 50,
            gravityEnabled: true,
            partyMode: false,
            colorMode: 'normal',
            realityStability: 89,
            cpuUsage: 34,
            memoryUsage: 67,
            uptime: this.state.uptime
        };
        
        // Clear all effects
        document.body.style.filter = 'none';
        document.body.style.transform = 'none';
        document.body.style.borderTop = 'none';
        
        // Stop all intervals
        if (this.partyInterval) clearInterval(this.partyInterval);
        if (this.psychedelicInterval) clearInterval(this.psychedelicInterval);
        
        gsap.killTweensOf('*');
        
        this.updateAllControls();
    }

    updateAllControls() {
        // Update knobs
        document.getElementById('chaos-knob').dataset.value = this.state.chaosLevel;
        document.getElementById('glitch-knob').dataset.value = this.state.glitchIntensity;
        
        // Update toggles
        document.getElementById('gravity-toggle').classList.toggle('active', this.state.gravityEnabled);
        document.getElementById('party-toggle').classList.toggle('active', this.state.partyMode);
        
        // Update slider
        document.getElementById('temp-slider').value = this.state.temperature;
        
        // Update color mode
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === this.state.colorMode);
        });
        
        // Apply all effects
        this.updateChaosLevel();
        this.updateGlitchIntensity();
        this.updateGravity();
        this.updatePartyMode();
        this.updateTemperature();
        this.updateColorMode();
        this.updateAllDisplays();
    }

    updateStatusLight(lightId, color) {
        const light = document.getElementById(lightId);
        light.className = `status-light ${color}`;
    }

    startSystemMonitoring() {
        // Update system metrics
        setInterval(() => {
            this.state.cpuUsage = 20 + Math.random() * 60;
            this.state.memoryUsage = 40 + Math.random() * 40;
            
            document.getElementById('cpu-usage').textContent = `${Math.floor(this.state.cpuUsage)}%`;
            document.getElementById('memory-usage').textContent = `${Math.floor(this.state.memoryUsage)}%`;
            document.getElementById('reality-stability').textContent = `${Math.floor(this.state.realityStability)}%`;
            
            // Update status lights based on values
            if (this.state.realityStability < 30) {
                this.updateStatusLight('reality-status', 'red');
            } else if (this.state.realityStability < 60) {
                this.updateStatusLight('reality-status', 'yellow');
            } else {
                this.updateStatusLight('reality-status', 'green');
            }
        }, 2000);
        
        // Uptime counter
        this.uptimeTimer = setInterval(() => {
            this.state.uptime++;
            const hours = Math.floor(this.state.uptime / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((this.state.uptime % 3600) / 60).toString().padStart(2, '0');
            const seconds = (this.state.uptime % 60).toString().padStart(2, '0');
            document.getElementById('uptime').textContent = `${hours}:${minutes}:${seconds}`;
        }, 1000);
    }

    updateAllDisplays() {
        this.updateStatusLight('system-status', 'green');
    }

    logToTerminal(message) {
        const terminal = document.getElementById('terminal');
        const cursor = terminal.querySelector('.typing-cursor');
        
        if (cursor) cursor.remove();
        
        const line = document.createElement('div');
        line.textContent = message;
        terminal.appendChild(line);
        
        this.terminalLines.push(message);
        
        // Keep only last N lines
        if (this.terminalLines.length > this.maxTerminalLines) {
            this.terminalLines.shift();
            terminal.removeChild(terminal.firstChild);
        }
        
        // Add new cursor
        const newCursor = document.createElement('div');
        newCursor.className = 'typing-cursor';
        newCursor.textContent = '█';
        terminal.appendChild(newCursor);
        
        // Scroll to bottom
        terminal.scrollTop = terminal.scrollHeight;
    }

    playSound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            let frequency, duration, waveType;
            
            switch(type) {
                case 'adjust':
                    frequency = 400;
                    duration = 200;
                    waveType = 'sine';
                    break;
                case 'toggle':
                    frequency = 600;
                    duration = 150;
                    waveType = 'square';
                    break;
                case 'panic':
                    frequency = 200;
                    duration = 1000;
                    waveType = 'sawtooth';
                    break;
                case 'random':
                    frequency = 800;
                    duration = 500;
                    waveType = 'triangle';
                    break;
                default:
                    frequency = 300;
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
        if (this.uptimeTimer) clearInterval(this.uptimeTimer);
        if (this.partyInterval) clearInterval(this.partyInterval);
        if (this.psychedelicInterval) clearInterval(this.psychedelicInterval);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const controlRoom = new ControlRoom();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        controlRoom.cleanup();
    });
});