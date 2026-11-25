"""
╔══════════════════════════════════════════════════════════╗
║  GitHub Copilot Workshop — หัวข้อ: Agent Mode            ║
║  EX-AG02: Automated Code Review & Fix                    ║
║                                              ║
╚══════════════════════════════════════════════════════════╝

📌 SCENARIO:
   ให้ Agent ตรวจสอบ codebase ทั้งหมดและแก้ปัญหาอัตโนมัติ

📋 TASK:
   1. เปิด project นี้ใน VS Code
   2. เปิด Copilot Chat → Agent mode
   3. วาง prompt ด้านล่างแล้วดู Agent scan ทุกไฟล์

🤖 AGENT PROMPT:
─────────────────────────────────────────────────────────
@workspace ตรวจสอบโค้ดทั้งหมดใน project และ:
1. หา function ที่ไม่มี type hints แล้วเพิ่มให้
2. หา variable ที่ชื่อไม่ชัดเจน (1-2 ตัวอักษร เช่น x, d, tmp)
   แล้ว rename ให้สื่อความหมาย
3. หา magic numbers (ตัวเลขที่ไม่มี constant name)
   แล้วแปลงเป็น named constants
4. แสดง summary ของทุกการเปลี่ยนแปลง
─────────────────────────────────────────────────────────
"""

# ─── CODE ที่มีปัญหาหลายจุด (ให้ Agent ช่วยแก้) ──────────────────────────────


def calc(x, y, z=0.1):
    """Calculate total with tax."""
    tmp = x + y
    d = tmp * z          # magic number ควรเป็น TAX_RATE
    return tmp + d


def p(items):
    """Process a list of items."""
    r = []
    for i in items:
        if i > 0:
            r.append(i * 2)
    return r


def chk(e):
    """Check if email is valid."""
    import re
    return bool(re.match(r'^[^@]+@[^@]+\.[^@]+$', e))


class usr:
    """User model."""
    def __init__(self, n, a, e):
        self.n = n      # name
        self.a = a      # age
        self.e = e      # email

    def greet(self):
        return f"Hello, {self.n}!"


# ─── เฉลย (หลัง Agent fix) ────────────────────────────────────────────────────

TAX_RATE = 0.10
MIN_VALID_AGE = 0
MAX_VALID_AGE = 150


def calculate_total_with_tax(
    price: float,
    discount: float,
    tax_rate: float = TAX_RATE,
) -> float:
    """Calculate total price after discount and tax.

    Args:
        price: Original item price.
        discount: Discount amount to subtract.
        tax_rate: Tax rate (default 10%).

    Returns:
        Final price including tax.
    """
    subtotal = price - discount
    tax_amount = subtotal * tax_rate
    return subtotal + tax_amount


def filter_positive_numbers(numbers: list[float]) -> list[float]:
    """Return only positive numbers, each doubled."""
    return [num * 2 for num in numbers if num > 0]


def is_valid_email(email: str) -> bool:
    """Check if email address is valid."""
    import re
    return bool(re.match(r'^[^@]+@[^@]+\.[^@]+$', email))


class User:
    """User model with name, age, and email."""

    def __init__(self, name: str, age: int, email: str):
        self.name = name
        self.age = age
        self.email = email

    def greet(self) -> str:
        return f"Hello, {self.name}!"


if __name__ == "__main__":
    print(calculate_total_with_tax(1000, 100))   # 990.0
    print(filter_positive_numbers([-1, 2, -3, 4, 5]))  # [4, 8, 10]
    print(is_valid_email("test@example.com"))    # True
    u = User("Alice", 30, "alice@example.com")
    print(u.greet())                             # Hello, Alice!
