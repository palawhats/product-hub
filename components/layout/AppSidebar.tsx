"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";
import { Logo } from "@/components/brand/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { RoleBadge } from "@/components/users/RoleBadge";
import { cn } from "@/components/lib/cn";
import { isActive, type NavItem } from "./nav";
import type { ShellUser } from "./ShellFrame";

/**
 * เนื้อหาของ Sidebar ใช้ร่วมกันทั้งแบบประจำที่ (Desktop/Tablet) และ Drawer (Mobile)
 * - collapsed: ย่อเป็นแถบไอคอน (Desktop)
 * - forceLabels: แสดงป้ายข้อความเสมอ (Drawer)
 * บน Tablet (md ถึง lg) แสดงเป็นแถบไอคอนโดยอัตโนมัติ
 */
export function SidebarContent({
  user,
  items,
  collapsed = false,
  forceLabels = false,
  onNavigate,
  logoutAction,
}: {
  user: ShellUser;
  items: NavItem[];
  collapsed?: boolean;
  forceLabels?: boolean;
  onNavigate?: () => void;
  logoutAction: () => Promise<void>;
}) {
  const pathname = usePathname();

  const labelClass = forceLabels ? "" : collapsed ? "hidden" : "hidden lg:inline";
  const alignClass = forceLabels ? "" : collapsed ? "justify-center" : "max-lg:justify-center";

  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-16 shrink-0 items-center px-4", alignClass)}>
        <Link
          href="/"
          onClick={onNavigate}
          aria-label="StockFlow — กลับไปหน้า Dashboard"
          className="rounded-lg"
        >
          <Logo size={32} showName={forceLabels || !collapsed} nameClassName={forceLabels ? "" : "max-lg:hidden"} />
        </Link>
      </div>

      <nav aria-label="เมนูหลัก" className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {items.map((item) => {
          const active = isActive(item, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              title={forceLabels ? undefined : item.label}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                alignClass,
                active
                  ? "bg-primary-soft text-primary-text"
                  : "text-muted hover:bg-hover hover:text-fg",
              )}
            >
              <Icon name={item.icon} size={20} className="shrink-0" />
              <span className={labelClass}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 space-y-1 border-t border-line p-3">
        <div className={cn("flex items-center gap-3 rounded-lg px-2 py-2", alignClass)}>
          <Avatar name={user.name} email={user.email} size={36} />
          <div className={cn("min-w-0 flex-1", labelClass)}>
            <p className="truncate text-sm font-semibold text-fg">{user.name ?? user.email}</p>
            <div className="mt-0.5 flex items-center gap-2">
              <RoleBadge role={user.role} />
            </div>
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            title={forceLabels ? undefined : "ออกจากระบบ"}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors duration-150 hover:bg-danger-soft hover:text-danger-text",
              alignClass,
            )}
          >
            <Icon name="logout" size={20} className="shrink-0" />
            <span className={labelClass}>ออกจากระบบ</span>
          </button>
        </form>
      </div>
    </div>
  );
}
