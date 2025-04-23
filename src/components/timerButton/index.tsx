import React, { useCallback, useEffect, useRef, useState } from 'react'

import './timerButton.css'

type TimerButtonProps = {
  initialDurationSeconds?: number
  initialText?: string
  runningTextPrefix?: string
  fillColor?: string
  baseColor?: string
  textColor?: string
  disabledTextColor?: string
  autoStart?: boolean
  initialRemainingTimeMs?: number // Added this prop
  onTimerStart?: () => void
  onTimerFinish?: () => void
  onTimerTick?: (remainingTime: number, percentage: number) => void
  OnSessionEnd?: () => void // Assuming this is meant for manual stop or different event
}

const TimerButton: React.FC<TimerButtonProps> = ({
  initialDurationSeconds = 60,
  initialText = 'Start Timer',
  runningTextPrefix = 'Running...',
  fillColor = '#be0205',
  baseColor = '#e0e0e0',
  textColor = '#333',
  disabledTextColor = '#000',
  autoStart = false,
  initialRemainingTimeMs, // Use this prop
  onTimerStart = () => {},
  onTimerFinish = () => {},
  onTimerTick = () => {},
  OnSessionEnd, // Still here if needed for other purposes
}) => {
  const initialDurationMs = initialDurationSeconds * 1000
  const [isRunning, setIsRunning] = useState(false)
  // Use initialRemainingTimeMs if provided, otherwise use the full duration
  const [timeRemaining, setTimeRemaining] = useState(
    initialRemainingTimeMs ?? initialDurationMs,
  )
  const [fillPercentage, setFillPercentage] = useState(() => {
    // Calculate initial fill percentage if initialRemainingTimeMs is provided
    if (initialRemainingTimeMs !== undefined && initialDurationMs > 0) {
      const elapsed = initialDurationMs - initialRemainingTimeMs
      return Math.min(100, Math.max(0, (elapsed / initialDurationMs) * 100))
    }
    return 0 // Start empty if no initial time or duration is 0
  })

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef(0)
  // Store the *effective* duration for the current run in a ref
  const currentRunDurationRef = useRef(timeRemaining) // Initialize with starting timeRemaining

  const onTimerFinishRef = useRef(onTimerFinish)
  const onTimerTickRef = useRef(onTimerTick)
  const onTimerStartRef = useRef(onTimerStart) // Use ref for consistency

  // Ref to track if auto-start has been processed for the current mount/autoStart=true cycle
  const autoStartAttemptedRef = useRef(false)
  // Ref to track the actual duration configuration (used for resets)
  const configDurationRef = useRef(initialDurationMs)

  // Update config duration if prop changes
  useEffect(() => {
    configDurationRef.current = initialDurationSeconds * 1000
    // If NOT running and NOT auto-starting, update displayed time if duration changes
    // and no specific initialRemainingTimeMs is overriding it
    if (!isRunning && initialRemainingTimeMs === undefined) {
      setTimeRemaining(configDurationRef.current)
      // setFillPercentage(0) // Reset fill if duration changes while idle
    }
  }, [initialDurationSeconds, initialRemainingTimeMs, isRunning])

  // Update callback refs if props change
  useEffect(() => {
    onTimerFinishRef.current = onTimerFinish
  }, [onTimerFinish])

  useEffect(() => {
    onTimerTickRef.current = onTimerTick
  }, [onTimerTick])

  useEffect(() => {
    onTimerStartRef.current = onTimerStart
  }, [onTimerStart])

  // --- AUTO-START LOGIC ---
  useEffect(() => {
    // Reset the 'attempted' flag if autoStart becomes false
    if (!autoStart) {
      autoStartAttemptedRef.current = false
      return // Do nothing else if autoStart is false
    }

    // Conditions to auto-start:
    // 1. autoStart prop is true
    // 2. Timer isn't already running
    // 3. We haven't already attempted auto-start in this cycle
    if (autoStart && !isRunning && !autoStartAttemptedRef.current) {
      console.log('Attempting Auto-start...')
      autoStartAttemptedRef.current = true // Mark as attempted

      // Determine the starting time for auto-start
      const startDuration = initialRemainingTimeMs ?? configDurationRef.current

      // Validate duration
      if (isNaN(startDuration) || startDuration <= 0) {
        console.error(
          'AutoStart Error: Invalid duration:',
          startDuration,
          '(from initialRemainingTimeMs or initialDurationSeconds)',
        )
        autoStartAttemptedRef.current = false // Allow retry if config changes
        return
      }

      setTimeRemaining(startDuration)
      currentRunDurationRef.current = startDuration // Set the duration for *this specific run*
      startTimeRef.current = Date.now() // Set start time immediately

      // Calculate initial fill state for auto-start correctly
      if (
        initialRemainingTimeMs !== undefined &&
        configDurationRef.current > 0
      ) {
        const elapsed = configDurationRef.current - initialRemainingTimeMs
        setFillPercentage(
          Math.min(
            100,
            Math.max(0, (elapsed / configDurationRef.current) * 100),
          ),
        )
      } else {
        setFillPercentage(0) // Start from 0 fill if using full duration
      }

      setIsRunning(true)
      onTimerStartRef.current() // Call start callback via ref
    }

    // Dependencies: React only to changes in autoStart itself, initial times, or if the timer is already running.
    // isRunning is needed to prevent starting if it was *already* running (e.g., started manually before effect).
  }, [autoStart, initialRemainingTimeMs, isRunning])
  // Note: configDurationRef (derived from initialDurationSeconds) is accessed via ref inside,
  // so initialDurationSeconds doesn't strictly need to be here for *this* effect,
  // but including initialRemainingTimeMs covers cases where that dictates the start.

  // Helper function to format time
  const formatTime = (milliseconds: number) => {
    const totalSecondsRemaining = Math.max(0, Math.ceil(milliseconds / 1000)) // Ensure non-negative
    const minutes = Math.floor(totalSecondsRemaining / 60)
    const seconds = totalSecondsRemaining % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  // Function to stop the timer and reset state
  const stopTimer = useCallback(
    (finishedNaturally: boolean) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      // Only reset if it's actually running
      if (isRunning) {
        setIsRunning(false)
        // setFillPercentage(0)
        // Reset to the configured initial duration, not the potentially partial duration of the last run
        setTimeRemaining(configDurationRef.current)
        // Reset the auto-start attempted flag ONLY if the timer finished naturally
        // This allows auto-start to work again on the next mount/prop change
        // If stopped manually (e.g., via OnSessionEnd), autoStart shouldn't immediately restart.
        // *Correction*: Resetting based on finishedNaturally might be complex.
        // Let the autoStart effect handle its own logic with the ref.
        // autoStartAttemptedRef.current = false; // Resetting here might be wrong.

        // Only call finish callback if it finished naturally by reaching 0
        if (finishedNaturally) {
          onTimerFinishRef.current()
        }
        // else {
        // Potentially call a different callback if stopped manually?
        // e.g., if (OnSessionEnd) OnSessionEnd();
        // }
      }
    },
    [isRunning],
  ) // Added isRunning dependency

  // Main timer effect
  useEffect(() => {
    if (isRunning) {
      // If starting from a click (not auto-start), startTimeRef might need reset here.
      // However, auto-start effect and handleClick now set startTimeRef.current.

      // Duration for calculation should be the duration of THIS run.
      const runDuration = currentRunDurationRef.current
      // Calculate elapsed time based on when this run actually started.
      const initialElapsed =
        initialRemainingTimeMs !== undefined &&
        runDuration !== configDurationRef.current
          ? configDurationRef.current - runDuration
          : 0

      intervalRef.current = setInterval(() => {
        const now = Date.now()
        // Elapsed time since *this specific run started*
        const elapsedTimeSinceRunStart = now - startTimeRef.current
        // Total effective elapsed time considering potential initial offset
        const totalElapsedTime = initialElapsed + elapsedTimeSinceRunStart

        // Remaining time based on the *original configured duration*
        const currentRemaining = Math.max(
          0,
          configDurationRef.current - totalElapsedTime,
        )
        // Percentage based on the *original configured duration*
        const percentage = Math.min(
          100,
          (totalElapsedTime / configDurationRef.current) * 100,
        )

        setTimeRemaining(currentRemaining)
        setFillPercentage(percentage)
        onTimerTickRef.current(currentRemaining, percentage)

        if (currentRemaining <= 0) {
          stopTimer(true) // Pass true indicating it finished naturally
        }
      }, 100) // Update interval
    } else {
      // Ensure interval is cleared if isRunning becomes false for any reason
      stopTimer(false) // Pass false indicating it didn't finish naturally (e.g., manual stop, prop change)
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, stopTimer, initialRemainingTimeMs]) // Re-run effect if isRunning changes or stopTimer changes or initial time changes

  // Handler for the button click (manual start)
  const handleClick = () => {
    if (!isRunning) {
      const durationMs = configDurationRef.current // Use the ref
      if (isNaN(durationMs) || durationMs <= 0) {
        console.error(
          'Manual Start Error: Invalid duration specified:',
          durationMs,
        )
        return
      }
      // Reset time/fill and set duration for this run
      setTimeRemaining(durationMs)
      setFillPercentage(0)
      currentRunDurationRef.current = durationMs // Full duration for manual start
      startTimeRef.current = Date.now() // Set start time for this run
      autoStartAttemptedRef.current = true // If manually started, consider auto-start "attempted"

      setIsRunning(true)
      onTimerStartRef.current() // Call start callback via ref
    }
    // If clicked while running, you might want to call OnSessionEnd or stopTimer(false)
    // else if (OnSessionEnd) {
    //   OnSessionEnd(); // Example: Use OnSessionEnd for manual stop
    //   stopTimer(false);
    // }
  }

  // Determine onClick handler based on autoStart prop
  // If autoStart is enabled, the button might be intended for stopping, not starting.
  // The current `disabled={isRunning}` prevents clicking while running.
  // If you want the button to *stop* the timer when autoStart is true, change the handler logic.
  const effectiveOnClick = autoStart ? OnSessionEnd : handleClick // Example: Use OnSessionEnd if autoStart is true

  const buttonStyle = {
    '--fill-percentage': `${fillPercentage}%`,
    '--fill-color': fillColor,
    '--base-color': baseColor,
    '--text-color': isRunning ? textColor : textColor, // Or use disabledTextColor when appropriate?
    '--disabled-text-color': disabledTextColor,
    cursor: isRunning ? 'not-allowed' : 'pointer', // Add cursor style
  } as React.CSSProperties

  return (
    <button
      className="timer-button"
      onClick={effectiveOnClick} // Use the determined handler
      disabled={isRunning} // Keep disabled while running
      style={buttonStyle}
    >
      <span>
        {isRunning
          ? `${runningTextPrefix} ${formatTime(timeRemaining)}`
          : initialText}
      </span>
    </button>
  )
}

export default TimerButton
