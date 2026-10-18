"use client";

import { useState, useTransition } from "react";
import { deleteProduct } from "./actions";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

/**
 * ปุ่มลบสินค้าพร้อมกล่องยืนยัน (client component)
 * กดปุ่มถังขยะ -> เปิด ConfirmDialog -> เมื่อยืนยันจึงเรียก Server Action deleteProduct
 * (ฝั่ง server ตรวจสิทธิ์ product:delete อีกครั้ง) ระหว่างลบจะล็อกปุ่มและแสดงสถานะกำลังดำเนินการ
 *
 * @param id รหัสสินค้า
 * @param name ชื่อสินค้า (แสดงในข้อความยืนยัน)
 */
export default function DeleteButton({ id, name }: { id: number; name: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label={`ลบสินค้า ${name}`}
        title="ลบ"
        className="size-10 px-0 hover:bg-danger-soft hover:text-danger-text"
      >
        <Icon name="trash" size={16} />
      </Button>
      <ConfirmDialog
        open={open}
        pending={pending}
        title="ลบสินค้านี้ใช่หรือไม่?"
        description={
          <>
            สินค้า <strong className="font-semibold text-fg">&ldquo;{name}&rdquo;</strong>{" "}
            จะถูกลบออกจากระบบถาวร และไม่สามารถย้อนกลับได้
          </>
        }
        confirmLabel="ลบสินค้า"
        onCancel={() => setOpen(false)}
        onConfirm={() => startTransition(() => deleteProduct(id))}
      />
    </>
  );
}
