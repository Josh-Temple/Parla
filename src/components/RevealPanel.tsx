import type { Card } from "@/domain/cards/cardTypes";
import { AudioButton } from "./AudioButton";

export function RevealPanel({
  card,
  phraseAudio,
  exampleAudio,
}: {
  card: Card;
  phraseAudio: string | null;
  exampleAudio: string | null;
}) {
  return (
    <div className="panel">
      <h2 style={{ marginTop: 0, marginBottom: 8 }}>{card.phrase}</h2>
      <p className="small" style={{ marginTop: 0, marginBottom: 6 }}>
        Pattern
      </p>
      <p style={{ fontWeight: 700, marginTop: 0 }}>{card.pattern}</p>
      <p>{card.example}</p>
      {card.practice_note ? <p className="small">Use this to say: {card.practice_note}</p> : null}
      {card.quick_variations?.length ? (
        <div style={{ marginBottom: 12 }}>
          <p className="small" style={{ marginBottom: 6 }}>
            Quick variations
          </p>
          <div>
            {card.quick_variations.map((variation) => (
              <span key={variation} className="badge" style={{ marginBottom: 6 }}>
                {variation}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      <p className="small">{card.notes}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <AudioButton label="Phrase" url={phraseAudio} />
        <AudioButton label="Example" url={exampleAudio} />
      </div>
    </div>
  );
}
