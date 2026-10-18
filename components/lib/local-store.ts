"use client";

import { useSyncExternalStore } from "react";

const listeners = new Map<string, Set<() => void>>();

/**
 * อ่านค่าจาก localStorage อย่างปลอดภัย (ถ้าเบราว์เซอร์บล็อกการเข้าถึงจะคืน null แทนที่จะ error)
 */
export function readLocal(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * เขียนค่าลง localStorage แล้วแจ้งคอมโพเนนต์ที่ติดตามคีย์นั้นให้อัปเดตทันที
 * (ถ้าเขียนไม่ได้ เช่นโหมดส่วนตัวที่ปิดการเก็บ จะข้ามไปโดยไม่ error)
 */
export function writeLocal(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // เบราว์เซอร์ปิดการเก็บข้อมูล — ใช้ค่าเฉพาะใน session นี้ต่อไป
  }
  listeners.get(key)?.forEach((notify) => notify());
}

/**
 * Hook อ่านค่า localStorage แบบ reactive: ค่าเปลี่ยน (ในแท็บนี้หรือแท็บอื่น) คอมโพเนนต์จะ render ใหม่เอง
 * ฝั่ง server คืน null เสมอ จึงไม่เกิด hydration mismatch
 *
 * @param key ชื่อคีย์ใน localStorage
 */
export function useLocalValue(key: string): string | null {
  return useSyncExternalStore(
    // subscribe: ลงทะเบียนให้ React เรียก notify เมื่อค่าของคีย์นี้เปลี่ยน (ทั้งในแท็บนี้และจากแท็บอื่น)
    (notify) => {
      let set = listeners.get(key);
      if (!set) {
        set = new Set();
        listeners.set(key, set);
      }
      set.add(notify);
      // เมื่อแท็บอื่นแก้ localStorage คีย์เดียวกัน ให้แจ้งอัปเดตในแท็บนี้ด้วย
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) notify();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        set.delete(notify);
        window.removeEventListener("storage", onStorage);
      };
    },
    () => readLocal(key),
    () => null,
  );
}
