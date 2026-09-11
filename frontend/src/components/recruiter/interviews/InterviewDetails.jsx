import { useEffect, useState } from 'react'
import { getRecruiterInterviewById } from '../../../api/interview.api.js'


function InterviewDetails({ interviewId, onClose }) {
  const [interview, setInterview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!interviewId) return

    const fetchInterview = async () => {
      try {
        setLoading(true)
        setError(null)

        const data =
          await getRecruiterInterviewById(interviewId)

        setInterview(data)
      } catch (error) {
        console.error(
          'Fetch interview error:',
          error,
        )

        setError(
          error.message ||
            'Failed to fetch interview',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchInterview()
  }, [interviewId])

  const handleCopy = async () => {
    if (!interview) return

    const interviewLink =
      `${window.location.origin}/candidate/interviews/${interview.id}`

    try {
      await navigator.clipboard.writeText(interviewLink)

      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  // ─────────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────────

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-[#07111f]/40 backdrop-blur-[1px]">
        <div className="flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-[#3972a7]"
                aria-label="Go back"
              >
                <BackIcon />
              </button>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#3972a7]">
                  Interview Details
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Loading information
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              aria-label="Close"
            >
              <CloseIcon />
            </button>

          </div>

          <div className="flex flex-1 items-center justify-center">

            <div className="text-center">

              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-[#3972a7]" />

              <p className="mt-4 text-sm text-slate-500">
                Loading interview details...
              </p>

            </div>

          </div>

        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────
  // ERROR
  // ─────────────────────────────────────────────

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-[#07111f]/40 backdrop-blur-[1px]">

        <div className="flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-[#3972a7]"
              >
                <BackIcon />
              </button>

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#3972a7]">
                  Interview Details
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Unable to load interview
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center text-slate-400 transition hover:bg-red-50 hover:text-red-500"
            >
              <CloseIcon />
            </button>

          </div>

          <div className="flex flex-1 items-center justify-center px-8">

            <div className="max-w-sm text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center bg-red-50 text-red-500">
                <ErrorIcon />
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-700">
                Failed to load interview
              </p>

              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                {error}
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 bg-[#285b8f] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#214d79]"
              >
                Go Back
              </button>

            </div>

          </div>

        </div>

      </div>
    )
  }

  if (!interview) return null

  // ─────────────────────────────────────────────
  // FORMAT DATA
  // ─────────────────────────────────────────────

  const scheduledDate = new Date(interview.scheduledAt)

  const date = scheduledDate.toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  )

  const time = scheduledDate.toLocaleTimeString(
    'en-IN',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  )

  const statusMap = {
    SCHEDULED: 'Upcoming',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    EXPIRED: 'Expired',
    CANCELLED: 'Cancelled',
  }

  const displayStatus =
    statusMap[interview.status] || interview.status

  const isUpcoming =
    interview.status === 'SCHEDULED'

  const isProgress =
    interview.status === 'IN_PROGRESS'

  const isCompleted =
    interview.status === 'COMPLETED'

  const candidate = interview.candidate

  const candidateName = candidate
    ? `${candidate.firstName} ${candidate.lastName}`
    : 'Candidate'

  const initials = candidate
    ? `${candidate.firstName?.[0] || ''}${
        candidate.lastName?.[0] || ''
      }`.toUpperCase()
    : 'C'

  const score =
    interview.evaluation?.overallScore ?? null

  const statusColor =
    isCompleted
      ? 'bg-[#3d8a60]'
      : isProgress
        ? 'bg-[#c88a28]'
        : isUpcoming
          ? 'bg-[#3972a7]'
          : 'bg-slate-400'

  const interviewLink =
    `${window.location.origin}/candidate/interviews/${interview.id}`

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#07111f]/40 backdrop-blur-[1px]"
      onClick={onClose}
    >

      <div
        className="flex h-full w-full max-w-lg flex-col bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >

        {/* Header */}

        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4">

          <div className="flex min-w-0 items-center gap-3">

            {/* Back Button */}

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-[#3972a7]"
              aria-label="Go back"
            >
              <BackIcon />
            </button>

            <div className="min-w-0">

              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#3972a7]">
                Interview Details
              </p>

              <h2 className="mt-1 truncate text-base font-bold text-[#17324f]">
                {interview.title}
              </h2>

              <p className="mt-1 truncate text-[10px] text-slate-400">
                ID: {interview.id}
              </p>

            </div>

          </div>

          {/* Close Button */}

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center text-slate-400 transition hover:bg-red-50 hover:text-red-500"
            aria-label="Close"
          >
            <CloseIcon />
          </button>

        </div>

        {/* Content */}

        <div className="min-h-0 flex-1 overflow-y-auto">

          {/* Candidate */}

          <section className="border-b border-slate-100 px-6 py-6">

            <SectionLabel>
              Candidate
            </SectionLabel>

            <div className="mt-4 flex items-center gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-[#eaf3fc] text-sm font-bold text-[#3972a7]">
                {initials}
              </div>

              <div className="min-w-0">

                <h3 className="truncate text-sm font-bold text-slate-700">
                  {candidateName}
                </h3>

                <p className="mt-1 truncate text-xs text-slate-400">
                  {candidate?.email || 'No email available'}
                </p>

                <p className="mt-2 text-[10px] font-medium text-[#3972a7]">
                  {interview.type || 'Technical Interview'}
                </p>

              </div>

            </div>

          </section>

          {/* Status */}

          <section className="border-b border-slate-100 px-6 py-6">

            <SectionLabel>
              Interview Status
            </SectionLabel>

            <div className="mt-4 flex items-center gap-3">

              <span
                className={`h-2.5 w-2.5 rounded-full ${statusColor}`}
              />

              <span className="text-sm font-semibold text-slate-700">
                {displayStatus}
              </span>

            </div>

          </section>

          {/* Schedule */}

          <section className="border-b border-slate-100 px-6 py-6">

            <SectionLabel>
              Schedule
            </SectionLabel>

            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">

              <Info
                label="Date"
                value={date}
              />

              <Info
                label="Time"
                value={time}
              />

              <Info
                label="Duration"
                value={`${interview.duration} minutes`}
              />

              <Info
                label="Company"
                value={interview.company || 'Not specified'}
              />

            </div>

          </section>

          {/* Focus Areas */}

          {interview.focusAreas?.length > 0 && (
            <section className="border-b border-slate-100 px-6 py-6">

              <SectionLabel>
                Focus Areas
              </SectionLabel>

              <div className="mt-4 flex flex-wrap gap-2">

                {interview.focusAreas.map((area) => (
                  <span
                    key={area}
                    className="bg-[#edf5fc] px-3 py-1.5 text-[10px] font-semibold text-[#3972a7]"
                  >
                    {area}
                  </span>
                ))}

              </div>

            </section>
          )}

          {/* Questions */}

          {interview.questions?.length > 0 && (
            <section className="border-b border-slate-100 px-6 py-6">

              <div className="flex items-center justify-between">

                <SectionLabel>
                  Questions
                </SectionLabel>

                <span className="text-[10px] text-slate-400">
                  {interview.questions.length} assigned
                </span>

              </div>

              <div className="mt-4 space-y-2">

                {interview.questions.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 border border-slate-100 bg-slate-50 px-3 py-3"
                  >

                    <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-white text-[9px] font-bold text-[#3972a7]">
                      {index + 1}
                    </span>

                    <div className="min-w-0">

                      <p className="truncate text-xs font-medium text-slate-600">
                        {item.question?.title || 'Question'}
                      </p>

                      <p className="mt-1 text-[9px] text-slate-400">
                        {item.question?.difficulty}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

            </section>
          )}

          {/* AI Evaluation */}

          {isCompleted && (
            <section className="border-b border-slate-100 px-6 py-6">

              <SectionLabel>
                AI Evaluation
              </SectionLabel>

              <div className="mt-5 flex items-end gap-2">

                <span className="text-5xl font-bold tracking-tight text-[#17324f]">
                  {score ?? '—'}
                </span>

                <span className="mb-2 text-sm text-slate-400">
                  / 100
                </span>

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Overall candidate performance
              </p>

            </section>
          )}

          {/* Candidate Link */}

          {isUpcoming && (
            <section className="px-6 py-6">

              <SectionLabel>
                Candidate Interview Link
              </SectionLabel>

              <div className="mt-4 flex border border-slate-200">

                <input
                  readOnly
                  value={interviewLink}
                  className="min-w-0 flex-1 bg-slate-50 px-3 py-3 text-[10px] text-slate-500 outline-none"
                />

                <button
                  type="button"
                  onClick={handleCopy}
                  className="min-w-[72px] border-l border-slate-200 px-4 text-[10px] font-semibold text-[#3972a7] transition hover:bg-slate-50"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>

              </div>

            </section>
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
                className="flex-1 border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Reschedule
              </button>

              <button
                type="button"
                className="flex-1 bg-[#285b8f] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#214d79]"
              >
                Send Reminder
              </button>
            </>
          )}

          {isProgress && (
            <button
              type="button"
              className="flex-1 bg-[#285b8f] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#214d79]"
            >
              Open Interview
            </button>
          )}

          {!isCompleted && !isUpcoming && !isProgress && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Close
            </button>
          )}

        </div>

      </div>

    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </p>
  )
}

function Info({ label, value }) {
  return (
    <div>

      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 break-all text-xs font-semibold text-slate-600">
        {value}
      </p>

    </div>
  )
}

function BackIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
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

function ErrorIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </svg>
  )
}

export default InterviewDetails