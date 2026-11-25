# 🔗 Link Shortener — Full Stack Project Guide

> **Tech Stack:** Next.js · shadcn/ui · Clerk (Auth) · Neon (PostgreSQL) · Drizzle ORM · VS Code Agent Mode

---

## 📦 ขั้นตอนที่ 1 — สร้างโปรเจกต์ Next.js

```bash
# สร้างโปรเจกต์ใหม่ด้วย Next.js (ชื่อโปรเจกต์: linkshortener)
npx create-next-app@latest linkshortener

# เข้าไปในโฟลเดอร์โปรเจกต์
cd ./linkshortener

# เปิดโปรเจกต์ใน VS Code
code .
```

---

## 🎨 ขั้นตอนที่ 2 — ติดตั้ง shadcn/ui (Component Library)

> **เอกสารอ้างอิง:**
> - https://ui.shadcn.com/
> - https://ui.shadcn.com/docs/installation/next

```bash
# ติดตั้งและ initialize shadcn/ui สำหรับโปรเจกต์ Next.js
npx shadcn@latest init
```

---

## 🔐 ขั้นตอนที่ 3 — ตั้งค่า Clerk (Authentication)

> **เอกสารอ้างอิง:** https://clerk.com/

1. สร้าง Application ใหม่บน Clerk Dashboard
2. คัดลอก API Keys (Publishable Key และ Secret Key) เตรียมไว้ใส่ใน `.env`

---

## 🗄️ ขั้นตอนที่ 4 — ตั้งค่า Neon (PostgreSQL) และ Drizzle ORM

> **เอกสารอ้างอิง:**
> - https://neon.com/
> - https://orm.drizzle.team/

```bash
# ติดตั้ง Drizzle ORM, Neon serverless driver, และ dotenv
npm i drizzle-orm @neondatabase/serverless dotenv

# ติดตั้ง drizzle-kit และ tsx เป็น dev dependencies (ใช้สำหรับ migration และ run scripts)
npm i -D drizzle-kit tsx
```

---

## 🔑 ขั้นตอนที่ 5 — สร้างไฟล์ Environment Variables

สร้างไฟล์ `.env` ที่ root ของโปรเจกต์ และกรอก keys ที่ได้จาก Clerk และ Neon:

```env
# Clerk API Keys (ได้จาก Clerk Dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Neon PostgreSQL Connection String (ได้จาก Neon Project Dashboard > Connection String)
DATABASE_URL=
```

---

## 🛠️ ขั้นตอนที่ 6 — ตั้งค่า Database Connection (Drizzle + Neon)

สร้างโฟลเดอร์ `db` และไฟล์ `db/index.ts` สำหรับเชื่อมต่อฐานข้อมูล:

```ts
// db/index.ts
// เชื่อมต่อ Drizzle ORM กับ Neon PostgreSQL ผ่าน DATABASE_URL ใน .env
import { drizzle } from 'drizzle-orm/neon-http';

const db = drizzle(process.env.DATABASE_URL!);

export { db };
```

---

## ⚙️ ขั้นตอนที่ 7 — ตั้งค่า Drizzle Config

สร้างไฟล์ `drizzle.config.ts` ที่ root ของโปรเจกต์:

```ts
// drizzle.config.ts
// กำหนด config สำหรับ Drizzle Kit เพื่อใช้ push/generate migration
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',          // โฟลเดอร์เก็บ migration files
  schema: './db/schema.ts',  // ไฟล์ schema ของ database
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

---

## 🚀 ขั้นตอนที่ 8 — รัน Dev Server

```bash
# ทดสอบว่าโปรเจกต์รันได้ปกติ
npm run dev
```

---

## 🤖 ขั้นตอนที่ 9 — ตั้งค่า AGENTS.md (AI Agent Instructions)

> **เป้าหมาย:** สร้างไฟล์ `AGENTS.md` เพื่อกำหนดมาตรฐานโค้ดให้ LLM ใช้เป็น context ขณะ generate โค้ด
> โดย instructions แต่ละชั้นจะถูกแยกเป็นไฟล์ `.md` แยกต่างหากในโฟลเดอร์ `/docs`

### 9.1 — ลบ docs ชั่วคราว

```
ลบไฟล์ทั้งหมดใน /docs/*.md ออกก่อน แล้วสร้างใหม่ผ่าน agent
```

### 9.2 — สร้าง Custom Agent สำหรับ Generate Instructions

สร้างไฟล์ `.github/agents/instructions-generator` (VS Code Agent Mode):

```yaml
---
name: instructions-generator
description: This agent generates highly specific agent instructions files for the /docs directory.
argument-hint: The inputs this agent expects, e.g., "a task to implement" or "a question to answer".
tools: [read, edit, search, web]
---
# Agent นี้รับข้อมูลเกี่ยวกับ architecture layer หรือ coding standards
# แล้วสร้างไฟล์ .md instructions ที่กระชับและชัดเจนใน /docs directory
```

### 9.3 — สร้าง Prompt Template สำหรับ Generate Instructions

สร้าง Prompt ใหม่ (Workspace) ชื่อ `create-instructions.prompt`:

```
---
agent: instructions-generator
---

Take the information below and generate an agent instructions .md file for it in the /docs directory.
If a .md filename is provided, use that, otherwise generate an appropriate filename based on the generated content.
Make sure the instructions are concise and not too long.
Make sure to update the AGENTS.md file to reference this new docs file.
If no information is provided below, prompt the user to give the necessary details about the layer of architecture or coding standards to document.
```

---

## 📋 ขั้นตอนที่ 10 — Generate Instructions ด้วย Agent

### 10.1 — Instructions สำหรับ Authentication (Clerk)

```
[Instructions Generator]
/create-instructions everything to do with auth in this app is handled by clerk.
NO OTHER AUTH METHODS SHOULD BE USED.
The /dashboard page is a protected route and must require the user to be logged in to access it.
If the user is logged in and trying to access the homepage, they should be redirected to /dashboard.
Sign in and sign up via clerk should always launch as a modal.
```

### 10.2 — Instructions สำหรับ UI Components (shadcn/ui)

```
[Instructions Generator]
/create-instructions ALL UI elements in this app use shadcn ui.
DO NOT create any custom components, ALWAYS use shadcn ui components.
```

---

## 🏗️ ขั้นตอนที่ 11 — สร้าง Dashboard Page (Agent Mode)

```
# สร้างหน้า /dashboard เบื้องต้น (ยังไม่ต้องมี data fetching)
[agent mode]
Create a /dashboard page. DO NOT add any content or data fetching just yet,
just add a Dashboard h1 tag as a placeholder.
```

```
# ตรวจสอบให้หน้า dashboard เป็นไปตาม auth standards
[agent mode]
make sure this page adheres to the auth coding standards
```

```
# ตรวจสอบให้ homepage เป็นไปตาม auth standards (อ้างอิงไฟล์ docs)
[agent mode]
make sure the homepage adheres to the auth coding standards #file:authentication.md
```

---

## 🌙 ขั้นตอนที่ 12 — ตั้งค่า Dark Mode ทั้งแอป

```
[agent mode]
make sure the entire app displays as dark mode
```

---

## 🎨 ขั้นตอนที่ 13 — ตรวจสอบ UI Components ให้ตรงตาม Standards

```
# ตรวจสอบว่าทุก UI element ใช้ shadcn/ui ตาม docs ที่กำหนดไว้
[agent mode]
make sure these elements adhere to the #file:ui-components.md
```

---

## 📝 ขั้นตอนที่ 14 — อัปเดต AGENTS.md ให้ครบถ้วน

```
# เพิ่มความสำคัญว่า agent ต้องอ่าน /docs ก่อน generate โค้ดทุกครั้ง
[agent mode]
Update the agents.md file to make sure that it's incredibly important
to ALWAYS read the relevant individual instructions files within the /docs directory
BEFORE generating ANY code.
```

---

## 🗂️ ขั้นตอนที่ 15 — วางแผน Database Schema

```
# วาง plan schema สำหรับเก็บ shortened links
[plan mode]
Plan a very simple table schema to store shortened links
```

```
# ระบุ requirements ของ schema ให้ชัดเจน
[plan mode]
We don't want any optional fields. We need:
- createdAt, updatedAt (ต้องเก็บ timezone data)
- clerk user id
- short code
- url

All dates must store timezone data.
No click tracking needed.
Deletes will be permanent (NO soft deletes).
```

---

## ⚡ ขั้นตอนที่ 16 — Implement Schema และ Push ไป Neon

```
# สั่งให้ agent สร้าง schema จาก plan ที่วางไว้
[agent mode]
Start Implementation
```

> **คำถามที่ควรถาม (Ask Mode) ก่อน implement:**

```
[ask mode]
is serial the best type to save an id as in the latest version of postgres?
```

```
[ask mode]
what about generated always as identity?
```

```
# วิธี push schema ไปยัง Neon
[ask mode]
how to push this schema to our postgres db hosted on neon?
```

```bash
# Push schema ขึ้น Neon PostgreSQL
npx drizzle-kit push
```

---

## 🔌 ขั้นตอนที่ 17 — เชื่อมต่อ Neon MCP

> เปิดใช้งาน **Neon MCP** ใน VS Code เพื่อให้ agent สามารถ query และ interact กับ database โดยตรง

```
# ทดสอบว่า agent เชื่อมต่อ Neon ได้
[agent mode]
list all of the projects in my neon account
```

---

## 🌱 ขั้นตอนที่ 18 — เพิ่ม Seed Data ตัวอย่าง

```
# ให้ agent สร้าง example data (ใช้ user id ของตัวเอง)
[ask mode]
generate 10 example links for user id [your_user_id],
use the #file:schema.ts for the correct structure
```

```
# ให้ agent insert ข้อมูลตัวอย่างเข้าไปใน Neon database
[agent mode]
insert the example data above into the [project_name_with_id] neon database
```

---

## 📊 ขั้นตอนที่ 19 — Build Dashboard Page พร้อม Query ข้อมูล

```
# สร้าง dashboard page ที่ดึงข้อมูล links ของ user ที่ login อยู่ แล้วแสดงเป็น list
[agent mode]
build out the #file:page.tsx page, query for the currently logged in user's links
and display them as a list
```

---

## ✅ สรุป Flow ทั้งหมด

```
สร้างโปรเจกต์ → ติดตั้ง shadcn/ui → ตั้งค่า Clerk → ตั้งค่า Neon + Drizzle
→ กำหนด ENV → ตั้งค่า DB Connection → สร้าง AGENTS.md + /docs instructions
→ สร้าง Dashboard → Dark Mode → Push Schema → Seed Data → Build UI
```
