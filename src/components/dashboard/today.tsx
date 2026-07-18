"use client";

import { motion } from "motion/react";
import {
  Activity,
  ChevronRight,
  Dumbbell,
  Leaf,
  ListChecks,
  Moon,
  Sparkles,
  Target,
  WalletCards,
  Waves,
} from "lucide-react";
import { QuickCheckin } from "@/components/dashboard/quick-checkin";
import { Bars, PageHeader, Panel, Progress, Stagger, StatCard } from "@/components/dashboard/ui";

const days: [string, number][] = [
  ["M", 58],
  ["T", 72],
  ["W", 64],
  ["T", 88],
  ["F", 84],
  ["S", 38],
  ["S", 25],
];

const rhythm: [typeof Leaf, string, string, boolean][] = [
  [Leaf, "Balanced breakfast", "08:10", true],
  [Activity, "20-minute walk", "11:30", true],
  [Target, "Hydration check", "14:00", false],
  [Dumbbell, "Light strength", "17:30", false],
];

export function TodayView() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <PageHeader
        eyebrow={today.toUpperCase()}
        title="A good day to feel"
        highlight="alive."
        action={<QuickCheckin />}
      />

      <div className="grid gap-4 xl:grid-cols-[1.55fr_.85fr]">
        <div className="space-y-4">
          <Stagger>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Energy"
                value="84"
                suffix="/100"
                detail="Rested & ready"
                icon={Activity}
                className="bg-gradient-to-br from-[#7055ed] to-[#9a57e9] text-white"
              />
              <StatCard
                label="Daily steps"
                value="6,420"
                detail="78% of your goal"
                icon={Waves}
                className="bg-[#e8fbf8] text-[#183d3a]"
              />
              <StatCard
                label="Mindful spend"
                value="₱380"
                detail="₱120 under plan"
                icon={WalletCards}
                className="bg-[#fff3e8] text-[#533621]"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-[1.35fr_.65fr]">
              <Panel
                title="Energy this week"
                right={
                  <span className="rounded-full bg-[#f3f0ff] px-3 py-1.5 text-xs font-bold text-[#6f55df]">
                    +12%
                  </span>
                }
              >
                <Bars data={days} activeIndex={4} />
              </Panel>

              <motion.article
                variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
                className="relative overflow-hidden rounded-[1.6rem] bg-[#20202a] p-6 text-white"
              >
                <div className="absolute -right-10 -top-10 size-36 rounded-full bg-[#5f45e6]/40 blur-3xl" />
                <div className="relative">
                  <span className="grid size-10 place-items-center rounded-xl bg-white/10">
                    <Moon size={19} className="text-[#c3b7ff]" />
                  </span>
                  <p className="mt-8 text-xs font-bold text-white/45">SLEEP WINDOW</p>
                  <p className="mt-2 text-3xl font-black">7h 42m</p>
                  <div className="mt-5">
                    <Progress value={86} />
                  </div>
                  <p className="mt-3 text-xs text-white/45">Rest quality · Excellent</p>
                </div>
              </motion.article>
            </div>
          </Stagger>
        </div>

        <div className="space-y-4">
          <Stagger>
            <Panel
              title="Today’s rhythm"
              right={<ListChecks size={18} className="text-[#807a88]" />}
            >
              <div className="space-y-5">
                {rhythm.map(([Icon, label, time, done]) => (
                  <div key={label} className="flex items-center gap-3">
                    <span
                      className={`grid size-9 place-items-center rounded-xl ${
                        done ? "bg-[#e6faf6] text-[#12a595]" : "bg-[#f2eff8] text-[#7c718a]"
                      }`}
                    >
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm font-bold ${done ? "text-[#8d8894] line-through" : ""}`}>
                        {label}
                      </p>
                      <p className="mt-0.5 text-[10px] text-[#a09ba7]">{time}</p>
                    </div>
                    <span
                      className={`size-4 rounded-full border-2 ${
                        done ? "border-[#26bea9] bg-[#26bea9]" : "border-[#d8d3df]"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </Panel>

            <motion.article
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.015 }}
              className="rounded-[1.6rem] bg-gradient-to-br from-[#ddf8f3] via-[#eefaf6] to-[#f7f2ff] p-5"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-[#fdfbf4] text-[#5f45e6] shadow-sm">
                  <Sparkles size={18} />
                </span>
                <span className="text-[10px] font-black tracking-wider text-[#8a7e98]">
                  VIVA SUGGESTS
                </span>
              </div>
              <p className="mt-7 text-base font-bold leading-6">
                A protein-rich snack now may keep your afternoon energy steady.
              </p>
              <button className="mt-5 flex items-center gap-1 text-xs font-black text-[#5f45e6] transition hover:gap-2">
                See options <ChevronRight size={13} />
              </button>
            </motion.article>
          </Stagger>
        </div>
      </div>
    </>
  );
}
