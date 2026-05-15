import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
ICONS_DIR = os.path.join(os.path.dirname(__file__), "..", "static", "icons")


class FactorioData:
    def __init__(self):
        self.raw = self._load_json("data-raw-dump.json")
        self.recipe_locale = self._load_json("recipe-locale.json")
        self.item_locale = self._load_json("item-locale.json")
        self.fluid_locale = self._load_json("fluid-locale.json")
        self.entity_locale = self._load_json("entity-locale.json")

        self.recipes = {}
        self.items = {}
        self.machines = {}

        self._parse_items()
        self._parse_recipes()
        self._parse_machines()

    def _load_json(self, filename):
        path = os.path.join(DATA_DIR, filename)
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _get_name(self, locale, key):
        names = locale.get("names", {})
        return names.get(key, key)

    def _parse_items(self):
        for item_id, item_data in self.raw.get("item", {}).items():
            name = self._get_name(self.item_locale, item_id)
            icon = f"/icons/{item_id}.png" if os.path.exists(os.path.join(ICONS_DIR, f"{item_id}.png")) else None
            self.items[item_id] = {"id": item_id, "name": name, "type": "item", "icon": icon}

        for fluid_id, fluid_data in self.raw.get("fluid", {}).items():
            name = self._get_name(self.fluid_locale, fluid_id)
            icon = f"/icons/{fluid_id}.png" if os.path.exists(os.path.join(ICONS_DIR, f"{fluid_id}.png")) else None
            self.items[fluid_id] = {"id": fluid_id, "name": name, "type": "fluid", "icon": icon}

    def _parse_ingredients(self, ingredients_raw):
        result = []
        if isinstance(ingredients_raw, dict):
            for name, amount in ingredients_raw.items():
                result.append({"type": "item", "name": name, "amount": float(amount)})
        elif isinstance(ingredients_raw, list):
            for ing in ingredients_raw:
                if isinstance(ing, dict):
                    itype = ing.get("type", "item")
                    name = ing.get("name", "")
                    amount = ing.get("amount", 0)
                    if amount == 0 and "amount_min" in ing and "amount_max" in ing:
                        amount = (ing["amount_min"] + ing["amount_max"]) / 2
                    if "probability" in ing:
                        amount *= ing["probability"]
                    result.append({"type": itype, "name": name, "amount": float(amount)})
        return result

    def _parse_products(self, recipe_data):
        results = recipe_data.get("results", [])
        if not results and "result" in recipe_data:
            return [{"type": "item", "name": recipe_data["result"], "amount": float(recipe_data.get("result_count", 1))}]

        products = []
        if isinstance(results, dict):
            for name, amount in results.items():
                products.append({"type": "item", "name": name, "amount": float(amount)})
        elif isinstance(results, list):
            for res in results:
                if isinstance(res, dict):
                    itype = res.get("type", "item")
                    name = res.get("name", "")
                    amount = res.get("amount", 0)
                    if amount == 0 and "amount_min" in res and "amount_max" in res:
                        amount = (res["amount_min"] + res["amount_max"]) / 2
                    if "probability" in res:
                        amount *= res["probability"]
                    products.append({"type": itype, "name": name, "amount": float(amount)})
        return products

    def _parse_recipes(self):
        for recipe_id, recipe_data in self.raw.get("recipe", {}).items():
            # Skip parameter recipes (they are not real crafting recipes)
            if recipe_data.get("parameter"):
                continue

            # Skip hidden recipes that have no actual ingredients or products
            if recipe_data.get("hidden"):
                ingredients = self._parse_ingredients(recipe_data.get("ingredients", []))
                products = self._parse_products(recipe_data)
                if not ingredients and not products:
                    continue

            name = self._get_name(self.recipe_locale, recipe_id)
            ingredients = self._parse_ingredients(recipe_data.get("ingredients", []))
            products = self._parse_products(recipe_data)

            # Skip recipes with no inputs AND no outputs
            if not ingredients and not products:
                continue

            category = recipe_data.get("category", "crafting")
            energy = recipe_data.get("energy_required", 0.5)

            self.recipes[recipe_id] = {
                "id": recipe_id,
                "name": name,
                "category": category,
                "energy_required": energy,
                "ingredients": ingredients,
                "products": products,
                "enabled": recipe_data.get("enabled", True) is not False,
                "hidden": recipe_data.get("hidden", False),
            }

    def _parse_machines(self):
        machine_types = ["assembling-machine", "furnace", "rocket-silo"]

        for mtype in machine_types:
            for entity_id, entity_data in self.raw.get(mtype, {}).items():
                name = self._get_name(self.entity_locale, entity_id)
                categories = entity_data.get("crafting_categories", [])
                speed = entity_data.get("crafting_speed", 1.0)
                energy = entity_data.get("energy_usage", "1kW")
                icon = f"/icons/{entity_id}.png" if os.path.exists(os.path.join(ICONS_DIR, f"{entity_id}.png")) else None

                self.machines[entity_id] = {
                    "id": entity_id,
                    "name": name,
                    "crafting_categories": categories,
                    "crafting_speed": speed,
                    "energy_usage": energy,
                    "icon": icon,
                }

        for drill_id, drill_data in self.raw.get("mining-drill", {}).items():
            name = self._get_name(self.entity_locale, drill_id)
            resource_cats = drill_data.get("resource_categories", {})
            categories = list(resource_cats.keys()) if isinstance(resource_cats, dict) else []
            speed = drill_data.get("mining_speed", 1.0)
            energy = drill_data.get("energy_usage", "1kW")
            icon = f"/icons/{drill_id}.png" if os.path.exists(os.path.join(ICONS_DIR, f"{drill_id}.png")) else None

            self.machines[drill_id] = {
                "id": drill_id,
                "name": name,
                "crafting_categories": ["resource"] + categories,
                "crafting_speed": speed,
                "energy_usage": energy,
                "icon": icon,
            }

    def find_all_recipes_for_product(self, item_id):
        """Return all recipes that produce this item."""
        candidates = []
        for recipe in self.recipes.values():
            for product in recipe["products"]:
                if product["name"] == item_id:
                    candidates.append(recipe)
                    break
        return candidates

    def find_recipe_for_product(self, item_id):
        candidates = self.find_all_recipes_for_product(item_id)

        if not candidates:
            return None

        # Prefer the "standard" recipe where recipe name == product name
        for r in candidates:
            if r["id"] == item_id:
                return r

        # Prefer non-recycling, non-hidden recipes
        for r in candidates:
            if r["category"] != "recycling" and not r["hidden"]:
                return r

        return candidates[0]

    def get_machines_for_category(self, category):
        """Return all machines that can handle this category, sorted by speed desc."""
        candidates = []
        for machine in self.machines.values():
            if category in machine["crafting_categories"]:
                candidates.append(machine)
        candidates.sort(key=lambda m: m["crafting_speed"], reverse=True)
        return candidates

    def get_default_machine(self, recipe):
        category = recipe["category"]
        candidates = self.get_machines_for_category(category)

        if not candidates:
            return None

        # Prefer a standard machine for the category, fallback to fastest
        CATEGORY_DEFAULTS = {
            "chemistry": "chemical-plant",
            "chemistry-or-cryogenics": "chemical-plant",
            "cryogenics": "cryogenic-plant",
            "oil-processing": "oil-refinery",
            "crafting": "assembling-machine-2",
            "crafting-with-fluid": "assembling-machine-2",
            "advanced-crafting": "assembling-machine-3",
            "smelting": "electric-furnace",
            "rocket-building": "rocket-silo",
            "centrifuging": "centrifuge",
            "crushing": "crusher",
            "metallurgy": "foundry",
            "metallurgy-or-assembling": "foundry",
            "organic": "biochamber",
            "organic-or-chemistry": "chemical-plant",
            "organic-or-assembling": "assembling-machine-2",
            "electronics": "assembling-machine-3",
            "electronics-or-assembling": "assembling-machine-3",
            "electronics-with-fluid": "assembling-machine-3",
            "pressing": "foundry",
            "captive-spawner-process": "captive-biter-spawner",
            "recycling": "recycler",
            "recycling-or-hand-crafting": "recycler",
        }
        preferred_id = CATEGORY_DEFAULTS.get(category)
        if preferred_id:
            for c in candidates:
                if c["id"] == preferred_id:
                    return c

        return candidates[0]


factorio_data = FactorioData()
