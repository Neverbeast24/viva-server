import type { Metadata } from "next";
import { GroceriesView } from "@/components/dashboard/groceries";
import {
  estimateGroceryPrice,
  getPhCalendarDate,
} from "@/lib/groceries/ph-price-catalog";
import { requireUser } from "@/lib/auth/roles";

export const metadata: Metadata = { title: "Groceries" };

export default async function GroceriesPage() {
  const { supabase, user } = await requireUser();
  const ph = getPhCalendarDate();

  const [groceriesRes, profileRes, expensesRes] = await Promise.all([
    supabase
      .from("grocery_items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("monthly_health_budget")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("expenses")
      .select("amount, spent_at")
      .eq("user_id", user.id)
      .gte("spent_at", ph.monthStart),
  ]);

  // Always refresh line estimates to today's PH year/month market so totals stay dynamic.
  const items = await Promise.all(
    (groceriesRes.data ?? []).map(async (row) => {
      const estimated_price = estimateGroceryPrice(row.name, row.quantity, row.category);
      if (Number(row.estimated_price ?? 0) !== estimated_price) {
        await supabase
          .from("grocery_items")
          .update({ estimated_price })
          .eq("id", row.id)
          .eq("user_id", user.id);
      }
      return { ...row, estimated_price };
    }),
  );

  const spentThisMonth = (expensesRes.data ?? []).reduce(
    (sum, row) => sum + Number(row.amount ?? 0),
    0,
  );
  const monthlyBudget = Number(profileRes.data?.monthly_health_budget ?? 2000);

  return (
    <GroceriesView
      items={items}
      monthlyBudget={monthlyBudget}
      spentThisMonth={spentThisMonth}
      priceMonthLabel={ph.monthLabel}
    />
  );
}
