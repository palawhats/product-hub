import { handlers } from "@/app/auth";

/**
 * Route Handler ของ NextAuth: รับ GET/POST ทุกคำขอภายใต้ /api/auth/* (หน้า signin, callback, session ฯลฯ)
 */
export const { GET, POST } = handlers;
