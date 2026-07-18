import { GoogleGenerativeAI } from "@google/generative-ai";

export type InsightPayload = {
  title: string;
  body: string;
  score: number;
};

/** Compact wellness primer — better than dumping huge public datasets. */
export const WELLNESS_GUIDE = `
VIVA wellness principles (use as soft guidance, not medical advice):
- Energy and mood improve with consistent sleep (7–9h), protein-forward meals, and daily movement.
- Hydration target ~2–2.5L/day for most adults unless otherwise advised by a clinician.
- Prefer whole foods, fiber, and steady protein across the day over large sugar spikes.
- Strength + walking beats all-or-nothing intense workouts for sustainable habits.
- Health spending is an investment when it supports food quality, movement, sleep, or recovery.
- Never diagnose disease. Suggest gentle next actions the user can do today.
`.trim();

export function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? "gemini-flash-latest",
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
    },
  });
}

export async function generateHealthInsight(context: string): Promise<InsightPayload> {
  const model = getGeminiModel();
  const prompt = `${WELLNESS_GUIDE}

You are VIVA, a calm personal vitality coach.
Using ONLY the user's recent logs below, return ONE actionable insight as JSON with keys:
- "title": short headline (max 8 words)
- "body": 2–3 sentences with a concrete next action for today/tomorrow
- "score": integer 0–100 reflecting how confident/useful this recommendation is for this user right now

If data is sparse, still give a helpful starter habit suggestion and lower the score.
Do not invent medical diagnoses. Do not mention that you are an AI model.

USER LOGS:
${context}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = JSON.parse(text) as Partial<InsightPayload>;

  const title = String(parsed.title ?? "Keep your rhythm gentle").slice(0, 120);
  const body = String(
    parsed.body ??
      "Log a check-in and one meal today so VIVA can personalize your next move.",
  ).slice(0, 1200);
  const score = Math.min(100, Math.max(0, Math.round(Number(parsed.score ?? 70))));

  return { title, body, score };
}
