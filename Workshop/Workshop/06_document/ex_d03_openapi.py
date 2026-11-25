"""
╔══════════════════════════════════════════════════════════╗
║  GitHub Copilot Workshop — หัวข้อ: Document              ║
║  EX-D03: OpenAPI / Swagger Documentation                 ║
║                                             ║
╚══════════════════════════════════════════════════════════╝

📌 SCENARIO:
   มี FastAPI endpoints ที่ยังไม่มี documentation ที่ดี
   ให้ Copilot ช่วยเพิ่มให้แสดงใน Swagger UI (/docs)

📋 TASK:
   1. ให้ Copilot เพิ่ม response_model, status_code ให้ทุก endpoint
   2. เพิ่ม docstring แบบ markdown ที่แสดงใน Swagger
   3. เพิ่ม Field() กับ example values ใน Pydantic schema
   4. รันและดูที่ http://localhost:8000/docs

💬 SUGGESTED PROMPTS:
   "เพิ่ม documentation ให้ FastAPI endpoints เหล่านี้:
    - docstring พร้อม markdown formatting
    - response_model และ status_code ที่ถูกต้อง
    - Field() พร้อม description และ example
    - tags สำหรับ grouping ใน Swagger"

📦 INSTALL: pip install fastapi uvicorn
🚀 RUN:     uvicorn ex_d03_openapi:app --reload
🌐 DOCS:    http://localhost:8000/docs
"""

from fastapi import FastAPI, HTTPException, Path, Query
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# ─── App Setup ────────────────────────────────────────────────────────────────

app = FastAPI(
    title="📦 Inventory API",
    description="""
## Inventory Management System

Manage products and stock levels for your e-commerce platform.

### Features
- 📦 Full CRUD for inventory items
- 🔍 Search and filter products
- 📊 Stock level tracking
    """,
    version="1.0.0",
    contact={"name": "Dev Team", "email": "dev@example.com"},
)


# ─── Schemas (ก่อน document / undocumented) ───────────────────────────────────

class ItemBase(BaseModel):
    name: str
    price: float
    qty: int
    category: Optional[str] = None


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    qty: Optional[int] = None
    category: Optional[str] = None


class ItemResponse(ItemBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ─── In-memory store (สำหรับ demo) ───────────────────────────────────────────

_db: dict[int, dict] = {}
_next_id = 1


# ─── Endpoints (ให้ Copilot เพิ่ม documentation) ─────────────────────────────

@app.get("/items")
def list_items(
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    limit: int = 20,
):
    # TODO: ให้ Copilot เพิ่ม:
    # - response_model=list[ItemResponse]
    # - docstring พร้อม description ของทุก parameter
    # - Query() พร้อม description
    items = list(_db.values())
    if category:
        items = [i for i in items if i.get("category") == category]
    if min_price is not None:
        items = [i for i in items if i["price"] >= min_price]
    return items[:limit]


@app.post("/items")
def create_item(item: ItemCreate):
    # TODO: เพิ่ม response_model, status_code=201, docstring
    global _next_id
    record = {"id": _next_id, "created_at": datetime.now(), **item.model_dump()}
    _db[_next_id] = record
    _next_id += 1
    return record


@app.get("/items/{item_id}")
def get_item(item_id: int):
    # TODO: เพิ่ม response_model, docstring, Path() validation
    if item_id not in _db:
        raise HTTPException(status_code=404, detail=f"Item {item_id} not found")
    return _db[item_id]


@app.put("/items/{item_id}")
def update_item(item_id: int, updates: ItemUpdate):
    # TODO: เพิ่ม response_model, docstring
    if item_id not in _db:
        raise HTTPException(status_code=404, detail=f"Item {item_id} not found")
    _db[item_id].update({k: v for k, v in updates.model_dump().items() if v is not None})
    return _db[item_id]


@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    # TODO: เพิ่ม status_code=204, docstring
    if item_id not in _db:
        raise HTTPException(status_code=404, detail=f"Item {item_id} not found")
    del _db[item_id]
    return {"message": f"Item {item_id} deleted"}












































# ─── เฉลย (documented version ของ create_item) ───────────────────────────────
#
# @app.post(
#     "/items",
#     response_model=ItemResponse,
#     status_code=201,
#     tags=["Items"],
#     summary="Create a new inventory item",
# )
# def create_item(item: ItemCreate) -> ItemResponse:
#     """Create a new item in the inventory.
#
#     - **name**: Display name of the product (required)
#     - **price**: Unit price in THB, must be positive
#     - **qty**: Stock quantity, must be >= 0
#     - **category**: Optional product category for filtering
#
#     Returns the created item with auto-generated `id` and `created_at`.
#     """
#     ...
#
# class ItemCreate(ItemBase):
#     name: str = Field(..., min_length=1, max_length=200,
#                       description="Product display name",
#                       example="Mechanical Keyboard TKL")
#     price: float = Field(..., gt=0, description="Unit price in THB",
#                          example=2990.00)
#     qty: int = Field(..., ge=0, description="Stock quantity",
#                      example=50)
#     category: Optional[str] = Field(None, example="Electronics")
