import { useEffect, useState, useCallback, useRef } from "react";
import { calculate, getItems, getItemRecipes } from "./api";
import type { CalculationResult, Item, TreeNode } from "./types";
import {
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  Factory,
  Settings,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  Search,
  Cpu,
  Pickaxe,
  Beaker,
  Clock,
  Copy,
} from "lucide-react";

const API_BASE = "http://localhost:8000";

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function getItemCategoryClass(itemId: string): string {
  if (itemId.includes("ore") || itemId.includes("plate"))
    return "text-[var(--color-cat-mineral)]";
  if (
    itemId.includes("fluid") ||
    itemId.includes("oil") ||
    itemId.includes("gas") ||
    itemId.includes("water") ||
    itemId.includes("steam")
  )
    return "text-[var(--color-cat-fluid)]";
  if (itemId.includes("science")) return "text-[var(--color-cat-science)]";
  if (
    itemId.includes("ammo") ||
    itemId.includes("shell") ||
    itemId.includes("grenade") ||
    itemId.includes("rocket") ||
    itemId.includes("capsule") ||
    itemId.includes("armor")
  )
    return "text-[var(--color-cat-combat)]";
  if (
    itemId.includes("circuit") ||
    itemId.includes("cable") ||
    itemId.includes("wire") ||
    itemId.includes("battery") ||
    itemId.includes("solar") ||
    itemId.includes("radar")
  )
    return "text-[var(--color-cat-utility)]";
  if (
    itemId.includes("engine") ||
    itemId.includes("fuel") ||
    itemId.includes("nuclear") ||
    itemId.includes("uranium")
  )
    return "text-[var(--color-cat-energy)]";
  if (
    itemId.includes("coal") ||
    itemId.includes("stone") ||
    itemId.includes("wood")
  )
    return "text-[var(--color-cat-raw)]";
  return "text-[var(--color-cat-intermediate)]";
}

function ItemIcon({
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

function RecipeSelectorPopup({
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

function MachineSelectorPopup({
  machines,
  currentMachineId,
  onSelect,
  onClose,
}: {
  machines: { id: string; name: string; speed: number; icon?: string | null }[];
  currentMachineId: string | null;
  onSelect: (machineId: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute top-full right-0 mt-2 z-50 w-56 rounded-xl border border-[var(--color-border-2)] bg-[var(--color-surface-2)] shadow-2xl overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border-1)]">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-tertiary)]">
          Máquinas
        </span>
        <button
          onClick={onClose}
          className="text-[var(--color-text-dim)] hover:text-white transition-colors p-1 rounded hover:bg-[var(--color-surface-3)]"
        >
          <X size={13} />
        </button>
      </div>
      {machines.map((m) => (
        <button
          key={m.id}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-[var(--color-surface-3)]",
            m.id === currentMachineId &&
              "bg-[rgba(255,140,0,0.08)] border-l-2 border-[var(--color-orange-500)]",
          )}
          onClick={() => {
            onSelect(m.id);
            onClose();
          }}
        >
          <ItemIcon icon={m.icon} name={m.name} size={22} />
          <div className="flex flex-col">
            <span className="text-[var(--color-text-primary)] text-xs">{m.name}</span>
            <span className="text-[10px] text-[var(--color-text-dim)]">Speed {m.speed}x</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function TreeNodeRow({
  node,
  items,
  depth = 0,
  recipeOverrides,
  machineOverrides,
  onRecipeChange,
  onMachineChange,
}: {
  node: TreeNode;
  items: Item[];
  depth?: number;
  recipeOverrides: Record<string, string>;
  machineOverrides: Record<string, string>;
  onRecipeChange: (itemId: string, recipeId: string) => void;
  onMachineChange: (itemId: string, machineId: string) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [showMachineSelector, setShowMachineSelector] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const itemData = items.find((i) => i.id === node.item_id);
  const hasAlternatives = !!node.recipe_id;
  const isRaw = !node.recipe_id;
  const availableMachines = node.available_machines || [];

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-3 py-3 px-4 rounded-xl transition-all",
          "hover:bg-[var(--color-surface-2)]",
          depth === 0 &&
            "bg-[var(--color-surface-1)] border border-[var(--color-border-1)] mb-1",
        )}
        style={{ paddingLeft: `${20 + depth * 28}px` }}
      >
        {/* Toggle */}
        <button
          onClick={() => hasChildren && setExpanded(!expanded)}
          className={cn(
            "w-6 h-6 flex items-center justify-center rounded-lg transition-all shrink-0",
            hasChildren
              ? "text-[var(--color-text-tertiary)] hover:text-[var(--color-orange-500)] hover:bg-[var(--color-surface-3)] cursor-pointer"
              : "text-[var(--color-text-dim)] cursor-default opacity-50",
          )}
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )
          ) : (
            <span className="text-[10px]">•</span>
          )}
        </button>

        {/* Item */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <ItemIcon icon={itemData?.icon} name={node.item_name} size={34} />
          <div className="flex flex-col min-w-0">
            <span
              className={cn(
                "font-semibold text-[13px] truncate",
                getItemCategoryClass(node.item_id),
              )}
            >
              {node.item_name}
            </span>
            <span className="text-[11px] text-[var(--color-text-dim)] font-mono tabular-nums">
              {node.rate_per_minute.toFixed(1)}{" "}
              <span className="text-[var(--color-text-dim)]">/min</span>
            </span>
          </div>
        </div>

        {/* Recipe */}
        <div className="relative min-w-[140px] max-w-[180px]">
          {hasAlternatives ? (
            <button
              onClick={() => setShowRecipeSelector(!showRecipeSelector)}
              className="text-[11px] text-[var(--color-orange-400)] hover:text-[var(--color-orange-300)] transition-colors border-b border-dashed border-[var(--color-orange-700)] hover:border-[var(--color-orange-400)] pb-0.5"
            >
              {node.recipe_name}
            </button>
          ) : (
            <span className="text-[11px] text-[var(--color-text-dim)]">
              {node.recipe_name}
            </span>
          )}
          {showRecipeSelector && (
            <RecipeSelectorPopup
              itemId={node.item_id}
              currentRecipeId={node.recipe_id}
              onSelect={(rid) => onRecipeChange(node.item_id, rid)}
              onClose={() => setShowRecipeSelector(false)}
            />
          )}
        </div>

        {/* Machines */}
        <div className="flex items-center gap-3 min-w-[130px] justify-end relative">
          {!isRaw && (
            <>
              <span className="font-mono font-bold text-[13px] text-[var(--color-green)] tabular-nums">
                {node.machines_needed.toFixed(2)}
              </span>
              <button
                onClick={() => availableMachines.length > 1 && setShowMachineSelector(!showMachineSelector)}
                className={cn(
                  "flex items-center gap-1.5 min-w-0",
                  availableMachines.length > 1 && "cursor-pointer hover:opacity-80 transition-opacity"
                )}
              >
                <ItemIcon
                  icon={node.machine_icon}
                  name={node.machine_name}
                  size={24}
                />
                <span className="text-[11px] text-[var(--color-text-tertiary)] truncate max-w-[90px]">
                  {node.machine_name}
                </span>
              </button>
              {showMachineSelector && availableMachines.length > 1 && (
                <MachineSelectorPopup
                  machines={availableMachines}
                  currentMachineId={node.machine_id}
                  onSelect={(mid) => onMachineChange(node.item_id, mid)}
                  onClose={() => setShowMachineSelector(false)}
                />
              )}
            </>
          )}
          {isRaw && (
            <span className="text-xs text-[var(--color-text-dim)] font-mono">
              —
            </span>
          )}
        </div>
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div className="relative">
          <div
            className="absolute top-0 bottom-2 w-px bg-gradient-to-b from-[var(--color-border-2)] to-transparent"
            style={{ left: `${20 + depth * 28 + 12}px` }}
          />
          {node.children.map((child, idx) => (
            <TreeNodeRow
              key={idx}
              node={child}
              items={items}
              depth={depth + 1}
              recipeOverrides={recipeOverrides}
              machineOverrides={machineOverrides}
              onRecipeChange={onRecipeChange}
              onMachineChange={onMachineChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface TargetInput {
  id: string;
  item_id: string;
  rate_per_minute: number;
}

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [targets, setTargets] = useState<TargetInput[]>([
    { id: "1", item_id: "", rate_per_minute: 60 },
  ]);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [recipeOverrides, setRecipeOverrides] = useState<Record<string, string>>({});
  const [machineOverrides, setMachineOverrides] = useState<Record<string, string>>({});
  const [timeUnit, setTimeUnit] = useState<"sec" | "min" | "hr">("min");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getItems()
      .then((data) => {
        setItems(data);
        if (data.length > 0) {
          setTargets([{ id: "1", item_id: data[0].id, rate_per_minute: 60 }]);
        }
      })
      .catch((e) => setError(e.message));
  }, []);

  // Autofocus search on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCalculate = useCallback(async () => {
    const valid = targets.filter((t) => t.item_id && t.rate_per_minute > 0);
    if (!valid.length) return;
    setLoading(true);
    setError("");
    try {
      const res = await calculate({
        targets: valid.map((t) => ({
          item_id: t.item_id,
          rate_per_minute: t.rate_per_minute,
        })),
        recipe_overrides: recipeOverrides,
        machine_overrides: machineOverrides,
      });
      if (res.targets?.length) setResult(res);
      else {
        setError("No se pudo calcular");
        setResult(null);
      }
    } catch (e) {
      setError("Error: " + (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [targets, recipeOverrides, machineOverrides]);

  useEffect(() => {
    if (result) handleCalculate();
  }, [recipeOverrides, machineOverrides]);

  const addTarget = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    // Check if already in targets
    if (targets.some((t) => t.item_id === itemId)) return;
    setTargets((p) => [
      ...p,
      { id: String(Date.now()), item_id: itemId, rate_per_minute: 60 },
    ]);
  };

  const removeTarget = (id: string) =>
    setTargets((p) => p.filter((t) => t.id !== id));
  const updateTarget = (id: string, u: Partial<TargetInput>) =>
    setTargets((p) => p.map((t) => (t.id === id ? { ...t, ...u } : t)));

  const exportResults = () => {
    if (!result) return;
    let text = "Factorio RatioLab - Resultados\n";
    text += "=".repeat(40) + "\n\n";
    result.targets.forEach((tr) => {
      const item = items.find((i) => i.id === tr.target_item);
      text += `${item?.name || tr.target_item} @ ${tr.target_rate}/min\n`;
      text += "-".repeat(30) + "\n";
    });
    text += "\nTotal máquinas:\n";
    Object.entries(result.total_machines).forEach(([name, count]) => {
      text += `  ${name}: ${count.toFixed(2)}\n`;
    });
    navigator.clipboard.writeText(text);
  };

  const rateMultiplier = timeUnit === "sec" ? 1 / 60 : timeUnit === "hr" ? 60 : 1;
  const rateLabel = timeUnit === "sec" ? "/s" : timeUnit === "hr" ? "/h" : "/min";

  return (
    <div className="min-h-screen relative">
      {/* Background layers */}
      <div className="bg-mesh" />
      <div className="bg-noise" />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Header */}
        <header className="border-b border-[var(--color-border-1)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-orange-700)]/5 via-transparent to-[var(--color-orange-500)]/5 animate-pulse-glow" />
          <div className="max-w-[1600px] mx-auto px-8 py-10 relative">
            <div className="flex items-end justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-orange-500)] to-[var(--color-orange-700)] flex items-center justify-center shadow-xl shadow-orange-500/20 ring-2 ring-[var(--color-orange-500)]/30">
                    <Pickaxe
                      size={26}
                      className="text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
                    Ratio<span className="text-[var(--color-orange-500)]">Lab</span>
                  </h1>
                  <p className="text-sm text-[var(--color-text-tertiary)] mt-1 font-medium tracking-wide">
                    Calculadora de ratios para Factorio 2.0
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface-1)] border border-[var(--color-border-1)]">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-green)] animate-pulse" />
                  <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                    {items.length.toLocaleString()} items
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-[1600px] mx-auto p-8 grid grid-cols-[420px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Big prominent search */}
            <div className="rounded-2xl border border-[var(--color-border-1)] bg-[var(--color-surface-0)]/80 backdrop-blur-sm shadow-xl shadow-black/20 overflow-hidden">
              <div className="p-5 space-y-4">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]"
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar item..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border-2)] text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-dim)] outline-none focus:border-[var(--color-orange-500)]/50 focus:ring-2 focus:ring-[var(--color-orange-500)]/10 transition-all"
                  />
                </div>

                {/* Items list */}
                <div className="max-h-[300px] overflow-y-auto space-y-1 pr-1">
                  {search.trim() === "" ? (
                    <div className="text-center py-8 text-[var(--color-text-dim)]">
                      <Search size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-xs">Escribe para buscar items</p>
                      <p className="text-[10px] mt-1 opacity-60">
                        {items.length.toLocaleString()} items disponibles
                      </p>
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div className="text-center py-8 text-xs text-[var(--color-text-dim)]">
                      No se encontraron items
                    </div>
                  ) : (
                    filteredItems.slice(0, 30).map((item) => (
                      <button
                        key={item.id}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-[var(--color-surface-2)] transition-colors group"
                        onClick={() => addTarget(item.id)}
                      >
                        <ItemIcon icon={item.icon} name={item.name} size={26} />
                        <span className="text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-orange-400)] transition-colors">
                          {item.name}
                        </span>
                        <Plus
                          size={14}
                          className="ml-auto text-[var(--color-text-dim)] opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Selected targets */}
            {targets.length > 0 && (
              <div className="rounded-2xl border border-[var(--color-border-1)] bg-[var(--color-surface-0)]/80 backdrop-blur-sm shadow-xl shadow-black/20 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[var(--color-border-1)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Factory size={14} className="text-[var(--color-orange-500)]" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-secondary)]">
                      Objetivos ({targets.length})
                    </span>
                  </div>
                  {/* Time unit toggle */}
                  <div className="flex items-center bg-[var(--color-surface-2)] rounded-lg p-0.5">
                    {(["sec", "min", "hr"] as const).map((u) => (
                      <button
                        key={u}
                        onClick={() => setTimeUnit(u)}
                        className={cn(
                          "px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase transition-all",
                          timeUnit === u
                            ? "bg-[var(--color-orange-500)] text-white shadow-sm"
                            : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]",
                        )}
                      >
                        {u === "sec" ? "/s" : u === "hr" ? "/h" : "/min"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  {targets.map((target) => {
                    const item = items.find((i) => i.id === target.item_id);
                    return (
                      <div
                        key={target.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border-1)]"
                      >
                        {item && (
                          <ItemIcon icon={item.icon} name={item.name} size={28} />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                            {item?.name || target.item_id}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={target.rate_per_minute}
                            onChange={(e) =>
                              updateTarget(target.id, {
                                rate_per_minute: Number(e.target.value),
                              })
                            }
                            min={1}
                            className="w-20 px-3 py-2 rounded-lg bg-[var(--color-surface-3)] border border-[var(--color-border-1)] text-sm font-mono font-bold text-[var(--color-text-primary)] text-right outline-none focus:border-[var(--color-orange-500)]/50 transition-colors tabular-nums"
                          />
                          <span className="text-[11px] text-[var(--color-text-dim)] font-mono w-6">
                            {rateLabel}
                          </span>
                        </div>
                        <button
                          onClick={() => removeTarget(target.id)}
                          className="p-2 rounded-lg text-[var(--color-text-dim)] hover:text-[var(--color-red)] hover:bg-[var(--color-red)]/10 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}

                  {error && (
                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[var(--color-red)]/8 border border-[var(--color-red)]/15 text-xs text-[var(--color-red)]">
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleCalculate}
                    disabled={loading || targets.some((t) => !t.item_id)}
                    className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-gradient-to-r from-[var(--color-orange-600)] to-[var(--color-orange-500)] text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Calculando...
                      </>
                    ) : (
                      <>
                        <TrendingUp size={16} />
                        Calcular
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Overrides */}
            {Object.keys(recipeOverrides).length > 0 && (
              <div className="rounded-2xl border border-[var(--color-border-1)] bg-[var(--color-surface-0)]/80 backdrop-blur-sm shadow-xl shadow-black/20 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[var(--color-border-1)] flex items-center gap-2">
                  <Settings size={14} className="text-[var(--color-orange-500)]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-secondary)]">
                    Recetas activas
                  </span>
                </div>
                <div className="p-4 flex flex-wrap gap-2">
                  {Object.entries(recipeOverrides).map(([itemId, recipeId]) => {
                    const item = items.find((i) => i.id === itemId);
                    return (
                      <span
                        key={itemId}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border-1)] text-xs"
                      >
                        <span className="text-[var(--color-text-secondary)]">
                          {item?.name || itemId}
                        </span>
                        <ArrowRight size={10} className="text-[var(--color-text-dim)]" />
                        <span className="text-[var(--color-orange-400)] font-medium">
                          {recipeId}
                        </span>
                        <button
                          onClick={() =>
                            setRecipeOverrides((p) => {
                              const n = { ...p };
                              delete n[itemId];
                              return n;
                            })
                          }
                          className="text-[var(--color-text-dim)] hover:text-[var(--color-red)] transition-colors ml-1"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>

          {/* Main content */}
          <main className="min-w-0">
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center gap-5 text-[var(--color-text-dim)] py-40">
                <div className="w-20 h-20 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-border-1)] flex items-center justify-center shadow-lg shadow-black/30">
                  <Cpu size={32} className="text-[var(--color-text-tertiary)]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                    Busca un item y añádelo como objetivo
                  </p>
                  <p className="text-xs text-[var(--color-text-dim)] mt-1.5">
                    El árbol de producción aparecerá aquí
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Target trees */}
                {result.targets.map((tr, idx) => {
                  const item = items.find((i) => i.id === tr.target_item);
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-[var(--color-border-1)] bg-[var(--color-surface-0)]/80 backdrop-blur-sm shadow-xl shadow-black/20 overflow-hidden"
                    >
                      <div className="px-6 py-4 border-b border-[var(--color-border-1)] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ItemIcon
                            icon={item?.icon}
                            name={item?.name || tr.target_item}
                            size={30}
                          />
                          <div className="flex items-baseline gap-2.5">
                            <span className="font-bold text-[var(--color-text-primary)]">
                              {item?.name || tr.target_item}
                            </span>
                            <span className="text-sm font-mono text-[var(--color-orange-400)] font-bold tabular-nums">
                              @{tr.target_rate}/min
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={exportResults}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] transition-colors"
                        >
                          <Copy size={12} />
                          Copiar
                        </button>
                      </div>
                      <div className="p-3">
                        {tr.tree && (
                          <TreeNodeRow
                            node={tr.tree}
                            items={items}
                            recipeOverrides={recipeOverrides}
                            machineOverrides={machineOverrides}
                            onRecipeChange={(id, rid) =>
                              setRecipeOverrides((p) => ({ ...p, [id]: rid }))
                            }
                            onMachineChange={(id, mid) =>
                              setMachineOverrides((p) => ({ ...p, [id]: mid }))
                            }
                          />
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Totals */}
                {Object.entries(result.total_machines).length > 0 && (
                  <div className="rounded-2xl border border-[var(--color-border-1)] bg-[var(--color-surface-0)]/80 backdrop-blur-sm shadow-xl shadow-black/20 overflow-hidden">
                    <div className="px-6 py-4 border-b border-[var(--color-border-1)] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Factory
                          size={14}
                          className="text-[var(--color-orange-500)]"
                        />
                        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-secondary)]">
                          Máquinas totales
                        </span>
                      </div>
                    </div>
                    <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {Object.entries(result.total_machines).map(
                        ([name, count]) => (
                          <div
                            key={name}
                            className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border-1)] hover:border-[var(--color-border-2)] transition-all hover:shadow-lg hover:shadow-black/20 group"
                          >
                            <span className="text-sm font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
                              {name}
                            </span>
                            <span className="font-mono font-bold text-[var(--color-green)] tabular-nums">
                              {count.toFixed(2)}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
