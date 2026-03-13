"use client";

import { useCallback, useEffect, useState } from "react";
import type { Card } from "@/domain/cards/cardTypes";
import type { ProgressItem } from "@/domain/progress/progressTypes";
import { cardRepository, progressRepository } from "@/domain/services";

type LoadState = "idle" | "loading" | "ready" | "error";

interface UseParlaDataResult {
  cards: Card[];
  progress: ProgressItem[];
  loading: boolean;
  loadState: LoadState;
  refreshProgress: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

export function useParlaData(): UseParlaDataResult {
  const [cards, setCards] = useState<Card[]>([]);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");

  const refreshProgress = useCallback(async (): Promise<void> => {
    const nextProgress: ProgressItem[] = await progressRepository.getAllProgress();
    setProgress(nextProgress);
  }, []);

  const refreshAll = useCallback(async (): Promise<void> => {
    setLoadState("loading");
    try {
      const [cardData, progressData]: [Card[], ProgressItem[]] = await Promise.all([
        cardRepository.getPublishedCards(),
        progressRepository.getAllProgress(),
      ]);
      setCards(cardData);
      setProgress(progressData);
      setLoadState("ready");
    } catch (error) {
      console.error("Failed to load Parla data", error);
      setCards([]);
      setProgress([]);
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  return { cards, progress, loading: loadState === "loading" || loadState === "idle", loadState, refreshProgress, refreshAll };
}
