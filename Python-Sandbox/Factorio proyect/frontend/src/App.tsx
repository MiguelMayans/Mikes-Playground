import { useEffect, useState, useCallback, useRef } from "react";
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
  Copy,
  Check,
} from "lucide-react";
import { calculate, getItems, getRecipes } from "./api";
import type { CalculationResult, Item } from "./types";
import { cn } from "./lib/utils";
import { collectRawResources } from "./lib/resources";
import { ItemIcon } from "./components/ItemIcon";
import { TreeNodeRow } from "./components/TreeNodeRow";
import { TechnologyTab } from "./components/TechnologyTab";

const API_BASE = "http://localhost:8000";

interface TargetInput {
  id: string;
  item_id: string;
  rate_per_minute: number;
}

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [targets, setTargets] = useState<TargetInput[]>([
    { id: "1", item_id: "", rate_per_minute: 1 },
  ]);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [recipeOverrides, setRecipeOverrides] = useState<Record<string, string>>({});
  const [machineOverrides, setMachineOverrides] = useState<Record<string, string>>({});
  const [timeUnit, setTimeUnit] = useState<"sec" | "min" | "hr">("min");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [allExpanded, setAllExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<"ratios" | "technologies">("ratios");
  const [recipeNames, setRecipeNames] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const itemsListRef = useRef<HTMLDivElement>(null);

  // Load items + recipe names on mount
  useEffect(() => {
    setItemsLoading(true);
    Promise.all([getItems(), getRecipes()])
      .then(([data, recipes]) => {
        setItems(data);
        const names: Record<string, string> = {};
        recipes.forEach((r) => { names[r.id] = r.name; });
        setRecipeNames(names);
        if (data.length > 0) {
          setTargets([{ id: "1", item_id: data[0].id, rate_per_minute: 1 }]);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setItemsLoading(false));
  }, []);

  // Autofocus search on page load
  useEffect(() => {
    const timer = setTimeout(() => searchInputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && itemsListRef.current) {
      const buttons = itemsListRef.current.querySelectorAll("button");
      if (buttons[highlightedIndex]) {
        buttons[highlightedIndex].scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [highlightedIndex]);

  // Reset highlight when search changes
  useEffect(() => {
    setHighlightedIndex(search.trim() === "" ? -1 : 0);
  }, [search]);

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

  // Auto-recalculate when overrides change
  useEffect(() => {
    if (result) handleCalculate();
  }, [recipeOverrides, machineOverrides, result, handleCalculate]);

  const addTarget = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    if (targets.some((t) => t.item_id === itemId)) return;
    setTargets((p) => [
      ...p,
      { id: String(Date.now()), item_id: itemId, rate_per_minute: 1 },
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
      text += `${item?.name || tr.target_item} @ ${(tr.target_rate * displayMultiplier).toFixed(2)}${rateLabel}\n`;
      text += "-".repeat(30) + "\n";
    });
    text += "\nTotal máquinas:\n";
    Object.entries(result.total_machines).forEach(([name, count]) => {
      text += `  ${name}: ${count.toFixed(2)}\n`;
    });
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const toBackendMultiplier = timeUnit === "sec" ? 60 : timeUnit === "hr" ? 1 / 60 : 1;
  const displayMultiplier = timeUnit === "sec" ? 1 / 60 : timeUnit === "hr" ? 60 : 1;
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
          <div className="max-w-[1600px] mx-auto px-8 pt-10 pb-0 relative">
            <div className="flex items-end justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-orange-500)] to-[var(--color-orange-700)] flex items-center justify-center shadow-xl shadow-orange-500/20 ring-2 ring-[var(--color-orange-500)]/30">
                    <Pickaxe size={26} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div className="absolute -bottom-2 -right-3 w-10 h-10">
                    <img
                      src={`${API_BASE}/icons/character.png`}
                      alt="Engineer"
                      className="pixelated w-full h-full object-contain drop-shadow-lg"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
                    Factorio Ratio<span className="text-[var(--color-orange-500)]">Lab</span>
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

            {/* Tabs */}
            <div className="flex items-center gap-1 mt-8">
              <button
                onClick={() => setActiveTab("ratios")}
                className={cn(
                  "px-5 py-2.5 rounded-t-xl text-sm font-semibold transition-all border-t border-x",
                  activeTab === "ratios"
                    ? "bg-[var(--color-surface-0)] border-[var(--color-border-1)] text-[var(--color-orange-400)]"
                    : "bg-transparent border-transparent text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                )}
              >
                <Factory size={14} className="inline mr-2 -mt-0.5" />
                Ratios
              </button>
              <button
                onClick={() => setActiveTab("technologies")}
                className={cn(
                  "px-5 py-2.5 rounded-t-xl text-sm font-semibold transition-all border-t border-x",
                  activeTab === "technologies"
                    ? "bg-[var(--color-surface-0)] border-[var(--color-border-1)] text-[var(--color-orange-400)]"
                    : "bg-transparent border-transparent text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                )}
              >
                <Beaker size={14} className="inline mr-2 -mt-0.5" />
                Tecnologías
              </button>
            </div>
          </div>
        </header>

        {activeTab === "ratios" && (
          itemsLoading ? (
            <div className="max-w-[1600px] mx-auto p-8 flex items-center justify-center min-h-[60vh]">
              <div className="flex flex-col items-center gap-4 text-[var(--color-text-dim)]">
                <div className="w-10 h-10 border-2 border-[var(--color-orange-500)]/30 border-t-[var(--color-orange-500)] rounded-full animate-spin" />
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">Cargando datos de Factorio...</p>
              </div>
            </div>
          ) : (
            <div className="max-w-[1600px] mx-auto p-8 grid grid-cols-[420px_1fr] gap-8">
              {/* Sidebar */}
              <aside className="space-y-5">
                {/* Search */}
                <div className="rounded-2xl border border-[var(--color-border-1)] bg-[var(--color-surface-0)]/80 backdrop-blur-sm shadow-xl shadow-black/20">
                  <div className="p-5 space-y-4">
                    <div className="relative">
                      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (filteredItems.length === 0) return;
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setHighlightedIndex((prev) =>
                              prev < filteredItems.length - 1 ? prev + 1 : prev
                            );
                          } else if (e.key === "ArrowUp") {
                            e.preventDefault();
                            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                          } else if (e.key === "Enter") {
                            e.preventDefault();
                            if (highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
                              addTarget(filteredItems[highlightedIndex].id);
                              setSearch("");
                              setHighlightedIndex(-1);
                            }
                          } else if (e.key === "Escape") {
                            setSearch("");
                            setHighlightedIndex(-1);
                            searchInputRef.current?.focus();
                          }
                        }}
                        placeholder="Buscar item..."
                        className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border-2)] text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-dim)] outline-none focus:border-[var(--color-orange-500)]/50 focus:ring-2 focus:ring-[var(--color-orange-500)]/10 transition-all"
                      />
                      {search.length > 0 && (
                        <button
                          onClick={() => {
                            setSearch("");
                            setHighlightedIndex(-1);
                            searchInputRef.current?.focus();
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)] hover:text-white transition-colors p-1 rounded hover:bg-[var(--color-surface-3)]"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Items list */}
                    <div className="max-h-[400px] overflow-y-auto space-y-1 pr-1" ref={itemsListRef}>
                      {filteredItems.length === 0 ? (
                        <div className="text-center py-8 text-xs text-[var(--color-text-dim)]">
                          No se encontraron items
                        </div>
                      ) : (
                        filteredItems.map((item, index) => (
                          <button
                            key={item.id}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors group",
                              "hover:bg-[var(--color-surface-2)]",
                              highlightedIndex === index && "bg-[var(--color-orange-500)]/10 border border-[var(--color-orange-500)]/30"
                            )}
                            onClick={() => {
                              addTarget(item.id);
                              setSearch("");
                              setHighlightedIndex(-1);
                            }}
                          >
                            <ItemIcon icon={item.icon} name={item.name} size={26} />
                            <span className={cn(
                              "text-sm transition-colors text-[var(--color-text-primary)] group-hover:text-[var(--color-orange-400)]",
                              highlightedIndex === index && "text-[var(--color-orange-400)]"
                            )}>
                              {item.name}
                            </span>
                            <Plus
                              size={14}
                              className={cn(
                                "ml-auto transition-opacity text-[var(--color-text-dim)] opacity-0 group-hover:opacity-100",
                                highlightedIndex === index && "text-[var(--color-orange-400)] opacity-100"
                              )}
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
                                value={Math.round(target.rate_per_minute * displayMultiplier * 100) / 100}
                                onChange={(e) =>
                                  updateTarget(target.id, {
                                    rate_per_minute: Number(e.target.value) * toBackendMultiplier,
                                  })
                                }
                                min={0.01}
                                step="any"
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
                              {recipeNames[recipeId] || recipeId}
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
                      const rawResources = tr.tree ? Array.from(collectRawResources(tr.tree).entries()) : [];
                      return (
                        <div
                          key={idx}
                          className="rounded-2xl border border-[var(--color-border-1)] bg-[var(--color-surface-0)]/80 backdrop-blur-sm shadow-xl shadow-black/20 relative z-10"
                        >
                          <div className="px-6 py-4 border-b border-[var(--color-border-1)] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <ItemIcon icon={item?.icon} name={item?.name || tr.target_item} size={30} />
                              <div className="flex items-baseline gap-2.5">
                                <span className="font-bold text-[var(--color-text-primary)]">
                                  {item?.name || tr.target_item}
                                </span>
                                <span className="text-sm font-mono text-[var(--color-orange-400)] font-bold tabular-nums">
                                  @{(tr.target_rate * displayMultiplier).toFixed(2)}{rateLabel}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setAllExpanded(!allExpanded)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] transition-colors"
                              >
                                {allExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                {allExpanded ? "Colapsar" : "Expandir"}
                              </button>
                              <button
                                onClick={exportResults}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] transition-colors"
                              >
                                {copied ? (
                                  <>
                                    <Check size={12} className="text-[var(--color-green)]" />
                                    <span className="text-[var(--color-green)]">Copiado</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={12} />
                                    Copiar
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="p-3">
                            {tr.tree && (
                              <TreeNodeRow
                                node={tr.tree}
                                items={items}
                                expandAll={allExpanded}
                                recipeOverrides={recipeOverrides}
                                machineOverrides={machineOverrides}
                                onRecipeChange={(id, rid) =>
                                  setRecipeOverrides((p) => ({ ...p, [id]: rid }))
                                }
                                onMachineChange={(id, mid) =>
                                  setMachineOverrides((p) => ({ ...p, [id]: mid }))
                                }
                                displayMultiplier={displayMultiplier}
                                rateLabel={rateLabel}
                              />
                            )}
                          </div>
                          {/* Raw resources summary */}
                          {rawResources.length > 0 && (
                            <div className="px-6 py-3 border-t border-[var(--color-border-1)] bg-[var(--color-surface-1)]/50">
                              <div className="flex items-center gap-2 mb-2">
                                <Pickaxe size={12} className="text-[var(--color-cat-raw)]" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                                  Recursos raw necesarios
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {rawResources.map(([itemId, rate]) => {
                                  const rawItem = items.find((i) => i.id === itemId);
                                  return (
                                    <div
                                      key={itemId}
                                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border-1)]"
                                    >
                                      <ItemIcon icon={rawItem?.icon} name={rawItem?.name || itemId} size={18} />
                                      <span className="text-xs text-[var(--color-text-secondary)]">{rawItem?.name || itemId}</span>
                                      <span className="text-xs font-mono font-bold text-[var(--color-cat-raw)] tabular-nums">
                                        {(rate * displayMultiplier).toFixed(1)}{rateLabel}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Totals */}
                    {Object.entries(result.total_machines).length > 0 && (
                      <div className="rounded-2xl border border-[var(--color-border-1)] bg-[var(--color-surface-0)]/80 backdrop-blur-sm shadow-xl shadow-black/20">
                        <div className="px-6 py-4 border-b border-[var(--color-border-1)] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Factory size={14} className="text-[var(--color-orange-500)]" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-secondary)]">
                              Máquinas totales
                            </span>
                          </div>
                        </div>
                        <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {Object.entries(result.total_machines).map(([name, count]) => (
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
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </main>
            </div>
          )
        )}

        {activeTab === "technologies" && <TechnologyTab />}
      </div>
    </div>
  );
}
