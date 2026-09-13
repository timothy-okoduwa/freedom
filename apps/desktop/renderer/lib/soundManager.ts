// Freedom Studio Audio Engine (Web Audio API Synthesizer)
// Provides 100% offline, zero-asset, high-fidelity sound feedback

export type SoundType = 'bell' | 'chime' | 'bowl' | 'harp' | 'windchime' | 'horizon' | 'pop' | 'none';

export interface SoundOption {
  id: SoundType;
  name: string;
  description: string;
}

export const SOUND_OPTIONS: SoundOption[] = [
  { id: 'bell', name: 'Crystal Bell', description: 'Bright harmonic chime with shimmering decay' },
  { id: 'chime', name: 'Digital Marimba', description: 'Two-tone ascending modern chime' },
  { id: 'bowl', name: 'Zen Singing Bowl', description: 'Deep, warm resonant Tibetan meditation bowl' },
  { id: 'harp', name: 'Morning Harp', description: 'Calming ascending 3-note acoustic harp arpeggio' },
  { id: 'windchime', name: 'Gentle Windchime', description: 'Delicate soothing bamboo breeze chimes' },
  { id: 'horizon', name: 'Ambient Horizon', description: 'Warm celestial atmospheric swell' },
  { id: 'pop', name: 'Subtle Bubble Pop', description: 'Tactile low-profile click feedback' },
  { id: 'none', name: 'Mute (No Sound)', description: 'Silent execution without audio cue' },
];

const SOUND_PREF_KEY = 'freedom_completion_sound';

class SoundManager {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  getSoundPreference(): SoundType {
    if (typeof window === 'undefined') return 'bell';
    try {
      const saved = localStorage.getItem(SOUND_PREF_KEY);
      if (
        saved &&
        (saved === 'bell' ||
          saved === 'chime' ||
          saved === 'bowl' ||
          saved === 'harp' ||
          saved === 'windchime' ||
          saved === 'horizon' ||
          saved === 'pop' ||
          saved === 'none')
      ) {
        return saved as SoundType;
      }
    } catch {}
    return 'bell';
  }

  setSoundPreference(sound: SoundType): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SOUND_PREF_KEY, sound);
    } catch {}
  }

  playSound(sound?: SoundType): void {
    const selected = sound || this.getSoundPreference();
    if (selected === 'none') return;

    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      switch (selected) {
        case 'bell': {
          // Crystal Bell: Dual-tone harmonic bell with soft decay
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gainNode = ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(880, now); // A5

          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(1760, now); // A6

          gainNode.gain.setValueAtTime(0.28, now);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

          osc1.connect(gainNode);
          osc2.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 1.2);
          osc2.stop(now + 1.2);
          break;
        }

        case 'chime': {
          // Digital Marimba: Ascending 2-tone chime (C5 -> G5)
          const notes = [523.25, 783.99]; // C5, G5
          notes.forEach((freq, idx) => {
            const start = now + idx * 0.12;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.3, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(start);
            osc.stop(start + 0.5);
          });
          break;
        }

        case 'bowl': {
          // Zen Singing Bowl: Warm resonant low tone with vibrato
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(329.63, now); // E4
          osc.frequency.exponentialRampToValueAtTime(328.0, now + 2.0);

          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 2.4);
          break;
        }

        case 'harp': {
          // Morning Harp: 3-note ascending arpeggio (F4 -> A4 -> C5)
          const notes = [349.23, 440.0, 523.25];
          notes.forEach((freq, idx) => {
            const start = now + idx * 0.15;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.28, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 1.1);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(start);
            osc.stop(start + 1.1);
          });
          break;
        }

        case 'windchime': {
          // Gentle Windchime: Cluster of delicate high pentatonic tones
          const freqs = [1046.5, 1174.66, 1318.51, 1567.98];
          freqs.forEach((f, idx) => {
            const start = now + idx * 0.08 + Math.random() * 0.04;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, start);

            gain.gain.setValueAtTime(0.18, start);
            gain.gain.exponentialRampToValueAtTime(0.0005, start + 1.4);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(start);
            osc.stop(start + 1.4);
          });
          break;
        }

        case 'horizon': {
          // Ambient Horizon: Celestial warm pad swell
          const chords = [261.63, 329.63, 392.0]; // C-E-G
          chords.forEach((freq) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.18, now + 0.4);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 2.2);
          });
          break;
        }

        case 'pop': {
          // Subtle Pop
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }
      }
    } catch (err) {
      console.warn('Sound playback failed:', err);
    }
  }
}

export const soundManager = new SoundManager();
