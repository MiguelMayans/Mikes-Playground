/**
 * Returns a Tailwind text-color class based on item id heuristics.
 */
export function getItemCategoryClass(itemId: string): string {
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
