"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Ref } from "react";
import { Icon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown } from "@/components/ui/Dropdown";
import { RoleBadge } from "@/components/users/RoleBadge";
import { breadcrumbsFor } from "./nav";
import type { ShellUser } from "./ShellFrame";

/**
 * แสดงเส้นทางหน้าปัจจุบัน (Breadcrumb) จาก pathname รายการสุดท้ายคือหน้าปัจจุบัน ส่วนก่อนหน้าคลิกย้อนกลับได้
 */
function Breadcrumb() {
  const crumbs = breadcrumbsFor(usePathname());
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex items-center gap-1.5 text-sm">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.label} className="flex min-w-0 items-center gap-1.5">
              {i > 0 && <Icon name="chevronRight" size={14} className="shrink-0 text-muted" />}
              {last || !c.href ? (
                <span aria-current={last ? "page" : undefined} className="truncate font-semibold text-fg">
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className="truncate text-muted transition-colors duration-150 hover:text-fg">
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * เมนูผู้ใช้มุมขวาบน: แสดงอวาตาร์ ชื่อ อีเมล บทบาท และปุ่มออกจากระบบ
 */
function UserMenu({ user, logoutAction }: { user: ShellUser; logoutAction: () => Promise<void> }) {
  return (
    <Dropdown
      label="เมนูผู้ใช้"
      triggerClassName="gap-2 rounded-lg p-1 pr-2 hover:bg-hover"
      trigger={
        <>
          <Avatar name={user.name} email={user.email} size={32} />
          <Icon name="chevronDown" size={14} className="hidden text-muted sm:block" />
        </>
      }
    >
      {() => (
        <div className="w-64 max-w-[calc(100vw-2rem)]">
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <Avatar name={user.name} email={user.email} size={40} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name ?? user.email}</p>
              {user.name && <p className="truncate text-xs text-muted">{user.email}</p>}
              <div className="mt-1">
                <RoleBadge role={user.role} />
              </div>
            </div>
          </div>
          <form action={logoutAction} className="p-1">
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-fg transition-colors duration-150 hover:bg-danger-soft hover:text-danger-text"
            >
              <Icon name="logout" size={16} />
              ออกจากระบบ
            </button>
          </form>
        </div>
      )}
    </Dropdown>
  );
}

/**
 * แถบด้านบน: ปุ่มเปิดเมนู (มือถือ), ปุ่มย่อ/ขยาย Sidebar (จอใหญ่), Breadcrumb, ปุ่มเปลี่ยนธีม และเมนูผู้ใช้
 */
export function AppTopbar({
  user,
  collapsed,
  onToggleCollapsed,
  onOpenDrawer,
  menuButtonRef,
  logoutAction,
}: {
  user: ShellUser;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onOpenDrawer: () => void;
  menuButtonRef: Ref<HTMLButtonElement>;
  logoutAction: () => Promise<void>;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-line bg-surface/90 px-3 backdrop-blur sm:px-6">
      <button
        ref={menuButtonRef}
        type="button"
        onClick={onOpenDrawer}
        aria-label="เปิดเมนู"
        className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors duration-150 hover:bg-hover hover:text-fg md:hidden"
      >
        <Icon name="menu" size={20} />
      </button>
      <button
        type="button"
        onClick={onToggleCollapsed}
        aria-label={collapsed ? "ขยายแถบเมนู" : "ย่อแถบเมนู"}
        aria-pressed={collapsed}
        className="hidden size-9 items-center justify-center rounded-lg text-muted transition-colors duration-150 hover:bg-hover hover:text-fg lg:flex"
      >
        <Icon name="panelLeft" size={20} />
      </button>

      <div className="min-w-0 flex-1 pl-1">
        <Breadcrumb />
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <UserMenu user={user} logoutAction={logoutAction} />
      </div>
    </header>
  );
}
