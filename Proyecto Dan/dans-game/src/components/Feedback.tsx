import { useEffect } from "react";
import confetti from "canvas-confetti";

type Props = {
  success: boolean;
};

const CONFETTI_COLORS = ["#ffd166", "#ff6b6b", "#06d6a0", "#4cc9f0", "#ff4757"];

export default function Feedback({ success }: Props) {
  useEffect(() => {
    if (!success) return;

    // Spectacular confetti burst from multiple directions
    try {
      // Main center burst - big and powerful
      confetti({
        particleCount: 200,
        spread: 180,
        startVelocity: 45,
        ticks: 250,
        origin: { x: 0.5, y: 0.5 },
        colors: CONFETTI_COLORS,
      });

      // Left side burst
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 120,
          startVelocity: 35,
          origin: { x: 0.2, y: 0.3 },
          colors: CONFETTI_COLORS,
        });
      }, 100);

      // Right side burst
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 120,
          startVelocity: 35,
          origin: { x: 0.8, y: 0.3 },
          colors: CONFETTI_COLORS,
        });
      }, 150);

      // Top side burst
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 90,
          startVelocity: 40,
          origin: { x: 0.5, y: 0 },
          colors: CONFETTI_COLORS,
        });
      }, 200);

      // Bottom scattered burst
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 160,
          startVelocity: 20,
          origin: { x: 0.5, y: 0.7 },
          colors: CONFETTI_COLORS,
        });
      }, 350);
    } catch {
      // ignore if confetti fails
    }

    // Play uplifting, playful success jingle using WebAudio
    try {
      function createAudioContext(): AudioContext | null {
        const win = window as unknown as {
          AudioContext?: typeof AudioContext;
          webkitAudioContext?: typeof AudioContext;
        };
        const C = win.AudioContext ?? win.webkitAudioContext;
        if (!C) return null;
        try {
          return new C();
        } catch {
          return null;
        }
      }

      const ctx = createAudioContext();
      if (ctx) {
        const now = ctx.currentTime;
        const g = ctx.createGain();
        g.connect(ctx.destination);
        g.gain.setValueAtTime(0.0001, now);

        const playNote = (
          freq: number,
          startTime: number,
          duration: number,
        ) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, startTime);
          osc.connect(g);
          osc.start(startTime);
          osc.stop(startTime + duration);
        };

        // Uplifting arpeggio: C-E-G notes (playful melody)

        const peakGain = 0.5;
        const noteLength = 0.12;

        // Note 1: C (262 Hz) - rise
        g.gain.exponentialRampToValueAtTime(peakGain, now + 0.05);
        playNote(262, now, noteLength);

        // Note 2: E (330 Hz)
        g.gain.setValueAtTime(peakGain, now + noteLength - 0.02);
        playNote(330, now + noteLength - 0.02, noteLength);

        // Note 3: G (392 Hz)
        g.gain.setValueAtTime(peakGain, now + noteLength * 2 - 0.04);
        playNote(392, now + noteLength * 2 - 0.04, noteLength);

        // High octave C (523 Hz) - high celebrate note
        g.gain.setValueAtTime(peakGain * 0.8, now + noteLength * 3 - 0.06);
        playNote(523, now + noteLength * 3 - 0.06, noteLength * 1.5);

        // Fade out
        g.gain.exponentialRampToValueAtTime(0.0001, now + noteLength * 4.2);
      }
    } catch {
      // ignore audio errors
    }
  }, [success]);

  if (!success) return null;

  return (
    <div className="feedback-overlay" aria-live="polite">
      <div className="celebrate-banner">¡Muy bien Dani!</div>
    </div>
  );
}
