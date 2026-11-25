"""
╔══════════════════════════════════════════════════════════╗
║  GitHub Copilot Workshop — หัวข้อ: Chat                  ║
║  EX-C03: Refactor โค้ดให้ดีขึ้น                          ║
║                                             ║
╚══════════════════════════════════════════════════════════╝

📌 SCENARIO:
   โค้ดต่อไปนี้ทำงานได้แต่เขียนไม่ดี ซ้ำซ้อน และยากต่อการ maintain

📋 TASK:
   1. ถาม Copilot ให้ refactor โดยใช้ List Comprehension
   2. ให้ Copilot เพิ่ม type hints และ docstring
   3. ถาม Copilot ว่า "มีวิธี pythonic กว่านี้ไหม"

💬 SUGGESTED PROMPT:
   "Refactor โค้ดนี้ให้ pythonic มากขึ้น ใช้ list comprehension,
    เพิ่ม type hints และ docstring ที่ชัดเจน"
"""

# ─── โค้ดที่ต้องการ Refactor (Starter Code) ───────────────────────────────────

def process(data):
    result = []
    for i in range(len(data)):
        if data[i] > 0:
            result.append(data[i] * 2)
        elif data[i] < 0:
            result.append(data[i] * -1)
        else:
            result.append(0)
    return result

# ทดสอบ
print(process([3, -2, 0, -5, 4]))   # Expected: [6, 2, 0, 5, 8]


# ─── TODO: เขียนเวอร์ชัน Refactored ด้านล่าง ──────────────────────────────────

# def process_v2(data):
#     ...  # ให้ Copilot ช่วย refactor






















































# ─── เฉลย ──────────────────────────────────────────────────────────────────────
#
# def process(data: list[int]) -> list[int]:
#     """Double positives, absolute value negatives, keep zeros as-is.
#
#     Args:
#         data: List of integers to process.
#
#     Returns:
#         Processed list with the transformation applied.
#
#     Examples:
#         >>> process([3, -2, 0, -5, 4])
#         [6, 2, 0, 5, 8]
#     """
#     return [
#         x * 2 if x > 0
#         else abs(x) if x < 0
#         else 0
#         for x in data
#     ]
#
# 💡 TIP: ใช้ /fix หรือบอก Copilot จุดที่ต้องการปรับ เช่น
#         "make it more pythonic" หรือ "add type hints"
