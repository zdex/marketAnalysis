import { useState, useEffect } from "react";

const MOCK_DATA = {
  asOf: "Apr 20, 2026 · 16:00 EST",
  regime: { label: "Neutral — growth slowing", type: "neutral", confidence: 72 },
  metrics: [
    { label: "S&P 500", value: "5,218", change: "-0.84% today", dir: "down" },
    { label: "Nasdaq 100", value: "17,941", change: "-1.2% today", dir: "down" },
    { label: "10Y yield", value: "4.61%", change: "+8bps today", dir: "up" },
    { label: "VIX", value: "22.4", change: "elevated", dir: "flat" },
  ],
  sectors: [
    { rank: 1, name: "Energy", ticker: "XLE", score: 88, color: "#1D9E75" },
    { rank: 2, name: "Healthcare", ticker: "XLV", score: 79, color: "#5DCAA5" },
    { rank: 3, name: "Staples", ticker: "XLP", score: 74, color: "#85B7EB" },
    { rank: 4, name: "Financials", ticker: "XLF", score: 61, color: "#B4B2A9" },
    { rank: 9, name: "Technology", ticker: "XLK", score: 38, color: "#F09595" },
  ],
  macro: [
    { label: "Fed funds", value: "4.25%", change: "unchanged", dir: "flat" },
    { label: "2Y yield", value: "4.38%", change: "+5bps", dir: "down" },
    { label: "Yield curve", value: "+23bps", change: "steepening", dir: "up" },
    { label: "Core CPI", value: "3.1%", change: "-0.1 MoM", dir: "up" },
    { label: "DXY", value: "103.2", change: "+0.4%", dir: "down" },
    { label: "Oil (WTI)", value: "$78.40", change: "+1.2%", dir: "up" },
  ],
  agentNote: "Yield curve steepening with CPI cooling suggests early disinflation. Defensives and energy favored over rate-sensitive growth names.",
  signals: [
    { action: "buy", ticker: "XLE", name: "Energy — sector momentum strong", score: 84, conf: 81 },
    { action: "buy", ticker: "CVX", name: "Chevron — high FCF, macro fit", score: 81, conf: 77 },
    { action: "watch", ticker: "JNJ", name: "J&J — defensive, near breakout", score: 74, conf: 70 },
    { action: "watch", ticker: "MSFT", name: "Microsoft — strong but rate risk", score: 68, conf: 65 },
    { action: "reduce", ticker: "QQQ", name: "Nasdaq ETF — sector underweight", score: 38, conf: 74 },
  ],
  alerts: [
    { level: "danger", title: "Earnings risk: NVDA in 2 days", body: "Signal confidence reduced. Avoid sizing up before Apr 22." },
    { level: "warning", title: "Fed meeting: May 7", body: "17 days out. Yields pricing in no cut. Watch rate-sensitive sectors." },
    { level: "info", title: "Regime: neutral → risk-off watch", body: "Macro risk score crossed 60. One more weak payroll could shift regime." },
    { level: "info", title: "CPI release: Apr 30", body: "10 days out. Consensus: 3.0% YoY. Upside surprise would pressure growth." },
  ],
};

// ── Styles ─────────────────────────────────────────────────────────────────

const s = {
  page: { padding: "20px 0", fontFamily: "var(--font-sans)", color: "var(--color-text-primary)" },
  topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 },
  topLeft: { display: "flex", alignItems: "center", gap: 10 },
  pageTitle: { fontSize: 15, fontWeight: 500 },
  asOf: { fontSize: 12, color: "var(--color-text-tertiary)" },
  topRight: { display: "flex", alignItems: "center", gap: 8 },
  sectionLabel: { fontSize: 11, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--color-text-tertiary)", marginBottom: 8 },
  metricGrid: { display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 10, marginBottom: 20 },
  metricCard: { background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "12px 14px" },
  metricLabel: { fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 },
  metricVal: { fontSize: 22, fontWeight: 500, lineHeight: 1.1 },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 },
  card: { background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "14px 16px" },
  sectorRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" },
  macroGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 },
  macroItem: { padding: "8px 10px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)" },
  macroLbl: { fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 2 },
  macroVal: { fontSize: 14, fontWeight: 500 },
  agentBox: { padding: 10, background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)" },
  sigList: { display: "flex", flexDirection: "column", gap: 8 },
  sigCard: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", cursor: "pointer", transition: "opacity .15s", border: "none", width: "100%", textAlign: "left" },
  sigName: { flex: 1, fontSize: 12, color: "var(--color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  alertList: { display: "flex", flexDirection: "column", gap: 7 },
  footerBtns: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 },
};

// ── Sub-components ──────────────────────────────────────────────────────────

function RegimePill({ regime }) {
  const styles = {
    neutral: { background: "var(--color-background-warning)", color: "var(--color-text-warning)" },
    "risk-on": { background: "var(--color-background-success)", color: "var(--color-text-success)" },
    "risk-off": { background: "var(--color-background-danger)", color: "var(--color-text-danger)" },
  };
  const st = styles[regime.type] || styles.neutral;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500, ...st }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "currentColor", flexShrink: 0 }} />
      {regime.label}
    </span>
  );
}

function MetricCard({ label, value, change, dir }) {
  const chgColor = dir === "up" ? "var(--color-text-success)" : dir === "down" ? "var(--color-text-danger)" : "var(--color-text-secondary)";
  return (
    <div style={s.metricCard}>
      <div style={s.metricLabel}>{label}</div>
      <div style={s.metricVal}>{value}</div>
      <div style={{ fontSize: 11, marginTop: 3, color: chgColor }}>{change}</div>
    </div>
  );
}

function RankBadge({ rank }) {
  const style =
    rank === 1 ? { background: "#E1F5EE", color: "#085041" }
    : rank === 2 ? { background: "#EAF3DE", color: "#27500A" }
    : rank <= 4 ? { background: "#E6F1FB", color: "#0C447C" }
    : rank >= 8 ? { background: "#FCEBEB", color: "#791F1F" }
    : { background: "var(--color-background-secondary)", color: "var(--color-text-secondary)" };
  return (
    <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 10, fontWeight: 500, ...style }}>{rank}</span>
  );
}

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

function MacroItem({ item }) {
  const chgColor = item.dir === "up" ? "var(--color-text-success)" : item.dir === "down" ? "var(--color-text-danger)" : "var(--color-text-secondary)";
  return (
    <div style={s.macroItem}>
      <div style={s.macroLbl}>{item.label}</div>
      <div style={s.macroVal}>{item.value}</div>
      <div style={{ fontSize: 11, color: chgColor }}>{item.change}</div>
    </div>
  );
}

function ActionBadge({ action }) {
  const styles = {
    buy: { background: "#E1F5EE", color: "#085041" },
    watch: { background: "#E6F1FB", color: "#0C447C" },
    reduce: { background: "#FCEBEB", color: "#791F1F" },
  };
  return (
    <span style={{ padding: "3px 9px", borderRadius: 10, fontSize: 11, fontWeight: 500, whiteSpace: "nowrap", ...(styles[action] || {}) }}>
      {action}
    </span>
  );
}

function SignalCard({ sig, onSelect }) {
  const [hov, setHov] = useState(false);
  return (
    <button style={{ ...s.sigCard, opacity: hov ? 0.75 : 1 }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={() => onSelect(sig)}>
      <ActionBadge action={sig.action} />
      <span style={{ fontSize: 14, fontWeight: 500, minWidth: 44 }}>{sig.ticker}</span>
      <span style={s.sigName}>{sig.name}</span>
      <span style={{ fontSize: 13, fontWeight: 500, minWidth: 26, textAlign: "right" }}>{sig.score}</span>
      <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", minWidth: 32, textAlign: "right" }}>{sig.conf}%</span>
    </button>
  );
}

function AlertItem({ alert }) {
  const borderColor =
    alert.level === "danger" ? "var(--color-border-danger)"
    : alert.level === "warning" ? "var(--color-border-warning)"
    : "var(--color-border-info)";
  return (
    <div style={{ fontSize: 12, color: "var(--color-text-secondary)", padding: "8px 10px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", borderLeft: `2px solid ${borderColor}` }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 2 }}>{alert.title}</div>
      {alert.body}
    </div>
  );
}

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

// ── Data fetching hook (swap mock for real API) ─────────────────────────────

function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace this with:
    // const res = await fetch("/api/v1/dashboard/home");
    // const json = await res.json();
    const timer = setTimeout(() => {
      setData(MOCK_DATA);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const refetch = () => {
    setLoading(true);
    setTimeout(() => { setData(MOCK_DATA); setLoading(false); }, 400);
  };

  return { data, loading, error, refetch };
}

// ── Main component ──────────────────────────────────────────────────────────

export default function DashboardHome() {
  const { data, loading, refetch } = useDashboard();
  const [selectedSig, setSelectedSig] = useState(null);

  if (loading) {
    return (
      <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200, color: "var(--color-text-tertiary)", fontSize: 13 }}>
        Loading market data…
      </div>
    );
  }

  const { asOf, regime, metrics, sectors, macro, agentNote, signals, alerts } = data;

  return (
    <div style={s.page}>

      {/* Top bar */}
      <div style={s.topbar}>
        <div style={s.topLeft}>
          <span style={s.pageTitle}>Market overview</span>
          <span style={s.asOf}>As of {asOf}</span>
        </div>
        <div style={s.topRight}>
          <RegimePill regime={regime} />
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{regime.confidence}% confidence</span>
          <button onClick={refetch} style={{ fontSize: 12, padding: "4px 10px" }}>Refresh</button>
        </div>
      </div>

      {/* Signal drilldown (shown on click) */}
      {selectedSig && <SignalModal sig={selectedSig} onClose={() => setSelectedSig(null)} />}

      {/* Market pulse */}
      <p style={s.sectionLabel}>Market pulse</p>
      <div style={s.metricGrid}>
        {metrics.map(m => <MetricCard key={m.label} {...m} />)}
      </div>

      {/* Sectors + Macro */}
      <div style={s.twoCol}>
        <div style={s.card}>
          <p style={{ ...s.sectionLabel, marginBottom: 10 }}>Sector rankings</p>
          {sectors.map((sec, i) => <SectorRow key={sec.ticker} sector={sec} last={i === sectors.length - 1} />)}
        </div>

        <div style={s.card}>
          <p style={{ ...s.sectionLabel, marginBottom: 10 }}>Macro snapshot</p>
          <div style={s.macroGrid}>
            {macro.map(m => <MacroItem key={m.label} item={m} />)}
          </div>
          <div style={s.agentBox}>
            <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 4 }}>Agent note · today</div>
            <div style={{ fontSize: 12, lineHeight: 1.6 }}>{agentNote}</div>
          </div>
        </div>
      </div>

      {/* Signals + Alerts */}
      <div style={s.twoCol}>
        <div style={s.card}>
          <p style={{ ...s.sectionLabel, marginBottom: 10 }}>Top signals today</p>
          <div style={s.sigList}>
            {signals.map(sig => (
              <SignalCard key={sig.ticker} sig={sig} onSelect={setSelectedSig} />
            ))}
          </div>
        </div>

        <div style={s.card}>
          <p style={{ ...s.sectionLabel, marginBottom: 10 }}>Alerts</p>
          <div style={s.alertList}>
            {alerts.map((a, i) => <AlertItem key={i} alert={a} />)}
          </div>
        </div>
      </div>

      {/* Footer nav */}
      <div style={s.footerBtns}>
        {[["Sector rankings →", "/sectors"], ["Stock detail →", "/stocks/XLE"], ["Watchlist →", "/watchlist"], ["Portfolio →", "/portfolio"], ["Reports →", "/reports"]].map(([label, path]) => (
          <button key={label} style={{ fontSize: 12 }} onClick={() => alert(`Navigate to ${path}`)}>{label}</button>
        ))}
      </div>

    </div>
  );
}
