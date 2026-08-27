function CandidateDetails({ candidate, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#07111f]/30">

      <div className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">

        {/* Header */}

        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#3972a7]">
              Candidate Profile
            </p>

            <h2 className="mt-1 text-lg font-bold text-[#17324f]">
              {candidate.name}
            </h2>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
          >
            <CloseIcon />
          </button>

        </div>


        {/* Content */}

        <div className="min-h-0 flex-1 overflow-y-auto">

          {/* Profile */}

          <div className="border-b border-slate-100 px-6 py-6">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center bg-[#eaf3fc] text-sm font-semibold text-[#3972a7]">
                {candidate.initials}
              </div>

              <div>

                <h3 className="text-sm font-bold text-slate-700">
                  {candidate.name}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  {candidate.email}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {candidate.job}
                </p>

              </div>

            </div>

          </div>


          {/* Overall Score */}

          <div className="border-b border-slate-100 px-6 py-6">

            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              AI Interview Score
            </p>

            <div className="mt-4 flex items-end gap-2">

              <span className="text-4xl font-bold text-[#17324f]">
                {candidate.score}
              </span>

              <span className="mb-1 text-sm text-slate-400">
                / 100
              </span>

            </div>

            <div className="mt-4 h-2 w-full bg-slate-100">

              <div
                className="h-full bg-[#3972a7]"
                style={{
                  width: `${candidate.score}%`,
                }}
              />

            </div>

          </div>


          {/* Evaluation Dimensions */}

          <div className="px-6 py-6">

            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Evaluation Breakdown
            </p>

            <div className="mt-5 space-y-5">

              <ScoreRow
                label="Problem Understanding"
                score={94}
              />

              <ScoreRow
                label="Reasoning & Approach"
                score={91}
              />

              <ScoreRow
                label="Data Structure Selection"
                score={88}
              />

              <ScoreRow
                label="Algorithmic Correctness"
                score={95}
              />

              <ScoreRow
                label="Time & Space Complexity"
                score={84}
              />

              <ScoreRow
                label="Edge Case Handling"
                score={86}
              />

              <ScoreRow
                label="Follow-up Response"
                score={90}
              />

            </div>

          </div>


          {/* Actions */}

          <div className="border-t border-slate-100 px-6 py-6">

            <div className="flex gap-3">

              <button
                type="button"
                className="flex-1 bg-[#285b8f] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#214d79]"
              >
                View Full Evaluation
              </button>

              <button
                type="button"
                className="border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-50"
              >
                Download Report
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}


function ScoreRow({ label, score }) {
  return (
    <div>

      <div className="flex items-center justify-between">

        <span className="text-xs text-slate-600">
          {label}
        </span>

        <span className="text-xs font-semibold text-[#17324f]">
          {score}
        </span>

      </div>

      <div className="mt-2 h-1.5 bg-slate-100">

        <div
          className="h-full bg-[#78aeda]"
          style={{
            width: `${score}%`,
          }}
        />

      </div>

    </div>
  )
}


function CloseIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}


export default CandidateDetails