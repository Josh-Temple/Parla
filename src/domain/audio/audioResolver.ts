import type { Card } from "../cards/cardTypes";
import type { AudioResolver } from "./audioTypes";

export class StaticAudioResolver implements AudioResolver {
  getPhraseAudioUrl(card: Card): string | null {
    return card.audio?.phraseUrl ?? null;
  }

  getExampleAudioUrl(card: Card): string | null {
    return card.audio?.exampleUrl ?? null;
  }
}
