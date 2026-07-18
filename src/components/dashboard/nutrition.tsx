"use client";

import { Apple, Droplets, Flame } from "lucide-react";
import { logMeal } from "@/app/dashboard/nutrition/actions";
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

type Meal = {
  id: number;
  meal_name: string;
  meal_type: string;
  calories: number | null;
  protein_g: number | null;
  logged_at: string;
};

export function NutritionView({
  meals,
  waterMl = 0,
}: {
  meals: Meal[];
  waterMl?: number;
}) {
  const { pending, submit } = useModuleAction(logMeal);
  const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories ?? 0), 0);
  const totalProtein = meals.reduce((sum, meal) => sum + (meal.protein_g ?? 0), 0);
  const waterLiters = waterMl / 1000;
  const waterGoal = 2.4;
  const proteinGoal = 80;
  const calorieGoal = 2000;
  const dietScore = Math.min(
    100,
    Math.round(
      (Math.min(totalProtein, proteinGoal) / proteinGoal) * 45 +
        (Math.min(totalCalories, calorieGoal) / calorieGoal) * 35 +
        (meals.length > 0 ? 20 : 0),
    ),
  );

  return (
    <>
      <PageHeader eyebrow="NUTRITION" title="Eat with" highlight="intention." />

      <Panel title="Log a meal" className="mb-4">
        <form action={submit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FormField label="Meal" hint="Required" className="sm:col-span-2">
            <input name="meal_name" required placeholder="e.g. Chicken rice bowl" className={fieldClass} />
          </FormField>
          <FormField label="Meal type">
            <select name="meal_type" defaultValue="lunch" className={fieldClass}>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </FormField>
          <FormField label="Calories" hint="kcal">
            <input name="calories" type="number" min={0} placeholder="0" className={fieldClass} />
          </FormField>
          <FormField label="Protein" hint="grams">
            <input name="protein_g" type="number" min={0} step="0.1" placeholder="0" className={fieldClass} />
          </FormField>
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
            detail={`${meals.length} meals · ${Math.round(totalProtein)}g protein`}
            icon={Flame}
            className="bg-gradient-to-br from-[#5f45e6] to-[#9a57e9] text-white"
          />
          <StatCard
            label="Water"
            value={waterLiters.toFixed(1)}
            suffix={`/ ${waterGoal}L`}
            detail={
              waterMl >= waterGoal * 1000
                ? "Goal reached"
                : `${Math.max(0, Math.round(waterGoal * 1000 - waterMl))} ml to go`
            }
            icon={Droplets}
            className="bg-[#e8fbf8] text-[#183d3a]"
          />
          <StatCard
            label="Diet quality"
            value={`${dietScore}%`}
            detail={meals.length ? "Based on today’s logs" : "Log a meal to score"}
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
