import { cn } from "@/components/lib/cn";

/**
 * สัญลักษณ์โลโก้ StockFlow (SVG) ปรับขนาดได้ ใช้ได้ทั้งโหมดสว่างและมืด
 */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect width="32" height="32" rx="8" fill="#4F46E5" />
      <rect x="7" y="8" width="14" height="4.5" rx="2.25" fill="#fff" fillOpacity="0.95" />
      <rect x="11" y="13.75" width="14" height="4.5" rx="2.25" fill="#fff" fillOpacity="0.65" />
      <rect x="7" y="19.5" width="14" height="4.5" rx="2.25" fill="#fff" fillOpacity="0.95" />
    </svg>
  );
}

/**
 * โลโก้เต็ม: สัญลักษณ์ + ชื่อ StockFlow (ซ่อนชื่อได้ด้วย showName=false)
 */
export function Logo({
  size = 32,
  showName = true,
  className,
  nameClassName,
}: {
  size?: number;
  showName?: boolean;
  className?: string;
  nameClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} className="shrink-0" />
      {showName && (
        <span className={cn("text-lg font-bold tracking-tight text-fg", nameClassName)}>StockFlow</span>
      )}
    </span>
  );
}
