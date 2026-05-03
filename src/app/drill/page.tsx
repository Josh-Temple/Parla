"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { DrillCard } from "@/components/DrillCard";
import type { Card } from "@/domain/cards/cardTypes";
import { prioritizeDailyCards, selectDrillCards, type DrillMode } from "@/domain/review/reviewSelectors";
import { useParlaData } from "@/hooks/useParlaData";
import { shuffle } from "@/lib/utils";

const validModes: DrillMode[] = ["all", "due", "hard", "confusing", "want_to_use", "ai_survival"];

function parseMode(rawMode: string | null): DrillMode {
  if (!rawMode) return "all";
  return validModes.includes(rawMode as DrillMode) ? (rawMode as DrillMode) : "all";
}

function diversifyByCategory(cards: Card[]): Card[] {
  const buckets = new Map<string, Card[]>();
  cards.forEach((card) => {
    const current = buckets.get(card.category) ?? [];
    current.push(card);
    buckets.set(card.category, current);
  });

  const keys = shuffle(Array.from(buckets.keys()));
  keys.forEach((key) => {
    const current = buckets.get(key) ?? [];
    buckets.set(key, shuffle(current));
  });

  const mixed: Card[] = [];
  let remaining = true;
  while (remaining) {
    remaining = false;
    keys.forEach((key) => {
      const current = buckets.get(key);
      if (current?.length) {
        mixed.push(current.shift() as Card);
        remaining = true;
      }
    });
  }

  return mixed;
}

function DrillPageContent() {
  const searchParams = useSearchParams();
  const mode = parseMode(searchParams.get("mode"));
  const categoryFilter = searchParams.get("category");
  const tagFilter = searchParams.get("tag");
  const { cards, progress, loading, loadState } = useParlaData();

  const drillCards = useMemo(() => {
    if (mode === "all") {
      const progressMap = new Map(progress.map((entry) => [entry.card_id, entry]));
      const now = new Date();
      const prioritized = prioritizeDailyCards(cards, progress, now);
      const dueCount = prioritized.filter((card) => {
        const item = progressMap.get(card.id);
        return !item || new Date(item.next_due_at) <= now;
      }).length;
      return [...diversifyByCategory(prioritized.slice(0, dueCount)), ...diversifyByCategory(prioritized.slice(dueCount))];
    }

    let scopedCards = cards;

    // Tag filters scope normal review modes (for example, /drill?mode=hard&tag=ai).
    if (tagFilter) {
      scopedCards = scopedCards.filter((card) => card.tags.includes(tagFilter));
    }

    if (mode === "ai_survival" && categoryFilter) {
      scopedCards = scopedCards.filter((card) => card.category === categoryFilter);
    }

    return selectDrillCards(scopedCards, progress, mode);
  }, [cards, progress, mode, categoryFilter, tagFilter]);

  if (loading) {
    return (
      <main>
        <div className="panel">
          <p className="small" style={{ margin: 0 }}>
            Loading cards...
          </p>
        </div>
      </main>
    );
  }

  if (loadState === "error") {
    return (
      <main>
        <div className="panel">
          <p className="small" style={{ marginTop: 0 }}>
            Failed to load cards. Please refresh and try again.
          </p>
          <Link href="/" className="button ghost">Back to home</Link>
        </div>
      </main>
    );
  }

  if (drillCards.length === 0) {
    const modeLabel = mode.replaceAll("_", " ");
    return (
      <main>
        <div className="panel">
          <p className="small" style={{ marginTop: 0 }}>
            No cards match <strong>{modeLabel}</strong> right now.
          </p>
          <p className="small">
            You can still study from all published cards.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/drill?mode=all" className="button primary">Start all-cards drill</Link>
            <Link href="/review" className="button ghost">Go to review</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="panel">
        <p className="small" style={{ margin: 0 }}>
          Mode: {mode}{categoryFilter ? ` · ${categoryFilter}` : ""}{tagFilter ? ` · #${tagFilter}` : ""}
        </p>
      </div>
      <DrillCard cards={drillCards} initialProgress={progress} />
    </main>
  );
}

export default function DrillPage() {
  return (
    <Suspense fallback={<main><p className="small">Loading drill...</p></main>}>
      <DrillPageContent />
    </Suspense>
  );
}
