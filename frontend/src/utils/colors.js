export function scoreToColor(score) {
  if (score >= 75) return "#1D9E75";
  if (score >= 55) return "#85B7EB";
  if (score >= 40) return "#B4B2A9";
  return "#F09595";
}
export function regimeToColor(type) {
  return { "risk-on": "success", neutral: "warning", "risk-off": "danger" }[type] ?? "warning";
}
