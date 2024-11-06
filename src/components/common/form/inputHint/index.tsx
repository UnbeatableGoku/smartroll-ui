import React from 'react'

interface InputHintProps {
  error?: string
  hintText?: string
}

const InputHint: React.FC<InputHintProps> = ({ error, hintText }) => {
  if (!error && !hintText) return null

  return (
    <div className="mt-1">
      {error ? (
        <p className="text-error text-xs">{error}</p>
      ) : (
        hintText && <p className="px-3 text-[11px] text-gray-500">{hintText}</p>
      )}
    </div>
  )
}

export default InputHint
