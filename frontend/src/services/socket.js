import { io } from 'socket.io-client'

let socket = null

export const getSocket = () => socket

export const connectSocket = (token) => {
  if (socket?.connected) return socket

  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000', {
    auth: { token },
    transports: ['websocket'],
  })

  socket.on('connect', () => console.log('🔌 Socket connected'))
  socket.on('connect_error', (err) => console.error('Socket error:', err.message))

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
