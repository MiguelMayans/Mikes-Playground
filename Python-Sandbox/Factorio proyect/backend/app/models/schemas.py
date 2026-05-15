from typing import Dict, List, Optional
from pydantic import BaseModel


class Ingredient(BaseModel):
    type: str
    name: str
    amount: float


class Product(BaseModel):
    type: str
    name: str
    amount: float


class Recipe(BaseModel):
    id: str
    name: str
    category: str
    energy_required: float
    ingredients: List[Ingredient]
    products: List[Product]
    enabled: bool = True
    hidden: bool = False


class Machine(BaseModel):
    id: str
    name: str
    crafting_categories: List[str]
    crafting_speed: float
    energy_usage: str


class Item(BaseModel):
    id: str
    name: str
    type: str  # 'item' or 'fluid'


class CalculationInput(BaseModel):
    item_id: str
    rate_per_minute: float
    machine_id: Optional[str] = None


class CalculationStep(BaseModel):
    item_id: str
    item_name: str
    rate_per_minute: float
    recipe_id: str
    recipe_name: str
    machines_needed: float
    machine_name: str
    machine_speed: float


class CalculationResult(BaseModel):
    target_item: str
    target_rate: float
    steps: List[CalculationStep]
    total_machines: Dict[str, float]
