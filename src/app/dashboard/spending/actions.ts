"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { createClient } from "@/lib/supabase/server";

const expenseSchema = z.object({
  title: z.string().min(1).max(120),
  category: z.enum(["food", "fitness", "supplements", "wellness", "other"]),
  amount: z.coerce.number().min(0),
  spent_at: z.string().date(),
});

const budgetSchema = z.object({
  monthly_health_budget: z.coerce.number().min(0).max(10000000),
});

function revalidateSpending() {
  revalidatePath("/dashboard/spending");
  revalidatePath("/dashboard/spending/log");
  revalidatePath("/dashboard/spending/sheet");
  revalidatePath("/dashboard/spending/budget");
  revalidatePath("/dashboard/settings");
}

export async function addExpense(formData: FormData) {
  const parsed = expenseSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    amount: formData.get("amount"),
    spent_at: formData.get("spent_at"),
  });
  if (!parsed.success) return { ok: false, message: "Please fill in the expense details." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Not signed in." };

  const { error } = await supabase.from("expenses").insert({
    user_id: user.id,
    ...parsed.data,
  });
  if (error) return { ok: false, message: error.message };

  await writeAuditLog({
    action: "expense_added",
    entity: "expenses",
    metadata: { title: parsed.data.title, amount: parsed.data.amount },
  });

  revalidateSpending();
  return { ok: true, message: "Expense added." };
}

export async function updateExpense(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return { ok: false, message: "Invalid expense." };

  const parsed = expenseSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    amount: formData.get("amount"),
    spent_at: formData.get("spent_at"),
  });
  if (!parsed.success) return { ok: false, message: "Please fill in the expense details." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Not signed in." };

  const { error } = await supabase
    .from("expenses")
    .update(parsed.data)
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { ok: false, message: error.message };

  await writeAuditLog({
    action: "expense_updated",
    entity: "expenses",
    entityId: String(id),
    metadata: { title: parsed.data.title, amount: parsed.data.amount },
  });

  revalidateSpending();
  return { ok: true, message: "Expense updated." };
}

export async function deleteExpense(id: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Not signed in." };
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { ok: false, message: error.message };

  await writeAuditLog({
    action: "expense_deleted",
    entity: "expenses",
    entityId: String(id),
  });

  revalidateSpending();
  return { ok: true, message: "Expense removed." };
}

export async function saveMonthlyBudget(formData: FormData) {
  const parsed = budgetSchema.safeParse({
    monthly_health_budget: formData.get("monthly_health_budget"),
  });
  if (!parsed.success) return { ok: false, message: "Enter a valid monthly budget." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Not signed in." };

  const { error } = await supabase
    .from("profiles")
    .update({ monthly_health_budget: parsed.data.monthly_health_budget })
    .eq("user_id", user.id);
  if (error) return { ok: false, message: error.message };

  await writeAuditLog({
    action: "monthly_budget_updated",
    entity: "profiles",
    entityId: user.id,
    metadata: { monthly_health_budget: parsed.data.monthly_health_budget },
  });

  revalidateSpending();
  revalidatePath("/dashboard");
  return { ok: true, message: "Monthly budget saved." };
}
