'use client'

// Preferences form component with age slider and radio options

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { savePreferences } from '@/lib/actions'

const SOCIAL_OPTIONS = [
  {
    id: 'quiet',
    label: 'Prefer quiet',
    description: 'I prefer minimal interaction',
  },
  {
    id: 'open',
    label: 'Open to conversation',
    description: 'I enjoy chatting with fellow travelers',
  },
  {
    id: 'none',
    label: 'No preference',
    description: 'Either is fine',
  },
]

const INCLUSIVITY_OPTIONS = [
  {
    id: 'none',
    label: 'No preference',
    description: 'Either is fine',
  },
  {
    id: 'same',
    label: 'Same gender',
    description: '',
  },
  {
    id: 'different',
    label: 'Different gender',
    description: '',
  },
  {
    id: 'any',
    label: 'Any gender identity',
    description: '',
  },
]

export function PreferencesForm() {
  const router = useRouter()
  const [ageRange, setAgeRange] = useState({ min: 18, max: 65 })
  const [socialComfort, setSocialComfort] = useState('none')
  const [inclusivity, setInclusivity] = useState('none')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await savePreferences({
        ageMin: ageRange.min,
        ageMax: ageRange.max,
        socialComfort,
        inclusivity,
      })

      router.push('/seat-map')
    } catch (error) {
      console.error('Error saving preferences:', error)
      alert('Failed to save preferences. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Age Range Slider */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Seating Comfort Preferences
        </h2>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Preferred seatmate age range
          </label>
          
          <input
            type="range"
            min="18"
            max="65"
            value={ageRange.max}
            onChange={(e) => setAgeRange({ ...ageRange, max: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          
          <div className="mt-3 text-center">
            <span className="text-2xl font-semibold text-gray-900">
              {ageRange.min} - {ageRange.max} years
            </span>
            <p className="text-sm text-gray-500 mt-1">
              This helps match you with passengers in similar life stages
            </p>
          </div>
        </div>
      </div>

      {/* Social Comfort */}
      <div className="card">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Conversation preference
        </h3>
        
        <div className="space-y-3">
          {SOCIAL_OPTIONS.map((option) => (
            <label
              key={option.id}
              className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                socialComfort === option.id
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="socialComfort"
                  value={option.id}
                  checked={socialComfort === option.id}
                  onChange={(e) => setSocialComfort(e.target.value)}
                  className="w-5 h-5 text-primary"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-gray-500">{option.description}</div>
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Inclusivity Preference */}
      <div className="card">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Gender seating preference
        </h3>
        
        <div className="space-y-3">
          {INCLUSIVITY_OPTIONS.map((option) => (
            <label
              key={option.id}
              className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                inclusivity === option.id
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="inclusivity"
                  value={option.id}
                  checked={inclusivity === option.id}
                  onChange={(e) => setInclusivity(e.target.value)}
                  className="w-5 h-5 text-primary"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-gray-500">{option.description}</div>
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-4">
          We respect all gender identities and self-identification
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary"
      >
        {isSubmitting ? 'Saving...' : 'Continue'}
      </button>
    </form>
  )
}
