import type { Metadata } from "next";
import { GroceriesView } from "@/components/dashboard/groceries";

export const metadata: Metadata = {
  title: "Groceries",
};

export default function GroceriesPage() {
  return <GroceriesView />;
}
