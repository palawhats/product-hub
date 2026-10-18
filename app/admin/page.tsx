import type { Metadata } from "next";
import { requirePermission, ROLES } from "@/app/lib/rbac";
import prisma from "@/app/lib/prisma";
import { formatNumber } from "@/app/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { RoleBadge } from "@/components/users/RoleBadge";
import { UserTable } from "@/components/users/UserTable";

export const metadata: Metadata = { title: "Users" };

/**
 * หน้าจัดการผู้ใช้ (/admin) — ต้องมีสิทธิ์ user:manage (ADMIN)
 * ดึงผู้ใช้ทั้งหมดพร้อมจำนวนสินค้าที่แต่ละคนบันทึก แสดงสรุปจำนวนตามบทบาทและตารางผู้ใช้
 */
export default async function AdminPage() {
  const admin = await requirePermission("user:manage", "/admin");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { products: true } },
    },
  });

  const rows = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    productCount: u._count.products,
  }));

  return (
    <div>
      <PageHeader
        title="Users"
        description={`จัดการผู้ใช้และกำหนดสิทธิ์การเข้าถึง · ทั้งหมด ${formatNumber(users.length)} บัญชี`}
        actions={
          <ul className="flex flex-wrap items-center gap-3 text-sm text-muted" aria-label="จำนวนผู้ใช้แยกตามสิทธิ์">
            {ROLES.map((r) => (
              <li key={r} className="flex items-center gap-1.5">
                <RoleBadge role={r} />
                <span className="tabular">{formatNumber(users.filter((u) => u.role === r).length)}</span>
              </li>
            ))}
          </ul>
        }
      />
      <UserTable users={rows} currentUserId={admin.id} />
    </div>
  );
}
