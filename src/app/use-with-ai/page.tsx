"use client";

import Link from "next/link";
import { useState } from "react";

const prompts = [
  { title: "Beginner practice", text: `Please practice English with me.\n\nI am a beginner.\nPlease use simple English.\nAsk me one question at a time.\nIf I make a mistake, correct me at the end.\nPlease give me one better sentence I can practice.\nToday I want to practice asking questions in English.` },
  { title: "Meaning practice", text: `Please help me understand words and phrases.\nUse simple English and short examples.\nIf I ask "What does ___ mean?", explain clearly and give one easy sentence.` },
  { title: "Simpler English practice", text: `Please explain everything in simpler English.\nUse short sentences and common words.\nIf something is difficult, break it down step by step.` },
  { title: "Correction practice", text: `Please correct my English after I answer.\nCorrect only big mistakes first.\nThen show me one natural sentence I can repeat.` },
  { title: "Voice conversation practice", text: `Please speak slowly and clearly.\nAsk me one question at a time.\nIf I say "I didn't catch that," repeat more slowly.` },
  { title: "Topic conversation practice", text: `Let's practice one topic.\nUse easy questions first, then slightly harder ones.\nAt the end, summarize what I said and suggest 2 better phrases.` },
];

export default function UseWithAIPage() {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Copied.");
    } catch {
      setCopyStatus("Could not copy. Please copy manually.");
    }
    window.setTimeout(() => setCopyStatus(null), 1600);
  };

  return (
    <main>
      <section className="panel">
        <h1 style={{ marginTop: 0 }}>Use with AI</h1>
        <p className="small">Parla is for memorizing phrases. Then copy one prompt below and practice in ChatGPT, Gemini, Claude, or a voice AI app.</p>
        {copyStatus ? <p className="small" aria-live="polite" style={{ marginBottom: 0 }}>{copyStatus}</p> : null}
      </section>
      <section className="panel">
        <p className="small" style={{ marginTop: 0, marginBottom: 6 }}>Quick browse links</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <Link href="/browse?tag=ai" className="badge">Browse AI survival cards</Link>
          <Link href="/browse?category=Meaning%20Help" className="badge">Meaning help</Link>
          <Link href="/browse?category=Simpler%20English" className="badge">Simpler English</Link>
          <Link href="/browse?category=Corrections" className="badge">Corrections</Link>
          <Link href="/browse?category=Voice%20Practice" className="badge">Voice practice</Link>
        </div>
      </section>
      <div className="grid">
        {prompts.map((p) => (
          <section key={p.title} className="panel">
            <h2 style={{ marginTop: 0 }}>{p.title}</h2>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: "8px 0 12px" }}>{p.text}</pre>
            <button className="button primary" onClick={() => void copyText(p.text)}>Copy prompt</button>
          </section>
        ))}
      </div>
      <div className="panel"><Link href="/drill?mode=ai_survival" className="button secondary">Back to AI survival drill</Link></div>
    </main>
  );
}
