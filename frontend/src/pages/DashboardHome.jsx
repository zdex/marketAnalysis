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