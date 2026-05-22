const API_BASE = "http://localhost:8000";

export function ItemIcon({
  icon,
  name,
  size = 28,
}: {
  icon?: string | null;
  name: string;
  size?: number;
}) {
  if (!icon) {
    return (
      <span
        className="inline-flex items-center justify-center rounded-lg shrink-0 font-bold text-[10px]"
        style={{
          width: size,
          height: size,
          background: "var(--color-surface-3)",
          color: "var(--color-text-tertiary)",
        }}
      >
        {name[0]?.toUpperCase() || "?"}
      </span>
    );
  }
  return (
    <img
      src={`${API_BASE}${icon}`}
      alt={name}
      className="pixelated shrink-0 rounded-lg"
      style={{ width: size, height: size, objectFit: "contain" }}
      loading="lazy"
    />
  );
}
