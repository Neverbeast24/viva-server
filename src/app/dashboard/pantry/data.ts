import { requireUser } from "@/lib/auth/roles";

export type PantryItem = {
  id: number;
  name: string;
  category: string;
  stock_level: number;
  created_at?: string;
};

export const PANTRY_CATEGORIES = [
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" },
  { value: "protein", label: "Protein" },
  { value: "dairy", label: "Dairy" },
  { value: "grains", label: "Grains" },
  { value: "snacks", label: "Snacks" },
  { value: "drinks", label: "Drinks" },
  { value: "condiments", label: "Condiments" },
  { value: "frozen", label: "Frozen" },
  { value: "other", label: "Other" },
] as const;

export const LOW_STOCK_THRESHOLD = 25;

export function categoryLabel(value: string) {
  return PANTRY_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export async function loadPantryItems() {
  const { supabase, user } = await requireUser();
  const { data } = await supabase
    .from("pantry_items")
    .select("id, name, category, stock_level, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data ?? []) as PantryItem[];
}
