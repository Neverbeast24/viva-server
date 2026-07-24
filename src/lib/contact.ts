/** Public contact for Campus / Plus access requests. */
export const SITE_CONTACT = {
  name: "Daniella D. Sayson",
  email: "saysondaniella.ds24@gmail.com",
  phone: "09213655627",
  phoneTel: "+639213655627",
  phoneDisplay: "0921 365 5627",
} as const;

export type ContactPlan = "plus" | "campus" | "general";

export function contactMailto(
  plan: ContactPlan = "general",
  extras?: { name?: string; fromEmail?: string; message?: string; organization?: string },
) {
  const subjects: Record<ContactPlan, string> = {
    plus: "VIVRΛNT Plus access request (₱299/month)",
    campus: "VIVRΛNT Campus / team access request",
    general: "VIVRΛNT inquiry",
  };

  const lines: string[] = [`Hi ${SITE_CONTACT.name},`, ""];
  if (plan === "plus") {
    lines.push("I'd like to start VIVRΛNT Plus (₱299/month).");
  } else if (plan === "campus") {
    lines.push("I'm interested in VIVRΛNT Campus access for a research program or team.");
  } else {
    lines.push("I have a question about VIVRΛNT.");
  }
  lines.push("");
  if (extras?.name) lines.push(`Name: ${extras.name}`);
  if (extras?.fromEmail) lines.push(`Email: ${extras.fromEmail}`);
  if (extras?.organization) lines.push(`Organization: ${extras.organization}`);
  if (extras?.message) {
    lines.push("", extras.message);
  } else if (plan === "plus") {
    lines.push("Preferred start date:", "");
  } else if (plan === "campus") {
    lines.push("Role:", "Team size:", "Needs:", "");
  }
  lines.push("Thank you!");

  const params = new URLSearchParams({
    subject: subjects[plan],
    body: lines.join("\n"),
  });
  return `mailto:${SITE_CONTACT.email}?${params.toString()}`;
}

export function contactSmsHref() {
  return `sms:${SITE_CONTACT.phoneTel}`;
}

export function contactTelHref() {
  return `tel:${SITE_CONTACT.phoneTel}`;
}
