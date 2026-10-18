/**
 * รวมชื่อคลาส CSS เข้าด้วยกัน โดยข้ามค่าที่เป็น false/null/undefined
 * เขียนเงื่อนไขได้สั้น เช่น cn("a", active && "b")
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
