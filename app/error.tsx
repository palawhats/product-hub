"use client";

import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * หน้าแสดงเมื่อเกิดข้อผิดพลาดขณะโหลดหน้า (error boundary) มีปุ่ม "ลองใหม่" เรียก reset เพื่อโหลดส่วนนั้นอีกครั้ง
 */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Card className="mx-auto mt-8 max-w-lg sm:mt-16">
      <EmptyState
        icon="alertTriangle"
        title="เกิดข้อผิดพลาดในการโหลดข้อมูล"
        description="กรุณาลองใหม่อีกครั้ง หากยังพบปัญหา โปรดติดต่อผู้ดูแลระบบ"
        action={
          <Button onClick={reset}>
            <Icon name="refresh" size={16} />
            ลองใหม่
          </Button>
        }
      />
    </Card>
  );
}
