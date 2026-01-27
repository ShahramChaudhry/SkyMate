// Preferences screen - Collect user seating preferences
// Age range, social comfort, and inclusivity options

import { PreferencesFormDating } from '@/components/preferences-form-dating'
import { BackButton } from '@/components/back-button'

export default function PreferencesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <BackButton href="/" />
          <h1 className="text-xl font-semibold text-gray-900">
            Tell us about yourself
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4 py-6">
        {/* Info Banner */}
        <div className="mb-6 p-4 bg-pink-50 border border-pink-200 rounded-xl">
          <div className="flex gap-3">
            <span className="text-pink-600 text-xl">💕</span>
            <p className="text-sm text-pink-900">
              Tell us what you&apos;re looking for! We&apos;ll only show you potential matches
              who are also looking and match your preferences. Your info stays private
              until there&apos;s mutual interest.
            </p>
          </div>
        </div>

        {/* Form */}
        <PreferencesFormDating />
      </div>
    </main>
  )
}
