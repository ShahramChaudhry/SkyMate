'use client'

// Interactive seat map component with visual indicators

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { assignSeat } from '@/lib/actions'
import { Seat } from '@prisma/client'
import clsx from 'clsx'

interface SeatMapProps {
  seats: Seat[]
  recommendedSeatIds: string[]
}

export function SeatMap({ seats, recommendedSeatIds }: SeatMapProps) {
  // Only show purple match seats if there are actual recommendations
  const showMatches = recommendedSeatIds.length > 0
  const router = useRouter()
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedSeat = seats.find(s => s.id === selectedSeatId)

  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = []
    acc[seat.row].push(seat)
    return acc
  }, {} as Record<number, Seat[]>)

  const rows = Object.keys(seatsByRow)
    .map(Number)
    .sort((a, b) => a - b)

  const handleSeatClick = (seat: Seat) => {
    if (!seat.isAvailable) return
    setSelectedSeatId(seat.id)
  }

  const handleConfirm = async () => {
    if (!selectedSeatId) return

    setIsSubmitting(true)
    try {
      await assignSeat(selectedSeatId)
      router.push('/confirmation')
    } catch (error) {
      console.error('Error assigning seat:', error)
      alert('Failed to assign seat. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Airplane nose indicator */}
      <div className="flex justify-center">
        <div className="bg-gray-200 px-8 py-3 rounded-t-full">
          <div className="text-gray-500 text-sm font-medium">Front</div>
        </div>
      </div>

      {/* Seat grid */}
      <div className="card max-w-md mx-auto">
        {/* Column headers */}
        <div className="grid grid-cols-6 gap-2 mb-4">
          {['A', 'B', 'C', 'D', 'E', 'F'].map((col) => (
            <div key={col} className="text-center text-sm font-semibold text-gray-500">
              {col}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {rows.map((row) => {
            const rowSeats = seatsByRow[row].sort((a, b) =>
              a.column.localeCompare(b.column)
            )

            return (
              <div key={row} className="flex items-center gap-2">
                {/* Row number */}
                <div className="w-8 text-center text-sm font-medium text-gray-500">
                  {row}
                </div>

                {/* Seats */}
                <div className="grid grid-cols-6 gap-2 flex-1">
                  {rowSeats.map((seat) => {
                    const isRecommended = showMatches && recommendedSeatIds.includes(seat.id)
                    const isSelected = selectedSeatId === seat.id
                    const isAvailable = seat.isAvailable

                    return (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        disabled={!isAvailable}
                        className={clsx(
                          'h-10 rounded-lg border-2 transition-all font-medium text-xs',
                          {
                            'bg-gray-400 border-gray-500 cursor-not-allowed': !isAvailable,
                            'bg-gray-200 border-gray-300 hover:border-gray-400': isAvailable && !isRecommended && !isSelected,
                            'bg-purple-200 border-purple-400 hover:border-purple-500 animate-pulse': isAvailable && isRecommended && !isSelected,
                            'bg-primary border-primary-dark text-white': isSelected,
                          }
                        )}
                        aria-label={`Seat ${row}${seat.column}`}
                      >
                        {/* Show indicator for potential matches */}
                        {isAvailable && isRecommended && !isSelected && (
                          <span className="text-purple-600">💕</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected seat info and action */}
      {selectedSeat && (
        <div className="card max-w-md mx-auto space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              Seat {selectedSeat.row}{selectedSeat.column}
            </div>
            <div className="text-sm text-gray-600">
              Row {selectedSeat.row}, Seat {selectedSeat.column}
            </div>
          </div>

          {/* Match indicator */}
          {showMatches && recommendedSeatIds.includes(selectedSeat.id) && (
            <div className="p-3 bg-purple-50 border border-purple-300 rounded-lg text-center">
              <div className="text-2xl mb-1">💕</div>
              <div className="text-sm font-semibold text-purple-900">
                Compatible match in neighboring seat!
              </div>
              <div className="text-xs text-purple-700 mt-1">
                Someone who matches your preferences is already seated nearby
              </div>
            </div>
          )}

          {/* Seat features */}
          <div className="flex justify-center gap-4 text-sm text-gray-600">
            {selectedSeat.isWindow && <span>🪟 Window</span>}
            {selectedSeat.isAisle && <span>🚶 Aisle</span>}
            {selectedSeat.isExitRow && <span>📏 Extra legroom</span>}
          </div>

          {selectedSeat.isNearChild && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-900">
              <span className="font-semibold">Discounted seat</span> - Near family section
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? 'Confirming...' : `Continue with seat ${selectedSeat.row}${selectedSeat.column}`}
          </button>
        </div>
      )}
    </div>
  )
}
