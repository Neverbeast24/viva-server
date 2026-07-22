import type { Metadata } from "next";
import { SpendingBudget } from "@/components/dashboard/spending";
import { requireUser } from "@/lib/auth/roles";

export const metadata: Metadata = { title: "Monthly budget" };

export default async function SpendingBudgetPage() {
  const { supabase, user } = await requireUser();

  const start = new Date();
  start.setDate(1);
  const monthStart = start.toISOString().slice(0, 10);

  const [profileRes, expensesRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("monthly_health_budget")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("expenses")
      .select("amount")
      .eq("user_id", user.id)
      .gte("spent_at", monthStart),
  ]);

  const spentTotal = (expensesRes.data ?? []).reduce(
    (sum, row) => sum + Number(row.amount ?? 0),
    0,
  );

  return (
    <SpendingBudget
      monthlyBudget={Number(profileRes.data?.monthly_health_budget ?? 2000)}
      spentTotal={spentTotal}
    />
  );
}
