"use client";

import Link from "next/link";
import { useState } from "react";
import { staticPracticeSets } from "@/domain/practiceSets/staticPracticeSets";

export default function PracticeSetsPage() {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Prompt copied.");
    } catch {
      setCopyStatus("Could not copy. Please copy manually.");
    }
    window.setTimeout(() => setCopyStatus(null), 1600);
  };

  return (
    <main>
      <section className="panel">
        <h1 style={{ marginTop: 0 }}>Practice Sets</h1>
        <p className="small" style={{ marginBottom: 0 }}>
          Practice by scenario with small, realistic card groups.
        </p>
        {copyStatus ? <p className="small" aria-live="polite" style={{ marginBottom: 0 }}>{copyStatus}</p> : null}
      </section>

      <div className="grid">
        {staticPracticeSets.map((set) => (
          <section key={set.id} className="panel">
            <h2 style={{ marginTop: 0 }}>{set.title}</h2>
            <p className="small" style={{ marginBottom: 8 }}><strong>Goal:</strong> {set.goal}</p>
            <p className="small">{set.description}</p>
            <p className="small" style={{ marginBottom: 12 }}>{set.cardIds.length} cards</p>
            <div style={{ display: "grid", gap: 8 }}>
              <Link className="button primary" href={`/drill?set=${set.id}`}>
                Start set drill
              </Link>
              <button className="button secondary" onClick={() => void copyText(set.aiPrompt)}>
                Copy AI prompt
              </button>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
