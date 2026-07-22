"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";
import { isThemePreference, type ThemePreference } from "@/lib/theme";

/** Applies the account theme preference once when dashboard/admin mounts. */
export function ThemeSync({ theme }: { theme?: string | null }) {
  const { setTheme } = useTheme();
  const applied = useRef(false);

  useEffect(() => {
    if (applied.current) return;
    if (!isThemePreference(theme)) return;
    applied.current = true;
    setTheme(theme as ThemePreference);
  }, [theme, setTheme]);

  return null;
}
