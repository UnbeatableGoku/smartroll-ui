import { useEffect, useRef, useState } from 'react'

import { Loader2, Volume2, VolumeX } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from './card'

interface CustomLoaderProps {
  isVisible: boolean
  onComplete: () => void
  onEarlyComplete?: () => void
  delay?: number
}

const CustomLoader = ({
  isVisible,
  onComplete,
  onEarlyComplete,
  delay = 5000,
}: CustomLoaderProps) => {
  const [timeLeft, setTimeLeft] = useState(delay / 1000)
  const earlyCompleteCalledRef = useRef(false)

  useEffect(() => {
    if (!isVisible) {
      // Reset state when not visible
      setTimeLeft(delay / 1000)
      earlyCompleteCalledRef.current = false
      return
    }

    // Reset state when becoming visible
    setTimeLeft(delay / 1000)
    earlyCompleteCalledRef.current = false

    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        // Call early complete when 2 seconds are remaining (at 1 second into countdown)
        if (prev <= 2 && !earlyCompleteCalledRef.current && onEarlyComplete) {
          earlyCompleteCalledRef.current = true
          // Call onEarlyComplete immediately without any delays
          onEarlyComplete()
        }

        if (prev <= 1) {
          clearInterval(countdown)
          onComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(countdown)
    }
  }, [isVisible, delay])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <Card className="mx-auto w-full max-w-lg border-none bg-white shadow-2xl">
        <CardHeader className="pb-3 text-center md:pb-4">
          <CardTitle className="text-xl font-bold text-[#0261BE] md:text-2xl lg:text-3xl">
            Session Starting...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4 text-center md:space-y-6 md:px-6">
          {/* Loading Spinner */}
          <div className="flex justify-center">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-[#0261BE] md:h-16 md:w-16" />
              <div className="absolute inset-0 animate-ping rounded-full bg-[#0261BE] opacity-20"></div>
            </div>
          </div>

          {/* Countdown */}
          <div className="text-2xl font-bold text-[#0261BE] md:text-3xl lg:text-4xl">
            {timeLeft}s
          </div>

          {/* Volume Instructions - Always Visible */}
          <div className="space-y-3 rounded-lg border border-[#0261BE]/20 bg-[#F7F7F7] p-4 md:space-y-4 md:p-6">
            <div className="flex flex-col items-center justify-center space-y-2 md:flex-row md:space-x-3 md:space-y-0">
              <Volume2 className="h-6 w-6 text-[#0261BE] md:h-8 md:w-8" />
              <span className="text-lg font-bold text-[#0261BE] md:text-xl">
                Turn Up Your Volume!
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-700 md:text-base">
              Please ensure your device volume is set to maximum..
            </p>
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-white/50 p-2 text-xs text-[#0261BE] md:flex-row md:space-x-2 md:space-y-0 md:p-3 md:text-sm">
              <VolumeX className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-center font-medium">
                Check if your speakers/headphones are working properly
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 md:h-3">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-[#0261BE] to-[#0261BE]/80 transition-all duration-1000 ease-out md:h-3"
              style={{ width: `${((delay - timeLeft * 1000) / delay) * 100}%` }}
            />
          </div>

          <p className="text-sm font-medium text-gray-600 md:text-base">
            Please wait while we prepare your session...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomLoader
