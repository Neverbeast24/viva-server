"use server";

import { revalidatePath } from "next/cache";
import { buildUserContext } from "@/lib/ai/context";
import { planGroceriesFromPantry } from "@/lib/ai/gemini";
import { estimateGroceryPrice } from "@/lib/groceries/ph-price-catalog";
import { createClient } from "@/lib/supabase/server";

const categories = new Set([
  "produce",
  "protein",
  "dairy",
  "grains",
  "pantry",
  "snacks",
  "drinks",
  "household",
  "other",
]);

export async function generateSmartGroceryPlan() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Not signed in." };

  try {
    const context = await buildUserContext(user.id);
    const plan = await planGroceriesFromPantry(context);
    return { ok: true, message: "Smart grocery plan ready.", plan };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not build a grocery plan.";
    return { ok: false, message };
  }
}

export async function addPlanItemsToList(
  items: { name: string; category: string; quantity: string; estimated_price?: number }[],
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Not signed in." };
  if (!items.length) return { ok: false, message: "No items to add." };

  const rows = items.slice(0, 12).map((item) => {
    const category = categories.has(item.category) ? item.category : "other";
    const quantity = item.quantity.slice(0, 40);
    const name = item.name.slice(0, 120);
    const price =
      item.estimated_price != null && item.estimated_price > 0
        ? Math.round(item.estimated_price)
        : estimateGroceryPrice(name, quantity, category);
    return {
      user_id: user.id,
      name,
      quantity,
      category,
      estimated_price: price,
    };
  });

  const { error } = await supabase.from("grocery_items").insert(rows);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/dashboard/groceries");
  return { ok: true, message: `Added ${rows.length} item${rows.length === 1 ? "" : "s"} to your list.` };
}
