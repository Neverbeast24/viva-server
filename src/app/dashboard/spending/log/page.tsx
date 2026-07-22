import type { Metadata } from "next";
import { SpendingLog } from "@/components/dashboard/spending";
import { requireUser } from "@/lib/auth/roles";

export const metadata: Metadata = { title: "Log expense" };

export default async function SpendingLogPage() {
  await requireUser();
  return <SpendingLog today={new Date().toISOString().slice(0, 10)} />;
}
