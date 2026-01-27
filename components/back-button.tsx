// Back button component for navigation

import Link from 'next/link'

export function BackButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="text-gray-600 hover:text-gray-900 transition-colors"
      aria-label="Go back"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </Link>
  )
}
