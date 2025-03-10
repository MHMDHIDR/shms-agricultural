/**
 * Utility function that returns the time in text
 * @param expiresIn - The time in seconds
 * @returns The time in text
 */
export function getRemainTimeString(expiresIn: number) {
  const oneHourInSeconds = 3600 * 1000
  const hours = Math.floor(expiresIn / oneHourInSeconds)

  switch (hours) {
    case 0:
      return `${expiresIn / 60} دقيقة`
    case 1:
      return `ساعة`
    case 2:
      return `ساعتين`
    default:
      return `${hours} ساعات`
  }
}
