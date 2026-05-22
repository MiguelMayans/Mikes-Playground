import { X } from "lucide-react";
import { cn } from "../lib/utils";
import { ItemIcon } from "./ItemIcon";

export function MachineSelectorPopup({
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
