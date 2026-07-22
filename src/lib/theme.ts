export const THEME_COOKIE = "vivrant-theme";
export const THEME_STORAGE_KEY = "vivrant-theme";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

export function resolveTheme(
  preference: ThemePreference,
  systemDark: boolean,
): ResolvedTheme {
  if (preference === "system") return systemDark ? "dark" : "light";
  return preference;
}

/** Inline boot script — keeps first paint aligned with saved / system preference. */
export const themeBootScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var c=${JSON.stringify(THEME_COOKIE)};var m=document.cookie.match(new RegExp("(?:^|; )"+c+"=([^;]*)"));var t=m?decodeURIComponent(m[1]):null;if(t!=="light"&&t!=="dark"&&t!=="system"){t=localStorage.getItem(k)}if(t!=="light"&&t!=="dark"&&t!=="system"){t="system"}var d=window.matchMedia("(prefers-color-scheme: dark)").matches;var r=t==="system"?(d?"dark":"light"):t;var e=document.documentElement;e.classList.toggle("dark",r==="dark");e.style.colorScheme=r;e.dataset.theme=t}catch(e){}})();`;
