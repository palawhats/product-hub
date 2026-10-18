import type { HTMLAttributes } from "react";
import { cn } from "@/components/lib/cn";

/**
 * กรอบการ์ดมาตรฐาน (พื้นผิว ขอบ เงา และมุมโค้ง) รับ className เพิ่มได้
 */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-2xl border border-line bg-surface shadow-card", className)} {...props} />
  );
}

/**
 * ส่วนหัวของการ์ด: ชื่อ คำอธิบายรอง และพื้นที่ใส่ปุ่ม/ลิงก์ด้านขวา
 */
export function CardHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-fg">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
