import { useEffect, useCallback } from 'react';
import OnScreenKeyboard from './OnScreenKeyboard';
import Feedback from './Feedback';
import ProgressBar from './ProgressBar';
import StartScreen from './StartScreen';
import { useGame } from '../hooks/useGame';
import { findWordEntry } from '../utils/gameHelpers';
import { markUserInteraction } from '../utils/sounds';

export default function Game() {
  const { state, startLevel, handleKeyPress, goMenu } = useGame();

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (/^[a-zñ]$/.test(k)) {
        markUserInteraction();
        handleKeyPress(k);
      }
    },
    [handleKeyPress],
  );

  useEffect(() => {
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onKey]);

  if (state.screen === 'menu') {
    return (
      <StartScreen
        onStartLevel1={() => {
          markUserInteraction();
          startLevel('level1');
        }}
        onStartLevel2={() => {
          markUserInteraction();
          startLevel('level2');
        }}
        bestStreak={state.bestStreak}
        totalWords={state.totalWordsToday}
      />
    );
  }

  if (state.screen === 'victory') {
    return (
      <div className="app-root">
        <div className="card victory-card">
          <div className="mascot-top">
            <div className="mascot">
              ¡Nivel completado! <span className="mascot-emoji">🐻</span>
            </div>
          </div>
          <div className="victory-body">
            <div className="victory-trophy">🏆</div>
            <p className="victory-text">¡Eres un campeón, Dani!</p>
            <div className="victory-stats">
              <span>Racha: {state.streak}</span>
              <span>Mejor racha: {state.bestStreak}</span>
              <span>Palabras hoy: {state.totalWordsToday}</span>
            </div>
            <button className="level-btn level-1" onClick={goMenu} type="button">
              Volver al menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  const entry = findWordEntry(state.word);

  return (
    <div className="app-root">
      <div className="card">
        <div className="mascot-top">
          <div className="mascot">
            El juego de las palabras con TOTO{' '}
            <span className="mascot-emoji">🐻</span>
          </div>
        </div>

        <Feedback
          success={state.success}
          streak={state.streak}
          bestStreak={state.bestStreak}
          totalWords={state.totalWordsToday}
          newAchievements={[]}
        />

        <main className="game-root">
          <ProgressBar
            current={state.currentIndex}
            total={state.levelWords.length}
          />

          {entry?.img ? (
            <div className="word-art">
              <img src={entry.img} alt={entry.word} />
            </div>
          ) : null}

          <div className="word">
            {state.word.split('').map((ch, i) => {
              const isCorrect = i < state.pos;
              const isCurrentWrong = i === state.pos && state.wrong;
              const isPopped = state.poppedIndex === i;
              const classes = ['letter'];
              if (isCorrect) classes.push('correct');
              if (isCurrentWrong) classes.push('wrong');
              if (isPopped) classes.push('pop');
              return (
                <span key={i} className={classes.join(' ')}>
                  {ch.toUpperCase()}
                  {state.wrongIndex === i && (
                    <span className="wrong-emoji" aria-hidden="true">
                      🙈
                    </span>
                  )}
                  {state.sparks
                    .filter((s) => s.letterIndex === i)
                    .map((s) => (
                      <span
                        key={s.id}
                        className="spark"
                        aria-hidden="true"
                        style={{ left: `calc(50% + ${s.offset}px)` }}
                      >
                        ✨
                      </span>
                    ))}
                </span>
              );
            })}
          </div>

          <OnScreenKeyboard
            onKeyPress={(k) => {
              markUserInteraction();
              handleKeyPress(k);
            }}
          />

          <div className="help">
            Pulsa letras en el teclado o usa el teclado físico.
          </div>
        </main>
      </div>
    </div>
  );
}
