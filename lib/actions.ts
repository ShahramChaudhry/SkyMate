// Server Actions for SeatSense booking flow
// Handles preferences, seat selection, and confirmation

'use server'

import { prisma } from '@/lib/prisma'
import { getOrCreateSessionId, getExistingSessionId, getExpirationTime } from '@/lib/session'
import { getRecommendedSeats } from '@/lib/seat-recommendation-dating'
import { revalidatePath } from 'next/cache'

/**
 * Create or get existing booking for current session (Server Action only)
 */
export async function getOrCreateBooking(flightNumber: string = 'AA1234') {
  const sessionId = await getOrCreateSessionId()

  let booking = await prisma.booking.findUnique({
    where: { sessionId },
    include: {
      preferences: true,
      seatAssignment: {
        include: { seat: true },
      },
    },
  })

  if (!booking) {
    booking = await prisma.booking.create({
      data: {
        sessionId,
        flightNumber,
        expiresAt: getExpirationTime(),
      },
      include: {
        preferences: true,
        seatAssignment: {
          include: { seat: true },
        },
      },
    })
  }

  return booking
}

/**
 * Get existing booking without creating one (safe for Server Components)
 */
export async function getExistingBooking() {
  const sessionId = await getExistingSessionId()
  
  if (!sessionId) {
    return null
  }

  return await prisma.booking.findUnique({
    where: { sessionId },
    include: {
      preferences: true,
      seatAssignment: {
        include: { seat: true },
      },
    },
  })
}

/**
 * Save user preferences (dating/social version)
 */
export async function savePreferences(data: {
  relationshipStatus: string
  lookingFor: string
  interestedInAgeMin: number
  interestedInAgeMax: number
  interestedInGender: string
  myAge: number
  myGender: string
  vibes: string
  socialComfort: string
}) {
  const booking = await getOrCreateBooking()

  const preferences = await prisma.preferences.upsert({
    where: { bookingId: booking.id },
    create: {
      bookingId: booking.id,
      relationshipStatus: data.relationshipStatus,
      lookingFor: data.lookingFor,
      interestedInAgeMin: data.interestedInAgeMin,
      interestedInAgeMax: data.interestedInAgeMax,
      interestedInGender: data.interestedInGender,
      myAge: data.myAge,
      myGender: data.myGender,
      vibes: data.vibes,
      socialComfort: data.socialComfort,
    },
    update: {
      relationshipStatus: data.relationshipStatus,
      lookingFor: data.lookingFor,
      interestedInAgeMin: data.interestedInAgeMin,
      interestedInAgeMax: data.interestedInAgeMax,
      interestedInGender: data.interestedInGender,
      myAge: data.myAge,
      myGender: data.myGender,
      vibes: data.vibes,
      socialComfort: data.socialComfort,
    },
  })

  revalidatePath('/seat-map')
  return preferences
}

/**
 * Get seat recommendations based on preferences (read-only for Server Components)
 */
export async function getSeatRecommendations() {
  const booking = await getExistingBooking()

  const seats = await prisma.seat.findMany({
    where: {
      flightNumber: 'AA1234',
    },
    orderBy: [{ row: 'asc' }, { column: 'asc' }],
  })

  // If no booking or no preferences OR user is not looking, return empty recommendations
  if (!booking || !booking.preferences || booking.preferences.lookingFor === 'not_looking') {
    return { seats, recommended: [] }
  }

  const recommended = getRecommendedSeats(
    seats,
    {
      relationshipStatus: booking.preferences.relationshipStatus,
      lookingFor: booking.preferences.lookingFor,
      interestedInAgeMin: booking.preferences.interestedInAgeMin,
      interestedInAgeMax: booking.preferences.interestedInAgeMax,
      interestedInGender: booking.preferences.interestedInGender,
      myAge: booking.preferences.myAge || 25,
      myGender: booking.preferences.myGender,
      vibes: booking.preferences.vibes,
      socialComfort: booking.preferences.socialComfort,
    },
    8 // Get top 8 recommendations
  )

  return {
    seats,
    recommended: recommended.map(r => ({
      seatId: r.seat.id,
      row: r.seat.row,
      column: r.seat.column,
      score: r.score,
      reasons: r.reasons,
    })),
  }
}

/**
 * Assign seat to booking
 */
export async function assignSeat(seatId: string) {
  const booking = await getOrCreateBooking()

  // Check if seat is available
  const seat = await prisma.seat.findUnique({
    where: { id: seatId },
  })

  if (!seat || !seat.isAvailable) {
    throw new Error('Seat is not available')
  }

  // Delete existing assignment if any
  await prisma.seatAssignment.deleteMany({
    where: { bookingId: booking.id },
  })

  // Create new assignment
  const assignment = await prisma.seatAssignment.create({
    data: {
      bookingId: booking.id,
      seatId: seatId,
    },
    include: {
      seat: true,
    },
  })

  // Mark seat as unavailable
  await prisma.seat.update({
    where: { id: seatId },
    data: { isAvailable: false },
  })

  revalidatePath('/confirmation')
  return assignment
}

/**
 * Get current booking status with all data (read-only for Server Components)
 */
export async function getBookingStatus() {
  return await getExistingBooking()
}

/**
 * Finalize booking confirmation
 */
export async function confirmBooking() {
  const booking = await getExistingBooking()
  
  if (!booking || !booking.seatAssignment) {
    throw new Error('No seat assignment found')
  }

  // In a real app, this would:
  // - Send confirmation email
  // - Process payment
  // - Update booking status to "confirmed"
  // - etc.
  
  // For now, we'll just return success
  revalidatePath('/success')
  return {
    success: true,
    bookingId: booking.id,
    seat: booking.seatAssignment.seat,
  }
}
