import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CandidateLayout from '../../components/layout/CandidateLayout'
import * as candidateApi from '../../api/candidate.api.js'

function CandidateInterviews() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [interviews, setInterviews] = useState([])

  useEffect(() => {
    let cancelled = false

    candidateApi
      .listInterviews()
      .then((data) => {
        if (cancelled) return

        setInterviews(
          data.map((interview) => ({
            id: interview.id,
            title: interview.title,
            type: interview.type,
            company: interview.company,
            date: candidateApi.formatDate(interview.scheduledAt),
            time: candidateApi.formatTime(interview.scheduledAt),
            duration: candidateApi.formatDuration(interview.duration),
            status: candidateApi.toInterviewStatusLabel(interview.status),
            score: interview.score,
            topics: interview.topics,
          })),
        )
      })
      .catch((err) => !cancelled && setError(err.message || 'Unable to load interviews.'))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [])

  const tabs = ['All', 'Upcoming', 'Completed', 'Expired']

  const filteredInterviews =
    activeTab === 'All'
      ? interviews
      : interviews.filter((interview) => interview.status === activeTab)

  const upcomingCount = interviews.filter(
    (interview) => interview.status === 'Upcoming'
  ).length

  const completedCount = interviews.filter(
    (interview) => interview.status === 'Completed'
  ).length

  return (
    <CandidateLayout>

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">

        <div>

          <p className="text-sm font-medium text-[#4b9bea]">
            Interview Workspace
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17324f] lg:text-3xl">
            My Interviews
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View and manage your upcoming and previous interviews.
          </p>

        </div>

        <button
          type="button"
          onClick={() => navigate('/candidate/preparation')}
          className="w-fit bg-[#285b8f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#214d79]"
        >
          Prepare for Interview →
        </button>

      </div>

      {error && (
        <div className="mb-6 border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#285b8f]/30 border-t-[#285b8f]" />
        </div>
      ) : (
        <>

          {/* =====================================================
              SUMMARY
          ====================================================== */}

          <div className="mb-6 grid gap-4 sm:grid-cols-3">

            <SummaryCard
              label="Total Interviews"
              value={interviews.length}
              description="All assigned interviews"
            />

            <SummaryCard
              label="Upcoming"
              value={upcomingCount}
              description="Interviews waiting for you"
            />

            <SummaryCard
              label="Completed"
              value={completedCount}
              description="Interviews you've finished"
            />

          </div>


          {/* =====================================================
              FILTERS
          ====================================================== */}

          <div className="mb-4 flex items-center justify-between border-b border-slate-200">

            <div className="flex gap-6">

              {tabs.map((tab) => (

                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-3 text-sm font-medium transition ${
                    activeTab === tab
                      ? 'text-[#285b8f]'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >

                  {tab}

                  {tab !== 'All' && (
                    <span
                      className={`ml-2 text-xs ${
                        activeTab === tab
                          ? 'text-[#4b9bea]'
                          : 'text-slate-400'
                      }`}
                    >
                      {
                        interviews.filter(
                          (interview) => interview.status === tab
                        ).length
                      }
                    </span>
                  )}

                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#285b8f]" />
                  )}

                </button>

              ))}

            </div>

          </div>


          {/* =====================================================
              INTERVIEW LIST
          ====================================================== */}

          <div className="space-y-3">

            {filteredInterviews.map((interview) => (

              <InterviewListItem
                key={interview.id}
                interview={interview}
                onOpen={() => {
                  if (interview.status === 'Upcoming') {
                    navigate(`/candidate/interview/${interview.id}`)
                  }

                  if (interview.status === 'Completed') {
                    navigate(`/candidate/results/${interview.id}`)
                  }
                }}
              />

            ))}

          </div>


          {/* =====================================================
              EMPTY STATE
          ====================================================== */}

          {filteredInterviews.length === 0 && (
            <div className="border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center bg-[#eaf3fc] text-[#3972a7]">
                <CalendarIcon />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-700">
                No interviews found
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                There are no interviews in this category.
              </p>

            </div>
          )}

        </>
      )}

    </CandidateLayout>
  )
}


/* ============================================================
   SUMMARY CARD
============================================================ */

function SummaryCard({ label, value, description }) {
  return (
    <div className="border border-slate-200 bg-white p-5">

      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-[#17324f]">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>

    </div>
  )
}


/* ============================================================
   INTERVIEW ITEM
============================================================ */

function InterviewListItem({ interview, onOpen }) {
  const isUpcoming = interview.status === 'Upcoming'
  const isCompleted = interview.status === 'Completed'
  const isExpired = interview.status === 'Expired'

  return (
    <div className="border border-slate-200 bg-white p-5 transition hover:border-[#b7d3ee]">

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}

        <div className="flex min-w-0 items-start gap-4">

          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center ${
              isUpcoming
                ? 'bg-[#e7f2ff] text-[#3972a7]'
                : isCompleted
                  ? 'bg-[#edf7f1] text-[#3d8a60]'
                  : 'bg-slate-100 text-slate-400'
            }`}
          >
            <CodeIcon />
          </div>


          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <h3 className="font-semibold text-slate-800">
                {interview.title}
              </h3>

              <StatusBadge status={interview.status} />

            </div>

            <p className="mt-1 text-xs text-slate-400">
              {interview.type}{interview.company ? ` · ${interview.company}` : ''}
            </p>


            <div className="mt-3 flex flex-wrap gap-2">

              {interview.topics.map((topic) => (

                <span
                  key={topic}
                  className="bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500"
                >
                  {topic}
                </span>

              ))}

            </div>

          </div>

        </div>


        {/* Middle */}

        <div className="flex shrink-0 flex-wrap gap-6 text-xs text-slate-500">

          <div>

            <p className="mb-1 text-[10px] uppercase tracking-wider text-slate-400">
              Date
            </p>

            <p className="font-medium text-slate-600">
              {interview.date}
            </p>

          </div>


          <div>

            <p className="mb-1 text-[10px] uppercase tracking-wider text-slate-400">
              Time
            </p>

            <p className="font-medium text-slate-600">
              {interview.time}
            </p>

          </div>


          <div>

            <p className="mb-1 text-[10px] uppercase tracking-wider text-slate-400">
              Duration
            </p>

            <p className="font-medium text-slate-600">
              {interview.duration}
            </p>

          </div>

        </div>


        {/* Right */}

        <div className="flex shrink-0 items-center gap-4">

          {isCompleted && (
            <div className="text-right">

              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Score
              </p>

              <p className="text-xl font-bold text-[#285b8f]">
                {interview.score}%
              </p>

            </div>
          )}


          {isUpcoming && (
            <button
              type="button"
              onClick={onOpen}
              className="bg-[#285b8f] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#214d79]"
            >
              View Interview
            </button>
          )}


          {isCompleted && (
            <button
              type="button"
              onClick={onOpen}
              className="border border-slate-200 px-4 py-2.5 text-xs font-semibold text-[#285b8f] transition hover:bg-slate-50"
            >
              View Results
            </button>
          )}


          {isExpired && (
            <button
              type="button"
              className="border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-400"
              disabled
            >
              Expired
            </button>
          )}

        </div>

      </div>

    </div>
  )
}


/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({ status }) {
  const styles = {
    Upcoming: 'bg-[#eaf5ff] text-[#3972a7]',
    Completed: 'bg-[#edf7f1] text-[#3d8a60]',
    Expired: 'bg-slate-100 text-slate-400',
  }

  return (
    <span
      className={`px-2 py-1 text-[10px] font-semibold ${
        styles[status]
      }`}
    >
      {status}
    </span>
  )
}


/* ============================================================
   ICONS
============================================================ */

function CalendarIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M7 2v4M17 2v4M3 10h18" />
    </svg>
  )
}


function CodeIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m8 9-4 3 4 3" />
      <path d="m16 9 4 3-4 3" />
      <path d="m14 5-4 14" />
    </svg>
  )
}


export default CandidateInterviews
