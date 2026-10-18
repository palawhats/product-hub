import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";
import { cn } from "@/components/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-fg hover:bg-primary-hover",
  secondary: "border border-line bg-surface text-fg hover:bg-hover",
  danger: "bg-danger-solid text-danger-solid-fg hover:bg-danger-solid-hover",
  ghost: "text-muted hover:bg-hover hover:text-fg",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
};

/**
 * สร้างชื่อคลาสของปุ่มตามรูปแบบ (primary/secondary/danger/ghost) และขนาด (sm/md)
 * ใช้ร่วมกับ <Button> และ <ButtonLink> หรือกับ element อื่นที่ต้องการหน้าตาปุ่ม
 */
export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/**
 * ปุ่มมาตรฐานของระบบ (ค่าเริ่มต้น type="button" เพื่อไม่ส่งฟอร์มโดยไม่ตั้งใจ)
 */
export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/**
 * ลิงก์ (next/link) ที่หน้าตาเหมือนปุ่ม ใช้สำหรับการเปลี่ยนหน้า
 */
export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonStyles({ variant, size, className })} {...props} />;
}
