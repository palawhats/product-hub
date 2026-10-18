export type ToastTone = "success" | "error" | "info";
export type ToastItem = { id: number; tone: ToastTone; message: string };

const EMPTY: ToastItem[] = [];
let toasts: ToastItem[] = EMPTY;
let nextId = 1;
let lastKey = "";
let lastAt = 0;
const subscribers = new Set<() => void>();

/**
 * แจ้งผู้ที่ติดตามรายการ Toast ให้อัปเดต
 */
function emit() {
  subscribers.forEach((notify) => notify());
}

/**
 * ลงทะเบียนติดตามการเปลี่ยนแปลงของรายการ Toast (ใช้กับ useSyncExternalStore)
 *
 * @returns ฟังก์ชันยกเลิกการติดตาม
 */
export const subscribeToasts = (notify: () => void) => {
  subscribers.add(notify);
  return () => {
    subscribers.delete(notify);
  };
};
/**
 * คืนรายการ Toast ปัจจุบัน (ฝั่ง client)
 */
export const getToasts = () => toasts;
/**
 * คืนรายการว่างสำหรับตอน render ฝั่ง server (ไม่ให้เกิด hydration mismatch)
 */
export const getServerToasts = () => EMPTY;

/**
 * ปิด Toast ตาม id
 *
 * @param id รหัสของ Toast
 */
export function dismissToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

/**
 * แสดง Toast ใหม่ และปิดเองอัตโนมัติเมื่อครบเวลา
 * ข้ามข้อความซ้ำที่ส่งมาติดกันภายใน 0.4 วินาที (เช่นจาก React Strict Mode ในโหมดพัฒนา)
 *
 * @param tone ชนิด: success | error | info
 * @param message ข้อความที่แสดง
 * @param ttl เวลาก่อนปิดอัตโนมัติ (มิลลิวินาที ค่าเริ่มต้น 5000)
 */
export function pushToast(tone: ToastTone, message: string, ttl = 5000) {
  // กันแจ้งซ้ำภายในเสี้ยววินาที (เช่น React Strict Mode ใน dev)
  const key = `${tone}:${message}`;
  const now = Date.now();
  if (key === lastKey && now - lastAt < 400) return;
  lastKey = key;
  lastAt = now;

  const id = nextId++;
  toasts = [...toasts, { id, tone, message }];
  emit();
  window.setTimeout(() => dismissToast(id), ttl);
}
