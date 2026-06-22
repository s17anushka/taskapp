import { useAuth } from '../../context/AuthContext'

export default function Header({ user, onNewTask }) {
  const { logout } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900">TaskApp</span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onNewTask} className="btn-primary text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New task
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="w-7 h-7 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-xs font-semibold text-brand-600">
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <span className="text-sm text-gray-600 hidden sm:block">{user?.name}</span>
            <button onClick={logout} className="text-sm text-gray-400 hover:text-gray-600 transition-colors ml-1">
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
