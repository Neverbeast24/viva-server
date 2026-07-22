import type { Metadata } from "next";
import { SpendingSheet } from "@/components/dashboard/spending";
import { requireUser } from "@/lib/auth/roles";

export const metadata: Metadata = { title: "Spending sheet" };

export default async function SpendingSheetPage() {
  const { supabase, user } = await requireUser();
  const [expensesRes, profileRes] = await Promise.all([
    supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("spent_at", { ascending: false })
      .limit(500),
    supabase
      .from("profiles")
      .select("monthly_health_budget")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  return (
    <SpendingSheet
      expenses={expensesRes.data ?? []}
      monthlyBudget={Number(profileRes.data?.monthly_health_budget ?? 2000)}
      today={new Date().toISOString().slice(0, 10)}
    />
  );
}
