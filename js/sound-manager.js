/* ============================================
   SOUND MANAGER - Sound Management
   ============================================ */
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    // Synthesized gunshot sound
    playShoot() {
        if (!this.initialized) return;

        const ctx = this.audioContext;
        const duration = 0.15;

        // Create noise for gunshot
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        // Filter for gunshot sound
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 3000;

        // Volume envelope
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
    }

    // Hit sound (duck scream)
    playHit() {
        if (!this.initialized) return;

        const ctx = this.audioContext;

        // Create "duck scream" using frequency modulation
        const oscillator = ctx.createOscillator();
        const modulator = ctx.createOscillator();
        const modGain = ctx.createGain();
        const gain = ctx.createGain();

        // Main frequency with modulation for "clucking" effect
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(750, ctx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(875, ctx.currentTime + 0.05);
        oscillator.frequency.linearRampToValueAtTime(625, ctx.currentTime + 0.1);
        oscillator.frequency.linearRampToValueAtTime(812, ctx.currentTime + 0.15);
        oscillator.frequency.linearRampToValueAtTime(500, ctx.currentTime + 0.25);

        // Modulator for trill effect
        modulator.type = 'sine';
        modulator.frequency.value = 30;
        modGain.gain.value = 50;

        modulator.connect(modGain);
        modGain.connect(oscillator.frequency);

        // Volume envelope
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.35);
        modulator.start(ctx.currentTime);
        modulator.stop(ctx.currentTime + 0.35);
    }

    // Miss sound (funny "oops")
    playMiss() {
        if (!this.initialized) return;

        const ctx = this.audioContext;

        // Funny descending sound with vibration
        const oscillator = ctx.createOscillator();
        const modulator = ctx.createOscillator();
        const modGain = ctx.createGain();
        const gain = ctx.createGain();

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(450, ctx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(280, ctx.currentTime + 0.15);
        oscillator.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.25);
        oscillator.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.45);

        // Modulation for "wobble" effect
        modulator.type = 'sine';
        modulator.frequency.value = 10;
        modGain.gain.value = 40;

        modulator.connect(modGain);
        modGain.connect(oscillator.frequency);

        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.6);
        modulator.start(ctx.currentTime);
        modulator.stop(ctx.currentTime + 0.6);
    }

    // Game Over sound
    playGameOver() {
        if (!this.initialized) return;

        const ctx = this.audioContext;

        // Simple melody
        const notes = [523.25, 440.00, 392.00, 349.23, 329.63, 261.63];
        const duration = 0.4;

        notes.forEach((freq, index) => {
            const oscillator = ctx.createOscillator();
            const gain = ctx.createGain();

            oscillator.type = 'square';
            oscillator.frequency.value = freq;

            const startTime = ctx.currentTime + index * duration;
            gain.gain.setValueAtTime(0.1, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            oscillator.connect(gain);
            gain.connect(ctx.destination);
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
    }

    // Duck spawn sound
    playSpawn() {
        if (!this.initialized) return;

        const ctx = this.audioContext;

        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.1);
    }
}
