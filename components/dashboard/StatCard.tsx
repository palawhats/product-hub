import { Icon, type IconName } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { cn } from "@/components/lib/cn";

const TONES = {
  primary: "bg-primary-soft text-primary-text",
  success: "bg-success-soft text-success-text",
  warning: "bg-warning-soft text-warning-text",
  teal: "bg-teal-soft text-teal-text",
} as const;

/**
 * การ์ดสถิติบน Dashboard: ชื่อ ตัวเลขใหญ่ คำอธิบายรอง และไอคอนสีตามโทน
 */
export function StatCard({
  icon,
  label,
  value,
  description,
  tone = "primary",
}: {
  icon: IconName;
  label: string;
  value: string;
  description: string;
  tone?: keyof typeof TONES;
}) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted">{label}</p>
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", TONES[tone])}>
          <Icon name={icon} size={18} />
        </span>
      </div>
      <p className="tabular mt-3 text-2xl font-bold tracking-tight break-words text-fg sm:text-[1.65rem]">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted">{description}</p>
    </Card>
  );
}
