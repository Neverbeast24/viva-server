"use client";

import { HeartPulse, TrendingDown, WalletCards } from "lucide-react";
import { addExpense } from "@/app/dashboard/spending/actions";
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

type Expense = {
  id: number;
  title: string;
  category: string;
  amount: number;
  spent_at: string;
};

export function SpendingView({
  expenses,
  monthlyBudget = 2000,
}: {
  expenses: Expense[];
  monthlyBudget?: number;
}) {
  const { pending, submit } = useModuleAction(addExpense);
  const total = expenses.reduce((sum, row) => sum + Number(row.amount), 0);
  const remaining = Math.max(0, monthlyBudget - total);
  const remainingPct = monthlyBudget > 0 ? Math.round((remaining / monthlyBudget) * 100) : 0;
  const wellnessShare = expenses.filter((row) =>
    ["fitness", "supplements", "wellness"].includes(row.category),
  ).length;
  const investmentIndex = expenses.length
    ? Math.min(100, Math.round((wellnessShare / expenses.length) * 70 + remainingPct * 0.3))
    : 0;

  return (
    <>
      <PageHeader eyebrow="SPENDING" title="Invest in" highlight="wellbeing." />

      <Panel title="Add expense" className="mb-4">
        <form action={submit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FormField label="Expense" hint="Required" className="sm:col-span-2">
            <input name="title" required placeholder="e.g. Weekly groceries" className={fieldClass} />
          </FormField>
          <FormField label="Category">
            <select name="category" defaultValue="food" className={fieldClass}>
              <option value="food">Food</option>
              <option value="fitness">Fitness</option>
              <option value="supplements">Supplements</option>
              <option value="wellness">Wellness</option>
              <option value="other">Other</option>
            </select>
          </FormField>
          <FormField label="Amount" hint="PHP">
            <input
              name="amount"
              type="number"
              min={0}
              step="0.01"
              required
              placeholder="0.00"
              className={fieldClass}
            />
          </FormField>
          <PrimaryButton disabled={pending} className="sm:col-span-2 lg:col-span-4">
            {pending ? "Saving…" : "Add expense"}
          </PrimaryButton>
        </form>
      </Panel>

      <Stagger>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Health investment"
            value={`₱${total.toLocaleString()}`}
            detail={`${expenses.length} expenses`}
            icon={WalletCards}
            className="bg-gradient-to-br from-[#5f45e6] to-[#9a57e9] text-white"
          />
          <StatCard
            label="Budget left"
            value={`₱${remaining.toLocaleString()}`}
            suffix={`/ ₱${monthlyBudget.toLocaleString()}`}
            detail={`${remainingPct}% remaining`}
            icon={TrendingDown}
            className="bg-[#e8fbf8] text-[#183d3a]"
          />
          <StatCard
            label="Investment index"
            value={String(investmentIndex)}
            detail={
              expenses.length
                ? `${wellnessShare} wellness-focused expenses`
                : "Add an expense to score"
            }
            icon={HeartPulse}
            className="bg-[#fff3e8] text-[#533621]"
          />
        </div>

        <Panel title="Recent expenses" className="mt-4">
          <div className="space-y-2">
            {expenses.map((expense) => (
              <ListRow
                key={expense.id}
                title={expense.title}
                meta={expense.category}
                right={
                  <span className="text-xs font-black">
                    ₱{Number(expense.amount).toLocaleString()}
                  </span>
                }
              />
            ))}
            {!expenses.length && <EmptyState>No expenses yet.</EmptyState>}
          </div>
        </Panel>
      </Stagger>
    </>
  );
}
