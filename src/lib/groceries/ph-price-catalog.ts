/** Philippine calendar helpers + dynamic grocery pricing (₱). */

export const PH_TIMEZONE = "Asia/Manila";

/** Catalog unit prices are calibrated to this PH year (approx. mid-market). */
export const PRICE_BASE_YEAR = 2025;

/** Soft annual food inflation used to roll catalog forward by calendar year. */
export const ANNUAL_FOOD_INFLATION = 0.04;

export type PhCalendarDate = {
  year: number;
  month: number; // 1–12
  day: number;
  isoDate: string; // YYYY-MM-DD
  monthStart: string; // YYYY-MM-01
  monthLabel: string; // e.g. July 2026
};

export function getPhCalendarDate(now: Date = new Date()): PhCalendarDate {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: PH_TIMEZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);

  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);
  const isoDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
  const monthLabel = new Intl.DateTimeFormat("en-PH", {
    timeZone: PH_TIMEZONE,
    month: "long",
    year: "numeric",
  }).format(now);

  return { year, month, day, isoDate, monthStart, monthLabel };
}

/** Typical Philippine supermarket / wet-market unit prices in PHP (base year). */
export const PH_GROCERY_PRICE_CATALOG: Record<string, number> = {
  // produce
  apple: 25,
  apples: 150,
  banana: 15,
  bananas: 80,
  mango: 40,
  tomato: 20,
  tomatoes: 80,
  onion: 25,
  onions: 70,
  garlic: 20,
  potato: 30,
  potatoes: 90,
  carrot: 25,
  carrots: 70,
  cabbage: 45,
  lettuce: 50,
  cucumber: 25,
  eggplant: 30,
  kangkong: 20,
  pechay: 25,
  calamansi: 30,
  lemon: 35,
  orange: 30,
  papaya: 50,
  ginger: 25,
  "green beans": 60,
  "bell pepper": 40,
  spinach: 40,
  broccoli: 90,
  avocado: 60,

  // protein
  chicken: 180,
  "chicken breast": 220,
  "chicken thighs": 190,
  egg: 10,
  eggs: 90,
  "egg tray": 280,
  tuna: 45,
  "canned tuna": 45,
  bangus: 160,
  tilapia: 140,
  galunggong: 120,
  pork: 280,
  "ground pork": 260,
  beef: 380,
  "ground beef": 350,
  tofu: 35,
  tokwa: 30,
  "fish fillet": 200,
  shrimp: 320,
  "sardines can": 28,

  // dairy
  milk: 95,
  "fresh milk": 95,
  "oat milk": 120,
  oatside: 110,
  yogurt: 55,
  cheese: 90,
  butter: 85,
  "evaporated milk": 45,
  "condensed milk": 50,

  // grains
  rice: 60,
  "rice 1kg": 60,
  "brown rice": 85,
  quinoa: 180,
  oats: 95,
  bread: 65,
  "whole wheat bread": 85,
  pasta: 55,
  noodles: 20,
  "pancit canton": 18,
  "instant noodles": 18,
  flour: 55,
  "corn flakes": 120,

  // pantry
  oil: 90,
  "cooking oil": 90,
  "olive oil": 220,
  soy: 35,
  "soy sauce": 35,
  vinegar: 30,
  salt: 20,
  sugar: 65,
  "brown sugar": 70,
  pepper: 35,
  "tomato sauce": 35,
  "coconut milk": 45,
  peanut: 80,
  "peanut butter": 120,
  honey: 150,
  "canned beans": 45,
  sardines: 28,
  "luncheon meat": 55,

  // snacks
  crackers: 45,
  biscuits: 40,
  nuts: 90,
  "trail mix": 110,
  chips: 50,
  popcorn: 40,
  "granola bar": 35,

  // drinks
  water: 25,
  "bottled water": 25,
  juice: 55,
  coffee: 180,
  "instant coffee": 120,
  tea: 80,
  "green tea": 90,
  "coconut water": 45,
  gatorade: 40,

  // household
  soap: 45,
  "dish soap": 55,
  shampoo: 120,
  toothpaste: 85,
  "laundry detergent": 95,
  "tissue paper": 55,
  "paper towel": 60,
};

const CATEGORY_DEFAULTS: Record<string, number> = {
  produce: 60,
  protein: 180,
  dairy: 90,
  grains: 70,
  pantry: 55,
  snacks: 50,
  drinks: 45,
  household: 70,
  other: 50,
};

/** Broad PH seasonal pressure by category (1 = baseline). Index 0 unused; 1–12 = Jan–Dec. */
const CATEGORY_SEASON: Record<string, number[]> = {
  produce: [0, 1.02, 1.0, 0.95, 0.92, 0.94, 1.08, 1.12, 1.1, 1.06, 1.0, 1.08, 1.15],
  protein: [0, 1.04, 1.08, 1.02, 1.0, 1.0, 1.03, 1.04, 1.03, 1.02, 1.05, 1.1, 1.14],
  dairy: [0, 1.02, 1.02, 1.01, 1.0, 1.0, 1.02, 1.03, 1.02, 1.01, 1.02, 1.04, 1.06],
  grains: [0, 1.01, 1.01, 1.0, 1.0, 1.0, 1.02, 1.03, 1.02, 1.01, 1.01, 1.03, 1.05],
  pantry: [0, 1.01, 1.01, 1.0, 1.0, 1.0, 1.01, 1.02, 1.01, 1.01, 1.02, 1.04, 1.06],
  snacks: [0, 1.02, 1.03, 1.01, 1.0, 1.0, 1.01, 1.02, 1.01, 1.02, 1.04, 1.08, 1.12],
  drinks: [0, 1.0, 1.0, 1.02, 1.04, 1.05, 1.03, 1.02, 1.01, 1.0, 1.02, 1.05, 1.08],
  household: [0, 1.01, 1.01, 1.0, 1.0, 1.0, 1.01, 1.01, 1.01, 1.0, 1.02, 1.04, 1.05],
  other: [0, 1.02, 1.02, 1.01, 1.0, 1.0, 1.02, 1.03, 1.02, 1.01, 1.03, 1.06, 1.08],
};

/** Item-level PH seasonality on top of category (peak/off-season). */
const ITEM_SEASON: Record<string, number[]> = {
  mango: [0, 1.25, 1.15, 0.85, 0.75, 0.8, 1.1, 1.2, 1.25, 1.2, 1.15, 1.2, 1.3],
  banana: [0, 1.0, 1.0, 0.98, 0.95, 0.95, 1.05, 1.08, 1.06, 1.02, 1.0, 1.02, 1.05],
  bananas: [0, 1.0, 1.0, 0.98, 0.95, 0.95, 1.05, 1.08, 1.06, 1.02, 1.0, 1.02, 1.05],
  calamansi: [0, 1.05, 1.0, 0.95, 0.9, 0.95, 1.1, 1.15, 1.12, 1.05, 1.0, 1.05, 1.1],
  tomato: [0, 1.05, 1.0, 0.95, 0.9, 0.95, 1.12, 1.18, 1.15, 1.08, 1.0, 1.05, 1.12],
  tomatoes: [0, 1.05, 1.0, 0.95, 0.9, 0.95, 1.12, 1.18, 1.15, 1.08, 1.0, 1.05, 1.12],
  onion: [0, 1.08, 1.05, 1.0, 0.95, 0.95, 1.1, 1.15, 1.12, 1.05, 1.0, 1.08, 1.15],
  onions: [0, 1.08, 1.05, 1.0, 0.95, 0.95, 1.1, 1.15, 1.12, 1.05, 1.0, 1.08, 1.15],
  garlic: [0, 1.1, 1.08, 1.02, 1.0, 1.0, 1.05, 1.08, 1.06, 1.02, 1.05, 1.12, 1.18],
  rice: [0, 1.02, 1.02, 1.0, 0.98, 0.98, 1.02, 1.04, 1.03, 1.0, 1.02, 1.05, 1.08],
  "rice 1kg": [0, 1.02, 1.02, 1.0, 0.98, 0.98, 1.02, 1.04, 1.03, 1.0, 1.02, 1.05, 1.08],
  chicken: [0, 1.03, 1.06, 1.02, 1.0, 1.0, 1.02, 1.03, 1.02, 1.02, 1.05, 1.1, 1.14],
  pork: [0, 1.04, 1.08, 1.02, 1.0, 1.0, 1.02, 1.03, 1.02, 1.02, 1.06, 1.12, 1.16],
  egg: [0, 1.04, 1.06, 1.02, 1.0, 1.0, 1.03, 1.05, 1.04, 1.02, 1.04, 1.08, 1.12],
  eggs: [0, 1.04, 1.06, 1.02, 1.0, 1.0, 1.03, 1.05, 1.04, 1.02, 1.04, 1.08, 1.12],
  "egg tray": [0, 1.04, 1.06, 1.02, 1.0, 1.0, 1.03, 1.05, 1.04, 1.02, 1.04, 1.08, 1.12],
};

function normalizeName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export function yearInflationFactor(year: number) {
  const yearsAhead = Math.max(0, year - PRICE_BASE_YEAR);
  return Math.pow(1 + ANNUAL_FOOD_INFLATION, yearsAhead);
}

export function seasonalFactor(
  name: string,
  category: string | null | undefined,
  month: number,
): number {
  const key = normalizeName(name);
  const cat = category ?? "other";
  const catTable = CATEGORY_SEASON[cat] ?? CATEGORY_SEASON.other;
  const categoryFactor = catTable[month] ?? 1;
  const itemTable =
    ITEM_SEASON[key] ??
    Object.entries(ITEM_SEASON).find(([k]) => key.includes(k) || k.includes(key))?.[1];
  const itemFactor = itemTable?.[month] ?? 1;
  return categoryFactor * itemFactor;
}

export function priceMarketContext(now: Date = new Date()) {
  const ph = getPhCalendarDate(now);
  const inflation = yearInflationFactor(ph.year);
  return {
    ...ph,
    timezone: PH_TIMEZONE,
    inflation_factor: Number(inflation.toFixed(4)),
    base_year: PRICE_BASE_YEAR,
    note: `Estimates use ${ph.monthLabel} PH market seasonality + ~${Math.round(ANNUAL_FOOD_INFLATION * 100)}%/yr from ${PRICE_BASE_YEAR}.`,
  };
}

function baseUnitPrice(name: string, category?: string | null) {
  const key = normalizeName(name);
  return (
    PH_GROCERY_PRICE_CATALOG[key] ??
    Object.entries(PH_GROCERY_PRICE_CATALOG).find(([k]) => key.includes(k) || k.includes(key))?.[1] ??
    CATEGORY_DEFAULTS[category ?? "other"] ??
    50
  );
}

function quantityMultiplier(quantity?: string | null) {
  const qtyText = (quantity ?? "1").toLowerCase();
  const numeric = Number.parseFloat(qtyText.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(numeric) || numeric <= 0) return 1;
  if (/\bkg\b/.test(qtyText) || /\bkilo/.test(qtyText)) return numeric;
  if (/\bg\b/.test(qtyText) && numeric >= 100) return numeric / 1000;
  if (/dozen|tray/.test(qtyText)) return numeric;
  if (/pcs?|pieces?|pack|packs|cans?|bottles?/.test(qtyText)) {
    return numeric <= 3 ? 1 : Math.min(8, 1 + (numeric - 1) * 0.35);
  }
  if (numeric > 1 && numeric <= 20) return Math.min(6, 1 + (numeric - 1) * 0.4);
  return 1;
}

/** Estimate a line price in PHP using today's Asia/Manila year + month. */
export function estimateGroceryPrice(
  name: string,
  quantity?: string | null,
  category?: string | null,
  now: Date = new Date(),
): number {
  const ph = getPhCalendarDate(now);
  const unit = baseUnitPrice(name, category);
  const adjusted =
    unit *
    yearInflationFactor(ph.year) *
    seasonalFactor(name, category, ph.month) *
    quantityMultiplier(quantity);
  return Math.max(5, Math.round(adjusted));
}

export function formatPhp(amount: number) {
  return `₱${amount.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;
}

export function catalogHintForPrompt(now: Date = new Date()) {
  const ph = getPhCalendarDate(now);
  const inflation = yearInflationFactor(ph.year);
  const samples = Object.entries(PH_GROCERY_PRICE_CATALOG)
    .slice(0, 40)
    .map(([name, price]) => {
      const live = Math.round(
        price * inflation * seasonalFactor(name, guessCategory(name), ph.month),
      );
      return `${name}: ₱${live}`;
    })
    .join(", ");
  return `PH market prices for ${ph.monthLabel} (Asia/Manila). Adjust for quantity; stay inside remaining monthly budget. Live samples: ${samples}`;
}

function guessCategory(name: string) {
  const key = normalizeName(name);
  if (
    /(apple|banana|mango|tomato|onion|garlic|potato|carrot|cabbage|lettuce|cucumber|eggplant|kangkong|pechay|calamansi|lemon|orange|papaya|ginger|spinach|broccoli|avocado|pepper|beans)/.test(
      key,
    )
  ) {
    return "produce";
  }
  if (/(chicken|egg|tuna|bangus|tilapia|pork|beef|tofu|tokwa|fish|shrimp|sardine)/.test(key)) {
    return "protein";
  }
  if (/(milk|oatside|yogurt|cheese|butter)/.test(key)) return "dairy";
  if (/(rice|quinoa|oats|bread|pasta|noodle|flour|corn)/.test(key)) return "grains";
  if (/(oil|soy|vinegar|salt|sugar|pepper|sauce|coconut|peanut|honey|bean|luncheon)/.test(key)) {
    return "pantry";
  }
  if (/(cracker|biscuit|nut|chip|popcorn|granola)/.test(key)) return "snacks";
  if (/(water|juice|coffee|tea|gatorade)/.test(key)) return "drinks";
  if (/(soap|shampoo|toothpaste|detergent|tissue|towel)/.test(key)) return "household";
  return "other";
}
