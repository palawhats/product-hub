"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp, type SignUpState } from "./actions";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Field, inputClass } from "@/components/ui/Field";

/**
 * หน้าสมัครสมาชิก (client component): ส่งข้อมูลผ่าน Server Action signUp
 * แสดงข้อความผิดพลาดใต้แต่ละช่อง และเก็บชื่อ/อีเมลที่กรอกไว้เมื่อข้อมูลไม่ผ่านการตรวจ
 */
export default function SignUpPage() {
  const [state, action, pending] = useActionState<SignUpState, FormData>(signUp, {});
  const e = state.errors;

  return (
    <AuthShell>
      <h1 className="text-3xl font-bold tracking-tight">สมัครสมาชิก</h1>
      <p className="mt-2 text-sm text-muted">บัญชีใหม่จะได้สิทธิ์ USER (ดูข้อมูลสินค้าได้)</p>

      <form action={action} className="mt-6 space-y-4" aria-busy={pending}>
        <Field label="ชื่อ" error={e?.name?.[0]}>
          {(c) => (
            <input {...c} name="name" defaultValue={state.values?.name} required disabled={pending} className={inputClass} />
          )}
        </Field>
        <Field label="อีเมล" error={e?.email?.[0]}>
          {(c) => (
            <input
              {...c}
              name="email"
              type="email"
              defaultValue={state.values?.email}
              autoComplete="email"
              required
              disabled={pending}
              className={inputClass}
            />
          )}
        </Field>
        <Field label="รหัสผ่าน" hint="อย่างน้อย 8 ตัว มีตัวอักษรและตัวเลข" error={e?.password?.[0]}>
          {(c) => (
            <input
              {...c}
              name="password"
              type="password"
              autoComplete="new-password"
              required
              disabled={pending}
              className={inputClass}
            />
          )}
        </Field>
        <Field label="ยืนยันรหัสผ่าน" error={e?.confirmPassword?.[0]}>
          {(c) => (
            <input
              {...c}
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              disabled={pending}
              className={inputClass}
            />
          )}
        </Field>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "กำลังสร้างบัญชี..." : "สร้างบัญชี"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        มีบัญชีแล้ว?{" "}
        <Link href="/login" className="font-semibold text-primary-text hover:underline">
          เข้าสู่ระบบ
        </Link>
      </p>
    </AuthShell>
  );
}
