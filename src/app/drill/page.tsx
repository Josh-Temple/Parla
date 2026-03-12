"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { DrillCard } from "@/components/DrillCard";
import { selectDrillCards, type DrillMode } from "@/domain/review/reviewSelectors";
import { useParlaData } from "@/hooks/useParlaData";

const validModes: DrillMode[] = ["all", "due", "hard", "confusing", "want_to_use"];

function parseMode(rawMode: string | null): DrillMode {
  if (!rawMode) return "all";
  return validModes.includes(rawMode as DrillMode) ? (rawMode as DrillMode) : "all";
}

export default function DrillPage() {
  const searchParams = useSearchParams();
  const mode = parseMode(searchParams.get("mode"));
  const { cards, progress } = useParlaData();

  const drillCards = useMemo(() => selectDrillCards(cards, progress, mode), [cards, progress, mode]);

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
