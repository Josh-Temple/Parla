"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getConfusingCards, getDueCards, getHardCards, getWantToUseCards, type DrillMode } from "@/domain/review/reviewSelectors";
import { useParlaData } from "@/hooks/useParlaData";

interface ReviewSection {
  title: string;
  cards: { id: string; phrase: string }[];
  mode: DrillMode;
}

export default function ReviewPage() {
  const { cards, progress } = useParlaData();

  const due = useMemo(() => getDueCards(cards, progress), [cards, progress]);
  const hard = useMemo(() => getHardCards(cards, progress), [cards, progress]);
  const confusing = useMemo(() => getConfusingCards(cards, progress), [cards, progress]);
  const wantToUse = useMemo(() => getWantToUseCards(cards, progress), [cards, progress]);

  const sections: ReviewSection[] = [
    { title: "Due cards", cards: due, mode: "due" },
    { title: "Hard cards", cards: hard, mode: "hard" },
    { title: "Confusing cards", cards: confusing, mode: "confusing" },
    { title: "Want to use", cards: wantToUse, mode: "want_to_use" },
  ];

  return (
    <main>
      {sections.map((section) => (
        <div className="panel" key={section.title}>
          <h2 style={{ marginTop: 0 }}>{section.title}</h2>
          <p className="small">{section.cards.length} cards</p>
          <div className="grid">
            {section.cards.slice(0, 5).map((card) => (
              <Link key={card.id} href={`/card/${card.id}`} className="button ghost" style={{ textAlign: "left" }}>
                {card.phrase}
              </Link>
            ))}
          </div>
          <Link href={`/drill?mode=${section.mode}`} className="button secondary" style={{ marginTop: 10, display: "inline-block" }}>
            Start focused drill
          </Link>
        </div>
      ))}
    </main>
  );
}
