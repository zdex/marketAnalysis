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