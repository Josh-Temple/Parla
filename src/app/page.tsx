"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getConfusingCards, getHardCards, getWantToUseCards } from "@/domain/review/reviewSelectors";
import { useParlaData } from "@/hooks/useParlaData";

export default function HomePage() {
  const { cards, progress, loading } = useParlaData();

  const hard = useMemo(() => getHardCards(cards, progress), [cards, progress]);
  const confusing = useMemo(() => getConfusingCards(cards, progress), [cards, progress]);
  const wantToUse = useMemo(() => getWantToUseCards(cards, progress), [cards, progress]);
  const categories = useMemo(() => Array.from(new Set(cards.map((card) => card.category))), [cards]);

  return (
    <main>
      <div className="panel">
        <h1 style={{ marginTop: 0 }}>Parla</h1>
        <p className="small">see prompt → think silently → reveal → self-rate → next</p>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <Link href="/drill" className="button primary" style={{ textAlign: "center" }}>
            Start 3-minute drill
          </Link>
          <Link href="/review" className="button secondary" style={{ textAlign: "center" }}>
            Review due cards
          </Link>
        </div>
      </div>

      <div className="panel">
        <h3 style={{ marginTop: 0 }}>Continue where I left off</h3>
        <p className="small" style={{ marginBottom: 0 }}>
          {loading ? "Loading progress..." : `Reviewed cards: ${progress.length} / ${cards.length}`}
        </p>
      </div>

      <div className="panel">
        <h3 style={{ marginTop: 0 }}>Categories</h3>
        <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
          {categories.map((category) => (
            <Link key={category} href={`/browse?category=${encodeURIComponent(category)}`} className="button ghost" style={{ textAlign: "center" }}>
              {category}
            </Link>
          ))}
        </div>
      </div>

      <div className="panel">
        <h3 style={{ marginTop: 0 }}>Hard / confusing cards</h3>
        <p className="small">Hard: {hard.length} · Confusing: {confusing.length}</p>
      </div>

      <div className="panel">
        <h3 style={{ marginTop: 0 }}>Want to use</h3>
        <p className="small" style={{ marginBottom: 0 }}>
          {wantToUse.length} cards flagged
        </p>
      </div>
    </main>
  );
}
