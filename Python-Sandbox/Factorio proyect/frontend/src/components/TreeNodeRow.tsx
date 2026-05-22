import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useClickOutside } from "../hooks/useClickOutside";
import { getItemCategoryClass } from "../lib/itemCategory";
import { cn } from "../lib/utils";
import type { Item, TreeNode } from "../types";
import { ItemIcon } from "./ItemIcon";
import { MachineSelectorPopup } from "./MachineSelectorPopup";
import { RecipeSelectorPopup } from "./RecipeSelectorPopup";

interface TreeNodeRowProps {
  node: TreeNode;
  items: Item[];
  depth?: number;
  parentRate?: number;
  expandAll?: boolean;
  recipeOverrides: Record<string, string>;
  machineOverrides: Record<string, string>;
  onRecipeChange: (itemId: string, recipeId: string) => void;
  onMachineChange: (itemId: string, machineId: string) => void;
  displayMultiplier: number;
  rateLabel: string;
}

export function TreeNodeRow({
  node,
  items,
  depth = 0,
  parentRate = 0,
  expandAll,
  recipeOverrides,
  machineOverrides,
  onRecipeChange,
  onMachineChange,
  displayMultiplier,
  rateLabel,
}: TreeNodeRowProps) {
  const [expanded, setExpanded] = useState(depth < 2);
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [showMachineSelector, setShowMachineSelector] = useState(false);
  const recipeRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const recipeBtnRef = useRef<HTMLButtonElement>(null);
  const machineBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (expandAll !== undefined) {
      setExpanded(expandAll);
    }
  }, [expandAll]);

  useClickOutside(
    [recipeRef, recipeBtnRef],
    () => setShowRecipeSelector(false),
    showRecipeSelector,
  );
  useClickOutside(
    [machineRef, machineBtnRef],
    () => setShowMachineSelector(false),
    showMachineSelector,
  );

  const hasChildren = node.children && node.children.length > 0;
  const itemData = items.find((i) => i.id === node.item_id);
  const hasAlternatives = !!node.recipe_id;
  const isRaw = !node.recipe_id;
  const availableMachines = node.available_machines || [];

  // Calculate ratio: how many of this item per 1 parent item
  const ratio = parentRate > 0 ? node.rate_per_minute / parentRate : 0;

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
              {(node.rate_per_minute * displayMultiplier).toFixed(1)}{" "}
              <span className="text-[var(--color-text-dim)]">{rateLabel}</span>
              {ratio > 0 && depth > 0 && (
                <span className="ml-2 text-[var(--color-text-tertiary)]">
                  ({ratio.toFixed(2)}×)
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Recipe */}
        <div className="relative min-w-[140px] max-w-[180px]" ref={recipeRef}>
          {hasAlternatives ? (
            <button
              ref={recipeBtnRef}
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
              onSelect={(rid) => { setShowRecipeSelector(false); onRecipeChange(node.item_id, rid); }}
              onClose={() => setShowRecipeSelector(false)}
            />
          )}
        </div>

        {/* Machines */}
        <div className="flex items-center gap-3 min-w-[130px] justify-end relative" ref={machineRef}>
          {!isRaw && (
            <>
              <span className="font-mono font-bold text-[13px] text-[var(--color-green)] tabular-nums">
                {node.machines_needed.toFixed(2)}
              </span>
              <button
                ref={machineBtnRef}
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
                  onSelect={(mid) => { setShowMachineSelector(false); onMachineChange(node.item_id, mid); }}
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
              parentRate={node.rate_per_minute}
              expandAll={expandAll}
              recipeOverrides={recipeOverrides}
              machineOverrides={machineOverrides}
              onRecipeChange={onRecipeChange}
              onMachineChange={onMachineChange}
              displayMultiplier={displayMultiplier}
              rateLabel={rateLabel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
