import { useId, type ReactNode } from "react";
import { cn } from "@/components/lib/cn";

export const controlClass =
  "block w-full rounded-lg border border-line bg-surface px-3 text-sm text-fg placeholder:text-muted transition-colors duration-150 focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-danger aria-invalid:focus:ring-danger/25";

/** ความสูงมาตรฐานของ input/select (ใหญ่พอสำหรับหน้าจอสัมผัส) */
export const inputClass = cn(controlClass, "h-10");
export const textareaClass = cn(controlClass, "py-2 leading-relaxed");

export type FieldControlProps = {
  id: string;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
};

/**
 * ครอบช่องกรอก: ป้ายชื่อ ข้อความช่วย และข้อความผิดพลาด โดยผูกกับช่องกรอกด้วย id/aria
 * (ส่ง id, aria-invalid, aria-describedby ให้ช่องกรอกผ่าน render-prop เพื่อการเข้าถึงที่ถูกต้อง)
 */
export function Field({
  label,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: (control: FieldControlProps) => ReactNode;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-fg">
        {label}
      </label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-danger-text">
          {error}
        </p>
      )}
    </div>
  );
}
