// Dating/social seat recommendation algorithm for SkyMatch
// Matches people who are BOTH looking and compatible

import { Seat } from '@prisma/client'

export interface UserPreferences {
  relationshipStatus: string
  lookingFor: string
  interestedInAgeMin: number
  interestedInAgeMax: number
  interestedInGender: string
  myAge: number
  myGender: string
  vibes: string
  socialComfort: string
}

export interface SeatScore {
  seat: Seat
  score: number
  reasons: string[]
  isPotentialMatch: boolean
}

/**
 * Calculate compatibility score for dating/social matching
 * Only recommends seats where BOTH people are looking and compatible
 */
export function calculateSeatScore(
  seat: Seat,
  preferences: UserPreferences,
  allSeats: Seat[]
): SeatScore {
  let score = 0
  const reasons: string[] = []
  let isPotentialMatch = false

  // Base score for available seats
  if (!seat.isAvailable) {
    return { seat, score: -1000, reasons: ['Seat not available'], isPotentialMatch: false }
  }

  // If user is not looking, just suggest any available seat
  if (preferences.lookingFor === 'not_looking') {
    score = 10
    reasons.push('Available seat')
    return { seat, score, reasons, isPotentialMatch: false }
  }

  // Get neighboring seats (adjacent and front/back)
  const neighborSeats = getNeighborSeats(seat, allSeats)
  
  // Check each neighbor for compatibility
  for (const neighbor of neighborSeats) {
    if (!neighbor.occupiedByAge || !neighbor.occupiedByLookingFor) continue
    
    // Skip if neighbor is not looking
    if (neighbor.occupiedByLookingFor === 'not_looking') continue
    
    // Check if they're looking for similar things
    const compatibleIntent = checkIntentCompatibility(
      preferences.lookingFor,
      neighbor.occupiedByLookingFor
    )
    
    if (!compatibleIntent) continue

    // Check age compatibility (mutual)
    const userInNeighborRange = preferences.myAge >= 18 && preferences.myAge <= 80 // Assume neighbor has similar range
    const neighborInUserRange = neighbor.occupiedByAge >= preferences.interestedInAgeMin && 
                                neighbor.occupiedByAge <= preferences.interestedInAgeMax
    
    if (!userInNeighborRange || !neighborInUserRange) continue

    // Check gender compatibility
    const genderCompatible = checkGenderCompatibility(
      preferences.myGender,
      neighbor.occupiedByGender || 'prefer_not_say',
      preferences.interestedInGender
    )
    
    if (!genderCompatible) continue

    // If we got here, it's a potential match!
    isPotentialMatch = true
    score += 100
    reasons.push(`💕 Potential ${preferences.lookingFor} match nearby!`)

    // Bonus for shared vibes
    if (neighbor.occupiedByVibes && preferences.vibes) {
      const sharedVibes = getSharedVibes(preferences.vibes, neighbor.occupiedByVibes)
      if (sharedVibes.length > 0) {
        score += sharedVibes.length * 10
        reasons.push(`Shared interests: ${sharedVibes.join(', ')}`)
      }
    }

    // Bonus for compatible relationship status
    if (neighbor.occupiedByRelationship) {
      const statusScore = getRelationshipCompatibility(
        preferences.relationshipStatus,
        neighbor.occupiedByRelationship,
        preferences.lookingFor
      )
      if (statusScore > 0) {
        score += statusScore
      }
    }
  }

  // If no matches found, give small bonus to seats with empty neighbors
  if (!isPotentialMatch) {
    const emptyNeighbors = neighborSeats.filter(s => s.isAvailable).length
    if (emptyNeighbors >= 2) {
      score += 5
      reasons.push('Quiet area')
    }
  }

  // Seat features (minor bonuses)
  if (seat.isWindow) {
    score += 5
    reasons.push('Window seat')
  }
  if (seat.isAisle) {
    score += 3
    reasons.push('Aisle seat')
  }

  return { seat, score, reasons, isPotentialMatch }
}

/**
 * Check if two people's intents are compatible
 */
function checkIntentCompatibility(intent1: string, intent2: string): boolean {
  // Romance matches with romance
  if (intent1 === 'romance' && intent2 === 'romance') return true
  
  // Friendship matches with friendship or networking
  if (intent1 === 'friendship' && (intent2 === 'friendship' || intent2 === 'networking')) return true
  if (intent1 === 'networking' && (intent2 === 'friendship' || intent2 === 'networking')) return true
  
  // Romance can also match with friendship (potential to develop)
  if (intent1 === 'romance' && intent2 === 'friendship') return true
  if (intent1 === 'friendship' && intent2 === 'romance') return true
  
  return false
}

/**
 * Check gender compatibility
 */
function checkGenderCompatibility(
  myGender: string,
  theirGender: string,
  interestedIn: string
): boolean {
  // If interested in everyone, always compatible
  if (interestedIn === 'everyone') return true
  
  // If they prefer not to say, be inclusive
  if (myGender === 'prefer_not_say' || theirGender === 'prefer_not_say') return true
  
  // Check specific preferences
  if (interestedIn === 'men' && (theirGender === 'man')) return true
  if (interestedIn === 'women' && (theirGender === 'woman')) return true
  
  return false
}

/**
 * Get shared vibes between two people
 */
function getSharedVibes(vibes1: string, vibes2: string): string[] {
  if (!vibes1 || !vibes2) return []
  
  const vibes1Array = vibes1.split(',').filter(v => v)
  const vibes2Array = vibes2.split(',').filter(v => v)
  
  return vibes1Array.filter(v => vibes2Array.includes(v))
}

/**
 * Get compatibility score based on relationship status
 */
function getRelationshipCompatibility(
  myStatus: string,
  theirStatus: string,
  lookingFor: string
): number {
  // For romance, prefer single people
  if (lookingFor === 'romance') {
    if (myStatus === 'single' && theirStatus === 'single') return 20
    if (myStatus === 'single' && theirStatus === 'complicated') return 5
    return 0
  }
  
  // For friendship/networking, relationship status matters less
  return 5
}

/**
 * Get neighboring seats (adjacent in same row, front/back rows)
 */
function getNeighborSeats(seat: Seat, allSeats: Seat[]): Seat[] {
  const neighbors: Seat[] = []
  const columnIndex = getColumnIndex(seat.column)

  for (const s of allSeats) {
    // Same row, adjacent columns
    if (s.row === seat.row && s.id !== seat.id) {
      const sColIndex = getColumnIndex(s.column)
      if (Math.abs(sColIndex - columnIndex) === 1) {
        neighbors.push(s)
      }
    }

    // Front/back rows, same or adjacent columns
    if ((s.row === seat.row - 1 || s.row === seat.row + 1)) {
      const sColIndex = getColumnIndex(s.column)
      if (Math.abs(sColIndex - columnIndex) <= 1) {
        neighbors.push(s)
      }
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
  topN: number = 8
): SeatScore[] {
  const availableSeats = seats.filter(s => s.isAvailable)
  const scoredSeats = availableSeats.map(seat =>
    calculateSeatScore(seat, preferences, seats)
  )

  return scoredSeats
    .filter(s => s.score > 0)
    .sort((a, b) => {
      // Prioritize potential matches
      if (a.isPotentialMatch && !b.isPotentialMatch) return -1
      if (!a.isPotentialMatch && b.isPotentialMatch) return 1
      return b.score - a.score
    })
    .slice(0, topN)
}
