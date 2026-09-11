function InterviewRow({ interview, onClick }) {
  const formattedStatus = formatStatus(interview.status)

  const statusClass =
    interview.status === 'COMPLETED'
      ? 'bg-[#edf7f1] text-[#3d8a60]'
      : interview.status === 'IN_PROGRESS'
        ? 'bg-[#fff7e8] text-[#a06b19]'
        : interview.status === 'CANCELLED'
          ? 'bg-[#fdf0f0] text-[#b64b4b]'
          : interview.status === 'EXPIRED'
            ? 'bg-slate-100 text-slate-500'
            : 'bg-[#edf5fc] text-[#3972a7]'

  const scheduledDate = new Date(interview.scheduledAt)

  const date = scheduledDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const time = scheduledDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <button
      type="button"
      onClick={onClick}
      className="grid w-full grid-cols-[1.5fr_1.2fr_1.2fr_1fr_0.7fr_0.9fr_40px] items-center border-b border-slate-100 px-5 py-4 text-left transition hover:bg-slate-50"
    >

      {/* CANDIDATE */}

      <div className="flex min-w-0 items-center gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#eaf3fc] text-[10px] font-semibold text-[#3972a7]">
          {interview.candidate?.initials || '--'}
        </div>

        <div className="min-w-0">

          <p className="truncate text-xs font-semibold text-slate-700">
            {interview.candidate?.name || 'Unknown Candidate'}
          </p>

          <p className="mt-1 truncate text-[10px] text-slate-400">
            {interview.candidate?.email || 'No email available'}
          </p>

        </div>

      </div>


      {/* INTERVIEW */}

      <div className="min-w-0 pr-4">

        <p className="truncate text-xs font-medium text-slate-600">
          {interview.title}
        </p>

        <p className="mt-1 truncate text-[9px] text-slate-400">
          {interview.type}
        </p>

      </div>


      {/* COMPANY / FOCUS */}

      <div className="min-w-0 pr-4">

        <p className="truncate text-xs font-medium text-slate-600">
          {interview.company || 'No Company'}
        </p>

        <p className="mt-1 truncate text-[9px] text-slate-400">
          {interview.focusAreas?.join(', ') || 'General Interview'}
        </p>

      </div>


      {/* SCHEDULE */}

      <div>

        <p className="text-xs font-medium text-slate-600">
          {date}
        </p>

        <p className="mt-1 text-[9px] text-slate-400">
          {time}
        </p>

        <p className="mt-0.5 text-[9px] text-slate-400">
          {interview.duration} mins
        </p>

      </div>


      {/* SCORE */}

      <div>

        {interview.score !== null &&
        interview.score !== undefined ? (
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


      {/* STATUS */}

      <div>

        <span
          className={`inline-block px-2 py-1 text-[9px] font-semibold ${statusClass}`}
        >
          {formattedStatus}
        </span>

      </div>


      {/* ARROW */}

      <div className="flex justify-end text-slate-300">

        <ArrowIcon />

      </div>

    </button>
  )
}


function formatStatus(status) {
  return status
    .toLowerCase()
    .split('_')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(' ')
}


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