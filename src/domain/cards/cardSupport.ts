import { safeStorage } from "@/lib/storage";
import type { Card } from "./cardTypes";

export type LanguageSupportMode = "english-first" | "english-only";

const LANGUAGE_SUPPORT_KEY = "parla.languageSupportMode";
const DEFAULT_MODE: LanguageSupportMode = "english-first";

function isLanguageSupportMode(value: string | null): value is LanguageSupportMode {
  return value === "english-first" || value === "english-only";
}

export function getLanguageSupportMode(): LanguageSupportMode {
  const stored = safeStorage.getItem(LANGUAGE_SUPPORT_KEY);
  return isLanguageSupportMode(stored) ? stored : DEFAULT_MODE;
}

export function setLanguageSupportMode(mode: LanguageSupportMode): void {
  safeStorage.setItem(LANGUAGE_SUPPORT_KEY, mode);
}

export function shouldShowJapaneseSupport(mode = getLanguageSupportMode()): boolean {
  return mode === "english-first";
}

export function getJapaneseHint(card: Card, mode = getLanguageSupportMode()): string | null {
  if (!shouldShowJapaneseSupport(mode)) return null;
  return card.support?.jaHint ?? null;
}
