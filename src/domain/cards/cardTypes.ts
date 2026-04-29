export type CardFunction =
  | "request"
  | "refusal"
  | "opinion"
  | "softening"
  | "clarification"
  | "agreement"
  | "disagreement"
  | "suggestion"
  | "identity"
  | "intent"
  | "daily"
  | "repair"
  | "question"
  | "meaning"
  | "expression"
  | "simplification"
  | "correction"
  | "voice_control"
  | "conversation_control"
  | "topic_practice"
  | "learning_state";

export type CardRegister = "casual" | "neutral" | "polite" | "formal";

export type CardCategory =
  | "Requests"
  | "Refusals / Limits"
  | "Opinions"
  | "Softeners / Cushioning"
  | "Core Patterns"
  | "Intent / Plans"
  | "Daily Actions / Time"
  | "Opinions / Uncertainty"
  | "Repair / Survival"
  | "Conversation Questions"
  | "AI Questions"
  | "Meaning Help"
  | "Simpler English"
  | "Corrections"
  | "Voice Practice"
  | "Conversation Control"
  | "Topic Practice"
  | "Learning State";

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
  family?: string;
  slots?: string[];
  quick_variations?: string[];
  practice_note?: string;
  ai_transfer_prompt?: string;
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
