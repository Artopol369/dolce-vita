import de from "./de.json";
import uk from "./uk.json";

export type Locale = "de" | "uk";
export const locales: Locale[] = ["de", "uk"];
export const defaultLocale: Locale = "de";

const dict = { de, uk } as const;

export function t(locale: Locale) {
  return dict[locale];
}

export function getLocaleFromUrl(url: URL): Locale {
  const seg = url.pathname.split("/").filter(Boolean)[0];
  if (seg === "uk") return "uk";
  return "de";
}

export function localizePath(locale: Locale, path: string): string {
  const clean = path.replace(/^\/+/, "/");
  if (locale === "de") return clean;
  return `/uk${clean === "/" ? "" : clean}`;
}

export function alternateHref(currentLocale: Locale, currentPath: string): string {
  const otherLocale = currentLocale === "de" ? "uk" : "de";
  const stripped = currentPath.replace(/^\/uk/, "") || "/";
  if (otherLocale === "de") return stripped;
  return `/uk${stripped === "/" ? "" : stripped}`;
}

export function pickBilingual<T extends Record<string, any>>(item: T, locale: Locale, baseKey: string): string {
  const localized = item[`${baseKey}_${locale}`];
  if (localized) return localized as string;
  const fallback = item[`${baseKey}_${locale === "de" ? "uk" : "de"}`];
  return (fallback ?? item[baseKey] ?? "") as string;
}
