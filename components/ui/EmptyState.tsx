import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/components/lib/cn";

/**
 * หน้าแสดงสถานะว่าง/ไม่พบข้อมูล: ไอคอน หัวข้อ คำอธิบาย และปุ่มดำเนินการ (ถ้ามี)
 */
export function EmptyState({
  icon = "package",
  title,
  description,
  action,
  className,
}: {
  icon?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-14 text-center", className)}>
      <span className="flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary-text">
        <Icon name={icon} size={22} />
      </span>
      <h2 className="mt-4 text-base font-semibold text-fg">{title}</h2>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
