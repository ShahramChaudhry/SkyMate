// Seat map screen - Interactive aircraft seat selection
// Shows recommended seats based on preferences

import { getSeatRecommendations, getBookingStatus } from '@/lib/actions'
import { SeatMap } from '@/components/seat-map'
import { BackButton } from '@/components/back-button'

// Force dynamic rendering (requires database access)
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function SeatMapPage() {
  // Skip database call during build (no DATABASE_URL available)
  if (!process.env.DATABASE_URL) {
    return <div>Loading...</div>
  }

  const { seats, recommended } = await getSeatRecommendations()
  const booking = await getBookingStatus()

  // Only show purple match seats if:
  // 1. User has a booking AND
  // 2. User has preferences AND
  // 3. User chose to look for something (not "not_looking") AND
  // 4. There are actually recommendations
  const hasPreferences = !!(booking && booking.preferences)
  const isLookingForMatch = booking && 
                           hasPreferences && 
                           booking.preferences!.lookingFor !== 'not_looking' &&
                           recommended.length > 0
  
  const recommendedSeatIds = isLookingForMatch 
    ? new Set(recommended.map(r => r.seatId))
    : new Set<string>()

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <BackButton href="/preferences" />
          <h1 className="text-xl font-semibold text-gray-900">
            Select Your Seat
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 py-6 space-y-6">
        {/* Info Text */}
        {isLookingForMatch && recommendedSeatIds.size > 0 ? (
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-gray-900">
              ✨ Potential matches nearby!
            </p>
            <p className="text-sm text-gray-600">
              Purple seats 💕 = Sit here to be near a compatible match!
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-600">
            Choose any available seat
          </p>
        )}

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <LegendItem color="bg-gray-200" label="Available" />
          {isLookingForMatch && (
            <LegendItem color="bg-purple-200" label="Sit here for a match 💕" />
          )}
          <LegendItem color="bg-gray-400" label="Occupied" />
          <LegendItem color="bg-primary" label="Selected" />
        </div>

        {/* Seat Map */}
        <SeatMap
          seats={seats}
          recommendedSeatIds={Array.from(recommendedSeatIds)}
        />
      </div>
    </main>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 ${color} rounded border border-gray-300`} />
      <span className="text-gray-700">{label}</span>
    </div>
  )
}
