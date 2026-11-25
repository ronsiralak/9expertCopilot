"""
╔══════════════════════════════════════════════════════════╗
║  GitHub Copilot Workshop — หัวข้อ: Inline Completion     ║
║  EX-I03: สร้าง Class จาก Docstring                      ║
║                                             ║
╚══════════════════════════════════════════════════════════╝

📌 SCENARIO:
   เริ่ม Class ด้วย docstring เพื่อให้ Copilot ต่อ method ทั้งหมดให้
   สังเกตว่า docstring ที่ระบุ Raises จะช่วยให้ Copilot เพิ่ม error handling

📋 TASK:
   1. พิมพ์ class + docstring ด้านล่าง แล้ว Tab complete `__init__`
   2. พิมพ์ `def deposit` แล้ว Tab รับ method
   3. พิมพ์ `def withdraw` ให้ครบทุก method
   4. ทดสอบด้วย test cases ด้านล่าง

⌨️ TIP: Docstring ที่ระบุ "Raises: ValueError" จะช่วยให้
        Copilot เพิ่ม error handling ใน withdraw() อัตโนมัติ
"""

# ─── Starter: พิมพ์โค้ดนี้แล้ว Tab ──────────────────────────────────────────────

class BankAccount:
    """
    Simple bank account with deposit, withdraw, and balance checking.

    Attributes:
        owner: Account holder's name.
        balance: Current balance (default 0).

    Raises:
        ValueError: If withdrawing more than available balance.
        ValueError: If deposit or withdraw amount is not positive.
    """

    def __init__(self, owner: str, balance: float = 0):
        pass  # ← Tab ที่นี่

    # def deposit(  ← พิมพ์ต่อแล้ว Tab
    # def withdraw(
    # def get_balance(
    # def __str__(   ← Bonus: ให้ Copilot สร้าง string representation


# ─── Test Cases ───────────────────────────────────────────────────────────────

def run_tests():
    acc = BankAccount("Alice", 1000)
    acc.deposit(500)
    assert acc.get_balance() == 1500, "deposit failed"

    acc.withdraw(200)
    assert acc.get_balance() == 1300, "withdraw failed"

    # Test overdraft
    try:
        acc.withdraw(9999)
        assert False, "Should raise ValueError"
    except ValueError:
        pass  # Expected

    print("✅ All tests passed!")

# run_tests()  # ← uncomment เมื่อ implement เสร็จ















































































# ─── เฉลย ──────────────────────────────────────────────────────────────────────
#
# class BankAccount:
#     """..."""
#
#     def __init__(self, owner: str, balance: float = 0):
#         self.owner = owner
#         self.balance = balance
#
#     def deposit(self, amount: float) -> None:
#         if amount <= 0:
#             raise ValueError("Deposit amount must be positive")
#         self.balance += amount
#
#     def withdraw(self, amount: float) -> None:
#         if amount <= 0:
#             raise ValueError("Withdraw amount must be positive")
#         if amount > self.balance:
#             raise ValueError("Insufficient funds")
#         self.balance -= amount
#
#     def get_balance(self) -> float:
#         return self.balance
#
#     def __str__(self) -> str:
#         return f"BankAccount({self.owner}, balance={self.balance:.2f})"
