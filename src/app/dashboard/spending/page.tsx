import type { Metadata } from "next";
import { SpendingView } from "@/components/dashboard/spending";

export const metadata: Metadata = {
  title: "Spending",
};

export default function SpendingPage() {
  return <SpendingView />;
}
