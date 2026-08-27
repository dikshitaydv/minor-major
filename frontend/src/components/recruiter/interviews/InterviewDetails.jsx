function InterviewDetails({ interview, onClose }) {
  const isUpcoming = interview.status === 'Upcoming'
  const isProgress = interview.status === 'In Progress'
  const isCompleted = interview.status === 'Completed'

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#07111f]/30">

      <div className="flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">

        {/* Header */}

        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#3972a7]">
              Interview
            </p>

            <h2 className="mt-1 text-lg font-bold text-[#17324f]">
              {interview.id}
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

          {/* Candidate */}

          <div className="border-b border-slate-100 px-6 py-6">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center bg-[#eaf3fc] text-sm font-semibold text-[#3972a7]">
                {interview.initials}
              </div>

              <div>

                <h3 className="text-sm font-bold text-slate-700">
                  {interview.candidate}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  {interview.email}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {interview.job}
                </p>

              </div>

            </div>

          </div>


          {/* Status */}

          <div className="border-b border-slate-100 px-6 py-6">

            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Interview Status
            </p>

            <div className="mt-4 flex items-center gap-3">

              <span
                className={`h-2 w-2 ${
                  isCompleted
                    ? 'bg-[#3d8a60]'
                    : isProgress
                      ? 'bg-[#c88a28]'
                      : 'bg-[#3972a7]'
                }`}
              />

              <span className="text-sm font-semibold text-slate-700">
                {interview.status}
              </span>

            </div>

          </div>


          {/* Schedule */}

          <div className="border-b border-slate-100 px-6 py-6">

            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Schedule
            </p>

            <div className="mt-4 grid grid-cols-2 gap-5">

              <Info
                label="Date"
                value={interview.date}
              />

              <Info
                label="Time"
                value={interview.time}
              />

              <Info
                label="Duration"
                value={interview.duration}
              />

              <Info
                label="Interview ID"
                value={interview.id}
              />

            </div>

          </div>


          {/* Score */}

          {isCompleted && (
            <div className="border-b border-slate-100 px-6 py-6">

              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                AI Evaluation
              </p>

              <div className="mt-4 flex items-end gap-2">

                <span className="text-4xl font-bold text-[#17324f]">
                  {interview.score}
                </span>

                <span className="mb-1 text-sm text-slate-400">
                  / 100
                </span>

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Overall candidate performance
              </p>

            </div>
          )}


          {/* Upcoming Actions */}

          {isUpcoming && (
            <div className="px-6 py-6">

              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Candidate Interview Link
              </p>

              <div className="mt-3 flex border border-slate-200">

                <input
                  readOnly
                  value={`https://interviewai.app/interview/${interview.id}`}
                  className="min-w-0 flex-1 bg-slate-50 px-3 py-3 text-[10px] text-slate-500 outline-none"
                />

                <button
                  type="button"
                  className="border-l border-slate-200 px-4 text-[10px] font-semibold text-[#3972a7] hover:bg-slate-50"
                >
                  Copy
                </button>

              </div>

            </div>
          )}

        </div>


        {/* Footer */}

        <div className="flex shrink-0 gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

          {isCompleted && (
            <button
              type="button"
              className="flex-1 bg-[#285b8f] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#214d79]"
            >
              View Evaluation
            </button>
          )}

          {isUpcoming && (
            <>
              <button
                type="button"
                className="flex-1 border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-500 hover:bg-slate-50"
              >
                Reschedule
              </button>

              <button
                type="button"
                className="flex-1 bg-[#285b8f] px-4 py-3 text-xs font-semibold text-white hover:bg-[#214d79]"
              >
                Send Reminder
              </button>
            </>
          )}

          {isProgress && (
            <button
              type="button"
              className="flex-1 bg-[#285b8f] px-4 py-3 text-xs font-semibold text-white hover:bg-[#214d79]"
            >
              Open Interview
            </button>
          )}

        </div>

      </div>

    </div>
  )
}


function Info({ label, value }) {
  return (
    <div>

      <p className="text-[9px] uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-slate-600">
        {value}
      </p>

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


export default InterviewDetails