"""
╔══════════════════════════════════════════════════════════╗
║  GitHub Copilot Workshop — หัวข้อ: Unit Test             ║
║  EX-U02: Test Error Cases ด้วย pytest.raises             ║
║                                              ║
╚══════════════════════════════════════════════════════════╝

📌 SCENARIO:
   เขียน test ที่ครอบคลุม error scenarios ของ BankAccount class
   ให้ครบทุก branch ใน withdraw() และ deposit()

📋 TASK:
   1. ถาม Copilot ให้ generate tests สำหรับทุก error path
   2. Test: overdraft, negative amount, zero amount
   3. ใช้ pytest.raises พร้อม match= parameter
   4. เพิ่ม test สำหรับ deposit() ด้วย
   5. รัน: pytest ex_u02_bank_test.py -v --cov

💬 SUGGESTED PROMPT:
   "สร้าง pytest tests สำหรับ BankAccount class ที่ครอบคลุม:
    - Happy path: deposit, withdraw, balance
    - Error path: overdraft, negative/zero amount
    - State verification: balance หลัง multiple operations
    ใช้ class-based tests พร้อม setup_method"

📦 INSTALL: pip install pytest pytest-cov
🏃 RUN:     pytest ex_u02_bank_test.py -v
"""

# ─── Source Under Test ────────────────────────────────────────────────────────

class BankAccount:
    """Simple bank account for testing practice."""

    def __init__(self, owner: str, balance: float = 0.0):
        if balance < 0:
            raise ValueError("Initial balance cannot be negative")
        self.owner = owner
        self._balance = balance
        self._transactions: list[dict] = []

    @property
    def balance(self) -> float:
        return self._balance

    def deposit(self, amount: float) -> None:
        """Deposit money into the account."""
        if amount <= 0:
            raise ValueError(f"Deposit amount must be positive, got {amount}")
        self._balance += amount
        self._transactions.append({"type": "deposit", "amount": amount})

    def withdraw(self, amount: float) -> None:
        """Withdraw money from the account."""
        if amount <= 0:
            raise ValueError(f"Withdraw amount must be positive, got {amount}")
        if amount > self._balance:
            raise ValueError(
                f"Insufficient funds: balance={self._balance}, requested={amount}"
            )
        self._balance -= amount
        self._transactions.append({"type": "withdraw", "amount": amount})

    def get_transaction_count(self) -> int:
        return len(self._transactions)

    def __repr__(self) -> str:
        return f"BankAccount(owner={self.owner!r}, balance={self._balance:.2f})"


# ─── TODO: เขียน Tests ด้านล่าง ───────────────────────────────────────────────

import pytest


class TestBankAccountInit:
    """Tests for BankAccount initialization."""

    def test_default_balance_is_zero(self):
        # TODO
        pass

    def test_initial_balance_set_correctly(self):
        # TODO
        pass

    def test_negative_initial_balance_raises(self):
        # TODO: ใช้ pytest.raises
        pass


class TestDeposit:
    """Tests for deposit() method."""

    def setup_method(self):
        self.account = BankAccount("Alice", 1000.0)

    def test_deposit_increases_balance(self):
        # TODO
        pass

    def test_deposit_zero_raises(self):
        # TODO
        pass

    def test_deposit_negative_raises(self):
        # TODO
        pass

    def test_multiple_deposits(self):
        # TODO: deposit 3 ครั้ง ตรวจ final balance
        pass


class TestWithdraw:
    """Tests for withdraw() method."""

    def setup_method(self):
        self.account = BankAccount("Bob", 500.0)

    def test_withdraw_decreases_balance(self):
        # TODO
        pass

    def test_withdraw_exact_balance(self):
        # TODO: ถอนทั้งหมด balance เหลือ 0
        pass

    def test_overdraft_raises(self):
        # TODO: ใช้ pytest.raises พร้อม match=
        pass

    def test_withdraw_zero_raises(self):
        # TODO
        pass

    def test_withdraw_negative_raises(self):
        # TODO
        pass


class TestTransactionHistory:
    """Tests for transaction tracking."""

    def test_transaction_count_after_operations(self):
        # TODO: deposit 2 ครั้ง, withdraw 1 ครั้ง → count = 3
        pass












































# ─── เฉลย ──────────────────────────────────────────────────────────────────────
"""
class TestBankAccountFull:
    #Complete test suite — reference answer.

    def setup_method(self):
        self.account = BankAccount("Test User", 1000.0)

    # ── Init ────────────────────────────────────────────
    def test_default_balance(self):
        acc = BankAccount("New")
        assert acc.balance == 0.0

    def test_initial_balance(self):
        assert self.account.balance == 1000.0

    def test_negative_initial_raises(self):
        with pytest.raises(ValueError):
            BankAccount("Bad", -100)

    # ── Deposit ─────────────────────────────────────────
    def test_deposit_success(self):
        self.account.deposit(500)
        assert self.account.balance == 1500.0

    def test_deposit_zero_raises(self):
        with pytest.raises(ValueError, match="positive"):
            self.account.deposit(0)

    def test_deposit_negative_raises(self):
        with pytest.raises(ValueError, match="positive"):
            self.account.deposit(-100)

    def test_multiple_deposits(self):
        self.account.deposit(100)
        self.account.deposit(200)
        self.account.deposit(300)
        assert self.account.balance == pytest.approx(1600.0)

    # ── Withdraw ─────────────────────────────────────────
    def test_withdraw_success(self):
        self.account.withdraw(400)
        assert self.account.balance == 600.0

    def test_withdraw_all(self):
        self.account.withdraw(1000)
        assert self.account.balance == 0.0

    def test_overdraft_raises(self):
        with pytest.raises(ValueError, match="Insufficient funds"):
            self.account.withdraw(9999)

    def test_withdraw_zero_raises(self):
        with pytest.raises(ValueError, match="positive"):
            self.account.withdraw(0)

    def test_withdraw_negative_raises(self):
        with pytest.raises(ValueError, match="positive"):
            self.account.withdraw(-50)

    # ── Transaction ──────────────────────────────────────
    def test_transaction_history(self):
        self.account.deposit(200)
        self.account.withdraw(100)
        self.account.deposit(50)
        assert self.account.get_transaction_count() == 3

    def test_balance_unchanged_on_failed_withdraw(self):
        original = self.account.balance
        with pytest.raises(ValueError):
            self.account.withdraw(99999)
        assert self.account.balance == original  # ← ตรวจ side effect


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
"""