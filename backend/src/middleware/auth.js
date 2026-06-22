import jwt from 'jsonwebtoken'

// REST middleware
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// Socket.io middleware — token passed as handshake auth
export const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth?.token
  if (!token) return next(new Error('Authentication required'))

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    socket.user = payload
    next()
  } catch {
    next(new Error('Invalid token'))
  }
}
