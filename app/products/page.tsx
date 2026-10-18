import type { Metadata } from "next";
import { can, requirePermission } from "@/app/lib/rbac";
import {
  LOW_STOCK_THRESHOLD,
  SORT_OPTIONS,
  listCategories,
  listProducts,
  parseProductQuery,
  type ProductQuery,
} from "@/app/lib/products";
import { formatNumber } from "@/app/lib/utils";
import { Icon } from "@/components/icons";
import { FilterBar } from "@/components/products/FilterBar";
import { Pagination } from "@/components/products/Pagination";
import { ProductTable } from "@/components/products/ProductTable";
import { ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Products" };

type SP = Record<string, string | string[] | undefined>;

/**
 * สร้าง URL ของหน้ารายการสินค้าสำหรับเลขหน้าที่กำหนด โดยคงตัวกรอง/การเรียงปัจจุบันไว้
 * (ข้ามค่าเริ่มต้นเพื่อให้ URL สั้น)
 *
 * @param q เงื่อนไขค้นหาปัจจุบัน
 * @param page เลขหน้าที่ต้องการลิงก์ไป
 */
function pageHref(q: ProductQuery, page: number) {
  const p = new URLSearchParams();
  if (q.q) p.set("q", q.q);
  if (q.category) p.set("category", q.category);
  if (q.status !== "all") p.set("status", q.status);
  if (q.stock !== "all") p.set("stock", q.stock);
  if (q.sort !== "newest") p.set("sort", q.sort);
  if (page > 1) p.set("page", String(page));
  const s = p.toString();
  return s ? `/products?${s}` : "/products";
}

/**
 * หน้ารายการสินค้า — ต้องมีสิทธิ์ product:read
 * อ่านเงื่อนไขจาก URL, ดึงสินค้าและหมวดหมู่ แล้วแสดงแถบค้นหา/กรอง ตาราง และการแบ่งหน้า
 * ปุ่มเพิ่ม/แก้ไข/ลบจะแสดงตามสิทธิ์ของผู้ใช้ (product:write, product:delete)
 */
export default async function ProductsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const user = await requirePermission("product:read", "/products");
  const sp = await searchParams;
  /**
   * อ่านค่าพารามิเตอร์จาก searchParams (ถ้ามีหลายค่าใช้ตัวแรก)
   */
  const get = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const query = parseProductQuery(get);

  const [{ items, total, page, pageSize, totalPages }, categories] = await Promise.all([
    listProducts(query),
    listCategories(),
  ]);

  const canWrite = can(user.role, "product:write");
  const canDelete = can(user.role, "product:delete");
  const filtered = Boolean(query.q || query.category || query.status !== "all" || query.stock !== "all");

  return (
    <div>
      <PageHeader
        title="Products"
        description={
          <>
            จัดการรายการสินค้าและสต็อก · {filtered ? "พบ" : "ทั้งหมด"}{" "}
            <strong className="font-semibold text-fg">{formatNumber(total)}</strong> รายการ
          </>
        }
        actions={
          canWrite ? (
            <ButtonLink href="/products/new">
              <Icon name="plus" size={16} />
              เพิ่มสินค้า
            </ButtonLink>
          ) : undefined
        }
      />

      <FilterBar
        values={{
          q: query.q,
          category: query.category,
          status: query.status,
          stock: query.stock,
          sort: query.sort,
        }}
        categories={categories}
        sortOptions={Object.entries(SORT_OPTIONS).map(([value, o]) => ({ value, label: o.label }))}
        lowStockThreshold={LOW_STOCK_THRESHOLD}
        filtered={filtered}
      />

      <ProductTable items={items} canWrite={canWrite} canDelete={canDelete} filtered={filtered} />

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        hrefFor={(n) => pageHref(query, n)}
      />
    </div>
  );
}
