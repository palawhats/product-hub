"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Field";

type Option = { value: string; label: string };

/**
 * ค้นหา/กรอง/เรียง: ใช้ฟอร์ม GET เดิม (ใช้งานได้แม้ไม่มี JavaScript)
 * เมื่อมี JS จะค้นอัตโนมัติแบบ debounce เมื่อพิมพ์ และทันทีเมื่อเปลี่ยนตัวเลือก
 */
export function FilterBar({
  values,
  categories,
  sortOptions,
  lowStockThreshold,
  filtered,
}: {
  values: { q: string; category: string; status: string; stock: string; sort: string };
  categories: string[];
  sortOptions: Option[];
  lowStockThreshold: number;
  filtered: boolean;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [pending, startTransition] = useTransition();

  // เมื่อคอมโพเนนต์ถูกถอด: ยกเลิกตัวจับเวลา debounce ที่ค้างอยู่
  useEffect(() => () => window.clearTimeout(timer.current), []);

  /**
   * อ่านค่าทั้งหมดในฟอร์มแล้วสร้าง URL ใหม่ของ /products (ข้ามค่าว่างและค่าเริ่มต้น) จากนั้นเปลี่ยนหน้าด้วย router.replace
   * หน้าจะกลับไปหน้าที่ 1 เสมอเมื่อเปลี่ยนเงื่อนไข
   */
  function navigate() {
    const form = formRef.current;
    if (!form) return;
    const params = new URLSearchParams();
    for (const [key, raw] of new FormData(form)) {
      const v = String(raw).trim();
      if (!v) continue;
      if ((key === "status" || key === "stock") && v === "all") continue;
      if (key === "sort" && v === "newest") continue;
      params.set(key, v);
    }
    const qs = params.toString();
    startTransition(() => router.replace(qs ? `/products?${qs}` : "/products"));
  }

  /**
   * ล้างตัวกรองทุกช่องกลับเป็นค่าเริ่มต้น แล้วกลับไป /products (ต้องตั้งค่าช่องเองเพราะฟอร์มเป็นแบบ uncontrolled)
   */
  function clearAll() {
    const els = formRef.current?.elements;
    if (!els) return;
    /**
     * ตั้งค่าให้ช่อง input/select ตามชื่อ
     */
    const set = (name: string, v: string) => {
      const el = els.namedItem(name);
      if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) el.value = v;
    };
    set("q", "");
    set("category", "");
    set("status", "all");
    set("stock", "all");
    set("sort", "newest");
    window.clearTimeout(timer.current);
    startTransition(() => router.replace("/products"));
  }

  return (
    <form
      ref={formRef}
      action="/products"
      role="search"
      aria-label="ค้นหาและกรองสินค้า"
      aria-busy={pending}
      onSubmit={(e) => {
        e.preventDefault();
        window.clearTimeout(timer.current);
        navigate();
      }}
      className="mb-5 rounded-2xl border border-line bg-surface p-4 shadow-card"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <div className="relative sm:col-span-2 lg:col-span-2">
          <Icon name="search" size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
          <input
            name="q"
            type="search"
            aria-label="ค้นหาสินค้า"
            defaultValue={values.q}
            placeholder="ค้นหาชื่อ / รหัส / รายละเอียด"
            autoComplete="off"
            onChange={() => {
              window.clearTimeout(timer.current);
              timer.current = window.setTimeout(navigate, 400);
            }}
            className={`${inputClass} pl-9`}
          />
        </div>
        <select name="category" aria-label="หมวดหมู่" defaultValue={values.category} onChange={navigate} className={inputClass}>
          <option value="">ทุกหมวดหมู่</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select name="status" aria-label="สถานะ" defaultValue={values.status} onChange={navigate} className={inputClass}>
          <option value="all">ทุกสถานะ</option>
          <option value="active">เปิดขาย</option>
          <option value="inactive">ปิดขาย</option>
        </select>
        <select name="stock" aria-label="สต็อก" defaultValue={values.stock} onChange={navigate} className={inputClass}>
          <option value="all">สต็อกทั้งหมด</option>
          <option value="low">ใกล้หมด (≤ {lowStockThreshold})</option>
          <option value="out">หมดสต็อก</option>
        </select>
        <select name="sort" aria-label="เรียงลำดับ" defaultValue={values.sort} onChange={navigate} className={inputClass}>
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button type="submit">ค้นหา</Button>
        {filtered && (
          <Button variant="secondary" onClick={clearAll}>
            ล้างตัวกรอง
          </Button>
        )}
        <span role="status" className="text-xs text-muted">
          {pending ? "กำลังค้นหา..." : ""}
        </span>
      </div>
    </form>
  );
}
