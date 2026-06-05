import { en } from "@/lib/i18n/en";
import { kk } from "@/lib/i18n/kk";
import { ru } from "@/lib/i18n/ru";
import type { WorkPayLanguage } from "@/lib/domain/types";

const dictionaries = { en, ru, kk };

export function getDictionary(language: WorkPayLanguage = "en") {
  return dictionaries[language] ?? dictionaries.en;
}
