'use client'

import { useEffect, useState } from 'react'

import { Wifi, WifiOff } from 'lucide-react'
import { createPortal } from 'react-dom'

export default function Component() {
  const [dots, setDots] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === '...') return ''
        return prev + '.'
      })
    }, 500)

    setMounted(true)

    return () => clearInterval(interval)
  }, [])

  const overlay = (
    <div
      className="pointer-events-auto fixed inset-0 z-[9999] flex items-center justify-center bg-transparent backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Reconnecting overlay"
    >
      <div className="mx-auto max-w-md rounded-2xl border border-white/20 bg-white/90 px-6 py-8 text-center shadow-2xl backdrop-blur-sm">
        <div className="relative mb-8">
          <div className="relative mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/60 backdrop-blur-sm">
            <div className="absolute inset-0 opacity-10">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <defs>
                  <pattern
                    id="grid"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 10 0 L 0 0 0 10"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>
            <div className="relative z-10">
              <WifiOff className="h-12 w-12 text-gray-400" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-20 w-20 animate-ping rounded-full border-2 border-blue-200 opacity-75"></div>
              <div
                className="absolute h-16 w-16 animate-ping rounded-full border-2 border-blue-300 opacity-50"
                style={{ animationDelay: '0.5s' }}
              ></div>
              <div
                className="absolute h-12 w-12 animate-ping rounded-full border-2 border-blue-400 opacity-25"
                style={{ animationDelay: '1s' }}
              ></div>
            </div>
          </div>
          <div className="absolute -right-2 -top-2 flex h-8 w-8 animate-bounce items-center justify-center rounded-full bg-blue-500/90 shadow-lg backdrop-blur-sm">
            <Wifi className="h-4 w-4 text-white" />
          </div>
        </div>

        <h1
          className="mb-3 text-2xl font-semibold text-gray-900"
          aria-live="polite"
          aria-atomic="true"
        >
          Reconnecting{dots}
        </h1>

        <p className="mb-6 leading-relaxed text-gray-600">
          We're having trouble connecting to the network. Please check your
          internet connection and we'll try to reconnect automatically.
        </p>

        <div
          className="mb-6 h-1 w-full overflow-hidden rounded-full bg-gray-200"
          role="progressbar"
          aria-valuetext="Attempting to reconnect"
        >
          <div
            className="h-full animate-pulse rounded-full bg-blue-500"
            style={{ width: '60%' }}
          ></div>
        </div>

        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-400"></div>
            <span>Checking connection</span>
          </div>
        </div>

        {/* <button className="px-6 py-2 mt-8 font-medium text-white transition-all duration-200 border rounded-lg shadow-lg bg-blue-500/90 backdrop-blur-sm hover:bg-blue-600/90 border-blue-400/30">
          Try Again
        </button> */}
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(overlay, document.body)
}
