import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * หน้า 404 เมื่อไม่พบหน้าที่ร้องขอ
 */
export default function NotFound() {
  return (
    <Card className="mx-auto mt-8 max-w-lg sm:mt-16">
      <EmptyState
        icon="compass"
        title="ไม่พบหน้าที่ต้องการ"
        description="ลิงก์อาจไม่ถูกต้องหรือหน้านี้ถูกย้ายไปแล้ว"
        action={<ButtonLink href="/">กลับหน้าแรก</ButtonLink>}
      />
    </Card>
  );
}
