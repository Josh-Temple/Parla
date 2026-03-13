"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AudioButton } from "@/components/AudioButton";
import { CardMeta } from "@/components/CardMeta";
import { SimilarPhrases } from "@/components/SimilarPhrases";
import { getJapaneseHint } from "@/domain/cards/cardSupport";
import type { Card } from "@/domain/cards/cardTypes";
import type { ProgressItem } from "@/domain/progress/progressTypes";
import { audioResolver, cardRepository, progressRepository } from "@/domain/services";

export default function CardDetailPage() {
  const params = useParams<{ id: string }>();
  const [card, setCard] = useState<Card | null>(null);
  const [progress, setProgress] = useState<ProgressItem | null>(null);
  const [showHint, setShowHint] = useState(false);

  const id = params.id;

  useEffect(() => {
    if (!id) return;
    void (async () => {
      const [cardData, progressData] = await Promise.all([
        cardRepository.getCardById(id),
        progressRepository.getProgress(id),
      ]);
      setCard(cardData);
      setProgress(progressData);
    })();
  }, [id]);

  const refreshProgress = async () => {
    if (!id) return;
    setProgress(await progressRepository.getProgress(id));
  };

  const runAction = async (action: () => Promise<void>) => {
    await action();
    await refreshProgress();
  };

  if (!card) {
    return (
      <main>
        <div className="panel">Loading card...</div>
      </main>
    );
  }

  const japaneseHint = getJapaneseHint(card);

  return (
    <main>
      <div className="panel">
        <h1 style={{ marginTop: 0 }}>{card.phrase}</h1>
        {japaneseHint ? (
          <div style={{ marginBottom: 8 }}>
            <button className="button ghost" onClick={() => setShowHint((prev) => !prev)}>
              {showHint ? "Hide meaning" : "Check meaning"}
            </button>
            {showHint ? <p className="small">{japaneseHint}</p> : null}
          </div>
        ) : null}
        <p className="small">{card.example}</p>
        <p className="small">{card.notes}</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <AudioButton label="Phrase" url={audioResolver.getPhraseAudioUrl(card)} />
          <AudioButton label="Example" url={audioResolver.getExampleAudioUrl(card)} />
        </div>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <button className="button ghost" onClick={() => void runAction(() => progressRepository.toggleFavorite(card.id))}>
            {progress?.favorite ? "★ Favorited" : "☆ Favorite"}
          </button>
          <button className="button ghost" onClick={() => void runAction(() => progressRepository.toggleWantToUse(card.id))}>
            {progress?.want_to_use ? "✓ Want to use" : "Want to use"}
          </button>
          <button className="button ghost" onClick={() => void runAction(() => progressRepository.toggleConfusing(card.id))}>
            {progress?.confusing ? "⚠ Marked confusing" : "Mark confusing"}
          </button>
          <button className="button ghost" onClick={() => void runAction(() => progressRepository.hideCard(card.id))}>
            {progress?.hidden ? "Hidden" : "Hide card"}
          </button>
        </div>
      </div>
      <CardMeta card={card} />
      <SimilarPhrases similar={card.similar} contrast={card.contrast} />
    </main>
  );
}
