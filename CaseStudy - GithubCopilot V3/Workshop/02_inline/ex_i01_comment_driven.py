"""
╔══════════════════════════════════════════════════════════╗
║  GitHub Copilot Workshop — หัวข้อ: Inline Completion     ║
║  EX-I01: เขียน Function จาก Comment                     ║
║                                              ║
╚══════════════════════════════════════════════════════════╝

📌 SCENARIO:
   พิมพ์ comment ต่อไปนี้แล้วดูว่า Copilot suggest อะไร

📋 TASK:
   1. พิมพ์ comment ทั้ง 3 บรรทัดด้านล่าง
   2. เริ่มพิมพ์ `def is_palindrome(` แล้วกด Tab
   3. ทดสอบด้วย "racecar", "hello", "A man a plan a canal Panama"

⌨️ HOW TO USE INLINE:
   - กด Tab เพื่อ accept suggestion
   - กด Alt+] / Alt+[ เพื่อดู alternative suggestions
   - กด Esc เพื่อ dismiss
"""

# ─── Starter: พิมพ์ comment เหล่านี้แล้วกด Enter ──────────────────────────────

# Function to check if a string is a palindrome
# Returns True if the string reads the same forwards and backwards
# Ignore spaces and case sensitivity
def is_palindrome(
    # ← วางเคอร์เซอร์ที่นี่แล้วกด Tab เพื่อรับ suggestion


# ─── Test Cases (ใช้ทดสอบเมื่อเขียนเสร็จ) ─────────────────────────────────────

# print(is_palindrome("racecar"))                          # Expected: True
# print(is_palindrome("hello"))                            # Expected: False
# print(is_palindrome("A man a plan a canal Panama"))      # Expected: True
# print(is_palindrome(""))                                 # Expected: True
# print(is_palindrome("a"))                                # Expected: True
























































# ─── เฉลย ──────────────────────────────────────────────────────────────────────
#
# def is_palindrome(s: str) -> bool:
#     cleaned = s.lower().replace(' ', '')
#     return cleaned == cleaned[::-1]
#
# 💡 KEY INSIGHT:
#    ยิ่ง comment ชัดและละเอียด Copilot จะ suggest ได้แม่นยำขึ้น
#    ลองเปรียบเทียบผลที่ได้จาก comment 1 บรรทัด กับ 3 บรรทัด
