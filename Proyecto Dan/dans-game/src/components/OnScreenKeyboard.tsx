type Props = {
  onKeyPress: (k: string) => void;
};

// Spanish ISO keyboard layout (QWERTY)
const rows = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ñ"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

export default function OnScreenKeyboard({ onKeyPress }: Props) {
  let colorIdx = 0;
  return (
    <div className="osk" role="group" aria-label="Teclado en pantalla">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="osk-row">
          {row.map((l) => {
            const cls = `osk-key key-${colorIdx++ % 6}`;
            return (
              <button
                key={l}
                className={cls}
                onClick={() => onKeyPress(l)}
                aria-label={`Key ${l}`}
                type="button"
              >
                {l.toUpperCase()}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
