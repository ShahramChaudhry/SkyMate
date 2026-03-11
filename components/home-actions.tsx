'use client'

// Home page action buttons with session clearing

import { useRouter } from 'next/navigation'
import { clearPreferences } from '@/lib/actions'
import { useEffect } from 'react'
import Link from 'next/link'

export function HomeActions() {
  const router = useRouter()

  // Clear preferences when component mounts (fresh start each time)
  useEffect(() => {
    clearPreferences().catch(err => console.error('Failed to clear preferences:', err))
  }, [])

  const handleSkip = async () => {
    try {
      // Ensure preferences are cleared
      await clearPreferences()
      router.push('/seat-map')
    } catch (error) {
      console.error('Error clearing preferences:', error)
      router.push('/seat-map')
    }
  }

  return (
    <div className="space-y-3">
      <Link href="/preferences" className="block">
        <button className="btn-primary">
          I&apos;m interested ✨
        </button>
      </Link>
      <button onClick={handleSkip} className="btn-secondary">
        Just pick a seat, thanks
      </button>
    </div>
  )
}
