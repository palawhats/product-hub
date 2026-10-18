import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Skeleton ที่แสดงระหว่างโหลดหน้าจัดการผู้ใช้
 */
export default function Loading() {
  return (
    <div role="status" aria-label="กำลังโหลดรายชื่อผู้ใช้">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="mt-3 mb-6 h-4 w-72" />
      <Card className="divide-y divide-line">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-4">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </Card>
      <span className="sr-only">กำลังโหลด...</span>
    </div>
  );
}
