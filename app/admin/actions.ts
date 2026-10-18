"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/app/lib/prisma";
import { isRole, requirePermission } from "@/app/lib/rbac";

/**
 * Server Action: เปลี่ยนสิทธิ์ (role) ของผู้ใช้ — เฉพาะผู้มีสิทธิ์ user:manage (ADMIN)
 * ห้ามเปลี่ยนสิทธิ์ของตัวเอง เพื่อไม่ให้ระบบเหลือ ADMIN เป็นศูนย์
 * เมื่อสำเร็จไป /admin?updated=1 ถ้าผิดพลาดไป /admin?error=1
 *
 * @param formData ต้องมีช่อง userId และ role
 */
export async function updateUserRole(formData: FormData) {
  const admin = await requirePermission("user:manage", "/admin");
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");

  // ห้ามเปลี่ยนสิทธิ์ตัวเอง เพื่อไม่ให้ระบบเหลือ ADMIN เป็นศูนย์
  if (!userId || !isRole(role) || userId === admin.id) redirect("/admin?error=1");

  try {
    await prisma.user.update({ where: { id: userId }, data: { role } });
  } catch {
    redirect("/admin?error=1");
  }
  revalidatePath("/admin");
  redirect("/admin?updated=1");
}
