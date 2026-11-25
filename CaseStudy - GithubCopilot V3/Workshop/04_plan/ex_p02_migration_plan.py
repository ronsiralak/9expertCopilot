"""
╔══════════════════════════════════════════════════════════╗
║  GitHub Copilot Workshop — หัวข้อ: Plan                  ║
║  EX-P02: Migration Plan สำหรับ Legacy Code               ║
║                                              ║
╚══════════════════════════════════════════════════════════╝

📌 SCENARIO:
   มีโค้ด Python 2 เก่าที่ต้องการ migrate ไปเป็น Python 3

📋 TASK:
   1. ให้ Copilot ระบุทุกจุดที่ต้องแก้ไขพร้อม reason
   2. ขอ checklist การ migrate
   3. ให้สร้างโค้ด Python 3 ที่ถูกต้อง

💬 SUGGESTED PROMPT:
   "โค้ดนี้เขียนด้วย Python 2 ช่วยสร้าง migration checklist
    และแสดงโค้ด Python 3 ที่ถูกต้อง พร้อมอธิบาย reason ทุกการเปลี่ยนแปลง"
"""

# ─── LEGACY Python 2 Code (อย่า run! ใช้เพื่อ exercise เท่านั้น) ────────────

LEGACY_PY2_CODE = '''
# === Python 2 Code (DO NOT RUN) ===

print "Hello World"               # print statement

for i in xrange(10):              # xrange → range
    print i

user_input = raw_input("Name: ")  # raw_input → input
print "Hello, %s" % user_input   # % formatting → f-string

# Division
result = 7 / 2                    # Python 2: integer division = 3
                                  # Python 3: float division = 3.5

# Unicode
s = u"สวัสดี"                     # u prefix not needed in Py3
b = "bytes"                       # str in Py2 = bytes in Py3

# Dict methods
d = {"a": 1, "b": 2}
keys = d.keys()                   # returns list in Py2, view in Py3

# Exception syntax
try:
    pass
except Exception, e:              # old syntax
    print e

# Class (old style)
class MyClass:                    # should extend object in Py2
    pass
'''

# ─── TODO: ให้ Copilot แปลง LEGACY code เป็น Python 3 ────────────────────────

# แนะนำให้ copy LEGACY_PY2_CODE แล้วถาม Copilot:
# "แปลงโค้ด Python 2 นี้เป็น Python 3 ที่ถูกต้อง
#  และแสดง diff ของการเปลี่ยนแปลงทุกจุด"


# ─── เฉลย — Python 3 ──────────────────────────────────────────────────────────

def demo_python3():
    # print() is a function
    print("Hello World")

    # range is lazy (like xrange)
    for i in range(10):
        print(i)

    # input() replaces raw_input()
    # user_input = input("Name: ")
    # print(f"Hello, {user_input}")   ← f-string (modern)

    # True float division
    result = 7 / 2          # 3.5
    int_div = 7 // 2        # 3 (use // for integer division)
    print(result, int_div)

    # No u"" prefix needed
    s = "สวัสดี"             # str is unicode by default

    # Dict views (not lists)
    d = {"a": 1, "b": 2}
    keys = list(d.keys())   # convert to list if needed

    # Exception syntax
    try:
        pass
    except Exception as e:  # 'as' keyword
        print(e)


# ─── KEY PYTHON 2 → 3 CHANGES ─────────────────────────────────────────────────
MIGRATION_CHECKLIST = {
    "print statement":     "print() → function",
    "xrange":              "xrange() → range()",
    "raw_input":           "raw_input() → input()",
    "division":            "/ → // for integer, / for float",
    "unicode strings":     "u'' prefix not needed",
    "except syntax":       "except E, e → except E as e",
    "dict.keys/values":    "returns view not list",
    "integer types":       "int/long merged into int",
    "string types":        "str = unicode, bytes = bytes",
    "reduce/filter/map":   "moved to functools or use comprehension",
}

if __name__ == "__main__":
    print("📋 Python 2 → 3 Migration Checklist:")
    for item, note in MIGRATION_CHECKLIST.items():
        print(f"  ✓ {item:25s} → {note}")
