import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [users, logs, meals, workouts] = await Promise.all([
    supabase.from("profiles").select("user_id", { count: "exact", head: true }),
    supabase.from("audit_logs").select("id", { count: "exact", head: true }),
    supabase.from("nutrition_logs").select("id", { count: "exact", head: true }),
    supabase.from("workout_logs").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    ["Users", users.count ?? 0],
    ["Audit events", logs.count ?? 0],
    ["Meals logged", meals.count ?? 0],
    ["Workouts logged", workouts.count ?? 0],
  ] as const;

  return (
    <>
      <p className="text-[11px] font-black tracking-[0.2em] text-[#5f45e6]">ADMIN</p>
      <h1 className="font-display mt-2 text-4xl tracking-tight">VIVA control center</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#77727f]">
        Manage users, roles, permissions, and platform activity from one place.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <article
            key={label}
            className="rounded-[1.4rem] border border-[#26222f]/8 bg-[#fdfbf4] p-5 shadow-[0_14px_32px_rgba(64,49,38,.07)]"
          >
            <p className="text-[11px] font-bold tracking-wide text-[#8a8491]">{label}</p>
            <p className="font-display mt-3 text-4xl leading-none tracking-tight">{value}</p>
          </article>
        ))}
      </div>
    </>
  );
}
