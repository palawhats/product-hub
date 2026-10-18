import prisma from "@/app/lib/prisma";
import type { Prisma } from "@/app/generated/prisma/client";

export const LOW_STOCK_THRESHOLD = 10;
export const DEFAULT_PAGE_SIZE = 10;

export const SORT_OPTIONS = {
  newest: { label: "ใหม่ล่าสุด", orderBy: [{ createdAt: "desc" }, { id: "desc" }] },
  name_asc: { label: "ชื่อ A → Z", orderBy: [{ name: "asc" }] },
  price_asc: { label: "ราคา ต่ำ → สูง", orderBy: [{ price: "asc" }] },
  price_desc: { label: "ราคา สูง → ต่ำ", orderBy: [{ price: "desc" }] },
  stock_asc: { label: "สต็อก น้อย → มาก", orderBy: [{ stock: "asc" }] },
  stock_desc: { label: "สต็อก มาก → น้อย", orderBy: [{ stock: "desc" }] },
} satisfies Record<string, { label: string; orderBy: Prisma.ProductOrderByWithRelationInput[] }>;

export type SortKey = keyof typeof SORT_OPTIONS;
export type StatusFilter = "all" | "active" | "inactive";
export type StockFilter = "all" | "low" | "out";

export type ProductQuery = {
  q: string;
  category: string;
  status: StatusFilter;
  stock: StockFilter;
  sort: SortKey;
  page: number;
  pageSize: number;
};

/**
 * อ่านพารามิเตอร์ค้นหา/กรอง/เรียง/แบ่งหน้าของรายการสินค้า
 * ใช้ร่วมกันทั้งหน้าเว็บและ API โดยจำกัดค่าที่ยอมรับ (allow-list) ค่าที่ไม่ถูกต้องจะถูกแทนด้วยค่าเริ่มต้น
 * เช่น sort ที่ไม่รู้จัก -> "newest", pageSize สูงสุด 100
 *
 * @param get ฟังก์ชันอ่านค่าตามชื่อพารามิเตอร์ (เช่นจาก searchParams)
 * @returns ProductQuery ที่ผ่านการทำความสะอาดแล้ว
 */
export function parseProductQuery(
  get: (key: string) => string | null | undefined,
): ProductQuery {
  const status = get("status");
  const stock = get("stock");
  const sort = get("sort");
  const page = Number.parseInt(get("page") ?? "", 10);
  const pageSize = Number.parseInt(get("pageSize") ?? "", 10);
  return {
    q: (get("q") ?? "").trim().slice(0, 100),
    category: (get("category") ?? "").trim().slice(0, 50),
    status: status === "active" || status === "inactive" ? status : "all",
    stock: stock === "low" || stock === "out" ? stock : "all",
    sort: sort && sort in SORT_OPTIONS ? (sort as SortKey) : "newest",
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize:
      Number.isFinite(pageSize) && pageSize > 0 ? Math.min(pageSize, 100) : DEFAULT_PAGE_SIZE,
  };
}

/**
 * สร้างเงื่อนไขค้นหา (where) ของ Prisma จากพารามิเตอร์ที่ผู้ใช้เลือก
 * - q : ค้นในชื่อ/รหัส/รายละเอียด
 * - category, status (เปิด/ปิดขาย), stock (ใกล้หมด = 1..เกณฑ์, หมด = 0)
 *
 * @param q พารามิเตอร์ที่ผ่าน parseProductQuery แล้ว
 */
function buildWhere(q: ProductQuery): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};
  if (q.q) {
    // SQLite: LIKE ไม่แยกตัวพิมพ์เล็ก/ใหญ่ของ ASCII อยู่แล้ว (ห้ามใช้ mode: "insensitive")
    where.OR = [
      { name: { contains: q.q } },
      { sku: { contains: q.q } },
      { description: { contains: q.q } },
    ];
  }
  if (q.category) where.category = q.category;
  if (q.status === "active") where.isActive = true;
  if (q.status === "inactive") where.isActive = false;
  if (q.stock === "out") where.stock = 0;
  if (q.stock === "low") where.stock = { gt: 0, lte: LOW_STOCK_THRESHOLD };
  return where;
}

/**
 * ดึงรายการสินค้าตามเงื่อนไข พร้อมแบ่งหน้า
 * ถ้าขอหน้าเกินจำนวนหน้าทั้งหมด จะถอยมาแสดงหน้าสุดท้ายแทน
 *
 * @param q เงื่อนไขค้นหา/เรียง/แบ่งหน้า
 * @returns { items, total, page, pageSize, totalPages }
 */
export async function listProducts(q: ProductQuery) {
  const where = buildWhere(q);
  const total = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / q.pageSize));
  const page = Math.min(q.page, totalPages);
  const items = await prisma.product.findMany({
    where,
    orderBy: SORT_OPTIONS[q.sort].orderBy,
    skip: (page - 1) * q.pageSize,
    take: q.pageSize,
  });
  return { items, total, page, pageSize: q.pageSize, totalPages };
}

/**
 * ดึงรายชื่อหมวดหมู่ทั้งหมดที่มีสินค้า (ไม่ซ้ำ เรียง ก-ฮ/A-Z) ใช้เติมตัวเลือกกรองและช่องหมวดหมู่ในฟอร์ม
 */
export async function listCategories() {
  const rows = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return rows.map((r) => r.category);
}

/**
 * คำนวณสถิติสินค้าสำหรับ Dashboard จากฐานข้อมูล
 * @returns total (ทั้งหมด), active (เปิดขาย), low (ใกล้หมด), out (หมดสต็อก),
 *          inventoryValue (มูลค่าสต็อกรวม = ผลรวมของ ราคา × จำนวนสต็อก)
 */
export async function getProductStats() {
  const [total, active, low, out, all] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { stock: { gt: 0, lte: LOW_STOCK_THRESHOLD } } }),
    prisma.product.count({ where: { stock: 0 } }),
    prisma.product.findMany({ select: { price: true, stock: true } }),
  ]);
  const inventoryValue = all.reduce((sum, p) => sum + p.price * p.stock, 0);
  return { total, active, low, out, inventoryValue };
}
