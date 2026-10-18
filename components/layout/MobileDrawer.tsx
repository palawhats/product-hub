"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/icons";
import { SidebarContent } from "./AppSidebar";
import type { NavItem } from "./nav";
import type { ShellUser } from "./ShellFrame";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * เมนูแบบ Drawer สำหรับมือถือ: กด Esc หรือคลิกฉากหลังเพื่อปิด, ล็อกการเลื่อนหน้าด้านหลัง,
 * วนโฟกัสไว้ในเมนู (Tab/Shift+Tab) และย้ายโฟกัสมาที่ปุ่มปิดเมื่อเปิด
 */
export function MobileDrawer({
  user,
  items,
  logoutAction,
  onClose,
}: {
  user: ShellUser;
  items: NavItem[];
  logoutAction: () => Promise<void>;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // ตอนเปิด Drawer: โฟกัสปุ่มปิด, ล็อกการเลื่อนของ body และดักคีย์ Esc / Tab ตอนปิดจะคืนค่าเดิมทั้งหมด
  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Esc = ปิดเมนู, Tab = วนโฟกัสไม่ให้หลุดออกนอกเมนู
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        aria-label="ปิดเมนู"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-slate-950/55 backdrop-blur-[2px]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="เมนูหลัก"
        className="absolute inset-y-0 left-0 w-72 max-w-[85%] animate-drawer-in border-r border-line bg-surface shadow-pop"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="ปิดเมนู"
          className="absolute top-3.5 right-3 z-10 flex size-9 items-center justify-center rounded-lg text-muted transition-colors duration-150 hover:bg-hover hover:text-fg"
        >
          <Icon name="close" size={20} />
        </button>
        <SidebarContent
          user={user}
          items={items}
          forceLabels
          onNavigate={onClose}
          logoutAction={logoutAction}
        />
      </div>
    </div>
  );
}
