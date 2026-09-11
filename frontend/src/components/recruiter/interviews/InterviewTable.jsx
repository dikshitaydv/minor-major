import { useEffect, useState } from 'react'

import InterviewRow from './InterviewRow'
import { getRecruiterInterviews } from '../../../api/interview.api.js'

function InterviewTable({ onInterviewSelect }) {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ─────────────────────────────────────────────
  // FETCH INTERVIEWS FROM BACKEND
  // ─────────────────────────────────────────────

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true)
        setError(null)

        const interviews = await getRecruiterInterviews()

        const formattedInterviews = (interviews || []).map(
          (interview) => {
            const candidate = interview.candidate

            const candidateName = candidate?.name || (
              candidate
                ? `${candidate.firstName || ''} ${candidate.lastName || ''
                  }`.trim()
                : 'Candidate'
            )

            const initials = candidate
              ? candidate.initials || `${candidate.firstName?.[0] || ''}${candidate.lastName?.[0] || ''
                }`.toUpperCase()
              : 'C'

            return {
              ...interview,
              candidate: {
                ...candidate,
                name: candidateName,
                initials,
                email: candidate?.email || 'No email available',
              },
              score: interview.score ?? interview.evaluation?.overallScore ?? null,
            }
          },
        )

        setInterviews(formattedInterviews)
      } catch (error) {
        console.error(
          'Fetch interviews error:',
          error,
        )

        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchInterviews()
  }, [])


  // ─────────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────────

  if (loading) {
    return (
      <div className="border border-slate-200 bg-white">

        <div className="flex min-h-[300px] flex-col items-center justify-center">

          <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-[#3972a7]" />

          <p className="mt-4 text-xs text-slate-400">
            Loading interviews...
          </p>

        </div>

      </div>
    )
  }


  // ─────────────────────────────────────────────
  // ERROR
  // ─────────────────────────────────────────────

  if (error) {
    return (
      <div className="border border-slate-200 bg-white">

        <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

          <div className="flex h-12 w-12 items-center justify-center bg-red-50 text-red-500">

            <ErrorIcon />

          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Failed to load interviews
          </p>

          <p className="mt-2 max-w-sm text-xs text-slate-400">
            {error}
          </p>

        </div>

      </div>
    )
  }


  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────

  return (
    <div className="overflow-hidden border border-slate-200 bg-white">

      {/* Header */}

      <div className="hidden grid-cols-[1.6fr_1.4fr_1.3fr_1fr_0.7fr_0.9fr_40px] border-b border-slate-200 bg-slate-50 px-5 py-3 lg:grid">

        <Heading>
          Candidate
        </Heading>

        <Heading>
          Interview
        </Heading>

        <Heading>
          Details
        </Heading>

        <Heading>
          Schedule
        </Heading>

        <Heading>
          Score
        </Heading>

        <Heading>
          Status
        </Heading>

        <span />

      </div>


      {/* Rows */}

      {interviews.length > 0 ? (
        <div className="divide-y divide-slate-100">

          {interviews.map((interview) => (
            <InterviewRow
              key={interview.id}
              interview={interview}
              onClick={() =>
                onInterviewSelect(interview.id)
              }
            />
          ))}

        </div>
      ) : (
        <EmptyState />
      )}

    </div>
  )
}


/* ============================================================
   TABLE HEADING
============================================================ */

function Heading({ children }) {
  return (
    <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </span>
  )
}


/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">

      <div className="flex h-14 w-14 items-center justify-center bg-[#edf5fc] text-[#3972a7]">

        <InterviewIcon />

      </div>

      <h3 className="mt-5 text-sm font-semibold text-slate-700">
        No interviews found
      </h3>

      <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-400">
        You haven't created any interviews yet.
        Create an interview to start evaluating candidates.
      </p>

    </div>
  )
}


/* ============================================================
   INTERVIEW ICON
============================================================ */

function InterviewIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
      />

      <path d="M7 2v4M17 2v4M3 10h18" />

      <path d="M8 14h2M14 14h2M8 18h2" />
    </svg>
  )
}


/* ============================================================
   ERROR ICON
============================================================ */

function ErrorIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <path d="M12 8v5" />

      <path d="M12 16h.01" />
    </svg>
  )
}


export default InterviewTable