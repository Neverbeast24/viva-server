"use client";

import { motion } from "motion/react";
import { Activity, Bike, Dumbbell, Flame, Footprints, Heart, Plus, Timer } from "lucide-react";
import { Bars, PageHeader, Panel, Progress, Stagger, StatCard } from "@/components/dashboard/ui";

const week: [string, number][] = [
  ["M", 45],
  ["T", 80],
  ["W", 30],
  ["T", 95],
  ["F", 70],
  ["S", 60],
  ["S", 20],
];

const sessions: [typeof Activity, string, string, string][] = [
  [Footprints, "Morning walk", "38 min · 3.1 km", "Done"],
  [Dumbbell, "Upper body strength", "25 min", "Planned"],
  [Bike, "Evening cycle", "40 min", "Planned"],
];

export function MovementView() {
  return (
    <>
      <PageHeader
        eyebrow="MOVEMENT"
        title="Move a little"
        highlight="today."
        action={
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#24212e] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#7557ff]"
          >
            <Plus size={16} /> Start a session
          </motion.button>
        }
      />

      <Stagger>
        <div className="grid gap-4 sm:grid-cols-4">
          <StatCard
            label="Steps"
            value="6,420"
            detail="78% of goal"
            icon={Footprints}
            className="bg-gradient-to-br from-[#7055ed] to-[#9a57e9] text-white"
          />
          <StatCard
            label="Active min"
            value="38"
            detail="Goal 45 min"
            icon={Timer}
            className="bg-[#e8fbf8] text-[#183d3a]"
          />
          <StatCard
            label="Calories"
            value="410"
            detail="Burned today"
            icon={Flame}
            className="bg-[#fff3e8] text-[#533621]"
          />
          <StatCard
            label="Avg heart"
            value="72"
            suffix="bpm"
            detail="Resting"
            icon={Heart}
            className="bg-[#fdeaf1] text-[#5a2438]"
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Panel
            title="Activity this week"
            right={
              <span className="rounded-full bg-[#f3f0ff] px-3 py-1.5 text-xs font-bold text-[#6f55df]">
                4 active days
              </span>
            }
          >
            <Bars data={week} activeIndex={3} />
          </Panel>

          <Panel title="Daily goal">
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative grid size-40 place-items-center">
                <svg viewBox="0 0 120 120" className="size-40 -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#ece9f2" strokeWidth="12" />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="url(#ring)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 52}
                    initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - 0.78) }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <defs>
                    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#7657ff" />
                      <stop offset="1" stopColor="#23d4df" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute text-center">
                  <p className="text-3xl font-black">78%</p>
                  <p className="text-[10px] font-bold text-[#a09ba7]">of daily goal</p>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <Panel title="Sessions" className="mt-4">
          <div className="space-y-3">
            {sessions.map(([Icon, name, meta, status]) => (
              <motion.div
                key={name}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white/70 p-4"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-[#f0edff] text-[#7557ff]">
                  <Icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">{name}</p>
                  <p className="truncate text-xs text-[#847f8c]">{meta}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-black ${
                    status === "Done"
                      ? "bg-[#e6faf6] text-[#12a595]"
                      : "bg-[#f2eff8] text-[#7c718a]"
                  }`}
                >
                  {status}
                </span>
              </motion.div>
            ))}
          </div>
        </Panel>
      </Stagger>
    </>
  );
}
