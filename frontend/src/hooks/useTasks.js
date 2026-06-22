import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { getSocket } from '../services/socket'

export const useTasks = (filters = {}) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Build query string from filters
  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filters.status) params.set('status', filters.status)
      if (filters.priority) params.set('priority', filters.priority)
      if (filters.sort) params.set('sort', filters.sort)
      if (filters.order) params.set('order', filters.order)
      const { data } = await api.get(`/tasks?${params}`)
      setTasks(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [filters.status, filters.priority, filters.sort, filters.order])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  // Real-time updates via Socket.io
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const onCreated = (task) => setTasks((prev) => [task, ...prev])
    const onUpdated = (task) => setTasks((prev) => prev.map((t) => t.id === task.id ? task : t))
    const onDeleted = ({ id }) => setTasks((prev) => prev.filter((t) => t.id !== id))

    socket.on('task:created', onCreated)
    socket.on('task:updated', onUpdated)
    socket.on('task:deleted', onDeleted)

    return () => {
      socket.off('task:created', onCreated)
      socket.off('task:updated', onUpdated)
      socket.off('task:deleted', onDeleted)
    }
  }, [])

  const createTask = useCallback(async (payload) => {
    const { data } = await api.post('/tasks', payload)
    return data
  }, [])

  const updateTask = useCallback(async (id, payload) => {
    const { data } = await api.put(`/tasks/${id}`, payload)
    return data
  }, [])

  const deleteTask = useCallback(async (id) => {
    await api.delete(`/tasks/${id}`)
  }, [])

  return { tasks, loading, error, createTask, updateTask, deleteTask, refetch: fetchTasks }
}
