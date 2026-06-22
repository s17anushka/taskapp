import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../hooks/useTasks'
import TaskColumn from '../components/tasks/TaskColumn'
import TaskModal from '../components/tasks/TaskModal'
import Header from '../components/layout/Header'

const COLUMNS = [
  { status: 'TODO', label: 'To Do', color: 'bg-gray-100 text-gray-600' },
  { status: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100 text-blue-600' },
  { status: 'DONE', label: 'Done', color: 'bg-green-100 text-green-600' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [filters, setFilters] = useState({ sort: 'createdAt', order: 'desc' })
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks(filters)
  const [modal, setModal] = useState(null) // null | { mode: 'create' | 'edit', task?: Task }

  const tasksByStatus = (status) => tasks.filter((t) => t.status === status)

  const handleSave = async (payload) => {
    if (modal.mode === 'create') {
      await createTask(payload)
    } else {
      await updateTask(modal.task.id, payload)
    }
    setModal(null)
  }

  const handleStatusChange = async (task, newStatus) => {
    await updateTask(task.id, { status: newStatus })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onNewTask={() => setModal({ mode: 'create' })} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <select
            className="input w-auto text-sm"
            value={filters.priority || ''}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value || undefined })}
          >
            <option value="">All priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            className="input w-auto text-sm"
            value={`${filters.sort}:${filters.order}`}
            onChange={(e) => {
              const [sort, order] = e.target.value.split(':')
              setFilters({ ...filters, sort, order })
            }}
          >
            <option value="createdAt:desc">Newest first</option>
            <option value="createdAt:asc">Oldest first</option>
            <option value="dueDate:asc">Due date</option>
            <option value="priority:desc">Priority</option>
          </select>

          {loading && (
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <span className="w-3 h-3 border-2 border-brand-500 border-t-transparent rounded-full animate-spin inline-block" />
              Loading…
            </span>
          )}
          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>

        {/* Kanban board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((col) => (
            <TaskColumn
              key={col.status}
              column={col}
              tasks={tasksByStatus(col.status)}
              onEdit={(task) => setModal({ mode: 'edit', task })}
              onDelete={deleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </main>

      {modal && (
        <TaskModal
          mode={modal.mode}
          task={modal.task}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
