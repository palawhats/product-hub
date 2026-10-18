"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { loginWithCredentials, loginWithGithub, type LoginState } from "./actions";
import { GithubIcon, Icon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Field, inputClass } from "@/components/ui/Field";

/**
 * ฟอร์มเข้าสู่ระบบ (client component)
 * - ส่งข้อมูลผ่าน Server Action loginWithCredentials ด้วย useActionState (แสดงสถานะกำลังโหลดและข้อผิดพลาด)
 * - ปุ่มแสดง/ซ่อนรหัสผ่าน
 * - ปุ่มเข้าสู่ระบบด้วย GitHub (เมื่อเปิดใช้งาน)
 *
 * @param callbackUrl หน้าปลายทางหลังล็อกอิน
 * @param registered true เมื่อเพิ่งสมัครสมาชิกสำเร็จ (แสดงข้อความแจ้ง)
 * @param githubEnabled เปิดใช้การล็อกอินด้วย GitHub หรือไม่
 */
export default function LoginForm({
  callbackUrl,
  registered,
  githubEnabled,
}: {
  callbackUrl: string;
  registered: boolean;
  githubEnabled: boolean;
}) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginWithCredentials, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">เข้าสู่ระบบเพื่อจัดการสินค้าของคุณ</p>

      {registered && (
        <p role="status" className="mt-5 rounded-lg bg-success-soft p-3 text-sm text-success-text">
          สร้างบัญชีสำเร็จ กรุณาเข้าสู่ระบบ
        </p>
      )}

      <form action={action} className="mt-6 space-y-4" aria-busy={pending}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        <Field label="อีเมล">
          {(c) => (
            <input
              {...c}
              name="email"
              type="email"
              placeholder="name@company.com"
              autoComplete="email"
              required
              disabled={pending}
              className={inputClass}
            />
          )}
        </Field>

        <Field label="รหัสผ่าน">
          {(c) => (
            <div className="relative">
              <input
                {...c}
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="รหัสผ่านของคุณ"
                autoComplete="current-password"
                required
                disabled={pending}
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted transition-colors duration-150 hover:text-fg"
              >
                <Icon name={showPassword ? "eyeOff" : "eye"} size={18} />
              </button>
            </div>
          )}
        </Field>

        <div aria-live="polite">
          {state.error && (
            <p role="alert" className="flex items-start gap-2 rounded-lg bg-danger-soft p-3 text-sm text-danger-text">
              <Icon name="alertCircle" size={16} className="mt-0.5 shrink-0" />
              {state.error}
            </p>
          )}
        </div>

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </Button>
      </form>

      {githubEnabled && (
        <>
          <div className="my-5 flex items-center gap-3 text-xs text-muted">
            <span className="h-px flex-1 bg-line" />
            หรือ
            <span className="h-px flex-1 bg-line" />
          </div>
          <form action={loginWithGithub}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <Button type="submit" variant="secondary" className="w-full">
              <GithubIcon />
              เข้าสู่ระบบด้วย GitHub
            </Button>
          </form>
        </>
      )}

      <p className="mt-8 text-center text-sm text-muted">
        ยังไม่มีบัญชี?{" "}
        <Link href="/signup" className="font-semibold text-primary-text hover:underline">
          สมัครสมาชิก
        </Link>
      </p>
    </div>
  );
}
