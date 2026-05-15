from app.services.factorio_data import factorio_data

# Raw resources that don't need further tracing
RAW_RESOURCES = {
    "iron-ore", "copper-ore", "coal", "stone", "uranium-ore",
    "crude-oil", "water", "steam", "wood",
    # Space Age raw resources
    "ice", "calcite", "tungsten-ore", "holmium-ore",
}

# Recipe IDs to always skip
SKIP_RECIPE_IDS = {
    # Recycling
    "concrete-recycling", "hazard-concrete-recycling",
    # Barrels (cause loops)
    "empty-crude-oil-barrel", "crude-oil-barrel",
    "empty-heavy-oil-barrel", "heavy-oil-barrel",
    "empty-light-oil-barrel", "light-oil-barrel",
    "empty-lubricant-barrel", "lubricant-barrel",
    "empty-petroleum-gas-barrel", "petroleum-gas-barrel",
    "empty-sulfuric-acid-barrel", "sulfuric-acid-barrel",
    "empty-water-barrel", "water-barrel",
    # Asteroid crushing (cause loops)
    "metallic-asteroid-crushing", "advanced-metallic-asteroid-crushing",
    "oxide-asteroid-crushing", "advanced-oxide-asteroid-crushing",
    "carbonic-asteroid-crushing", "advanced-carbonic-asteroid-crushing",
    "promethium-asteroid-crushing",
    # Ice melting (water is raw)
    "ice-melting",
    # Casting (alternative recipes, skip for simplicity)
    "casting-copper", "casting-copper-cable", "casting-iron",
    "casting-iron-gear-wheel", "casting-iron-stick", "casting-steel",
    "casting-low-density-structure", "concrete-from-molten-iron",
}


def solve_item(item_id, rate, recipe_overrides, machine_overrides, total_machines, visited):
    if rate <= 0.0001:
        return None

    item_name = factorio_data.items.get(item_id, {}).get("name", item_id)

    if item_id in RAW_RESOURCES:
        return {
            "item_id": item_id,
            "item_name": item_name,
            "rate_per_minute": rate,
            "recipe_id": None,
            "recipe_name": "Recurso bruto",
            "machines_needed": 0,
            "machine_name": "-",
            "machine_speed": 0,
            "machine_id": None,
            "machine_icon": None,
            "available_machines": [],
            "children": [],
        }

    key = f"{item_id}:{rate:.6f}"
    if key in visited:
        return {
            "item_id": item_id,
            "item_name": item_name,
            "rate_per_minute": rate,
            "recipe_id": None,
            "recipe_name": "(ciclo detectado)",
            "machines_needed": 0,
            "machine_name": "-",
            "machine_speed": 0,
            "machine_id": None,
            "machine_icon": None,
            "available_machines": [],
            "children": [],
        }
    visited.add(key)

    recipe = None
    if item_id in recipe_overrides:
        override_id = recipe_overrides[item_id]
        recipe = factorio_data.recipes.get(override_id)
    if not recipe:
        recipe = factorio_data.find_recipe_for_product(item_id)

    if not recipe:
        return {
            "item_id": item_id,
            "item_name": item_name,
            "rate_per_minute": rate,
            "recipe_id": None,
            "recipe_name": "Sin receta",
            "machines_needed": 0,
            "machine_name": "-",
            "machine_speed": 0,
            "machine_id": None,
            "machine_icon": None,
            "available_machines": [],
            "children": [],
        }

    if recipe["id"] in SKIP_RECIPE_IDS:
        return {
            "item_id": item_id,
            "item_name": item_name,
            "rate_per_minute": rate,
            "recipe_id": None,
            "recipe_name": "Receta omitida",
            "machines_needed": 0,
            "machine_name": "-",
            "machine_speed": 0,
            "machine_id": None,
            "machine_icon": None,
            "available_machines": [],
            "children": [],
        }

    # Determine machine
    available_machines = factorio_data.get_machines_for_category(recipe["category"])
    machine = None
    chosen_machine_id = machine_overrides.get(item_id)
    if chosen_machine_id:
        for m in available_machines:
            if m["id"] == chosen_machine_id:
                machine = m
                break
    if not machine:
        machine = factorio_data.get_default_machine(recipe)

    if not machine:
        return {
            "item_id": item_id,
            "item_name": item_name,
            "rate_per_minute": rate,
            "recipe_id": None,
            "recipe_name": "Sin máquina",
            "machines_needed": 0,
            "machine_name": "-",
            "machine_speed": 0,
            "machine_id": None,
            "machine_icon": None,
            "available_machines": [],
            "children": [],
        }

    product_amount = sum(p["amount"] for p in recipe["products"] if p["name"] == item_id)
    if product_amount <= 0:
        product_amount = recipe["products"][0]["amount"] if recipe["products"] else 1

    crafts_per_second = machine["crafting_speed"] / recipe["energy_required"]
    items_per_machine_per_minute = crafts_per_second * product_amount * 60
    machines_needed = rate / items_per_machine_per_minute if items_per_machine_per_minute > 0 else 0

    total_machines[machine["name"]] = total_machines.get(machine["name"], 0) + machines_needed

    children = []
    for ingredient in recipe["ingredients"]:
        ingredient_rate = rate * (ingredient["amount"] / product_amount)
        child = solve_item(ingredient["name"], ingredient_rate, recipe_overrides, machine_overrides, total_machines, visited)
        if child:
            children.append(child)

    return {
        "item_id": item_id,
        "item_name": item_name,
        "rate_per_minute": rate,
        "recipe_id": recipe["id"],
        "recipe_name": recipe["name"],
        "machines_needed": round(machines_needed, 2),
        "machine_name": machine["name"],
        "machine_speed": machine["crafting_speed"],
        "machine_id": machine["id"],
        "machine_icon": machine.get("icon"),
        "available_machines": [
            {"id": m["id"], "name": m["name"], "speed": m["crafting_speed"], "icon": m.get("icon")}
            for m in available_machines
        ],
        "children": children,
    }


def calculate_production(data):
    recipe_overrides = data.get("recipe_overrides", {})
    machine_overrides = data.get("machine_overrides", {})

    targets = data.get("targets", [])
    if not targets:
        item_id = data.get("item_id")
        rate = data.get("rate_per_minute", 0)
        if item_id:
            targets = [{"item_id": item_id, "rate_per_minute": rate}]

    total_machines = {}
    trees = []

    for target in targets:
        item_id = target.get("item_id")
        rate = target.get("rate_per_minute", 0)
        visited = set()
        tree = solve_item(item_id, rate, recipe_overrides, machine_overrides, total_machines, visited)
        trees.append({
            "target_item": item_id,
            "target_rate": rate,
            "tree": tree,
        })

    rounded_totals = {k: round(v, 2) for k, v in total_machines.items()}

    return {
        "targets": trees,
        "total_machines": rounded_totals,
    }
