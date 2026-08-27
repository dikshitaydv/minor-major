function StatsOverview() {
  const stats = [
    {
      label: 'Total Candidates',
      value: '124',
      change: '+12%',
      description: 'vs last month',
      icon: CandidatesIcon,
    },
    {
      label: 'Active Jobs',
      value: '08',
      change: '+2',
      description: 'this month',
      icon: JobsIcon,
    },
    {
      label: 'Interviews',
      value: '46',
      change: '+18%',
      description: 'this month',
      icon: InterviewIcon,
    },
    {
      label: 'Average Score',
      value: '78%',
      change: '+6%',
      description: 'vs last month',
      icon: ScoreIcon,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <div
            key={stat.label}
            className="border border-slate-200 bg-white p-5"
          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {stat.label}
                </p>

                <p className="mt-3 text-2xl font-bold tracking-tight text-[#17324f]">
                  {stat.value}
                </p>

              </div>


              <div className="flex h-9 w-9 items-center justify-center bg-[#edf5fc] text-[#3972a7]">
                <Icon />
              </div>

            </div>


            <div className="mt-4 flex items-center gap-2">

              <span className="text-[10px] font-semibold text-[#3d8a60]">
                {stat.change}
              </span>

              <span className="text-[10px] text-slate-400">
                {stat.description}
              </span>

            </div>

          </div>
        )
      })}

    </div>
  )
}


function CandidatesIcon() {
  return (
    <svg
      className="h-4 w-4"
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


function JobsIcon() {
  return (
    <svg
      className="h-4 w-4"
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


function InterviewIcon() {
  return (
    <svg
      className="h-4 w-4"
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


function ScoreIcon() {
  return (
    <svg
      className="h-4 w-4"
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


export default StatsOverview