"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getDueCards, getHardCards } from "@/domain/review/reviewSelectors";
import type { ProgressItem } from "@/domain/progress/progressTypes";
import { useParlaData } from "@/hooks/useParlaData";

const DAILY_GOAL = 10;
function isSameUtcDay(iso: string, now: Date): boolean { const d = new Date(iso); return d.getUTCFullYear()===now.getUTCFullYear()&&d.getUTCMonth()===now.getUTCMonth()&&d.getUTCDate()===now.getUTCDate(); }
function countReviewedToday(progress: ProgressItem[], now: Date): number { return progress.filter((i)=>i.last_reviewed_at&&isSameUtcDay(i.last_reviewed_at, now)).length; }

export default function HomePage() {
  const { cards, progress, loading } = useParlaData();
  const due = useMemo(() => getDueCards(cards, progress), [cards, progress]);
  const hard = useMemo(() => getHardCards(cards, progress), [cards, progress]);
  const reviewedToday = useMemo(() => countReviewedToday(progress, new Date()), [progress]);
  const aiCoreCount = cards.filter((c) => c.tags.includes("ai") && c.tags.includes("survival") && c.tags.includes("core")).length;
  return (<main>
    <section className="panel hero-panel">
      <div className="eyebrow">AI English Training</div>
      <h1 className="hero-title">Learn the English you need to ask AI.</h1>
      <p className="small">Practice the phrases for asking meanings, getting simpler explanations, correcting your English, and continuing conversation.</p>
      <div className="today-stats" aria-label="Today summary">
        <div><span className="today-stat-label">Today practiced</span><strong className="today-stat-value">{loading ? "..." : reviewedToday}</strong></div>
        <div><span className="today-stat-label">Needs review</span><strong className="today-stat-value">{loading ? "..." : due.length}</strong></div>
        <div><span className="today-stat-label">AI core phrases</span><strong className="today-stat-value">{loading ? "..." : aiCoreCount}</strong></div>
      </div>
      <div className="grid hero-actions" style={{ gridTemplateColumns: "1fr" }}>
        <Link href="/drill?mode=ai_survival" className="button primary" style={{ textAlign: "center" }}>Start AI survival drill</Link>
      </div>
      <section style={{ marginTop: 14 }}>
        <h2 style={{ margin: "0 0 8px" }}>Today&apos;s practice flow</h2>
        <p className="small" style={{ marginTop: 0 }}>Learn → Use with AI → Review</p>
        <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 8 }}>
          <div className="panel" style={{ padding: 10 }}>
            <p className="small" style={{ margin: "0 0 6px" }}><strong>Step 1: Learn phrases</strong></p>
            <Link href="/drill?mode=ai_survival" className="button primary" style={{ textAlign: "center", width: "100%" }}>Start AI survival drill</Link>
          </div>
          <div className="panel" style={{ padding: 10 }}>
            <p className="small" style={{ margin: "0 0 6px" }}><strong>Step 2: Use them with AI</strong></p>
            <Link href="/use-with-ai" className="button secondary" style={{ textAlign: "center", width: "100%" }}>Copy practice prompt</Link>
          </div>
          <div className="panel" style={{ padding: 10 }}>
            <p className="small" style={{ margin: "0 0 6px" }}><strong>Step 3: Review weak phrases</strong></p>
            <Link href="/drill?mode=hard" className="button ghost" style={{ textAlign: "center", width: "100%" }}>Review weak phrases</Link>
          </div>
        </div>
      </section>
      <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Link href="/drill?mode=ai_survival&category=Meaning%20Help" className="badge">Meaning help</Link>
        <Link href="/drill?mode=ai_survival&category=Simpler%20English" className="badge">Simpler English</Link>
        <Link href="/drill?mode=ai_survival&category=Corrections" className="badge">Corrections</Link>
        <Link href="/drill?mode=ai_survival&category=Voice%20Practice" className="badge">Voice practice</Link>
      </div>
    </section>
    <section className="progress-inline" aria-label="Progress summary">
      <span>Goal progress: {loading ? "..." : `${Math.min(reviewedToday, DAILY_GOAL)} / ${DAILY_GOAL}`}</span><span>Due now: {loading ? "..." : due.length}</span><span>Hard cards: {loading ? "..." : hard.length}</span>
    </section>
  </main>);
}
