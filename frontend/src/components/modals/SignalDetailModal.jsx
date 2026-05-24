function SignalModal({ sig, onClose }) {
  if (!sig) return null;
  return (
    <div style={{ position: "relative", background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-lg)", padding: 16, marginBottom: 14 }}>
      <button onClick={onClose} style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "var(--color-text-secondary)" }}>✕</button>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <ActionBadge action={sig.action} />
        <span style={{ fontSize: 16, fontWeight: 500 }}>{sig.ticker}</span>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{sig.name}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 12 }}>
        {[["Composite score", sig.score], ["Confidence", `${sig.conf}%`], ["Momentum", "82"], ["Risk penalty", "−8"]].map(([l, v]) => (
          <div key={l} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 3 }}>{l}</div>
            <div style={{ fontSize: 18, fontWeight: 500 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
        <div style={{ fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 4 }}>Signal drivers</div>
        <ul style={{ paddingLeft: 16, margin: 0 }}>
          <li>Strong sector momentum — energy ranked #1 of 11 sectors</li>
          <li>Positive relative strength vs SPY (+4.2% 20d)</li>
          <li>Macro fit: oil price tailwind, risk-neutral regime supports</li>
        </ul>
        <div style={{ fontWeight: 500, color: "var(--color-text-primary)", margin: "8px 0 4px" }}>Risks</div>
        <ul style={{ paddingLeft: 16, margin: 0 }}>
          <li>Volatility elevated — ATR above 30d average</li>
          <li>Geopolitical event risk on oil supply</li>
        </ul>
      </div>
    </div>
  );
}