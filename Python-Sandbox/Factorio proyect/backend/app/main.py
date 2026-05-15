import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from app.services.factorio_data import factorio_data
from app.services.calculator import calculate_production

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# Serve static icons
@app.route("/icons/<path:filename>")
def serve_icon(filename):
    return send_from_directory(os.path.join(app.root_path, "static", "icons"), filename)


@app.route("/")
def root():
    return jsonify({"message": "Factorio Ratio Calculator API"})


@app.route("/api/recipes")
def get_recipes():
    search = request.args.get("search", "").lower()
    category = request.args.get("category")
    
    results = []
    for recipe in factorio_data.recipes.values():
        if search and search not in recipe["name"].lower() and search not in recipe["id"].lower():
            continue
        if category and recipe["category"] != category:
            continue
        results.append(recipe)
    
    return jsonify(sorted(results, key=lambda r: r["name"]))


@app.route("/api/items")
def get_items():
    search = request.args.get("search", "").lower()
    
    results = []
    for item in factorio_data.items.values():
        if search and search not in item["name"].lower() and search not in item["id"].lower():
            continue
        results.append(item)
    
    return jsonify(sorted(results, key=lambda i: i["name"]))


@app.route("/api/machines")
def get_machines():
    return jsonify(sorted(factorio_data.machines.values(), key=lambda m: m["name"]))


@app.route("/api/categories")
def get_categories():
    cats = set()
    for recipe in factorio_data.recipes.values():
        cats.add(recipe["category"])
    return jsonify(sorted(list(cats)))


@app.route("/api/item-recipes/<item_id>")
def get_item_recipes(item_id):
    recipes = factorio_data.find_all_recipes_for_product(item_id)
    return jsonify([{
        "id": r["id"],
        "name": r["name"],
        "category": r["category"],
        "energy_required": r["energy_required"],
        "ingredients": r["ingredients"],
        "products": r["products"],
    } for r in recipes])


@app.route("/api/calculate", methods=["POST"])
def calculate():
    data = request.get_json()
    result = calculate_production(data)
    return jsonify(result)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
