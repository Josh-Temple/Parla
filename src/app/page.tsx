"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getDueCards, getHardCards } from "@/domain/review/reviewSelectors";
import type { ProgressItem } from "@/domain/progress/progressTypes";
import { useParlaData } from "@/hooks/useParlaData";

const DAILY_GOAL = 10;

function isSameUtcDay(iso: string, now: Date): boolean {
  const date = new Date(iso);
  return (
    date.getUTCFullYear() === now.getUTCFullYear()
    && date.getUTCMonth() === now.getUTCMonth()
    && date.getUTCDate() === now.getUTCDate()
  );
}

function countReviewedToday(progress: ProgressItem[], now: Date): number {
  return progress.filter((item) => item.last_reviewed_at && isSameUtcDay(item.last_reviewed_at, now)).length;
}

export default function HomePage() {
  const { cards, progress, loading } = useParlaData();

  const due = useMemo(() => getDueCards(cards, progress), [cards, progress]);
  const hard = useMemo(() => getHardCards(cards, progress), [cards, progress]);
  const newCards = useMemo(() => {
    const started = new Set(progress.map((item) => item.card_id));
    return cards.filter((card) => !started.has(card.id));
  }, [cards, progress]);
  const reviewedToday = useMemo(() => countReviewedToday(progress, new Date()), [progress]);

  const dueCount = due.length;
  const newCount = newCards.length;
  const hardCount = hard.length;
  const showReviewDue = dueCount > 0;
  const showNewCount = !loading && newCount > 0;
  const showQuickAccess = !loading;
  const showHardCards = hardCount > 0;

  return (
    <main>
      <section className="panel hero-panel">
        <div className="eyebrow">Today</div>
        <h1 className="hero-title">Start your daily drill.</h1>
        <div className="today-stats" aria-label="Today summary">
          <div>
            <span className="today-stat-label">Goal</span>
            <strong className="today-stat-value">{loading ? "..." : DAILY_GOAL}</strong>
          </div>
          <div>
            <span className="today-stat-label">Due</span>
            <strong className="today-stat-value">{loading ? "..." : dueCount}</strong>
          </div>
          {showNewCount ? (
            <div>
              <span className="today-stat-label">New</span>
              <strong className="today-stat-value">{newCount}</strong>
            </div>
          ) : null}
        </div>
        <div className="grid hero-actions" style={{ gridTemplateColumns: showReviewDue ? "1fr 1fr" : "1fr" }}>
          <Link href="/drill" className="button primary" style={{ textAlign: "center" }}>
            Start drill
          </Link>
          {showReviewDue ? (
            <Link href="/drill?mode=due" className="button secondary" style={{ textAlign: "center" }}>
              Review due
            </Link>
          ) : null}
        </div>
      </section>

      <section className="progress-inline" aria-label="Progress summary">
        <span>Reviewed today: {loading ? "..." : reviewedToday}</span>
        <span>Due: {loading ? "..." : dueCount}</span>
        <span>Goal: {loading ? "..." : `${Math.min(reviewedToday, DAILY_GOAL)} / ${DAILY_GOAL}`}</span>
      </section>

      {showQuickAccess ? (
        <section className="panel quick-access-panel">
          <div className="section-heading-row">
            <h2 style={{ margin: 0 }}>Quick access</h2>
          </div>
          <div className="quick-access-list">
            <Link href="/browse" className="quick-link">
              <span>Browse cards</span>
              <span className="small">All cards</span>
            </Link>
            {showHardCards ? (
              <Link href="/drill?mode=hard" className="quick-link">
                <span>Hard cards</span>
                <span className="small">{hardCount} to revisit</span>
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}
    </main>
  );
}
