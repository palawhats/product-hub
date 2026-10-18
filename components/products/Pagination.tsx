import { Icon } from "@/components/icons";
import { buttonStyles } from "@/components/ui/Button";
import { cn } from "@/components/lib/cn";
import { formatNumber } from "@/app/lib/utils";
import Link from "next/link";

/**
 * คำนวณเลขหน้าที่จะแสดง: หน้าแรก หน้าสุดท้าย และหน้าปัจจุบันกับหน้าข้างเคียง
 * ช่วงที่ขาดจะใส่ "gap" (แสดงเป็น …)
 *
 * @returns ลำดับเลขหน้าและ "gap"
 */
function pageWindow(page: number, totalPages: number): Array<number | "gap"> {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  const out: Array<number | "gap"> = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

/**
 * แถบแบ่งหน้าด้วยลิงก์ธรรมดา (ใช้ได้โดยไม่ต้องมี JS) พร้อมข้อความ "แสดง x–y จาก N รายการ"
 * ไม่แสดงเมื่อมีหน้าเดียว
 *
 * @param hrefFor ฟังก์ชันสร้าง URL ของเลขหน้าที่กำหนด
 */
export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const nav = buttonStyles({ variant: "secondary", size: "sm", className: "size-10 px-0" });

  return (
    <nav aria-label="แบ่งหน้า" className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
      <p className="tabular text-muted">
        แสดง {formatNumber(from)}–{formatNumber(to)} จาก {formatNumber(total)} รายการ
      </p>
      <ul className="flex items-center gap-1">
        <li>
          {page > 1 ? (
            <Link href={hrefFor(page - 1)} className={nav} aria-label="หน้าก่อนหน้า">
              <Icon name="chevronLeft" size={18} />
            </Link>
          ) : (
            <span className={cn(nav, "opacity-50")} aria-disabled="true">
              <Icon name="chevronLeft" size={18} />
            </span>
          )}
        </li>
        {pageWindow(page, totalPages).map((n, i) =>
          n === "gap" ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-muted">
              …
            </li>
          ) : (
            <li key={n}>
              <Link
                href={hrefFor(n)}
                aria-current={n === page ? "page" : undefined}
                aria-label={`หน้า ${n}`}
                className={cn(
                  buttonStyles({ variant: n === page ? "primary" : "secondary", size: "sm" }),
                  "tabular min-w-8 px-2",
                )}
              >
                {n}
              </Link>
            </li>
          ),
        )}
        <li>
          {page < totalPages ? (
            <Link href={hrefFor(page + 1)} className={nav} aria-label="หน้าถัดไป">
              <Icon name="chevronRight" size={16} />
            </Link>
          ) : (
            <span className={cn(nav, "opacity-50")} aria-disabled="true">
              <Icon name="chevronRight" size={16} />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
