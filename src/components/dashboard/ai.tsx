"use client";

import { BrainCircuit, Sparkles } from "lucide-react";
import { generateInsight } from "@/app/dashboard/ai/actions";
import { EmptyState, PageHeader, Panel, PrimaryButton, Stagger } from "@/components/dashboard/ui";
import { useModuleAction } from "@/components/dashboard/use-module-action";

type Insight = {
  id: number;
  title: string;
  body: string;
  score: number | null;
  created_at: string;
};

export function AiView({ insights }: { insights: Insight[] }) {
  const { pending, submit } = useModuleAction(generateInsight);

  return (
    <>
      <PageHeader
        eyebrow="AI DECISION ENGINE"
        title="Your best"
        highlight="next action."
        action={
          <PrimaryButton
            disabled={pending}
            onClick={() => submit(new FormData())}
            className="rounded-full px-5"
          >
            {pending ? "Generating…" : "Generate insight"}
          </PrimaryButton>
        }
      />

      <Stagger>
        <div className="grid gap-4">
          {insights.map((item) => (
            <Panel key={item.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black tracking-[0.16em] text-[#5f45e6]">
                    VIVA INSIGHT
                  </p>
                  <h2 className="font-display mt-2 text-xl tracking-tight">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[#6f6b79]">{item.body}</p>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#ece7fb] text-[#5f45e6]">
                  <BrainCircuit size={18} />
                </span>
              </div>
              {item.score != null && (
                <p className="mt-4 text-xs font-bold text-[#8a8491]">
                  Decision score: {item.score}/100
                </p>
              )}
            </Panel>
          ))}
          {!insights.length && (
            <EmptyState>
              <span className="inline-flex items-center gap-2">
                <Sparkles size={16} /> No insights yet. Generate your first recommendation.
              </span>
            </EmptyState>
          )}
        </div>
      </Stagger>
    </>
  );
}
