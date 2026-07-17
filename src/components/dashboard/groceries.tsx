"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Carrot, Check, Milk, Package, Plus, ShoppingBasket, Sparkles } from "lucide-react";
import { PageHeader, Panel, Progress, Stagger, StatCard } from "@/components/dashboard/ui";

type Item = { id: number; name: string; qty: string; done: boolean };

const initialList: Item[] = [
  { id: 1, name: "Rolled oats", qty: "1 kg", done: false },
  { id: 2, name: "Greek yogurt", qty: "2 tubs", done: true },
  { id: 3, name: "Chicken breast", qty: "1 kg", done: false },
  { id: 4, name: "Spinach", qty: "2 bunches", done: false },
  { id: 5, name: "Bananas", qty: "1 dozen", done: true },
];

const pantry: [typeof Carrot, string, number][] = [
  [Milk, "Dairy", 60],
  [Carrot, "Vegetables", 35],
  [Package, "Grains", 80],
];

export function GroceriesView() {
  const [list, setList] = useState<Item[]>(initialList);
  const done = list.filter((item) => item.done).length;

  function toggle(id: number) {
    setList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="GROCERIES"
        title="Shop"
        highlight="smarter."
        action={
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#24212e] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#7557ff]"
          >
            <Plus size={16} /> Add item
          </motion.button>
        }
      />

      <Stagger>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="List progress"
            value={`${done}/${list.length}`}
            detail="Items checked off"
            icon={ShoppingBasket}
            className="bg-gradient-to-br from-[#7055ed] to-[#9a57e9] text-white"
          />
          <StatCard
            label="Est. budget"
            value="₱1,240"
            detail="Under weekly plan"
            icon={Package}
            className="bg-[#e8fbf8] text-[#183d3a]"
          />
          <StatCard
            label="Pantry health"
            value="Good"
            detail="Restock 2 items soon"
            icon={Carrot}
            className="bg-[#fff3e8] text-[#533621]"
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <Panel
            title="Shopping list"
            right={
              <span className="rounded-full bg-[#f3f0ff] px-3 py-1.5 text-xs font-bold text-[#6f55df]">
                {done}/{list.length}
              </span>
            }
          >
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {list.map((item) => (
                  <motion.button
                    key={item.id}
                    layout
                    onClick={() => toggle(item.id)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex w-full items-center gap-3 rounded-2xl border border-black/5 bg-white/70 p-3.5 text-left transition hover:bg-white"
                  >
                    <span
                      className={`grid size-6 place-items-center rounded-lg border-2 transition ${
                        item.done
                          ? "border-[#26bea9] bg-[#26bea9] text-white"
                          : "border-[#d8d3df]"
                      }`}
                    >
                      {item.done && <Check size={13} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm font-bold ${
                          item.done ? "text-[#a9a4b0] line-through" : ""
                        }`}
                      >
                        {item.name}
                      </span>
                    </span>
                    <span className="text-xs font-semibold text-[#847f8c]">{item.qty}</span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </Panel>

          <div className="space-y-4">
            <Panel title="Pantry levels">
              <div className="space-y-5">
                {pantry.map(([Icon, label, level]) => (
                  <div key={label}>
                    <div className="mb-2 flex items-center gap-2 text-sm font-bold">
                      <Icon size={15} className="text-[#7557ff]" />
                      {label}
                      <span className="ml-auto text-xs text-[#847f8c]">{level}%</span>
                    </div>
                    <Progress value={level} />
                  </div>
                ))}
              </div>
            </Panel>

            <motion.article
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
              className="rounded-[1.6rem] bg-gradient-to-br from-[#ddf8f3] via-[#eefaf6] to-[#f7f2ff] p-5"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-white text-[#7557ff] shadow-sm">
                <Sparkles size={18} />
              </span>
              <p className="mt-6 text-sm font-bold leading-6">
                Swap white rice for quinoa to boost protein this week within the same budget.
              </p>
            </motion.article>
          </div>
        </div>
      </Stagger>
    </>
  );
}
