"""
╔══════════════════════════════════════════════════════════╗
║  GitHub Copilot Workshop — หัวข้อ: Ask                   ║
║  EX-A02: เปรียบเทียบ 2 Approach                         ║
║                                              ║
╚══════════════════════════════════════════════════════════╝

📌 SCENARIO:
   ต้องการรู้ว่าควรใช้ list หรือ set สำหรับ storing user IDs
   ที่ต้องตรวจสอบบ่อยมาก (~1,000 ครั้ง/วินาที, ~100,000 users)

📋 TASK:
   1. ถาม Copilot เปรียบเทียบ performance ของทั้งสอง
   2. ขอตัวอย่าง benchmark code
   3. ถามว่า trade-off อะไรบ้าง

💬 SUGGESTED PROMPT:
   "เปรียบเทียบ list vs set สำหรับ membership checking ใน Python
    เรื่อง time complexity, memory usage, และ use case ที่เหมาะสม
    ให้ benchmark code ด้วย"
"""

import timeit
import sys

# ─── Setup: สร้าง Collection ขนาดใหญ่ ────────────────────────────────────────

N = 100_000
ids_list = list(range(N))
ids_set  = set(range(N))

# ─── TODO: ให้ Copilot ช่วย benchmark ───────────────────────────────────────────

# ถาม: "เขียน benchmark code เปรียบเทียบ lookup time ของ list vs set
#       สำหรับ N=100,000 items โดย search หา element ที่อยู่ตรงกลางและท้ายสุด"


# ─── Benchmark (ให้ Copilot generate หรือดูเฉลยด้านล่าง) ─────────────────────

def benchmark():
    # Search for element in the middle
    t_list_mid = timeit.timeit(
        lambda: N // 2 in ids_list, number=1000
    )
    t_set_mid = timeit.timeit(
        lambda: N // 2 in ids_set, number=1000
    )

    # Search for last element (worst case for list)
    t_list_end = timeit.timeit(
        lambda: N - 1 in ids_list, number=1000
    )
    t_set_end = timeit.timeit(
        lambda: N - 1 in ids_set, number=1000
    )

    # Search for non-existent element (worst case for list)
    t_list_miss = timeit.timeit(
        lambda: N + 1 in ids_list, number=1000
    )
    t_set_miss = timeit.timeit(
        lambda: N + 1 in ids_set, number=1000
    )

    print(f"{'Case':<20} {'list (ms)':>12} {'set (ms)':>12} {'speedup':>10}")
    print("-" * 58)
    cases = [
        ("Middle element", t_list_mid,  t_set_mid),
        ("Last element",   t_list_end,  t_set_end),
        ("Missing element",t_list_miss, t_set_miss),
    ]
    for name, tl, ts in cases:
        speedup = tl / ts if ts > 0 else float('inf')
        print(f"{name:<20} {tl*1000:>12.4f} {ts*1000:>12.4f} {speedup:>9.0f}x")

    print(f"\n📦 Memory: list={sys.getsizeof(ids_list):,} bytes | "
          f"set={sys.getsizeof(ids_set):,} bytes")


if __name__ == "__main__":
    benchmark()
































































# ─── เฉลย / สรุป ────────────────────────────────────────────────────────────────
#
# RESULT:
#   list: O(n) lookup  → ช้าเมื่อ n ใหญ่
#   set:  O(1) lookup  → เร็วคงที่ไม่ว่า n จะใหญ่แค่ไหน
#
# TRADE-OFFS:
#   list  → ordered, allow duplicates, memory efficient for small n
#   set   → unordered, unique values, fast lookup, slightly more memory
#
# CONCLUSION: ใช้ set เสมอสำหรับ membership testing ขนาดใหญ่
