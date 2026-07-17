import type { Metadata } from "next";
import { NutritionView } from "@/components/dashboard/nutrition";

export const metadata: Metadata = {
  title: "Nutrition",
};

export default function NutritionPage() {
  return <NutritionView />;
}
