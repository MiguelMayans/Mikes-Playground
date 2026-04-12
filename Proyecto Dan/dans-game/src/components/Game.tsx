import { useEffect, useState, useCallback, useRef } from "react";
import OnScreenKeyboard from "./OnScreenKeyboard";
import Feedback from "./Feedback";
import { words } from "../data/words";
import { playCorrectNote, playWrongSound } from "../utils/sounds";

type Spark = { id: number; letterIndex: number; offset: number };

const allWords = [...words.level1, ...words.level2];

function pickRandom() {
  return allWords[Math.floor(Math.random() * allWords.length)].word.toLowerCase();
}

export default function Game() {
  const [word, setWord] = useState<string>(() => pickRandom());
  const [pos, setPos] = useState<number>(0);
  const [wrong, setWrong] = useState<boolean>(false);
  const [wrongIndex, setWrongIndex] = useState<number | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [poppedIndex, setPoppedIndex] = useState<number | null>(null);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const sparkId = useRef(0);

  const reset = useCallback(() => {
    setWord(pickRandom());
    setPos(0);
    setWrong(false);
    setWrongIndex(null);
    setSparks([]);
    setSuccess(false);
  }, []);

  const handleKey = useCallback(
    (k: string) => {
      if (success) return;
      const expected = word[pos];
      if (!expected) return;

      if (k === expected) {
        // Play xylophone note — rises with each correct letter typed
        playCorrectNote(pos);

        const next = pos + 1;
        setPos(next);
        setWrong(false);
        setWrongIndex(null);
        setPoppedIndex(next - 1);
        setTimeout(() => setPoppedIndex(null), 240);

        // Burst 4 sparkle particles from the just-typed letter
        const newSparks: Spark[] = Array.from({ length: 4 }, () => ({
          id: sparkId.current++,
          letterIndex: pos,
          offset: Math.floor(Math.random() * 44) - 22,
        }));
        setSparks((prev) => [...prev, ...newSparks]);
        setTimeout(() => {
          setSparks((prev) =>
            prev.filter((s) => !newSparks.some((n) => n.id === s.id)),
          );
        }, 660);

        if (next >= word.length) {
          setSuccess(true);
          setTimeout(() => reset(), 2400);
        }
      } else {
        // Cartoon boing — funny, not scary
        playWrongSound();

        setWrong(true);
        setWrongIndex(pos);
        setTimeout(() => {
          setWrong(false);
          setWrongIndex(null);
        }, 400);
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
            const entry = allWords.find(
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
                        {/* Thinking emoji on wrong keypress */}
                        {wrongIndex === i && (
                          <span className="wrong-emoji" aria-hidden="true">
                            🙈
                          </span>
                        )}
                        {/* Sparkle particles float up from each correct letter */}
                        {sparks
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
