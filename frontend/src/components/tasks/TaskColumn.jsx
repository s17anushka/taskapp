import TaskCard from './TaskCard'

export default function TaskColumn({ column, tasks, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Column header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-700">{column.label}</h2>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${column.color}`}>
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Task cards */}
      <div className="flex flex-col gap-2 min-h-[120px]">
        {tasks.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center">
            <p className="text-sm text-gray-400">No tasks here</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.id)}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  )
}
