"""
╔══════════════════════════════════════════════════════════╗
║  GitHub Copilot Workshop — หัวข้อ: Unit Test             ║
║  EX-U01: Test Function ด้วย Parametrize                  ║
║                                              ║
╚══════════════════════════════════════════════════════════╝

📌 SCENARIO:
   เขียน unit test สำหรับ function คำนวณภาษีเงินได้บุคคลธรรมดา (ฉบับย่อ)

📋 TASK:
   1. ถาม: "สร้าง pytest tests ครบทุก case สำหรับ calculate_tax"
   2. ต้องครอบคลุม: 3 tax brackets + boundary values + edge cases
   3. ใช้ @pytest.mark.parametrize
   4. รัน: pytest ex_u01_tax_test.py -v

💬 SUGGESTED PROMPT:
   "สร้าง pytest tests สำหรับ calculate_tax ที่ครอบคลุม:
    - ทุก tax bracket (0%, 5%, 10%)
    - boundary values ที่ขอบแต่ละ bracket
    - edge cases: 0, ลบ, ทศนิยม
    ใช้ @pytest.mark.parametrize และ pytest.approx"

📦 INSTALL: pip install pytest
🏃 RUN:     pytest ex_u01_tax_test.py -v --tb=short
"""

# ─── Source Under Test ────────────────────────────────────────────────────────

def calculate_tax(income: float) -> float:
    """Calculate Thai personal income tax (simplified).

    Tax brackets:
        0 - 150,000 THB  :  0%
        150,001 - 300,000:  5%
        300,001+         : 10%

    Args:
        income: Annual gross income in THB (must be >= 0).

    Returns:
        Tax amount in THB.

    Raises:
        ValueError: If income is negative.
    """
    if income < 0:
        raise ValueError("Income cannot be negative")
    if income <= 150_000:
        return 0.0
    elif income <= 300_000:
        return (income - 150_000) * 0.05
    else:
        return 7_500 + (income - 300_000) * 0.10


# ─── TODO: เขียน Tests ด้านล่าง ───────────────────────────────────────────────

import pytest

# ให้ Copilot generate หรือเขียนเอง:

# @pytest.mark.parametrize("income,expected", [
#     ...  # ใส่ test cases ทั้งหมด
# ])
# def test_calculate_tax(income, expected):
#     assert calculate_tax(income) == pytest.approx(expected)
#
# def test_negative_income_raises():
#     ...






































# ─── เฉลย ──────────────────────────────────────────────────────────────────────
"""
@pytest.mark.parametrize("income,expected", [
    # ── 0% bracket ──────────────────────────────────────
    (0,           0.0),        # ไม่มีรายได้
    (100_000,     0.0),        # ต่ำกว่า 150k
    (150_000,     0.0),        # boundary: สิ้นสุด 0%
    # ── 5% bracket ──────────────────────────────────────
    (150_001,     0.05),       # เริ่ม 5% (1 บาทเดียว)
    (200_000,     2_500.0),    # กลาง bracket
    (225_000,     3_750.0),    # อีกจุด
    (300_000,     7_500.0),    # boundary: สิ้นสุด 5%
    # ── 10% bracket ─────────────────────────────────────
    (300_001,     7_500.10),   # เริ่ม 10%
    (400_000,    17_500.0),    # กลาง bracket
    (1_000_000, 77_500.0),     # สูงมาก
    # ── edge cases ───────────────────────────────────────
    (0.01,        0.0),        # ทศนิยมน้อยมาก
    (150_000.01,  0.0005),     # ทศนิยมข้าม boundary
])
def test_calculate_tax(income: float, expected: float) -> None:
    assert calculate_tax(income) == pytest.approx(expected, rel=1e-5)


def test_negative_income_raises() -> None:
    with pytest.raises(ValueError, match="negative"):
        calculate_tax(-1)


def test_zero_income() -> None:
    assert calculate_tax(0) == 0.0


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
"""