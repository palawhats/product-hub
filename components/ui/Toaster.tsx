"use client";

import { useSyncExternalStore } from "react";
import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/components/lib/cn";
import { dismissToast, getServerToasts, getToasts, subscribeToasts, type ToastTone } from "./toast-store";

const STYLE: Record<ToastTone, { icon: IconName; accent: string }> = {
  success: { icon: "checkCircle", accent: "text-success-text" },
  error: { icon: "alertCircle", accent: "text-danger-text" },
  info: { icon: "alertCircle", accent: "text-primary-text" },
};

/**
 * พื้นที่แสดง Toast ทั้งหมดมุมล่างขวา (อ่านด้วย aria-live) มีปุ่มปิดแต่ละอัน
 */
export function Toaster() {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts, getServerToasts);

  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.tone === "error" ? "alert" : "status"}
          className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-xl border border-line bg-elevated px-4 py-3 text-sm text-fg shadow-pop"
        >
          <Icon name={STYLE[t.tone].icon} size={18} className={cn("mt-0.5 shrink-0", STYLE[t.tone].accent)} />
          <p className="min-w-0 flex-1 break-words">{t.message}</p>
          <button
            type="button"
            onClick={() => dismissToast(t.id)}
            aria-label="ปิดการแจ้งเตือน"
            className="-m-1 rounded-md p-1 text-muted transition-colors duration-150 hover:bg-hover hover:text-fg"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
