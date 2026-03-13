export type CardFunction = "request" | "refusal" | "opinion" | "softening" | "clarification" | "agreement" | "disagreement" | "suggestion";

export type CardRegister = "casual" | "neutral" | "polite" | "formal";

export type CardCategory = "Requests" | "Refusals / Limits" | "Opinions" | "Softeners / Cushioning";

export interface Card {
  id: string;
  category: CardCategory;
  phrase: string;
  function: CardFunction;
  register: CardRegister;
  pattern: string;
  example: string;
  notes: string;
  tags: string[];
  similar: string[];
  contrast: string;
  prompts: {
    intent: string;
    situation: string;
    cloze?: string;
  };
  support?: {
    jaHint?: string;
  };
  difficulty: number;
  audio?: {
    phraseUrl?: string;
    exampleUrl?: string;
    voice?: string;
  };
  status: {
    published: boolean;
  };
}

export interface CardDataset {
  schema_version: number;
  cards: Card[];
}

export interface CardFilters {
  category?: CardCategory;
  function?: CardFunction;
  register?: CardRegister;
  tags?: string[];
}
