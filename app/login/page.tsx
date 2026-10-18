import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/rbac";
import { safeRedirect } from "@/app/lib/utils";
import { AuthShell } from "@/components/auth/AuthShell";
import LoginForm from "./login-form";

export const metadata: Metadata = { title: "เข้าสู่ระบบ" };

/**
 * หน้าเข้าสู่ระบบ: ถ้าล็อกอินอยู่แล้วให้ไปยังหน้าปลายทาง (callbackUrl ที่ผ่าน safeRedirect) ทันที
 * ถ้ายังไม่ล็อกอินแสดงฟอร์ม และจะแสดงปุ่ม GitHub เฉพาะเมื่อมีการตั้งค่า AUTH_GITHUB_ID/SECRET
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; registered?: string }>;
}) {
  const sp = await searchParams;
  const callbackUrl = safeRedirect(sp.callbackUrl);
  if (await getCurrentUser()) redirect(callbackUrl);

  return (
    <AuthShell>
      <LoginForm
        callbackUrl={callbackUrl}
        registered={Boolean(sp.registered)}
        githubEnabled={Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET)}
      />
    </AuthShell>
  );
}
