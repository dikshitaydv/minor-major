import { NavLink } from 'react-router-dom'

function CandidateSidebar() {
  const navigation = [
    {
      name: 'Dashboard',
      path: '/candidate/dashboard',
      icon: DashboardIcon,
    },
    {
      name: 'My Interviews',
      path: '/candidate/interviews',
      icon: InterviewIcon,
    },
    {
      name: 'Results',
      path: '/candidate/results',
      icon: ResultsIcon,
    },
    {
      name: 'Preparation',
      path: '/candidate/preparation',
      icon: PreparationIcon,
    },
  ]

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">

      {/* =====================================================
          LOGO
      ====================================================== */}

      <div className="flex h-20 shrink-0 items-center px-7">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173b63]">

            <div className="h-5 w-5 rounded-full border-[4px] border-white border-r-[#8fc5ff]" />

          </div>

          <div>

            <p className="font-bold tracking-tight text-[#173b63]">
              InterviewAI
            </p>

            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Candidate
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <nav className="flex-1 overflow-y-auto px-4 py-5">

        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        <div className="space-y-1">

          {navigation.map((item) => {

            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-[#eaf3fc] text-[#285b8f]'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`
                }
              >

                <Icon />

                <span>
                  {item.name}
                </span>

              </NavLink>
            )
          })}

        </div>

      </nav>


      {/* =====================================================
          PROFILE
      ====================================================== */}

      <div className="shrink-0 border-t border-slate-100 p-4">

        <button
          type="button"
          className="flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-slate-50"
        >

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dcecff] text-sm font-semibold text-[#285b8f]">
            A
          </div>

          <div className="min-w-0">

            <p className="truncate text-sm font-semibold text-slate-700">
              Candidate
            </p>

            <p className="truncate text-xs text-slate-400">
              View profile
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
      className="h-5 w-5 shrink-0"
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


function InterviewIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M7 2v4M17 2v4M3 10h18" />
      <path d="M8 14h2M14 14h2M8 18h2" />
    </svg>
  )
}


function ResultsIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M7 16l4-5 3 2 5-7" />
    </svg>
  )
}


function PreparationIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 5a3 3 0 0 1 3-3h13v18H7a3 3 0 0 0-3 3V5Z" />
      <path d="M7 20h13" />
      <path d="M8 6h8M8 10h8M8 14h5" />
    </svg>
  )
}


export default CandidateSidebar