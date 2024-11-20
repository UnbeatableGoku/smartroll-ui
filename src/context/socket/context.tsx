import React, { createContext, useContext, useEffect, useState } from 'react'

import { Socket, io } from 'socket.io-client'

interface SocketContextType {
  socket: Socket | null
  sendMessage: (message: string) => void
  serverMsg: string[]
}
interface Prathmesh {
  first: string
}
//Create Context
const SocketContext = createContext<SocketContextType | undefined>(undefined)

//Create Provider
export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [serverMsg, setServerMsg] = useState<string[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket'],
    })
    setSocket(newSocket)

    // Handle connection errors
    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err.message, err.stack, err.name)
    })

    newSocket.on('broadcast', (data: Prathmesh) => {
      

      setServerMsg((prev) => [...prev, data.first])
    })
    return () => {
      newSocket.close()
    }
  }, [])

  const sendMessage = (message: string) => {
    if (socket) {
      socket.emit('message', { content: message })
    }
  }

  return (
    <SocketContext.Provider value={{ socket, sendMessage, serverMsg }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketConnectionContext = () => {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error(
      'useSocketConnectionContext must be used within a SocketContextProvider',
    )
  }
  return context
}
