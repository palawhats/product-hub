import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";

import prisma from "@/app/lib/prisma";

/**
 * ตั้งค่า NextAuth (Auth.js) ของทั้งระบบ แล้วส่งออกเครื่องมือที่ใช้ร่วมกัน
 * - handlers : ตัวจัดการ GET/POST ของ /api/auth/*
 * - signIn / signOut : ฟังก์ชันเข้าสู่ระบบ/ออกจากระบบ (เรียกจาก Server Action)
 * - auth : อ่าน session ปัจจุบันฝั่ง server
 *
 * รองรับล็อกอิน 2 วิธี: อีเมล+รหัสผ่าน (Credentials) และ GitHub
 * ใช้ session แบบ JWT และพาไปหน้า /login เมื่อต้องล็อกอิน
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /**
       * ตรวจอีเมล/รหัสผ่านของการล็อกอินแบบ Credentials
       * 1) ถ้าไม่มีอีเมลหรือรหัสผ่าน -> คืน null (ล็อกอินไม่ผ่าน)
       * 2) ค้นผู้ใช้จากอีเมล (แปลงเป็นตัวพิมพ์เล็ก) ถ้าไม่พบหรือไม่มี passwordHash (บัญชี GitHub) -> null
       * 3) เทียบรหัสผ่านกับ hash ด้วย bcrypt ถ้าไม่ตรง -> null
       *
       * @param credentials ค่า email/password ที่ส่งมาจากฟอร์ม
       * @returns ข้อมูลผู้ใช้ {id, name, email, role} เมื่อสำเร็จ หรือ null เมื่อไม่ผ่าน
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).trim().toLowerCase();
        const user = await prisma.user.findUnique({ where: { email } });
        // บัญชี GitHub ไม่มี passwordHash จึงล็อกอินด้วยรหัสผ่านไม่ได้
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(String(credentials.password), user.passwordHash);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    /**
     * Callback ที่ทำงานทุกครั้งที่ล็อกอิน
     * เมื่อล็อกอินด้วย GitHub จะสร้างผู้ใช้ในฐานข้อมูลถ้ายังไม่มี (upsert, role เริ่มต้น USER)
     * เพื่อให้ ADMIN จัดการสิทธิ์ผู้ใช้นั้นได้ ถ้า GitHub ไม่ส่งอีเมลมา จะปฏิเสธการล็อกอิน
     *
     * @returns true = อนุญาตให้ล็อกอิน, false = ปฏิเสธ
     */
    async signIn({ user, account }) {
      if (account?.provider === "github") {
        if (!user.email) return false;
        const email = user.email.toLowerCase();
        await prisma.user.upsert({
          where: { email },
          update: {},
          create: { email, name: user.name ?? null, role: "USER" },
        });
      }
      return true;
    },
    /**
     * Callback ที่สร้าง/อัปเดต JWT token
     * - เพิ่งล็อกอิน (มี user): ดึง id และ role จริงจากฐานข้อมูลใส่ใน token
     * - request ถัดมา (มี token.id): sync role ล่าสุดจากฐานข้อมูลทุกครั้ง
     *   ทำให้การเปลี่ยนสิทธิ์หรือการลบบัญชีมีผลทันทีโดยไม่ต้องล็อกอินใหม่
     *
     * @returns token ที่อัปเดตแล้ว
     */
    async jwt({ token, user }) {
      if (user?.email) {
        // เพิ่งล็อกอิน: ดึง id/role จริงจากฐานข้อมูล
        const db = await prisma.user.findUnique({
          where: { email: user.email.toLowerCase() },
          select: { id: true, role: true },
        });
        token.id = db?.id;
        token.role = db?.role;
      } else if (token.id) {
        // ทุก request: sync role ล่าสุด ให้การเปลี่ยนสิทธิ์/ลบบัญชีมีผลทันที
        const db = await prisma.user.findUnique({
          where: { id: token.id },
          select: { role: true },
        });
        token.role = db?.role;
      }
      return token;
    },
    /**
     * Callback ที่สร้างอ็อบเจ็กต์ session ซึ่งฝั่งเว็บอ่านได้
     * คัดลอก id และ role จาก token มาไว้ใน session.user
     *
     * @returns session ที่เพิ่ม id/role แล้ว
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.role = String(token.role ?? "");
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
});
