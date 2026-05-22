import { useEffect } from "react";

/**
 * Hook to close dropdown/popup when clicking outside the provided refs.
 */
export function useClickOutside(
  refs: React.RefObject<HTMLElement | null>[],
  onOutside: () => void,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return;
    function handle(e: MouseEvent) {
      const target = e.target as Node;
      const inside = refs.some((ref) => ref.current && ref.current.contains(target));
      if (!inside) onOutside();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [active, onOutside, ...refs]);
}
