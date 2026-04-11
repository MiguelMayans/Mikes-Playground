import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { playSuccessJingle } from "../utils/sounds";

type Props = {
  success: boolean;
};

const CONFETTI_COLORS = ["#ffd166", "#ff6b6b", "#06d6a0", "#4cc9f0", "#ff4757"];

const SUCCESS_MESSAGES = [
  "¡Muy bien Dani!",
  "¡Campeón! 🏆",
  "¡Genial Dani! ⭐",
  "¡Increíble! 🎉",
  "¡Eres un crack, Dani! 🚀",
];

export default function Feedback({ success }: Props) {
  const [message, setMessage] = useState(SUCCESS_MESSAGES[0]);

  useEffect(() => {
    if (!success) return;

    // Pick a random encouraging message
    setMessage(
      SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)],
    );

    // Play the success fanfare (drum hit + ascending run + chord)
    playSuccessJingle();

    // Spectacular confetti burst from multiple directions
    try {
      // Main center burst — big and powerful
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

      // Top burst
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
  }, [success]);

  if (!success) return null;

  return (
    <div className="feedback-overlay" aria-live="polite">
      <div className="celebrate-banner">
        {message} <span className="toto-dance">🐻</span>
      </div>
    </div>
  );
}
