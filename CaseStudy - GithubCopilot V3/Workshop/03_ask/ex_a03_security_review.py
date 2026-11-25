"""
╔══════════════════════════════════════════════════════════╗
║  GitHub Copilot Workshop — หัวข้อ: Ask                   ║
║  EX-A03: Security Review ด้วย Ask                       ║
║                                             ║
╚══════════════════════════════════════════════════════════╝

📌 SCENARIO:
   โค้ด login ต่อไปนี้มีปัญหา security หลายจุด
   ให้ Copilot ช่วยตรวจสอบและแก้ไข

📋 TASK:
   1. Highlight โค้ด login_vulnerable แล้วถาม:
      "โค้ดนี้มี security vulnerability อะไรบ้าง อธิบายทุกจุด"
   2. ถาม Copilot แก้ปัญหา SQL Injection
   3. ถาม: "วิธีที่ถูกต้องในการ store และ verify password คืออะไร"

💬 SUGGESTED PROMPTS:
   "Review security ของโค้ดนี้ หา vulnerabilities ทุกจุด
    และอธิบาย attack vector สำหรับแต่ละจุด"

   "แก้ไขโค้ดนี้ให้ปลอดภัย: ป้องกัน SQL injection,
    ใช้ password hashing, และ generate secure token"

⚠️  NOTE: โค้ดนี้มี vulnerabilities ตั้งใจ ห้ามใช้ใน production!
"""

import sqlite3

# ─── ❌ VULNERABLE CODE (อย่าใช้ใน production!) ──────────────────────────────

def login_vulnerable(username: str, password: str) -> str:
    """INSECURE login — for educational purposes only."""
    conn = sqlite3.connect("users.db")

    # 🚨 BUG 1: SQL Injection vulnerability
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    cursor = conn.execute(query)
    user = cursor.fetchone()

    if user:
        # 🚨 BUG 2: Predictable token
        return f"Welcome {username}! Token: abc123"

    return "Login failed"

# ─── ทดสอบ SQL Injection (อย่าทำกับระบบจริง!) ────────────────────────────────
#
# login_vulnerable("admin' --", "anything")
# → Query: SELECT * FROM users WHERE username='admin' --' AND password='anything'
# → "--" comments out the rest, bypasses password check!


# ─── TODO: เขียนเวอร์ชันที่ปลอดภัยด้านล่าง ────────────────────────────────────

# ✅ SECURE VERSION — ให้ Copilot ช่วยสร้าง
# def login_secure(username: str, password: str) -> str:
#     ...
















































# ─── เฉลย ──────────────────────────────────────────────────────────────────────
#
# 3 VULNERABILITIES:
# 1. SQL Injection    → ใช้ parameterized query (?)
# 2. Plaintext password → ใช้ bcrypt hash
# 3. Predictable token → ใช้ secrets.token_hex()
#
# import bcrypt, secrets
#
# def login_secure(username: str, password: str) -> str:
#     conn = sqlite3.connect("users.db")
#
#     # ✅ Parameterized query ป้องกัน SQL Injection
#     cursor = conn.execute(
#         "SELECT password_hash FROM users WHERE username = ?",
#         (username,)
#     )
#     row = cursor.fetchone()
#
#     # ✅ bcrypt.checkpw เปรียบเทียบ hash ไม่ต้องเก็บ plaintext
#     if row and bcrypt.checkpw(password.encode(), row[0]):
#         # ✅ Cryptographically secure random token
#         return secrets.token_hex(32)
#
#     return ""  # ไม่บอกว่า user ไม่มีหรือ password ผิด (prevent enumeration)
#
# 💡 BONUS VULNERABILITIES ที่ Copilot อาจชี้:
#    - ไม่มี rate limiting (brute force)
#    - ไม่มี account lockout
#    - Error message เปิดเผยว่า user exists หรือไม่
