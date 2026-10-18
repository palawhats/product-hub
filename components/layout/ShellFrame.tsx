"use client";

import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useLocalValue, writeLocal } from "@/components/lib/local-store";
import { cn } from "@/components/lib/cn";
import { SidebarContent } from "./AppSidebar";
import { AppTopbar } from "./AppTopbar";
import { MobileDrawer } from "./MobileDrawer";
import type { NavItem } from "./nav";

export type ShellUser = { name: string | null; email: string; role: string };

const COLLAPSE_KEY = "prodexa-sidebar";
const AUTH_PATHS = ["/login", "/signup"];

/**
 * โครงหน้าหลักหลังล็อกอิน (client component): Sidebar (ย่อ/ขยายได้ จำค่าไว้), Topbar, พื้นที่เนื้อหา
 * และ Drawer เมนูบนมือถือ — หน้าสาธารณะและหน้า login/signup จะแสดงเนื้อหาเปล่าไม่มี Sidebar/Topbar
 */
export function ShellFrame({
  user,
  items,
  logoutAction,
  children,
}: {
  user: ShellUser | null;
  items: NavItem[];
  logoutAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const collapsed = useLocalValue(COLLAPSE_KEY) === "collapsed";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  /**
   * ปิดเมนู Drawer บนมือถือ แล้วคืนโฟกัสให้ปุ่มเปิดเมนู (เพื่อการใช้งานด้วยคีย์บอร์ด)
   */
  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  // หน้าสาธารณะ (ยังไม่ล็อกอิน) และหน้า login/signup ไม่มี Sidebar/Topbar
  if (!user || AUTH_PATHS.includes(pathname)) {
    return (
      <main id="main-content" tabIndex={-1} className="min-h-dvh outline-none">
        {children}
      </main>
    );
  }

  return (
    <div className="flex min-h-dvh">
      <aside
        aria-label="แถบเมนูข้าง"
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 self-start border-r border-line bg-surface transition-[width] duration-200 md:block",
          collapsed ? "w-[76px]" : "w-[76px] lg:w-64",
        )}
      >
        <SidebarContent user={user} items={items} collapsed={collapsed} logoutAction={logoutAction} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar
          user={user}
          collapsed={collapsed}
          onToggleCollapsed={() => writeLocal(COLLAPSE_KEY, collapsed ? "expanded" : "collapsed")}
          onOpenDrawer={() => setDrawerOpen(true)}
          menuButtonRef={menuButtonRef}
          logoutAction={logoutAction}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 outline-none sm:px-6 lg:px-8 lg:py-8"
        >
          {children}
        </main>
      </div>

      {drawerOpen && (
        <MobileDrawer user={user} items={items} logoutAction={logoutAction} onClose={closeDrawer} />
      )}
    </div>
  );
}
