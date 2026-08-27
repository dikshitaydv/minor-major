function InterviewRow({ interview, onClick }) {
  const statusClass =
    interview.status === 'Completed'
      ? 'bg-[#edf7f1] text-[#3d8a60]'
      : interview.status === 'In Progress'
        ? 'bg-[#fff7e8] text-[#a06b19]'
        : 'bg-[#edf5fc] text-[#3972a7]'

  const modeClass =
    interview.mode === 'On-Campus'
      ? 'text-[#3972a7]'
      : 'text-slate-500'

  return (
    <button
      type="button"
      onClick={onClick}
      className="grid w-full grid-cols-[1.6fr_1.4fr_1.3fr_1fr_0.7fr_0.9fr_40px] items-center px-5 py-4 text-left transition hover:bg-slate-50"
    >

      {/* =====================================================
          CANDIDATE
      ====================================================== */}

      <div className="flex min-w-0 items-center gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#eaf3fc] text-[10px] font-semibold text-[#3972a7]">
          {interview.initials}
        </div>

        <div className="min-w-0">

          <p className="truncate text-xs font-semibold text-slate-700">
            {interview.candidate}
          </p>

          <p className="mt-1 truncate text-[10px] text-slate-400">
            {interview.email}
          </p>

        </div>

      </div>


      {/* =====================================================
          JOB
      ====================================================== */}

      <div className="min-w-0 pr-4">

        <p className="truncate text-xs text-slate-600">
          {interview.job}
        </p>

        <p className="mt-1 text-[9px] text-slate-400">
          {interview.id}
        </p>

      </div>


      {/* =====================================================
          COLLEGE
      ====================================================== */}

      <div className="min-w-0 pr-4">

        <p className="truncate text-xs font-medium text-slate-600">
          {interview.college || 'All Colleges'}
        </p>

        <p
          className={`mt-1 text-[9px] font-medium ${modeClass}`}
        >
          {interview.mode || 'General'}
        </p>

      </div>


      {/* =====================================================
          SCHEDULE
      ====================================================== */}

      <div>

        <p className="text-xs font-medium text-slate-600">
          {interview.date}
        </p>

        <p className="mt-1 text-[9px] text-slate-400">
          {interview.time}
        </p>

        <p className="mt-0.5 text-[9px] text-slate-400">
          {interview.duration}
        </p>

      </div>


      {/* =====================================================
          SCORE
      ====================================================== */}

      <div>

        {interview.score !== null ? (
          <div>

            <span className="text-sm font-bold text-[#17324f]">
              {interview.score}
            </span>

            <span className="text-[9px] text-slate-400">
              /100
            </span>

          </div>
        ) : (
          <span className="text-[10px] text-slate-400">
            —
          </span>
        )}

      </div>


      {/* =====================================================
          STATUS
      ====================================================== */}

      <div>

        <span
          className={`inline-block px-2 py-1 text-[9px] font-semibold ${statusClass}`}
        >
          {interview.status}
        </span>

      </div>


      {/* =====================================================
          ARROW
      ====================================================== */}

      <div className="flex justify-end text-slate-300">

        <ArrowIcon />

      </div>

    </button>
  )
}


/* ============================================================
   ARROW ICON
============================================================ */

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}


export default InterviewRow