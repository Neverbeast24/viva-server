"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Brand } from "@/components/brand";

type FoodKind = "healthy" | "unhealthy";

type Food = {
  id: string;
  emoji: string;
  name: string;
  kind: FoodKind;
  tip: string;
};

type CartItem = Food & { key: string };

type Toast = {
  id: number;
  tone: "good" | "warn";
  title: string;
  body: string;
};

const FOODS: Food[] = [
  { id: "apple", emoji: "🍎", name: "Apple", kind: "healthy", tip: "Fiber + steady energy" },
  { id: "salad", emoji: "🥗", name: "Salad", kind: "healthy", tip: "Greens keep you light" },
  { id: "salmon", emoji: "🐟", name: "Salmon", kind: "healthy", tip: "Omega-3 for focus" },
  { id: "yogurt", emoji: "🥣", name: "Yogurt", kind: "healthy", tip: "Protein that lasts" },
  { id: "broccoli", emoji: "🥦", name: "Broccoli", kind: "healthy", tip: "Quiet micronutrient win" },
  { id: "berries", emoji: "🫐", name: "Berries", kind: "healthy", tip: "Antioxidant snack" },
  { id: "oats", emoji: "🌾", name: "Oats", kind: "healthy", tip: "Slow-burn fuel" },
  { id: "avocado", emoji: "🥑", name: "Avocado", kind: "healthy", tip: "Good fats, calm brain" },
  { id: "donut", emoji: "🍩", name: "Donut", kind: "unhealthy", tip: "Sugar spike, then crash" },
  { id: "fries", emoji: "🍟", name: "Fries", kind: "unhealthy", tip: "Heavy oil, low payoff" },
  { id: "soda", emoji: "🥤", name: "Soda", kind: "unhealthy", tip: "Empty calories" },
  { id: "burger", emoji: "🍔", name: "Burger", kind: "unhealthy", tip: "Save for a treat day" },
  { id: "candy", emoji: "🍬", name: "Candy", kind: "unhealthy", tip: "Quick hit, quick fade" },
  { id: "pizza", emoji: "🍕", name: "Pizza", kind: "unhealthy", tip: "Fun, not everyday fuel" },
  { id: "chips", emoji: "🍿", name: "Chips", kind: "unhealthy", tip: "Salt trap" },
  { id: "icecream", emoji: "🍦", name: "Ice cream", kind: "unhealthy", tip: "Dessert energy only" },
];

const GOOD_COPY = [
  "Nice pick — your future self thanks you.",
  "That one belongs in a strong day.",
  "Quiet win. Stack another.",
  "VIVA would approve this choice.",
];

const WARN_COPY = [
  "Not a villain — just not your everyday fuel.",
  "Okay as a treat. Try a healthier swap next.",
  "Your cart is getting noisier.",
  "Balance tip: add something green next.",
];

function shuffle<T>(list: T[]) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function pickShelf(exclude: Set<string> = new Set()) {
  const available = FOODS.filter((food) => !exclude.has(food.id));
  const pool = available.length >= 6 ? available : FOODS;
  return shuffle(pool).slice(0, 6);
}

export function HeroPanel() {
  const [shelf, setShelf] = useState<Food[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [toast, setToast] = useState<Toast | null>(null);
  const [cartPulse, setCartPulse] = useState<"good" | "warn" | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [ready, setReady] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setShelf(pickShelf());
    setReady(true);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
    };
  }, []);

  function showToast(tone: "good" | "warn", title: string, body: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    const next = { id: Date.now(), tone, title, body };
    setToast(next);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  function pulseCart(tone: "good" | "warn") {
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    setCartPulse(tone);
    pulseTimer.current = setTimeout(() => setCartPulse(null), 500);
  }

  function restock(removedId: string) {
    setShelf((current) => {
      const remaining = current.filter((food) => food.id !== removedId);
      // Strict Mode can invoke this updater twice — never grow past 6.
      if (remaining.length >= 6) return remaining.slice(0, 6);

      const used = new Set([
        ...remaining.map((food) => food.id),
        ...cart.map((item) => item.id),
        removedId,
      ]);
      const candidate =
        shuffle(FOODS.filter((food) => !used.has(food.id)))[0] ??
        shuffle(FOODS.filter((food) => food.id !== removedId))[0];
      return candidate ? [...remaining, candidate] : remaining;
    });
  }

  function addToCart(food: Food) {
    const isHealthy = food.kind === "healthy";
    setCart((current) =>
      [...current, { ...food, key: `${food.id}-${crypto.randomUUID()}` }].slice(-8),
    );
    setScore((value) => value + (isHealthy ? 12 : -6));
    setStreak((value) => {
      const next = isHealthy ? value + 1 : 0;
      setBestStreak((best) => Math.max(best, next));
      return next;
    });
    pulseCart(isHealthy ? "good" : "warn");
    showToast(
      isHealthy ? "good" : "warn",
      isHealthy ? `${food.emoji} ${food.name} · +12` : `${food.emoji} ${food.name} · −6`,
      `${food.tip}. ${
        isHealthy
          ? GOOD_COPY[Math.floor(Math.random() * GOOD_COPY.length)]
          : WARN_COPY[Math.floor(Math.random() * WARN_COPY.length)]
      }`,
    );
    restock(food.id);
  }

  function removeFromCart(key: string) {
    setCart((current) => current.filter((item) => item.key !== key));
  }

  function clearCart() {
    setCart([]);
    showToast("good", "Cart cleared", "Fresh start. Build a gentler plate.");
  }

  function onDropFood(event: React.DragEvent) {
    event.preventDefault();
    setDragOver(false);
    const id = event.dataTransfer.getData("text/food-id");
    const food = FOODS.find((item) => item.id === id);
    if (food) addToCart(food);
  }

  const healthyCount = cart.filter((item) => item.kind === "healthy").length;
  const balance =
    cart.length === 0 ? 50 : Math.round((healthyCount / cart.length) * 100);

  return (
    <section className="relative hidden overflow-hidden bg-[#1b1826] p-8 text-white lg:flex lg:flex-col xl:p-10">
      <div className="animate-glow absolute -left-32 top-24 size-[30rem] rounded-full bg-[#5f45e6]/28 blur-[100px]" />
      <div className="animate-glow-slow absolute -bottom-44 right-0 size-[32rem] rounded-full bg-[#0fb3ab]/20 blur-[110px]" />
      <div className="animate-glow-slow absolute left-1/3 top-1/2 size-[22rem] rounded-full bg-[#e4571f]/12 blur-[110px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <Brand tone="dark" />
        <div className="rounded-2xl border border-white/10 bg-white/6 px-3.5 py-2.5 backdrop-blur-xl">
          <p className="text-[10px] font-black tracking-[0.14em] text-white/45">VITALITY SCORE</p>
          <p className="mt-1 font-display text-2xl leading-none">
            {score}
            <span className="ml-2 text-xs font-bold text-white/40">pts</span>
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-8 max-w-lg">
        <p className="text-[11px] font-black tracking-[0.18em] text-[#b6a8ff]">PLAY WHILE YOU WAIT</p>
        <h1 className="font-display mt-3 text-4xl leading-[1.05] xl:text-5xl">
          Build a kinder plate.
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-white/55">
          Drag foods into your cart. Healthy picks raise your score — treats
          still teach you something.
        </p>
      </div>

      {/* Shelf */}
      <div className="relative z-10 mt-7">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-black tracking-[0.16em] text-white/40">TODAY&apos;S SHELF</p>
          <p className="text-[10px] font-bold text-white/35">
            {streak > 0 ? `${streak} healthy streak` : "Drag or tap a food"}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2.5 xl:grid-cols-6">
          {!ready &&
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-[5.5rem] animate-pulse rounded-2xl border border-white/8 bg-white/5"
              />
            ))}
          <AnimatePresence mode="popLayout">
            {shelf.map((food) => (
              <motion.button
                key={food.id}
                layout
                type="button"
                draggable
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7 }}
                whileHover={{ y: -4, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onDragStartCapture={(event) => {
                  const data = (event as unknown as React.DragEvent<HTMLButtonElement>)
                    .dataTransfer;
                  data.setData("text/food-id", food.id);
                  data.effectAllowed = "copy";
                }}
                onClick={() => addToCart(food)}
                className={`group cursor-grab rounded-2xl border px-2 py-3 text-center backdrop-blur-xl transition active:cursor-grabbing ${
                  food.kind === "healthy"
                    ? "border-emerald-400/25 bg-emerald-400/10 hover:border-emerald-300/45"
                    : "border-[#e4571f]/25 bg-[#e4571f]/10 hover:border-[#e4571f]/45"
                }`}
              >
                <span className="block text-2xl transition group-hover:scale-110">{food.emoji}</span>
                <span className="mt-1.5 block text-[10px] font-black text-white/80">{food.name}</span>
                <span
                  className={`mt-1 block text-[9px] font-bold ${
                    food.kind === "healthy" ? "text-emerald-300/80" : "text-[#ffb089]/80"
                  }`}
                >
                  {food.kind === "healthy" ? "healthy" : "treat"}
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Cart drop zone */}
      <motion.div
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDropFood}
        animate={{
          scale: cartPulse ? 1.02 : 1,
          borderColor:
            cartPulse === "good"
              ? "rgba(52, 211, 153, 0.55)"
              : cartPulse === "warn"
                ? "rgba(228, 87, 31, 0.55)"
                : dragOver
                  ? "rgba(182, 168, 255, 0.55)"
                  : "rgba(255, 255, 255, 0.12)",
        }}
        className="relative z-10 mt-5 flex min-h-[11.5rem] flex-1 flex-col rounded-[1.7rem] border border-dashed bg-white/5 p-4 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-white/10 text-xl">🛒</span>
            <div>
              <p className="text-sm font-black">Your cart</p>
              <p className="text-[11px] font-semibold text-white/45">
                {cart.length === 0
                  ? "Drop foods here"
                  : `${healthyCount}/${cart.length} healthy · balance ${balance}%`}
              </p>
            </div>
          </div>
          {cart.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="focus-ring rounded-full border border-white/12 px-3 py-1.5 text-[10px] font-black tracking-wide text-white/55 transition hover:bg-white/10 hover:text-white"
            >
              CLEAR
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-1 flex-wrap content-start gap-2">
          <AnimatePresence>
            {cart.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="m-auto max-w-[14rem] text-center text-xs leading-5 text-white/35"
              >
                Drag an apple in for a quiet win — or try a treat and see the feedback.
              </motion.p>
            ) : (
              cart.map((item) => (
                <motion.button
                  key={item.key}
                  type="button"
                  layout
                  initial={{ opacity: 0, scale: 0.6, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  whileHover={{ scale: 1.06 }}
                  onClick={() => removeFromCart(item.key)}
                  title={`${item.name} — click to remove`}
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-bold backdrop-blur-md ${
                    item.kind === "healthy"
                      ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-100"
                      : "border-[#e4571f]/30 bg-[#e4571f]/15 text-[#ffd2b8]"
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.name}</span>
                </motion.button>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Balance bar */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold text-white/40">
            <span>Plate balance</span>
            <span>
              best streak {bestStreak}
              {streak > 0 ? ` · now ${streak}` : ""}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#e4571f] via-[#b6a8ff] to-emerald-400"
              animate={{ width: `${balance}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Toast feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            className={`absolute bottom-6 left-8 right-8 z-20 rounded-2xl border px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,.35)] backdrop-blur-xl xl:left-auto xl:right-10 xl:w-80 ${
              toast.tone === "good"
                ? "border-emerald-400/30 bg-emerald-950/70"
                : "border-[#e4571f]/30 bg-[#3a1d12]/80"
            }`}
          >
            <p className="text-sm font-black">{toast.title}</p>
            <p className="mt-1 text-xs leading-5 text-white/65">{toast.body}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
