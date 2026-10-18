import type { IconName } from "@/components/icons";
import type { Permission } from "@/app/lib/rbac";

export type NavDefinition = {
  href: string;
  label: string;
  icon: IconName;
  match: "exact" | "prefix";
  /** ไม่ระบุ = ผู้ใช้ที่ล็อกอินทุกคนเห็น */
  permission?: Permission;
};

/** เมนูหลัก — มีเฉพาะหน้าที่มีอยู่จริง; การแสดงตามสิทธิ์ใช้ can() ฝั่ง server ใน AppShell */
export const NAV: NavDefinition[] = [
  { href: "/", label: "Dashboard", icon: "dashboard", match: "exact" },
  { href: "/products", label: "Products", icon: "package", match: "prefix", permission: "product:read" },
  { href: "/admin", label: "Users", icon: "users", match: "prefix", permission: "user:manage" },
];

export type NavItem = Pick<NavDefinition, "href" | "label" | "icon" | "match">;

/**
 * ตรวจว่าเมนูนี้คือหน้าปัจจุบันหรือไม่ (ใช้ไฮไลต์เมนู)
 * - match "exact": ต้องตรง path เป๊ะ (เช่น Dashboard "/")
 * - match "prefix": ตรงหรืออยู่ใต้ path นั้น (เช่น /products/new ยังนับเป็น Products)
 *
 * @param item เมนูที่ต้องการตรวจ
 * @param pathname path ปัจจุบัน
 */
export function isActive(item: NavItem, pathname: string): boolean {
  return item.match === "exact"
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export type Crumb = { label: string; href?: string };

/**
 * สร้างรายการ Breadcrumb ของหน้าปัจจุบันจาก pathname
 * (ส่วนที่มีลิงก์ย้อนกลับได้จะมี href ส่วนหน้าปัจจุบันไม่มี)
 *
 * @param pathname path ปัจจุบัน
 */
export function breadcrumbsFor(pathname: string): Crumb[] {
  if (pathname === "/") return [{ label: "Dashboard" }];
  if (pathname === "/products") return [{ label: "Products" }];
  if (pathname === "/products/new") {
    return [{ label: "Products", href: "/products" }, { label: "เพิ่มสินค้า" }];
  }
  if (/^\/products\/[^/]+\/edit$/.test(pathname)) {
    return [{ label: "Products", href: "/products" }, { label: "แก้ไขสินค้า" }];
  }
  if (pathname === "/admin") return [{ label: "Users" }];
  if (pathname === "/unauthorized") return [{ label: "ไม่มีสิทธิ์เข้าถึง" }];
  return [{ label: "StockFlow" }];
}
