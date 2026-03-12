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
      <h2 style={{ marginTop: 0 }}>{card.phrase}</h2>
      <p>{card.example}</p>
      <p className="small">{card.notes}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <AudioButton label="Phrase" url={phraseAudio} />
        <AudioButton label="Example" url={exampleAudio} />
      </div>
    </div>
  );
}
