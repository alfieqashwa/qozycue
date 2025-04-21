export function getStockBackgroundColor(stock: number): string {
  return stock === 0
    ? "bg-rose-500/70 animate-pulse"
    : stock > 0 && stock <= 5
      ? "bg-amber-400/70 animate-pulse"
      : ""
}
