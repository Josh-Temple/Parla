"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Card } from "@/domain/cards/cardTypes";
import type { ProgressItem, Rating } from "@/domain/progress/progressTypes";
import { computeNextDueDate } from "@/domain/review/reviewScheduler";
import { audioResolver, progressRepository } from "@/domain/services";
import { RevealPanel } from "./RevealPanel";
import { RatingButtons } from "./RatingButtons";

export function DrillCard({ cards, initialProgress }: { cards: Card[]; initialProgress: ProgressItem[] }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [progressMap, setProgressMap] = useState(() => new Map(initialProgress.map((p) => [p.card_id, p])));

  const card = cards[index];

  const queueLeft = useMemo(() => cards.length - index - 1, [cards.length, index]);

  const nextCard = () => {
    setRevealed(false);
    setIndex((prev) => (prev + 1 >= cards.length ? 0 : prev + 1));
  };

  const rateCard = async (rating: Rating) => {
    const prev = progressMap.get(card.id);
    const reviewCount = (prev?.review_count ?? 0) + 1;
    const streak = rating === "hard" ? 0 : (prev?.correct_streak ?? 0) + 1;
    const updated: ProgressItem = {
      card_id: card.id,
      last_reviewed_at: new Date().toISOString(),
      rating,
      review_count: reviewCount,
      correct_streak: streak,
      next_due_at: computeNextDueDate(rating, new Date()).toISOString(),
      favorite: prev?.favorite ?? false,
      want_to_use: prev?.want_to_use ?? false,
      confusing: prev?.confusing ?? false,
      hidden: prev?.hidden ?? false,
    };
    await progressRepository.saveProgress(updated);
    const nextMap = new Map(progressMap);
    nextMap.set(card.id, updated);
    setProgressMap(nextMap);
    nextCard();
  };

  if (!card) {
    return <div className="panel">No cards available.</div>;
  }

  return (
    <div className="grid">
      <div className="panel">
        <p className="small" style={{ marginTop: 0 }}>
          Card {index + 1}/{cards.length} · left {queueLeft}
        </p>
        <h2 style={{ marginBottom: 8 }}>{card.prompts.meaning}</h2>
        <p className="small">{card.prompts.scenario}</p>
        {!revealed ? (
          <button className="button primary" style={{ width: "100%" }} onClick={() => setRevealed(true)}>
            Reveal Answer
          </button>
        ) : (
          <>
            <RevealPanel
              card={card}
              phraseAudio={audioResolver.getPhraseAudioUrl(card)}
              exampleAudio={audioResolver.getExampleAudioUrl(card)}
            />
            <RatingButtons onRate={rateCard} />
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <Link className="button ghost" href={`/card/${card.id}`}>
                Detail
              </Link>
              <button className="button ghost" onClick={nextCard}>
                Skip
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
