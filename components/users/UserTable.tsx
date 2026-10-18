import { updateUserRole } from "@/app/admin/actions";
import { ROLES } from "@/app/lib/rbac";
import { formatDate, formatNumber } from "@/app/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { selectClass } from "@/components/users/select-class";
import { RoleBadge } from "./RoleBadge";

export type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  productCount: number;
};

/**
 * ฟอร์มเปลี่ยนบทบาทของผู้ใช้ 1 คน (เรียก Server Action updateUserRole)
 * ถ้าเป็นบัญชีของตัวเองจะแสดงเป็นป้ายอย่างเดียว เพราะห้ามเปลี่ยนสิทธิ์ตัวเอง
 */
function RoleForm({ user, isSelf }: { user: UserRow; isSelf: boolean }) {
  if (isSelf) return <RoleBadge role={user.role} />;
  return (
    <form action={updateUserRole} className="flex items-center gap-2">
      <input type="hidden" name="userId" value={user.id} />
      <select
        name="role"
        defaultValue={user.role}
        aria-label={`สิทธิ์ของ ${user.name ?? user.email}`}
        className={selectClass}
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <Button type="submit" variant="secondary" size="sm">
        บันทึก
      </Button>
    </form>
  );
}

/**
 * แสดงอวาตาร์ ชื่อ และอีเมลของผู้ใช้ (พร้อมป้าย "คุณ" ถ้าเป็นบัญชีตัวเอง)
 */
function Identity({ user, isSelf }: { user: UserRow; isSelf: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={user.name} email={user.email} size={36} />
      <div className="min-w-0">
        <p className="truncate font-medium">
          {user.name ?? "-"}
          {isSelf && <Badge tone="primary" className="ml-2">คุณ</Badge>}
        </p>
        <p className="truncate text-xs text-muted">{user.email}</p>
      </div>
    </div>
  );
}

/**
 * แสดงรายชื่อผู้ใช้: ตารางบนจอใหญ่และการ์ดบนมือถือ (ชื่อ วันที่สมัคร จำนวนสินค้า และฟอร์มเปลี่ยนบทบาท)
 */
export function UserTable({ users, currentUserId }: { users: UserRow[]; currentUserId: string }) {
  if (users.length === 0) {
    return (
      <Card>
        <EmptyState icon="users" title="ยังไม่มีผู้ใช้" />
      </Card>
    );
  }

  return (
    <>
      <Card className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">รายชื่อผู้ใช้</caption>
          <thead className="border-b border-line bg-hover text-xs text-muted">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">ผู้ใช้</th>
              <th scope="col" className="px-4 py-3 font-semibold">สมัครเมื่อ</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">สินค้าที่บันทึก</th>
              <th scope="col" className="px-4 py-3 font-semibold">สิทธิ์</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => (
              <tr key={u.id} className="transition-colors duration-150 hover:bg-hover">
                <td className="max-w-xs px-4 py-3">
                  <Identity user={u} isSelf={u.id === currentUserId} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted">{formatDate(u.createdAt)}</td>
                <td className="tabular px-4 py-3 text-right">{formatNumber(u.productCount)}</td>
                <td className="px-4 py-3">
                  <RoleForm user={u} isSelf={u.id === currentUserId} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <ul className="space-y-3 md:hidden">
        {users.map((u) => (
          <li key={u.id}>
            <Card className="p-4">
              <Identity user={u} isSelf={u.id === currentUserId} />
              <dl className="mt-3 grid grid-cols-2 gap-x-4 text-sm">
                <div>
                  <dt className="text-xs text-muted">สมัครเมื่อ</dt>
                  <dd>{formatDate(u.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">สินค้าที่บันทึก</dt>
                  <dd className="tabular">{formatNumber(u.productCount)}</dd>
                </div>
              </dl>
              <div className="mt-3 border-t border-line pt-3">
                <RoleForm user={u} isSelf={u.id === currentUserId} />
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
