import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Thai } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { THEME_INIT_SCRIPT } from "@/components/theme/theme";
import { FlashToast } from "@/components/ui/FlashToast";
import { Toaster } from "@/components/ui/Toaster";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const notoThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "StockFlow — Manage smarter. Work better.", template: "%s | StockFlow" },
  description: "StockFlow ระบบจัดการสินค้า สต็อก และสิทธิ์ผู้ใช้ในที่เดียว",
  applicationName: "StockFlow",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1120" },
  ],
};

/**
 * Layout รากของทั้งเว็บ: ตั้งภาษาไทย, โหลดฟอนต์ Inter + Noto Sans Thai, ฝังสคริปต์ตั้งธีมก่อนวาดหน้า
 * (กัน flash ของธีมผิด) ลิงก์ข้ามไปเนื้อหาหลัก (เพื่อการเข้าถึง) และครอบทุกหน้าด้วย AppShell
 * พร้อม Toaster/FlashToast สำหรับการแจ้งเตือน
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning className={`${inter.variable} ${notoThai.variable} h-full`}>
      <head>
        {/* ตั้งธีมก่อนวาดหน้าแรก ป้องกัน flash ของธีมผิด */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full bg-canvas font-sans text-fg antialiased">
        <a
          href="#main-content"
          className="sr-only z-[70] rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-fg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          ข้ามไปยังเนื้อหาหลัก
        </a>
        <AppShell>{children}</AppShell>
        <Toaster />
        <Suspense fallback={null}>
          <FlashToast />
        </Suspense>
      </body>
    </html>
  );
}
