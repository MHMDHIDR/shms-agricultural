export function calculateNewAvailableStocks(
  currentTotal: number,
  newTotal: number,
  currentAvailable: number,
): number {
  const difference = newTotal - currentTotal
  return currentAvailable + difference
}
