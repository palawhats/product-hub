# PRODEXA_UPDATE.md

# Prodexa — UI/UX Redesign & Development Handoff

**Project:** Product Hub → Prodexa  
**Date:** 17 October 2026  
**Status:** Ready for Implementation  
**Priority:** UI/UX Redesign with Existing Functionality Preserved

---

## 1. Project Overview

เปลี่ยนชื่อและออกแบบหน้าตาของระบบ Product Hub ใหม่เป็น **Prodexa** ภายใต้แนวคิด Modern SaaS Product Management Dashboard

**Brand Name:** Prodexa  
**Tagline:** Manage smarter. Work better.

เป้าหมายคือทำให้เว็บมีหน้าตาเป็นมืออาชีพ ทันสมัย ใช้งานง่าย รองรับอุปกรณ์หลายขนาด และมีระบบ Light/Dark Mode โดยยังคงความสามารถเดิมทั้งหมด

### Technology Stack

ข้อมูลเทคโนโลยีจากการพัฒนาโปรเจกต์ก่อนหน้า (Claude ต้องตรวจสอบกับไฟล์ปัจจุบันอีกครั้ง):

- Next.js 16 / App Router
- TypeScript
- React
- Auth.js / NextAuth
- Credentials Authentication
- GitHub OAuth
- Prisma 7
- SQLite
- Role-Based Access Control (ADMIN, STAFF, USER)

**IMPORTANT:** โปรดตรวจสอบ `package.json`, `prisma/schema.prisma`, `app/auth.ts` และโครงสร้างโปรเจกต์จริงก่อนดำเนินการ เพราะเอกสารนี้เป็นข้อกำหนดงานออกแบบ ไม่ใช่ผลการตรวจสอบโค้ดทุกไฟล์ใน ZIP

---

## 2. Development Rules — ข้อกำหนดสำคัญ

### MUST PRESERVE

1. ระบบ Login และ Logout ที่มีอยู่
2. การเข้าสู่ระบบด้วย Email/Password
3. GitHub OAuth
4. Session Management
5. ระบบแบ่งสิทธิ์ ADMIN / STAFF / USER
6. Prisma ORM และข้อมูลในฐานข้อมูลเดิม
7. API Routes, Server Actions และ Backend Logic เดิม
8. Product CRUD ที่มีอยู่
9. User Management ที่มีอยู่
10. การตรวจสอบสิทธิ์ทั้งฝั่ง Server และ UI

### DO NOT

- ไม่ลบฟีเจอร์เดิม
- ไม่เปลี่ยนโครงสร้างฐานข้อมูลโดยไม่จำเป็น
- ไม่สร้างระบบ Authentication ใหม่ทับระบบเดิม
- ไม่แก้ Permission Matrix เองโดยไม่มีหลักฐานจากโค้ด
- ไม่ใช้ข้อมูลจำลองแทนข้อมูลจริงใน Production
- ไม่เปลี่ยนชื่อฟิลด์ Prisma โดยไม่จำเป็น
- ไม่แก้ปัญหา TypeScript ด้วย `any` หรือการปิด Type Checking
- ไม่ใส่ไลบรารีใหม่จำนวนมากหากของเดิมรองรับอยู่แล้ว

เป้าหมายหลักคือ **เปลี่ยน UI โดยรักษาพฤติกรรมระบบเดิมทั้งหมด**

---

## 3. Brand Identity & Design System

### Theme Style

Professional, Minimal, Modern, Clean SaaS Dashboard

### Light Mode Colors

| Token | Color |
|---|---|
| Primary | #4F46E5 |
| Primary Hover | #4338CA |
| Background | #F8FAFC |
| Surface | #FFFFFF |
| Text Primary | #0F172A |
| Text Secondary | #64748B |
| Border | #E2E8F0 |
| Success | #10B981 |
| Warning | #F59E0B |
| Error | #EF4444 |

### Dark Mode Colors

| Token | Color |
|---|---|
| Primary | #818CF8 |
| Primary Hover | #6366F1 |
| Background | #0B1120 |
| Surface | #111827 |
| Surface Elevated | #1E293B |
| Text Primary | #F1F5F9 |
| Text Secondary | #94A3B8 |
| Border | #334155 |
| Success | #34D399 |
| Warning | #FBBF24 |
| Error | #F87171 |

### Typography

- English Font: Inter
- Thai Font: Noto Sans Thai
- Headings: SemiBold / Bold
- Body Text: Regular / Medium
- Responsive Typography

### Component Style

- Card Border Radius: 12–16px
- Button Radius: 8–10px
- Input Radius: 8–10px
- Soft Shadows ใน Light Mode
- Minimal Shadows ใน Dark Mode
- Icon Library: Lucide React หรือของเดิม
- Transition Duration: 150–200ms
- Consistent Spacing System

### Logo

สร้างโลโก้ Prodexa แบบเรียบง่าย ประกอบด้วย:

- ไอคอนกล่องสินค้า / Modular Boxes
- สี Indigo
- ข้อความ Prodexa
- รองรับการแสดงผลทั้ง Light/Dark Mode
- สามารถใช้เป็น Favicon ได้

---

## 4. Global Layout

ออกแบบโครงสร้าง Dashboard ใหม่ประกอบด้วย Sidebar, Topbar และ Main Content

### Sidebar

เมนูหลักควรประกอบด้วยรายการที่มีอยู่จริงและผู้ใช้มีสิทธิ์เข้าถึง เช่น:

- Dashboard
- Products
- Users / User Management
- Profile
- Settings (เฉพาะถ้ามีอยู่จริง)
- Logout

ฟีเจอร์ที่ยังไม่มีในระบบสามารถออกแบบเป็นข้อเสนอได้ แต่ห้ามสร้างเส้นทางหรือเมนูที่ใช้งานไม่ได้ในหน้าระบบจริง

Sidebar Requirements:

- แสดง Logo และชื่อ Prodexa
- มีไอคอนหน้าเมนู
- Active Menu Highlight
- Collapsible Sidebar บน Desktop
- Mobile Drawer Navigation
- Role-Based Menu Visibility
- แสดงข้อมูลโปรไฟล์ผู้ใช้งาน

### Topbar

- ชื่อหน้าปัจจุบัน
- Breadcrumb
- Theme Toggle
- User Avatar
- User Dropdown
- Logout
- Notification เฉพาะกรณีมีระบบรองรับจริง

### Responsive Behavior

Desktop:
- Sidebar ด้านซ้าย
- Content ด้านขวา
- Grid Dashboard หลายคอลัมน์

Tablet:
- Sidebar ย่อได้
- Card Grid ลดจำนวนคอลัมน์

Mobile:
- Hamburger Menu
- Sidebar Drawer
- Dashboard Cards 1–2 คอลัมน์
- Tables รองรับ Horizontal Scroll หรือ Card View
- ปุ่มและ Form ใช้งานง่ายบน Touchscreen

---

## 5. Login Page Redesign

### Visual Design

ใช้รูปแบบ Split-Screen Login

**Left Panel:**
- Prodexa Logo
- Brand Name
- Tagline
- Gradient Background สี Indigo / Purple
- Decorative Shapes แบบ Minimal

**Right Panel:**
- Welcome Back Heading
- Email Input
- Password Input
- Show/Hide Password
- Login Button
- GitHub Login Button
- Error Messages

### Functional Requirements

- ใช้ Authentication Logic เดิม
- ใช้ Auth.js / NextAuth เดิม
- แสดง Loading State ระหว่าง Login
- แสดง Error เมื่ออีเมลหรือรหัสผ่านไม่ถูกต้อง
- Redirect ไปยังหน้าที่ผู้ใช้ได้รับอนุญาตหลัง Login สำเร็จ
- รองรับ Session เดิม
- ไม่ทำให้ GitHub OAuth เสีย
- ตรวจสอบ Redirect URL ให้ปลอดภัย

### UI States

- Default
- Input Focus
- Loading
- Authentication Error
- Successful Redirect

---

## 6. Dashboard Page Redesign

### Header

ข้อความตัวอย่าง:

**Dashboard**  
"ภาพรวมการจัดการสินค้าและข้อมูลสำคัญของระบบ"

### Statistics Cards

ตัวอย่างข้อมูลที่สามารถแสดงได้เมื่อมีข้อมูลจริงรองรับ:

1. Total Products
2. Recently Added Products
3. Total Users
4. Recent Activities (เฉพาะเมื่อมีข้อมูลกิจกรรม)

แต่ละ Card ประกอบด้วย:

- Icon
- Metric Label
- Metric Value
- Description หรือข้อมูลการเปลี่ยนแปลงที่คำนวณได้จริง

### Dashboard Content

- Overview Cards
- Recent Products
- Product Status Summary (ถ้ามีสถานะสินค้าใน Schema)
- Charts (เฉพาะข้อมูลที่มีอยู่จริง)
- Quick Actions ตามสิทธิ์

### Chart Guidelines

- ใช้ Recharts หากติดตั้งอยู่แล้ว หรือเลือกไลบรารีที่เหมาะสม
- รองรับ Dark Mode
- Responsive
- ใช้ข้อมูลจริงจาก Backend
- ไม่สร้างตัวเลขแนวโน้มหรือสถิติสมมติในระบบจริง

### Dashboard States

- Loading Skeleton
- Empty State
- Error State
- Data Loaded State

---

## 7. Product Management Redesign

### Layout

ใช้ Modern Data Management Interface

### Main Components

**Page Header**
- Products Title
- Description
- Add Product Button (เฉพาะบทบาทที่มีสิทธิ์)

**Search & Filter**
- Search Input
- Filter Controls ตามฟิลด์จริง
- Sort Controls
- Pagination

**Product Table**
แสดงเฉพาะฟิลด์ที่มีอยู่จริงในระบบ เช่น:

- Product Name
- Product Code / SKU (ถ้ามี)
- Category (ถ้ามี)
- Price (ถ้ามี)
- Quantity (ถ้ามี)
- Status (ถ้ามี)
- Created Date
- Actions

### CRUD Interface

Create Product:
- Form ที่สอดคล้องกับ Prisma Schema
- Validation
- Loading State
- Success/Error Feedback

Edit Product:
- Prefilled Data
- Save Changes
- Validation

Delete Product:
- Confirmation Dialog
- Permission Check
- Success/Error Feedback

Product Detail:
- แสดงรายละเอียดสินค้าตามข้อมูลจริง
- รองรับการนำทางกลับรายการสินค้า

### UX Requirements

- Search แบบ Debounce เมื่อเหมาะสม
- Pagination ที่ไม่ทำให้ UI ค้าง
- Responsive Table
- Empty Search Results
- Action Menu
- Toast Feedback
- Accessible Dialog

สำคัญ: อย่าเพิ่มฟิลด์หรือสถานะใหม่ลงฐานข้อมูลเพียงเพื่อให้หน้าตา UI ตรงกับ Mockup

---

## 8. User Management Redesign

### Layout

หน้า User Management ควรดูเป็นระบบจัดการผู้ใช้ระดับองค์กร

### User Table

แสดงข้อมูลตาม Schema เดิม เช่น:

- Avatar / Initial
- Name
- Email
- Role
- Account Status (ถ้ามี)
- Created Date (ถ้ามี)
- Actions

### Role Badges

- ADMIN: Indigo
- STAFF: Teal
- USER: Slate

### Features

รักษาความสามารถเดิม เช่น:

- View Users
- Search Users
- Create Users (ถ้ามี)
- Edit User (ถ้ามี)
- Change User Role (ตามสิทธิ์เดิม)
- Delete / Disable User (เฉพาะฟังก์ชันที่มีอยู่)

### Permission Rules

ใช้ RBAC เดิมเป็นแหล่งข้อมูลหลัก

Claude ต้องตรวจสอบ:

- `app/lib/rbac.ts` หรือไฟล์ Permission ที่ใช้จริง
- Server-side Authorization
- Session User Role
- Authorization ของ API และ Server Actions
- การแสดงหรือซ่อนเมนูและปุ่มตามสิทธิ์

**สำคัญ:** การซ่อนปุ่มบนหน้าเว็บอย่างเดียวไม่ถือว่าปลอดภัย ต้องตรวจสอบ Permission ฝั่ง Server ด้วย

---

## 9. Light & Dark Mode

### Theme Requirements

รองรับ 3 ตัวเลือก:

1. Light
2. Dark
3. System

### Expected Behavior

- เปลี่ยน Theme ได้จาก Topbar
- เปลี่ยนสีทุกหน้าร่วมกัน
- บันทึกการตั้งค่าของผู้ใช้ใน Browser
- รองรับ System Preference
- ไม่เกิด Flash of Incorrect Theme เมื่อโหลดหน้า
- Input, Modal, Dropdown, Table และ Charts ต้องรองรับทั้งสองธีม

### Implementation

ให้ตรวจสอบ Theme Infrastructure เดิมก่อน

หากโปรเจกต์ใช้ Tailwind CSS อยู่แล้ว ให้ใช้แนวทาง Dark Mode ที่เหมาะกับเวอร์ชันจริง

สามารถใช้ `next-themes` หากเหมาะสม แต่ไม่จำเป็นต้องติดตั้งเพิ่มหากระบบเดิมรองรับแล้ว

ใช้ CSS Variables หรือ Semantic Design Tokens แทนการ Hardcode สีลงใน Component ทุกตัว

---

## 10. Shared UI Components

ให้จัดระเบียบหรือสร้าง Component แบบ Reusable โดยเลือกโครงสร้างที่สอดคล้องกับโปรเจกต์จริง

ตัวอย่างโครงสร้างที่แนะนำ:

```text
app/
  layout.tsx
  globals.css
  auth.ts
  lib/
    rbac.ts

components/
  layout/
    AppSidebar.tsx
    AppTopbar.tsx
    AppShell.tsx

  ui/
    Button.tsx
    Input.tsx
    Card.tsx
    Badge.tsx
    DataTable.tsx
    Modal.tsx
    ConfirmDialog.tsx
    EmptyState.tsx
    LoadingSkeleton.tsx

  theme/
    ThemeProvider.tsx
    ThemeToggle.tsx

  dashboard/
    StatCard.tsx
    DashboardOverview.tsx

  products/
    ProductTable.tsx
    ProductForm.tsx

  users/
    UserTable.tsx
    RoleBadge.tsx
```

โครงสร้างนี้เป็นเพียงข้อเสนอ ห้ามย้ายไฟล์หรือเปลี่ยน Route เดิมโดยไม่จำเป็น

---

## 11. Authentication & RBAC Compatibility

### Critical Requirements

ระบบ Authentication และ RBAC ต้องทำงานได้เหมือนเดิมหลังปรับ UI

ตรวจสอบ:

- Credentials Sign In
- GitHub Sign In
- Session Callback
- JWT Callback ถ้าใช้
- User Role Mapping
- Protected Routes
- Login Redirect
- Logout
- API Authorization

### Known Previous Build Issues

มีรายงานข้อผิดพลาด TypeScript จากการ Build ครั้งก่อน ได้แก่:

```text
app/auth.ts(60,20):
TS2322 Type '{}' is not assignable to type 'string'.

app/auth.ts(70,22):
TS2339 Property 'role' does not exist on type
'AdapterUser & User'.

app/lib/rbac.ts(37,27):
TS2339 Property 'role' does not exist on type 'User'.

app/lib/rbac.ts(38,66):
TS2339 Property 'role' does not exist on type 'User'.
```

ข้อผิดพลาดนี้อาจได้รับการแก้ไขแล้ว ให้ตรวจสอบใหม่ก่อนดำเนินการ

หากยังพบ ให้แก้การประกาศ TypeScript Type ของ Auth.js และการส่งผ่าน Role อย่างถูกต้อง โดยไม่ใช้ `any` หรือปิดการตรวจสอบ TypeScript

---

## 12. Accessibility & UX Quality

ทุกหน้าต้องมี:

- Keyboard Navigation
- Visible Focus State
- Accessible Form Labels
- Appropriate Color Contrast
- Semantic HTML
- Loading Feedback
- Error Feedback
- Empty State
- Confirmation Dialog สำหรับการลบ
- Responsive Design
- Reduced Motion Support

สำหรับระบบภาษาไทย ต้องตรวจสอบว่าข้อความไม่ล้น Component โดยเฉพาะบนหน้าจอขนาดเล็ก

---

## 13. Implementation Phases

### Phase 1 — Codebase Audit

- [ ] ตรวจสอบโครงสร้างโปรเจกต์ทั้งหมด
- [ ] ตรวจสอบ Routes จริง
- [ ] ตรวจสอบ UI Framework และ Dependencies
- [ ] ตรวจสอบ Authentication
- [ ] ตรวจสอบ RBAC
- [ ] ตรวจสอบ Prisma Schema
- [ ] ตรวจสอบสถานะ Build ปัจจุบัน
- [ ] ระบุรายการไฟล์ที่ต้องแก้

### Phase 2 — Branding & Theme

- [ ] เปลี่ยน Branding เป็น Prodexa
- [ ] เปลี่ยน Page Title และ Metadata
- [ ] สร้างหรือปรับ Logo
- [ ] กำหนด Design Tokens
- [ ] เพิ่ม Light/Dark/System Mode
- [ ] ปรับ Typography
- [ ] ปรับ Global Styles

### Phase 3 — Layout Components

- [ ] Sidebar
- [ ] Topbar
- [ ] App Shell
- [ ] Mobile Navigation
- [ ] Reusable UI Components
- [ ] Active Menu States

### Phase 4 — Page Redesign

- [ ] Login
- [ ] Dashboard
- [ ] Product Management
- [ ] User Management
- [ ] Profile / Existing Supporting Pages

### Phase 5 — Integration

- [ ] เชื่อม Authentication เดิม
- [ ] เชื่อม Database Queries เดิม
- [ ] เชื่อม CRUD เดิม
- [ ] เชื่อม RBAC เดิม
- [ ] ตรวจสอบ Permissions
- [ ] ตรวจสอบ Error Handling

### Phase 6 — Testing & Validation

- [ ] TypeScript Build
- [ ] Login ด้วย Email/Password
- [ ] Login ด้วย GitHub
- [ ] Logout
- [ ] ตรวจสอบ ADMIN
- [ ] ตรวจสอบ STAFF
- [ ] ตรวจสอบ USER
- [ ] Product CRUD
- [ ] User Management
- [ ] Light Mode
- [ ] Dark Mode
- [ ] System Theme
- [ ] Desktop Responsive
- [ ] Mobile Responsive
- [ ] Loading / Empty / Error States

---

## 14. Verification Commands

ใช้คำสั่งตาม Scripts ที่มีจริงใน `package.json`

ตัวอย่างคำสั่ง:

```bash
npm install
npx prisma generate
npm run build
npm run dev
```

หากมี Lint หรือ Test Scripts ให้รันเพิ่มเติมตามที่โปรเจกต์รองรับ

**Do not run destructive migrations, reset or seed against an existing database without checking their effects first.**

หาก Build ไม่ผ่าน ให้แก้ข้อผิดพลาดที่เกี่ยวข้องอย่างถูกต้องและรายงานข้อผิดพลาดที่ยังคงเหลือ

---

## 15. Acceptance Criteria

งานถือว่าเสร็จสมบูรณ์เมื่อ:

1. เว็บใช้ชื่อ Prodexa อย่างสม่ำเสมอ
2. หน้าตามี Design System เดียวกัน
3. รองรับ Light/Dark/System Mode
4. Login ใช้งานได้เหมือนเดิม
5. Dashboard ใช้ข้อมูลจริง
6. Product Management ใช้งานได้เหมือนเดิม
7. User Management ใช้งานได้เหมือนเดิม
8. RBAC ไม่เปลี่ยนแปลงโดยไม่ได้รับอนุญาต
9. ไม่มีฟีเจอร์เดิมสูญหาย
10. Responsive ใช้งานได้จริง
11. ไม่มี TypeScript Error ที่ทำให้ Build ล้มเหลว
12. ไม่มีข้อมูลจำลองค้างอยู่ในหน้าระบบ Production
13. ฐานข้อมูลเดิมยังทำงานได้ตามปกติ

---

## 16. Final Instructions for Claude

You are working on an existing Next.js project named Product Hub.

Your task is to redesign and rebrand the application into **Prodexa**, a professional modern SaaS Product Management Dashboard.

**Implement actual code changes, not just mockups or recommendations.**

Follow these steps:

1. Inspect the existing codebase thoroughly.
2. Identify actual pages, components, routes, database models, authentication and RBAC rules.
3. Preserve the existing working backend functionality.
4. Implement the Prodexa brand and design system.
5. Build a consistent Light/Dark/System Theme.
6. Redesign Login, Dashboard, Product Management and User Management.
7. Reuse existing APIs, Server Actions and database queries.
8. Keep all existing permission checks secure.
9. Run available TypeScript checks, tests and production build.
10. Resolve any errors introduced by your changes.

Do not assume that the proposed components or routes already exist.

Do not modify the database schema unless a genuine functional requirement makes it necessary, and explain any proposed changes before performing destructive operations.

### Expected Deliverables

- Updated application source code
- Prodexa branding
- Responsive UI
- Working theme switching
- Fully integrated existing features
- Successful production build, or a precise report of remaining issues
- Summary of files changed
- Summary of tests executed and results
- Documentation of any new dependencies

### Final Objective

**Transform Product Hub into Prodexa while keeping the original application functionality fully intact.**

The result should feel like a polished, production-quality SaaS dashboard rather than a basic CRUD application.