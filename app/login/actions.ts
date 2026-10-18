"use server";

import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn } from "@/app/auth";
import { safeRedirect } from "@/app/lib/utils";

export type LoginState = { error?: string };

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(1),
});

/**
 * Server Action: ล็อกอินด้วยอีเมล+รหัสผ่าน (ใช้กับ useActionState ของฟอร์ม)
 * ตรวจรูปแบบข้อมูลก่อน แล้วเรียก signIn พาไปหน้า callbackUrl ที่ปลอดภัย
 * ถ้าอีเมล/รหัสผ่านผิดจะคืนข้อความผิดพลาดให้แสดงบนฟอร์ม (ไม่บอกว่าผิดที่ช่องใด)
 *
 * @param _prev state เดิมของฟอร์ม (ไม่ได้ใช้)
 * @param formData ช่อง email, password, callbackUrl
 * @returns { error } เมื่อล็อกอินไม่สำเร็จ
 */
export async function loginWithCredentials(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "กรุณากรอกอีเมลและรหัสผ่านให้ถูกต้อง" };

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: safeRedirect(formData.get("callbackUrl")?.toString()),
    });
  } catch (e) {
    if (e instanceof AuthError) return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
    throw e; // redirect ของ Next.js ต้อง throw ต่อ
  }
  return {};
}

/**
 * Server Action: เริ่มล็อกอินด้วย GitHub แล้วพาไปหน้า callbackUrl ที่ปลอดภัยหลังสำเร็จ
 *
 * @param formData ช่อง callbackUrl
 */
export async function loginWithGithub(formData: FormData) {
  await signIn("github", {
    redirectTo: safeRedirect(formData.get("callbackUrl")?.toString()),
  });
}
