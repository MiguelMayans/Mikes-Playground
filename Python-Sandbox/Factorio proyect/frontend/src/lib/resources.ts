import type { TreeNode } from "../types";

/**
 * Collect all raw resource rates from a production tree.
 */
export function collectRawResources(
  node: TreeNode,
  map: Map<string, number> = new Map(),
) {
  if (!node.recipe_id && node.recipe_name === "Recurso bruto") {
    map.set(node.item_id, (map.get(node.item_id) || 0) + node.rate_per_minute);
  }
  node.children.forEach((child) => collectRawResources(child, map));
  return map;
}
