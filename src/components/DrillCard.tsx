"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Card } from "@/domain/cards/cardTypes";
import type { ProgressItem, Rating } from "@/domain/progress/progressTypes";
import { getJapaneseHint } from "@/domain/cards/cardSupport";
import { computeNextReview } from "@/domain/review/reviewScheduler";
import { audioResolver, progressRepository } from "@/domain/services";
import { RevealPanel } from "./RevealPanel";
import { RatingButtons } from "./RatingButtons";

const SAME_SESSION_REQUEUE_GAP = 2;

function shouldInsertRequeue(cards: Card[], cardId: string, startIndex: number): boolean {
  return !cards.slice(startIndex, startIndex + SAME_SESSION_REQUEUE_GAP + 1).some((item) => item.id === cardId);
}

export function DrillCard({ cards, initialProgress }: { cards: Card[]; initialProgress: ProgressItem[] }) {
  const [sessionCards, setSessionCards] = useState(cards);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showClozeHint, setShowClozeHint] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [progressMap, setProgressMap] = useState(() => new Map(initialProgress.map((p) => [p.card_id, p])));

  useEffect(() => {
    setSessionCards(cards);
    setIndex(0);
    setRevealed(false);
    setSessionComplete(false);
    setShowClozeHint(false);
    setShowHint(false);
    setProgressMap(new Map(initialProgress.map((p) => [p.card_id, p])));
  }, [cards, initialProgress]);

  const card = sessionCards[index];

  const queueLeft = useMemo(() => Math.max(sessionCards.length - index - 1, 0), [sessionCards.length, index]);

  const nextCard = () => {
    if (index + 1 >= sessionCards.length) {
      setSessionComplete(true);
      setRevealed(false);
      setShowClozeHint(false);
      setShowHint(false);
      return;
    }
    setRevealed(false);
    setShowClozeHint(false);
    setShowHint(false);
    setIndex((prev) => prev + 1);
  };

  const rateCard = async (rating: Rating) => {
    if (!card) return;

    const prev = progressMap.get(card.id);
    const reviewCount = (prev?.review_count ?? 0) + 1;
    const schedule = computeNextReview(prev, rating, new Date());
    const updated: ProgressItem = {
      card_id: card.id,
      last_reviewed_at: new Date().toISOString(),
      rating,
      review_count: reviewCount,
      correct_streak: schedule.correctStreak,
      next_due_at: schedule.nextDueAt.toISOString(),
      favorite: prev?.favorite ?? false,
      want_to_use: prev?.want_to_use ?? false,
      confusing: prev?.confusing ?? false,
      hidden: prev?.hidden ?? false,
      interval_step: schedule.intervalStep,
      same_day_requeue_count: schedule.sameDayRequeueCount,
      last_interval_days: schedule.intervalDays,
    };

    await progressRepository.saveProgress(updated);

    const nextMap = new Map(progressMap);
    nextMap.set(card.id, updated);
    setProgressMap(nextMap);

    if (schedule.shouldRequeueInSession) {
      setSessionCards((prevCards) => {
        if (!shouldInsertRequeue(prevCards, card.id, index + 1)) {
          return prevCards;
        }
        const insertAt = Math.min(index + SAME_SESSION_REQUEUE_GAP + 1, prevCards.length);
        const nextCards = [...prevCards];
        nextCards.splice(insertAt, 0, card);
        return nextCards;
      });
    }

    nextCard();
  };

  if (!card) {
    return <div className="panel">No cards available.</div>;
  }

  if (sessionComplete) {
    return (
      <div className="panel">
        <h2 style={{ marginTop: 0 }}>Session complete</h2>
        <p className="small">Reviewed {sessionCards.length} cards in this drill.</p>
        <div style={{ display: "grid", gap: 8 }}>
          <Link href="/use-with-ai" className="button primary">Use with AI</Link>
          <Link href="/drill?mode=hard" className="button secondary">Review hard cards</Link>
          <button className="button ghost" onClick={() => { setIndex(0); setSessionComplete(false); }}>
            Start again
          </button>
        </div>
      </div>
    );
  }

  const japaneseHint = getJapaneseHint(card);

  return (
    <div className="grid">
      <div className="panel">
        <p className="small" style={{ marginTop: 0 }}>
          Card {index + 1}/{sessionCards.length} · left {queueLeft}
        </p>
        {card.family ? <p className="eyebrow" style={{ marginBottom: 6 }}>{card.family}</p> : null}
        <h2 style={{ marginBottom: 8 }}>{card.prompts.intent}</h2>
        <p className="small" style={{ marginBottom: card.prompts.cloze ? 8 : 12 }}>
          {card.prompts.situation}
        </p>
        {card.prompts.cloze ? (
          <div style={{ marginBottom: 10 }}>
            <button className="button ghost" onClick={() => setShowClozeHint((prev) => !prev)}>
              {showClozeHint ? "Hide cloze hint" : "Show cloze hint"}
            </button>
            {showClozeHint ? <p className="cloze-prompt">Optional cloze: {card.prompts.cloze}</p> : null}
          </div>
        ) : null}
        {japaneseHint ? (
          <div style={{ marginBottom: 10 }}>
            <button className="button ghost" onClick={() => setShowHint((prev) => !prev)}>
              {showHint ? "Hide hint" : "Hint"}
            </button>
            {showHint ? <p className="small" style={{ marginBottom: 0 }}>{japaneseHint}</p> : null}
          </div>
        ) : null}
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
