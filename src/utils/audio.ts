/**
 * Zero-dependency Web Audio API Sound Synthesizer for Auction Events
 * Generates procedural audio for gavel strikes, bid chimes, sold fanfares, and unsold gongs.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Crisp Wooden Gavel / Hammer Strike
   */
  public playHammer() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Transient click
    const oscTransient = ctx.createOscillator();
    const gainTransient = ctx.createGain();
    oscTransient.type = 'triangle';
    oscTransient.frequency.setValueAtTime(320, t);
    oscTransient.frequency.exponentialRampToValueAtTime(80, t + 0.08);

    gainTransient.gain.setValueAtTime(0.8, t);
    gainTransient.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    oscTransient.connect(gainTransient);
    gainTransient.connect(ctx.destination);
    oscTransient.start(t);
    oscTransient.stop(t + 0.15);

    // Deep wood resonance
    const oscBody = ctx.createOscillator();
    const gainBody = ctx.createGain();
    oscBody.type = 'sine';
    oscBody.frequency.setValueAtTime(120, t);
    oscBody.frequency.exponentialRampToValueAtTime(45, t + 0.25);

    gainBody.gain.setValueAtTime(0.7, t);
    gainBody.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    oscBody.connect(gainBody);
    gainBody.connect(ctx.destination);
    oscBody.start(t);
    oscBody.stop(t + 0.35);
  }

  /**
   * High-pitched crisp bid bell
   */
  public playBid() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t); // A5 note
    osc.frequency.exponentialRampToValueAtTime(1760, t + 0.06);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  /**
   * Triumphant Victory / SOLD Fanfare Chords
   */
  public playSold() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.playHammer();

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const t = ctx.currentTime + 0.15;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);

      gain.gain.setValueAtTime(0.3, t + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.7);
    });
  }

  /**
   * Unsold low brass / pass gong
   */
  public playUnsold() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(65, t + 0.6);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.7);
  }
}

export const sound = new SoundEngine();
