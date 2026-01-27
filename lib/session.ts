// Session management utilities for temporary booking sessions
// Uses cookies to track user session without requiring authentication

import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

const SESSION_COOKIE_NAME = 'seatsense_session'
const SESSION_MAX_AGE = 60 * 60 * 24 // 24 hours

/**
 * Get existing session ID from cookies (read-only, safe for Server Components)
 */
export async function getExistingSessionId(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE_NAME)?.value || null
}

/**
 * Create new session ID and set cookie (MUST be called from Server Action)
 */
export async function createSession(): Promise<string> {
  const cookieStore = await cookies()
  const sessionId = uuidv4()
  
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
  
  return sessionId
}

/**
 * Get or create session ID from cookies (for Server Actions only)
 */
export async function getOrCreateSessionId(): Promise<string> {
  const existingSession = await getExistingSessionId()
  if (existingSession) {
    return existingSession
  }
  return await createSession()
}

/**
 * Clear session cookie
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * Calculate expiration time for booking (24 hours from now)
 */
export function getExpirationTime(): Date {
  const now = new Date()
  return new Date(now.getTime() + SESSION_MAX_AGE * 1000)
}
