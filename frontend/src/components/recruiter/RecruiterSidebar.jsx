import { NavLink } from 'react-router-dom'

function RecruiterSidebar() {
  const workspaceNavigation = [
    {
      name: 'Dashboard',
      path: '/recruiter/dashboard',
      icon: DashboardIcon,
    },
    {
      name: 'Jobs',
      path: '/recruiter/jobs',
      icon: JobsIcon,
    },
    {
      name: 'Candidates',
      path: '/recruiter/candidates',
      icon: CandidatesIcon,
    },
    {
      name: 'Interviews',
      path: '/recruiter/interviews',
      icon: InterviewIcon,
    },
    {
      name: 'Analytics',
      path: '/recruiter/analytics',
      icon: AnalyticsIcon,
    },
  ]

  const managementNavigation = [
    {
      name: 'Settings',
      path: '/recruiter/settings',
      icon: SettingsIcon,
    },
  ]

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">

      {/* Logo */}

      <div className="flex h-20 shrink-0 items-center px-7">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center bg-[#173b63]">

            <div className="h-5 w-5 rounded-full border-[4px] border-white border-r-[#8fc5ff]" />

          </div>

          <div>

            <p className="font-bold tracking-tight text-[#173b63]">
              InterviewAI
            </p>

            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Recruiter
            </p>

          </div>

        </div>

      </div>


      {/* Navigation */}

      <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-5">

        {/* Workspace */}

        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        <div className="space-y-1">

          {workspaceNavigation.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-[#edf5fc] text-[#285b8f]'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute bottom-2 left-0 top-2 w-0.5 bg-[#3972a7]" />
                    )}

                    <Icon />

                    {item.name}
                  </>
                )}
              </NavLink>
            )
          })}

        </div>


        {/* Management */}

        <p className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Management
        </p>

        <div className="space-y-1">

          {managementNavigation.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-[#edf5fc] text-[#285b8f]'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute bottom-2 left-0 top-2 w-0.5 bg-[#3972a7]" />
                    )}

                    <Icon />

                    {item.name}
                  </>
                )}
              </NavLink>
            )
          })}

        </div>

      </nav>


      {/* Recruiter Profile */}

      <div className="shrink-0 border-t border-slate-100 p-4">

        <button
          type="button"
          className="flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-slate-50"
        >

          <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#dcecff] text-sm font-semibold text-[#285b8f]">
            R
          </div>

          <div className="min-w-0">

            <p className="truncate text-sm font-semibold text-slate-700">
              Recruiter
            </p>

            <p className="truncate text-xs text-slate-400">
              Recruitment team
            </p>

          </div>

        </button>

      </div>

    </aside>
  )
}


/* ============================================================
   ICONS
============================================================ */

function DashboardIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  )
}


function JobsIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="6" width="18" height="14" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 11h18" />
      <path d="M10 11v2h4v-2" />
    </svg>
  )
}


function CandidatesIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 5a3 3 0 0 1 0 6" />
      <path d="M18 14c2 .8 3 2.8 3 6" />
    </svg>
  )
}


function InterviewIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="4" width="18" height="17" />
      <path d="M7 2v4M17 2v4M3 10h18" />
      <path d="M8 14h2M14 14h2M8 18h2" />
    </svg>
  )
}


function AnalyticsIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 3-4 3 2 5-6" />
    </svg>
  )
}


function SettingsIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.5V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H4v-2.5h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V4h2.5v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v2.5h-.2a1.7 1.7 0 0 0-1.6 1Z" />
    </svg>
  )
}


export default RecruiterSidebar