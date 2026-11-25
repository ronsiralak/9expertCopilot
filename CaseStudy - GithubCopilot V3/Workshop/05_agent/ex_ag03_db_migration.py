"""
╔══════════════════════════════════════════════════════════╗
║  GitHub Copilot Workshop — หัวข้อ: Agent Mode            ║
║  EX-AG03: Database Migration Script                      ║
║                                             ║
╚══════════════════════════════════════════════════════════╝

📌 SCENARIO:
   ต้องการ migrate ข้อมูลจาก CSV ไปเข้า SQLite database
   โดยมี validation และ error logging

📋 TASK:
   1. เปิดไฟล์นี้ใน Agent mode
   2. ให้ Agent implement ฟังก์ชัน migrate() ที่ครบถ้วน
   3. ทดสอบด้วย sample CSV ด้านล่าง

🤖 AGENT PROMPT:
─────────────────────────────────────────────────────────
Implement ฟังก์ชัน migrate() ให้สมบูรณ์:
- อ่านไฟล์ users.csv
- Validate email format (regex)
- Validate age (1-120)
- Validate signup_date (YYYY-MM-DD format)
- Insert valid rows ลง SQLite
- Log invalid rows ลงไฟล์ errors.log
- แสดง summary: imported/skipped/errors
─────────────────────────────────────────────────────────
"""

import csv
import sqlite3
import re
import logging
from pathlib import Path
from datetime import datetime
from dataclasses import dataclass, field
from typing import Optional

# ─── Setup Logging ─────────────────────────────────────────────────────────────

logging.basicConfig(
    filename="errors.log",
    level=logging.ERROR,
    format="%(asctime)s | %(levelname)s | %(message)s",
)


# ─── Data Model ───────────────────────────────────────────────────────────────

@dataclass
class UserRecord:
    name: str
    email: str
    age: int
    signup_date: str


@dataclass
class MigrationResult:
    imported: int = 0
    skipped: int = 0
    errors: list[str] = field(default_factory=list)

    def report(self) -> str:
        total = self.imported + self.skipped
        return (
            f"\n{'─'*40}\n"
            f"📊 Migration Summary\n"
            f"{'─'*40}\n"
            f"  Total rows  : {total}\n"
            f"  ✅ Imported  : {self.imported}\n"
            f"  ⚠️  Skipped   : {self.skipped}\n"
            f"  ❌ Errors    : {len(self.errors)}\n"
        )


# ─── Validators ───────────────────────────────────────────────────────────────

def is_valid_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def is_valid_age(age_str: str) -> tuple[bool, Optional[int]]:
    try:
        age = int(age_str)
        return (1 <= age <= 120), age
    except ValueError:
        return False, None


def is_valid_date(date_str: str) -> bool:
    try:
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except ValueError:
        return False


# ─── TODO: ให้ Copilot implement ฟังก์ชันด้านล่าง ─────────────────────────────

def setup_database(db_path: str) -> sqlite3.Connection:
    """Create DB and users table if not exists."""
    # TODO: ให้ Copilot implement
    pass


def validate_row(row: dict) -> tuple[bool, Optional[UserRecord], str]:
    """Validate a CSV row. Returns (is_valid, record, error_message)."""
    # TODO: ให้ Copilot implement — check email, age, date
    pass


def migrate(csv_path: str, db_path: str) -> MigrationResult:
    """Main migration function."""
    # TODO: ให้ Copilot implement
    pass


# ─── Sample CSV Generator (สร้างไว้ test) ────────────────────────────────────

def create_sample_csv(path: str = "users.csv") -> None:
    rows = [
        ["name", "email", "age", "signup_date"],
        ["Alice",   "alice@example.com",   "28", "2024-01-15"],
        ["Bob",     "bob@bad-email",        "999", "2024-13-01"],  # invalid
        ["Charlie", "charlie@example.com",  "35", "2024-03-20"],
        ["Dave",    "dave@example.com",     "-5", "2024-02-10"],   # invalid age
        ["Eve",     "eve@test.org",         "22", "not-a-date"],   # invalid date
        ["Frank",   "frank@company.co.th",  "41", "2024-04-05"],
    ]
    with open(path, "w", newline="") as f:
        csv.writer(f).writerows(rows)
    print(f"✅ Created {path} with {len(rows)-1} records")






































# ─── เฉลย ──────────────────────────────────────────────────────────────────────
#
# def setup_database(db_path):
#     conn = sqlite3.connect(db_path)
#     conn.execute("""
#         CREATE TABLE IF NOT EXISTS users (
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             name TEXT NOT NULL,
#             email TEXT UNIQUE NOT NULL,
#             age INTEGER NOT NULL,
#             signup_date TEXT NOT NULL,
#             imported_at TEXT DEFAULT CURRENT_TIMESTAMP
#         )
#     """)
#     conn.commit()
#     return conn
#
# def validate_row(row):
#     errors = []
#     if not is_valid_email(row.get("email", "")):
#         errors.append(f"invalid email: {row.get('email')}")
#     valid_age, age = is_valid_age(row.get("age", ""))
#     if not valid_age:
#         errors.append(f"invalid age: {row.get('age')}")
#     if not is_valid_date(row.get("signup_date", "")):
#         errors.append(f"invalid date: {row.get('signup_date')}")
#     if errors:
#         return False, None, "; ".join(errors)
#     record = UserRecord(row["name"], row["email"], age, row["signup_date"])
#     return True, record, ""
#
# def migrate(csv_path, db_path):
#     result = MigrationResult()
#     conn = setup_database(db_path)
#     with open(csv_path, newline="") as f:
#         for i, row in enumerate(csv.DictReader(f), 1):
#             valid, record, err = validate_row(row)
#             if not valid:
#                 result.skipped += 1
#                 msg = f"Row {i}: {err} | data={dict(row)}"
#                 result.errors.append(msg)
#                 logging.error(msg)
#             else:
#                 try:
#                     conn.execute(
#                         "INSERT INTO users (name,email,age,signup_date) VALUES (?,?,?,?)",
#                         (record.name, record.email, record.age, record.signup_date)
#                     )
#                     result.imported += 1
#                 except sqlite3.IntegrityError as e:
#                     result.skipped += 1
#                     logging.error(f"Row {i}: DB error {e}")
#     conn.commit()
#     conn.close()
#     return result


if __name__ == "__main__":
    create_sample_csv("users.csv")
    result = migrate("users.csv", "users.db")
    if result:
        print(result.report())
