function AnalyticsStats() {
  const stats = [
    {
      label: 'Interviews Completed',
      value: '146',
      change: '+18%',
      description: 'vs previous period',
    },
    {
      label: 'Average AI Score',
      value: '78.4',
      change: '+4.2%',
      description: 'vs previous period',
    },
    {
      label: 'Pass Rate',
      value: '64%',
      change: '+7%',
      description: 'vs previous period',
    },
    {
      label: 'Avg. Interview Time',
      value: '38m',
      change: '-6%',
      description: 'vs previous period',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {stats.map((stat) => (
        <div
          key={stat.label}
          className="border border-slate-200 bg-white p-5"
        >

          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {stat.label}
          </p>

          <div className="mt-3 flex items-end justify-between">

            <p className="text-2xl font-bold tracking-tight text-[#17324f]">
              {stat.value}
            </p>

            <span className="text-[10px] font-semibold text-[#3d8a60]">
              {stat.change}
            </span>

          </div>

          <p className="mt-2 text-[10px] text-slate-400">
            {stat.description}
          </p>

        </div>
      ))}

    </div>
  )
}

export default AnalyticsStats