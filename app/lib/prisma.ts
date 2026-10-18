import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Prisma Client ตัวเดียวของทั้งแอป (singleton) เชื่อมฐานข้อมูล SQLite ผ่าน better-sqlite3 adapter
 * ในโหมดพัฒนาจะเก็บไว้ที่ globalThis เพื่อไม่ให้สร้าง client ใหม่ทุกครั้งที่ hot-reload
 * จนเปิดการเชื่อมต่อค้างเกินจำเป็น
 */
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! }),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
