"use server";

import { signOut } from "@/app/auth";

/**
 * Server Action: ออกจากระบบ ล้าง session แล้วพากลับหน้าแรก
 */
export async function logout() {
  await signOut({ redirectTo: "/" });
}
