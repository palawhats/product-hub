import prisma from "@/app/lib/prisma";
import { getProductStats } from "@/app/lib/products";

export const RECENT_DAYS = 7;
const TOP_CATEGORIES = 6;

export type CategoryCount = { category: string; count: number };

/**
 * ข้อมูลหน้า Dashboard — คำนวณจากฐานข้อมูลจริงทั้งหมด
 * includeUsers ต้องส่งเป็น true เฉพาะผู้ที่มีสิทธิ์ user:manage (ผู้เรียกตรวจสิทธิ์ก่อน)
 */
export async function getDashboardData({ includeUsers }: { includeUsers: boolean }) {
  const since = new Date(Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000);

  const [stats, recentProducts, recentCount, categoryRows, roleRows] = await Promise.all([
    getProductStats(),
    prisma.product.findMany({ orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 5 }),
    prisma.product.count({ where: { createdAt: { gte: since } } }),
    prisma.product.groupBy({ by: ["category"], _count: { _all: true } }),
    includeUsers ? prisma.user.groupBy({ by: ["role"], _count: { _all: true } }) : Promise.resolve(null),
  ]);

  const sorted: CategoryCount[] = categoryRows
    .map((r) => ({ category: r.category, count: r._count._all }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category, "th"));
  const categories = sorted.slice(0, TOP_CATEGORIES);
  const otherCount = sorted.slice(TOP_CATEGORIES).reduce((s, c) => s + c.count, 0);
  if (otherCount > 0) categories.push({ category: "อื่น ๆ", count: otherCount });

  const users = roleRows
    ? {
        total: roleRows.reduce((s, r) => s + r._count._all, 0),
        byRole: Object.fromEntries(roleRows.map((r) => [r.role, r._count._all])) as Record<string, number>,
      }
    : null;

  return { stats, recentProducts, recentCount, categories, users };
}
