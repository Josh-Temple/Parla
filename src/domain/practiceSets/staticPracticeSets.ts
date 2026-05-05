import type { PracticeSet } from "./practiceSetTypes";

export const staticPracticeSets: PracticeSet[] = [
  {
    id: "meaning_rescue",
    title: "Meaning Rescue",
    goal: "Ask AI about unknown words and phrases.",
    description: "Practice quick meaning checks so unknown words do not stop your conversation.",
    cardIds: ["ai_001", "ai_002", "ai_003", "ai_004", "ai_005", "ai_006"],
    aiPrompt: `Please practice English with me.

I am a beginner.
Please use simple English.
Today I want to practice asking about unknown words and phrases.

Please give me short English sentences with one useful word or phrase.
I will ask you questions like:
- What does this word mean?
- Can you explain it in simple English?
- Can you give me an example?

Please correct only my biggest mistakes at the end.`,
  },
  {
    id: "simpler_please",
    title: "Simpler Please",
    goal: "Make AI easier to understand.",
    description: "Train phrases that help AI simplify explanations and keep language beginner-friendly.",
    cardIds: ["ai_031", "ai_032", "ai_033", "ai_034", "ai_035", "ai_038"],
    aiPrompt: `Please practice English with me.

I am a beginner.
Please explain everything in simple English.
Today I want to practice asking you to make your English easier.

Use short sentences and common words.
If something is difficult, break it down step by step.
Correct only my biggest mistakes at the end.`,
  },
  {
    id: "fix_my_english",
    title: "Fix My English",
    goal: "Ask AI to correct your English with low interruption.",
    description: "Practice correction-control phrases so you can keep talking while still improving.",
    cardIds: ["ai_046", "ai_047", "ai_053", "ai_049", "ai_050", "ai_052"],
    aiPrompt: `Please practice English with me.

I want to keep the conversation natural.
Today I want to practice asking for corrections without stopping too much.

Please correct only big mistakes.
Please correct me at the end.
Please explain one important mistake and give me one better sentence to practice.`,
  },
  {
    id: "voice_survival",
    title: "Voice Survival",
    goal: "Survive an AI voice conversation.",
    description: "Use core listening-repair phrases to keep voice conversation understandable.",
    cardIds: ["ai_061", "ai_062", "ai_063", "core_026", "ai_069", "ai_064"],
    aiPrompt: `Please do a short voice-style English conversation with me.

I am a beginner.
Please speak slowly and clearly.
Ask me one question at a time.

If I ask you to repeat, please repeat more slowly.
If I do not understand, please ask an easier question.
Correct only my biggest mistakes at the end.`,
  },
  {
    id: "keep_going",
    title: "Keep Going",
    goal: "Continue a conversation when you get stuck.",
    description: "Build recovery phrases so you can pause, retry, and continue instead of stopping.",
    cardIds: ["ai_076", "ai_077", "ai_078", "ai_079", "ai_083", "ai_084"],
    aiPrompt: `Please practice English conversation with me.

I am a beginner, and sometimes I get stuck.
Today I want to practice recovery phrases to keep going.

Please ask simple questions.
If I get stuck, give me a small hint and help me continue.
At the end, correct only my biggest mistakes.`,
  },
];

export function getPracticeSetById(id: string): PracticeSet | undefined {
  return staticPracticeSets.find((set) => set.id === id);
}
