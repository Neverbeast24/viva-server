import type { Metadata } from "next";
import { PantryView } from "@/components/dashboard/pantry";
import { loadPantryItems } from "@/app/dashboard/pantry/data";

export const metadata: Metadata = { title: "Pantry" };

export default async function PantryPage() {
  const items = await loadPantryItems();
  return <PantryView mode="overview" items={items} />;
}
