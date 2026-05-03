"use client";

import Link from "next/link";
import { useMemo } from "react";
import { isSameLocalDay } from "@/lib/date";
import { getDueCards, getHardCards } from "@/domain/review/reviewSelectors";
import { useParlaData } from "@/hooks/useParlaData";

const DAILY_GOAL = 10;

export default function HomePage() {
  const { cards, progress, loading } = useParlaData();
  const aiSurvivalCards = useMemo(
    () => cards.filter((c) => c.tags.includes("ai") && c.tags.includes("survival") && c.tags.includes("core")),
    [cards],
  );
  const dueAiCards = useMemo(() => getDueCards(aiSurvivalCards, progress), [aiSurvivalCards, progress]);
  const hardAiCards = useMemo(() => getHardCards(aiSurvivalCards, progress), [aiSurvivalCards, progress]);
  const reviewedTodayAi = useMemo(() => {
    const now = new Date();
    const aiIds = new Set(aiSurvivalCards.map((card) => card.id));
    return progress.filter((item) => item.last_reviewed_at && aiIds.has(item.card_id) && isSameLocalDay(item.last_reviewed_at, now)).length;
  }, [aiSurvivalCards, progress]);

  return (<main>
    <section className="panel hero-panel">
      <div className="eyebrow">AI English Training</div>
      <h1 className="hero-title">Learn the English you need to ask AI.</h1>
      <p className="small">Practice the phrases for asking meanings, getting simpler explanations, correcting your English, and continuing conversation.</p>

      <div className="today-stats" aria-label="Today summary">
        <div><span className="today-stat-label">Today practiced</span><strong className="today-stat-value">{loading ? "..." : reviewedTodayAi}</strong></div>
        <div><span className="today-stat-label">Available now</span><strong className="today-stat-value">{loading ? "..." : dueAiCards.length}</strong></div>
        <div><span className="today-stat-label">Weak AI phrases</span><strong className="today-stat-value">{loading ? "..." : hardAiCards.length}</strong></div>
      </div>

      <section className="home-section">
        <h2 className="section-title">Today&apos;s practice flow</h2>
        <p className="small section-caption">Learn → Use with AI → Review</p>
        <div className="flow-list">
          <div className="flow-item">
            <p className="flow-label">Step 1 · Learn phrases</p>
            <Link href="/drill?mode=ai_survival" className="button primary flow-action">Start AI survival drill</Link>
          </div>
          <div className="flow-item">
            <p className="flow-label">Step 2 · Use them with AI</p>
            <Link href="/use-with-ai" className="button secondary flow-action">Copy practice prompt</Link>
          </div>
          <div className="flow-item">
            <p className="flow-label">Step 3 · Review weak phrases</p>
            <Link href="/drill?mode=hard&tag=ai" className="button ghost flow-action">Review weak AI phrases</Link>
          </div>
        </div>
      </section>

      <section className="home-section">
        <h2 className="section-title">Practice packs</h2>
        <div className="pack-list">
          <Link href="/drill?mode=ai_survival&category=Meaning%20Help" className="badge">Meaning help</Link>
          <Link href="/drill?mode=ai_survival&category=Simpler%20English" className="badge">Simpler English</Link>
          <Link href="/drill?mode=ai_survival&category=Corrections" className="badge">Corrections</Link>
          <Link href="/drill?mode=ai_survival&category=Voice%20Practice" className="badge">Voice practice</Link>
        </div>
      </section>
    </section>

    <section className="progress-inline" aria-label="Progress summary">
      <span>Goal progress: {loading ? "..." : `${Math.min(reviewedTodayAi, DAILY_GOAL)} / ${DAILY_GOAL}`}</span>
      <span>Due AI phrases: {loading ? "..." : dueAiCards.length}</span>
      <span>Weak AI phrases: {loading ? "..." : hardAiCards.length}</span>
    </section>
  </main>);
}
