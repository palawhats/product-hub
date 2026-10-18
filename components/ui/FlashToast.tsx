"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { pushToast, type ToastTone } from "./toast-store";

type Flash = { tone: ToastTone; message: string };

const PRODUCT_FLASH: Record<string, Flash> = {
  created: { tone: "success", message: "เพิ่มสินค้าเรียบร้อยแล้ว" },
  updated: { tone: "success", message: "บันทึกการแก้ไขเรียบร้อยแล้ว" },
  deleted: { tone: "success", message: "ลบสินค้าเรียบร้อยแล้ว" },
};

const USER_FLASH: Record<string, Flash> = {
  updated: { tone: "success", message: "เปลี่ยนสิทธิ์เรียบร้อยแล้ว" },
  error: { tone: "error", message: "ไม่สามารถเปลี่ยนสิทธิ์ได้ (ไม่สามารถเปลี่ยนสิทธิ์ของตัวเอง)" },
};

/**
 * แปลงพารามิเตอร์แจ้งผลเดิมของระบบ (?saved=… ใน /products, ?updated / ?error ใน /admin)
 * เป็น Toast แล้วลบพารามิเตอร์ออกจาก URL เพื่อไม่ให้แจ้งซ้ำเมื่อรีเฟรช
 */
export function FlashToast() {
  const pathname = usePathname();
  const params = useSearchParams();

  const saved = params.get("saved");
  const updated = params.get("updated");
  const error = params.get("error");

  // เมื่อพบพารามิเตอร์แจ้งผลใน URL: แสดง Toast แล้วลบพารามิเตอร์นั้นออกจากแถบที่อยู่
  useEffect(() => {
    let flash: Flash | undefined;
    const used: string[] = [];

    if (pathname === "/products" && saved) {
      flash = PRODUCT_FLASH[saved];
      used.push("saved");
    } else if (pathname === "/admin") {
      if (updated) {
        flash = USER_FLASH.updated;
        used.push("updated");
      }
      if (error) {
        flash = USER_FLASH.error;
        used.push("error");
      }
    }
    if (used.length === 0) return;

    if (flash) pushToast(flash.tone, flash.message);
    const url = new URL(window.location.href);
    used.forEach((k) => url.searchParams.delete(k));
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [pathname, saved, updated, error]);

  return null;
}
