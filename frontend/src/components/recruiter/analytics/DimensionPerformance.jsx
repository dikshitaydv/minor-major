function DimensionPerformance() {
  const dimensions = [
    {
      name: 'Problem Understanding',
      score: 84,
    },
    {
      name: 'Reasoning & Approach',
      score: 79,
    },
    {
      name: 'Data Structure Selection',
      score: 76,
    },
    {
      name: 'Algorithmic Correctness',
      score: 82,
    },
    {
      name: 'Time & Space Complexity',
      score: 71,
    },
    {
      name: 'Edge Case Handling',
      score: 68,
    },
    {
      name: 'Follow-up Response',
      score: 74,
    },
  ]

  return (
    <section className="border border-slate-200 bg-white">

      <div className="border-b border-slate-100 px-5 py-4">

        <h2 className="text-sm font-bold text-[#17324f]">
          Evaluation Dimensions
        </h2>

        <p className="mt-1 text-[10px] text-slate-400">
          Average candidate performance across the seven dimensions.
        </p>

      </div>


      <div className="p-5">

        <div className="space-y-5">

          {dimensions.map((dimension) => (
            <Dimension
              key={dimension.name}
              {...dimension}
            />
          ))}

        </div>

      </div>

    </section>
  )
}


function Dimension({ name, score }) {
  const scoreLabel =
    score >= 80
      ? 'Strong'
      : score >= 70
        ? 'Good'
        : 'Needs improvement'

  return (
    <div>

      <div className="flex items-center justify-between gap-4">

        <div className="min-w-0">

          <p className="truncate text-xs font-medium text-slate-600">
            {name}
          </p>

        </div>

        <div className="flex shrink-0 items-center gap-3">

          <span className="text-[9px] text-slate-400">
            {scoreLabel}
          </span>

          <span className="w-7 text-right text-xs font-bold text-[#17324f]">
            {score}
          </span>

        </div>

      </div>


      <div className="mt-2 h-1.5 bg-slate-100">

        <div
          className="h-full bg-[#6fa9dc]"
          style={{
            width: `${score}%`,
          }}
        />

      </div>

    </div>
  )
}


export default DimensionPerformance