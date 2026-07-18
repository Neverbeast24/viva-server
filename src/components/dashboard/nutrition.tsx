"use client";

import { Apple, Droplets, Flame } from "lucide-react";
import { logMeal } from "@/app/dashboard/nutrition/actions";
import {
  EmptyState,
  ListRow,
  PageHeader,
  Panel,
  PrimaryButton,
  Stagger,
  StatCard,
  fieldClass,
} from "@/components/dashboard/ui";
import { useModuleAction } from "@/components/dashboard/use-module-action";

type Meal = {
  id: number;
  meal_name: string;
  meal_type: string;
  calories: number | null;
  protein_g: number | null;
  logged_at: string;
};

export function NutritionView({ meals }: { meals: Meal[] }) {
  const { pending, submit } = useModuleAction(logMeal);
  const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories ?? 0), 0);

  return (
    <>
      <PageHeader eyebrow="NUTRITION" title="Eat with" highlight="intention." />

      <Panel title="Log a meal" className="mb-4">
        <form action={submit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input name="meal_name" required placeholder="Meal name" className={`${fieldClass} sm:col-span-2`} />
          <select name="meal_type" defaultValue="lunch" className={fieldClass}>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
          <input name="calories" type="number" min={0} placeholder="Calories" className={fieldClass} />
          <input name="protein_g" type="number" min={0} placeholder="Protein (g)" className={fieldClass} />
          <PrimaryButton disabled={pending} className="sm:col-span-2 lg:col-span-4">
            {pending ? "Saving…" : "Log meal"}
          </PrimaryButton>
        </form>
      </Panel>

      <Stagger>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Calories today"
            value={String(totalCalories)}
            detail={`${meals.length} meals logged`}
            icon={Flame}
            className="bg-gradient-to-br from-[#5f45e6] to-[#9a57e9] text-white"
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

        <Panel title="Logged meals" className="mt-4">
          <div className="space-y-2">
            {meals.map((meal) => (
              <ListRow
                key={meal.id}
                title={meal.meal_name}
                meta={meal.meal_type}
                right={<span className="text-xs font-black">{meal.calories ?? 0} kcal</span>}
              />
            ))}
            {!meals.length && <EmptyState>No meals logged yet.</EmptyState>}
          </div>
        </Panel>
      </Stagger>
    </>
  );
}
