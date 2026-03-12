"use client";

export function AudioButton({ url, label }: { url: string | null; label: string }) {
  if (!url) return null;
  return (
    <button
      type="button"
      className="button ghost"
      onClick={() => {
        const audio = new Audio(url);
        void audio.play();
      }}
    >
      🔊 {label}
    </button>
  );
}
