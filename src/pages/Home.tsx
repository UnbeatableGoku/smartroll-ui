import { useSocketConnectionContext } from '@context/socket/context'

const Home = () => {
  const { socket, sendMessage, serverMsg } = useSocketConnectionContext()

  return (
    <div>
      Socket id : {socket?.id}
      <br></br>
      <button
        onClick={() => {
          sendMessage('Hello From Prathmesh Client')
        }}
      >
        <strong>Get Message From Backend</strong>
      </button>
      {serverMsg?.map((item, idex) => {
        return <p key={idex}>{item}</p>
      })}
    </div>
  )
}

export default Home
