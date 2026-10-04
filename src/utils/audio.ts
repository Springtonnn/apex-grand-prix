export interface MusicTrackMetadata {
  id: 1 | 2;
  title: string;
  artist: string;
  theme: string;
  bpm: number;
}

export const MUSIC_TRACKS: Record<1 | 2, MusicTrackMetadata> = {
  1: {
    id: 1,
    title: 'Neon Apex Grand Prix',
    artist: 'Original Arcade Synthesizer',
    theme: 'Eurobeat / Synthwave F1 Anthem',
    bpm: 134,
  },
  2: {
    id: 2,
    title: 'Shanghai Alice of Meiji 17',
    artist: 'Hong Meiling Theme',
    theme: 'Oriental Scarlet High-Speed Danmaku',
    bpm: 142,
  },
};

// Web Audio API Synthesizer for F1 SFX
class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (this.isArcadeEngineActive) {
        this.stopOutRunEngine();
      }
      this.stopRaceMusic();
    }
    return this.isMuted;
  }

  public setIsMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.isMuted) {
      if (this.isArcadeEngineActive) {
        this.stopOutRunEngine();
      }
      this.stopRaceMusic();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playCash() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [987.77, 1318.51, 1975.53].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.15, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.25);
    });
  }

  public playUpgrade() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playTrophy() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Celebratory brass/fanfare major triad
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.18, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.45);
    });
  }

  private celebrationNodes: { stop?: () => void; disconnect?: () => void }[] = [];

  public playCelebrationFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Triumphant F1 Championship Fanfare: Royal fanfare chord progression
    const notes = [
      // Call to attention: C5, E5, G5, C6
      { f: 523.25, t: 0.00, d: 0.28 },
      { f: 659.25, t: 0.22, d: 0.28 },
      { f: 783.99, t: 0.44, d: 0.38 },
      { f: 1046.50, t: 0.70, d: 0.85 },
      // Second phrase: G5, B5, D6, E6
      { f: 783.99, t: 1.50, d: 0.25 },
      { f: 987.77, t: 1.70, d: 0.25 },
      { f: 1174.66, t: 1.90, d: 0.35 },
      { f: 1318.51, t: 2.15, d: 1.20 },
      // Harmony support
      { f: 261.63, t: 0.00, d: 1.6 },
      { f: 392.00, t: 0.70, d: 1.2 },
      { f: 329.63, t: 1.50, d: 1.8 },
      { f: 523.25, t: 2.15, d: 2.0 },
    ];

    notes.forEach((note) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      
      // Low pass to give warm brass body
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now + note.t);
      filter.frequency.exponentialRampToValueAtTime(800, now + note.t + note.d);

      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0.0001, now + note.t);
      gain.gain.linearRampToValueAtTime(0.14, now + note.t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + note.t);
      osc.stop(now + note.t + note.d);

      this.celebrationNodes.push(osc);
    });

    // Crowd Cheering & Applause noise wash
    try {
      const bufferSize = this.ctx.sampleRate * 3.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        // Pink noise filter
        const white = Math.random() * 2 - 1;
        const pink = (lastOut + 0.02 * white) / 1.02;
        lastOut = pink;
        data[i] = pink * (0.8 + 0.2 * Math.sin(i / 1500));
      }

      const crowd = this.ctx.createBufferSource();
      crowd.buffer = buffer;

      const crowdFilter = this.ctx.createBiquadFilter();
      crowdFilter.type = 'bandpass';
      crowdFilter.frequency.setValueAtTime(1100, now + 0.6);
      crowdFilter.Q.setValueAtTime(1.5, now + 0.6);

      const crowdGain = this.ctx.createGain();
      crowdGain.gain.setValueAtTime(0.0001, now + 0.6);
      crowdGain.gain.linearRampToValueAtTime(0.15, now + 1.2);
      crowdGain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

      crowd.connect(crowdFilter);
      crowdFilter.connect(crowdGain);
      crowdGain.connect(this.ctx.destination);

      crowd.start(now + 0.6);
      this.celebrationNodes.push(crowd);
    } catch (e) {
      // Audio fallback
    }
  }

  public playChampagneSpray() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Cork Pop (Punchy percussive thump)
    const popOsc = this.ctx.createOscillator();
    const popGain = this.ctx.createGain();
    popOsc.type = 'sine';
    popOsc.frequency.setValueAtTime(450, now);
    popOsc.frequency.exponentialRampToValueAtTime(90, now + 0.08);

    popGain.gain.setValueAtTime(0.35, now);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    popOsc.connect(popGain);
    popGain.connect(this.ctx.destination);
    popOsc.start(now);
    popOsc.stop(now + 0.08);

    // 2. High-pressure champagne fizz spray hiss
    try {
      const sprayDuration = 1.6;
      const bufferSize = Math.floor(this.ctx.sampleRate * sprayDuration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin(i / 100);
      }

      const spraySource = this.ctx.createBufferSource();
      spraySource.buffer = buffer;

      const sprayFilter = this.ctx.createBiquadFilter();
      sprayFilter.type = 'highpass';
      sprayFilter.frequency.setValueAtTime(2400, now + 0.02);

      const sprayGain = this.ctx.createGain();
      sprayGain.gain.setValueAtTime(0.0001, now);
      sprayGain.gain.linearRampToValueAtTime(0.22, now + 0.06);
      sprayGain.gain.exponentialRampToValueAtTime(0.001, now + sprayDuration);

      spraySource.connect(sprayFilter);
      sprayFilter.connect(sprayGain);
      sprayGain.connect(this.ctx.destination);

      spraySource.start(now + 0.02);
    } catch (e) {
      // Audio fallback
    }
  }

  public playCameraShutter() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Fast double-click mechanical shutter
    [0, 0.07].forEach((delay) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, now + delay);
      osc.frequency.exponentialRampToValueAtTime(180, now + delay + 0.035);

      gain.gain.setValueAtTime(0.25, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.035);
    });
  }

  public stopCelebrationAudio() {
    this.celebrationNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // ignore
      }
    });
    this.celebrationNodes = [];
  }

  public playWheelGun() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    // Pneumatic wheel gun stutter sound
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.5));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.setValueAtTime(4, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  public playRadioBeep() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.setValueAtTime(1600, now + 0.06);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playEngineRev() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.linearRampToValueAtTime(380, now + 0.35);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.7);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.35);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.75);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.75);
  }

  public playAirJack() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // High-pressure pneumatic hiss
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2200, now);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  public playPitLimiterBeep() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(950, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  public playFumbleError() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.setValueAtTime(90, now + 0.08);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {
      // Audio fallback
    }
  }

  // Active cutscene audio nodes tracker for clean stoppage on skip
  private activeCutsceneNodes: { stop?: () => void; disconnect?: () => void }[] = [];
  private idleRumbleGain: GainNode | null = null;
  private idleRumbleOscs: OscillatorNode[] = [];

  public stopCutsceneAudio() {
    // Stop idle rumble if running
    this.stopEngineIdle();

    this.activeCutsceneNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // Already stopped
      }
    });
    this.activeCutsceneNodes = [];
  }

  // 1. Authentic F1 Start Gantry Mechanical "Thud" (Per Column)
  // Low sine ~110Hz dropping to ~60Hz within 0.12s + noise burst filtered at 800Hz
  public playF1LightThud() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // A. Low sine pitch drop (110Hz -> 60Hz)
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);

    oscGain.gain.setValueAtTime(0.35, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);

    // B. Short mechanical noise burst (click) filtered at ~800Hz
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.05); // 50ms
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + 0.05);

    this.activeCutsceneNodes.push(osc, noiseSource);
  }

  // 2. Start Low Idle Engine Rumble (Gradually building from light 1 to 5)
  public startEngineIdle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    this.stopEngineIdle();

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(58, now);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(62, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 4.5); // Gently swell as lights light up

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);

    this.idleRumbleGain = gain;
    this.idleRumbleOscs = [osc1, osc2];
  }

  public stopEngineIdle() {
    if (this.ctx && this.idleRumbleGain) {
      const now = this.ctx.currentTime;
      try {
        this.idleRumbleGain.gain.setValueAtTime(this.idleRumbleGain.gain.value, now);
        this.idleRumbleGain.gain.linearRampToValueAtTime(0.0001, now + 0.05);
      } catch (e) {
        // Safe catch
      }
    }
    setTimeout(() => {
      this.idleRumbleOscs.forEach((o) => {
        try {
          o.stop();
          o.disconnect();
        } catch (e) {
          // Safe catch
        }
      });
      this.idleRumbleOscs = [];
      this.idleRumbleGain = null;
    }, 60);
  }

  // 3. Explosive Rev on Lights Out (No beep!)
  public playLightsOutRev() {
    this.stopEngineIdle();
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const sub = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.45);

    sub.type = 'triangle';
    sub.frequency.setValueAtTime(55, now);
    sub.frequency.exponentialRampToValueAtTime(260, now + 0.45);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.45);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.linearRampToValueAtTime(0.32, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(filter);
    sub.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    sub.start(now);
    osc.stop(now + 0.55);
    sub.stop(now + 0.55);

    this.activeCutsceneNodes.push(osc, sub);
  }

  // 4. Ultra-Realistic F1 Speed Rush Engine with Doppler, Gear Shifts & Wind Rush
  public playF1SpeedRush() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 2.6;
    const passTime = now + 1.15; // Point of closest approach (car passes center screen)

    // Master bus for Speed Rush to cap volume between 0.3 - 0.4 and prevent any clipping
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, now);
    masterGain.gain.linearRampToValueAtTime(0.35, passTime);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    masterGain.connect(this.ctx.destination);

    // Stereo Panner (smooth Left to Right transition: -1.0 to +1.0)
    let panner: StereoPannerNode | null = null;
    if (typeof this.ctx.createStereoPanner === 'function') {
      panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(-0.95, now);
      panner.pan.linearRampToValueAtTime(0.0, passTime);
      panner.pan.linearRampToValueAtTime(0.95, now + duration);
      panner.connect(masterGain);
    }

    const outputNode: AudioNode = panner ? panner : masterGain;

    // Harmonic Oscillators (f, 2f, 3f, 4f) for genuine high-pitched F1 scream
    const osc1 = this.ctx.createOscillator(); // f (sawtooth)
    const osc2 = this.ctx.createOscillator(); // 2f (square)
    const osc3 = this.ctx.createOscillator(); // 3f (sawtooth)
    const osc4 = this.ctx.createOscillator(); // 4f (square)

    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc3.type = 'sawtooth';
    osc4.type = 'square';

    // Harmonic gain balancing
    const g1 = this.ctx.createGain();
    const g2 = this.ctx.createGain();
    const g3 = this.ctx.createGain();
    const g4 = this.ctx.createGain();

    g1.gain.setValueAtTime(0.40, now);
    g2.gain.setValueAtTime(0.25, now);
    g3.gain.setValueAtTime(0.18, now);
    g4.gain.setValueAtTime(0.10, now);

    // Gear shift simulated frequency curve:
    // Gear 3: 260 -> 480 Hz
    // Gear shift at now + 0.5s: drops to 380 -> 680 Hz
    // Gear shift at now + 1.15s (Doppler apex): ~850Hz drops by 18% to ~700Hz as it passes
    // Gear 5: 700 -> 1150 Hz then Doppler decays down to 320 Hz
    const setFreq = (osc: OscillatorNode, multiplier: number) => {
      osc.frequency.setValueAtTime(260 * multiplier, now);
      // Accelerating Gear 3
      osc.frequency.exponentialRampToValueAtTime(460 * multiplier, now + 0.45);
      // Shift to Gear 4 (brief drop)
      osc.frequency.setValueAtTime(370 * multiplier, now + 0.48);
      osc.frequency.exponentialRampToValueAtTime(740 * multiplier, passTime - 0.05);
      // Doppler drop (~18%) right as it roars past camera
      osc.frequency.setValueAtTime(610 * multiplier, passTime + 0.05);
      // Upshift to Gear 5 screaming away into distance
      osc.frequency.exponentialRampToValueAtTime(880 * multiplier, now + 1.7);
      osc.frequency.exponentialRampToValueAtTime(240 * multiplier, now + duration);
    };

    setFreq(osc1, 1.0);
    setFreq(osc2, 2.0);
    setFreq(osc3, 3.0);
    setFreq(osc4, 4.0);

    // Resonant Bandpass + Lowpass filter for metallic turbo scream
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.exponentialRampToValueAtTime(5500, passTime);
    filter.frequency.exponentialRampToValueAtTime(450, now + duration);
    filter.Q.setValueAtTime(3.2, now);

    osc1.connect(g1); g1.connect(filter);
    osc2.connect(g2); g2.connect(filter);
    osc3.connect(g3); g3.connect(filter);
    osc4.connect(g4); g4.connect(filter);

    filter.connect(outputNode);

    // Filtered White Noise for aerodynamic wind rush
    const noiseBufferSize = Math.floor(this.ctx.sampleRate * duration);
    const noiseBuffer = this.ctx.createBuffer(1, noiseBufferSize, this.ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBufferSize; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }

    const windSource = this.ctx.createBufferSource();
    windSource.buffer = noiseBuffer;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(350, now);
    windFilter.frequency.exponentialRampToValueAtTime(1400, passTime);
    windFilter.frequency.exponentialRampToValueAtTime(280, now + duration);
    windFilter.Q.setValueAtTime(1.8, now);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.01, now);
    windGain.gain.linearRampToValueAtTime(0.18, passTime);
    windGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(outputNode);

    // Start all sound components
    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    osc4.start(now);
    windSource.start(now);

    osc1.stop(now + duration);
    osc2.stop(now + duration);
    osc3.stop(now + duration);
    osc4.stop(now + duration);
    windSource.stop(now + duration);

    this.activeCutsceneNodes.push(osc1, osc2, osc3, osc4, windSource, masterGain);
  }

  // 5. Checkered Flag Wipe Short Stereo Whoosh
  public playWhoosh() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 0.45;

    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(1800, now + 0.2);
    filter.frequency.exponentialRampToValueAtTime(300, now + duration);
    filter.Q.setValueAtTime(2.5, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration);

    this.activeCutsceneNodes.push(noise);
  }

  // 6. Dramatic Title Reveal Impact
  public playTitleImpact() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Sub-bass impact thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.8);

    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.85);

    // High metallic shimmer
    const shimmer = this.ctx.createOscillator();
    const shimmerGain = this.ctx.createGain();
    shimmer.type = 'triangle';
    shimmer.frequency.setValueAtTime(1400, now);
    shimmer.frequency.exponentialRampToValueAtTime(700, now + 0.4);

    shimmerGain.gain.setValueAtTime(0.10, now);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    shimmer.connect(shimmerGain);
    shimmerGain.connect(this.ctx.destination);

    shimmer.start(now);
    shimmer.stop(now + 0.45);

    this.activeCutsceneNodes.push(osc, shimmer);
  }

  public resumeAudio() {
    this.initCtx();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // =========================================================================
  // DEEP AUTOMOTIVE RACING ENGINE SOUND SYSTEM (ACOUSTIC COCKPIT RUMBLE)
  // Built on deep internal combustion principles (Warm, Bass-Rich, Non-Fatiguing):
  // - Low-frequency combustion pulse synthesis (36Hz to 175Hz fundamental)
  // - Pure triangle & sine waveforms only (Zero harsh sawtooth buzz, zero piercing sines)
  // - Dual-stage steep acoustic low-pass filtering (220Hz - 380Hz ceiling)
  // - Heavy anti-harshness high-shelf dampening (-24dB at 800Hz)
  // - Softer, comfortable equal-loudness volume staging (smooth & pleasant for long racing)
  // - Deep muffled upshift exhaust thumps & warm downshift throttle blips
  // =========================================================================
  private arcadeEngineOscs: OscillatorNode[] = [];
  private arcadeEngineGain: GainNode | null = null;
  private arcadeEngineFilter: BiquadFilterNode | null = null;
  private arcadeFormantFilter: BiquadFilterNode | null = null;
  private arcadeComfortFilter: BiquadFilterNode | null = null;
  private arcadeAntiHarshFilter: BiquadFilterNode | null = null;
  private arcadeAccelGain: GainNode | null = null;
  private arcadePeakPowerGain: GainNode | null = null;
  private arcadeTurboGain: GainNode | null = null;
  private arcadeWindSource: AudioBufferSourceNode | null = null;
  private arcadeWindFilter: BiquadFilterNode | null = null;
  private arcadeWindGain: GainNode | null = null;
  private isArcadeEngineActive: boolean = false;
  private lastGearShiftTime: number = 0;
  private lastOverrunPopTime: number = 0;

  public startOutRunEngine() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    // If already active with healthy running oscillators, retain existing sound
    if (this.isArcadeEngineActive && this.arcadeEngineOscs.length > 0 && this.arcadeEngineGain) {
      return;
    }

    // Immediately stop any lingering old nodes cleanly and synchronously
    if (this.arcadeEngineOscs.length > 0) {
      this.arcadeEngineOscs.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
      this.arcadeEngineOscs = [];
    }
    if (this.arcadeWindSource) {
      try {
        this.arcadeWindSource.stop();
        this.arcadeWindSource.disconnect();
      } catch (e) {}
      this.arcadeWindSource = null;
    }

    const now = this.ctx.currentTime;

    // 1. Heavy Sub-Bass Chassis & Cockpit Rumble (Sine wave: 42Hz to 90Hz)
    // Delivers deep physical chest resonance, vibration and automotive weight
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(42, now);

    // 2. Fundamental Combustion Order (Triangle wave: 58Hz to 240Hz)
    // Rich, athletic, responsive engine note with clear rev climb
    const fundOsc = this.ctx.createOscillator();
    fundOsc.type = 'triangle';
    fundOsc.frequency.setValueAtTime(58, now);

    // 3. Engine Body & Exhaust Manifold Resonance (Triangle wave: 87Hz to 360Hz)
    // Provides full-bodied engine warmth and mechanical presence
    const bodyOsc = this.ctx.createOscillator();
    bodyOsc.type = 'triangle';
    bodyOsc.frequency.setValueAtTime(87, now);

    // 4. Cylinder Pulse Harmonic (Sawtooth wave: 116Hz to 480Hz)
    // Crisp mechanical bite providing realistic engine rev definition and presence
    const pulseOsc = this.ctx.createOscillator();
    pulseOsc.type = 'sawtooth';
    pulseOsc.frequency.setValueAtTime(116, now);

    // =========================================================================
    // ACOUSTIC CAVITY & CRISP PRESENCE FILTER NETWORK (Zero mud, crystal clear)
    // =========================================================================
    // A. Engine Presence Filter: Crisp mechanical bite at 2400Hz (+3.2dB)
    const formantFilter = this.ctx.createBiquadFilter();
    formantFilter.type = 'peaking';
    formantFilter.frequency.setValueAtTime(2400, now);
    formantFilter.Q.setValueAtTime(1.2, now);
    formantFilter.gain.setValueAtTime(3.2, now);

    // B. Dynamic Acoustic Low-Pass Filter:
    // - Idle: 1100Hz (clean, distinct purr)
    // - Acceleration: opens up smoothly to 3400Hz - 5200Hz (crisp, roaring F1 mechanical howl)
    const acousticFilter = this.ctx.createBiquadFilter();
    acousticFilter.type = 'lowpass';
    acousticFilter.frequency.setValueAtTime(1100, now);
    acousticFilter.Q.setValueAtTime(0.9, now);

    // C. Natural High-Frequency Ceiling Barrier: 7500Hz (eliminates shrill >8kHz noise while keeping crisp clarity)
    const comfortFilter = this.ctx.createBiquadFilter();
    comfortFilter.type = 'lowpass';
    comfortFilter.frequency.setValueAtTime(7500, now);
    comfortFilter.Q.setValueAtTime(0.7, now);

    // D. Anti-Mud Low-Mid Dip Filter: -2.5dB at 280Hz (eliminates boomy cloudiness / muddiness)
    const antiHarshFilter = this.ctx.createBiquadFilter();
    antiHarshFilter.type = 'peaking';
    antiHarshFilter.frequency.setValueAtTime(280, now);
    antiHarshFilter.Q.setValueAtTime(1.2, now);
    antiHarshFilter.gain.setValueAtTime(-2.5, now);

    // =========================================================================
    // GAIN STAGING & BUS CONTROLS (Punchy, audible, pleasant automotive levels)
    // =========================================================================
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.095, now); // Comfortably balanced initial volume

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.20, now); // Solid deep bass chassis rumble

    const fundGain = this.ctx.createGain();
    fundGain.gain.setValueAtTime(0.16, now); // Warm, clean fundamental thrum

    const bodyGain = this.ctx.createGain();
    bodyGain.gain.setValueAtTime(0.03, now); // Swells nicely on throttle

    const pulseGain = this.ctx.createGain();
    pulseGain.gain.setValueAtTime(0.042, now); // Low-mid cylinder firing texture

    // =========================================================================
    // AERODYNAMIC COCKPIT AIR RUSH (Soft muffled low-frequency breeze)
    // =========================================================================
    const noiseBufferDuration = 2.0;
    const noiseSampleCount = Math.floor(this.ctx.sampleRate * noiseBufferDuration);
    const noiseBuffer = this.ctx.createBuffer(1, noiseSampleCount, this.ctx.sampleRate);
    const noiseChannel = noiseBuffer.getChannelData(0);
    let lastNoise = 0;
    for (let i = 0; i < noiseSampleCount; i++) {
      const white = Math.random() * 2 - 1;
      lastNoise = (lastNoise * 0.95) + (white * 0.05); // Heavy brownian smoothing
      noiseChannel[i] = lastNoise * 2.0;
    }

    const windSource = this.ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.setValueAtTime(280, now); // Low muffled air rush only
    windFilter.Q.setValueAtTime(0.8, now);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.0001, now);

    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(masterGain);

    // Connect Engine Oscillators through warm filter chain
    subOsc.connect(subGain);
    subGain.connect(formantFilter);

    fundOsc.connect(fundGain);
    fundGain.connect(formantFilter);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(formantFilter);

    pulseOsc.connect(pulseGain);
    pulseGain.connect(formantFilter);

    // Route through multi-stage acoustic low-pass chain
    formantFilter.connect(acousticFilter);
    acousticFilter.connect(comfortFilter);
    comfortFilter.connect(antiHarshFilter);
    antiHarshFilter.connect(masterGain);

    masterGain.connect(this.ctx.destination);

    // Start sound generators
    subOsc.start(now);
    fundOsc.start(now);
    bodyOsc.start(now);
    pulseOsc.start(now);
    windSource.start(now);

    this.arcadeEngineOscs = [subOsc, fundOsc, bodyOsc, pulseOsc];
    this.arcadeEngineGain = masterGain;
    this.arcadeEngineFilter = acousticFilter;
    this.arcadeFormantFilter = formantFilter;
    this.arcadeComfortFilter = comfortFilter;
    this.arcadeAntiHarshFilter = antiHarshFilter;
    this.arcadeAccelGain = bodyGain;
    this.arcadePeakPowerGain = null;
    this.arcadeTurboGain = null;
    this.arcadeWindSource = windSource;
    this.arcadeWindFilter = windFilter;
    this.arcadeWindGain = windGain;
    this.isArcadeEngineActive = true;
  }

  public updateOutRunEngine(
    rpmNormalized: number, // 0.0 to 1.0 (idle to redline)
    speedKmH: number,
    isAccelerating: boolean,
    isBraking: boolean,
    isOffroad: boolean,
    onKerb: boolean,
    currentGear: number = 1,
    drsActive: boolean = false,
    isRedline: boolean = false
  ) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Auto-start engine if not already active or if nodes were disconnected
    if (!this.isArcadeEngineActive || this.arcadeEngineOscs.length === 0 || !this.arcadeEngineGain) {
      this.startOutRunEngine();
      return;
    }

    try {
      const now = this.ctx.currentTime;
      const smoothTime = 0.045;

      // -----------------------------------------------------------------------
      // 1. HIGH-REVVING RACING PITCH MAPPING (Athletic, Crisp, Responsive V6 Tone)
      // Tuned higher per user request for authentic F1 racing roar
      // Idle (1,000 RPM) = 86Hz
      // Redline (14,500 RPM) = 340Hz (harmonics: 510Hz, 680Hz)
      // -----------------------------------------------------------------------
      let fundPitch = 86 + rpmNormalized * 254;

      // Rev-Limiter Spark-Cut Bounce ("thud-thud-thud" at redline)
      if (isRedline && isAccelerating) {
        const stutter = Math.sin(now * Math.PI * 16);
        fundPitch += stutter * 10;
      }

      // Order 1.0: Sub-bass crankshaft rumble (52Hz to 110Hz)
      if (this.arcadeEngineOscs[0]) {
        const subFreq = 52 + rpmNormalized * 58;
        this.arcadeEngineOscs[0].frequency.setTargetAtTime(subFreq, now, smoothTime);
      }

      // Order 2.0: Main Combustion Fundamental Note (86Hz to 340Hz)
      if (this.arcadeEngineOscs[1]) {
        this.arcadeEngineOscs[1].frequency.setTargetAtTime(fundPitch, now, smoothTime);
      }

      // Order 3.0: Engine Body Exhaust Resonance (129Hz to 510Hz)
      if (this.arcadeEngineOscs[2]) {
        this.arcadeEngineOscs[2].frequency.setTargetAtTime(fundPitch * 1.5, now, smoothTime);
      }

      // Order 4.0: Cylinder firing pulse (172Hz to 680Hz)
      if (this.arcadeEngineOscs[3]) {
        this.arcadeEngineOscs[3].frequency.setTargetAtTime(fundPitch * 2.0, now, smoothTime);
      }

      // -----------------------------------------------------------------------
      // 2. DYNAMIC CRISP ACOUSTIC LOW-PASS FILTER ENVELOPE (1100Hz - 5200Hz)
      // -----------------------------------------------------------------------
      if (this.arcadeEngineFilter) {
        let targetCutoff = 1100 + rpmNormalized * 1400; // 1100Hz -> 2500Hz when cruising
        if (isAccelerating) {
          targetCutoff = 2200 + rpmNormalized * 3000; // 2200Hz -> 5200Hz (crisp, screaming high-rev racing roar)
        } else if (isBraking) {
          targetCutoff = 900 + rpmNormalized * 600; // Crisp engine braking
        }

        if (isOffroad) {
          targetCutoff = Math.min(1800, targetCutoff * 0.75);
        }

        this.arcadeEngineFilter.frequency.setTargetAtTime(targetCutoff, now, smoothTime);
      }

      // -----------------------------------------------------------------------
      // 3. THROTTLE LOAD ACCELERATION GAIN (Deep growl swell on gas)
      // -----------------------------------------------------------------------
      if (this.arcadeAccelGain) {
        let bodyVol = 0.04; // Sporty background presence when coasting
        if (isAccelerating) {
          bodyVol = 0.11 + rpmNormalized * 0.055;
          if (isRedline) {
            const stutterGain = 0.82 + Math.sin(now * Math.PI * 16) * 0.18;
            bodyVol *= stutterGain;
          }
        }
        this.arcadeAccelGain.gain.setTargetAtTime(bodyVol, now, 0.035);
      }

      // -----------------------------------------------------------------------
      // 4. AERODYNAMIC COCKPIT AIR RUSH AT HIGH SPEED (Soft, zero whistle)
      // -----------------------------------------------------------------------
      if (this.arcadeWindGain && this.arcadeWindFilter) {
        if (speedKmH > 140) {
          const windIntensity = Math.min(1.0, (speedKmH - 140) / 200);
          const windVol = windIntensity * (drsActive ? 0.038 : 0.024);
          const windFreq = 230 + windIntensity * 95; // Soft 230Hz - 325Hz air buffer

          this.arcadeWindGain.gain.setTargetAtTime(windVol, now, 0.06);
          this.arcadeWindFilter.frequency.setTargetAtTime(windFreq, now, 0.06);
        } else {
          this.arcadeWindGain.gain.setTargetAtTime(0.0001, now, 0.08);
        }
      }

      // -----------------------------------------------------------------------
      // 5. MASTER GAIN (Punchy, energetic racing engine volume)
      // -----------------------------------------------------------------------
      if (this.arcadeEngineGain) {
        let masterVol = 0.082; // Warm, gentle idle rumble
        if (isAccelerating) {
          masterVol = 0.128;
          if (speedKmH > 260) masterVol = 0.142; // High-speed racing presence
        } else if (isBraking) {
          masterVol = 0.075;
        }

        if (isOffroad) masterVol *= 0.88;
        this.arcadeEngineGain.gain.setTargetAtTime(masterVol, now, smoothTime);
      }

      // Kerb rumble feedback (gentle low thump)
      if (onKerb && Math.random() < 0.25) {
        this.playKerbThump();
      }
    } catch (e) {
      // Audio node safely caught
    }
  }

  // =========================================================================
  // GEAR SHIFT SOUNDS (Muffled upshift exhaust thump & deep downshift blip)
  // =========================================================================
  public playGearShiftUp(gear: number = 2) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    if (now - this.lastGearShiftTime < 0.18) return;
    this.lastGearShiftTime = now;

    // A. Momentary 35ms ignition dip on engine
    if (this.arcadeEngineGain) {
      try {
        const curVol = this.arcadeEngineGain.gain.value;
        this.arcadeEngineGain.gain.setValueAtTime(curVol * 0.45, now);
        this.arcadeEngineGain.gain.exponentialRampToValueAtTime(Math.max(0.01, curVol), now + 0.05);
      } catch (e) {}
    }

    // B. Warm Sub-Bass Exhaust Thump (85Hz -> 26Hz) - Deep, muffled, zero harshness
    const popOsc = this.ctx.createOscillator();
    const popGain = this.ctx.createGain();
    popOsc.type = 'triangle';
    popOsc.frequency.setValueAtTime(85, now);
    popOsc.frequency.exponentialRampToValueAtTime(26, now + 0.07);

    popGain.gain.setValueAtTime(0.10, now);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

    popOsc.connect(popGain);
    popGain.connect(this.ctx.destination);
    popOsc.start(now);
    popOsc.stop(now + 0.08);

    // C. Muffled exhaust gas release (soft brownian puff, lowpass filtered at 320Hz)
    try {
      const bufSize = Math.floor(this.ctx.sampleRate * 0.05);
      const puffBuf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = puffBuf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.25));
      }
      const puffSource = this.ctx.createBufferSource();
      puffSource.buffer = puffBuf;

      const puffFilter = this.ctx.createBiquadFilter();
      puffFilter.type = 'lowpass';
      puffFilter.frequency.setValueAtTime(320, now);

      const puffGain = this.ctx.createGain();
      puffGain.gain.setValueAtTime(0.028, now);
      puffGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      puffSource.connect(puffFilter);
      puffFilter.connect(puffGain);
      puffGain.connect(this.ctx.destination);
      puffSource.start(now);
    } catch (e) {}
  }

  public playGearShiftDown(gear: number = 1) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    if (now - this.lastGearShiftTime < 0.18) return;
    this.lastGearShiftTime = now;

    // Downshift Rev-Match Throttle Blip (Deep, warm triangle purr, 65Hz -> 120Hz -> 55Hz)
    const blipOsc = this.ctx.createOscillator();
    const blipFilter = this.ctx.createBiquadFilter();
    const blipGain = this.ctx.createGain();

    blipOsc.type = 'triangle';
    blipOsc.frequency.setValueAtTime(65, now);
    blipOsc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
    blipOsc.frequency.exponentialRampToValueAtTime(55, now + 0.14);

    blipFilter.type = 'lowpass';
    blipFilter.frequency.setValueAtTime(250, now); // Warm lowpass, zero buzz
    blipFilter.Q.setValueAtTime(1.0, now);

    blipGain.gain.setValueAtTime(0.01, now);
    blipGain.gain.linearRampToValueAtTime(0.065, now + 0.035);
    blipGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    blipOsc.connect(blipFilter);
    blipFilter.connect(blipGain);
    blipGain.connect(this.ctx.destination);

    blipOsc.start(now);
    blipOsc.stop(now + 0.16);
  }

  // Off-throttle exhaust overrun burble (Gentle, deep muffled burble, zero harshness)
  public playExhaustOverrun() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    if (now - this.lastOverrunPopTime < 0.22) return;
    this.lastOverrunPopTime = now;

    // 2 subtle deep micro-burble thrums
    [0, 0.04].forEach((offset, idx) => {
      if (!this.ctx) return;
      const t = now + offset;
      const popOsc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();

      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(55 + (idx * 15), t);
      popOsc.frequency.exponentialRampToValueAtTime(24, t + 0.045);

      popGain.gain.setValueAtTime(0.05, t);
      popGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      popOsc.connect(popGain);
      popGain.connect(this.ctx.destination);
      popOsc.start(t);
      popOsc.stop(t + 0.055);
    });
  }

  // Crash / Obstacle Impact Sound (Thud + Metallic crunch)
  public playCrashImpact() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;

    // 1. Heavy Sub-Bass Impact Thud
    const thudOsc = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thudOsc.type = 'triangle';
    thudOsc.frequency.setValueAtTime(140, now);
    thudOsc.frequency.exponentialRampToValueAtTime(28, now + 0.35);

    thudGain.gain.setValueAtTime(0.45, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    thudOsc.connect(thudGain);
    thudGain.connect(this.ctx.destination);
    thudOsc.start(now);
    thudOsc.stop(now + 0.4);

    // 2. High-Frequency Crunch / Shatter Noise
    try {
      const bufferSize = this.ctx.sampleRate * 0.25;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.06));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1800, now);
      noiseFilter.Q.setValueAtTime(1.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
    } catch (e) {}
  }

  // Engine Fire / Explosion Disaster Sound (Devastating detonation + crackle)
  public playEngineExplosionFire() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;

    // 1. Deep Sub Detonation
    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boomOsc.type = 'sawtooth';
    boomOsc.frequency.setValueAtTime(160, now);
    boomOsc.frequency.exponentialRampToValueAtTime(18, now + 1.2);

    boomGain.gain.setValueAtTime(0.55, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

    boomOsc.connect(boomGain);
    boomGain.connect(this.ctx.destination);
    boomOsc.start(now);
    boomOsc.stop(now + 1.3);

    // 2. Fire Roar & Crackle
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 1.5);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // crackle bursts mixed into roar
        const crackle = Math.random() < 0.04 ? (Math.random() - 0.5) * 2.5 : (Math.random() - 0.5) * 0.4;
        output[i] = crackle * Math.exp(-i / (this.ctx.sampleRate * 0.8));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(250, now + 1.4);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.40, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.45);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    } catch (e) {}
  }

  // Thunder / Rain Sound (Atmospheric deep roll)
  public playThunderRain() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    try {
      const rumble = this.ctx.createOscillator();
      const rGain = this.ctx.createGain();
      rumble.type = 'triangle';
      rumble.frequency.setValueAtTime(65, now);
      rumble.frequency.linearRampToValueAtTime(35, now + 0.6);
      rumble.frequency.linearRampToValueAtTime(85, now + 1.2);
      rumble.frequency.linearRampToValueAtTime(22, now + 2.0);

      rGain.gain.setValueAtTime(0.01, now);
      rGain.gain.linearRampToValueAtTime(0.35, now + 0.4);
      rGain.gain.exponentialRampToValueAtTime(0.001, now + 2.1);

      rumble.connect(rGain);
      rGain.connect(this.ctx.destination);
      rumble.start(now);
      rumble.stop(now + 2.2);
    } catch (e) {}
  }

  public stopOutRunEngine() {
    this.isArcadeEngineActive = false;
    const oscsToStop = this.arcadeEngineOscs;
    const windToStop = this.arcadeWindSource;
    const gainToFade = this.arcadeEngineGain;

    this.arcadeEngineOscs = [];
    this.arcadeEngineGain = null;
    this.arcadeEngineFilter = null;
    this.arcadeFormantFilter = null;
    this.arcadeComfortFilter = null;
    this.arcadeAntiHarshFilter = null;
    this.arcadeAccelGain = null;
    this.arcadePeakPowerGain = null;
    this.arcadeTurboGain = null;
    this.arcadeWindFilter = null;
    this.arcadeWindGain = null;

    if (gainToFade && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        gainToFade.gain.setValueAtTime(gainToFade.gain.value, now);
        gainToFade.gain.linearRampToValueAtTime(0.0001, now + 0.05);
      } catch (e) {}
    }

    setTimeout(() => {
      oscsToStop.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
      if (windToStop) {
        try {
          windToStop.stop();
          windToStop.disconnect();
        } catch (e) {}
      }
    }, 60);
  }

  public playKerbThump() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playTireSqueal() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(750 + Math.random() * 200, now);
    osc.frequency.linearRampToValueAtTime(950 + Math.random() * 150, now + 0.12);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(4, now);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playCountdownBeep(isGo: boolean = false) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    // Low beep (440Hz) for ready, High beep (880Hz) for GO!
    const freq = isGo ? 920 : 440;
    const duration = isGo ? 0.35 : 0.15;

    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(isGo ? 0.25 : 0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  public playDrsActivate() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(550, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.18);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playBoostPad() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Sub-bass thrust punch
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(115, now);
    subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.18);
    subGain.gain.setValueAtTime(0.18, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.23);

    // High-tech ascending turbo warp tone
    const warpOsc = this.ctx.createOscillator();
    const warpGain = this.ctx.createGain();
    const warpFilter = this.ctx.createBiquadFilter();
    warpOsc.type = 'triangle';
    warpOsc.frequency.setValueAtTime(240, now);
    warpOsc.frequency.exponentialRampToValueAtTime(780, now + 0.24);

    warpFilter.type = 'lowpass';
    warpFilter.frequency.setValueAtTime(2400, now);

    warpGain.gain.setValueAtTime(0.01, now);
    warpGain.gain.linearRampToValueAtTime(0.14, now + 0.04);
    warpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    warpOsc.connect(warpFilter);
    warpFilter.connect(warpGain);
    warpGain.connect(this.ctx.destination);
    warpOsc.start(now);
    warpOsc.stop(now + 0.29);
  }

  public playChequeredFlag() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Celebratory victory arpeggio: C5 - E5 - G5 - C6
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.2, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.4);
    });
  }

  // Secret Catch-Up: Fast turbo whoosh when rival triggers pursuit surge
  public playRivalPursuitSurge() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.35);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 0.35);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  // High-tension warning chime when rival catches right up to player's tail (Tailgating)
  public playRivalTailgateAlert() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(680, now);
    osc.frequency.exponentialRampToValueAtTime(940, now + 0.1);
    osc.frequency.setValueAtTime(820, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(1180, now + 0.24);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  // Urgent dual-tone alarm when a rival overtakes the player
  public playRivalOvertakeAlert() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.14);
    osc.frequency.setValueAtTime(740, now + 0.16);
    osc.frequency.exponentialRampToValueAtTime(330, now + 0.34);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.38);
  }

  // =========================================================================
  // DYNAMIC F1 GRAND PRIX RACE MUSIC SYNTHESIZER
  // 32-Bar multi-movement composition (134 BPM, D minor):
  // - Movement 1 (Bars 0-7): The Grid Launch (Driving rolling bass & brass calls)
  // - Movement 2 (Bars 8-15): Sector 2 Apex Sprint (Heroic soaring lead & open hats)
  // - Movement 3 (Bars 16-23): DRS Slipstream Pursuit (Tense syncopated breakdown & snare build)
  // - Movement 4 (Bars 24-31): Grand Prix Climax (Full throttle triumphant finale & octave lead)
  // Strictly filtered with lowpass protection to prevent ear fatigue (warm, non-piercing)
  // =========================================================================
  private isRaceMusicActive: boolean = false;
  private isMusicMuted: boolean = false;
  private musicTimerId: ReturnType<typeof setInterval> | null = null;
  private musicCurrentStep: number = 0;
  private musicNextStepTime: number = 0;
  private currentMusicTrack: 1 | 2 = 1;
  private musicMasterGain: GainNode | null = null;
  private musicMasterFilter: BiquadFilterNode | null = null;
  private musicWarmthFilter: BiquadFilterNode | null = null;
  private musicAirFilter: BiquadFilterNode | null = null;
  private musicNoiseBuffer: AudioBuffer | null = null;

  private getNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    if (!this.musicNoiseBuffer) {
      const size = this.ctx.sampleRate;
      this.musicNoiseBuffer = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
      const data = this.musicNoiseBuffer.getChannelData(0);
      for (let i = 0; i < size; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }
    return this.musicNoiseBuffer;
  }

  // 1. Punchy Sub-Kick with tight low transient (Never clicky or harsh)
  private playMusicKick(time: number, isAccent: boolean) {
    if (!this.ctx || !this.musicMasterFilter) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isAccent ? 130 : 115, time);
      osc.frequency.exponentialRampToValueAtTime(42, time + 0.05);
      osc.frequency.exponentialRampToValueAtTime(28, time + 0.12);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(360, time);

      gain.gain.setValueAtTime(isAccent ? 0.48 : 0.38, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicMasterFilter);

      osc.start(time);
      osc.stop(time + 0.16);
    } catch (e) {}
  }

  // 2. Snappy Warm Snare / Rim Clapper
  private playMusicSnare(time: number, isGhost: boolean = false, isRoll: boolean = false) {
    if (!this.ctx || !this.musicMasterFilter) return;
    try {
      const noiseBuf = this.getNoiseBuffer();

      // Triangle body
      const bodyOsc = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();
      bodyOsc.type = 'triangle';
      bodyOsc.frequency.setValueAtTime(175, time);
      bodyOsc.frequency.exponentialRampToValueAtTime(85, time + 0.07);

      const bodyVol = isGhost ? 0.05 : (isRoll ? 0.10 : 0.18);
      bodyGain.gain.setValueAtTime(bodyVol, time);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(this.musicMasterFilter);
      bodyOsc.start(time);
      bodyOsc.stop(time + 0.09);

      // Noise snap (crisp 2800Hz snap, studio punch)
      if (noiseBuf) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuf;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2800, time);
        filter.Q.setValueAtTime(1.5, time);

        const gain = this.ctx.createGain();
        const noiseVol = isGhost ? 0.05 : (isRoll ? 0.12 : 0.22);
        const duration = isGhost ? 0.05 : (isRoll ? 0.06 : 0.13);
        gain.gain.setValueAtTime(noiseVol, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicMasterFilter);

        noise.start(time);
        noise.stop(time + duration);
      }
    } catch (e) {}
  }

  // 3. Smooth Metallic Hi-Hat (Bandpass capped, zero ear-piercing sizzle)
  private playMusicHiHat(time: number, type: 'closed' | 'open' | 'accent') {
    if (!this.ctx || !this.musicMasterFilter) return;
    try {
      const noiseBuf = this.getNoiseBuffer();
      if (!noiseBuf) return;

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuf;

      const hpFilter = this.ctx.createBiquadFilter();
      hpFilter.type = 'highpass';
      hpFilter.frequency.setValueAtTime(5200, time);

      const bpFilter = this.ctx.createBiquadFilter();
      bpFilter.type = 'bandpass';
      bpFilter.frequency.setValueAtTime(9200, time);
      bpFilter.Q.setValueAtTime(1.6, time);

      const gain = this.ctx.createGain();
      const duration = type === 'open' ? 0.13 : (type === 'accent' ? 0.05 : 0.035);
      const vol = type === 'open' ? 0.12 : (type === 'accent' ? 0.09 : 0.06);

      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      noise.connect(hpFilter);
      hpFilter.connect(bpFilter);
      bpFilter.connect(gain);
      gain.connect(this.musicMasterFilter);

      noise.start(time);
      noise.stop(time + duration);
    } catch (e) {}
  }

  // 4. Heavy Driving Analog Synth Bass (Triangle + Filtered Saw, Lowpass 450Hz)
  private playMusicBass(time: number, freq: number, duration: number, isAccent: boolean = false) {
    if (!this.ctx || !this.musicMasterFilter || freq <= 0) return;
    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, time);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(freq * 1.002, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isAccent ? 1400 : 950, time);
      filter.frequency.exponentialRampToValueAtTime(450, time + Math.min(duration, 0.11));
      filter.Q.setValueAtTime(2.2, time);

      const baseVol = isAccent ? 0.28 : 0.22;
      gain.gain.setValueAtTime(baseVol, time);
      gain.gain.linearRampToValueAtTime(baseVol * 0.75, time + duration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      const g1 = this.ctx.createGain();
      const g2 = this.ctx.createGain();
      g1.gain.setValueAtTime(0.65, time);
      g2.gain.setValueAtTime(0.35, time);

      osc1.connect(g1); g1.connect(filter);
      osc2.connect(g2); g2.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicMasterFilter);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + duration + 0.02);
      osc2.stop(time + duration + 0.02);
    } catch (e) {}
  }

  // 5. Cinematic Pad / Brass Stabs (Lowpass 820Hz, warm analog texture)
  private playMusicChord(time: number, freqs: number[], duration: number) {
    if (!this.ctx || !this.musicMasterFilter || !freqs.length) return;
    try {
      const chordGain = this.ctx.createGain();
      chordGain.gain.setValueAtTime(0.01, time);
      chordGain.gain.linearRampToValueAtTime(0.12, time + 0.035);
      chordGain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      chordGain.connect(this.musicMasterFilter);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1900, time);
      filter.Q.setValueAtTime(1.0, time);
      filter.connect(chordGain);

      freqs.forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, time);
        osc.connect(filter);
        osc.start(time);
        osc.stop(time + duration + 0.02);
      });
    } catch (e) {}
  }

  // 6. Heroic Anthemic Synth Lead (Warm triangle + pulse, strictly under 1500Hz)
  private playMusicLead(time: number, freq: number, duration: number, hasVibrato: boolean = false) {
    if (!this.ctx || !this.musicMasterFilter || freq <= 0) return;
    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, time);

      osc2.type = 'square';
      osc2.frequency.setValueAtTime(freq * 1.003, time);

      // Crisp bright analog synth lead (opens up to 4800Hz for heroic clarity)
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, time);
      filter.frequency.linearRampToValueAtTime(4800, time + 0.04);
      filter.frequency.exponentialRampToValueAtTime(3000, time + duration);
      filter.Q.setValueAtTime(1.5, time);

      if (hasVibrato && duration > 0.3) {
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(5.5, time);
        lfoGain.gain.setValueAtTime(0, time);
        lfoGain.gain.linearRampToValueAtTime(freq * 0.012, time + 0.2);

        lfo.connect(lfoGain);
        lfoGain.connect(osc1.frequency);
        lfoGain.connect(osc2.frequency);

        lfo.start(time);
        lfo.stop(time + duration);
      }

      const g1 = this.ctx.createGain();
      const g2 = this.ctx.createGain();
      g1.gain.setValueAtTime(0.70, time);
      g2.gain.setValueAtTime(0.30, time);

      gain.gain.setValueAtTime(0.01, time);
      gain.gain.linearRampToValueAtTime(0.18, time + 0.02);
      gain.gain.linearRampToValueAtTime(0.14, time + duration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc1.connect(g1); g1.connect(filter);
      osc2.connect(g2); g2.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicMasterFilter);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + duration + 0.02);
      osc2.stop(time + duration + 0.02);
    } catch (e) {}
  }

  // 7. Oriental / ZUN-style High-Energy Brass/Lead (Fast pitch attack, rich harmonics & trill vibrato)
  private playMusicOrientalLead(time: number, freq: number, duration: number, hasVibrato: boolean = false) {
    if (!this.ctx || !this.musicMasterFilter || freq <= 0) return;
    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      // Signature lead: Sawtooth + square with 18ms Asian pitch glide into note
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(freq * 0.982, time);
      osc1.frequency.exponentialRampToValueAtTime(freq, time + 0.022);

      osc2.type = 'square';
      osc2.frequency.setValueAtTime(freq * 1.0025, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3600, time);
      filter.frequency.linearRampToValueAtTime(5600, time + 0.035);
      filter.frequency.exponentialRampToValueAtTime(3200, time + duration);
      filter.Q.setValueAtTime(2.2, time);

      if (hasVibrato && duration > 0.22) {
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(6.0, time);
        lfoGain.gain.setValueAtTime(0, time);
        lfoGain.gain.linearRampToValueAtTime(freq * 0.016, time + 0.14);

        lfo.connect(lfoGain);
        lfoGain.connect(osc1.frequency);
        lfoGain.connect(osc2.frequency);

        lfo.start(time);
        lfo.stop(time + duration);
      }

      const g1 = this.ctx.createGain();
      const g2 = this.ctx.createGain();
      g1.gain.setValueAtTime(0.72, time);
      g2.gain.setValueAtTime(0.28, time);

      gain.gain.setValueAtTime(0.01, time);
      gain.gain.linearRampToValueAtTime(0.21, time + 0.018);
      gain.gain.linearRampToValueAtTime(0.16, time + duration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc1.connect(g1); g1.connect(filter);
      osc2.connect(g2); g2.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicMasterFilter);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + duration + 0.02);
      osc2.stop(time + duration + 0.02);
    } catch (e) {}
  }

  // 8. Oriental Bell / Chime / Music Box Accents
  private playMusicChime(time: number, freq: number, duration: number) {
    if (!this.ctx || !this.musicMasterFilter || freq <= 0) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.09, time);
      gain.gain.exponentialRampToValueAtTime(0.0005, time + duration);

      osc.connect(gain);
      gain.connect(this.musicMasterFilter);

      osc.start(time);
      osc.stop(time + duration + 0.02);
    } catch (e) {}
  }

  // Step Scheduler: 32 Bars (512 Steps of 16th notes at 134 BPM)
  private scheduleMusicStep(step: number, time: number) {
    const stepDuration = 60 / (134 * 4); // ~0.11194s
    const bar = Math.floor(step / 16); // 0 to 31
    const s = step % 16; // 0 to 15

    // Musical Frequencies in D minor
    const D1 = 36.71, F1 = 43.65, G1 = 49.00, A1 = 55.00, Bb1 = 58.27, C2 = 65.41;
    const D2 = 73.42, E2 = 82.41, F2 = 87.31, G2 = 98.00, A2 = 110.00, Bb2 = 116.54, C3 = 130.81;
    const D3 = 146.83, E3 = 164.81, F3 = 174.61, G3 = 196.00, A3 = 220.00, Bb3 = 233.08, C4 = 261.63;
    const D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, Bb4 = 466.16, C5 = 523.25;
    const D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99;

    // -------------------------------------------------------------------------
    // SECTION 1: BARS 0-7 (Grid Launch & Sector 1 Acceleration)
    // -------------------------------------------------------------------------
    if (bar < 8) {
      // Drums
      const isKick = s % 4 === 0 || (bar % 4 === 3 && s === 14);
      if (isKick) this.playMusicKick(time, s === 0);

      const isSnare = s === 4 || s === 12;
      if (isSnare) this.playMusicSnare(time, false);

      this.playMusicHiHat(time, s % 2 === 0 ? 'accent' : 'closed');

      // Rolling 16th Bass
      let bassFreq = D2;
      if (bar < 2) {
        const dmMotif = [D2, D2, D3, D2, D2, F2, D2, G2, D2, D2, D3, D2, D2, A2, G2, F2];
        bassFreq = dmMotif[s];
      } else if (bar < 4) {
        const bbMotif = [Bb1, Bb1, Bb2, Bb1, Bb1, D2, Bb1, F2, Bb1, Bb1, Bb2, Bb1, Bb1, F2, E2, D2];
        bassFreq = bbMotif[s];
      } else if (bar < 6) {
        const gmMotif = [G1, G1, G2, G1, G1, Bb1, G1, D2, G1, G1, G2, G1, G1, D2, C2, Bb1];
        bassFreq = gmMotif[s];
      } else {
        const aMotif = [A1, A1, A2, A1, A1, D2, A1, E2, A1, A1, A2, A1, A1, E2, D2, C2];
        bassFreq = aMotif[s];
      }
      this.playMusicBass(time, bassFreq, stepDuration * 0.9, s % 4 === 0);

      // Pad Chords on bar downbeat
      if (s === 0) {
        if (bar === 0) this.playMusicChord(time, [D3, F3, A3], stepDuration * 15);
        if (bar === 2) this.playMusicChord(time, [Bb2, D3, F3], stepDuration * 15);
        if (bar === 4) this.playMusicChord(time, [G2, Bb2, D3], stepDuration * 15);
        if (bar === 6) this.playMusicChord(time, [A2, C3, E3], stepDuration * 15);
      }

      // Fanfare Hook Motif Stabs
      if (bar === 2 && s === 8) this.playMusicLead(time, D4, stepDuration * 2);
      if (bar === 2 && s === 10) this.playMusicLead(time, F4, stepDuration * 2);
      if (bar === 2 && s === 12) this.playMusicLead(time, A4, stepDuration * 4);

      if (bar === 4 && s === 8) this.playMusicLead(time, G4, stepDuration * 2);
      if (bar === 4 && s === 10) this.playMusicLead(time, F4, stepDuration * 2);
      if (bar === 4 && s === 12) this.playMusicLead(time, D4, stepDuration * 4);

      if (bar === 6 && s === 4) this.playMusicLead(time, E4, stepDuration * 2);
      if (bar === 6 && s === 6) this.playMusicLead(time, F4, stepDuration * 2);
      if (bar === 6 && s === 8) this.playMusicLead(time, G4, stepDuration * 2);
      if (bar === 6 && s === 10) this.playMusicLead(time, A4, stepDuration * 4);
      if (bar === 7 && s === 0) this.playMusicLead(time, D4, stepDuration * 8, true);
    }

    // -------------------------------------------------------------------------
    // SECTION 2: BARS 8-15 (Sector 2 Apex Sprint - Heroic Lead Theme 1)
    // -------------------------------------------------------------------------
    else if (bar < 16) {
      // Drums: Driving four-on-the-floor + double kick + open hats
      const isKick = s % 4 === 0 || (bar % 2 === 1 && s === 10);
      if (isKick) this.playMusicKick(time, s === 0);

      const isSnare = s === 4 || s === 12;
      const isGhost = s === 15;
      if (isSnare) this.playMusicSnare(time, false);
      else if (isGhost) this.playMusicSnare(time, true);

      // Offbeat open hihats for driving Eurobeat/OutRun energy
      const isOpenHat = s === 2 || s === 6 || s === 10 || s === 14;
      this.playMusicHiHat(time, isOpenHat ? 'open' : 'closed');

      // Melodic Walking Synth Bass
      const bassProfiles: Record<number, (number | null)[]> = {
        8: [D2, null, D2, D2, F2, null, G2, null, A2, null, G2, F2, E2, null, D2, null],
        9: [D2, D2, D3, D2, C3, null, A2, null, F2, null, G2, null, D2, D2, E2, F2],
        10: [F2, null, F2, F2, A2, null, C3, null, D3, null, C3, A2, G2, null, F2, null],
        11: [F2, F2, C3, F2, A2, null, F2, null, G2, null, F2, null, E2, null, C2, null],
        12: [C2, null, C2, C2, E2, null, G2, null, A2, null, G2, E2, D2, null, C2, null],
        13: [C2, C2, G2, C2, E2, null, G2, null, Bb2, null, A2, null, G2, null, F2, null],
        14: [Bb1, null, Bb1, Bb1, D2, null, F2, null, G2, null, F2, D2, C2, null, Bb1, null],
        15: [C2, null, C2, C2, E2, null, G2, null, A2, G2, F2, E2, D2, C2, A1, C2],
      };
      const note = bassProfiles[bar]?.[s];
      if (note) {
        this.playMusicBass(time, note, stepDuration * 0.95, s % 4 === 0);
      }

      // Heroic Lead Anthem 1
      if (bar === 8) {
        if (s === 0) this.playMusicLead(time, D4, stepDuration * 3);
        if (s === 3) this.playMusicLead(time, F4, stepDuration * 1);
        if (s === 4) this.playMusicLead(time, A4, stepDuration * 4);
        if (s === 8) this.playMusicLead(time, G4, stepDuration * 2);
        if (s === 10) this.playMusicLead(time, F4, stepDuration * 2);
        if (s === 12) this.playMusicLead(time, E4, stepDuration * 4);
      } else if (bar === 9) {
        if (s === 0) this.playMusicLead(time, E4, stepDuration * 3);
        if (s === 3) this.playMusicLead(time, F4, stepDuration * 1);
        if (s === 4) this.playMusicLead(time, D4, stepDuration * 8, true);
        if (s === 12) this.playMusicLead(time, C4, stepDuration * 4);
      } else if (bar === 10) {
        if (s === 0) this.playMusicLead(time, C4, stepDuration * 2);
        if (s === 2) this.playMusicLead(time, D4, stepDuration * 2);
        if (s === 4) this.playMusicLead(time, F4, stepDuration * 2);
        if (s === 6) this.playMusicLead(time, G4, stepDuration * 2);
        if (s === 8) this.playMusicLead(time, A4, stepDuration * 4);
        if (s === 12) this.playMusicLead(time, C5, stepDuration * 4);
      } else if (bar === 11) {
        if (s === 0) this.playMusicLead(time, A4, stepDuration * 6, true);
        if (s === 6) this.playMusicLead(time, G4, stepDuration * 2);
        if (s === 8) this.playMusicLead(time, F4, stepDuration * 2);
        if (s === 10) this.playMusicLead(time, E4, stepDuration * 4);
        if (s === 14) this.playMusicLead(time, C4, stepDuration * 2);
      } else if (bar === 12) {
        if (s === 0) this.playMusicLead(time, D4, stepDuration * 3);
        if (s === 3) this.playMusicLead(time, F4, stepDuration * 1);
        if (s === 4) this.playMusicLead(time, A4, stepDuration * 4);
        if (s === 8) this.playMusicLead(time, C5, stepDuration * 2);
        if (s === 10) this.playMusicLead(time, D5, stepDuration * 4, true);
        if (s === 14) this.playMusicLead(time, C5, stepDuration * 2);
      } else if (bar === 13) {
        if (s === 0) this.playMusicLead(time, C5, stepDuration * 2);
        if (s === 2) this.playMusicLead(time, A4, stepDuration * 2);
        if (s === 4) this.playMusicLead(time, G4, stepDuration * 4);
        if (s === 8) this.playMusicLead(time, F4, stepDuration * 4);
        if (s === 12) this.playMusicLead(time, E4, stepDuration * 4);
      } else if (bar === 14) {
        if (s === 0) this.playMusicLead(time, F4, stepDuration * 2);
        if (s === 2) this.playMusicLead(time, G4, stepDuration * 2);
        if (s === 4) this.playMusicLead(time, A4, stepDuration * 4);
        if (s === 8) this.playMusicLead(time, Bb4, stepDuration * 2);
        if (s === 10) this.playMusicLead(time, A4, stepDuration * 2);
        if (s === 12) this.playMusicLead(time, G4, stepDuration * 4);
      } else if (bar === 15) {
        if (s === 0) this.playMusicLead(time, D4, stepDuration * 14, true);
      }
    }

    // -------------------------------------------------------------------------
    // SECTION 3: BARS 16-23 (DRS Slipstream Pursuit - Breakdown & Tension Build)
    // -------------------------------------------------------------------------
    else if (bar < 24) {
      if (bar < 22) {
        // Half-time Tension Groove
        const isKick = s === 0 || s === 6 || s === 10;
        if (isKick) this.playMusicKick(time, s === 0);

        if (s === 8) this.playMusicSnare(time, false);

        this.playMusicHiHat(time, s % 2 === 0 ? 'closed' : 'accent');

        // Dark Syncopated Sub Bass
        let bassNote = D2;
        if (bar < 18) bassNote = [D2, null, null, D2, null, null, D2, null, D2, null, null, F2, null, null, D2, null][s] || 0;
        else if (bar < 20) bassNote = [C2, null, null, C2, null, null, C2, null, C2, null, null, E2, null, null, C2, null][s] || 0;
        else bassNote = [Bb1, null, null, Bb1, null, null, Bb1, null, Bb1, null, null, D2, null, null, Bb1, null][s] || 0;

        if (bassNote) this.playMusicBass(time, bassNote, stepDuration * 0.85, true);

        // Tactical Telemetry Stabs on off-beats (3, 7, 11)
        if (s === 3 || s === 7 || s === 11) {
          if (bar < 18) this.playMusicChord(time, [D3, F3, A3], stepDuration * 1.5);
          else if (bar < 20) this.playMusicChord(time, [C3, E3, G3], stepDuration * 1.5);
          else this.playMusicChord(time, [Bb2, D3, F3], stepDuration * 1.5);
        }

        // Tense Arpeggio Lead
        if (s === 0) this.playMusicLead(time, bar < 18 ? D4 : (bar < 20 ? C4 : Bb3), stepDuration * 3);
        if (s === 4) this.playMusicLead(time, bar < 18 ? A3 : (bar < 20 ? G3 : D4), stepDuration * 3);
        if (s === 8) this.playMusicLead(time, bar < 18 ? F4 : (bar < 20 ? E4 : F4), stepDuration * 3);
        if (s === 12) this.playMusicLead(time, bar < 18 ? D4 : (bar < 20 ? C4 : D4), stepDuration * 3);
      } else {
        // Bars 22-23: Accelerating Snare Roll & Build-Up
        if (bar === 22) {
          if (s % 4 === 0) this.playMusicKick(time, true);
          if (s === 4 || s === 10 || s === 12 || s === 14) this.playMusicSnare(time, false, true);
        } else {
          // Bar 23: 8th note kicks, 16th snare roll explosion!
          if (s % 2 === 0) this.playMusicKick(time, true);
          this.playMusicSnare(time, false, true);
        }

        this.playMusicHiHat(time, 'closed');
        this.playMusicBass(time, A1, stepDuration * 0.9, true);

        // Rising Pitch Scale on Leads building into Sector 4
        const riseNotes = [D4, E4, F4, G4, A4, Bb4, C5, D5];
        if (s % 2 === 0) {
          const idx = (bar === 22 ? 0 : 4) + Math.floor(s / 4);
          this.playMusicLead(time, riseNotes[Math.min(7, idx)], stepDuration * 1.8);
        }
      }
    }

    // -------------------------------------------------------------------------
    // SECTION 4: BARS 24-31 (Grand Prix Climax - Full Throttle Glory)
    // -------------------------------------------------------------------------
    else {
      // High-Octane Double Kicks
      const isKick = s === 0 || s === 3 || s === 6 || s === 8 || s === 10 || s === 12 || s === 14;
      if (isKick) this.playMusicKick(time, s === 0 || s === 8);

      const isSnare = s === 4 || s === 12 || (bar % 2 === 0 && s === 7);
      if (isSnare) this.playMusicSnare(time, false);

      const isOpenHat = s === 2 || s === 6 || s === 10 || s === 14 || (bar === 31 && s >= 12);
      this.playMusicHiHat(time, isOpenHat ? 'open' : 'closed');

      // Climax Driving Bassline
      let bassFreq = D2;
      if (bar < 26) {
        const dmClimax = [D2, D2, D2, D2, F2, D2, G2, D2, A2, D2, G2, D2, F2, D2, E2, D2];
        bassFreq = dmClimax[s];
      } else if (bar < 28) {
        const bbClimax = [Bb1, Bb1, Bb1, Bb1, D2, Bb1, F2, Bb1, G2, Bb1, F2, Bb1, D2, Bb1, C2, Bb1];
        bassFreq = bbClimax[s];
      } else if (bar < 30) {
        const fcClimax = bar === 28
          ? [F2, F2, F2, F2, A2, F2, C3, F2, F2, F2, A2, F2, C3, F2, A2, F2]
          : [C2, C2, C2, C2, E2, C2, G2, C2, C2, C2, E2, C2, G2, C2, E2, C2];
        bassFreq = fcClimax[s];
      } else if (bar === 30) {
        const bbClimax = [Bb1, Bb1, D2, Bb1, F2, Bb1, G2, Bb1, A2, Bb1, G2, Bb1, F2, D2, C2, A1];
        bassFreq = bbClimax[s];
      } else {
        const fillBass = [D2, D2, F2, G2, A2, null, C3, null, D3, C3, A2, G2, F2, E2, D2, C2];
        bassFreq = fillBass[s] || D2;
      }
      this.playMusicBass(time, bassFreq, stepDuration * 0.9, s % 4 === 0);

      // Heroic Lead Anthem 2 (Soaring Octave Variations)
      if (bar === 24) {
        if (s === 0) this.playMusicLead(time, D5, stepDuration * 4);
        if (s === 4) this.playMusicLead(time, A4, stepDuration * 2);
        if (s === 6) this.playMusicLead(time, F4, stepDuration * 2);
        if (s === 8) this.playMusicLead(time, G4, stepDuration * 2);
        if (s === 10) this.playMusicLead(time, A4, stepDuration * 2);
        if (s === 12) this.playMusicLead(time, C5, stepDuration * 4);
      } else if (bar === 25) {
        if (s === 0) this.playMusicLead(time, D5, stepDuration * 4);
        if (s === 4) this.playMusicLead(time, F5, stepDuration * 2);
        if (s === 6) this.playMusicLead(time, E5, stepDuration * 2);
        if (s === 8) this.playMusicLead(time, D5, stepDuration * 8, true);
      } else if (bar === 26) {
        if (s === 0) this.playMusicLead(time, Bb4, stepDuration * 2);
        if (s === 2) this.playMusicLead(time, C5, stepDuration * 2);
        if (s === 4) this.playMusicLead(time, D5, stepDuration * 2);
        if (s === 6) this.playMusicLead(time, F5, stepDuration * 2);
        if (s === 8) this.playMusicLead(time, E5, stepDuration * 4);
        if (s === 12) this.playMusicLead(time, C5, stepDuration * 4);
      } else if (bar === 27) {
        if (s === 0) this.playMusicLead(time, D5, stepDuration * 10, true);
        if (s === 10) this.playMusicLead(time, C5, stepDuration * 2);
        if (s === 12) this.playMusicLead(time, A4, stepDuration * 4);
      } else if (bar === 28) {
        if (s === 0) this.playMusicLead(time, F5, stepDuration * 4);
        if (s === 4) this.playMusicLead(time, E5, stepDuration * 2);
        if (s === 6) this.playMusicLead(time, D5, stepDuration * 2);
        if (s === 8) this.playMusicLead(time, C5, stepDuration * 2);
        if (s === 10) this.playMusicLead(time, D5, stepDuration * 2);
        if (s === 12) this.playMusicLead(time, A4, stepDuration * 4);
      } else if (bar === 29) {
        if (s === 0) this.playMusicLead(time, Bb4, stepDuration * 2);
        if (s === 2) this.playMusicLead(time, A4, stepDuration * 2);
        if (s === 4) this.playMusicLead(time, G4, stepDuration * 2);
        if (s === 6) this.playMusicLead(time, F4, stepDuration * 2);
        if (s === 8) this.playMusicLead(time, E4, stepDuration * 4);
        if (s === 12) this.playMusicLead(time, G4, stepDuration * 4);
      } else if (bar === 30) {
        if (s === 0) this.playMusicLead(time, F4, stepDuration * 2);
        if (s === 2) this.playMusicLead(time, G4, stepDuration * 2);
        if (s === 4) this.playMusicLead(time, A4, stepDuration * 2);
        if (s === 6) this.playMusicLead(time, C5, stepDuration * 2);
        if (s === 8) this.playMusicLead(time, D5, stepDuration * 8, true);
      } else if (bar === 31) {
        // Climax Turnaround Stabs
        if (s === 0 || s === 4 || s === 8 || s === 12) {
          this.playMusicChord(time, [D4, F4, A4, D5], stepDuration * 3);
        }
      }
    }
  }

  // =========================================================================
  // TRACK 2: SHANGHAI ALICE OF MEIJI 17 (Hong Meiling Theme)
  // Step Scheduler: 32 Bars (512 Steps of 16th notes at 142 BPM)
  // Iconic Oriental Melodic Danmaku High-Speed Racing Anthem
  // =========================================================================
  private scheduleTrack2Step(step: number, time: number) {
    const stepDuration = 60 / (142 * 4); // ~0.10563s
    const bar = Math.floor(step / 16); // 0 to 31
    const s = step % 16; // 0 to 15

    // Musical Frequencies in D minor
    const D1 = 36.71, E1 = 41.20, F1 = 43.65, G1 = 49.00, A1 = 55.00, Bb1 = 58.27, C2 = 65.41;
    const D2 = 73.42, E2 = 82.41, F2 = 87.31, G2 = 98.00, A2 = 110.00, Bb2 = 116.54, C3 = 130.81, Csharp3 = 138.59;
    const D3 = 146.83, E3 = 164.81, F3 = 174.61, G3 = 196.00, A3 = 220.00, Bb3 = 233.08, C4 = 261.63, Csharp4 = 277.18;
    const D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, Bb4 = 466.16, C5 = 523.25;
    const D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.00, Bb5 = 932.33, C6 = 1046.50;

    // --- 1. DRUMS & PERCUSSION ---
    // Driving four-on-the-floor kick
    const isKick = s % 4 === 0 || (bar % 2 === 1 && s === 10) || (s === 14 && (bar % 4 === 3));
    if (isKick) this.playMusicKick(time, s === 0);

    // Snare & Rolls
    const isTurnaroundBar = bar === 3 || bar === 7 || bar === 11 || bar === 15 || bar === 19 || bar === 23 || bar === 27 || bar === 31;
    if (isTurnaroundBar && s >= 10) {
      // 16th-note snare roll rush into section change
      this.playMusicSnare(time, false, true);
    } else {
      if (s === 4 || s === 12) this.playMusicSnare(time, false);
      else if (s === 15) this.playMusicSnare(time, true);
    }

    // High energy hi-hats with open hats on upbeats
    const isOpenHat = s === 2 || s === 6 || s === 10 || s === 14;
    this.playMusicHiHat(time, isOpenHat ? 'open' : 'closed');

    // Chime bell on major structural downbeats
    if (s === 0 && (bar === 0 || bar === 4 || bar === 12 || bar === 20 || bar === 28)) {
      this.playMusicChime(time, A5, stepDuration * 6);
    }

    // --- 2. ZUN OCTAVE SLAP BASS ---
    let bassFreq = D2;
    if (bar < 4 || (bar >= 4 && bar <= 5) || bar === 8 || bar === 20) {
      // D minor running octave pattern
      const dm = [D2, D3, D2, D3, D2, F2, D3, G2, D2, D3, D2, D3, A2, G2, F2, E2];
      bassFreq = dm[s];
    } else if (bar === 6 || bar === 14 || bar === 22) {
      // Bb Major running octave pattern
      const bb = [Bb1, Bb2, Bb1, Bb2, Bb1, D2, Bb2, F2, Bb1, Bb2, Bb1, Bb2, F2, E2, D2, C2];
      bassFreq = bb[s];
    } else if (bar === 7 || bar === 13 || bar === 17 || bar === 21 || bar === 25) {
      // C Major running octave pattern
      const cm = [C2, C3, C2, C3, C2, E2, C3, G2, C2, C3, C2, C3, G2, F2, E2, D2];
      bassFreq = cm[s];
    } else if (bar === 9 || bar === 10 || bar === 12 || bar === 16 || bar === 18 || bar === 24 || bar === 26 || bar >= 28) {
      // F Major / A minor running pattern
      const fm = [F2, F3, F2, F3, A2, F3, C3, F2, G2, G3, G2, G3, A2, G2, F2, E2];
      bassFreq = fm[s];
    } else {
      // Turnaround A7 -> Dm pattern
      const a7 = [A1, A2, A1, A2, A1, Csharp3, A2, E2, A1, A2, A1, A2, D2, D3, C3, A2];
      bassFreq = a7[s];
    }
    this.playMusicBass(time, bassFreq, stepDuration * 0.92, s % 4 === 0);

    // --- 3. HARMONY CHORDS (On downbeat s === 0) ---
    if (s === 0) {
      if (bar === 0 || bar === 1 || bar === 4 || bar === 5 || bar === 8 || bar === 20) {
        this.playMusicChord(time, [D3, F3, A3, D4], stepDuration * 14);
      } else if (bar === 2 || bar === 6 || bar === 14 || bar === 22) {
        this.playMusicChord(time, [Bb2, D3, F3, Bb3], stepDuration * 14);
      } else if (bar === 3 || bar === 7 || bar === 13 || bar === 17 || bar === 21) {
        this.playMusicChord(time, [C3, E3, G3, C4], stepDuration * 14);
      } else if (bar === 12 || bar === 16 || bar === 28) {
        this.playMusicChord(time, [F3, A3, C4, F4], stepDuration * 14);
      } else if (bar === 10 || bar === 26 || bar === 30) {
        this.playMusicChord(time, [G2, Bb2, D3, G3], stepDuration * 14);
      } else if (bar === 11 || bar === 15 || bar === 18 || bar === 27 || bar === 31) {
        this.playMusicChord(time, [A2, Csharp3, E3, A3], stepDuration * 14);
      }
    }

    // --- 4. THE ICONIC "SHANGHAI ALICE OF MEIJI 17" MELODY ---

    // Movement 1 (Bars 0-3): Intro Fanfare
    if (bar === 0) {
      if (s === 0) this.playMusicOrientalLead(time, A4, stepDuration * 3);
      if (s === 3) this.playMusicOrientalLead(time, D5, stepDuration * 3);
      if (s === 6) this.playMusicOrientalLead(time, C5, stepDuration * 2);
      if (s === 8) this.playMusicOrientalLead(time, A4, stepDuration * 4);
      if (s === 12) this.playMusicOrientalLead(time, G4, stepDuration * 2);
      if (s === 14) this.playMusicOrientalLead(time, F4, stepDuration * 2);
    } else if (bar === 1) {
      if (s === 0) this.playMusicOrientalLead(time, D4, stepDuration * 4);
      if (s === 4) this.playMusicOrientalLead(time, F4, stepDuration * 2);
      if (s === 6) this.playMusicOrientalLead(time, G4, stepDuration * 2);
      if (s === 8) this.playMusicOrientalLead(time, A4, stepDuration * 4);
      if (s === 12) this.playMusicOrientalLead(time, C5, stepDuration * 4);
    } else if (bar === 2) {
      if (s === 0) this.playMusicOrientalLead(time, D5, stepDuration * 4);
      if (s === 4) this.playMusicOrientalLead(time, F5, stepDuration * 2);
      if (s === 6) this.playMusicOrientalLead(time, E5, stepDuration * 2);
      if (s === 8) this.playMusicOrientalLead(time, D5, stepDuration * 4);
      if (s === 12) this.playMusicOrientalLead(time, C5, stepDuration * 4);
    } else if (bar === 3) {
      if (s === 0) this.playMusicOrientalLead(time, D5, stepDuration * 8, true);
      if (s === 8) this.playMusicOrientalLead(time, A4, stepDuration * 2);
      if (s === 10) this.playMusicOrientalLead(time, C5, stepDuration * 2);
      if (s === 12) this.playMusicOrientalLead(time, D5, stepDuration * 2);
      if (s === 14) this.playMusicOrientalLead(time, E5, stepDuration * 2);
    }

    // Movement 2 (Bars 4-11): Section A - The Famous Chinese Teahouse Theme
    else if (bar === 4) {
      if (s === 0) this.playMusicOrientalLead(time, D4, stepDuration * 3);
      if (s === 3) this.playMusicOrientalLead(time, F4, stepDuration * 1);
      if (s === 4) this.playMusicOrientalLead(time, G4, stepDuration * 2);
      if (s === 6) this.playMusicOrientalLead(time, A4, stepDuration * 2);
      if (s === 8) this.playMusicOrientalLead(time, C5, stepDuration * 2);
      if (s === 10) this.playMusicOrientalLead(time, D5, stepDuration * 4, true);
      if (s === 14) this.playMusicOrientalLead(time, C5, stepDuration * 2);
    } else if (bar === 5) {
      if (s === 0) this.playMusicOrientalLead(time, A4, stepDuration * 4);
      if (s === 4) this.playMusicOrientalLead(time, F4, stepDuration * 2);
      if (s === 6) this.playMusicOrientalLead(time, G4, stepDuration * 2);
      if (s === 8) this.playMusicOrientalLead(time, A4, stepDuration * 4);
      if (s === 12) this.playMusicOrientalLead(time, F4, stepDuration * 2);
      if (s === 14) this.playMusicOrientalLead(time, D4, stepDuration * 2);
    } else if (bar === 6) {
      if (s === 0) this.playMusicOrientalLead(time, F4, stepDuration * 2);
      if (s === 2) this.playMusicOrientalLead(time, G4, stepDuration * 2);
      if (s === 4) this.playMusicOrientalLead(time, A4, stepDuration * 3);
      if (s === 7) this.playMusicOrientalLead(time, C5, stepDuration * 1);
      if (s === 8) this.playMusicOrientalLead(time, D5, stepDuration * 4);
      if (s === 12) this.playMusicOrientalLead(time, E5, stepDuration * 4);
    } else if (bar === 7) {
      if (s === 0) this.playMusicOrientalLead(time, D5, stepDuration * 8, true);
      if (s === 8) this.playMusicOrientalLead(time, C5, stepDuration * 2);
      if (s === 10) this.playMusicOrientalLead(time, D5, stepDuration * 2);
      if (s === 12) this.playMusicOrientalLead(time, F5, stepDuration * 4);
    } else if (bar === 8) {
      if (s === 0) this.playMusicOrientalLead(time, D4, stepDuration * 3);
      if (s === 3) this.playMusicOrientalLead(time, F4, stepDuration * 1);
      if (s === 4) this.playMusicOrientalLead(time, G4, stepDuration * 2);
      if (s === 6) this.playMusicOrientalLead(time, A4, stepDuration * 2);
      if (s === 8) this.playMusicOrientalLead(time, C5, stepDuration * 2);
      if (s === 10) this.playMusicOrientalLead(time, D5, stepDuration * 4);
      if (s === 14) this.playMusicOrientalLead(time, F5, stepDuration * 2);
    } else if (bar === 9) {
      if (s === 0) this.playMusicOrientalLead(time, E5, stepDuration * 2);
      if (s === 2) this.playMusicOrientalLead(time, D5, stepDuration * 2);
      if (s === 4) this.playMusicOrientalLead(time, C5, stepDuration * 4);
      if (s === 8) this.playMusicOrientalLead(time, A4, stepDuration * 4);
      if (s === 12) this.playMusicOrientalLead(time, G4, stepDuration * 2);
      if (s === 14) this.playMusicOrientalLead(time, F4, stepDuration * 2);
    } else if (bar === 10) {
      if (s === 0) this.playMusicOrientalLead(time, G4, stepDuration * 2);
      if (s === 2) this.playMusicOrientalLead(time, A4, stepDuration * 2);
      if (s === 4) this.playMusicOrientalLead(time, Bb4, stepDuration * 2);
      if (s === 6) this.playMusicOrientalLead(time, C5, stepDuration * 2);
      if (s === 8) this.playMusicOrientalLead(time, D5, stepDuration * 4);
      if (s === 12) this.playMusicOrientalLead(time, F5, stepDuration * 2);
      if (s === 14) this.playMusicOrientalLead(time, E5, stepDuration * 2);
    } else if (bar === 11) {
      if (s === 0) this.playMusicOrientalLead(time, D5, stepDuration * 8, true);
      if (s === 8) this.playMusicOrientalLead(time, A4, stepDuration * 2);
      if (s === 10) this.playMusicOrientalLead(time, C5, stepDuration * 2);
      if (s === 12) this.playMusicOrientalLead(time, D5, stepDuration * 2);
      if (s === 14) this.playMusicOrientalLead(time, F5, stepDuration * 2);
    }

    // Movement 3 (Bars 12-19): Section B - Soaring Romantic Chorus
    else if (bar === 12) {
      if (s === 0) this.playMusicOrientalLead(time, F5, stepDuration * 4);
      if (s === 4) this.playMusicOrientalLead(time, E5, stepDuration * 2);
      if (s === 6) this.playMusicOrientalLead(time, D5, stepDuration * 2);
      if (s === 8) this.playMusicOrientalLead(time, C5, stepDuration * 4);
      if (s === 12) this.playMusicOrientalLead(time, D5, stepDuration * 4);
    } else if (bar === 13) {
      if (s === 0) this.playMusicOrientalLead(time, A4, stepDuration * 8, true);
      if (s === 8) this.playMusicOrientalLead(time, G4, stepDuration * 2);
      if (s === 10) this.playMusicOrientalLead(time, A4, stepDuration * 2);
      if (s === 12) this.playMusicOrientalLead(time, C5, stepDuration * 4);
    } else if (bar === 14) {
      if (s === 0) this.playMusicOrientalLead(time, Bb4, stepDuration * 3);
      if (s === 3) this.playMusicOrientalLead(time, C5, stepDuration * 1);
      if (s === 4) this.playMusicOrientalLead(time, D5, stepDuration * 4);
      if (s === 8) this.playMusicOrientalLead(time, F5, stepDuration * 2);
      if (s === 10) this.playMusicOrientalLead(time, E5, stepDuration * 2);
      if (s === 12) this.playMusicOrientalLead(time, D5, stepDuration * 2);
      if (s === 14) this.playMusicOrientalLead(time, C5, stepDuration * 2);
    } else if (bar === 15) {
      if (s === 0) this.playMusicOrientalLead(time, D5, stepDuration * 10, true);
      if (s === 10) this.playMusicOrientalLead(time, E5, stepDuration * 2);
      if (s === 12) this.playMusicOrientalLead(time, F5, stepDuration * 4);
    } else if (bar === 16) {
      if (s === 0) this.playMusicOrientalLead(time, G5, stepDuration * 4);
      if (s === 4) this.playMusicOrientalLead(time, F5, stepDuration * 2);
      if (s === 6) this.playMusicOrientalLead(time, D5, stepDuration * 2);
      if (s === 8) this.playMusicOrientalLead(time, C5, stepDuration * 4);
      if (s === 12) this.playMusicOrientalLead(time, A4, stepDuration * 4);
    } else if (bar === 17) {
      if (s === 0) this.playMusicOrientalLead(time, C5, stepDuration * 4);
      if (s === 4) this.playMusicOrientalLead(time, D5, stepDuration * 4);
      if (s === 8) this.playMusicOrientalLead(time, F5, stepDuration * 4);
      if (s === 12) this.playMusicOrientalLead(time, G5, stepDuration * 4);
    } else if (bar === 18) {
      if (s === 0) this.playMusicOrientalLead(time, A5, stepDuration * 6, true);
      if (s === 6) this.playMusicOrientalLead(time, G5, stepDuration * 2);
      if (s === 8) this.playMusicOrientalLead(time, F5, stepDuration * 2);
      if (s === 10) this.playMusicOrientalLead(time, E5, stepDuration * 2);
      if (s === 12) this.playMusicOrientalLead(time, D5, stepDuration * 4);
    } else if (bar === 19) {
      if (s === 0) this.playMusicOrientalLead(time, D5, stepDuration * 8, true);
      if (s === 8) this.playMusicOrientalLead(time, C5, stepDuration * 2);
      if (s === 10) this.playMusicOrientalLead(time, D5, stepDuration * 2);
      if (s === 12) this.playMusicOrientalLead(time, F5, stepDuration * 2);
      if (s === 14) this.playMusicOrientalLead(time, G5, stepDuration * 2);
    }

    // Movement 4 (Bars 20-27): Section C - High-Octane Danmaku Battle Sprint
    else if (bar === 20) {
      if (s === 0) this.playMusicOrientalLead(time, D4, stepDuration * 2);
      if (s === 2) this.playMusicOrientalLead(time, A4, stepDuration * 2);
      if (s === 4) this.playMusicOrientalLead(time, D5, stepDuration * 2);
      if (s === 6) this.playMusicOrientalLead(time, C5, stepDuration * 2);
      if (s === 8) this.playMusicOrientalLead(time, A4, stepDuration * 2);
      if (s === 10) this.playMusicOrientalLead(time, G4, stepDuration * 2);
      if (s === 12) this.playMusicOrientalLead(time, F4, stepDuration * 2);
      if (s === 14) this.playMusicOrientalLead(time, G4, stepDuration * 2);
    } else if (bar === 21) {
      if (s === 0) this.playMusicOrientalLead(time, A4, stepDuration * 4);
      if (s === 4) this.playMusicOrientalLead(time, C5, stepDuration * 2);
      if (s === 6) this.playMusicOrientalLead(time, D5, stepDuration * 2);
      if (s === 8) this.playMusicOrientalLead(time, F5, stepDuration * 4);
      if (s === 12) this.playMusicOrientalLead(time, E5, stepDuration * 4);
    } else if (bar === 22) {
      if (s === 0) this.playMusicOrientalLead(time, D5, stepDuration * 2);
      if (s === 2) this.playMusicOrientalLead(time, C5, stepDuration * 2);
      if (s === 4) this.playMusicOrientalLead(time, Bb4, stepDuration * 2);
      if (s === 6) this.playMusicOrientalLead(time, A4, stepDuration * 2);
      if (s === 8) this.playMusicOrientalLead(time, G4, stepDuration * 4);
      if (s === 12) this.playMusicOrientalLead(time, Bb4, stepDuration * 4);
    } else if (bar === 23) {
      if (s === 0) this.playMusicOrientalLead(time, A4, stepDuration * 8, true);
      if (s === 8) this.playMusicOrientalLead(time, E4, stepDuration * 4);
      if (s === 12) this.playMusicOrientalLead(time, G4, stepDuration * 4);
    } else if (bar === 24) {
      if (s === 0) this.playMusicOrientalLead(time, F4, stepDuration * 2);
      if (s === 2) this.playMusicOrientalLead(time, G4, stepDuration * 2);
      if (s === 4) this.playMusicOrientalLead(time, A4, stepDuration * 4);
      if (s === 8) this.playMusicOrientalLead(time, Bb4, stepDuration * 2);
      if (s === 10) this.playMusicOrientalLead(time, C5, stepDuration * 2);
      if (s === 12) this.playMusicOrientalLead(time, D5, stepDuration * 4);
    } else if (bar === 25) {
      if (s === 0) this.playMusicOrientalLead(time, E5, stepDuration * 4);
      if (s === 4) this.playMusicOrientalLead(time, F5, stepDuration * 2);
      if (s === 6) this.playMusicOrientalLead(time, G5, stepDuration * 2);
      if (s === 8) this.playMusicOrientalLead(time, A5, stepDuration * 6, true);
      if (s === 14) this.playMusicOrientalLead(time, G5, stepDuration * 2);
    } else if (bar === 26) {
      if (s === 0) this.playMusicOrientalLead(time, F5, stepDuration * 4);
      if (s === 4) this.playMusicOrientalLead(time, E5, stepDuration * 2);
      if (s === 6) this.playMusicOrientalLead(time, D5, stepDuration * 2);
      if (s === 8) this.playMusicOrientalLead(time, C5, stepDuration * 4);
      if (s === 12) this.playMusicOrientalLead(time, A4, stepDuration * 4);
    } else if (bar === 27) {
      if (s === 0) this.playMusicOrientalLead(time, D5, stepDuration * 10, true);
      if (s === 10) this.playMusicOrientalLead(time, F5, stepDuration * 2);
      if (s === 12) this.playMusicOrientalLead(time, G5, stepDuration * 2);
      if (s === 14) this.playMusicOrientalLead(time, A5, stepDuration * 2);
    }

    // Movement 5 (Bars 28-31): Section D - Grand Reprise & Climax Turnaround
    else if (bar === 28) {
      if (s === 0) this.playMusicOrientalLead(time, F4, stepDuration * 2);
      if (s === 2) this.playMusicOrientalLead(time, G4, stepDuration * 2);
      if (s === 4) this.playMusicOrientalLead(time, A4, stepDuration * 2);
      if (s === 6) this.playMusicOrientalLead(time, C5, stepDuration * 2);
      if (s === 8) this.playMusicOrientalLead(time, D5, stepDuration * 4);
      if (s === 12) this.playMusicOrientalLead(time, E5, stepDuration * 4);
    } else if (bar === 29) {
      if (s === 0) this.playMusicOrientalLead(time, F5, stepDuration * 4);
      if (s === 4) this.playMusicOrientalLead(time, G5, stepDuration * 2);
      if (s === 6) this.playMusicOrientalLead(time, A5, stepDuration * 2);
      if (s === 8) this.playMusicOrientalLead(time, F5, stepDuration * 4);
      if (s === 12) this.playMusicOrientalLead(time, D5, stepDuration * 4);
    } else if (bar === 30) {
      if (s === 0) this.playMusicOrientalLead(time, Bb5, stepDuration * 4);
      if (s === 4) this.playMusicOrientalLead(time, A5, stepDuration * 2);
      if (s === 6) this.playMusicOrientalLead(time, G5, stepDuration * 2);
      if (s === 8) this.playMusicOrientalLead(time, F5, stepDuration * 4);
      if (s === 12) this.playMusicOrientalLead(time, E5, stepDuration * 4);
    } else if (bar === 31) {
      if (s === 0) this.playMusicOrientalLead(time, D5, stepDuration * 12, true);
      // Fast ascending ornament flourish loop into bar 0
      if (s === 12) this.playMusicOrientalLead(time, A4, stepDuration * 1);
      if (s === 13) this.playMusicOrientalLead(time, C5, stepDuration * 1);
      if (s === 14) this.playMusicOrientalLead(time, D5, stepDuration * 1);
      if (s === 15) this.playMusicOrientalLead(time, F5, stepDuration * 1);
    }
  }

  // Start the F1 High-Energy Race Music
  public startRaceMusic() {
    if (this.isMuted || this.isMusicMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isRaceMusicActive && this.musicTimerId) {
      return;
    }

    // Clean up any lingering music nodes
    this.stopRaceMusic();

    const now = this.ctx.currentTime;

    // Master Music Bus with anti-mud cut and air clarity enhancement
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(0.28, now + 0.35); // Solid, rich, exciting volume level

    // Master Lowpass Safety Filter (11000Hz ceiling, keeps pristine clarity while removing harsh hiss)
    const masterFilter = this.ctx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.setValueAtTime(11000, now);
    masterFilter.Q.setValueAtTime(0.7, now);

    // Anti-Mud EQ Filter (-2.5dB at 280Hz to eliminate boomy cloudiness)
    const warmthFilter = this.ctx.createBiquadFilter();
    warmthFilter.type = 'peaking';
    warmthFilter.frequency.setValueAtTime(280, now);
    warmthFilter.Q.setValueAtTime(1.2, now);
    warmthFilter.gain.setValueAtTime(-2.5, now);

    // High Air Presence Shelf (+2.0dB at 5500Hz for sparkling studio clarity)
    const airFilter = this.ctx.createBiquadFilter();
    airFilter.type = 'highshelf';
    airFilter.frequency.setValueAtTime(5500, now);
    airFilter.gain.setValueAtTime(2.0, now);

    masterFilter.connect(warmthFilter);
    warmthFilter.connect(airFilter);
    airFilter.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    this.musicMasterGain = masterGain;
    this.musicMasterFilter = masterFilter;
    this.musicWarmthFilter = warmthFilter;
    this.musicAirFilter = airFilter;
    this.isRaceMusicActive = true;
    this.musicCurrentStep = 0;

    const currentTrack = this.getCurrentMusicTrack();
    const bpm = currentTrack.bpm;
    const stepDuration = 60 / (bpm * 4); // 16th notes duration
    this.musicNextStepTime = now + 0.05;

    // Precise Web Audio lookahead scheduling loop (25ms interval, schedules 120ms ahead)
    this.musicTimerId = setInterval(() => {
      if (!this.ctx || !this.isRaceMusicActive) return;
      const curTime = this.ctx.currentTime;
      while (this.musicNextStepTime < curTime + 0.12) {
        if (this.currentMusicTrack === 2) {
          this.scheduleTrack2Step(this.musicCurrentStep, this.musicNextStepTime);
        } else {
          this.scheduleMusicStep(this.musicCurrentStep, this.musicNextStepTime);
        }
        this.musicNextStepTime += stepDuration;
        this.musicCurrentStep = (this.musicCurrentStep + 1) % 512; // 32 bars
      }
    }, 25);
  }

  // Stop Race Music with clean fade out
  public stopRaceMusic() {
    this.isRaceMusicActive = false;
    if (this.musicTimerId) {
      clearInterval(this.musicTimerId);
      this.musicTimerId = null;
    }

    const gainToFade = this.musicMasterGain;
    const filterToDisconnect = this.musicMasterFilter;
    const warmthToDisconnect = this.musicWarmthFilter;
    const airToDisconnect = this.musicAirFilter;

    this.musicMasterGain = null;
    this.musicMasterFilter = null;
    this.musicWarmthFilter = null;
    this.musicAirFilter = null;

    if (gainToFade && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        gainToFade.gain.setValueAtTime(gainToFade.gain.value, now);
        gainToFade.gain.linearRampToValueAtTime(0.0001, now + 0.25);
      } catch (e) {}
    }

    setTimeout(() => {
      try {
        if (gainToFade) gainToFade.disconnect();
        if (filterToDisconnect) filterToDisconnect.disconnect();
        if (warmthToDisconnect) warmthToDisconnect.disconnect();
        if (airToDisconnect) airToDisconnect.disconnect();
      } catch (e) {}
    }, 280);
  }

  // Toggle Race Music ON / OFF
  public toggleRaceMusic(): boolean {
    this.isMusicMuted = !this.isMusicMuted;
    if (this.isMusicMuted) {
      this.stopRaceMusic();
    } else {
      this.startRaceMusic();
    }
    return !this.isMusicMuted;
  }

  public getIsMusicMuted(): boolean {
    return this.isMusicMuted;
  }

  public setIsMusicMuted(muted: boolean): void {
    this.isMusicMuted = muted;
    if (this.isMusicMuted) {
      this.stopRaceMusic();
    }
  }

  public isRaceMusicPlaying(): boolean {
    return this.isRaceMusicActive;
  }

  // -------------------------------------------------------------------------
  // DUAL-TRACK BGM SELECTION (Track 1: Apex Anthem vs Track 2: Shanghai Alice)
  // -------------------------------------------------------------------------
  public getCurrentMusicTrack(): MusicTrackMetadata {
    return MUSIC_TRACKS[this.currentMusicTrack] || MUSIC_TRACKS[1];
  }

  public setMusicTrack(trackId: 1 | 2): MusicTrackMetadata {
    const wasPlaying = this.isRaceMusicActive;
    if (this.currentMusicTrack === trackId && wasPlaying) {
      return MUSIC_TRACKS[this.currentMusicTrack];
    }
    this.currentMusicTrack = trackId;
    if (wasPlaying) {
      this.stopRaceMusic();
      this.startRaceMusic();
    }
    return MUSIC_TRACKS[this.currentMusicTrack];
  }

  public toggleNextTrack(): MusicTrackMetadata {
    const next: 1 | 2 = this.currentMusicTrack === 1 ? 2 : 1;
    return this.setMusicTrack(next);
  }

  /**
   * Randomly or alternately select a music track for each stage / round.
   * Gives an exhilarating variety across the 18 Grand Prix calendar!
   */
  public selectTrackForStage(roundNumber: number): MusicTrackMetadata {
    // 50% random or alternating based on round
    const trackId: 1 | 2 = Math.random() < 0.5 ? 1 : 2;
    this.currentMusicTrack = trackId;
    if (this.isRaceMusicActive) {
      this.stopRaceMusic();
      this.startRaceMusic();
    }
    return MUSIC_TRACKS[trackId];
  }

  public selectRandomTrack(): MusicTrackMetadata {
    const trackId: 1 | 2 = Math.random() < 0.5 ? 1 : 2;
    return this.setMusicTrack(trackId);
  }
}

export const sound = new SoundSystem();
