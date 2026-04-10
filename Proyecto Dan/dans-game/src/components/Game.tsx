import { useEffect, useState, useCallback } from "react";
import OnScreenKeyboard from "./OnScreenKeyboard";
import Feedback from "./Feedback";
import { words } from "../data/words";

function pickRandom() {
  const list = words.level1;
  return list[Math.floor(Math.random() * list.length)].word.toLowerCase();
}

export default function Game() {
  const [word, setWord] = useState<string>(() => pickRandom());
  const [pos, setPos] = useState<number>(0);
  const [wrong, setWrong] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [poppedIndex, setPoppedIndex] = useState<number | null>(null);

  const reset = useCallback(() => {
    setWord(pickRandom());
    setPos(0);
    setWrong(false);
    setSuccess(false);
  }, []);

  const handleKey = useCallback(
    (k: string) => {
      if (success) return;
      const expected = word[pos];
      if (!expected) return;
      if (k === expected) {
        const next = pos + 1;
        setPos(next);
        setWrong(false);
        setPoppedIndex(next - 1);
        // small pop animation
        setTimeout(() => setPoppedIndex(null), 240);
        // success tone for single letter (softer)
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
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(880, now);
            g.gain.setValueAtTime(0.001, now);
            g.gain.exponentialRampToValueAtTime(0.18, now + 0.01);
            osc.connect(g);
            g.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.09);
          }
        } catch {
          /* ignore audio errors */
        }
        if (next >= word.length) {
          setSuccess(true);
          // keep the success state a bit longer so the banner is visible
          setTimeout(() => reset(), 2400);
        }
      } else {
        setWrong(true);
        // wrong tone and brief shake
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
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = "sawtooth";
            o.frequency.setValueAtTime(220, now);
            g.gain.setValueAtTime(0.001, now);
            g.gain.exponentialRampToValueAtTime(0.22, now + 0.01);
            o.connect(g);
            g.connect(ctx.destination);
            o.start(now);
            o.stop(now + 0.12);
          }
        } catch {
          // viva el vive coding
        }
        setTimeout(() => setWrong(false), 350);
      }
    },
    [pos, word, reset, success],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      // accept basic a-z plus ñ
      if (/^[a-zñ]$/.test(k)) handleKey(k);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleKey]);

  return (
    <div className="app-root">
      <div className="card">
        {/* decorative blob removed to avoid visual clutter */}

        {/* mascot moved outside the header so it doesn't overlap the title */}
        <div className="mascot-top">
          <div className="mascot">
            El juego de las palabras con TOTO{" "}
            <span className="mascot-emoji">🐻</span>
          </div>
        </div>

        {/* feedback overlay placed here so it doesn't shift layout */}
        <Feedback success={success} />

        <main className="game-root">
          {(() => {
            const entry = words.level1.find(
              (e) => e.word.toLowerCase() === word,
            );
            return (
              <>
                {entry?.img ? (
                  <div className="word-art">
                    <img src={entry.img} alt={entry.word} />
                  </div>
                ) : null}

                <div className="word">
                  {word.split("").map((ch, i) => {
                    const isCorrect = i < pos;
                    const isCurrentWrong = i === pos && wrong;
                    const isPopped = poppedIndex === i;
                    const classes = ["letter"];
                    if (isCorrect) classes.push("correct");
                    if (isCurrentWrong) classes.push("wrong");
                    if (isPopped) classes.push("pop");
                    return (
                      <span key={i} className={classes.join(" ")}>
                        {ch.toUpperCase()}
                      </span>
                    );
                  })}
                </div>
              </>
            );
          })()}

          <OnScreenKeyboard onKeyPress={(k) => handleKey(k)} />

          <div className="help">
            Pulsa letras en el teclado o usa el teclado físico.
          </div>
        </main>
      </div>
    </div>
  );
}
