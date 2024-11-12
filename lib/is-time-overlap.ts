//? Source -> https://chatgpt.com/c/66e55998-b4c0-8002-a95a-b416ae2e01b0
export function isTimeOverlap(
  gapDuration: number,
  newStartTime: number,
  newEndTime: number,
  existingBookings: { timeStart: number | null; timeEnd: number | null }[],
): boolean {
  // Gap duration in milliseconds (10 minutes = 600,00 ms)
  const gapDurationInMilliseconds = gapDuration * 60 * 1000

  // Sort bookings by start time to ensure we are always checking them in chronological order
  const sortedBookings = existingBookings
    .filter((booking) => booking.timeStart && booking.timeEnd)
    .sort((a, b) => a.timeStart! - b.timeStart!)

  return sortedBookings.some((booking) => {
    if (!booking.timeStart || !booking.timeEnd) return false

    const existingStartTime = booking.timeStart
    const existingEndTime = booking.timeEnd

    // Add buffer to both start and end times of existing bookings
    const bufferedEndTime = existingEndTime + gapDurationInMilliseconds
    const bufferedStartTime = existingStartTime - gapDurationInMilliseconds

    // Check for overlap or violation of the 10-minute gap on both sides
    return (
      (newStartTime >= bufferedStartTime && newStartTime < bufferedEndTime) || // Overlap or less than gap at the start
      (newEndTime > bufferedStartTime && newEndTime <= bufferedEndTime) || // Overlap or less than gap at the end
      (newStartTime <= bufferedStartTime && newEndTime >= bufferedEndTime) // Encloses an existing booking
    )
  })
}

/*
*    Explanation: (20 Sept 2024)
  ?  Buffer Calculation: The constant TEN_MINUTES_MS is set to 10 minutes in milliseconds (10 * 60 * 1000).
  ?  We use this to add 10 minutes to the existing bookings' end times.
  ?  Adjusted End Time: We create a new variable adjustedExistingEndTime which is the existing booking’s end time plus the 10-minute gap.
  ?  Overlap Check: We modify the overlap check so that the new booking starts after the adjustedExistingEndTime (i.e., 10 minutes after the latest end time of existing bookings). This prevents overlaps or bookings that start right after an existing booking without any gap.
  *  Example:
  ?  If an existing booking ends at 2:00 PM, the new booking cannot start before 2:10 PM, ensuring a 10-minute gap between the two bookings.

  ?  This logic ensures that there’s always a 10-minute buffer between bookings to avoid overlaps or back-to-back reservations.
*/

/*
  *  Explanation: (21 Sept 2024)
  ?  Buffer on both sides: I now create a bufferedStartTime as well, which ensures the new booking doesn't start too close to the previous booking. Similarly, bufferedEndTime prevents a new booking from ending too close to the next booking.
  ?  Check all possible conditions: Whether the new booking starts within 10 minutes of an existing booking's start or end, or if it completely encloses an existing booking.

  *  Testing Scenario:
  ?  First booking: timeStart: 19.10, timeEnd: 20.10
  ?  Second booking: timeStart: 22.00, timeEnd: 01.00
  ?  Third booking: timeStart: 21.00, timeEnd: 22.00 — This should not be allowed because the third booking ends exactly at the same time as the second one starts, violating the 10-minute gap rule.

  ?  This updated approach should now correctly handle the gap rule for bookings across different days as well as when inserted in between other bookings.

  * Explanation: (12 Nove 2024)
  * This function is copied from billiard-app repository. 
  * It has been modified Date() -> number because convex use milliseconds instead of Date
  * But it will use this function to validate on the client-side instead of on the server-side
*/
