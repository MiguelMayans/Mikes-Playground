export interface Ingredient {
  type: string;
  name: string;
  amount: number;
}

export interface Product {
  type: string;
  name: string;
  amount: number;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  energy_required: number;
  ingredients: Ingredient[];
  products: Product[];
  enabled: boolean;
  hidden: boolean;
}

export interface Item {
  id: string;
  name: string;
  type: string;
  icon?: string;
}

export interface Machine {
  id: string;
  name: string;
  crafting_categories: string[];
  crafting_speed: number;
  energy_usage: string;
  icon?: string;
}

export interface TreeNode {
  item_id: string;
  item_name: string;
  rate_per_minute: number;
  recipe_id: string | null;
  recipe_name: string;
  machines_needed: number;
  machine_name: string;
  machine_speed: number;
  machine_id?: string | null;
  machine_icon?: string | null;
  available_machines: { id: string; name: string; speed: number; icon?: string | null }[];
  children: TreeNode[];
}

export interface TargetResult {
  target_item: string;
  target_rate: number;
  tree: TreeNode;
}

export interface CalculationResult {
  targets: TargetResult[];
  total_machines: Record<string, number>;
}
