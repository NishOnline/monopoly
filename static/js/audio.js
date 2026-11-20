/*
 * Web Audio API Synthesizer for Richup.io
 * Procedurally generates all game sound effects with zero latency and zero asset dependencies.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    diceRoll() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        // 5 quick clatters simulating rolling dice
        for (let i = 0; i < 5; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(140 + Math.random() * 120, now + i * 0.06);
            gain.gain.setValueAtTime(0.15, now + i * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.04);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.06);
            osc.stop(now + i * 0.06 + 0.05);
        }
    }

    diceResult() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        [0, 0.05].forEach((delay, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(220 + idx * 40, now + delay);
            gain.gain.setValueAtTime(0.25, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.1);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + delay);
            osc.stop(now + delay + 0.11);
        });
    }

    pawnHop() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.04);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
    }

    moneyGain() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);
            gain.gain.setValueAtTime(0.2, now + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.26);
        });
    }

    moneyPay() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.12);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
    }

    purchaseProperty() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);
            gain.gain.setValueAtTime(0.12, now + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.31);
        });
    }

    buildHouse() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        // Two hammer taps
        [0, 0.09].forEach(delay => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, now + delay);
            osc.frequency.exponentialRampToValueAtTime(200, now + delay + 0.04);
            gain.gain.setValueAtTime(0.2, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + delay);
            osc.stop(now + delay + 0.06);
        });
    }

    jailClang() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.3);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
    }

    auctionGavel() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
    }

    bankruptcy() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const freqs = [300, 270, 240, 200];
        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + idx * 0.15);
            gain.gain.setValueAtTime(0.2, now + idx * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.15);
            osc.stop(now + idx * 0.15 + 0.26);
        });
    }

    victory() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.1);
            gain.gain.setValueAtTime(0.25, now + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.6);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.1);
            osc.stop(now + idx * 0.1 + 0.65);
        });
    }

    monopolySet() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        // Brilliant celebratory 4-note brass fanfare
        const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.3, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.52);
        });
    }

    swish() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
    }

    propertyBought() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        // 1. Crisp metallic coin "ka-ching"
        const chings = [1200, 1800, 2400];
        chings.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.04);
            gain.gain.setValueAtTime(0.22, now + idx * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.18);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.04);
            osc.stop(now + idx * 0.04 + 0.2);
        });

        // 2. Triumphant rising property fanfare (G5, C6, E6, G6)
        const notes = [783.99, 1046.50, 1318.51, 1567.98];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + 0.12 + idx * 0.06);
            gain.gain.setValueAtTime(0.25, now + 0.12 + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12 + idx * 0.06 + 0.35);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + 0.12 + idx * 0.06);
            osc.stop(now + 0.12 + idx * 0.06 + 0.36);
        });
    }

    rentPaid() {
        if (!this.enabled) return;
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        const now = this.ctx.currentTime;
        // Two crisp high-pitched coin chinks
        [0, 0.08].forEach((delay, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(idx === 0 ? 880 : 740, now + delay);
            gain.gain.setValueAtTime(0.35, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.12);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + delay);
            osc.stop(now + delay + 0.13);
        });

        // Downward cash loss slide / buzzer
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(450, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.42);
        gain.gain.setValueAtTime(0.32, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + 0.12);
        osc.stop(now + 0.46);
    }
}

window.soundEngine = new SoundEngine();
