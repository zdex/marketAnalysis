
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