import type { Metadata } from "next";
import { TodayView } from "@/components/dashboard/today";

export const metadata: Metadata = {
  title: "Today",
};

export default function DashboardPage() {
  return <TodayView />;
}
