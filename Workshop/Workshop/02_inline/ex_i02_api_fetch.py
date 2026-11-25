"""
╔══════════════════════════════════════════════════════════╗
║  GitHub Copilot Workshop — หัวข้อ: Inline Completion     ║
║  EX-I02: API Call Template                               ║
║                                              ║
╚══════════════════════════════════════════════════════════╝

📌 SCENARIO:
   ต้องการดึงข้อมูล users จาก public API และแสดงผล
   ใช้ JSONPlaceholder ซึ่งเป็น free testing API

📋 TASK:
   1. พิมพ์ comment แล้วเริ่ม `async def fetch_users():`
   2. กด Tab รับ completion ทีละบรรทัด
   3. ทดสอบ run: python ex_i02_api_fetch.py

⌨️ HOW TO USE INLINE:
   - พิมพ์ comment หลายบรรทัดก่อนเพื่อให้ context ครบ
   - เปิด Completions Panel ด้วย Ctrl+Enter เพื่อดูตัวเลือกทั้งหมด

📦 INSTALL: pip install aiohttp  (หรือใช้ requests แบบ sync ก็ได้)
"""

import asyncio
import aiohttp


# ─── พิมพ์ comment เหล่านี้ แล้ว Tab ───────────────────────────────────────────

# Fetch list of users from JSONPlaceholder API
# API URL: https://jsonplaceholder.typicode.com/users
# Print name and email of each user in format: "Name — email"
async def fetch_users():
    pass  # ← ลบ pass แล้วกด Tab เพื่อรับ suggestion


# ─── Entry point ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    asyncio.run(fetch_users())











































































# ─── เฉลย (sync version ง่ายกว่า) ─────────────────────────────────────────────
#
# import requests
#
# def fetch_users():
#     response = requests.get(
#         "https://jsonplaceholder.typicode.com/users"
#     )
#     users = response.json()
#     for user in users:
#         print(f"{user['name']} — {user['email']}")
#
# fetch_users()
#
# 💡 TIP: ถ้า suggestion ไม่ตรง ลองกด Alt+] เพื่อดู alternative suggestions
#         หรือ Ctrl+Enter เพื่อเปิด Completions Panel
