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