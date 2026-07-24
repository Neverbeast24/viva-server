"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Send } from "lucide-react";
import {
  SITE_CONTACT,
  contactMailto,
  type ContactPlan,
} from "@/lib/contact";

const topics: { value: ContactPlan; label: string }[] = [
  { value: "general", label: "General inquiry" },
  { value: "plus", label: "Plus (₱299/mo)" },
  { value: "campus", label: "Campus / teams" },
];

export function InquiryForm({ defaultPlan = "general" }: { defaultPlan?: ContactPlan }) {
  const [plan, setPlan] = useState<ContactPlan>(defaultPlan);
  const [name, setName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");

  const href = useMemo(
    () =>
      contactMailto(plan, {
        name: name.trim() || undefined,
        fromEmail: fromEmail.trim() || undefined,
        organization: organization.trim() || undefined,
        message: message.trim() || undefined,
      }),
    [plan, name, fromEmail, organization, message],
  );

  return (
    <form
      className="rounded-[1.8rem] border border-ink/8 bg-card/95 p-6 shadow-[0_14px_32px_rgba(var(--shadow-color),.08)] sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = href;
      }}
    >
      <p className="text-[11px] font-black tracking-[0.18em] text-accent">SEND AN INQUIRY</p>
      <h2 className="font-display mt-2 text-2xl text-ink">Message {SITE_CONTACT.name}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        Opens your email app with a filled message to {SITE_CONTACT.email}. You can also call{" "}
        <a href={`tel:${SITE_CONTACT.phoneTel}`} className="font-bold text-accent hover:underline">
          {SITE_CONTACT.phoneDisplay}
        </a>
        .
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {topics.map((topic) => (
          <button
            key={topic.value}
            type="button"
            onClick={() => setPlan(topic.value)}
            className={`rounded-xl border px-3 py-2.5 text-left text-xs font-black transition ${
              plan === topic.value
                ? "border-accent bg-accent-soft text-ink"
                : "border-ink/10 bg-surface/70 text-muted hover:border-accent/30"
            }`}
          >
            {topic.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.12em] text-muted">
            Your name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="w-full rounded-xl border border-ink/10 bg-surface/70 px-3.5 py-3 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-accent/45 focus:ring-4 focus:ring-accent/10"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.12em] text-muted">
            Your email
          </span>
          <input
            type="email"
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full rounded-xl border border-ink/10 bg-surface/70 px-3.5 py-3 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-accent/45 focus:ring-4 focus:ring-accent/10"
          />
        </label>
      </div>

      {(plan === "campus" || organization) && (
        <label className="mt-4 block">
          <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.12em] text-muted">
            Organization
          </span>
          <input
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="School, lab, or company"
            className="w-full rounded-xl border border-ink/10 bg-surface/70 px-3.5 py-3 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-accent/45 focus:ring-4 focus:ring-accent/10"
          />
        </label>
      )}

      <label className="mt-4 block">
        <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.12em] text-muted">
          Message
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder={
            plan === "plus"
              ? "Tell us when you want Plus activated…"
              : plan === "campus"
                ? "Team size, research needs, timeline…"
                : "How can we help?"
          }
          className="w-full resize-y rounded-xl border border-ink/10 bg-surface/70 px-3.5 py-3 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-accent/45 focus:ring-4 focus:ring-accent/10"
        />
      </label>

      <button
        type="submit"
        className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-accent-deep sm:w-auto"
      >
        <Send size={15} />
        Open email to {SITE_CONTACT.name}
        <ArrowUpRight size={15} />
      </button>
    </form>
  );
}
