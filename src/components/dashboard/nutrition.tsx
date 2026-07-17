"use client";

import { motion } from "motion/react";
import { Apple, Beef, Croissant, Droplets, Flame, Plus, Wheat } from "lucide-react";
import { Bars, PageHeader, Panel, Progress, Stagger, StatCard } from "@/components/dashboard/ui";

const week: [string, number][] = [
  ["M", 70],
  ["T", 82],
  ["W", 64],
  ["T", 90],
  ["F", 92],
  ["S", 55],
  ["S", 48],
];

const macros = [
  { label: "Protein", value: 96, target: 120, unit: "g", color: "from-[#7557ff] to-[#a05bff]" },
  { label: "Carbs", value: 180, target: 240, unit: "g", color: "from-[#16b8a6] to-[#3ad6c8]" },
  { label: "Fat", value: 52, target: 70, unit: "g", color: "from-[#ff9a62] to-[#ff6f91]" },
];

const meals: [typeof Apple, string, string, string][] = [
  [Croissant, "Breakfast", "Oats, berries, yogurt", "420 kcal"],
  [Beef, "Lunch", "Grilled chicken bowl", "610 kcal"],
  [Apple, "Snack", "Apple & almonds", "180 kcal"],
  [Wheat, "Dinner", "Salmon & quinoa", "540 kcal"],
];

export function NutritionView() {
  return (
    <>
      <PageHeader
        eyebrow="NUTRITION"
        title="Eat with"
        highlight="intention."
        action={
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#24212e] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#7557ff]"
          >
            <Plus size={16} /> Log a meal
          </motion.button>
        }
      />

      <Stagger>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Calories today"
            value="1,750"
            suffix="/ 2,100"
            detail="350 kcal remaining"
            icon={Flame}
            className="bg-gradient-to-br from-[#7055ed] to-[#9a57e9] text-white"
          />
          <StatCard
            label="Water"
            value="1.6L"
            suffix="/ 2.4L"
            detail="Two glasses to go"
            icon={Droplets}
            className="bg-[#e8fbf8] text-[#183d3a]"
          />
          <StatCard
            label="Diet quality"
            value="92%"
            detail="Balanced this week"
            icon={Apple}
            className="bg-[#fff3e8] text-[#533621]"
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Panel
            title="Calories this week"
            right={
              <span className="rounded-full bg-[#f3f0ff] px-3 py-1.5 text-xs font-bold text-[#6f55df]">
                On track
              </span>
            }
          >
            <Bars data={week} activeIndex={4} />
          </Panel>

          <Panel title="Macros">
            <div className="space-y-5">
              {macros.map((macro) => (
                <div key={macro.label}>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold">
                    <span>{macro.label}</span>
                    <span className="text-[#847f8c]">
                      {macro.value}
                      {macro.unit}{" "}
                      <span className="text-[#b3aebb]">/ {macro.target}{macro.unit}</span>
                    </span>
                  </div>
                  <Progress value={(macro.value / macro.target) * 100} className={macro.color} />
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel title="Today’s meals" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {meals.map(([Icon, meal, detail, kcal]) => (
              <motion.div
                key={meal}
                whileHover={{ y: -3 }}
                className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white/70 p-4"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-[#f0edff] text-[#7557ff]">
                  <Icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">{meal}</p>
                  <p className="truncate text-xs text-[#847f8c]">{detail}</p>
                </div>
                <span className="text-xs font-black text-[#4a4654]">{kcal}</span>
              </motion.div>
            ))}
          </div>
        </Panel>
      </Stagger>
    </>
  );
}
