import useAPI from '@hooks/useApi'


const useRequestHeader = () => {
  const [StoredTokens] = useAPI() // custom hook to call the API
  const RequestHeader = {
    'ngrok-skip-browser-warning': true,
    Authorization: `Bearer ${StoredTokens.accessToken}`,
  }
  return {
    RequestHeader
  }
}

export default useRequestHeader   
