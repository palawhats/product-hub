import { cn } from "@/components/lib/cn";

/**
 * คืนตัวอักษรแรก (พิมพ์ใหญ่) ของชื่อ ถ้าไม่มีชื่อใช้อีเมล ถ้าไม่มีทั้งคู่คืน "?" (รองรับอักษรไทย)
 */
export function initialOf(name: string | null | undefined, email?: string): string {
  const source = (name?.trim() || email?.trim() || "?").normalize("NFC");
  return (Array.from(source)[0] ?? "?").toUpperCase();
}

/**
 * วงกลมอวาตาร์แสดงตัวอักษรแรกของชื่อ/อีเมล
 *
 * @param size ขนาดเป็นพิกเซล (ขนาดตัวอักษรคำนวณตามสัดส่วน)
 */
export function Avatar({
  name,
  email,
  size = 36,
  className,
}: {
  name: string | null | undefined;
  email?: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-primary-soft font-semibold text-primary-text",
        className,
      )}
    >
      {initialOf(name, email)}
    </span>
  );
}
