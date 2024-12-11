import useAPI from '@hooks/useApi'
import React from 'react'

const useRequestHeader = () => {
  const [StoredTokens, CallAPI] = useAPI() // custom hook to call the API
  const RequestHeader = {
    'ngrok-skip-browser-warning': true,
    Authorization: `Bearer ${StoredTokens.accessToken}`,
  }
  return {
    RequestHeader
  }
}

export default useRequestHeader   
