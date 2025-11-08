from fastapi import APIRouter
from app.models import Item

router = APIRouter()

# Beispiel-Daten
items = [
    {"id": 1, "name": "Item 1", "description": "Erstes Item"},
    {"id": 2, "name": "Item 2"}
]

@router.get("/items")
async def get_items():
    return items

@router.get("/items/{item_id}")
async def get_item(item_id: int):
    for item in items:
        if item["id"] == item_id:
            return item
    return {"error": "Item not found"}

@router.post("/items")
async def create_item(item: Item):
    items.append(item.dict())
    return item
