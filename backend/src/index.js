import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/auth.js'
import taskRoutes from './routes/tasks.js'
import { authenticateSocket } from './middleware/auth.js'
import { errorHandler } from './middleware/error.js'

const app = express()
const httpServer = createServer(app)

// Socket.io setup
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
})

// Socket auth middleware
io.use(authenticateSocket)

io.on('connection', (socket) => {
  const userId = socket.user.id
  // Each user joins their own room for targeted updates
  socket.join(`user:${userId}`)
  console.log(`🔌 User ${userId} connected (socket ${socket.id})`)

  socket.on('disconnect', () => {
    console.log(`❌ User ${userId} disconnected`)
  })
})

// Express middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
})
app.use('/api', limiter)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// Error handler (must be last)
app.use(errorHandler)

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
