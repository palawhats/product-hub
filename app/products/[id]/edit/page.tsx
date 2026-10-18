import type { Metadata } from "next";
import prisma from "@/app/lib/prisma";
import { requirePermission } from "@/app/lib/rbac";
import { listCategories } from "@/app/lib/products";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { updateProduct } from "../../actions";
import ProductForm from "../../product-form";

export const metadata: Metadata = { title: "แก้ไขสินค้า" };

/**
 * หน้าแก้ไขสินค้า — ต้องมีสิทธิ์ product:write
 * อ่านสินค้าตาม id แล้วเติมค่าเดิมลงฟอร์ม (เชื่อมกับ updateProduct) ถ้า id ไม่ถูกต้องหรือไม่พบสินค้า
 * จะแสดงหน้า "ไม่พบสินค้า" พร้อมปุ่มกลับไปรายการ
 */
export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  await requirePermission("product:write", `/products/${rawId}/edit`);

  const product = Number.isInteger(id) && id > 0
    ? await prisma.product.findUnique({ where: { id } })
    : null;

  if (!product) {
    return (
      <Card className="mx-auto max-w-3xl">
        <EmptyState
          icon="alertCircle"
          title="ไม่พบสินค้า"
          description="สินค้านี้อาจถูกลบไปแล้ว หรือลิงก์ไม่ถูกต้อง"
          action={<ButtonLink href="/products">กลับไปรายการสินค้า</ButtonLink>}
        />
      </Card>
    );
  }

  const categories = await listCategories();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="แก้ไขสินค้า" description={`${product.sku} · ${product.name}`} />
      <ProductForm
        action={updateProduct.bind(null, product.id)}
        categories={categories}
        submitLabel="บันทึกการแก้ไข"
        defaults={{
          sku: product.sku,
          name: product.name,
          description: product.description ?? "",
          category: product.category,
          price: String(product.price),
          stock: String(product.stock),
          unit: product.unit,
          isActive: product.isActive,
        }}
      />
    </div>
  );
}
