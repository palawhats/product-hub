const thb = new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" });
const num = new Intl.NumberFormat("th-TH");

/**
 * จัดรูปแบบตัวเลขเป็นสกุลเงินบาทแบบไทย เช่น 1290 -> "฿1,290.00"
 *
 * @param n จำนวนเงิน
 */
export const formatTHB = (n: number) => thb.format(n);
/**
 * จัดรูปแบบตัวเลขแบบไทย มีตัวคั่นหลักพัน เช่น 12000 -> "12,000"
 *
 * @param n ตัวเลขที่ต้องการแสดง
 */
export const formatNumber = (n: number) => num.format(n);

/**
 * กัน open redirect: อนุญาตเฉพาะ path ภายในเว็บของเราเท่านั้น
 * ปฏิเสธค่าที่ขึ้นต้นด้วย // หรือ /\ (ซึ่งอาจพาไปเว็บอื่น) และค่าที่ไม่ได้ขึ้นต้นด้วย /
 *
 * @param path path ที่ได้รับมา (มักมาจาก callbackUrl ใน URL)
 * @param fallback ค่าที่ใช้แทนเมื่อ path ไม่ปลอดภัย
 * @returns path ที่ปลอดภัย หรือ fallback
 */
export function safeRedirect(path: string | null | undefined, fallback = "/products") {
  if (path && path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/\\")) {
    return path;
  }
  return fallback;
}

/**
 * ดึงรหัสข้อผิดพลาดของ Prisma ออกจาก error ที่ไม่ทราบชนิด
 * เช่น P2002 = ข้อมูลซ้ำ (unique), P2025 = ไม่พบรายการ
 *
 * @param e error ที่จับได้จาก catch
 * @returns รหัสเป็นข้อความ หรือ undefined ถ้า error ไม่มี code
 */
export function prismaErrorCode(e: unknown): string | undefined {
  return typeof e === "object" && e !== null && "code" in e
    ? String((e as { code: unknown }).code)
    : undefined;
}

const dateFmt = new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeZone: "Asia/Bangkok" });

/**
 * จัดรูปแบบวันที่แบบไทย (เขตเวลา Asia/Bangkok) เช่น "18 ต.ค. 2569"
 *
 * @param d วันที่ที่ต้องการแสดง
 */
export const formatDate = (d: Date) => dateFmt.format(d);
