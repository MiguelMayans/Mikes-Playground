import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playSuccessJingle } from '../utils/sounds';

type Props = {
  success: boolean;
  streak: number;
  bestStreak: number;
  totalWords: number;
  newAchievements: string[];
};

const CONFETTI_COLORS = ['#ffd166', '#ff6b6b', '#06d6a0', '#4cc9f0', '#ff4757'];

const SUCCESS_MESSAGES = [
  '¡Muy bien Dani!',
  '¡Campeón! 🏆',
  '¡Genial Dani! ⭐',
  '¡Increíble! 🎉',
  '¡Eres un crack, Dani! 🚀',
];

const ACHIEVEMENT_NAMES: Record<string, string> = {
  novice: '🥉 Aprendiz',
  expert: '🥈 Experto',
  master: '🥇 Maestro',
  streak_3: '🔥 Racha de 3',
  streak_5: '⚡ Racha de 5',
  streak_10: '🌟 Racha de 10',
  best_streak_10: '🏆 Mejor racha 10',
};

export default function Feedback({ success, streak, bestStreak, totalWords, newAchievements }: Props) {
  const message = SUCCESS_MESSAGES[(totalWords + streak) % SUCCESS_MESSAGES.length];

  useEffect(() => {
    if (!success) return;

    playSuccessJingle();

    try {
      confetti({
        particleCount: 200,
        spread: 180,
        startVelocity: 45,
        ticks: 250,
        origin: { x: 0.5, y: 0.5 },
        colors: CONFETTI_COLORS,
      });
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 120,
          startVelocity: 35,
          origin: { x: 0.2, y: 0.3 },
          colors: CONFETTI_COLORS,
        });
      }, 100);
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 120,
          startVelocity: 35,
          origin: { x: 0.8, y: 0.3 },
          colors: CONFETTI_COLORS,
        });
      }, 150);
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 90,
          startVelocity: 40,
          origin: { x: 0.5, y: 0 },
          colors: CONFETTI_COLORS,
        });
      }, 200);
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
      // ignore
    }
  }, [success]);

  if (!success) return null;

  return (
    <div className="feedback-overlay" aria-live="polite">
      <div className="celebrate-banner">
        <div>{message} <span className="toto-dance">🐻</span></div>
        <div className="stats-row">
          <span className="stat">Racha: {streak}</span>
          <span className="stat">Mejor: {bestStreak}</span>
          <span className="stat">Hoy: {totalWords}</span>
        </div>
        {newAchievements.length > 0 && (
          <div className="achievements-pop">
            {newAchievements.map(id => (
              <div key={id} className="achievement-badge">
                ¡{ACHIEVEMENT_NAMES[id] || id}!
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
