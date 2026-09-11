import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CandidateLayout from '../../components/layout/CandidateLayout'
import { useAuth } from '../../context/AuthContext.jsx'
import * as candidateApi from '../../api/candidate.api.js'

function CandidateDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dashboard, setDashboard] = useState(null)
  const [preparation, setPreparation] = useState(null)
  const [latestResult, setLatestResult] = useState(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError('')

      try {
        const [dashboardData, preparationData] = await Promise.all([
          candidateApi.getDashboard(),
          candidateApi.getPreparation(),
        ])

        if (cancelled) return

        setDashboard(dashboardData)
        setPreparation(preparationData)

        const latestCompleted = dashboardData.recentInterviews[0]
        if (latestCompleted) {
          const detail = await candidateApi.getResultDetail(latestCompleted.id)
          if (!cancelled) setLatestResult(detail)
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load your dashboard.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <CandidateLayout>
        <div className="flex h-64 items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#285b8f]/30 border-t-[#285b8f]" />
        </div>
      </CandidateLayout>
    )
  }

  if (error) {
    return (
      <CandidateLayout>
        <div className="border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          {error}
        </div>
      </CandidateLayout>
    )
  }

  const upcoming = dashboard.upcomingInterviews[0]
  const dimensionEntries = latestResult
    ? Object.entries(latestResult.dimensions)
    : []
  const topRecommendation = preparation?.topicScores?.length
    ? [...preparation.topicScores].sort((a, b) => a.score - b.score)[0]
    : null

  return (
    <CandidateLayout>

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-8">

        <p className="text-sm font-medium text-[#4b9bea]">
          Candidate Dashboard
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17324f] lg:text-3xl">
          Good morning, {user?.firstName || 'Candidate'}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Here's an overview of your interview progress.
        </p>

      </div>


      {/* =====================================================
          STAT CARDS
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Upcoming Interviews"
          value={String(dashboard.stats.upcomingInterviews)}
          description="Scheduled interviews"
          icon={<CalendarIcon />}
        />

        <StatCard
          label="Completed"
          value={String(dashboard.stats.completedInterviews)}
          description="Interviews completed"
          icon={<CheckIcon />}
        />

        <StatCard
          label="Average Score"
          value={`${dashboard.stats.averageScore}%`}
          description={`${dashboard.stats.totalInterviews} total interviews`}
          icon={<ChartIcon />}
        />

        <StatCard
          label="Preparation"
          value={`${preparation?.overallProgress ?? 0}%`}
          description="Overall progress"
          icon={<BookIcon />}
        />

      </div>


      {/* =====================================================
          MAIN GRID
      ====================================================== */}

      <div className="mt-6 grid gap-6 xl:grid-cols-3">

        {/* Upcoming Interview */}

        <div className="xl:col-span-2">

          <SectionHeader
            title="Upcoming Interview"
            action="View all"
            onAction={() => navigate('/candidate/interviews')}
          />

          {upcoming ? (
            <div className="border border-slate-200 bg-white">

              <div className="p-6">

                <div className="flex flex-col justify-between gap-5 sm:flex-row">

                  <div>

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center bg-[#e7f2ff] text-[#285b8f]">
                        <CodeIcon />
                      </div>

                      <div>

                        <h3 className="font-semibold text-slate-800">
                          {upcoming.title}
                        </h3>

                      </div>

                    </div>


                    <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-500">

                      <span className="flex items-center gap-2">
                        <CalendarIcon />
                        {candidateApi.formatDate(upcoming.scheduledAt)}
                      </span>

                      <span className="flex items-center gap-2">
                        <ClockIcon />
                        {candidateApi.formatTime(upcoming.scheduledAt)}
                      </span>

                      <span className="flex items-center gap-2">
                        <TimerIcon />
                        {candidateApi.formatDuration(upcoming.duration)}
                      </span>

                    </div>

                  </div>


                  <div className="flex items-start">

                    <span className="bg-[#eaf5ff] px-3 py-1.5 text-xs font-semibold text-[#3972a7]">
                      {candidateApi.toInterviewStatusLabel(upcoming.status)}
                    </span>

                  </div>

                </div>


                <div className="mt-6 border-t border-slate-100 pt-5">

                  <div className="flex items-center justify-between">

                    <button
                      type="button"
                      onClick={() => navigate(`/candidate/interview/${upcoming.id}`)}
                      className="hidden bg-[#285b8f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#214d79] sm:block"
                    >
                      View Interview →
                    </button>

                  </div>

                </div>

              </div>

            </div>
          ) : (
            <EmptyState message="No upcoming interviews scheduled." />
          )}

        </div>


        {/* Preparation */}

        <div>

          <SectionHeader
            title="Preparation"
            action="Practice"
            onAction={() => navigate('/candidate/preparation')}
          />

          <div className="border border-slate-200 bg-white p-6">

            <p className="text-sm text-slate-500">
              Your preparation progress
            </p>

            <div className="mt-5 flex items-center gap-5">

              <div className="relative flex h-24 w-24 items-center justify-center">

                <svg
                  className="absolute h-24 w-24 -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#e5edf5"
                    strokeWidth="8"
                  />

                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#4b9bea"
                    strokeWidth="8"
                    strokeDasharray="264"
                    strokeDashoffset={264 - ((preparation?.overallProgress ?? 0) / 100) * 264}
                    strokeLinecap="round"
                  />
                </svg>

                <span className="text-xl font-bold text-[#17324f]">
                  {preparation?.overallProgress ?? 0}%
                </span>

              </div>


              <div className="flex-1 space-y-3">

                {(preparation?.topicScores ?? []).slice(0, 3).map((topic) => (
                  <ProgressItem
                    key={topic.topic}
                    label={topic.topic}
                    value={`${topic.score}%`}
                    progress={topic.score}
                  />
                ))}

                {(!preparation || preparation.topicScores.length === 0) && (
                  <p className="text-xs text-slate-400">
                    Complete an interview to see topic progress.
                  </p>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          PERFORMANCE
      ====================================================== */}

      <div className="mt-8">

        <SectionHeader
          title="Your Performance"
          action="View detailed results"
          onAction={() => navigate('/candidate/results')}
        />

        {dimensionEntries.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {dimensionEntries.map(([key, score]) => (
              <DimensionCard
                key={key}
                title={DIMENSION_LABELS[key] || key}
                score={`${score}%`}
                progress={score}
              />
            ))}

            <div className="flex items-center justify-center border border-dashed border-slate-300 bg-white p-5">

              <button
                type="button"
                onClick={() => navigate('/candidate/results')}
                className="text-sm font-semibold text-[#285b8f] hover:underline"
              >
                View full evaluation →
              </button>

            </div>

          </div>
        ) : (
          <EmptyState message="Complete an interview to see your performance breakdown." />
        )}

      </div>


      {/* =====================================================
          BOTTOM SECTION
      ====================================================== */}

      <div className="mt-8 grid gap-6 xl:grid-cols-2">

        {/* Recent Feedback */}

        <div>

          <SectionHeader
            title="Recent Feedback"
            action="View all"
            onAction={() => navigate('/candidate/results')}
          />

          {latestResult ? (
            <div className="border border-slate-200 bg-white p-6">

              <div className="flex gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#e7f2ff] text-[#3972a7]">
                  <MessageIcon />
                </div>

                <div>

                  <p className="text-sm leading-6 text-slate-600">
                    {latestResult.feedback}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() => navigate(`/candidate/results/${latestResult.interviewId}`)}
                className="mt-5 text-sm font-semibold text-[#285b8f] hover:underline"
              >
                View full feedback →
              </button>

            </div>
          ) : (
            <EmptyState message="Feedback will appear after your first completed interview." />
          )}

        </div>


        {/* Recommended */}

        <div>

          <SectionHeader
            title="Recommended for You"
            action="View preparation"
            onAction={() => navigate('/candidate/preparation')}
          />

          {topRecommendation ? (
            <div className="border border-slate-200 bg-white p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-[#4b9bea]">
                    Focus Area
                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-[#17324f]">
                    {topRecommendation.topic}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Improve your problem-solving performance.
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-2xl font-bold text-[#17324f]">
                    {topRecommendation.score}%
                  </p>

                  <p className="text-xs text-slate-400">
                    Current score
                  </p>

                </div>

              </div>

              <div className="mt-5 h-2 overflow-hidden bg-slate-100">

                <div
                  className="h-full bg-[#4b9bea]"
                  style={{ width: `${topRecommendation.score}%` }}
                />

              </div>

              <button
                type="button"
                onClick={() => navigate('/candidate/preparation')}
                className="mt-5 bg-[#eaf3fc] px-4 py-2.5 text-sm font-semibold text-[#285b8f] transition hover:bg-[#dcecff]"
              >
                Start Practice →

              </button>

            </div>
          ) : (
            <EmptyState message="Complete an interview to get a recommendation." />
          )}

        </div>

      </div>

    </CandidateLayout>
  )
}


const DIMENSION_LABELS = {
  algorithmCorrectness: 'Algorithmic Correctness',
  logicalReasoning: 'Reasoning & Approach',
  conceptCoverage: 'Concept Coverage',
  completeness: 'Completeness',
  dataStructure: 'Data Structures',
  complexity: 'Time & Space Complexity',
  edgeCases: 'Edge Cases',
}


/* ============================================================
   COMPONENTS
============================================================ */

function StatCard({ label, value, description, icon }) {
  return (
    <div className="border border-slate-200 bg-white p-5">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-medium text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-[#17324f]">
            {value}
          </p>

        </div>

        <div className="flex h-10 w-10 items-center justify-center bg-[#eaf3fc] text-[#3972a7]">
          {icon}
        </div>

      </div>

      <p className="mt-4 text-xs text-slate-400">
        {description}
      </p>

    </div>
  )
}


function SectionHeader({ title, action, onAction }) {
  return (
    <div className="mb-3 flex items-center justify-between">

      <h2 className="text-sm font-semibold text-slate-700">
        {title}
      </h2>

      <button
        type="button"
        onClick={onAction}
        className="text-xs font-medium text-[#3972a7] hover:underline"
      >
        {action} →
      </button>

    </div>
  )
}


function EmptyState({ message }) {
  return (
    <div className="border border-dashed border-slate-300 bg-white p-6 text-center text-xs text-slate-400">
      {message}
    </div>
  )
}


function DimensionCard({ title, score, progress }) {
  return (
    <div className="border border-slate-200 bg-white p-5">

      <div className="flex items-start justify-between gap-3">

        <p className="text-xs font-medium leading-5 text-slate-500">
          {title}
        </p>

        <span className="text-sm font-bold text-[#285b8f]">
          {score}
        </span>

      </div>

      <div className="mt-4 h-1.5 bg-slate-100">

        <div
          className="h-full bg-[#6fa9dc]"
          style={{ width: `${progress}%` }}
        />

      </div>

    </div>
  )
}


function ProgressItem({ label, value, progress }) {
  return (
    <div>

      <div className="mb-1 flex justify-between">

        <span className="text-[11px] text-slate-500">
          {label}
        </span>

        <span className="text-[11px] font-semibold text-slate-600">
          {value}
        </span>

      </div>

      <div className="h-1.5 bg-slate-100">

        <div
          className="h-full bg-[#6fa9dc]"
          style={{ width: `${progress}%` }}
        />

      </div>

    </div>
  )
}


/* ============================================================
   ICONS
============================================================ */

function CalendarIcon() {
  return (
    <svg
      className="h-4 w-4"
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

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 4-5 3 2 5-6" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 5a3 3 0 0 1 3-3h13v18H7a3 3 0 0 0-3 3V5Z" />
      <path d="M7 20h13" />
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

function ClockIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function TimerIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="13" r="8" />
      <path d="M12 5V2M9 2h6" />
      <path d="m12 9 3 4" />
    </svg>
  )
}

function MessageIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M20 11.5a8 8 0 0 1-8 8 8.6 8.6 0 0 1-3.4-.7L4 20l1.2-3.7A8 8 0 1 1 20 11.5Z" />
      <path d="M8 12h.01M12 12h.01M16 12h.01" />
    </svg>
  )
}

export default CandidateDashboard
