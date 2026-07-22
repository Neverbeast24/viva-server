import type { Metadata } from "next";
import { SupportView, type SupportTicket } from "@/components/dashboard/support";
import { requireUser } from "@/lib/auth/roles";

export const metadata: Metadata = { title: "Support" };

export default async function SupportPage() {
  const { supabase, user } = await requireUser();

  const { data } = await supabase
    .from("support_tickets")
    .select(
      "id, category, priority, subject, description, page_url, status, admin_note, created_at, resolved_at",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return <SupportView tickets={(data ?? []) as SupportTicket[]} />;
}
