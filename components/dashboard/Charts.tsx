import { Card, CardHeader } from "@/components/ui/Card";
import { formatNumber } from "@/app/lib/utils";
import type { CategoryCount } from "@/app/lib/dashboard";

/**
 * แผนภูมิแท่งซ้อนแสดงสัดส่วนสถานะสต็อก (สต็อกพอ / ใกล้หมด / หมด) จากจำนวนสินค้าจริง
 * มี aria-label สรุปตัวเลขสำหรับโปรแกรมอ่านหน้าจอ และคำอธิบายสีด้านล่าง
 *
 * @param ok จำนวนสินค้าที่สต็อกพอ
 * @param low จำนวนที่ใกล้หมด
 * @param out จำนวนที่หมดสต็อก
 */
export function StockStatusChart({ ok, low, out }: { ok: number; low: number; out: number }) {
  const total = ok + low + out;
  const parts = [
    { label: "สต็อกพอ", value: ok, bar: "bg-success", dot: "bg-success" },
    { label: "ใกล้หมด", value: low, bar: "bg-warning", dot: "bg-warning" },
    { label: "หมดสต็อก", value: out, bar: "bg-danger", dot: "bg-danger" },
  ];
  const summary = parts.map((p) => `${p.label} ${formatNumber(p.value)}`).join(", ");

  return (
    <Card>
      <CardHeader title="สถานะสต็อก" description="สัดส่วนสินค้าแยกตามระดับสต็อก" />
      <div className="p-5">
        <div
          role="img"
          aria-label={`สถานะสต็อก: ${summary}`}
          className="flex h-3 w-full overflow-hidden rounded-full bg-line"
        >
          {parts.map(
            (p) =>
              p.value > 0 && (
                <div key={p.label} className={p.bar} style={{ width: `${(p.value / total) * 100}%` }} />
              ),
          )}
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {parts.map((p) => (
            <li key={p.label} className="flex items-center gap-3">
              <span className={`size-2.5 shrink-0 rounded-full ${p.dot}`} aria-hidden="true" />
              <div>
                <p className="text-xs text-muted">{p.label}</p>
                <p className="tabular text-lg font-semibold">
                  {formatNumber(p.value)}
                  <span className="ml-1.5 text-xs font-normal text-muted">
                    {total > 0 ? `${Math.round((p.value / total) * 100)}%` : "0%"}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

/**
 * แผนภูมิแท่งแนวนอนแสดงจำนวนสินค้าต่อหมวดหมู่ (ความยาวแท่งเทียบกับหมวดที่มากที่สุด)
 *
 * @param data รายการหมวดหมู่พร้อมจำนวน
 */
export function CategoryChart({ data }: { data: CategoryCount[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <Card>
      <CardHeader title="สินค้าตามหมวดหมู่" description="จำนวนรายการสินค้าในแต่ละหมวด" />
      <ul className="space-y-3.5 p-5">
        {data.map((d) => (
          <li key={d.category}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate font-medium">{d.category}</span>
              <span className="tabular shrink-0 text-muted">{formatNumber(d.count)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(d.count / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
