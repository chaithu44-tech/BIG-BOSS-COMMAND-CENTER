import { Team } from '../types';

export const getTeamBadgeColor = (team: Team): { bg: string; text: string; border: string; glow: string } => {
  switch (team) {
    case 'Team Red':
      return {
        bg: 'bg-red-950/60',
        text: 'text-red-400',
        border: 'border-red-600/40',
        glow: 'shadow-[0_0_10px_rgba(239,68,68,0.25)]',
      };
    case 'Team Blue':
      return {
        bg: 'bg-blue-950/60',
        text: 'text-blue-400',
        border: 'border-blue-600/40',
        glow: 'shadow-[0_0_10px_rgba(59,130,246,0.25)]',
      };
    case 'Team Gold':
      return {
        bg: 'bg-amber-950/60',
        text: 'text-amber-300',
        border: 'border-amber-500/40',
        glow: 'shadow-[0_0_10px_rgba(245,158,11,0.25)]',
      };
    case 'Team Black':
      return {
        bg: 'bg-zinc-900/80',
        text: 'text-zinc-300',
        border: 'border-zinc-700/60',
        glow: 'shadow-[0_0_10px_rgba(113,113,122,0.2)]',
      };
  }
};

export const getTeamAvatarColor = (team: Team): string => {
  switch (team) {
    case 'Team Red':
      return '#ef4444';
    case 'Team Blue':
      return '#3b82f6';
    case 'Team Gold':
      return '#eab308';
    case 'Team Black':
      return '#52525b';
  }
};

export const formatCurrentTime = (): string => {
  const now = new Date();
  return now.toTimeString().split(' ')[0]; // HH:MM:SS
};

export const formatTimerSeconds = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const generateUniqueId = (prefix: string = 'id'): string => {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
};

// Singleton Web Audio Context to avoid browser context leak limits and handle suspension
let sharedAudioCtx: AudioContext | null = null;

export const getSharedAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioContextClass();
    }

    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
};

// Global audio unlocker to satisfy browser user gesture requirements
export const unlockAudioContext = () => {
  const ctx = getSharedAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }
};

// Web Audio API synthesizer for authentic reality show sound effects
export const playAttentionChime = (type: 'buzz' | 'alert' | 'complete' | 'evict' | 'announcement') => {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'announcement' || type === 'alert') {
      // Iconic Big Boss 3-tone attention broadcast chime (C5 -> E5 -> G5 -> loud C6 tone)
      const playTone = (freq: number, startOffset: number, duration: number, vol = 0.25) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + startOffset);
        gain.gain.setValueAtTime(0, now + startOffset);
        gain.gain.linearRampToValueAtTime(vol, now + startOffset + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + startOffset);
        osc.stop(now + startOffset + duration);
      };

      playTone(523.25, 0.0, 0.25, 0.3); // C5
      playTone(659.25, 0.18, 0.25, 0.3); // E5
      playTone(783.99, 0.36, 0.3, 0.35); // G5
      playTone(1046.5, 0.56, 0.5, 0.4); // C6 loud final announcement ding
    } else if (type === 'buzz') {
      // Big Boss dramatic horn buzzer
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.7);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
    } else if (type === 'complete') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.12);
      osc.frequency.setValueAtTime(783.99, now + 0.24);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === 'evict') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 1.0);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.0);
    }
  } catch (e) {
    console.warn('Audio playback error', e);
  }
};

// Web Speech API with failover and Chrome/Safari race condition fixes
export const speakAnnouncement = (text: string, voiceEnabled: boolean = true) => {
  // Always trigger the broadcast chime so the user definitely hears the announcement
  playAttentionChime('announcement');

  if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    // Resume speech synthesis in case the browser suspended it
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel(); // Clear any queued or stalled utterances

    // Format clean spoken text
    let speechText = text
      .replace(/[^\w\s.,!?'"-\/]/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!speechText) return;

    if (!speechText.toLowerCase().includes('big boss')) {
      speechText = `Attention housemates. Big Boss announcement. ${speechText}`;
    }

    // Schedule slightly after the chime and cancel() tick to prevent Chrome utterance drop bug
    setTimeout(() => {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.volume = 1.0;
        utterance.rate = 0.92; // Authoritative pacing
        utterance.pitch = 0.82; // Deep baritone command voice

        // Look for suitable English voice
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const preferredVoice = voices.find(
            (v) =>
              (v.lang.startsWith('en') &&
                (v.name.includes('Male') ||
                  v.name.includes('David') ||
                  v.name.includes('George') ||
                  v.name.includes('Daniel') ||
                  v.name.includes('Google UK English Male') ||
                  v.name.includes('Natural'))) ||
              v.lang === 'en-GB' ||
              v.lang === 'en-US' ||
              v.lang.startsWith('en')
          );
          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
        }

        window.speechSynthesis.speak(utterance);
      } catch (innerErr) {
        console.warn('Utterance dispatch failed', innerErr);
      }
    }, 120);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
};
