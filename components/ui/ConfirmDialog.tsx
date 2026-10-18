"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/Button";

/**
 * กล่องยืนยันการกระทำที่อันตราย (เช่นลบ) ใช้ <dialog> ของเบราว์เซอร์ จึงกักโฟกัสและปิดด้วย Esc ได้ถูกต้อง
 * ระหว่าง pending จะล็อกปุ่มและไม่ยอมให้ปิด
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "ยกเลิก",
  pending = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  // ซิงก์สถานะ open ของ React กับ dialog จริง: open -> showModal(), ปิด -> close()
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={descId}
      onCancel={(e) => {
        // Esc: ให้ React เป็นผู้ควบคุมสถานะ ไม่ให้เบราว์เซอร์ปิดเอง
        e.preventDefault();
        if (!pending) onCancel();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !pending) onCancel();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md overflow-visible rounded-2xl border border-line bg-elevated p-0 text-fg shadow-pop backdrop:bg-slate-950/55 backdrop:backdrop-blur-[2px]"
    >
      <div className="p-6">
        <div className="flex gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger-text">
            <Icon name="alertTriangle" size={20} />
          </span>
          <div className="min-w-0">
            <h2 id={titleId} className="text-base font-semibold">
              {title}
            </h2>
            <div id={descId} className="mt-1.5 text-sm break-words text-muted">
              {description}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel} disabled={pending}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={pending} aria-busy={pending}>
            {pending ? "กำลังดำเนินการ..." : confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
