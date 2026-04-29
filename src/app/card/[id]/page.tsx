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
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const id = params.id;

  useEffect(() => {
    if (!id) return;
    void (async () => {
      const [cardData, progressData] = await Promise.all([cardRepository.getCardById(id), progressRepository.getProgress(id)]);
      setCard(cardData);
      setProgress(progressData);
    })();
  }, [id]);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Copied.");
    } catch {
      setCopyStatus("Could not copy. Please copy manually.");
    }
    window.setTimeout(() => setCopyStatus(null), 1600);
  };

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
        <p className="small" style={{ marginBottom: 6 }}>Pattern</p>
        <p style={{ fontWeight: 700, marginTop: 0 }}>{card.pattern}</p>
        <p className="small">{card.example}</p>
        <p className="small">{card.notes}</p>
        {card.quick_variations?.length ? (
          <div style={{ marginBottom: 12 }}>
            <p className="small" style={{ marginBottom: 6 }}>Quick variations</p>
            <div>
              {card.quick_variations.map((variation) => (
                <span key={variation} className="badge" style={{ marginBottom: 6 }}>
                  {variation}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        {card.practice_note ? <p className="small">Use this to say: {card.practice_note}</p> : null}
        <div className="panel" style={{ marginTop: 12, padding: 12 }}>
          <p className="small" style={{ margin: "0 0 6px" }}>Use this with AI</p>
          {card.ai_transfer_prompt ? <p className="small">{card.ai_transfer_prompt}</p> : null}
          <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{`I want to practice this English phrase:

"${card.phrase}"

Please ask me simple questions and help me use this phrase naturally.`}</pre>
          <button className="button secondary" onClick={() => void copyText(`I want to practice this English phrase:

"${card.phrase}"

Please ask me simple questions and help me use this phrase naturally.`)}>Copy mini prompt</button>
          {copyStatus ? <p className="small" aria-live="polite" style={{ marginBottom: 0 }}>{copyStatus}</p> : null}
        </div>

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
