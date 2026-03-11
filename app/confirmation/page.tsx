// Confirmation screen - Display booking summary
// Shows selected seat and preferences overview

import { getBookingStatus } from '@/lib/actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ConfirmButton } from '@/components/confirm-button'

// Force dynamic rendering (requires database access)
export const dynamic = 'force-dynamic'

export default async function ConfirmationPage() {
  const booking = await getBookingStatus()

  if (!booking || !booking.seatAssignment) {
    redirect('/seat-map')
  }

  const seat = booking.seatAssignment.seat
  const prefs = booking.preferences

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Confirm Your Seat
          </h1>
        </div>

        {/* Seat Display */}
        <div className="card text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-2xl mb-3">
              <span className="text-3xl">✓</span>
            </div>
          </div>
          
          <div className="mb-2">
            <div className="text-4xl font-bold text-gray-900 mb-1">
              Seat {seat.row}{seat.column}
            </div>
            <div className="text-gray-600">
              Row {seat.row}, Seat {seat.column}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm font-semibold text-gray-700 mb-2">
              Middle seat
            </div>
            <div className="flex justify-center gap-4">
              {['A', 'B', 'C', 'D', 'E', 'F'].map((col) => (
                <div
                  key={col}
                  className={clsx(
                    'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium',
                    col === seat.column
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  )}
                >
                  {col}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preferences Summary */}
        {prefs && (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Preferences
              </h2>
              <Link href="/preferences" className="text-sm text-primary hover:underline">
                Edit
              </Link>
            </div>

            <div className="space-y-3 text-sm">
              <PreferenceRow
                label="Looking for"
                value={formatLookingFor(prefs.lookingFor)}
              />
              {prefs.lookingFor !== 'not_looking' && (
                <>
                  <PreferenceRow
                    label="Interested in"
                    value={formatGenderPref(prefs.interestedInGender)}
                  />
                  <PreferenceRow
                    label="Age range"
                    value={`${prefs.interestedInAgeMin} - ${prefs.interestedInAgeMax} years`}
                  />
                  {prefs.vibes && (
                    <PreferenceRow
                      label="Your vibe"
                      value={prefs.vibes.split(',').join(', ')}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-900">
          You can change your seat at any time before your flight through the
          booking management section.
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <ConfirmButton />
          <Link href="/seat-map" className="block">
            <button className="btn-secondary">
              Choose different seat
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}

function PreferenceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  )
}

function formatLookingFor(value: string): string {
  const map: Record<string, string> = {
    romance: '💕 Romance',
    friendship: '🤝 Friendship',
    networking: '💼 Networking',
    not_looking: '😌 Not looking',
  }
  return map[value] || value
}

function formatGenderPref(value: string): string {
  const map: Record<string, string> = {
    men: 'Men',
    women: 'Women',
    everyone: 'Everyone',
  }
  return map[value] || value
}

// Helper function for className
function clsx(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
