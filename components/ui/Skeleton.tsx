import { cn } from "@/components/lib/cn";

/**
 * กล่องเทาเคลื่อนไหวเบา ๆ แทนเนื้อหาที่กำลังโหลด (ซ่อนจากโปรแกรมอ่านหน้าจอ)
 */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-md bg-line/70", className)} />;
}
