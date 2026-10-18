import DeleteButton from "@/app/products/delete-button";
import { LOW_STOCK_THRESHOLD } from "@/app/lib/products";
import { formatDate, formatNumber, formatTHB } from "@/app/lib/utils";
import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

export type ProductRow = {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  stock: number;
  unit: string;
  isActive: boolean;
  createdAt: Date;
};

/**
 * ป้ายเตือนสต็อก: "หมด" เมื่อเป็น 0, "ใกล้หมด" เมื่อไม่เกินเกณฑ์ (LOW_STOCK_THRESHOLD) ไม่เช่นนั้นไม่แสดง
 */
function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <Badge tone="danger">หมด</Badge>;
  if (stock <= LOW_STOCK_THRESHOLD) return <Badge tone="warning">ใกล้หมด</Badge>;
  return null;
}

/**
 * ป้ายสถานะการขาย: เปิดขาย (เขียว) หรือ ปิดขาย (เทา)
 */
function StatusBadge({ active }: { active: boolean }) {
  return active ? <Badge tone="success">เปิดขาย</Badge> : <Badge tone="neutral">ปิดขาย</Badge>;
}

/**
 * ปุ่มจัดการต่อแถว: แก้ไข (เมื่อมีสิทธิ์ product:write) และลบ (เมื่อมีสิทธิ์ product:delete)
 */
function RowActions({
  p,
  canWrite,
  canDelete,
}: {
  p: ProductRow;
  canWrite: boolean;
  canDelete: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      {canWrite && (
        <ButtonLink
          href={`/products/${p.id}/edit`}
          variant="ghost"
          size="sm"
          aria-label={`แก้ไขสินค้า ${p.name}`}
          title="แก้ไข"
          className="size-10 px-0"
        >
          <Icon name="pencil" size={16} />
        </ButtonLink>
      )}
      {canDelete && <DeleteButton id={p.id} name={p.name} />}
    </div>
  );
}

/**
 * แสดงรายการสินค้า: ตารางบนจอใหญ่ และการ์ดบนมือถือ
 * ถ้าไม่มีรายการจะแสดงสถานะว่าง (แยกกรณี "ไม่พบตามเงื่อนไข" กับ "ยังไม่มีสินค้า")
 * คอลัมน์จัดการแสดงเฉพาะผู้ที่มีสิทธิ์แก้ไขหรือลบ
 */
export function ProductTable({
  items,
  canWrite,
  canDelete,
  filtered,
}: {
  items: ProductRow[];
  canWrite: boolean;
  canDelete: boolean;
  filtered: boolean;
}) {
  const showActions = canWrite || canDelete;

  if (items.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={filtered ? "search" : "package"}
          title={filtered ? "ไม่พบสินค้าที่ตรงกับเงื่อนไข" : "ยังไม่มีสินค้า"}
          description={
            filtered ? "ลองเปลี่ยนคำค้นหาหรือล้างตัวกรองเพื่อดูสินค้าทั้งหมด" : canWrite ? "เริ่มต้นด้วยการเพิ่มสินค้าชิ้นแรก" : undefined
          }
          action={
            filtered ? (
              <ButtonLink href="/products" variant="secondary">
                ล้างตัวกรอง
              </ButtonLink>
            ) : canWrite ? (
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

  return (
    <>
      {/* ตาราง: หน้าจอ md ขึ้นไป */}
      <Card className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">รายการสินค้า</caption>
          <thead className="border-b border-line bg-hover text-xs text-muted">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">SKU</th>
              <th scope="col" className="px-4 py-3 font-semibold">สินค้า</th>
              <th scope="col" className="px-4 py-3 font-semibold">หมวดหมู่</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">ราคา</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">สต็อก</th>
              <th scope="col" className="px-4 py-3 font-semibold">สถานะ</th>
              <th scope="col" className="px-4 py-3 font-semibold">สร้างเมื่อ</th>
              {showActions && (
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  จัดการ
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((p) => (
              <tr key={p.id} className="transition-colors duration-150 hover:bg-hover">
                <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-muted">{p.sku}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{p.name}</div>
                  {p.description && (
                    <div className="mt-0.5 max-w-xs truncate text-xs text-muted">{p.description}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-muted">{p.category}</td>
                <td className="tabular px-4 py-3 text-right whitespace-nowrap">{formatTHB(p.price)}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <span className="tabular mr-2">
                    {formatNumber(p.stock)} {p.unit}
                  </span>
                  <StockBadge stock={p.stock} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge active={p.isActive} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted">{formatDate(p.createdAt)}</td>
                {showActions && (
                  <td className="px-4 py-3">
                    <RowActions p={p} canWrite={canWrite} canDelete={canDelete} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* การ์ด: มือถือ */}
      <ul className="space-y-3 md:hidden">
        {items.map((p) => (
          <li key={p.id}>
            <Card className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium break-words">{p.name}</p>
                  <p className="mt-0.5 font-mono text-xs text-muted">{p.sku}</p>
                </div>
                <StatusBadge active={p.isActive} />
              </div>
              {p.description && <p className="mt-2 line-clamp-2 text-xs text-muted">{p.description}</p>}
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <dt className="text-xs text-muted">หมวดหมู่</dt>
                  <dd className="break-words">{p.category}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">ราคา</dt>
                  <dd className="tabular">{formatTHB(p.price)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">สต็อก</dt>
                  <dd className="tabular flex flex-wrap items-center gap-1.5">
                    {formatNumber(p.stock)} {p.unit}
                    <StockBadge stock={p.stock} />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">สร้างเมื่อ</dt>
                  <dd>{formatDate(p.createdAt)}</dd>
                </div>
              </dl>
              {showActions && (
                <div className="mt-3 border-t border-line pt-3">
                  <RowActions p={p} canWrite={canWrite} canDelete={canDelete} />
                </div>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
