type Props = {
  onStartLevel1: () => void;
  onStartLevel2: () => void;
  bestStreak: number;
  totalWords: number;
};

export default function StartScreen({ onStartLevel1, onStartLevel2, bestStreak, totalWords }: Props) {
  return (
    <div className="app-root">
      <div className="card menu-card">
        <div className="menu-mascot-wrap">
          <div className="menu-mascot-bear">🐻</div>
          <div className="mascot menu-mascot-pill">
            ¡Palabras con TOTO!
          </div>
        </div>

        <div className="menu-body">
          <p className="menu-intro">¡Hola Dani! Elige un nivel para empezar:</p>

          <div className="level-buttons">
            <button className="level-btn level-1" onClick={onStartLevel1} type="button">
              <span className="level-title">Nivel 1</span>
              <span className="level-desc">Palabras cortas y fáciles</span>
            </button>
            <button className="level-btn level-2" onClick={onStartLevel2} type="button">
              <span className="level-title">Nivel 2</span>
              <span className="level-desc">Palabras un poco más difíciles</span>
            </button>
          </div>

          <div className="menu-stats">
            <div className="menu-stat">
              <span className="menu-stat-value">{totalWords}</span>
              <span className="menu-stat-label">palabras hoy</span>
            </div>
            <div className="menu-stat">
              <span className="menu-stat-value">{bestStreak}</span>
              <span className="menu-stat-label">mejor racha</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
