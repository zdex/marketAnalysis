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