import { useEffect, useState } from 'react'
import InterviewRow from './InterviewRow'
import CreateInterviewModal from './CreateInterviewModal'
import { getRecruiterInterviews } from '../../../api/interview.api.js'

function InterviewTable({ onInterviewSelect, onCreateInterview }) {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCreateInterview = () => {
    setIsCreateModalOpen(true)
    onCreateInterview?.()
  }

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true)
        setError(null)

        const interviews = await getRecruiterInterviews()
        setInterviews(interviews || [])
      } catch (error) {
        console.error('Fetch interviews error:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchInterviews()
  }, [refreshKey])

  return (
    <div>

      {/* =====================================================
          TOP SECTION
      ====================================================== */}

      <div className="mb-4 flex items-center justify-between">

        <div>

          <h2 className="text-lg font-bold text-[#17324f]">
            Interviews
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Manage and monitor candidate interviews
          </p>

        </div>

        <button
          type="button"
          onClick={handleCreateInterview}
          className="flex items-center gap-2 bg-[#285b8f] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#214d79]"
        >
          <PlusIcon />

          Create Interview
        </button>

      </div>


      {/* =====================================================
          TABLE
      ====================================================== */}

      <div className="overflow-hidden border border-slate-200 bg-white">

        {/* Header */}

        <div className="grid grid-cols-[1.6fr_1.4fr_1fr_0.9fr_0.7fr_40px] border-b border-slate-200 bg-slate-50 px-5 py-3">

          <Heading>
            Candidate
          </Heading>

          <Heading>
            Interview
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


        {/* Loading */}

        {loading && (
          <div className="flex items-center justify-center py-16">

            <div className="text-center">

              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-[#3972a7]" />

              <p className="mt-3 text-xs text-slate-400">
                Loading interviews...
              </p>

            </div>

          </div>
        )}


        {/* Error */}

        {!loading && error && (
          <div className="flex items-center justify-center py-16">

            <div className="text-center">

              <p className="text-sm font-semibold text-red-500">
                Failed to load interviews
              </p>

              <p className="mt-2 text-xs text-slate-400">
                {error}
              </p>

            </div>

          </div>
        )}


        {/* Empty State */}

        {!loading &&
          !error &&
          interviews.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">

              <EmptyIcon />

              <p className="mt-4 text-sm font-semibold text-slate-600">
                No interviews yet
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Create an interview to get started.
              </p>

              <button
                type="button"
                onClick={handleCreateInterview}
                className="mt-5 bg-[#285b8f] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#214d79]"
              >
                Create Interview
              </button>

            </div>
          )}


        {/* Rows */}

        {!loading &&
          !error &&
          interviews.length > 0 && (
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
          )}

      </div>

      {isCreateModalOpen && (
        <CreateInterviewModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => setRefreshKey((key) => key + 1)}
        />
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
   PLUS ICON
============================================================ */

function PlusIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}


/* ============================================================
   EMPTY ICON
============================================================ */

function EmptyIcon() {
  return (
    <svg
      className="h-10 w-10 text-slate-300"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="1"
      />

      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  )
}


export default InterviewTable