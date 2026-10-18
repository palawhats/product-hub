"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/app/lib/prisma";
import { requirePermission } from "@/app/lib/rbac";
import {
  fieldErrors,
  formToValues,
  parseProductForm,
  type ProductFormState,
} from "@/app/lib/validation";
import { prismaErrorCode } from "@/app/lib/utils";

const DUPLICATE_SKU = "รหัสสินค้านี้ถูกใช้แล้ว";

/**
 * Server Action: เพิ่มสินค้าใหม่ — ต้องมีสิทธิ์ product:write (ADMIN/STAFF)
 * ตรวจข้อมูลด้วย zod, บันทึกพร้อมผู้สร้าง (createdById), SKU ซ้ำ (P2002) คืนข้อความใต้ช่อง SKU
 * สำเร็จแล้วรีเฟรชข้อมูลหน้ารายการและพาไป /products?saved=created
 *
 * @returns { errors, values } เมื่อข้อมูลไม่ถูกต้อง
 */
export async function createProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const user = await requirePermission("product:write", "/products/new");
  const values = formToValues(formData);
  const parsed = parseProductForm(values);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  try {
    await prisma.product.create({ data: { ...parsed.data, createdById: user.id } });
  } catch (e) {
    if (prismaErrorCode(e) === "P2002") return { errors: { sku: [DUPLICATE_SKU] }, values };
    throw e;
  }
  revalidatePath("/products");
  revalidatePath("/admin");
  redirect("/products?saved=created");
}

/**
 * Server Action: แก้ไขสินค้า — ต้องมีสิทธิ์ product:write
 * SKU ซ้ำ (P2002) คืนข้อความใต้ช่อง SKU, ถ้าสินค้าถูกลบไปแล้ว (P2025) กลับไปหน้ารายการ
 * สำเร็จแล้วพาไป /products?saved=updated
 *
 * @param id รหัสสินค้าที่แก้ไข (ผูกมาด้วย bind จากหน้าแก้ไข)
 */
export async function updateProduct(
  id: number,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requirePermission("product:write", `/products/${id}/edit`);
  const values = formToValues(formData);
  const parsed = parseProductForm(values);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  try {
    await prisma.product.update({ where: { id }, data: parsed.data });
  } catch (e) {
    const code = prismaErrorCode(e);
    if (code === "P2002") return { errors: { sku: [DUPLICATE_SKU] }, values };
    if (code === "P2025") redirect("/products");
    throw e;
  }
  revalidatePath("/products");
  revalidatePath("/admin");
  redirect("/products?saved=updated");
}

/**
 * Server Action: ลบสินค้า — ต้องมีสิทธิ์ product:delete (เฉพาะ ADMIN)
 * ถ้าสินค้าถูกลบไปแล้ว (P2025) ถือว่าสำเร็จ ไม่ทำอะไรเพิ่ม แล้วพาไป /products?saved=deleted
 *
 * @param id รหัสสินค้าที่ต้องการลบ
 */
export async function deleteProduct(id: number) {
  await requirePermission("product:delete");
  try {
    await prisma.product.delete({ where: { id } });
  } catch (e) {
    if (prismaErrorCode(e) !== "P2025") throw e; // ถูกลบไปแล้ว — ไม่ต้องทำอะไร
  }
  revalidatePath("/products");
  revalidatePath("/admin");
  redirect("/products?saved=deleted");
}
