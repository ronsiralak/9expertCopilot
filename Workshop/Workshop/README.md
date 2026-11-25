## 📁 โครงสร้างโปรเจค

```
workshop/
├── 01_chat/
│   ├── ex_c01_explain_code.py         — อธิบายโค้ดที่ไม่รู้จัก
│   ├── ex_c02_fix_bug.py              — แก้ Bug ผ่าน Chat
│   └── ex_c03_refactor.py            — Refactor โค้ดให้ดีขึ้น
│
├── 02_inline/
│   ├── ex_i01_comment_driven.py       — เขียน Function จาก Comment
│   ├── ex_i02_api_fetch.py            — API Call Template
│   └── ex_i03_class_from_docstring.py   — สร้าง Class จาก Docstring
│
├── 03_ask/
│   ├── ex_a01_workspace_search.py     — ค้นหา Function ใน Codebase
│   ├── ex_a02_compare_approaches.py   — เปรียบเทียบ 2 Approach
│   └── ex_a03_security_review.py     — Security Review
│
├── 04_plan/
│   ├── ex_p01_rest_api_plan.py        — วางแผน REST API
│   ├── ex_p02_migration_plan.py       — Migration Plan
│   └── ex_p03_design_pattern.py      — Design Pattern Selection
│
├── 05_agent/
│   ├── ex_ag01_weather_cli/
│   │   └── weather.py                 — สร้างโปรเจคด้วย Agent
│   ├── ex_ag02_code_review.py         — Automated Code Review
│   └── ex_ag03_db_migration.py       — Database Migration Script
│
├── 06_document/
│   ├── ex_d01_docstring.py            — เพิ่ม Docstring
│   ├── ex_d02_readme.py               — สร้าง README.md
│   └── ex_d03_openapi.py             — OpenAPI / Swagger Docs
│
├── 07_unittest/
│   ├── ex_u01_tax_test.py             — Parametrize Tests
│   ├── ex_u02_bank_test.py            — Error Cases Testing
│   └── ex_u03_mock_test.py           — Mock External API
│
└── README.md   ← ไฟล์นี้
```

---

## 🚀 เริ่มต้นใช้งาน

### 1. ติดตั้ง Dependencies

```bash
pip install pytest pytest-cov requests fastapi uvicorn pydantic python-dotenv aiohttp
```

### 2. เปิดใน VS Code

```bash
code workshop/
```

### 3. ตรวจสอบว่า GitHub Copilot Extension ติดตั้งแล้ว

- GitHub Copilot
- GitHub Copilot Chat

---

## 📖 วิธีทำแต่ละ Exercise

1. **เปิดไฟล์** ตาม topic ที่ต้องการฝึก
2. **อ่าน SCENARIO และ TASK** ที่อยู่ใน docstring บนสุด
3. **ลองทำ** โดยใช้ Copilot ตาม TASK ที่กำหนด
4. **ดูเฉลย** ที่อยู่ด้านล่างของไฟล์เมื่อต้องการ

---

## 🏃 รัน Unit Tests

```bash
# รัน tests ทั้งหมด
pytest 07_unittest/ -v

# รันพร้อม coverage report
pytest 07_unittest/ -v --cov=. --cov-report=term-missing

# รัน test ไฟล์เดียว
pytest 07_unittest/ex_u01_tax_test.py -v
```

---

## 💡 Copilot Tips สรุป

| Feature          | Shortcut / Command              | ใช้เมื่อ                          |
|------------------|---------------------------------|----------------------------------|
| Inline suggest   | `Tab` to accept                 | ต้องการ code completion          |
| Alt suggestions  | `Alt+]` / `Alt+[`               | suggestion ไม่ตรง               |
| All suggestions  | `Ctrl+Enter`                    | ดูตัวเลือกทั้งหมด               |
| Explain code     | `/explain` in Chat              | ไม่เข้าใจโค้ด                   |
| Fix bug          | `/fix` in Chat                  | มี bug ต้องการแก้                |
| Generate tests   | `/tests` in Chat                | ต้องการ unit tests               |
| Workspace search | `@workspace` in Chat            | ค้นหาใน codebase ทั้งหมด        |
| File context     | `#file:filename` in Chat        | focus เฉพาะไฟล์                 |
| Agent mode       | ⚡ icon in Chat                  | งาน multi-step / สร้างหลายไฟล์  |

---

