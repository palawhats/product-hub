import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Skeleton ของ Dashboard ที่แสดงระหว่างรอข้อมูล (รูปทรงเหมือนการ์ดและกราฟจริง)
 */
export function DashboardSkeleton() {
  return (
    <div role="status" aria-label="กำลังโหลดข้อมูล">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-8 w-20" />
            <Skeleton className="mt-3 h-3 w-32" />
          </Card>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="h-56 p-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-6 h-3 w-full" />
        </Card>
        <Card className="h-56 p-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-6 h-3 w-full" />
        </Card>
      </div>
      <span className="sr-only">กำลังโหลด...</span>
    </div>
  );
}
