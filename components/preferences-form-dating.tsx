'use client'

// Dating/Social preferences form for SkyMatch

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { savePreferences } from '@/lib/actions'

const RELATIONSHIP_STATUS = [
  { id: 'single', label: 'Single', emoji: '💚' },
  { id: 'dating', label: 'In a relationship', emoji: '💙' },
  { id: 'married', label: 'Married', emoji: '💍' },
  { id: 'complicated', label: "It's complicated", emoji: '💛' },
]

const LOOKING_FOR = [
  { id: 'romance', label: 'Romance', emoji: '💕', description: 'Looking for a potential date or partner' },
  { id: 'friendship', label: 'Friendship', emoji: '🤝', description: 'Want to make a new friend' },
  { id: 'networking', label: 'Networking', emoji: '💼', description: 'Professional connections' },
  { id: 'not_looking', label: 'Not looking', emoji: '😌', description: 'Just here for the flight' },
]

const GENDER_OPTIONS = [
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
  { id: 'everyone', label: 'Everyone' },
]

const MY_GENDER_OPTIONS = [
  { id: 'man', label: 'Man' },
  { id: 'woman', label: 'Woman' },
  { id: 'non_binary', label: 'Non-binary' },
  { id: 'prefer_not_say', label: 'Prefer not to say' },
]

const VIBE_OPTIONS = [
  { id: 'adventurous', label: '🏔️ Adventurous', description: 'Love travel & new experiences' },
  { id: 'creative', label: '🎨 Creative', description: 'Into arts, music, design' },
  { id: 'intellectual', label: '📚 Intellectual', description: 'Love deep conversations' },
  { id: 'sporty', label: '⚽ Sporty', description: 'Active & athletic' },
  { id: 'foodie', label: '🍕 Foodie', description: 'Passionate about food' },
  { id: 'bookworm', label: '📖 Bookworm', description: 'Always reading something' },
]

export function PreferencesFormDating() {
  const router = useRouter()
  
  // Relationship & Intent
  const [relationshipStatus, setRelationshipStatus] = useState('single')
  const [lookingFor, setLookingFor] = useState('friendship')
  
  // Demographics
  const [myAge, setMyAge] = useState(25)
  const [myGender, setMyGender] = useState('prefer_not_say')
  const [interestedInGender, setInterestedInGender] = useState('everyone')
  const [ageRange, setAgeRange] = useState({ min: 21, max: 45 })
  
  // Vibes
  const [selectedVibes, setSelectedVibes] = useState<string[]>([])
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleVibe = (vibeId: string) => {
    if (selectedVibes.includes(vibeId)) {
      setSelectedVibes(selectedVibes.filter(v => v !== vibeId))
    } else {
      setSelectedVibes([...selectedVibes, vibeId])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await savePreferences({
        relationshipStatus,
        lookingFor,
        interestedInAgeMin: ageRange.min,
        interestedInAgeMax: ageRange.max,
        interestedInGender,
        myAge,
        myGender,
        vibes: selectedVibes.join(','),
        socialComfort: lookingFor === 'not_looking' ? 'quiet' : 'open',
      })

      router.push('/seat-map')
    } catch (error) {
      console.error('Error saving preferences:', error)
      alert('Failed to save preferences. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Relationship Status */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Your relationship status
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          {RELATIONSHIP_STATUS.map((status) => (
            <label
              key={status.id}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
                relationshipStatus === status.id
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="relationshipStatus"
                value={status.id}
                checked={relationshipStatus === status.id}
                onChange={(e) => setRelationshipStatus(e.target.value)}
                className="sr-only"
              />
              <div className="text-2xl mb-1">{status.emoji}</div>
              <div className="text-sm font-medium text-gray-900">{status.label}</div>
            </label>
          ))}
        </div>
      </div>

      {/* Looking For */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          What are you looking for?
        </h2>
        
        <div className="space-y-3">
          {LOOKING_FOR.map((option) => (
            <label
              key={option.id}
              className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                lookingFor === option.id
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="lookingFor"
                  value={option.id}
                  checked={lookingFor === option.id}
                  onChange={(e) => setLookingFor(e.target.value)}
                  className="w-5 h-5 text-primary"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {option.emoji} {option.label}
                  </div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Only show matching preferences if they're looking for something */}
      {lookingFor !== 'not_looking' && (
        <>
          {/* About You */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              About you
            </h2>
            
            {/* My Age */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your age
              </label>
              <input
                type="range"
                min="18"
                max="80"
                value={myAge}
                onChange={(e) => setMyAge(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="mt-2 text-center text-xl font-semibold text-gray-900">
                {myAge} years old
              </div>
            </div>

            {/* My Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your gender
              </label>
              <div className="grid grid-cols-2 gap-2">
                {MY_GENDER_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center text-sm ${
                      myGender === option.id
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="myGender"
                      value={option.id}
                      checked={myGender === option.id}
                      onChange={(e) => setMyGender(e.target.value)}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Interested In */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Who you&apos;re interested in meeting
            </h2>
            
            {/* Gender Preference */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Interested in
              </label>
              <div className="grid grid-cols-3 gap-2">
                {GENDER_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center text-sm ${
                      interestedInGender === option.id
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="interestedInGender"
                      value={option.id}
                      checked={interestedInGender === option.id}
                      onChange={(e) => setInterestedInGender(e.target.value)}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Age Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Age range you&apos;re interested in
              </label>
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <input
                    type="range"
                    min="18"
                    max="80"
                    value={ageRange.min}
                    onChange={(e) => setAgeRange({ ...ageRange, min: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="text-center text-sm font-medium text-gray-700 mt-1">
                    {ageRange.min}
                  </div>
                </div>
                <span className="text-gray-400">to</span>
                <div className="flex-1">
                  <input
                    type="range"
                    min="18"
                    max="80"
                    value={ageRange.max}
                    onChange={(e) => setAgeRange({ ...ageRange, max: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="text-center text-sm font-medium text-gray-700 mt-1">
                    {ageRange.max}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Ages {ageRange.min} - {ageRange.max}
              </p>
            </div>
          </div>

          {/* Vibes/Interests */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Your vibe
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Select all that apply (optional)
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {VIBE_OPTIONS.map((vibe) => (
                <label
                  key={vibe.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedVibes.includes(vibe.id)
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedVibes.includes(vibe.id)}
                    onChange={() => toggleVibe(vibe.id)}
                    className="sr-only"
                  />
                  <div className="font-medium text-gray-900 text-sm mb-1">
                    {vibe.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {vibe.description}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary"
      >
        {isSubmitting ? 'Finding your match...' : 'Find my seatmate ✨'}
      </button>
    </form>
  )
}
