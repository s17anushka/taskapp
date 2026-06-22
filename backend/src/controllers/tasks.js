import prisma from '../config/prisma.js'
import { io } from '../index.js'

const emitToUser = (userId, event, data) => {
  io.to(`user:${userId}`).emit(event, data)
}

export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, sort = 'createdAt', order = 'desc' } = req.query
    const where = { userId: req.user.id }
    if (status) where.status = status
    if (priority) where.priority = priority

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { [sort]: order },
    })
    res.json(tasks)
  } catch (err) {
    next(err)
  }
}

export const getTask = async (req, res, next) => {
  try {
    const task = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    })
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.json(task)
  } catch (err) {
    next(err)
  }
}

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: req.user.id,
      },
    })
    emitToUser(req.user.id, 'task:created', task)
    res.status(201).json(task)
  } catch (err) {
    next(err)
  }
}

export const updateTask = async (req, res, next) => {
  try {
    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    })
    if (!existing) return res.status(404).json({ error: 'Task not found' })

    const { title, description, status, priority, dueDate } = req.body
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
    })
    emitToUser(req.user.id, 'task:updated', task)
    res.json(task)
  } catch (err) {
    next(err)
  }
}

export const deleteTask = async (req, res, next) => {
  try {
    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    })
    if (!existing) return res.status(404).json({ error: 'Task not found' })

    await prisma.task.delete({ where: { id: req.params.id } })
    emitToUser(req.user.id, 'task:deleted', { id: req.params.id })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
