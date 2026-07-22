"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateSupportTicket } from "@/app/admin/tickets/actions";
import { PrimaryButton } from "@/components/dashboard/ui";

export type AdminTicket = {
  id: number;
  user_id: string;
  category: string;
  priority: string;
  subject: string;
  description: string;
  page_url: string | null;
  status: string;
  admin_note: string | null;
  created_at: string;
  display_name: string;
  email: string | null;
};

const STATUS_STYLE: Record<string, string> = {
  open: "bg-[#fff3e8] text-[#c45c2a]",
  in_progress: "bg-[#e8f0ff] text-[#3b6fd8]",
  resolved: "bg-[#d7efe6] text-[#0e7c66]",
  closed: "bg-[#e8efe9] text-[#6a7a71]",
};

function TicketRow({ ticket }: { ticket: AdminTicket }) {
  const [pending, start] = useTransition();

  function onSubmit(formData: FormData) {
    start(async () => {
      const result = await updateSupportTicket(formData);
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  return (
    <article className="border-b border-black/5 px-5 py-5 last:border-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-bold text-[#1e2f26]">{ticket.subject}</p>
          <p className="mt-1 text-xs text-[#6f8077]">
            #{ticket.id} · {ticket.display_name}
            {ticket.email ? ` · ${ticket.email}` : ""} ·{" "}
            {new Date(ticket.created_at).toLocaleString()}
          </p>
          <p className="mt-1 text-xs capitalize text-[#7a8a81]">
            {ticket.category} · {ticket.priority} priority
            {ticket.page_url ? ` · ${ticket.page_url}` : ""}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
            STATUS_STYLE[ticket.status] ?? STATUS_STYLE.open
          }`}
        >
          {ticket.status.replaceAll("_", " ")}
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5a6b62]">{ticket.description}</p>

      <form action={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <input type="hidden" name="id" value={ticket.id} />
        <label className="block text-xs font-bold text-[#55665d]">
          Status
          <select
            name="status"
            defaultValue={ticket.status}
            className="mt-1.5 w-full rounded-xl border border-[#14221b]/10 bg-white px-3 py-2.5 text-sm font-semibold text-[#1e2f26]"
          >
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <label className="block text-xs font-bold text-[#55665d]">
          Staff note
          <input
            name="admin_note"
            maxLength={1000}
            defaultValue={ticket.admin_note ?? ""}
            placeholder="Optional reply for the member"
            className="mt-1.5 w-full rounded-xl border border-[#14221b]/10 bg-white px-3 py-2.5 text-sm font-semibold text-[#1e2f26]"
          />
        </label>
        <div className="flex items-end">
          <PrimaryButton type="submit" disabled={pending} className="w-full rounded-full px-5 sm:w-auto">
            {pending ? "Saving…" : "Update"}
          </PrimaryButton>
        </div>
      </form>
    </article>
  );
}

export function AdminTicketsView({ tickets }: { tickets: AdminTicket[] }) {
  const openCount = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;

  return (
    <>
      <p className="text-[11px] font-black tracking-[0.2em] text-[#0e7c66]">ADMIN</p>
      <h1 className="font-display mt-2 text-4xl tracking-tight">Support tickets</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5a6b62]">
        Bugs, feature requests, and account issues submitted by members.{" "}
        <span className="font-bold text-[#0e7c66]">{openCount} active</span> right now.
      </p>

      <div className="mt-8 overflow-hidden rounded-[1.6rem] border border-[#14221b]/8 bg-[#f6faf7]/85 shadow-sm">
        {tickets.map((ticket) => (
          <TicketRow
            key={`${ticket.id}-${ticket.status}-${ticket.admin_note ?? ""}`}
            ticket={ticket}
          />
        ))}
        {!tickets.length && (
          <p className="px-5 py-10 text-center text-[#7a8a81]">No tickets yet.</p>
        )}
      </div>
    </>
  );
}
