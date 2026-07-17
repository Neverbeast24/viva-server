import type { Metadata } from "next";
import { MovementView } from "@/components/dashboard/movement";

export const metadata: Metadata = {
  title: "Movement",
};

export default function MovementPage() {
  return <MovementView />;
}
