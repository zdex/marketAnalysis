export const formatPct  = (v, dp = 1) => `${(+v).toFixed(dp)}%`;
export const formatScore = (v)        => Math.round(v).toString();
export const formatDate  = (d)        => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
export const formatPrice = (v)        => (+v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
