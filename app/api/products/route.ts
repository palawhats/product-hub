import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { apiGuard } from "@/app/lib/rbac";
import { listProducts, parseProductQuery } from "@/app/lib/products";
import { fieldErrors, productSchema } from "@/app/lib/validation";
import { prismaErrorCode } from "@/app/lib/utils";

/**
 * GET /api/products?q=&category=&status=&stock=&sort=&page=&pageSize=
 * คืนรายการสินค้าแบบแบ่งหน้า — ต้องมีสิทธิ์ product:read (ไม่ผ่านคืน 401/403)
 *
 * @returns 200 { data: สินค้า[], meta: { total, page, pageSize, totalPages } }
 */
export async function GET(req: NextRequest) {
  const guard = await apiGuard("product:read");
  if (!guard.ok) return guard.response;

  const params = req.nextUrl.searchParams;
  const { items, ...meta } = await listProducts(parseProductQuery((k) => params.get(k)));
  return NextResponse.json({ data: items, meta });
}

/**
 * POST /api/products — เพิ่มสินค้าใหม่ ต้องมีสิทธิ์ product:write
 * @returns 201 { data } เมื่อสำเร็จ, 400 JSON ไม่ถูกต้อง, 422 ข้อมูลไม่ผ่านการตรวจ, 409 SKU ซ้ำ
 */
export async function POST(req: NextRequest) {
  const guard = await apiGuard("product:write");
  if (!guard.ok) return guard.response;

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
    const product = await prisma.product.create({
      data: { ...parsed.data, createdById: guard.user.id },
    });
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (e) {
    if (prismaErrorCode(e) === "P2002") {
      return NextResponse.json({ error: "รหัสสินค้านี้ถูกใช้แล้ว" }, { status: 409 });
    }
    throw e;
  }
}
