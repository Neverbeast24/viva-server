import { createBrowserClient } from "@supabase/ssr";

function getPublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Copy .env.example to .env.local and add the publishable key.",
    );
  }

  return { url, key };
}

export function createClient() {
  const { url, key } = getPublicConfig();
  return createBrowserClient(url, key);
}
