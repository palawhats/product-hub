"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/components/lib/cn";

/**
 * เมนูแบบเปิด/ปิด (popover): ปิดเมื่อกด Esc หรือคลิกนอกกรอบ และคืนโฟกัสให้ปุ่มเปิด
 */
export function Dropdown({
  label,
  trigger,
  children,
  align = "right",
  className,
  triggerClassName,
}: {
  label: string;
  trigger: ReactNode;
  children: (close: () => void) => ReactNode;
  align?: "left" | "right";
  className?: string;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  // เมื่อเมนูเปิดอยู่: ฟังการคลิกนอกกรอบและคีย์ Esc เพื่อปิดเมนู (เลิกฟังเมื่อเมนูปิด)
  useEffect(() => {
    if (!open) return;
    // คลิก/แตะนอกเมนู -> ปิดเมนู
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    // กด Esc -> ปิดเมนูและคืนโฟกัสให้ปุ่ม
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center transition-colors duration-150",
          triggerClassName,
        )}
      >
        {trigger}
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          className={cn(
            "absolute top-full z-50 mt-2 animate-fade-in rounded-xl border border-line bg-elevated text-fg shadow-pop",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}
