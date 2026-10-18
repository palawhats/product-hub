import type { Metadata } from "next";
import { requirePermission } from "@/app/lib/rbac";
import { listCategories } from "@/app/lib/products";
import { PageHeader } from "@/components/ui/PageHeader";
import { createProduct } from "../actions";
import ProductForm from "../product-form";

export const metadata: Metadata = { title: "เพิ่มสินค้า" };

/**
 * หน้าเพิ่มสินค้าใหม่ — ต้องมีสิทธิ์ product:write แสดงฟอร์มเปล่าที่เชื่อมกับ Server Action createProduct
 */
export default async function NewProductPage() {
  await requirePermission("product:write", "/products/new");
  const categories = await listCategories();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="เพิ่มสินค้าใหม่" description="กรอกข้อมูลสินค้าที่ต้องการบันทึก" />
      <ProductForm action={createProduct} categories={categories} submitLabel="บันทึกสินค้า" />
    </div>
  );
}
