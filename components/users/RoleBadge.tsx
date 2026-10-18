import { Badge, type BadgeTone } from "@/components/ui/Badge";

const TONE: Record<string, BadgeTone> = {
  ADMIN: "primary", // Indigo
  STAFF: "teal",
  USER: "neutral", // Slate
};

/**
 * ป้ายบทบาทผู้ใช้ แยกสี: ADMIN = indigo, STAFF = teal, USER = เทา
 */
export function RoleBadge({ role }: { role: string }) {
  return <Badge tone={TONE[role] ?? "neutral"}>{role}</Badge>;
}
