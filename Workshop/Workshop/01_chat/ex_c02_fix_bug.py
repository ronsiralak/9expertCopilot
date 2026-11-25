"""
╔══════════════════════════════════════════════════════════╗
║  GitHub Copilot Workshop — หัวข้อ: Chat                  ║
║  EX-C02: แก้ Bug ผ่าน Chat                               ║
║                                              ║
╚══════════════════════════════════════════════════════════╝

📌 SCENARIO:
   โค้ดคำนวณ BMI นี้มี bug ทำให้ได้ผลลัพธ์ผิด

📋 TASK:
   1. วิเคราะห์หา bug และถาม Copilot: "โค้ดนี้มี bug อะไร"
   2. ให้ Copilot แก้ไขโค้ด
   3. ตรวจสอบว่าผลลัพธ์ถูกต้อง (ควรได้ ~22.86)

💬 SUGGESTED PROMPT:
   "โค้ด BMI นี้มี bug ทำให้คำนวณผิด ช่วยหา bug และแก้ไขให้หน่อย
    hint: height ควรแปลงจาก cm เป็น meter ก่อน"
"""

# ─── โค้ดที่มี Bug (Starter Code) ─────────────────────────────────────────────

def calculate_bmi(weight_kg, height_cm):
    # weight in kg, height in cm
    bmi = weight_kg / height_cm ** 2
    return round(bmi, 2)

print(calculate_bmi(70, 175))  # ควรได้ ~22.86 แต่ได้ผิด!


# ─── TODO: แก้ไขโค้ดด้านล่างนี้ ───────────────────────────────────────────────

# def calculate_bmi_fixed(weight_kg, height_cm):
#     ...  # ให้ Copilot ช่วยแก้ไข



























































# ─── เฉลย ──────────────────────────────────────────────────────────────────────
#
# BUG: ลืมแปลง height จาก cm → m ก่อนยกกำลัง 2
# สูตร BMI = weight(kg) / height(m)²
#
# def calculate_bmi(weight_kg, height_cm):
#     height_m = height_cm / 100   # ← แปลง cm → m
#     bmi = weight_kg / height_m ** 2
#     return round(bmi, 2)
#
# print(calculate_bmi(70, 175))  # Output: 22.86 ✓
