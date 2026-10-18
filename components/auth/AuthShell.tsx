import type { ReactNode } from "react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

/**
 * โครงหน้า Login/Signup แบบแบ่งสองฝั่ง: ซ้ายคือแบรนด์และสโลแกน (ซ่อนบนจอเล็ก) ขวาคือฟอร์ม
 * มีปุ่มเปลี่ยนธีมมุมขวาบน
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="relative hidden overflow-hidden bg-[linear-gradient(140deg,#4f46e5_0%,#5b45e0_45%,#7c3aed_100%)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 size-80 rounded-[3rem] bg-white/10 rotate-12" />
          <div className="absolute top-1/2 -left-20 size-56 rounded-[2.5rem] bg-white/[0.07] -rotate-12" />
          <div className="absolute -right-10 -bottom-16 size-64 rounded-[3rem] bg-black/10 rotate-6" />
        </div>

        <div className="relative flex items-center gap-3">
          <LogoMark size={40} />
          <span className="text-2xl font-bold tracking-tight">StockFlow</span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl leading-tight font-bold tracking-tight">Manage smarter. Work better.</h2>
          <p className="mt-4 text-base leading-relaxed text-white/80">
            จัดการสินค้า สต็อก และสิทธิ์ของทีมในที่เดียว ค้นหาและกรองข้อมูลได้รวดเร็ว
          </p>
        </div>

        <p className="relative text-sm text-white/60">StockFlow · ระบบจัดการสินค้า</p>
      </aside>

      <section className="flex min-h-dvh flex-col bg-canvas">
        <div className="flex items-center justify-between px-5 py-4 sm:px-8">
          <Logo size={30} className="lg:invisible" />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-5 pb-12 sm:px-8">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </section>
    </div>
  );
}
