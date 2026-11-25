"""
╔══════════════════════════════════════════════════════════╗
║  GitHub Copilot Workshop — หัวข้อ: Ask                   ║
║  EX-A01: ค้นหา Function ใน Codebase                     ║
║                                              ║
╚══════════════════════════════════════════════════════════╝

📌 SCENARIO:
   สมมติว่าคุณ join โปรเจค e-commerce ใหม่
   ต้องการรู้ว่าระบบ discount คำนวณอย่างไร

📁 PROJECT STRUCTURE (สมมติ):
   ecommerce/
   ├── models/
   │   ├── order.py
   │   └── product.py
   ├── services/
   │   ├── pricing.py     ← discount logic อยู่ที่นี่
   │   └── cart.py
   └── utils/
       └── validators.py

📋 TASK:
   1. พิมพ์ใน Chat: @workspace ระบบ discount คำนวณอย่างไร มีไฟล์ไหนบ้าง
   2. ถาม: @workspace ฟังก์ชัน apply_discount รับ parameter อะไรบ้าง
   3. ถามต่อ: #file:pricing.py อธิบาย logic การลด price ให้หน่อย

💬 SUGGESTED PROMPTS:
   "@workspace Where is the discount calculation logic?
    Show me which files and functions handle discounts"

   "@workspace What parameters does apply_discount accept
    and what does it return?"

   "#file:services/pricing.py Explain the business logic
    for calculating the final price with discount"
"""

# ─── Simulated pricing.py (ไฟล์สมมติสำหรับ practice) ────────────────────────

class DiscountType:
    PERCENTAGE = "percentage"
    FIXED = "fixed"
    BUY_X_GET_Y = "buy_x_get_y"


def apply_discount(
    original_price: float,
    discount_value: float,
    discount_type: str = DiscountType.PERCENTAGE,
    min_purchase: float = 0.0
) -> float:
    """Apply discount to a product price.

    Args:
        original_price: Original price before discount.
        discount_value: Discount amount (% or fixed baht).
        discount_type: Type of discount calculation.
        min_purchase: Minimum purchase required.

    Returns:
        Final price after discount (never below 0).
    """
    if original_price < min_purchase:
        return original_price

    if discount_type == DiscountType.PERCENTAGE:
        return original_price * (1 - discount_value / 100)
    elif discount_type == DiscountType.FIXED:
        return max(0.0, original_price - discount_value)
    return original_price


def calculate_cart_total(items: list[dict], coupon_code: str = "") -> dict:
    """Calculate total price for cart items with optional coupon."""
    subtotal = sum(item["price"] * item["qty"] for item in items)
    discount = 0.0

    # Coupon logic
    if coupon_code == "SAVE10":
        discount = subtotal * 0.10
    elif coupon_code == "FLAT100" and subtotal >= 500:
        discount = 100.0

    return {
        "subtotal": subtotal,
        "discount": discount,
        "total": subtotal - discount,
    }


# ─── TODO: ถาม Copilot เกี่ยวกับ function เหล่านี้ ─────────────────────────────
#
# คำถามที่น่าสนใจ:
# 1. "อธิบาย flow ของ calculate_cart_total ให้หน่อย"
# 2. "มีกรณีไหนที่ calculate_cart_total จะให้ผลลัพธ์ผิดพลาดไหม"
# 3. "เพิ่ม discount type ใหม่ FLAT_50_OVER_300 ได้ไหม"


# ─── Demo ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # Test apply_discount
    print(apply_discount(500, 20))              # 400.0 (20% off)
    print(apply_discount(500, 100, "fixed"))    # 400.0 (100 baht off)

    # Test cart
    cart = [
        {"name": "Book", "price": 300, "qty": 1},
        {"name": "Pen",  "price": 50,  "qty": 4},
    ]
    print(calculate_cart_total(cart, "SAVE10"))
    # Expected: subtotal=500, discount=50, total=450
