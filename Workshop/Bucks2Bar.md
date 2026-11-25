# 💰 Bucks2Bar — Full Stack Project Guide

> **Tech Stack:** HTML · Bootstrap 5 · Chart.js (หรือ library ที่เหมาะสม)  
> **ประเภทโปรเจกต์:** Static HTML (ไม่มี backend / ไม่มี data persistence)

---

## 📐 ขั้นตอนที่ 1 — วางแผนโครงสร้างโปรเจกต์

```
[plan mode]
This is a static html project called Bucks2Bar.
We need a UI library for styling and we need income and expense inputs for months jan - dec.
The UI should be split into 2 tabs ("Data" and "Chart").
The chart tab plots a bar chart of the income and expenses from the inputs in the Data tab.
We will need a suitable chart library to render this chart.
```

> **สิ่งที่ต้องการ:**
> - Static HTML project (ไม่มี server)
> - UI Library สำหรับ styling
> - Input สำหรับ **Income** และ **Expense** รายเดือน (ม.ค. — ธ.ค.)
> - แบ่ง UI ออกเป็น 2 แท็บ: **"Data"** และ **"Chart"**
> - แท็บ Chart แสดง Bar Chart จากข้อมูลที่กรอกในแท็บ Data
> - ต้องการ Chart Library ที่เหมาะสม

---

## ❓ ขั้นตอนที่ 2 — ตอบคำถาม Agent เพื่อกำหนด Requirements

```
[plan mode]
To answer your questions:
1. We don't need data persistence.
2. Yes
3. Bootstrap 5
```

> **สรุป decisions:**
> 1. ไม่ต้องเก็บข้อมูล (no localStorage / no backend)
> 2. ใช่ (ยืนยันข้อที่ถาม)
> 3. ใช้ **Bootstrap 5** เป็น UI Library

---

## 🔄 ขั้นตอนที่ 3 — กำหนด Chart Behavior

```
[plan mode]
1. Update automatically
2. Yes
```

> **สรุป behavior ของ Chart:**
> 1. Chart อัปเดต **อัตโนมัติ** ทันทีที่มีการแก้ไขข้อมูลใน Data tab (ไม่ต้องกดปุ่ม refresh)
> 2. ใช่ (ยืนยันข้อที่ถาม)

---

## 🚀 ขั้นตอนที่ 4 — เริ่ม Implementation

```
[agent mode]
Start implementation
```

> Agent จะสร้างไฟล์หลักของโปรเจกต์ตาม plan ที่กำหนดไว้:
> - `index.html` — โครงสร้างหน้าเว็บ พร้อม 2 tabs (Data / Chart)
> - `script.js` — logic สำหรับ input handling และ chart rendering

---

## 📥 ขั้นตอนที่ 5 — เพิ่มฟีเจอร์ Download Chart เป็น PNG

```
[agent mode]
Build out the download chart as png functionality in the #file:script.js file
```

> เพิ่มปุ่ม **"Download Chart"** ที่ export bar chart ออกมาเป็นไฟล์ `.png`  
> โดยแก้ไขใน `script.js`

---

## 🐛 ขั้นตอนที่ 6 — แก้ Bug: Chart ไม่โหลดตอนเปิดหน้าเว็บครั้งแรก

```
[agent mode]
There's an issue when the page first loads, the chart isn't loading any data.
```

> **ปัญหา:** เมื่อโหลดหน้าเว็บครั้งแรก Chart ไม่แสดงข้อมูลใดๆ  
> Agent จะ debug และแก้ไข initial render ให้ chart แสดงค่า default (0) ของทุกเดือนตั้งแต่ต้น

---

## 👤 ขั้นตอนที่ 7 — เพิ่ม Username Input พร้อม Validation

```
[agent mode]
Above the data and chart tabs in #file:index.html, render a username input
which must contain at least 1 uppercase letter, 1 number, and 1 special character
and must be at least 5 characters long.
Underneath this input, render a submit button.
```

> เพิ่ม UI ด้านบนสุดของหน้าเว็บ (เหนือ tabs) ใน `index.html`:
> - **Input field** สำหรับกรอก Username
> - **Submit button** ด้านล่าง input
>
> **เงื่อนไข Username ที่ valid:**
> | เงื่อนไข | ตัวอย่าง |
> |---|---|
> | ความยาวอย่างน้อย 5 ตัวอักษร | `Abc1!` ✅ |
> | มีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว | `A` ✅ |
> | มีตัวเลขอย่างน้อย 1 ตัว | `1` ✅ |
> | มีอักขระพิเศษอย่างน้อย 1 ตัว | `!@#$%` ✅ |

---

## ✅ ขั้นตอนที่ 8 — Implement Username Form Validation Logic

```
[agent mode]
Implement the submit form for the username form in #file:script.js.
Render an appropriate message if the username passes or fails the regex.
```

> เพิ่ม logic ใน `script.js`:
> - ใช้ **Regex** ตรวจสอบ username ตาม rules ที่กำหนด
> - แสดงข้อความ **สำเร็จ** (เช่น "✅ Username is valid!") เมื่อผ่าน
> - แสดงข้อความ **ผิดพลาด** (เช่น "❌ Username must contain...") เมื่อไม่ผ่าน

---

## ✅ สรุป Flow ทั้งหมด

```
วางแผน UI → กำหนด Tech Stack (Bootstrap 5) → กำหนด Chart Behavior
→ Implement โครงสร้างหลัก → Download PNG → แก้ Bug Initial Load
→ เพิ่ม Username Input → Implement Validation Logic
```

## 📁 โครงสร้างไฟล์ที่คาดว่าจะได้

```
bucks2bar/
├── index.html      ← โครงสร้าง UI, tabs, username form
└── script.js       ← chart logic, validation, download PNG
```
