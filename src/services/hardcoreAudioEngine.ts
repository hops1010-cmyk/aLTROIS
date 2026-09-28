/**
 * High-voltage brutalist audio engine for aLTROIS.
 * Bridges Lyria AI generation and real-time Web Audio synthesis.
 */

export interface AudioPlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  trackId: string;
  visualizerData: number[];
  isBreakdown: boolean;
  secondsToBreakdown: number;
}

export type PlaybackListener = (state: AudioPlaybackState) => void;

class HardcoreAudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private syntheticInterval: any = null;
  private animFrame: any = null;
  private listeners: Set<PlaybackListener> = new Set();

  private isPlaying = false;
  private currentTime = 0;
  private duration = 180;
  private currentTrackId = '';
  private breakdownTarget = 165;
  private isSynthetic = false;

  private makeDistortionCurve(amount = 50) {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(listener: PlaybackListener) {
    this.listeners.add(listener);
    this.emitState();
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emitState() {
    let visualizerData = new Array(32).fill(0);
    if (this.analyser && this.isPlaying) {
      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(dataArray);
      visualizerData = Array.from(dataArray.slice(0, 32)).map(v => v / 255);
    } else if (this.isPlaying) {
      // Fallback pulse for visual feedback
      visualizerData = Array.from({ length: 32 }, (_, i) => 
        Math.min(1, Math.max(0.1, Math.sin(this.currentTime * 8 + i * 0.5) * 0.5 + 0.5))
      );
    }

    const secondsToBreakdown = Math.max(0, Math.floor(this.breakdownTarget - this.currentTime));
    const isBreakdown = this.currentTime >= this.breakdownTarget && this.currentTime <= this.breakdownTarget + 30;

    const state: AudioPlaybackState = {
      isPlaying: this.isPlaying,
      currentTime: this.currentTime,
      duration: this.duration,
      trackId: this.currentTrackId,
      visualizerData,
      isBreakdown,
      secondsToBreakdown
    };

    this.listeners.forEach(fn => fn(state));
  }

  public playTrack(options: {
    id: string;
    durationSeconds: number;
    breakdownSeconds?: number;
    audioUrl?: string;
    bpm?: number;
  }) {
    this.initContext();
    this.stop();

    this.currentTrackId = options.id;
    this.duration = options.durationSeconds || 180;
    this.breakdownTarget = options.breakdownSeconds || Math.floor(this.duration * 0.75);
    this.currentTime = 0;
    this.isPlaying = true;

    if (options.audioUrl) {
      // Play real audio (Lyria generated audio stream / blob)
      this.isSynthetic = false;
      const audio = new Audio(options.audioUrl);
      this.currentAudioElement = audio;

      if (this.ctx && this.analyser) {
        try {
          const source = this.ctx.createMediaElementSource(audio);
          source.connect(this.analyser);
          this.analyser.connect(this.ctx.destination);
        } catch {
          // Cross-origin fallback
        }
      }

      audio.play().catch(e => console.warn('Audio play prevented:', e));

      audio.ontimeupdate = () => {
        this.currentTime = audio.currentTime;
        this.emitState();
      };

      audio.onended = () => {
        this.isPlaying = false;
        this.emitState();
      };
    } else {
      // Real-time Web Audio Synthesizer (Chug rhythm & blast beats)
      this.isSynthetic = true;
      this.startSyntheticHardcoreRiff(options.bpm || 140);
    }

    this.startLoop();
  }

  private startSyntheticHardcoreRiff(bpm: number) {
    if (!this.ctx || !this.analyser) return;

    const beatInterval = (60 / bpm) * 1000;
    let beatCount = 0;

    const playHit = () => {
      if (!this.isPlaying || !this.ctx || !this.analyser) return;
      const t = this.ctx.currentTime;

      // 1. Drop-F Chug Guitar (Oscillator with waveshaper)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const waveShaper = this.ctx.createWaveShaper();
      const filter = this.ctx.createBiquadFilter();

      waveShaper.curve = this.makeDistortionCurve(100);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, t);

      // Low Drop-F or Drop-D root (around 43.6 Hz for F1 or 73.4 Hz for D2)
      const isBreakdown = this.currentTime >= this.breakdownTarget;
      const freq = isBreakdown ? 43.65 : 73.41;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      // Envelope: palm-mute chug
      const chugDuration = isBreakdown ? (beatInterval / 1000) * 1.5 : (beatInterval / 1000) * 0.7;
      gain.gain.setValueAtTime(0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + chugDuration);

      osc.connect(waveShaper);
      waveShaper.connect(filter);
      filter.connect(gain);
      gain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + chugDuration);

      // 2. Pummeling Bass Drum Kick
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(150, t);
      kickOsc.frequency.exponentialRampToValueAtTime(32, t + 0.15);
      kickGain.gain.setValueAtTime(1.0, t);
      kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      kickOsc.connect(kickGain);
      kickGain.connect(this.analyser);
      kickOsc.start(t);
      kickOsc.stop(t + 0.25);

      // 3. Snare crack on beats 2 & 4
      if (beatCount % 2 === 1) {
        const bufferSize = this.ctx.sampleRate * 0.15;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const snareFilter = this.ctx.createBiquadFilter();
        snareFilter.type = 'highpass';
        snareFilter.frequency.value = 1000;

        const snareGain = this.ctx.createGain();
        snareGain.gain.setValueAtTime(0.6, t);
        snareGain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

        whiteNoise.connect(snareFilter);
        snareFilter.connect(snareGain);
        snareGain.connect(this.analyser);

        whiteNoise.start(t);
        whiteNoise.stop(t + 0.15);
      }

      beatCount++;
    };

    // Trigger initial beat
    playHit();
    this.syntheticInterval = setInterval(playHit, beatInterval);
  }

  private startLoop() {
    const loop = () => {
      if (this.isPlaying) {
        if (this.isSynthetic) {
          this.currentTime += 0.05;
          if (this.currentTime >= this.duration) {
            this.currentTime = 0;
          }
        }
        this.emitState();
        this.animFrame = setTimeout(loop, 50);
      }
    };
    loop();
  }

  public pause() {
    this.isPlaying = false;
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
    }
    if (this.syntheticInterval) {
      clearInterval(this.syntheticInterval);
      this.syntheticInterval = null;
    }
    clearTimeout(this.animFrame);
    this.emitState();
  }

  public resume() {
    if (!this.currentTrackId) return;
    this.initContext();
    this.isPlaying = true;
    if (this.currentAudioElement) {
      this.currentAudioElement.play().catch(console.warn);
    } else {
      this.startSyntheticHardcoreRiff(140);
    }
    this.startLoop();
    this.emitState();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
  }

  public seek(seconds: number) {
    this.currentTime = Math.max(0, Math.min(this.duration, seconds));
    if (this.currentAudioElement) {
      this.currentAudioElement.currentTime = this.currentTime;
    }
    this.emitState();
  }

  public skip(deltaSeconds: number) {
    this.seek(this.currentTime + deltaSeconds);
  }

  public stop() {
    this.pause();
    this.currentTime = 0;
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement = null;
    }
    this.emitState();
  }
}

export const audioEngine = new HardcoreAudioEngine();
