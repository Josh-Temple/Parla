"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { DrillCard } from "@/components/DrillCard";
import type { Card } from "@/domain/cards/cardTypes";
import { selectDrillCards, type DrillMode } from "@/domain/review/reviewSelectors";
import { useParlaData } from "@/hooks/useParlaData";
import { shuffle } from "@/lib/utils";

const validModes: DrillMode[] = ["all", "due", "hard", "confusing", "want_to_use"];

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
  const { cards, progress } = useParlaData();

  const drillCards = useMemo(() => {
    const selected = selectDrillCards(cards, progress, mode);
    return mode === "all" ? diversifyByCategory(selected) : selected;
  }, [cards, progress, mode]);

  return (
    <main>
      <div className="panel">
        <p className="small" style={{ margin: 0 }}>
          Mode: {mode}
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
