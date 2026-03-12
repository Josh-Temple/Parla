import type { Card } from "../cards/cardTypes";

export interface AudioResolver {
  getPhraseAudioUrl(card: Card): string | null;
  getExampleAudioUrl(card: Card): string | null;
}
