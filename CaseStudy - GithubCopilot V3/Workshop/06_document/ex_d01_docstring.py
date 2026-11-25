"""
╔══════════════════════════════════════════════════════════╗
║  GitHub Copilot Workshop — หัวข้อ: Document              ║
║  EX-D01: เพิ่ม Docstring ให้ทุก Function                 ║
║                                              ║
╚══════════════════════════════════════════════════════════╝

📌 SCENARIO:
   โค้ดต่อไปนี้ไม่มี documentation เลย ให้ Copilot ช่วยเพิ่ม

📋 TASK:
   1. Highlight ทั้งไฟล์แล้วถาม: "เพิ่ม Google-style docstring ให้ทุก function"
   2. ให้ใส่ Args, Returns, Raises, Examples section
   3. เพิ่ม type hints ด้วย
   4. ใช้ doctest module ตรวจสอบ Examples

💬 SUGGESTED PROMPTS:
   "เพิ่ม Google-style docstring ให้ทุก function ในไฟล์นี้
    ให้มี Args, Returns, Raises, Examples section
    และเพิ่ม type hints ด้วย"

📝 DOCSTRING STYLES:
   - Google Style  → Args: / Returns: / Raises: / Examples:
   - NumPy Style   → Parameters / Returns / Examples section
   - Sphinx/reST   → :param x: / :type x: / :returns:
"""

# ─── Functions ที่ยังไม่มี Documentation ─────────────────────────────────────

def fibonacci(n):
    if n < 0:
        raise ValueError("n must be non-negative")
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)


def is_prime(num):
    if num < 2:
        return False
    for i in range(2, int(num ** 0.5) + 1):
        if num % i == 0:
            return False
    return True


def celsius_to_fahrenheit(celsius):
    return celsius * 9 / 5 + 32


def find_duplicates(lst):
    seen = set()
    duplicates = set()
    for item in lst:
        if item in seen:
            duplicates.add(item)
        seen.add(item)
    return sorted(duplicates)


def truncate_string(text, max_length, suffix="..."):
    if len(text) <= max_length:
        return text
    return text[:max_length - len(suffix)] + suffix





































# ─── เฉลย (Google Style) ──────────────────────────────────────────────────────
#
# def fibonacci(n: int) -> int:
#     """Return the nth Fibonacci number (0-indexed).
#
#     Uses recursive approach. For better performance on large n,
#     consider memoization with @functools.lru_cache.
#
#     Args:
#         n: Non-negative integer index in the Fibonacci sequence.
#
#     Returns:
#         The nth Fibonacci number.
#
#     Raises:
#         ValueError: If n is negative.
#
#     Examples:
#         >>> fibonacci(0)
#         0
#         >>> fibonacci(1)
#         1
#         >>> fibonacci(6)
#         8
#         >>> fibonacci(-1)
#         Traceback (most recent call last):
#             ...
#         ValueError: n must be non-negative
#     """
#     ...
#
# 💡 TIP: หลังเพิ่ม docstring แล้ว รัน: python -m doctest ex_d01_docstring.py -v
#         เพื่อ verify ว่า Examples ใน docstring ถูกต้อง


if __name__ == "__main__":
    import doctest
    doctest.testmod(verbose=False)
    print("✅ Doctest passed! (add examples to docstrings first)")
    print(f"fibonacci(10) = {fibonacci(10)}")
    print(f"is_prime(17)  = {is_prime(17)}")
