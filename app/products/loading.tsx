import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Skeleton ที่แสดงระหว่างโหลดหน้ารายการสินค้า (Next.js แสดงอัตโนมัติ)
 */
export default function Loading() {
  return (
    <div role="status" aria-label="กำลังโหลดรายการสินค้า">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-3 mb-6 h-4 w-64" />
      <Card className="mb-5 h-36 p-4">
        <Skeleton className="h-10 w-full" />
      </Card>
      <Card className="divide-y divide-line">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="hidden h-4 w-24 sm:block" />
          </div>
        ))}
      </Card>
      <span className="sr-only">กำลังโหลด...</span>
    </div>
  );
}
