import type { QuoteRow } from "../types/orderbook";

export function calcAccumulative(
  quotes: { price: string; size: string }[],
  type: "buy" | "sell",
): QuoteRow[] {
  const ordered = type === "sell" ? [...quotes].reverse() : quotes;

  let cumulative = 0;
  const withTotal = ordered.map((q) => {
    cumulative += parseInt(q.size);
    return { ...q, total: cumulative };
  });

  const maxTotal = cumulative;

  const result = withTotal.map((q) => ({
    ...q,
    barPercent: maxTotal > 0 ? (q.total / maxTotal) * 100 : 0,
  }));

  return type === "sell" ? result.reverse() : result;
}
