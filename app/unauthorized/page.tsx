import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "ไม่มีสิทธิ์เข้าถึง" };

/**
 * หน้า "ไม่มีสิทธิ์เข้าถึง" ที่ระบบพาผู้ใช้มาเมื่อบทบาทไม่มีสิทธิ์ในหน้านั้น
 */
export default function UnauthorizedPage() {
  return (
    <Card className="mx-auto mt-8 max-w-lg sm:mt-16">
      <EmptyState
        icon="lock"
        title="ไม่มีสิทธิ์เข้าถึง"
        description="บัญชีของคุณไม่มีสิทธิ์ใช้งานส่วนนี้ หากต้องการสิทธิ์เพิ่ม โปรดติดต่อผู้ดูแลระบบ"
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <ButtonLink href="/">กลับหน้าแรก</ButtonLink>
            <ButtonLink href="/products" variant="secondary">
              รายการสินค้า
            </ButtonLink>
          </div>
        }
      />
    </Card>
  );
}
