"use client";

import { useEffect, useState } from "react";
import { getLanguageSupportMode, setLanguageSupportMode, type LanguageSupportMode } from "@/domain/cards/cardSupport";

export function JapaneseSupportToggle() {
  const [mode, setMode] = useState<LanguageSupportMode>("english-first");

  useEffect(() => {
    setMode(getLanguageSupportMode());
  }, []);

  const toggleMode = () => {
    const nextMode: LanguageSupportMode = mode === "english-first" ? "english-only" : "english-first";
    setMode(nextMode);
    setLanguageSupportMode(nextMode);
  };

  return (
    <button className="button ghost" style={{ padding: "6px 10px", fontSize: 12 }} onClick={toggleMode}>
      {mode === "english-first" ? "EN-first" : "EN-only"}
    </button>
  );
}
