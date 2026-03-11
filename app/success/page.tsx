// Success page - Booking confirmed!

import { getBookingStatus } from '@/lib/actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// Force dynamic rendering (requires database access)
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function SuccessPage() {
  // Skip database call during build (no DATABASE_URL available)
  if (!process.env.DATABASE_URL) {
    return <div>Loading...</div>
  }

  const booking = await getBookingStatus()

  if (!booking || !booking.seatAssignment) {
    redirect('/')
  }

  const seat = booking.seatAssignment.seat
  const prefs = booking.preferences

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Success Animation */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            All set! ✨
          </h1>
          <p className="text-lg text-gray-600">
            Your seat is confirmed
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="card space-y-4">
          <div className="text-center pb-4 border-b border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Your Seat</div>
            <div className="text-5xl font-bold text-primary">
              {seat.row}{seat.column}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Flight AA1234
            </div>
          </div>

          {/* Seat Features */}
          <div className="flex justify-center gap-4 text-sm text-gray-600">
            {seat.isWindow && <span>🪟 Window</span>}
            {seat.isAisle && <span>🚶 Aisle</span>}
            {seat.isExitRow && <span>📏 Extra legroom</span>}
          </div>

          {/* Match Info */}
          {prefs && prefs.lookingFor !== 'not_looking' && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl text-center">
              <div className="text-2xl mb-2">💕</div>
              <div className="text-sm font-semibold text-purple-900 mb-1">
                Exciting news!
              </div>
              <div className="text-xs text-purple-700">
                You&apos;re seated near someone who matches your preferences.
                {prefs.lookingFor === 'romance' && ' Enjoy your flight and maybe say hello! 😊'}
                {prefs.lookingFor === 'friendship' && ' Could be the start of a great friendship! 🤝'}
                {prefs.lookingFor === 'networking' && ' Perfect opportunity to network! 💼'}
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-3">What&apos;s next?</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2">
              <span>✓</span>
              <span>Check-in opens 24 hours before departure</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Boarding pass will be sent to your email</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Arrive at the gate 45 minutes before boarding</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/" className="block">
            <button className="btn-primary">
              Book another flight
            </button>
          </Link>
          <Link href="/seat-map" className="block">
            <button className="btn-secondary">
              Change seat
            </button>
          </Link>
        </div>

        {/* Booking Reference */}
        <div className="text-center text-xs text-gray-500">
          Booking reference: {booking.id.slice(0, 8).toUpperCase()}
        </div>
      </div>
    </main>
  )
}
