'use client';

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
}

export const AUDIO_TRACKS: AudioTrack[] = [
  { id: 'ipod_touch', title: 'iPod Touch', artist: 'Ninajirachi', src: '/ipod_touch.mp3' },
  { id: 'mizmo_hello', title: 'Hello', artist: 'Mizmo', src: '/mizmo-hello.mp3' },
];

class GlobalAudioStore {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private currentTrack: AudioTrack = AUDIO_TRACKS[0];
  private listeners: Set<(data: { isPlaying: boolean; currentTrack: AudioTrack }) => void> = new Set();
  private activeDucks = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      const globalWindow = window as any;
      if (!globalWindow.__freedomAudioInstance) {
        globalWindow.__freedomAudioInstance = new Audio(AUDIO_TRACKS[0].src);
        globalWindow.__freedomAudioInstance.loop = true;
      }
      this.audio = globalWindow.__freedomAudioInstance;
    }
  }

  public setTrackAndPlay(track: AudioTrack) {
    if (!track) return;
    this.currentTrack = track;

    if (!this.audio && typeof window !== 'undefined') {
      this.audio = new Audio(track.src);
      this.audio.loop = true;
      (window as any).__freedomAudioInstance = this.audio;
    } else if (this.audio) {
      this.audio.pause();
      this.audio.src = track.src;
      this.audio.currentTime = 0;
    }

    if (this.audio) {
      this.audio.play().catch(() => {});
      this.isPlaying = true;
    }

    this.notify();
  }

  public toggle(): boolean {
    if (!this.audio && typeof window !== 'undefined') {
      this.audio = new Audio(this.currentTrack.src);
      this.audio.loop = true;
      (window as any).__freedomAudioInstance = this.audio;
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

  public stop() {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
      this.notify();
    }
  }

  public duckVolume() {
    this.activeDucks++;
    if (this.audio) {
      this.audio.volume = 0.05;
    }
  }

  public restoreVolume() {
    this.activeDucks = Math.max(0, this.activeDucks - 1);
    if (this.activeDucks === 0 && this.audio) {
      this.audio.volume = 1.0;
    }
  }

  public getIsPlaying(): boolean {
    if (!this.audio) return false;
    return !this.audio.paused;
  }

  public getCurrentTrack(): AudioTrack {
    return this.currentTrack;
  }

  public subscribe(
    listener: (data: { isPlaying: boolean; currentTrack: AudioTrack }) => void
  ): () => void {
    this.listeners.add(listener);
    listener({ isPlaying: this.getIsPlaying(), currentTrack: this.currentTrack });
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const data = { isPlaying: this.getIsPlaying(), currentTrack: this.currentTrack };
    this.listeners.forEach((l) => l(data));
  }
}

export const globalAudioStore = new GlobalAudioStore();
