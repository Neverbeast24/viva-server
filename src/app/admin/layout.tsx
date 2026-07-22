import { AdminShell } from "@/components/admin/shell";
import { isSuperAdmin, requireStaff } from "@/lib/auth/roles";
import type { UserRole } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await requireStaff();
  const supabase = await createClient();

  const [{ data: notifications }, { data: settings }] = await Promise.all([
    supabase
      .from("notifications")
      .select("id, title, body, is_read, created_at, href")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30),
    supabase
      .from("user_settings")
      .select("notifications_enabled")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  return (
    <AdminShell
      displayName={profile?.display_name ?? "Admin"}
      isSuperAdmin={isSuperAdmin(profile?.role as UserRole)}
      notifications={notifications ?? []}
      pushEnabled={settings?.notifications_enabled ?? true}
    >
      {children}
    </AdminShell>
  );
}
