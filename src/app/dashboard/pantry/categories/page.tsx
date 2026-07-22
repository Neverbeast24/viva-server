import type { Metadata } from "next";
import { PantryView } from "@/components/dashboard/pantry";
import { loadPantryItems } from "@/app/dashboard/pantry/data";

export const metadata: Metadata = { title: "Pantry categories" };

export default async function PantryCategoriesPage() {
  const items = await loadPantryItems();
  return <PantryView mode="categories" items={items} />;
}
