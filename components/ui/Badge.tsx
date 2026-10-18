import type { HTMLAttributes } from "react";
import { cn } from "@/components/lib/cn";

export type BadgeTone = "neutral" | "primary" | "teal" | "success" | "warning" | "danger";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-slate-soft text-slate-text",
  primary: "bg-primary-soft text-primary-text",
  teal: "bg-teal-soft text-teal-text",
  success: "bg-success-soft text-success-text",
  warning: "bg-warning-soft text-warning-text",
  danger: "bg-danger-soft text-danger-text",
};

/**
 * ป้ายสถานะขนาดเล็ก เลือกโทนสีได้ (neutral, primary, teal, success, warning, danger)
 */
export function Badge({
  tone = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
