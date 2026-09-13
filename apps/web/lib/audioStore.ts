'use client';

class GlobalAudioStore {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private listeners: Set<(playing: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const globalWindow = window as any;
      if (!globalWindow.__freedomAudioInstance) {
        globalWindow.__freedomAudioInstance = new Audio('/ipod_touch.mp3');
        globalWindow.__freedomAudioInstance.loop = true;
      }
      this.audio = globalWindow.__freedomAudioInstance;
    }
  }

  public toggle(): boolean {
    if (!this.audio) {
      if (typeof window !== 'undefined') {
        this.audio = new Audio('/ipod_touch.mp3');
        this.audio.loop = true;
        (window as any).__freedomAudioInstance = this.audio;
      }
    }
    if (!this.audio) return false;

    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      this.audio.play().catch(() => {});
      this.isPlaying = true;
    }

    this.notify();
    return this.isPlaying;
  }

  public getIsPlaying(): boolean {
    if (!this.audio) return false;
    return !this.audio.paused;
  }

  public subscribe(listener: (playing: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.getIsPlaying());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const status = this.getIsPlaying();
    this.listeners.forEach((l) => l(status));
  }
}

export const globalAudioStore = new GlobalAudioStore();
