import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { apiGuard } from "@/app/lib/rbac";
import { fieldErrors, productSchema } from "@/app/lib/validation";
import { prismaErrorCode } from "@/app/lib/utils";

type Ctx = { params: Promise<{ id: string }> };

/**
 * อ่านและตรวจ id จาก path (/api/products/:id)
 *
 * @returns เลขจำนวนเต็มบวก หรือ null ถ้าไม่ถูกต้อง
 */
async function parseId(ctx: Ctx) {
  const { id } = await ctx.params;
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

/**
 * สร้างคำตอบ 400 เมื่อ id ใน path ไม่ถูกต้อง
 */
const badId = () => NextResponse.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });
/**
 * สร้างคำตอบ 404 เมื่อไม่พบสินค้า
 */
const notFound = () => NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });

/**
 * GET /api/products/:id — ดูสินค้า 1 รายการ ต้องมีสิทธิ์ product:read
 * @returns 200 { data }, 400 id ไม่ถูกต้อง, 404 ไม่พบสินค้า
 */
export async function GET(_req: NextRequest, ctx: Ctx) {
  const guard = await apiGuard("product:read");
  if (!guard.ok) return guard.response;
  const id = await parseId(ctx);
  if (!id) return badId();

  const product = await prisma.product.findUnique({ where: { id } });
  return product ? NextResponse.json({ data: product }) : notFound();
}

/**
 * PUT /api/products/:id — แก้ไขสินค้า (ต้องส่งข้อมูลครบทุกฟิลด์) ต้องมีสิทธิ์ product:write
 * @returns 200 { data }, 400 id/JSON ไม่ถูกต้อง, 404 ไม่พบ, 409 SKU ซ้ำ, 422 ข้อมูลไม่ผ่านการตรวจ
 */
export async function PUT(req: NextRequest, ctx: Ctx) {
  const guard = await apiGuard("product:write");
  if (!guard.ok) return guard.response;
  const id = await parseId(ctx);
  if (!id) return badId();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON ไม่ถูกต้อง" }, { status: 400 });
  }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "ข้อมูลไม่ถูกต้อง", errors: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  try {
    const product = await prisma.product.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ data: product });
  } catch (e) {
    const code = prismaErrorCode(e);
    if (code === "P2025") return notFound();
    if (code === "P2002") {
      return NextResponse.json({ error: "รหัสสินค้านี้ถูกใช้แล้ว" }, { status: 409 });
    }
    throw e;
  }
}

/**
 * DELETE /api/products/:id — ลบสินค้า ต้องมีสิทธิ์ product:delete (เฉพาะ ADMIN)
 * @returns 200 { success: true }, 400 id ไม่ถูกต้อง, 404 ไม่พบสินค้า
 */
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const guard = await apiGuard("product:delete");
  if (!guard.ok) return guard.response;
  const id = await parseId(ctx);
  if (!id) return badId();

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    if (prismaErrorCode(e) === "P2025") return notFound();
    throw e;
  }
}
