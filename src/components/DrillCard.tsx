"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Card } from "@/domain/cards/cardTypes";
import type { ProgressItem, Rating } from "@/domain/progress/progressTypes";
import type { PracticeSet } from "@/domain/practiceSets/practiceSetTypes";
import { getJapaneseHint } from "@/domain/cards/cardSupport";
import { computeNextReview } from "@/domain/review/reviewScheduler";
import { audioResolver, progressRepository } from "@/domain/services";
import { RevealPanel } from "./RevealPanel";
import { RatingButtons } from "./RatingButtons";

const SAME_SESSION_REQUEUE_GAP = 2;

function shouldInsertRequeue(cards: Card[], cardId: string, startIndex: number): boolean {
  return !cards.slice(startIndex, startIndex + SAME_SESSION_REQUEUE_GAP + 1).some((item) => item.id === cardId);
}

export function DrillCard({ cards, initialProgress, practiceSet }: { cards: Card[]; initialProgress: ProgressItem[]; practiceSet?: PracticeSet }) {
  const [sessionCards, setSessionCards] = useState(cards);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [ratedCount, setRatedCount] = useState(0);
  const [showClozeHint, setShowClozeHint] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [progressMap, setProgressMap] = useState(() => new Map(initialProgress.map((p) => [p.card_id, p])));
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  useEffect(() => {
    setSessionCards(cards);
    setIndex(0);
    setRevealed(false);
    setSessionComplete(false);
    setShowClozeHint(false);
    setShowHint(false);
    setRatedCount(0);
    setCopyStatus(null);
    setProgressMap(new Map(initialProgress.map((p) => [p.card_id, p])));
  }, [cards, initialProgress]);

  const copyConversationPrompt = async () => {
    if (!practiceSet) return;

    try {
      await navigator.clipboard.writeText(practiceSet.aiPrompt);
      setCopyStatus("Prompt copied.");
    } catch {
      setCopyStatus("Could not copy. Please try again.");
    }
  };

  const card = sessionCards[index];

  const queueLeft = useMemo(() => Math.max(sessionCards.length - index - 1, 0), [sessionCards.length, index]);

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

    let nextSessionCards = sessionCards;
    if (schedule.shouldRequeueInSession && shouldInsertRequeue(sessionCards, card.id, index + 1)) {
      const insertAt = Math.min(index + SAME_SESSION_REQUEUE_GAP + 1, sessionCards.length);
      nextSessionCards = [...sessionCards];
      nextSessionCards.splice(insertAt, 0, card);
      setSessionCards(nextSessionCards);
    }

    setRatedCount((prevCount) => prevCount + 1);
    setRevealed(false);
    setShowClozeHint(false);
    setShowHint(false);

    if (index + 1 >= nextSessionCards.length) {
      setSessionComplete(true);
      return;
    }

    setIndex((prevIndex) => prevIndex + 1);
  };

  if (!card) {
    return <div className="panel">No cards available.</div>;
  }

  if (sessionComplete) {
    return (
      <div className="panel">
        <h2 style={{ marginTop: 0 }}>{practiceSet ? `${practiceSet.title} complete` : "Session complete"}</h2>
        <p className="small">Rated {ratedCount} phrases.</p>
        <p className="small">Session cards: {sessionCards.length}</p>
        <div style={{ display: "grid", gap: 8 }}>
          {practiceSet ? (
            <>
              <p className="small" style={{ margin: 0 }}>
                You do not need to use every phrase. Start the conversation and use one when you need help.
              </p>
              <button className="button primary" onClick={() => void copyConversationPrompt()}>
                Copy conversation prompt
              </button>
              {copyStatus ? <p className="small" aria-live="polite" style={{ margin: 0 }}>{copyStatus}</p> : null}
              <Link href="/use-with-ai" className="button secondary">Use with AI</Link>
              <Link href="/practice-sets" className="button ghost">Practice another set</Link>
            </>
          ) : (
            <>
              <Link href="/use-with-ai" className="button primary">Use with AI</Link>
              <Link href="/drill?mode=hard&tag=ai" className="button secondary">Review weak AI phrases</Link>
            </>
          )}
          <button
            className="button ghost"
            onClick={() => {
              setIndex(0);
              setRatedCount(0);
              setRevealed(false);
              setShowClozeHint(false);
              setShowHint(false);
              setSessionComplete(false);
            }}
          >
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
              <button className="button ghost" onClick={() => {
                setRevealed(false);
                setShowClozeHint(false);
                setShowHint(false);
                if (index + 1 >= sessionCards.length) {
                  setSessionComplete(true);
                  return;
                }
                setIndex((prev) => prev + 1);
              }}>
                Skip
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
