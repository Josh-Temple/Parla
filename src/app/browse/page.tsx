"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { FilterBar, type BrowseFilters } from "@/components/FilterBar";
import { useParlaData } from "@/hooks/useParlaData";
import { unique } from "@/lib/utils";

function BrowsePageContent() {
  const search = useSearchParams();
  const { cards } = useParlaData();

  const [filters, setFilters] = useState<BrowseFilters>({
    category: (search.get("category") as BrowseFilters["category"]) || undefined,
    tag: search.get("tag") || undefined,
  });

  const options = useMemo(
    () => ({
      categories: unique(cards.map((card) => card.category)),
      functions: unique(cards.map((card) => card.function)),
      registers: unique(cards.map((card) => card.register)),
      tags: unique(cards.flatMap((card) => card.tags)).sort(),
    }),
    [cards],
  );

  const filtered = useMemo(
    () =>
      cards.filter((card) => {
        if (filters.category && card.category !== filters.category) return false;
        if (filters.function && card.function !== filters.function) return false;
        if (filters.register && card.register !== filters.register) return false;
        if (filters.tag && !card.tags.includes(filters.tag)) return false;
        return true;
      }),
    [cards, filters],
  );

  return (
    <main>
      <FilterBar
        filters={filters}
        categories={options.categories}
        functions={options.functions}
        registers={options.registers}
        tags={options.tags}
        onChange={setFilters}
      />
      <div className="panel">
        <p className="small" style={{ margin: 0 }}>
          {filtered.length} cards · core filter works via the <strong>core</strong> tag.
        </p>
      </div>
      <div className="grid">
        {filtered.map((card) => (
          <Link key={card.id} href={`/card/${card.id}`} className="panel">
            <p className="small" style={{ marginTop: 0 }}>
              {card.category} · {card.function} · {card.register}
            </p>
            {card.family ? (
              <p className="small" style={{ margin: "0 0 6px" }}>
                Family: {card.family}
              </p>
            ) : null}
            <h3 style={{ margin: "6px 0" }}>{card.phrase}</h3>
            <p className="small" style={{ margin: "0 0 6px" }}>
              Pattern: {card.pattern}
            </p>
            {card.quick_variations?.length ? (
              <p className="small" style={{ margin: "0 0 6px" }}>
                Variations: {card.quick_variations.slice(0, 2).join(" · ")}
              </p>
            ) : null}
            <p className="small" style={{ marginBottom: 0 }}>
              {card.prompts.intent} · {card.prompts.situation}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}

export default function BrowsePage() {
  return <Suspense fallback={<main><p className="small">Loading filters...</p></main>}><BrowsePageContent /></Suspense>;
}
