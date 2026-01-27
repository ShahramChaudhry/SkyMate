'use client'

// Confirm booking button

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { confirmBooking } from '@/lib/actions'

export function ConfirmButton() {
  const router = useRouter()
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = async () => {
    setIsConfirming(true)
    
    try {
      await confirmBooking()
      router.push('/success')
    } catch (error) {
      console.error('Error confirming booking:', error)
      alert('Failed to confirm booking. Please try again.')
      setIsConfirming(false)
    }
  }

  return (
    <button
      onClick={handleConfirm}
      disabled={isConfirming}
      className="btn-primary"
    >
      {isConfirming ? 'Confirming...' : 'Confirm seat'}
    </button>
  )
}
