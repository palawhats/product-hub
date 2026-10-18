"use client";

import { useEffect } from "react";
import { Icon, type IconName } from "@/components/icons";
import { Dropdown } from "@/components/ui/Dropdown";
import { cn } from "@/components/lib/cn";
import { useLocalValue, writeLocal } from "@/components/lib/local-store";
import { applyTheme, parseTheme, THEME_KEY, type Theme } from "./theme";

const OPTIONS: Array<{ value: Theme; label: string; icon: IconName }> = [
  { value: "light", label: "สว่าง", icon: "sun" },
  { value: "dark", label: "มืด", icon: "moon" },
  { value: "system", label: "ตามระบบ", icon: "monitor" },
];

/**
 * ปุ่มเลือกธีม (สว่าง / มืด / ตามระบบ) แบบเมนูดรอปดาวน์
 * เก็บค่าที่เลือกใน localStorage และใช้ทันที ในโหมด "ตามระบบ" จะติดตามเมื่อระบบเปลี่ยนธีมแบบสด
 * ไอคอนสลับด้วย CSS ตามคลาส dark จึงตรงกับธีมจริงตั้งแต่ก่อน hydrate
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = parseTheme(useLocalValue(THEME_KEY));

  // เมื่ออยู่ในโหมด "ตามระบบ": ฟังการเปลี่ยนธีมของระบบปฏิบัติการ แล้วปรับหน้าเว็บตาม
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    // ระบบเปลี่ยนธีม (สว่าง/มืด) -> คำนวณและใช้ธีมใหม่ทันที
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  /**
   * บันทึกธีมที่ผู้ใช้เลือกลง localStorage และนำไปใช้กับหน้าเว็บทันที
   *
   * @param next ธีมที่เลือก
   */
  function choose(next: Theme) {
    writeLocal(THEME_KEY, next);
    applyTheme(next);
  }

  return (
    <Dropdown
      label="เปลี่ยนธีม"
      className={className}
      triggerClassName="size-9 justify-center rounded-lg text-muted hover:bg-hover hover:text-fg"
      trigger={
        // ไอคอนสลับด้วย CSS ตามคลาส .dark จึงตรงกับธีมจริงตั้งแต่ก่อน hydrate
        <>
          <Icon name="sun" size={18} className="dark:hidden" />
          <Icon name="moon" size={18} className="hidden dark:block" />
        </>
      }
    >
      {(close) => (
        <div role="group" aria-label="ธีม" className="w-40 p-1">
          {OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              role="menuitemradio"
              aria-checked={theme === o.value}
              onClick={() => {
                choose(o.value);
                close();
              }}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors duration-150 hover:bg-hover",
                theme === o.value ? "font-semibold text-primary-text" : "text-fg",
              )}
            >
              <Icon name={o.icon} size={16} />
              {o.label}
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  );
}
