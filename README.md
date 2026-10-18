# StockFlow — Manage smarter. Work better.

(เดิมชื่อ Product Hub / Prodexa) ระบบจัดการสินค้าแบบ SaaS Dashboard

Next.js 16 + TypeScript · NextAuth (Email/Password + GitHub OAuth) · RBAC (ADMIN / STAFF / USER) · SQLite + Prisma · Tailwind CSS

## เริ่มต้นใช้งาน

```bash
npm install
cp .env.example .env          # แล้วใส่ AUTH_SECRET (npx auth secret)
npx prisma migrate dev --name init
npm run db:seed               # สร้างบัญชีตัวอย่าง + สินค้าตัวอย่าง
npm run dev                   # http://localhost:3000
```

บัญชีตัวอย่าง (สำหรับพัฒนาเท่านั้น — เปลี่ยนใน `.env` ก่อนใช้งานจริง):

| Role  | Email               | Password   |
|-------|---------------------|------------|
| ADMIN | admin@example.com   | Admin@1234 |
| STAFF | staff@example.com   | Staff@1234 |
| USER  | user@example.com    | User@1234  |

GitHub OAuth (ไม่บังคับ): สร้าง OAuth App ที่ GitHub, ตั้ง callback เป็น
`http://localhost:3000/api/auth/callback/github` แล้วใส่ `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`
ผู้ใช้ GitHub จะได้ role `USER` และ ADMIN ปรับสิทธิ์ได้ที่ `/admin`

## สิทธิ์การใช้งาน (RBAC)

| การกระทำ                       | USER | STAFF | ADMIN |
|--------------------------------|:----:|:-----:|:-----:|
| ดู / ค้นหา / กรองสินค้า        | ✅   | ✅    | ✅    |
| เพิ่ม / แก้ไขสินค้า            |      | ✅    | ✅    |
| ลบสินค้า                       |      |       | ✅    |
| แดชบอร์ด / จัดการสิทธิ์ผู้ใช้  |      |       | ✅    |

สิทธิ์ถูกตรวจทั้งในหน้าเว็บ, Server Actions และ API (ไม่พึ่งการซ่อนปุ่มอย่างเดียว) และ role ถูกอ่านจากฐานข้อมูลทุก request จึงมีผลทันทีเมื่อ ADMIN เปลี่ยนสิทธิ์

## หน้าเว็บ

`/` หน้าแรก · `/login` · `/signup` · `/products` (รายการ + ค้นหา/กรอง/เรียง/แบ่งหน้า) · `/products/new` · `/products/[id]/edit` · `/admin`

## Validation (Zod)

| ฟิลด์       | กฎ |
|-------------|----|
| sku         | จำเป็น, ≤ 30 ตัว, A-Z 0-9 . _ - เท่านั้น, ไม่ซ้ำ (แปลงเป็นตัวพิมพ์ใหญ่) |
| name        | จำเป็น, ≤ 120 ตัว |
| description | ไม่บังคับ, ≤ 1,000 ตัว |
| category    | จำเป็น, ≤ 50 ตัว |
| price       | ตัวเลข 0 – 10,000,000 (ปัดเป็น 2 ตำแหน่ง) |
| stock       | จำนวนเต็ม 0 – 1,000,000 |
| unit        | ≤ 20 ตัว (ค่าเริ่มต้น "ชิ้น") |
| isActive    | boolean (ค่าเริ่มต้น true) |

## REST API

ใช้ session cookie เดียวกับหน้าเว็บ (ล็อกอินก่อน แล้วเรียกจากเบราว์เซอร์/เครื่องมือที่ส่ง cookie)
Response: `{ "data": ... }` หรือ `{ "error": "...", "errors": { field: [msg] } }`

| Method | Path                | สิทธิ์ที่ต้องมี | รายละเอียด |
|--------|---------------------|-----------------|------------|
| GET    | `/api/products`     | ทุก role        | รายการ — query: `q`, `category`, `status` (active/inactive), `stock` (low/out), `sort`, `page`, `pageSize` (≤100) |
| POST   | `/api/products`     | STAFF, ADMIN    | สร้างสินค้า → 201 |
| GET    | `/api/products/:id` | ทุก role        | ดูสินค้า 1 รายการ |
| PUT    | `/api/products/:id` | STAFF, ADMIN    | แก้ไข (ส่งครบทุกฟิลด์) |
| DELETE | `/api/products/:id` | ADMIN           | ลบสินค้า |

Status code: `400` JSON/id ผิด · `401` ยังไม่ล็อกอิน · `403` ไม่มีสิทธิ์ · `404` ไม่พบ · `409` SKU ซ้ำ · `422` validation ไม่ผ่าน

ตัวอย่าง (รันใน DevTools Console ของหน้าที่ล็อกอินแล้ว):

```js
await fetch("/api/products", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ sku: "TEST-001", name: "สินค้าทดสอบ", category: "ทั่วไป", price: 99.5, stock: 20 }),
}).then(r => r.json());

await fetch("/api/products?q=กาแฟ&stock=low&sort=price_asc").then(r => r.json());
```

## โครงสร้าง

```
app/
  auth.ts                 NextAuth config (Credentials + GitHub, sync role จาก DB)
  lib/                    prisma, rbac, validation (Zod), products (query/search/filter), utils
  api/products/           REST API
  products/               หน้ารายการ, ฟอร์ม, Server Actions
  admin/                  แดชบอร์ด + จัดการสิทธิ์
  login/ signup/          การยืนยันตัวตน
prisma/schema.prisma      User, Product
prisma/seed.ts            ข้อมูลตัวอย่าง
```


## StockFlow UI (การออกแบบใหม่)

- **ธีม**: Light / Dark / System เลือกได้จาก Topbar เก็บใน `localStorage` (`prodexa-theme`) และตั้งค่าก่อนวาดหน้าเพื่อไม่ให้เกิด flash — โทเคนสีอยู่ใน `app/globals.css`
- **โครงหน้า**: `components/layout/*` (AppShell, Sidebar ย่อได้, Topbar + Breadcrumb, Drawer บนมือถือ) เมนูถูกกรองตามสิทธิ์ฝั่ง server
- **คอมโพเนนต์**: `components/ui/*` (Button, Field, Card, Badge, Dropdown, ConfirmDialog, Toaster, EmptyState, Skeleton), `components/products/*`, `components/users/*`, `components/dashboard/*`
- **Dashboard (`/`)**: ตัวเลขและกราฟคำนวณจากฐานข้อมูลจริง (`app/lib/dashboard.ts`); การ์ด "ผู้ใช้ทั้งหมด" แสดงเฉพาะผู้มีสิทธิ์ `user:manage`
- **จัดการผู้ใช้**: `/admin` (เมนู "Users") ใช้ Server Action และกติกาสิทธิ์เดิมทั้งหมด
- ไม่มีการเพิ่ม dependency ใหม่ (ไอคอน/ธีม/กราฟเขียนเองด้วย SVG และ CSS)
- ฟอนต์: Inter + Noto Sans Thai ผ่าน `next/font/google` (ต้องออนไลน์ตอน build ครั้งแรก)
