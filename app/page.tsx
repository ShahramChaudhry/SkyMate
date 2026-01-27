// Opt-in screen - Introduction to SeatSense feature
// Users can choose to personalize their seating or skip to manual selection

import Link from 'next/link'
import { PlaneIcon } from '@/components/icons'

export default function OptInPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="bg-blue-50 p-6 rounded-3xl">
            <PlaneIcon className="w-12 h-12 text-primary" />
          </div>
        </div>

        {/* Title and Description */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Turn your flight into a meet-cute moment ✨
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Looking to meet someone special, make a new friend, or network at 30,000 feet?
            Let us help you find your perfect seatmate.
          </p>
        </div>

        {/* Privacy Features */}
        <div className="card space-y-4">
          <PrivacyFeature
            icon="💕"
            text="Only matched with people who are also looking"
          />
          <PrivacyFeature
            icon="🔒"
            text="Your info stays private until mutual interest"
          />
          <PrivacyFeature
            icon="✨"
            text="Skip anytime - no pressure, just possibilities"
          />
        </div>

        {/* Illustration */}
        <div className="flex justify-center py-4">
          <SeatIllustration />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/preferences" className="block">
            <button className="btn-primary">
              I&apos;m interested ✨
            </button>
          </Link>
          <Link href="/seat-map" className="block">
            <button className="btn-secondary">
              Just pick a seat, thanks
            </button>
          </Link>
        </div>

        {/* Help Button */}
        <div className="flex justify-center">
          <button
            className="w-12 h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-colors"
            aria-label="Help"
          >
            ?
          </button>
        </div>
      </div>
    </main>
  )
}

function PrivacyFeature({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-primary text-xl font-bold mt-0.5">{icon}</span>
      <p className="text-gray-700">{text}</p>
    </div>
  )
}

function SeatIllustration() {
  return (
    <div className="bg-gray-100 px-8 py-6 rounded-full border-2 border-gray-200">
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="w-7 h-7 bg-blue-200 rounded-md"
          />
        ))}
      </div>
    </div>
  )
}
