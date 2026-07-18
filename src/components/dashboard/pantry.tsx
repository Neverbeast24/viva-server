"use client";

import { Refrigerator } from "lucide-react";
import { addPantryItem } from "@/app/dashboard/pantry/actions";
import {
  EmptyState,
  FormField,
  PageHeader,
  Panel,
  PrimaryButton,
  Progress,
  Stagger,
  StatCard,
  fieldClass,
} from "@/components/dashboard/ui";
import { useModuleAction } from "@/components/dashboard/use-module-action";

type PantryItem = {
  id: number;
  name: string;
  category: string;
  stock_level: number;
};

export function PantryView({ items }: { items: PantryItem[] }) {
  const { pending, submit } = useModuleAction(addPantryItem);

  return (
    <>
      <PageHeader eyebrow="PANTRY" title="Know what you" highlight="have." />

      <Panel title="Add pantry item" className="mb-4">
        <form action={submit} className="grid gap-3 sm:grid-cols-4">
          <FormField label="Pantry item" hint="Required" className="sm:col-span-2">
            <input name="name" required placeholder="e.g. Brown rice" className={fieldClass} />
          </FormField>
          <FormField label="Category">
            <select name="category" defaultValue="grains" className={fieldClass}>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="protein">Protein</option>
              <option value="dairy">Dairy</option>
              <option value="grains">Grains</option>
              <option value="snacks">Snacks</option>
              <option value="other">Other</option>
            </select>
          </FormField>
          <FormField label="Stock level" hint="percent">
            <input
              name="stock_level"
              type="number"
              min={0}
              max={100}
              defaultValue={50}
              className={fieldClass}
            />
          </FormField>
          <PrimaryButton disabled={pending} className="sm:col-span-4">
            {pending ? "Saving…" : "Add to pantry"}
          </PrimaryButton>
        </form>
      </Panel>

      <Stagger>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Items tracked"
            value={String(items.length)}
            detail="In your pantry"
            icon={Refrigerator}
            className="bg-gradient-to-br from-[#5f45e6] to-[#9a57e9] text-white"
          />
        </div>
        <Panel title="Stock levels" className="mt-4">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id}>
                <div className="mb-2 flex justify-between text-sm font-bold">
                  <span>{item.name}</span>
                  <span className="text-[#847f8c]">{item.stock_level}%</span>
                </div>
                <Progress value={item.stock_level} />
              </div>
            ))}
            {!items.length && (
              <EmptyState>No pantry items yet. Add your first item above.</EmptyState>
            )}
          </div>
        </Panel>
      </Stagger>
    </>
  );
}
