import { useCallback, useEffect } from 'react'

interface Props {
  ref: { current: HTMLDivElement | null }
  callback: VoidFunction
}

const useClickOutsideAndEscape = ({ ref, callback }: Props) => {
  /**
   * To check if clicked on outside of element
   */
  const handleOutsideClick = useCallback(
    (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Element)) {
        callback()
      }
    },
    [ref],
  )

  /**
   * Handle Escape key event
   */
  const handleEscapeKeyPress = useCallback(
    (event: KeyboardEvent): void => {
      if (ref.current && event.keyCode === 27) {
        callback()
      }
    },
    [ref],
  )

  useEffect(() => {
    // Bind the event listener
    document.addEventListener('mousedown', handleOutsideClick)
    window.addEventListener('keydown', handleEscapeKeyPress)
    return () => {
      // Unbind the event listener on clean up
      window.removeEventListener('keydown', handleEscapeKeyPress)
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [ref])

  return null
}

export default useClickOutsideAndEscape
