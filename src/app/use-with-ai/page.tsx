"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParlaData } from "@/hooks/useParlaData";
import { getLocalDayRange } from "@/lib/date";

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
  const { cards, progress, loading } = useParlaData();

  const practicedToday = useMemo(() => {
    const { start, end } = getLocalDayRange(new Date());
    const progressMap = new Map(progress.map((item) => [item.card_id, item]));
    return cards
      .filter((card) => card.tags.includes("ai") && card.tags.includes("survival") && card.tags.includes("core"))
      .filter((card) => {
        const last = progressMap.get(card.id)?.last_reviewed_at;
        if (!last) return false;
        const reviewedAt = new Date(last);
        return reviewedAt >= start && reviewedAt < end;
      })
      .sort((a, b) => {
        const aTime = new Date(progressMap.get(a.id)?.last_reviewed_at ?? 0).getTime();
        const bTime = new Date(progressMap.get(b.id)?.last_reviewed_at ?? 0).getTime();
        return bTime - aTime;
      })
      .slice(0, 10);
  }, [cards, progress]);

  const todayPrompt = useMemo(() => {
    const base = `Please practice English with me.\n\nI am a beginner.\nPlease use simple English.\nAsk me one question at a time.\nIf I make a mistake, correct me at the end.`;
    if (practicedToday.length === 0) return base;
    const list = practicedToday
      .slice(0, 5)
      .map((card, index) => `${index + 1}. \"${card.phrase}\"`)
      .join("\n");
    return `${base}\n\nToday I want to practice these phrases:\n${list}\n\nPlease create a short conversation where I can naturally use these phrases.`;
  }, [practicedToday]);

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
        <h2 style={{ marginTop: 0 }}>Today&apos;s AI practice prompt</h2>
        <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: "8px 0 12px" }}>{todayPrompt}</pre>
        <button className="button primary" onClick={() => void copyText(todayPrompt)}>Copy today&apos;s prompt</button>
      </section>
      <section className="panel">
        <h2 style={{ marginTop: 0 }}>Today practiced</h2>
        {loading ? (
          <p className="small" style={{ marginBottom: 0 }}>Loading today&apos;s practiced phrases...</p>
        ) : practicedToday.length === 0 ? (
          <>
            <p className="small">Practice a few AI survival phrases first, then come back and use them with AI.</p>
            <Link href="/drill?mode=ai_survival" className="button secondary">Start AI survival drill</Link>
          </>
        ) : (
          <div className="grid" style={{ gap: 8 }}>
            {practicedToday.map((card) => (
              <div key={card.id} className="panel" style={{ padding: 10 }}>
                <p style={{ margin: "0 0 4px" }}>{card.phrase}</p>
                <p className="small" style={{ margin: "0 0 6px" }}>{card.category}</p>
                <Link href={`/card/${card.id}`} className="small">View card detail</Link>
              </div>
            ))}
          </div>
        )}
      </section>
      <section className="panel">
        <p className="small" style={{ marginTop: 0, marginBottom: 6 }}>Practice packs</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <Link href="/drill?mode=ai_survival&category=Meaning%20Help" className="badge">Meaning help</Link>
          <Link href="/drill?mode=ai_survival&category=Simpler%20English" className="badge">Simpler English</Link>
          <Link href="/drill?mode=ai_survival&category=Corrections" className="badge">Corrections</Link>
          <Link href="/drill?mode=ai_survival&category=Voice%20Practice" className="badge">Voice practice</Link>
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
      <div className="panel"><Link href="/drill?mode=ai_survival" className="button secondary">Back to AI survival drill</Link></div>
    </main>
  );
}
