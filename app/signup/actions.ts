"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { fieldErrors, signUpSchema, type FieldErrors } from "@/app/lib/validation";
import { prismaErrorCode } from "@/app/lib/utils";

export type SignUpState = { errors?: FieldErrors; values?: { name: string; email: string } };

/**
 * Server Action: สมัครสมาชิกใหม่ (ใช้กับ useActionState)
 * ตรวจข้อมูลด้วย signUpSchema -> เข้ารหัสรหัสผ่านด้วย bcrypt (cost 12) -> สร้างผู้ใช้ role USER
 * ถ้าอีเมลซ้ำ (P2002) คืนข้อความใต้ช่องอีเมล สำเร็จแล้วพาไป /login?registered=1
 *
 * @param _prev state เดิมของฟอร์ม (ไม่ได้ใช้)
 * @param formData ช่อง name, email, password, confirmPassword
 * @returns { errors, values } เมื่อข้อมูลไม่ผ่านการตรวจ
 */
export async function signUp(_prev: SignUpState, formData: FormData): Promise<SignUpState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };
  const values = { name: raw.name, email: raw.email };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const { name, email, password } = parsed.data;
  try {
    await prisma.user.create({
      data: { name, email, passwordHash: await bcrypt.hash(password, 12), role: "USER" },
    });
  } catch (e) {
    if (prismaErrorCode(e) === "P2002") {
      return { errors: { email: ["อีเมลนี้ถูกใช้งานแล้ว"] }, values };
    }
    throw e;
  }
  redirect("/login?registered=1");
}
