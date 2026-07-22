import type { Metadata } from "next";
import { PantryView } from "@/components/dashboard/pantry";
import { loadPantryItems } from "@/app/dashboard/pantry/data";

export const metadata: Metadata = { title: "Pantry items" };

export default async function PantryItemsPage() {
  const items = await loadPantryItems();
  return <PantryView mode="items" items={items} />;
}
