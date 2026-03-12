"use client";

import { useCallback, useEffect, useState } from "react";
import type { Card } from "@/domain/cards/cardTypes";
import type { ProgressItem } from "@/domain/progress/progressTypes";
import { cardRepository, progressRepository } from "@/domain/services";

interface UseParlaDataResult {
  cards: Card[];
  progress: ProgressItem[];
  loading: boolean;
  refreshProgress: () => Promise<void>;
}

export function useParlaData(): UseParlaDataResult {
  const [cards, setCards] = useState<Card[]>([]);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshProgress = useCallback(async () => {
    setProgress(await progressRepository.getAllProgress());
  }, []);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const [cardData, progressData] = await Promise.all([
        cardRepository.getPublishedCards(),
        progressRepository.getAllProgress(),
      ]);
      setCards(cardData);
      setProgress(progressData);
      setLoading(false);
    })();
  }, []);

  return { cards, progress, loading, refreshProgress };
}
