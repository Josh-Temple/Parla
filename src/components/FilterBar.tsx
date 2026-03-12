"use client";

import type { CardCategory, CardFunction, CardRegister } from "@/domain/cards/cardTypes";

export interface BrowseFilters {
  category?: CardCategory;
  function?: CardFunction;
  register?: CardRegister;
  tag?: string;
}

export function FilterBar({
  filters,
  categories,
  functions,
  registers,
  tags,
  onChange,
}: {
  filters: BrowseFilters;
  categories: string[];
  functions: string[];
  registers: string[];
  tags: string[];
  onChange: (next: BrowseFilters) => void;
}) {
  const renderSelect = (label: string, value: string | undefined, options: string[], key: keyof BrowseFilters) => (
    <label style={{ display: "grid", gap: 4 }}>
      <span className="small">{label}</span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange({ ...filters, [key]: e.target.value || undefined })}
        style={{ padding: 10, borderRadius: 10, border: "1px solid var(--border)" }}
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="panel grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
      {renderSelect("Category", filters.category, categories, "category")}
      {renderSelect("Function", filters.function, functions, "function")}
      {renderSelect("Register", filters.register, registers, "register")}
      {renderSelect("Tag", filters.tag, tags, "tag")}
    </div>
  );
}
