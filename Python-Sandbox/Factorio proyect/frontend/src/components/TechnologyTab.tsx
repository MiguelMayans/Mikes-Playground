import { useEffect, useRef, useState } from "react";
import { Beaker, ChevronDown, ChevronRight, Search } from "lucide-react";
import { getTechnologies, getTechnologyTree } from "../api";
import { cn } from "../lib/utils";

interface TechNode {
  id: string;
  name: string;
  cost: any;
  effects: { type: string; recipe: string }[];
  children: TechNode[];
}

function TechTreeNode({ node, depth = 0 }: { node: TechNode; depth?: number }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-3 py-3 px-4 rounded-xl transition-all hover:bg-[var(--color-surface-2)]",
          depth === 0 && "bg-[var(--color-surface-1)] border border-[var(--color-border-1)]"
        )}
        style={{ paddingLeft: `${16 + depth * 24}px` }}
      >
        <button
          onClick={() => hasChildren && setExpanded(!expanded)}
          className={cn(
            "w-5 h-5 flex items-center justify-center rounded-md transition-all shrink-0",
            hasChildren
              ? "text-[var(--color-text-tertiary)] hover:text-[var(--color-orange-500)] cursor-pointer"
              : "text-[var(--color-text-dim)] cursor-default opacity-50"
          )}
        >
          {hasChildren ? (expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />) : <span className="text-[8px]">•</span>}
        </button>
        <Beaker size={16} className="text-[var(--color-orange-400)] shrink-0" />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm font-medium text-[var(--color-text-primary)]">{node.name}</span>
          {node.cost && (
            <span className="text-[10px] text-[var(--color-text-dim)]">
              {node.cost.trigger_type
                ? `${node.cost.trigger_type}: ${node.cost.item} (${node.cost.count})`
                : `${node.cost.count} packs · ${node.cost.time}s · ${node.cost.ingredients?.map((i: any) => `${i.amount} ${i.name}`).join(", ") || ""}`
              }
            </span>
          )}
        </div>
      </div>
      {expanded && hasChildren && (
        <div className="relative">
          <div
            className="absolute top-0 bottom-2 w-px bg-gradient-to-b from-[var(--color-border-2)] to-transparent"
            style={{ left: `${16 + depth * 24 + 10}px` }}
          />
          {node.children.map((child, idx) => (
            <TechTreeNode key={idx} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function TechnologyTab() {
  const [techSearch, setTechSearch] = useState("");
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [techTree, setTechTree] = useState<TechNode | null>(null);
  const [loading, setLoading] = useState(false);
  const techSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTechnologies().then(setTechnologies).catch(() => {});
    setTimeout(() => techSearchRef.current?.focus(), 300);
  }, []);

  useEffect(() => {
    if (selectedTech) {
      setLoading(true);
      getTechnologyTree(selectedTech)
        .then((tree) => { setTechTree(tree); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [selectedTech]);

  const filteredTechs = technologies.filter((t) =>
    t.name.toLowerCase().includes(techSearch.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto p-8 grid grid-cols-[380px_1fr] gap-8">
      <aside className="space-y-5">
        <div className="rounded-2xl border border-[var(--color-border-1)] bg-[var(--color-surface-0)]/80 backdrop-blur-sm shadow-xl shadow-black/20">
          <div className="p-5 space-y-4">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
              <input
                ref={techSearchRef}
                type="text"
                value={techSearch}
                onChange={(e) => setTechSearch(e.target.value)}
                placeholder="Buscar tecnología..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border-2)] text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-dim)] outline-none focus:border-[var(--color-orange-500)]/50 focus:ring-2 focus:ring-[var(--color-orange-500)]/10 transition-all"
              />
            </div>
            <div className="max-h-[500px] overflow-y-auto space-y-1 pr-1">
              {filteredTechs.map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => setSelectedTech(tech.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors",
                    selectedTech === tech.id
                      ? "bg-[var(--color-orange-500)]/10 border border-[var(--color-orange-500)]/30"
                      : "hover:bg-[var(--color-surface-2)]"
                  )}
                >
                  <Beaker size={18} className={selectedTech === tech.id ? "text-[var(--color-orange-400)]" : "text-[var(--color-text-tertiary)]"} />
                  <div className="flex flex-col min-w-0">
                    <span className={cn("text-sm font-medium", selectedTech === tech.id ? "text-[var(--color-orange-400)]" : "text-[var(--color-text-primary)]")}>
                      {tech.name}
                    </span>
                    <span className="text-[10px] text-[var(--color-text-dim)]">
                      {tech.prerequisites.length} prerequisitos
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <main className="min-w-0">
        {!selectedTech ? (
          <div className="h-full flex flex-col items-center justify-center gap-5 text-[var(--color-text-dim)] py-40">
            <div className="w-20 h-20 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-border-1)] flex items-center justify-center shadow-lg shadow-black/30">
              <Beaker size={32} className="text-[var(--color-text-tertiary)]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">Busca una tecnología para ver su árbol</p>
              <p className="text-xs text-[var(--color-text-dim)] mt-1.5">Muestra todos los prerequisitos necesarios</p>
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-40">
            <div className="w-6 h-6 border-2 border-[var(--color-orange-500)]/30 border-t-[var(--color-orange-500)] rounded-full animate-spin" />
          </div>
        ) : techTree ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[var(--color-border-1)] bg-[var(--color-surface-0)]/80 backdrop-blur-sm shadow-xl shadow-black/20 p-6">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">{techTree.name}</h2>
              {techTree.cost && (
                <div className="text-sm text-[var(--color-text-secondary)] mb-4">
                  {techTree.cost.trigger_type ? (
                    <span>Trigger: {techTree.cost.trigger_type} {techTree.cost.item} ({techTree.cost.count})</span>
                  ) : (
                    <span>{techTree.cost.count} packs × {techTree.cost.time}s</span>
                  )}
                </div>
              )}
              {techTree.effects.length > 0 && (
                <div className="mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-tertiary)]">Desbloquea</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {techTree.effects.map((eff: any, i: number) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border-1)] text-xs text-[var(--color-text-secondary)]">
                        {eff.recipe}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <TechTreeNode node={techTree} />
          </div>
        ) : null}
      </main>
    </div>
  );
}
