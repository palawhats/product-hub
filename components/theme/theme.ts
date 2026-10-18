export type Theme = "light" | "dark" | "system";

export const THEME_KEY = "prodexa-theme";

/**
 * แปลงค่าที่เก็บไว้เป็นธีมที่ถูกต้อง: "light" หรือ "dark" ตามเดิม ค่าอื่น/ว่างถือเป็น "system"
 *
 * @param value ค่าที่อ่านจาก localStorage
 */
export function parseTheme(value: string | null): Theme {
  return value === "light" || value === "dark" ? value : "system";
}

/**
 * นำธีมไปใช้กับหน้าเว็บ: เพิ่ม/ลบคลาส dark บน <html> และตั้ง color-scheme
 * ถ้าเป็น "system" จะดูจากการตั้งค่าของระบบปฏิบัติการ
 *
 * @param theme ธีมที่เลือก
 */
export function applyTheme(theme: Theme): void {
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
}

/**
 * สคริปต์ที่รันก่อนวาดหน้า (inline ใน <head>) เพื่อไม่ให้เกิด flash ของธีมผิด
 * ต้องคงตรรกะเดียวกับ applyTheme
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_KEY,
)});var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;if(d)r.classList.add("dark");r.style.colorScheme=d?"dark":"light"}catch(e){}})();`;
