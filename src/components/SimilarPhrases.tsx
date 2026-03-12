export function SimilarPhrases({ similar, contrast }: { similar: string[]; contrast: string }) {
  return (
    <div className="panel">
      <h3 style={{ marginTop: 0 }}>Similar & Contrast</h3>
      <div style={{ marginBottom: 8 }}>
        {similar.map((text) => (
          <span key={text} className="badge">
            {text}
          </span>
        ))}
      </div>
      <p className="small" style={{ marginBottom: 0 }}>
        {contrast}
      </p>
    </div>
  );
}
