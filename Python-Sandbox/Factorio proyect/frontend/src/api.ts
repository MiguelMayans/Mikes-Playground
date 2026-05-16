import type { CalculationResult, Item, TreeNode, Recipe } from "./types";

const API_URL = "http://localhost:8000/api";

export async function getItems(search?: string): Promise<Item[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await fetch(`${API_URL}/items${params}`);
  return res.json();
}

export async function getRecipes(search?: string): Promise<Recipe[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await fetch(`${API_URL}/recipes${params}`);
  return res.json();
}

export async function getItemRecipes(itemId: string): Promise<Recipe[]> {
  const res = await fetch(`${API_URL}/item-recipes/${encodeURIComponent(itemId)}`);
  return res.json();
}

export async function getMachines(): Promise<Machine[]> {
  const res = await fetch(`${API_URL}/machines`);
  return res.json();
}

export interface Target {
  item_id: string;
  rate_per_minute: number;
}

export async function calculate(data: {
  targets: Target[];
  machine_id?: string;
  recipe_overrides?: Record<string, string>;
  machine_overrides?: Record<string, string>;
}): Promise<CalculationResult> {
  const res = await fetch(`${API_URL}/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export interface Technology {
  id: string;
  name: string;
  prerequisites: string[];
}

export async function getTechnologies(search?: string): Promise<Technology[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await fetch(`${API_URL}/technologies${params}`);
  return res.json();
}

export interface TechNode {
  id: string;
  name: string;
  cost: any;
  effects: { type: string; recipe: string }[];
  children: TechNode[];
}

export async function getTechnologyTree(techId: string): Promise<TechNode> {
  const res = await fetch(`${API_URL}/technology-tree/${encodeURIComponent(techId)}`);
  return res.json();
}
