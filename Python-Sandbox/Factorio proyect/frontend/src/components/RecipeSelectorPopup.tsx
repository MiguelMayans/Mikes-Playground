import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getItemRecipes } from "../api";
import { cn } from "../lib/utils";

export function RecipeSelectorPopup({
  itemId,
  currentRecipeId,
  onSelect,
  onClose,
}: {
  itemId: string;
  currentRecipeId: string | null;
  onSelect: (recipeId: string) => void;
  onClose: () => void;
}) {
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    getItemRecipes(itemId)
      .then(setRecipes)
      .catch(() => {});
  }, [itemId]);

  if (recipes.length <= 1) return null;

  return (
    <div className="absolute top-full left-0 mt-2 z-50 w-64 rounded-xl border border-[var(--color-border-2)] bg-[var(--color-surface-2)] shadow-2xl overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border-1)]">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-tertiary)]">
          Recetas
        </span>
        <button
          onClick={onClose}
          className="text-[var(--color-text-dim)] hover:text-white transition-colors p-1 rounded hover:bg-[var(--color-surface-3)]"
        >
          <X size={13} />
        </button>
      </div>
      {recipes.map((r) => (
        <button
          key={r.id}
          className={cn(
            "w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-[var(--color-surface-3)]",
            r.id === currentRecipeId &&
              "bg-[rgba(255,140,0,0.08)] border-l-2 border-[var(--color-orange-500)]",
          )}
          onClick={() => {
            onSelect(r.id);
            onClose();
          }}
        >
          <span className="text-[var(--color-text-primary)] text-xs">
            {r.name}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] bg-[var(--color-surface-3)] px-2 py-0.5 rounded-full">
            {r.category}
          </span>
        </button>
      ))}
    </div>
  );
}
