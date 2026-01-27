// Seat recommendation algorithm for SeatSense
// Privacy-first matching based on comfort preferences

import { Seat } from '@prisma/client'

export interface UserPreferences {
  ageMin: number
  ageMax: number
  socialComfort: 'quiet' | 'open' | 'none'
  inclusivity: 'any' | 'same' | 'different' | 'none'
}

export interface SeatScore {
  seat: Seat
  score: number
  reasons: string[]
}

/**
 * Calculate compatibility score for a seat based on user preferences
 * Higher score = better match
 */
export function calculateSeatScore(
  seat: Seat,
  preferences: UserPreferences,
  allSeats: Seat[]
): SeatScore {
  let score = 0
  const reasons: string[] = []

  // Base score for available seats
  if (!seat.isAvailable) {
    return { seat, score: -1000, reasons: ['Seat not available'] }
  }

  // 1. Age preference matching (highest priority: +50 points)
  const neighborSeats = getNeighborSeats(seat, allSeats)
  const neighborAges = neighborSeats
    .map(s => s.occupiedByAge)
    .filter((age): age is number => age !== null)

  if (neighborAges.length > 0) {
    const ageMatches = neighborAges.filter(
      age => age >= preferences.ageMin && age <= preferences.ageMax
    )
    const ageMatchRatio = ageMatches.length / neighborAges.length

    if (ageMatchRatio >= 0.5) {
      score += 50
      reasons.push('Age-compatible neighbors')
    } else if (ageMatchRatio > 0) {
      score += 25
      reasons.push('Some age-compatible neighbors')
    }
  }

  // 2. Social comfort matching (+40 points)
  if (preferences.socialComfort !== 'none') {
    const neighborSocialPrefs = neighborSeats
      .map(s => s.occupiedBySocial)
      .filter((pref): pref is string => pref !== null)

    if (preferences.socialComfort === 'quiet') {
      const quietNeighbors = neighborSocialPrefs.filter(p => p === 'quiet').length
      if (quietNeighbors > 0) {
        score += 40
        reasons.push('Quiet neighbors preferred')
      }
    } else if (preferences.socialComfort === 'open') {
      const openNeighbors = neighborSocialPrefs.filter(p => p === 'open').length
      if (openNeighbors > 0) {
        score += 40
        reasons.push('Social neighbors nearby')
      }
    }
  }

  // 3. Avoid children unless user opts in (-60 points penalty)
  if (seat.isNearChild) {
    // Check if user is open to sitting near children based on age preference
    const openToChildren = preferences.ageMin <= 12
    
    if (openToChildren) {
      score += 20 // Bonus for accepting discounted seat
      reasons.push('Discounted seat near children')
    } else {
      score -= 60 // Strong penalty for users who prefer adult sections
      reasons.push('Near children (not preferred)')
    }
  }

  // 4. Seat position bonuses (+10-20 points)
  if (seat.isWindow) {
    score += 15
    reasons.push('Window seat')
  }
  if (seat.isAisle) {
    score += 10
    reasons.push('Aisle seat')
  }
  if (seat.isExitRow) {
    score += 20
    reasons.push('Extra legroom (exit row)')
  }

  // 5. Proximity to occupied seats (prefer some space if available)
  const emptyNeighbors = neighborSeats.filter(s => s.isAvailable).length
  if (emptyNeighbors >= 2) {
    score += 15
    reasons.push('More personal space')
  }

  return { seat, score, reasons }
}

/**
 * Get neighboring seats (adjacent in same row, front/back rows)
 */
function getNeighborSeats(seat: Seat, allSeats: Seat[]): Seat[] {
  const neighbors: Seat[] = []
  const columnIndex = getColumnIndex(seat.column)

  for (const s of allSeats) {
    // Same row, adjacent columns
    if (s.row === seat.row) {
      const sColIndex = getColumnIndex(s.column)
      if (Math.abs(sColIndex - columnIndex) === 1) {
        neighbors.push(s)
      }
    }

    // Front/back rows, same column
    if (
      (s.row === seat.row - 1 || s.row === seat.row + 1) &&
      s.column === seat.column
    ) {
      neighbors.push(s)
    }
  }

  return neighbors
}

/**
 * Convert column letter to index (A=0, B=1, etc.)
 */
function getColumnIndex(column: string): number {
  return column.charCodeAt(0) - 'A'.charCodeAt(0)
}

/**
 * Get top N recommended seats sorted by score
 */
export function getRecommendedSeats(
  seats: Seat[],
  preferences: UserPreferences,
  topN: number = 5
): SeatScore[] {
  const availableSeats = seats.filter(s => s.isAvailable)
  const scoredSeats = availableSeats.map(seat =>
    calculateSeatScore(seat, preferences, seats)
  )

  return scoredSeats
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
}
