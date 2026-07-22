"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { notifyStaff } from "@/lib/notifications/notify";
import { createClient } from "@/lib/supabase/server";

const TICKET_RATE_LIMIT = 5;
const TICKET_RATE_WINDOW_MS = 60 * 60 * 1000;

const ticketSchema = z.object({
  category: z.enum(["bug", "feature", "account", "other"]),
  priority: z.enum(["low", "normal", "high"]),
  subject: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(2000),
  page_url: z.preprocess(
    (value) => (value === "" || value == null ? null : value),
    z.string().trim().max(500).nullable(),
  ),
});

export async function submitSupportTicket(formData: FormData) {
  const parsed = ticketSchema.safeParse({
    category: formData.get("category"),
    priority: formData.get("priority") || "normal",
    subject: formData.get("subject"),
    description: formData.get("description"),
    page_url: formData.get("page_url"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid ticket details.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Not signed in." };

  const windowStart = new Date(Date.now() - TICKET_RATE_WINDOW_MS).toISOString();
  const { count: recentCount, error: rateError } = await supabase
    .from("support_tickets")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", windowStart);

  if (rateError) {
    console.error("support_tickets rate check failed:", rateError.message);
    return { ok: false, message: "Could not submit your ticket. Please try again." };
  }
  if ((recentCount ?? 0) >= TICKET_RATE_LIMIT) {
    return {
      ok: false,
      message: `Please wait before sending more tickets (max ${TICKET_RATE_LIMIT} per hour).`,
    };
  }

  const { data, error } = await supabase
    .from("support_tickets")
    .insert({
      user_id: user.id,
      ...parsed.data,
      status: "open",
    })
    .select("id")
    .single();

  if (error) {
    console.error("support_tickets insert failed:", error.message);
    return { ok: false, message: "Could not submit your ticket. Please try again." };
  }

  const priorityLabel =
    parsed.data.priority === "high"
      ? "High priority"
      : parsed.data.priority === "low"
        ? "Low priority"
        : "Normal priority";

  try {
    await notifyStaff({
      title: "New support ticket",
      body: `#${data.id} · ${priorityLabel} · ${parsed.data.subject}`,
      href: "/admin/tickets",
    });
  } catch (notifyError) {
    console.error("staff ticket notify failed:", notifyError);
  }

  revalidatePath("/dashboard/support");
  revalidatePath("/admin/tickets");
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  await writeAuditLog({
    action: "support_ticket_submitted",
    entity: "support_tickets",
    entityId: String(data.id),
    metadata: {
      category: parsed.data.category,
      priority: parsed.data.priority,
      subject: parsed.data.subject,
    },
  });

  return { ok: true, message: "Ticket submitted — we’ll take a look." };
}
