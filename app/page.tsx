import Link from "next/link";
import { Suspense } from "react";
import { can, getCurrentUser, type Role } from "@/app/lib/rbac";
import { getDashboardData } from "@/app/lib/dashboard";
import { LOW_STOCK_THRESHOLD } from "@/app/lib/products";
import { formatDate, formatNumber, formatTHB } from "@/app/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { CategoryChart, StockStatusChart } from "@/components/dashboard/Charts";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { StatCard } from "@/components/dashboard/StatCard";
import { Icon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";

const FEATURES = [
  { icon: "package", title: "บันทึกสินค้า", desc: "เพิ่ม แก้ไข ลบ พร้อมตรวจสอบข้อมูลก่อนบันทึก" },
  { icon: "search", title: "ค้นหาและกรอง", desc: "ค้นด้วยชื่อ/รหัส กรองหมวดหมู่ สถานะ และสต็อก" },
  { icon: "shield", title: "แบ่งสิทธิ์ 3 ระดับ", desc: "ADMIN, STAFF, USER ควบคุมสิ่งที่ทำได้ชัดเจน" },
  { icon: "compass", title: "REST API", desc: "GET / POST / PUT / DELETE สำหรับเชื่อมต่อระบบอื่น" },
] as const;

/**
 * หน้าแรกสำหรับผู้ที่ยังไม่ล็อกอิน: โลโก้ ปุ่มเข้าสู่ระบบ/สมัครสมาชิก ข้อความแนะนำ และการ์ดสรุปความสามารถของระบบ
 */
function Landing() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-5 sm:px-8">
      <header className="flex items-center justify-between py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ButtonLink href="/login" variant="secondary">
            เข้าสู่ระบบ
          </ButtonLink>
          <ButtonLink href="/signup" className="hidden sm:inline-flex">
            สมัครสมาชิก
          </ButtonLink>
        </div>
      </header>

      <section className="py-16 sm:py-24">
        <h1 className="max-w-2xl text-4xl leading-[1.15] font-bold tracking-tight sm:text-6xl">
          Manage smarter. Work better.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted">
          StockFlow ช่วยให้ทีมจัดการรายการสินค้า ราคา และสต็อกในที่เดียว พร้อมระบบสมาชิกและการกำหนดสิทธิ์
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/login">เข้าสู่ระบบ</ButtonLink>
          <ButtonLink href="/signup" variant="secondary">
            สมัครสมาชิก
          </ButtonLink>
        </div>
      </section>

      <section className="grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <Card key={f.title} className="p-5">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary-text">
              <Icon name={f.icon} size={20} />
            </span>
            <h2 className="mt-4 font-semibold">{f.title}</h2>
            <p className="mt-1 text-sm text-muted">{f.desc}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}

/**
 * เนื้อหา Dashboard (server component): ดึงข้อมูลจริงแล้วแสดงการ์ดสถิติ กราฟสถานะสต็อก/หมวดหมู่
 * สินค้าล่าสุด และปุ่มทางลัด โดยแสดงเฉพาะสิ่งที่บทบาทนั้นมีสิทธิ์ (การ์ดผู้ใช้และลิงก์จัดการผู้ใช้ = user:manage,
 * ปุ่มเพิ่มสินค้า = product:write) ถ้ายังไม่มีสินค้าจะแสดงหน้าว่างพร้อมคำแนะนำ
 *
 * @param role บทบาทของผู้ใช้ปัจจุบัน ใช้ตัดสินใจว่าจะแสดงอะไร
 */
async function DashboardContent({ role }: { role: Role }) {
  const canWrite = can(role, "product:write");
  const canManageUsers = can(role, "user:manage");
  const { stats, recentProducts, recentCount, categories, users } = await getDashboardData({
    includeUsers: canManageUsers,
  });

  if (stats.total === 0) {
    return (
      <Card>
        <EmptyState
          title="ยังไม่มีสินค้าในระบบ"
          description={canWrite ? "เริ่มต้นด้วยการเพิ่มสินค้าชิ้นแรก" : "เมื่อมีการบันทึกสินค้า ข้อมูลภาพรวมจะแสดงที่นี่"}
          action={
            canWrite ? (
              <ButtonLink href="/products/new">
                <Icon name="plus" size={16} />
                เพิ่มสินค้า
              </ButtonLink>
            ) : undefined
          }
        />
      </Card>
    );
  }

  const inStock = stats.total - stats.low - stats.out;
  const gridCols = users ? "xl:grid-cols-5" : "xl:grid-cols-4";

  return (
    <div className="space-y-6">
      <div className={`grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 ${gridCols}`}>
        <StatCard
          icon="package"
          label="สินค้าทั้งหมด"
          value={formatNumber(stats.total)}
          description={`เปิดขาย ${formatNumber(stats.active)} · ปิดขาย ${formatNumber(stats.total - stats.active)}`}
        />
        <StatCard
          icon="clock"
          label="เพิ่มล่าสุด"
          value={formatNumber(recentCount)}
          description="รายการที่เพิ่มใน 7 วันที่ผ่านมา"
          tone="teal"
        />
        <StatCard
          icon="alertTriangle"
          label="ต้องเติมสต็อก"
          value={formatNumber(stats.low + stats.out)}
          description={`ใกล้หมด ${formatNumber(stats.low)} · หมด ${formatNumber(stats.out)}`}
          tone="warning"
        />
        <StatCard
          icon="wallet"
          label="มูลค่าสต็อกรวม"
          value={formatTHB(stats.inventoryValue)}
          description="ราคา × จำนวนสต็อก ของทุกรายการ"
          tone="success"
        />
        {users && (
          <StatCard
            icon="users"
            label="ผู้ใช้ทั้งหมด"
            value={formatNumber(users.total)}
            description={`ADMIN ${users.byRole.ADMIN ?? 0} · STAFF ${users.byRole.STAFF ?? 0} · USER ${users.byRole.USER ?? 0}`}
          />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StockStatusChart ok={inStock} low={stats.low} out={stats.out} />
        <CategoryChart data={categories} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader
            title="สินค้าล่าสุด"
            description="5 รายการที่เพิ่มล่าสุด"
            action={
              <Link href="/products" className="text-sm font-semibold whitespace-nowrap text-primary-text hover:underline">
                ดูทั้งหมด
              </Link>
            }
          />
          <ul className="divide-y divide-line">
            {recentProducts.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {p.sku} · {p.category} · {formatDate(p.createdAt)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="tabular text-sm font-medium">{formatTHB(p.price)}</p>
                  {p.stock === 0 ? (
                    <Badge tone="danger">หมด</Badge>
                  ) : p.stock <= LOW_STOCK_THRESHOLD ? (
                    <Badge tone="warning">ใกล้หมด</Badge>
                  ) : (
                    <p className="tabular text-xs text-muted">
                      {formatNumber(p.stock)} {p.unit}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="ทางลัด" />
          <div className="flex flex-col gap-2 p-5">
            <ButtonLink href="/products" variant="secondary" className="justify-start">
              <Icon name="package" size={16} />
              ดูรายการสินค้า
            </ButtonLink>
            {canWrite && (
              <ButtonLink href="/products/new" className="justify-start">
                <Icon name="plus" size={16} />
                เพิ่มสินค้าใหม่
              </ButtonLink>
            )}
            {canManageUsers && (
              <ButtonLink href="/admin" variant="secondary" className="justify-start">
                <Icon name="users" size={16} />
                จัดการผู้ใช้และสิทธิ์
              </ButtonLink>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

/**
 * หน้า "/" : ถ้ายังไม่ล็อกอินแสดง Landing ถ้าล็อกอินแล้วแสดง Dashboard
 * (ส่วนข้อมูลถูกห่อด้วย Suspense เพื่อแสดง skeleton ระหว่างโหลด)
 */
export default async function Home() {
  const user = await getCurrentUser();
  if (!user) return <Landing />;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="ภาพรวมการจัดการสินค้าและข้อมูลสำคัญของระบบ"
        actions={
          can(user.role, "product:write") ? (
            <ButtonLink href="/products/new">
              <Icon name="plus" size={16} />
              เพิ่มสินค้า
            </ButtonLink>
          ) : undefined
        }
      />
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent role={user.role} />
      </Suspense>
    </div>
  );
}
