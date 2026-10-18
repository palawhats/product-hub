import { can, getCurrentUser } from "@/app/lib/rbac";
import { logout } from "./actions";
import { NAV, type NavItem } from "./nav";
import { ShellFrame } from "./ShellFrame";

/**
 * ครอบทุกหน้า: ตรวจผู้ใช้ฝั่ง server แล้วกรองเมนูตามสิทธิ์ (RBAC เดิม)
 * ผู้ที่ยังไม่ล็อกอินจะไม่เห็น Sidebar/Topbar
 */
export default async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  const items: NavItem[] = user
    ? NAV.filter((n) => !n.permission || can(user.role, n.permission)).map(
        ({ href, label, icon, match }) => ({ href, label, icon, match }),
      )
    : [];

  return (
    <ShellFrame
      user={user ? { name: user.name ?? null, email: user.email, role: user.role } : null}
      items={items}
      logoutAction={logout}
    >
      {children}
    </ShellFrame>
  );
}
