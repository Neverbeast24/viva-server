import type { Metadata } from "next";
import { PantryView } from "@/components/dashboard/pantry";
import { loadPantryItems } from "@/app/dashboard/pantry/data";

export const metadata: Metadata = { title: "Low stock" };

export default async function PantryLowStockPage() {
  const items = await loadPantryItems();
  return <PantryView mode="low-stock" items={items} />;
}
