"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { estimateGroceryPrice } from "@/lib/groceries/ph-price-catalog";
import { createClient } from "@/lib/supabase/server";

const itemSchema = z.object({
  name: z.string().min(1).max(120),
  quantity: z.string().max(40).optional(),
  category: z
    .enum(["produce", "protein", "dairy", "grains", "pantry", "snacks", "drinks", "household", "other"])
    .default("other"),
  estimated_price: z.coerce.number().min(0).max(50000).optional(),
});

export async function addGroceryItem(formData: FormData) {
  const parsed = itemSchema.safeParse({
    name: formData.get("name"),
    quantity: formData.get("quantity") || undefined,
    category: formData.get("category") || "other",
    estimated_price: formData.get("estimated_price") || undefined,
  });
  if (!parsed.success) return { ok: false, message: "Enter an item name." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Not signed in." };

  const estimatedPrice =
    parsed.data.estimated_price != null && !Number.isNaN(parsed.data.estimated_price)
      ? Math.round(parsed.data.estimated_price)
      : estimateGroceryPrice(parsed.data.name, parsed.data.quantity, parsed.data.category);

  const { error } = await supabase.from("grocery_items").insert({
    user_id: user.id,
    name: parsed.data.name,
    quantity: parsed.data.quantity ?? null,
    category: parsed.data.category,
    estimated_price: estimatedPrice,
  });
  if (error) return { ok: false, message: error.message };

  revalidatePath("/dashboard/groceries");
  return { ok: true, message: "Item added." };
}

export async function toggleGroceryItem(id: number, checked: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Not signed in." };

  const { error } = await supabase
    .from("grocery_items")
    .update({ is_checked: checked })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { ok: false, message: error.message };
  revalidatePath("/dashboard/groceries");
  return { ok: true, message: "Updated." };
}

export async function deleteGroceryItem(id: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Not signed in." };
  const { error } = await supabase
    .from("grocery_items")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/dashboard/groceries");
  return { ok: true, message: "Item removed." };
}

export async function clearCompletedGroceries() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Not signed in." };
  const { error } = await supabase
    .from("grocery_items")
    .delete()
    .eq("user_id", user.id)
    .eq("is_checked", true);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/dashboard/groceries");
  return { ok: true, message: "Completed items cleared." };
}
