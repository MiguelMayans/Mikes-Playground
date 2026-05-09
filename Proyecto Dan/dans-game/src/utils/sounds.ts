// Web Audio utilities for Dan's game — singleton AudioContext
// All sounds are synthesized — no external files needed.

let audioCtx: AudioContext | null = null;
let userInteracted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  const win = window as unknown as {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  };
  const C = win.AudioContext ?? win.webkitAudioContext;
  if (!C) return null;

  if (!audioCtx) {
    try {
      audioCtx = new C();
    } catch {
      return null;
    }
  }

  if (audioCtx.state === 'suspended' && userInteracted) {
    audioCtx.resume().catch(() => { /* ignore */ });
  }

  return audioCtx;
}

export function markUserInteraction(): void {
  userInteracted = true;
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => { /* ignore */ });
  }
}

function makeCompressor(ctx: AudioContext): DynamicsCompressorNode {
  const c = ctx.createDynamicsCompressor();
  c.threshold.value = -10;
  c.ratio.value = 4;
  c.attack.value = 0.003;
  c.release.value = 0.15;
  c.connect(ctx.destination);
  return c;
}

// Bell note: fundamental + octave + third harmonic → warm, ringing tone
function bell(
  ctx: AudioContext,
  out: AudioNode,
  freq: number,
  start: number,
  dur: number,
  vol = 0.30,
) {
  const wire = (osc: OscillatorNode, g: GainNode) => {
    osc.connect(g);
    g.connect(out);
    osc.start(start);
    osc.stop(start + dur + 0.12);
  };
  const o1 = ctx.createOscillator(); const g1 = ctx.createGain();
  o1.type = 'sine'; o1.frequency.value = freq;
  g1.gain.setValueAtTime(0.001, start);
  g1.gain.exponentialRampToValueAtTime(vol,        start + 0.007);
  g1.gain.exponentialRampToValueAtTime(0.001,      start + dur);
  wire(o1, g1);

  const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
  o2.type = 'sine'; o2.frequency.value = freq * 2;
  g2.gain.setValueAtTime(0.001, start);
  g2.gain.exponentialRampToValueAtTime(vol * 0.28, start + 0.005);
  g2.gain.exponentialRampToValueAtTime(0.001,      start + dur * 0.55);
  wire(o2, g2);

  const o3 = ctx.createOscillator(); const g3 = ctx.createGain();
  o3.type = 'sine'; o3.frequency.value = freq * 3;
  g3.gain.setValueAtTime(0.001, start);
  g3.gain.exponentialRampToValueAtTime(vol * 0.10, start + 0.004);
  g3.gain.exponentialRampToValueAtTime(0.001,      start + dur * 0.28);
  wire(o3, g3);
}

// Brass-style note: sawtooth through a lowpass filter → warm fanfare tone
function brass(
  ctx: AudioContext,
  out: AudioNode,
  freq: number,
  start: number,
  dur: number,
  vol = 0.28,
) {
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const g = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.value = freq;
  filter.type = 'lowpass';
  filter.frequency.value = 900;
  filter.Q.value = 1.2;
  g.gain.setValueAtTime(0.001, start);
  g.gain.exponentialRampToValueAtTime(vol,   start + 0.012);
  g.gain.exponentialRampToValueAtTime(vol * 0.8, start + dur * 0.6);
  g.gain.exponentialRampToValueAtTime(0.001, start + dur);
  osc.connect(filter);
  filter.connect(g);
  g.connect(out);
  osc.start(start);
  osc.stop(start + dur + 0.05);
}

// Square-wave note → retro / chiptune feel
function square(
  ctx: AudioContext,
  out: AudioNode,
  freq: number,
  start: number,
  dur: number,
  vol = 0.22,
) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'square';
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.001, start);
  g.gain.exponentialRampToValueAtTime(vol,   start + 0.005);
  g.gain.exponentialRampToValueAtTime(0.001, start + dur);
  osc.connect(g);
  g.connect(out);
  osc.start(start);
  osc.stop(start + dur + 0.04);
}

// Kick drum: sine sweep from high → low
function kick(ctx: AudioContext, out: AudioNode, start: number, vol = 0.60) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, start);
  osc.frequency.exponentialRampToValueAtTime(30, start + 0.1);
  g.gain.setValueAtTime(0.001, start);
  g.gain.exponentialRampToValueAtTime(vol,   start + 0.005);
  g.gain.exponentialRampToValueAtTime(0.001, start + 0.1);
  osc.connect(g);
  g.connect(out);
  osc.start(start);
  osc.stop(start + 0.12);
}

// Hi-hat: high-pass-filtered white noise
function hihat(ctx: AudioContext, out: AudioNode, start: number, vol = 0.13) {
  const bufSize = Math.floor(ctx.sampleRate * 0.035);
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 5000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol,   start);
  g.gain.exponentialRampToValueAtTime(0.001, start + 0.035);
  src.connect(filter);
  filter.connect(g);
  g.connect(out);
  src.start(start);
  src.stop(start + 0.04);
}

// ─── Jingle A: Bell fanfare (C major) ────────────────────────────────────────
function jingleBells(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const out = makeCompressor(ctx);

  kick(ctx, out, now);
  hihat(ctx, out, now + 0.008);
  hihat(ctx, out, now + 0.21, 0.09);
  hihat(ctx, out, now + 0.42, 0.07);

  bell(ctx, out, 262, now + 0.00, 0.18);       // C4
  bell(ctx, out, 330, now + 0.11, 0.18);       // E4
  bell(ctx, out, 392, now + 0.22, 0.18);       // G4
  bell(ctx, out, 523, now + 0.34, 0.24);       // C5

  bell(ctx, out, 262, now + 0.58, 0.72, 0.26); // chord C4
  bell(ctx, out, 330, now + 0.58, 0.72, 0.26); //       E4
  bell(ctx, out, 392, now + 0.58, 0.72, 0.26); //       G4
  bell(ctx, out, 523, now + 0.58, 0.72, 0.22); //       C5
  bell(ctx, out, 784, now + 0.70, 0.65, 0.14); // G5 sparkle tail
}

// ─── Jingle B: Brass fanfare (G major) ───────────────────────────────────────
function jingleFanfare(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const out = makeCompressor(ctx);

  kick(ctx, out, now);
  hihat(ctx, out, now + 0.005, 0.12);

  brass(ctx, out, 392, now + 0.00, 0.10);  // G4
  brass(ctx, out, 494, now + 0.11, 0.10);  // B4
  brass(ctx, out, 587, now + 0.22, 0.10);  // D5
  brass(ctx, out, 784, now + 0.33, 0.65);  // G5

  kick(ctx, out, now + 0.33, 0.50);
  hihat(ctx, out, now + 0.33, 0.18);

  brass(ctx, out, 392, now + 0.33, 0.65, 0.20);
}

// ─── Jingle C: Magic sparkle (C major, ascending) ────────────────────────────
function jingleSparkle(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const out = makeCompressor(ctx);

  const run = [262, 330, 392, 494, 587, 784, 1047];
  run.forEach((freq, i) => {
    bell(ctx, out, freq, now + i * 0.07, 0.22, 0.22 + i * 0.01);
  });

  const tChord = now + run.length * 0.07 + 0.05;
  bell(ctx, out, 523, tChord, 0.90, 0.24);
  bell(ctx, out, 659, tChord, 0.90, 0.24);
  bell(ctx, out, 784, tChord, 0.90, 0.24);
  bell(ctx, out, 1047, tChord, 0.90, 0.18);
}

// ─── Jingle D: Retro pop (G major, chiptune) ─────────────────────────────────
function jinglePop(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const out = makeCompressor(ctx);

  kick(ctx, out, now + 0.00, 0.55);
  kick(ctx, out, now + 0.15, 0.35);
  kick(ctx, out, now + 0.30, 0.35);
  kick(ctx, out, now + 0.45, 0.55);

  hihat(ctx, out, now + 0.075, 0.10);
  hihat(ctx, out, now + 0.225, 0.10);
  hihat(ctx, out, now + 0.375, 0.10);

  square(ctx, out, 392, now + 0.00, 0.10);
  square(ctx, out, 494, now + 0.12, 0.10);
  square(ctx, out, 587, now + 0.24, 0.10);
  square(ctx, out, 784, now + 0.36, 0.10);

  square(ctx, out, 784, now + 0.50, 0.08);
  square(ctx, out, 988, now + 0.58, 0.45);
  square(ctx, out, 392, now + 0.50, 0.55, 0.18);
  square(ctx, out, 587, now + 0.50, 0.55, 0.15);
}

// ─────────────────────────────────────────────────────────────────────────────

// C pentatonic scale
const PENTATONIC_HZ = [262, 294, 330, 392, 440, 523, 587, 659];

/** Play a xylophone-style note that rises with each correct letter typed. */
export function playCorrectNote(position: number): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const freq = PENTATONIC_HZ[Math.min(position, PENTATONIC_HZ.length - 1)];
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.001, now);
    g.gain.exponentialRampToValueAtTime(0.32, now + 0.008);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  } catch {
    if (import.meta.env.DEV) {
      console.warn('[sounds] playCorrectNote failed');
    }
  }
}

/** Cartoon spring "boing". */
export function playWrongSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
    g.gain.setValueAtTime(0.001, now);
    g.gain.exponentialRampToValueAtTime(0.25, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  } catch {
    if (import.meta.env.DEV) {
      console.warn('[sounds] playWrongSound failed');
    }
  }
}

/** Pick one of 4 distinct celebration jingles at random. */
export function playSuccessJingle(): void {
  const jingles = [jingleBells, jingleFanfare, jingleSparkle, jinglePop];
  try {
    jingles[Math.floor(Math.random() * jingles.length)]();
  } catch {
    if (import.meta.env.DEV) {
      console.warn('[sounds] playSuccessJingle failed');
    }
  }
}
