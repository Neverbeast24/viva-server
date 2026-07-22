"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  THEME_COOKIE,
  THEME_STORAGE_KEY,
  isThemePreference,
  resolveTheme,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";

type ThemeContextValue = {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

let memoryTheme: ThemePreference | null = null;
const listeners = new Set<() => void>();

function readStoredTheme(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemePreference(raw)) return raw;
  } catch {
    /* ignore */
  }
  return "system";
}

function persistTheme(theme: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
  const secure =
    typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${THEME_COOKIE}=${encodeURIComponent(theme)}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
}

function applyResolved(resolved: ResolvedTheme, preference: ThemePreference) {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
  root.dataset.theme = preference;
}

function emit() {
  for (const listener of listeners) listener();
}

function writeTheme(theme: ThemePreference) {
  memoryTheme = theme;
  persistTheme(theme);
  applyResolved(
    resolveTheme(theme, window.matchMedia("(prefers-color-scheme: dark)").matches),
    theme,
  );
  emit();
}

function subscribePreference(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function subscribeSystemTheme(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getSystemDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getServerSystemDark() {
  return false;
}

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  /** Server-known preference (e.g. from cookie / user_settings). */
  initialTheme?: ThemePreference | null;
}) {
  const serverTheme: ThemePreference = isThemePreference(initialTheme)
    ? initialTheme
    : "system";

  const theme = useSyncExternalStore(
    subscribePreference,
    () => memoryTheme ?? readStoredTheme(),
    () => serverTheme,
  );

  const systemDark = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemDark,
    getServerSystemDark,
  );

  // Seed from server cookie / account preference without fighting the boot script.
  useEffect(() => {
    if (isThemePreference(initialTheme)) {
      if (memoryTheme !== initialTheme) writeTheme(initialTheme);
      return;
    }
    if (memoryTheme == null) writeTheme(readStoredTheme());
  }, [initialTheme]);

  // Keep DOM in sync when OS preference flips under "system".
  useEffect(() => {
    if (theme !== "system") return;
    applyResolved(resolveTheme("system", systemDark), "system");
  }, [theme, systemDark]);

  const setTheme = useCallback((next: ThemePreference) => {
    writeTheme(next);
  }, []);

  const resolvedTheme = resolveTheme(theme, systemDark);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
