"""
╔══════════════════════════════════════════════════════════╗
║  GitHub Copilot Workshop — หัวข้อ: Plan                  ║
║  EX-P01: วางแผน REST API                                 ║
║                                              ║
╚══════════════════════════════════════════════════════════╝

📌 SCENARIO:
   ต้องการสร้าง REST API สำหรับระบบ Todo List ด้วย FastAPI

📋 TASK:
   1. ถาม Copilot วางแผน endpoints ทั้งหมดที่ต้องการ
   2. ให้ออกแบบ data model / schema
   3. ถามเรื่อง folder structure ที่เหมาะสม

💬 SUGGESTED PROMPT:
   "ฉันจะสร้าง REST API สำหรับ Todo List ด้วย FastAPI + SQLite
    ช่วยวางแผน:
    1. Endpoints ที่ต้องมีทั้งหมด (CRUD)
    2. Data model สำหรับ Todo item
    3. Folder structure ที่เหมาะสม
    4. Dependencies ที่ต้องติดตั้ง"

📦 INSTALL: pip install fastapi uvicorn sqlalchemy pydantic
"""

# ─── TODO: ให้ Copilot สร้าง schema และ models ตาม plan ──────────────────────

# คาดหวังว่า Copilot จะช่วยสร้าง:
# - TodoCreate (Pydantic schema)
# - TodoUpdate
# - TodoResponse
# - Todo (SQLAlchemy model)

# ─── Planned Folder Structure ──────────────────────────────────────────────────
#
# todo-api/
# ├── main.py           ← FastAPI app, startup
# ├── database.py       ← DB connection, session
# ├── models.py         ← SQLAlchemy ORM models
# ├── schemas.py        ← Pydantic request/response schemas
# ├── crud.py           ← Database operations (CRUD functions)
# ├── routers/
# │   └── todos.py      ← Route handlers
# └── requirements.txt

# ─── Planned Endpoints ────────────────────────────────────────────────────────
#
# GET    /todos              → list all todos (with pagination)
# POST   /todos              → create new todo
# GET    /todos/{id}         → get single todo
# PUT    /todos/{id}         → update todo
# DELETE /todos/{id}         → delete todo
# PATCH  /todos/{id}/done    → mark as complete (bonus)

# ─── Skeleton (ให้ Copilot เติม) ──────────────────────────────────────────────

from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TodoBase(BaseModel):
    title: str
    # TODO: ให้ Copilot เพิ่ม fields ที่เหมาะสม

class TodoCreate(TodoBase):
    pass  # TODO

class TodoUpdate(BaseModel):
    pass  # TODO: ทุก field เป็น Optional

class TodoResponse(TodoBase):
    id: int
    # TODO: เพิ่ม fields สำหรับ response

    class Config:
        from_attributes = True


































# ─── เฉลย (Pydantic Schemas) ──────────────────────────────────────────────────
#
# class TodoBase(BaseModel):
#     title: str
#     description: Optional[str] = None
#     due_date: Optional[datetime] = None
#
# class TodoCreate(TodoBase):
#     pass
#
# class TodoUpdate(BaseModel):
#     title: Optional[str] = None
#     description: Optional[str] = None
#     is_done: Optional[bool] = None
#     due_date: Optional[datetime] = None
#
# class TodoResponse(TodoBase):
#     id: int
#     is_done: bool
#     created_at: datetime
#     updated_at: Optional[datetime]
#
#     class Config:
#         from_attributes = True
