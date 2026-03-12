import type { Card } from "@/domain/cards/cardTypes";
import { CategoryChip } from "./CategoryChip";

export function CardMeta({ card }: { card: Card }) {
  return (
    <div className="panel">
      <div style={{ marginBottom: 8 }}>
        <CategoryChip label={card.category} />
        <CategoryChip label={card.function} />
        <CategoryChip label={card.register} />
      </div>
      <p className="small">Pattern: {card.pattern}</p>
      <p className="small">Tags: {card.tags.join(", ")}</p>
    </div>
  );
}
