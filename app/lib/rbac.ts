import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { auth } from "@/app/auth";

export type Role = "ADMIN" | "STAFF" | "USER";
export const ROLES: Role[] = ["ADMIN", "STAFF", "USER"];

export type Permission =
  | "product:read"
  | "product:write"
  | "product:delete"
  | "user:manage";

/**
 * ตารางสิทธิ์ของแต่ละบทบาท (RBAC)
 * ADMIN ทำได้ทุกอย่าง, STAFF อ่าน/เพิ่ม/แก้สินค้า, USER อ่านสินค้าได้อย่างเดียว
 */
const PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: ["product:read", "product:write", "product:delete", "user:manage"],
  STAFF: ["product:read", "product:write"],
  USER: ["product:read"],
};

/**
 * ตรวจว่าค่าที่ได้รับเป็นบทบาทที่ระบบรู้จักหรือไม่ (ADMIN | STAFF | USER)
 * ใช้เป็น type guard เพื่อให้ TypeScript รู้ว่าค่านั้นเป็นชนิด Role
 *
 * @param v ค่าอะไรก็ได้ที่ต้องการตรวจ
 */
export const isRole = (v: unknown): v is Role =>
  typeof v === "string" && (ROLES as string[]).includes(v);

/**
 * ตรวจว่าบทบาทนี้มีสิทธิ์ทำสิ่งที่ระบุหรือไม่
 *
 * @param role บทบาทของผู้ใช้ (ไม่รู้จัก/ว่าง = ไม่มีสิทธิ์)
 * @param permission สิทธิ์ที่ต้องการตรวจ เช่น "product:write"
 * @returns true ถ้ามีสิทธิ์
 */
export const can = (role: string | null | undefined, permission: Permission) =>
  isRole(role) && PERMISSIONS[role].includes(permission);

export type CurrentUser = {
  id: string;
  name: string | null | undefined;
  email: string;
  role: Role;
};

/**
 * อ่านผู้ใช้ที่ล็อกอินอยู่จาก session
 *
 * @returns ข้อมูลผู้ใช้ (id, name, email, role) หรือ null ถ้ายังไม่ล็อกอิน/บทบาทไม่ถูกต้อง/บัญชีถูกลบแล้ว
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  const u = session?.user;
  if (!u?.id || !isRole(u.role)) return null;
  return { id: u.id, name: u.name, email: u.email ?? "", role: u.role };
}

/**
 * ตัวป้องกันสำหรับ Server Component และ Server Action
 * - ยังไม่ล็อกอิน -> redirect ไป /login พร้อม callbackUrl เพื่อกลับมาหน้าเดิมหลังล็อกอิน
 * - ล็อกอินแล้วแต่ไม่มีสิทธิ์ -> redirect ไป /unauthorized
 *
 * @param permission สิทธิ์ที่หน้านี้/การกระทำนี้ต้องมี
 * @param callbackUrl หน้าที่จะกลับมาหลังล็อกอิน (ค่าเริ่มต้น /products)
 * @returns ผู้ใช้ปัจจุบัน (เมื่อผ่านการตรวจสิทธิ์เท่านั้น)
 */
export async function requirePermission(
  permission: Permission,
  callbackUrl = "/products",
): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  if (!can(user.role, permission)) redirect("/unauthorized");
  return user;
}

/**
 * ตัวป้องกันสำหรับ Route Handler (REST API) — คืน JSON แทนการ redirect
 * - ยังไม่ล็อกอิน -> 401 { error: "กรุณาเข้าสู่ระบบ" }
 * - ไม่มีสิทธิ์ -> 403 { error: "ไม่มีสิทธิ์ดำเนินการ" }
 *
 * @param permission สิทธิ์ที่ API นี้ต้องการ
 * @returns { ok: true, user } เมื่อผ่าน หรือ { ok: false, response } ให้ API ส่งคืนทันที
 */
export async function apiGuard(
  permission: Permission,
): Promise<{ ok: true; user: CurrentUser } | { ok: false; response: NextResponse }> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 }),
    };
  }
  if (!can(user.role, permission)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "ไม่มีสิทธิ์ดำเนินการ" }, { status: 403 }),
    };
  }
  return { ok: true, user };
}
