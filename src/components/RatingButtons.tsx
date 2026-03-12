"use client";

import type { Rating } from "@/domain/progress/progressTypes";

const options: { key: Rating; label: string; color: string }[] = [
  { key: "easy", label: "Easy", color: "var(--easy)" },
  { key: "close", label: "Close", color: "var(--close)" },
  { key: "hard", label: "Hard", color: "var(--hard)" },
];

export function RatingButtons({ onRate }: { onRate: (rating: Rating) => void }) {
  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          className="button"
          style={{ background: option.color, color: "white" }}
          onClick={() => onRate(option.key)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
