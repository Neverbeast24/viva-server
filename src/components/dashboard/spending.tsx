"use client";

import { motion } from "motion/react";
import {
  Dumbbell,
  HeartPulse,
  Pill,
  Plus,
  Salad,
  TrendingDown,
  WalletCards,
} from "lucide-react";
import { Bars, PageHeader, Panel, Progress, Stagger, StatCard } from "@/components/dashboard/ui";

const week: [string, number][] = [
  ["M", 40],
  ["T", 65],
  ["W", 30],
  ["T", 78],
  ["F", 52],
  ["S", 88],
  ["S", 44],
];

const categories = [
  { icon: Salad, label: "Healthy food", value: 620, pct: 44, color: "from-[#7557ff] to-[#a05bff]" },
  { icon: Dumbbell, label: "Fitness", value: 350, pct: 25, color: "from-[#16b8a6] to-[#3ad6c8]" },
  { icon: Pill, label: "Supplements", value: 280, pct: 20, color: "from-[#ff9a62] to-[#ff6f91]" },
  { icon: HeartPulse, label: "Wellness", value: 150, pct: 11, color: "from-[#5aa9ff] to-[#7ad0ff]" },
];

export function SpendingView() {
  return (
    <>
      <PageHeader
        eyebrow="SPENDING"
        title="Invest in"
        highlight="wellbeing."
        action={
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#24212e] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#7557ff]"
          >
            <Plus size={16} /> Add expense
          </motion.button>
        }
      />

      <Stagger>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Health investment"
            value="₱1,400"
            detail="This month"
            icon={WalletCards}
            className="bg-gradient-to-br from-[#7055ed] to-[#9a57e9] text-white"
          />
          <StatCard
            label="Budget left"
            value="₱600"
            suffix="/ ₱2,000"
            detail="30% remaining"
            icon={TrendingDown}
            className="bg-[#e8fbf8] text-[#183d3a]"
          />
          <StatCard
            label="Investment index"
            value="88"
            detail="Smarter than last month"
            icon={HeartPulse}
            className="bg-[#fff3e8] text-[#533621]"
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Panel
            title="Spending this week"
            right={
              <span className="rounded-full bg-[#e6faf6] px-3 py-1.5 text-xs font-bold text-[#12a595]">
                −12%
              </span>
            }
          >
            <Bars data={week} activeIndex={5} />
          </Panel>

          <Panel title="Budget used">
            <div className="flex flex-col justify-center gap-4 py-2">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm font-bold">
                  <span>₱1,400 spent</span>
                  <span className="text-[#847f8c]">of ₱2,000</span>
                </div>
                <Progress value={70} />
              </div>
              <p className="text-xs leading-5 text-[#847f8c]">
                You are spending mostly on healthy food and fitness — the two
                categories most linked to your goals.
              </p>
            </div>
          </Panel>
        </div>

        <Panel title="Categories" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((cat) => (
              <motion.div
                key={cat.label}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-black/5 bg-white/70 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#f0edff] text-[#7557ff]">
                    <cat.icon size={17} />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{cat.label}</p>
                    <p className="text-xs text-[#847f8c]">₱{cat.value}</p>
                  </div>
                  <span className="text-xs font-black text-[#4a4654]">{cat.pct}%</span>
                </div>
                <div className="mt-3">
                  <Progress value={cat.pct} className={cat.color} />
                </div>
              </motion.div>
            ))}
          </div>
        </Panel>
      </Stagger>
    </>
  );
}
