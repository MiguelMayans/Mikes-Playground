type Props = {
  onKeyPress: (k: string) => void;
};

// Spanish alphabet with ñ
const letters = "abcdefghijklmnñopqrstuvwxyz".split("");

export default function OnScreenKeyboard({ onKeyPress }: Props) {
  return (
    <div className="osk" role="group" aria-label="Teclado en pantalla">
      {letters.map((l, idx) => (
        <button
          key={l}
          className={`osk-key key-${idx % 6}`}
          onClick={() => onKeyPress(l)}
          aria-label={`Key ${l}`}
          type="button"
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
