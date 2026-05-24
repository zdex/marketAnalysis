function SectorRow({ sector, last }) {
  return (
    <div style={{ ...s.sectorRow, borderBottom: last ? "none" : "0.5px solid var(--color-border-tertiary)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <RankBadge rank={sector.rank} />
        <span style={{ fontSize: 13 }}>{sector.name} <span style={{ color: "var(--color-text-tertiary)", fontSize: 11 }}>({sector.ticker})</span></span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 60, height: 5, background: "var(--color-border-tertiary)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${sector.score}%`, height: "100%", borderRadius: 3, background: sector.color }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 500, minWidth: 24, textAlign: "right", color: sector.color }}>{sector.score}</span>
      </div>
    </div>
  );
}