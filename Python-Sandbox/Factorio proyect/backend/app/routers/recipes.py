from typing import List, Optional
from fastapi import APIRouter, Query

from app.models.schemas import CalculationInput, CalculationResult, Item, Machine, Recipe
from app.services.calculator import calculate_production
from app.services.factorio_data import factorio_data

router = APIRouter(prefix="/api", tags=["recipes"])


@router.get("/recipes", response_model=List[Recipe])
def get_recipes(
    search: Optional[str] = Query(None, description="Filter by name"),
    category: Optional[str] = Query(None, description="Filter by category"),
):
    results = []
    for recipe in factorio_data.recipes.values():
        if search and search.lower() not in recipe.name.lower():
            continue
        if category and recipe.category != category:
            continue
        results.append(recipe)
    return sorted(results, key=lambda r: r.name)


@router.get("/items", response_model=List[Item])
def get_items(search: Optional[str] = Query(None)):
    results = []
    for item in factorio_data.items.values():
        if search and search.lower() not in item.name.lower():
            continue
        results.append(item)
    return sorted(results, key=lambda i: i.name)


@router.get("/machines", response_model=List[Machine])
def get_machines():
    return sorted(factorio_data.machines.values(), key=lambda m: m.name)


@router.post("/calculate", response_model=CalculationResult)
def calculate(input_data: CalculationInput):
    return calculate_production(input_data)


@router.get("/categories")
def get_categories():
    cats = set()
    for recipe in factorio_data.recipes.values():
        cats.add(recipe.category)
    return sorted(list(cats))
