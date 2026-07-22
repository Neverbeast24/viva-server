import type { Metadata } from "next";
import { AdminTicketsView, type AdminTicket } from "@/components/admin/tickets";
import { requireStaff } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Support tickets" };

export default async function AdminTicketsPage() {
  await requireStaff();
  const supabase = await createClient();

  const { data } = await supabase
    .from("support_tickets")
    .select(
      "id, user_id, category, priority, subject, description, page_url, status, admin_note, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(200);

  const userIds = [...new Set((data ?? []).map((row) => row.user_id))];
  const { data: profiles } = userIds.length
    ? await supabase
        .from("profiles")
        .select("user_id, display_name, email")
        .in("user_id", userIds)
    : { data: [] as { user_id: string; display_name: string; email: string | null }[] };

  const profileMap = new Map((profiles ?? []).map((row) => [row.user_id, row]));

  const tickets: AdminTicket[] = (data ?? []).map((row) => {
    const profile = profileMap.get(row.user_id);
    return {
      ...row,
      display_name: profile?.display_name ?? "Unknown member",
      email: profile?.email ?? null,
    };
  });

  return <AdminTicketsView tickets={tickets} />;
}
