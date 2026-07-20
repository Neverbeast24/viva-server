"use client";

import { useMemo, useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Clock3,
  Cog,
  Dumbbell,
  Flame,
  Play,
  Sparkles,
  Target,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  createAiGymPlan,
  deleteGymPlan,
  deleteGymSession,
  logGymSession,
  recommendMachinesWithAi,
} from "@/app/dashboard/gym/actions";
import type { MachineRecommendationPayload } from "@/lib/ai/gemini";
import {
  EmptyState,
  FormField,
  ListRow,
  PageHeader,
  Panel,
  PrimaryButton,
  Stagger,
  StatCard,
  fieldClass,
} from "@/components/dashboard/ui";
import { useModuleAction } from "@/components/dashboard/use-module-action";

export type GymExercise = {
  id: number;
  slug: string;
  name: string;
  muscle_group: string;
  equipment: string;
  difficulty: string;
  duration_seconds: number;
  demo_video_url: string;
  demo_thumbnail_url: string | null;
  cues: string | null;
};

export type GymSession = {
  id: number;
  title: string;
  focus: string;
  duration_minutes: number | null;
  calories_burned: number | null;
  exercises: { name?: string; sets?: string }[] | null;
  notes: string | null;
  logged_at: string;
};

export type GymPlan = {
  id: number;
  title: string;
  focus: string;
  level: string;
  days_per_week: number;
  summary: string | null;
  days: {
    day: string;
    focus: string;
    exercises: { name: string; sets: string; rest: string; notes?: string }[];
  }[];
  created_at: string;
};

const muscleFilters = [
  "all",
  "legs",
  "chest",
  "back",
  "shoulders",
  "arms",
  "glutes",
  "core",
  "hamstrings",
  "cardio",
  "mobility",
] as const;

const equipmentFilters = [
  { id: "all", label: "All demos" },
  { id: "machines", label: "Machines" },
  { id: "cable", label: "Cables" },
  { id: "cardio_machine", label: "Cardio machines" },
  { id: "dumbbell", label: "Dumbbells" },
  { id: "bodyweight", label: "Bodyweight" },
] as const;

function isMachineGear(equipment: string) {
  return equipment === "machine" || equipment === "cable" || equipment === "cardio_machine";
}

function matchesEquipment(equipment: string, filter: (typeof equipmentFilters)[number]["id"]) {
  if (filter === "all") return true;
  if (filter === "machines") return equipment === "machine";
  return equipment === filter;
}

export function GymView({
  exercises,
  sessions,
  plans,
}: {
  exercises: GymExercise[];
  sessions: GymSession[];
  plans: GymPlan[];
}) {
  const { pending, submit } = useModuleAction(logGymSession);
  const [busy, start] = useTransition();
  const [planning, startPlan] = useTransition();
  const [recommending, startRecommend] = useTransition();
  const [muscle, setMuscle] = useState<(typeof muscleFilters)[number]>("all");
  const [equipment, setEquipment] = useState<(typeof equipmentFilters)[number]["id"]>("machines");
  const [activeDemo, setActiveDemo] = useState<GymExercise | null>(null);
  const [machineRecs, setMachineRecs] = useState<MachineRecommendationPayload | null>(null);

  const bySlug = useMemo(
    () => new Map(exercises.map((item) => [item.slug, item])),
    [exercises],
  );

  const machineCount = exercises.filter((item) => isMachineGear(item.equipment)).length;

  const filtered = useMemo(
    () =>
      exercises.filter((item) => {
        const muscleOk = muscle === "all" || item.muscle_group === muscle;
        const gearOk = matchesEquipment(item.equipment, equipment);
        return muscleOk && gearOk;
      }),
    [equipment, exercises, muscle],
  );

  const totalMinutes = sessions.reduce((sum, row) => sum + (row.duration_minutes ?? 0), 0);
  const totalCalories = sessions.reduce((sum, row) => sum + (row.calories_burned ?? 0), 0);

  function run(action: () => Promise<{ ok: boolean; message: string }>) {
    start(async () => {
      const result = await action();
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  function generatePlan() {
    startPlan(async () => {
      const result = await createAiGymPlan();
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  function recommendMachines() {
    startRecommend(async () => {
      const result = await recommendMachinesWithAi();
      if (!result.ok || !("recommendation" in result) || !result.recommendation) {
        toast.error(result.message);
        return;
      }
      setMachineRecs(result.recommendation);
      toast.success(result.message);
    });
  }

  function openDemoBySlug(slug: string | null) {
    if (!slug) return;
    const demo = bySlug.get(slug);
    if (demo) setActiveDemo(demo);
    else toast.error("Demo video not found for that machine.");
  }

  return (
    <>
      <PageHeader
        eyebrow="GYM"
        title="Train with"
        highlight="intention."
        action={
          <div className="flex flex-wrap gap-2">
            <PrimaryButton
              disabled={recommending}
              onClick={recommendMachines}
              className="rounded-full bg-[#5f45e6] px-5"
            >
              <Cog size={14} className="mr-1.5 inline" />
              {recommending ? "Matching…" : "AI machine picks"}
            </PrimaryButton>
            <PrimaryButton disabled={planning} onClick={generatePlan} className="rounded-full px-5">
              <Sparkles size={14} className="mr-1.5 inline" />
              {planning ? "Building plan…" : "AI gym plan"}
            </PrimaryButton>
          </div>
        }
      />

      <Stagger>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Sessions logged"
            value={String(sessions.length)}
            detail="Your gym history"
            icon={Dumbbell}
            className="bg-gradient-to-br from-[#5f45e6] to-[#9a57e9] text-white"
          />
          <StatCard
            label="Training time"
            value={String(totalMinutes)}
            detail="Minutes recorded"
            icon={Clock3}
            className="bg-[#e8fbf8] text-[#183d3a]"
          />
          <StatCard
            label="Energy burned"
            value={String(totalCalories)}
            detail="From gym sessions"
            icon={Flame}
            className="bg-[#fff3e8] text-[#533621]"
          />
          <StatCard
            label="Machine demos"
            value={String(machineCount)}
            detail="Guided gym equipment"
            icon={Cog}
            className="bg-[#f3f0ff] text-[#3d2f7a]"
          />
        </div>
      </Stagger>

      {machineRecs && (
        <Panel
          title={machineRecs.title}
          className="mt-4"
          right={
            <span className="rounded-full bg-[#ece7fb] px-3 py-1 text-[11px] font-black text-[#5f45e6]">
              {machineRecs.focus}
            </span>
          }
        >
          <p className="mb-4 text-sm leading-6 text-[#6f6b79]">{machineRecs.summary}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {[...machineRecs.recommendations]
              .sort((a, b) => a.priority - b.priority)
              .map((item) => {
                const demo = item.demo_slug ? bySlug.get(item.demo_slug) : null;
                return (
                  <article
                    key={`${item.priority}-${item.machine}`}
                    className="rounded-[1.3rem] border border-[#26222f]/8 bg-[#fdfbf4] p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-black tracking-wide text-[#5f45e6]">
                          PICK #{item.priority}
                        </p>
                        <p className="mt-1 text-sm font-black">{item.machine}</p>
                      </div>
                      <span className="rounded-full bg-[#f4efe4] px-2.5 py-1 text-[10px] font-black text-[#6b6675]">
                        {item.sets}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[#6f6b79]">{item.why}</p>
                    <p className="mt-2 text-xs leading-5 text-[#847f8c]">{item.how_to_use}</p>
                    {demo && (
                      <button
                        type="button"
                        onClick={() => setActiveDemo(demo)}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#26222f] px-3 py-1.5 text-[11px] font-black text-white transition hover:bg-[#5f45e6]"
                      >
                        <Play size={12} fill="currentColor" /> Watch demo
                      </button>
                    )}
                  </article>
                );
              })}
          </div>
        </Panel>
      )}

      <Panel title="Demo library" className="mt-4" right={<Play size={16} className="text-[#5f45e6]" />}>
        <div className="mb-3 flex flex-wrap gap-2">
          {equipmentFilters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setEquipment(item.id)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-black transition ${
                equipment === item.id
                  ? "bg-[#5f45e6] text-white"
                  : "bg-[#ece7fb] text-[#5f45e6] hover:bg-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {muscleFilters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMuscle(item)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-black capitalize transition ${
                muscle === item
                  ? "bg-[#26222f] text-white"
                  : "bg-[#f4efe4] text-[#6b6675] hover:bg-white"
              }`}
            >
              {item === "all" ? "All muscles" : item}
            </button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((exercise) => (
            <button
              key={exercise.id}
              type="button"
              onClick={() => setActiveDemo(exercise)}
              className="group overflow-hidden rounded-[1.3rem] border border-[#26222f]/8 bg-[#fdfbf4] text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-video overflow-hidden bg-[#eee8dc]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={exercise.demo_thumbnail_url ?? "/viva-mark.svg"}
                  alt=""
                  className="size-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 grid place-items-center bg-[#191621]/25 opacity-0 transition group-hover:opacity-100">
                  <span className="grid size-12 place-items-center rounded-full bg-white text-[#5f45e6] shadow-lg">
                    <Play size={18} fill="currentColor" />
                  </span>
                </span>
                {isMachineGear(exercise.equipment) && (
                  <span className="absolute left-3 top-3 rounded-full bg-[#26222f]/85 px-2.5 py-1 text-[10px] font-black text-white backdrop-blur">
                    Machine
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-black">{exercise.name}</p>
                  <span className="rounded-full bg-[#ece7fb] px-2 py-0.5 text-[10px] font-black capitalize text-[#5f45e6]">
                    {exercise.difficulty}
                  </span>
                </div>
                <p className="mt-1 text-xs capitalize text-[#847f8c]">
                  {exercise.muscle_group} · {exercise.equipment.replaceAll("_", " ")}
                </p>
              </div>
            </button>
          ))}
          {!filtered.length && <EmptyState>No demos in this filter.</EmptyState>}
        </div>
      </Panel>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <Panel title="Log a gym session">
          <form action={submit} className="grid gap-3 sm:grid-cols-2">
            <FormField label="Session title" hint="Required" className="sm:col-span-2">
              <input name="title" required placeholder="e.g. Machine circuit + cardio" className={fieldClass} />
            </FormField>
            <FormField label="Focus">
              <select name="focus" defaultValue="full_body" className={fieldClass}>
                <option value="full_body">Full body</option>
                <option value="strength">Strength</option>
                <option value="fat_loss">Fat loss</option>
                <option value="mobility">Mobility</option>
                <option value="endurance">Endurance</option>
                <option value="upper">Upper</option>
                <option value="lower">Lower</option>
                <option value="core">Core</option>
              </select>
            </FormField>
            <FormField label="Duration" hint="minutes">
              <input name="duration_minutes" type="number" min={5} required defaultValue={45} className={fieldClass} />
            </FormField>
            <FormField label="Calories" hint="optional">
              <input name="calories_burned" type="number" min={0} placeholder="0" className={fieldClass} />
            </FormField>
            <FormField label="Exercises / machines" hint="one per line" className="sm:col-span-2">
              <textarea
                name="exercises"
                rows={4}
                placeholder={"Leg press machine\nLat pulldown\nCable face pull\nTreadmill intervals"}
                className={`${fieldClass} min-h-28 resize-y`}
              />
            </FormField>
            <FormField label="Notes" className="sm:col-span-2">
              <input name="notes" placeholder="Seat settings / weight used" className={fieldClass} />
            </FormField>
            <PrimaryButton disabled={pending} className="sm:col-span-2">
              {pending ? "Saving…" : "Log session"}
            </PrimaryButton>
          </form>
        </Panel>

        <Panel title="Recent sessions" right={<Target size={16} className="text-[#5f45e6]" />}>
          <div className="space-y-2">
            {sessions.map((session) => (
              <ListRow
                key={session.id}
                title={session.title}
                meta={`${session.focus.replace("_", " ")} · ${session.duration_minutes ?? 0} min`}
                right={
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-black">{session.calories_burned ?? 0} kcal</span>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => run(() => deleteGymSession(session.id))}
                      className="grid size-8 place-items-center rounded-lg text-[#a9a4b0] transition hover:bg-[#fff0e8] hover:text-[#e4571f]"
                      aria-label={`Delete ${session.title}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </span>
                }
              />
            ))}
            {!sessions.length && <EmptyState>No gym sessions yet. Log your first training block.</EmptyState>}
          </div>
        </Panel>
      </div>

      <Panel title="Saved AI gym plans" className="mt-4">
        <div className="space-y-4">
          {plans.map((plan) => (
            <article key={plan.id} className="rounded-[1.3rem] border border-[#26222f]/8 bg-[#f4efe4]/45 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black">{plan.title}</p>
                  <p className="mt-1 text-xs capitalize text-[#847f8c]">
                    {plan.focus.replace("_", " ")} · {plan.level} · {plan.days_per_week} days/week
                  </p>
                  {plan.summary && <p className="mt-2 text-sm leading-6 text-[#6f6b79]">{plan.summary}</p>}
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => run(() => deleteGymPlan(plan.id))}
                  className="grid size-8 place-items-center rounded-lg text-[#a9a4b0] transition hover:bg-[#fff0e8] hover:text-[#e4571f]"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {(plan.days ?? []).map((day) => (
                  <div key={`${plan.id}-${day.day}`} className="rounded-2xl border border-black/5 bg-white/80 p-3">
                    <p className="text-xs font-black text-[#5f45e6]">{day.day}</p>
                    <p className="mt-1 text-sm font-bold">{day.focus}</p>
                    <ul className="mt-2 space-y-1.5">
                      {(day.exercises ?? []).map((ex) => {
                        const linked = exercises.find(
                          (item) => item.name.toLowerCase() === ex.name.toLowerCase(),
                        );
                        return (
                          <li key={`${day.day}-${ex.name}`} className="text-xs text-[#6f6b79]">
                            {linked ? (
                              <button
                                type="button"
                                onClick={() => openDemoBySlug(linked.slug)}
                                className="font-bold text-[#5f45e6] underline-offset-2 hover:underline"
                              >
                                {ex.name}
                              </button>
                            ) : (
                              <span className="font-bold text-[#332f3c]">{ex.name}</span>
                            )}{" "}
                            · {ex.sets} · rest {ex.rest}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          ))}
          {!plans.length && (
            <EmptyState>Generate an AI gym plan with machines matched to your profile.</EmptyState>
          )}
        </div>
      </Panel>

      <AnimatePresence>
        {activeDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] grid place-items-center bg-[#191621]/55 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setActiveDemo(null);
            }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              className="w-full max-w-3xl overflow-hidden rounded-[1.6rem] border border-white/20 bg-[#fdfbf4] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
                <div>
                  <p className="text-sm font-black">{activeDemo.name}</p>
                  <p className="mt-0.5 text-xs capitalize text-[#847f8c]">
                    {activeDemo.muscle_group} · {activeDemo.equipment.replaceAll("_", " ")} ·{" "}
                    {activeDemo.difficulty}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveDemo(null)}
                  className="grid size-9 place-items-center rounded-xl bg-[#eee8dc]"
                  aria-label="Close demo"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="aspect-video bg-black">
                <iframe
                  title={`${activeDemo.name} demo`}
                  src={`${activeDemo.demo_video_url}${activeDemo.demo_video_url.includes("?") ? "&" : "?"}rel=0`}
                  className="size-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {activeDemo.cues && (
                <p className="px-5 py-4 text-sm leading-6 text-[#6f6b79]">{activeDemo.cues}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
