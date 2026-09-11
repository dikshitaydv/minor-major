import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CandidateLayout from '../../components/layout/CandidateLayout'
import * as candidateApi from '../../api/candidate.api.js'

const DIMENSION_META = {
  algorithmCorrectness: {
    name: 'Algorithmic Correctness',
    description: 'Correctness and completeness of the algorithm.',
  },
  logicalReasoning: {
    name: 'Reasoning & Approach',
    description: 'Quality and clarity of the proposed solution.',
  },
  conceptCoverage: {
    name: 'Concept Coverage',
    description: 'Breadth of relevant concepts covered while explaining.',
  },
  completeness: {
    name: 'Completeness',
    description: 'How much of the interview was worked through.',
  },
  dataStructure: {
    name: 'Data Structure Selection',
    description: 'Appropriateness of the selected data structures.',
  },
  complexity: {
    name: 'Time & Space Complexity',
    description: 'Understanding and optimization of complexity.',
  },
  edgeCases: {
    name: 'Edge Case Handling',
    description: 'Ability to identify and handle edge cases.',
  },
}

const levelForScore = (score) => {
  if (score >= 80) return 'Strong'
  if (score >= 65) return 'Good'
  return 'Needs Practice'
}

function CandidateResults() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [results, setResults] = useState([])
  const [latestDetail, setLatestDetail] = useState(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError('')

      try {
        const resultsList = await candidateApi.listResults()
        if (cancelled) return
        setResults(resultsList)

        if (resultsList.length > 0) {
          const detail = await candidateApi.getResultDetail(resultsList[0].interviewId)
          if (!cancelled) setLatestDetail(detail)
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load your results.')
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

  if (results.length === 0) {
    return (
      <CandidateLayout>
        <div className="mb-8">
          <p className="text-sm font-medium text-[#4b9bea]">Performance</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17324f] lg:text-3xl">
            Interview Results
          </h1>
        </div>

        <div className="border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h3 className="text-sm font-semibold text-slate-700">
            No results yet
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Complete an interview to see your results here.
          </p>
          <button
            type="button"
            onClick={() => navigate('/candidate/interviews')}
            className="mt-5 bg-[#285b8f] px-5 py-2.5 text-sm font-semibold text-white"
          >
            View Interviews →
          </button>
        </div>
      </CandidateLayout>
    )
  }

  const dimensionEntries = latestDetail
    ? Object.entries(latestDetail.dimensions)
    : []

  const strongest = dimensionEntries.length
    ? dimensionEntries.reduce((a, b) => (b[1] > a[1] ? b : a))
    : null

  const weakest = dimensionEntries.length
    ? dimensionEntries.reduce((a, b) => (b[1] < a[1] ? b : a))
    : null

  const previousScores = results.slice(1).map((r) => r.overallScore)
  const previousAverage = previousScores.length
    ? Math.round(previousScores.reduce((a, b) => a + b, 0) / previousScores.length)
    : null

  return (
    <CandidateLayout>

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">

        <div>

          <p className="text-sm font-medium text-[#4b9bea]">
            Performance
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17324f] lg:text-3xl">
            Interview Results
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track your performance and understand where you can improve.
          </p>

        </div>

        <button
          type="button"
          onClick={() => navigate('/candidate/preparation')}
          className="w-fit bg-[#285b8f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#214d79]"
        >
          Improve Your Skills →
        </button>

      </div>


      {/* =====================================================
          OVERALL PERFORMANCE
      ====================================================== */}

      <div className="grid gap-6 xl:grid-cols-3">

        {/* Overall Score */}

        <div className="border border-slate-200 bg-white p-7">

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Overall Performance
          </p>

          <div className="mt-6 flex items-center gap-6">

            <ScoreCircle score={results[0].overallScore} />

            <div>

              <p className="text-xl font-bold text-[#17324f]">
                {levelForScore(results[0].overallScore)} Performance
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Based on your most recent completed interview.
              </p>

            </div>

          </div>

          <div className="mt-7 border-t border-slate-100 pt-5">

            {previousAverage !== null ? (
              <>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Previous average</span>
                  <span className="font-semibold text-slate-600">{previousAverage}%</span>
                </div>

                <div className="mt-2 flex justify-between text-xs">
                  <span className="text-slate-400">Current score</span>
                  <span className="font-semibold text-[#3972a7]">
                    {results[0].overallScore}%
                    {results[0].overallScore >= previousAverage ? ' ↑' : ' ↓'}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-400">
                Complete more interviews to see a trend.
              </p>
            )}

          </div>

        </div>


        {/* Strength */}

        <div className="border border-slate-200 bg-white p-7">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center bg-[#edf7f1] text-[#3d8a60]">
              <StrengthIcon />
            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Strongest Area
              </p>

              <h3 className="mt-1 text-lg font-bold text-[#17324f]">
                {strongest ? DIMENSION_META[strongest[0]]?.name || strongest[0] : '—'}
              </h3>

            </div>

          </div>

          <p className="mt-6 text-3xl font-bold text-[#3d8a60]">
            {strongest ? `${strongest[1]}%` : '—'}
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {strongest ? DIMENSION_META[strongest[0]]?.description : ''}
          </p>

          <div className="mt-5 h-1.5 bg-slate-100">

            <div
              className="h-full bg-[#6aa982]"
              style={{ width: `${strongest ? strongest[1] : 0}%` }}
            />

          </div>

        </div>


        {/* Improvement */}

        <div className="border border-slate-200 bg-white p-7">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center bg-[#fff5e8] text-[#b77a2d]">
              <ImproveIcon />
            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Focus Area
              </p>

              <h3 className="mt-1 text-lg font-bold text-[#17324f]">
                {weakest ? DIMENSION_META[weakest[0]]?.name || weakest[0] : '—'}
              </h3>

            </div>

          </div>

          <p className="mt-6 text-3xl font-bold text-[#b77a2d]">
            {weakest ? `${weakest[1]}%` : '—'}
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {weakest ? DIMENSION_META[weakest[0]]?.description : ''}
          </p>

          <div className="mt-5 h-1.5 bg-slate-100">

            <div
              className="h-full bg-[#d29a50]"
              style={{ width: `${weakest ? weakest[1] : 0}%` }}
            />

          </div>

        </div>

      </div>


      {/* =====================================================
          7 DIMENSIONS
      ====================================================== */}

      <div className="mt-8">

        <div className="mb-4">

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Evaluation Breakdown
          </p>

          <h2 className="mt-1 text-lg font-bold text-[#17324f]">
            Your 7-Dimension Performance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            From your most recent completed interview.
          </p>

        </div>


        <div className="border border-slate-200 bg-white">

          {dimensionEntries.map(([key, score], index) => (

            <DimensionRow
              key={key}
              dimension={{
                name: DIMENSION_META[key]?.name || key,
                description: DIMENSION_META[key]?.description || '',
                score,
              }}
              index={index}
            />

          ))}

        </div>

      </div>


      {/* =====================================================
          RECENT RESULTS
      ====================================================== */}

      <div className="mt-8">

        <div className="mb-4 flex items-end justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              History
            </p>

            <h2 className="mt-1 text-lg font-bold text-[#17324f]">
              Recent Interview Results
            </h2>

          </div>

          <button
            type="button"
            onClick={() => navigate('/candidate/interviews')}
            className="text-xs font-semibold text-[#3972a7] hover:underline"
          >
            View all interviews →
          </button>

        </div>


        <div className="border border-slate-200 bg-white">

          {results.map((result) => (

            <div
              key={result.interviewId}
              className="flex flex-col gap-4 border-b border-slate-100 p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center bg-[#eaf3fc] text-[#3972a7]">
                  <CodeIcon />
                </div>

                <div>

                  <h3 className="text-sm font-semibold text-slate-700">
                    {result.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    {candidateApi.formatDate(result.completedAt)}
                  </p>

                </div>

              </div>


              <div className="flex items-center gap-6">

                <div className="text-right">

                  <p className="text-xs text-slate-400">
                    Result
                  </p>

                  <p className="text-sm font-semibold text-slate-600">
                    {levelForScore(result.overallScore)}
                  </p>

                </div>


                <div className="text-right">

                  <p className="text-xs text-slate-400">
                    Score
                  </p>

                  <p className="text-lg font-bold text-[#285b8f]">
                    {result.overallScore}%
                  </p>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    navigate(`/candidate/results/${result.interviewId}`)
                  }
                  className="border border-slate-200 px-4 py-2 text-xs font-semibold text-[#285b8f] transition hover:bg-slate-50"
                >
                  Details
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>


      {/* =====================================================
          INSIGHT
      ====================================================== */}

      {latestDetail && (
        <div className="mt-8 border border-[#c9dff3] bg-[#eaf4ff] p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-white text-[#3972a7]">
              <InsightIcon />
            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-[#3972a7]">
                AI Performance Insight
              </p>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#58728d]">
                {latestDetail.feedback}
              </p>

              <button
                type="button"
                onClick={() => navigate('/candidate/preparation')}
                className="mt-4 text-sm font-semibold text-[#285b8f] hover:underline"
              >
                Practice this area →
              </button>

            </div>

          </div>

        </div>
      )}

    </CandidateLayout>
  )
}


/* ============================================================
   SCORE CIRCLE
============================================================ */

function ScoreCircle({ score }) {
  const circumference = 2 * Math.PI * 42
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative h-28 w-28 shrink-0">

      <svg
        className="h-full w-full -rotate-90"
        viewBox="0 0 100 100"
      >

        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="#e5edf5"
          strokeWidth="7"
        />

        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="#4b9bea"
          strokeWidth="7"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />

      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">

        <span className="text-2xl font-bold text-[#17324f]">
          {score}
        </span>

        <span className="text-[9px] uppercase tracking-wider text-slate-400">
          Score
        </span>

      </div>

    </div>
  )
}


/* ============================================================
   DIMENSION ROW
============================================================ */

function DimensionRow({ dimension, index }) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-100 p-5 last:border-b-0 md:flex-row md:items-center">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#eaf3fc] text-xs font-bold text-[#3972a7]">
        {String(index + 1).padStart(2, '0')}
      </div>


      <div className="w-full md:w-64">

        <h3 className="text-sm font-semibold text-slate-700">
          {dimension.name}
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          {dimension.description}
        </p>

      </div>


      <div className="flex-1">

        <div className="h-2 bg-slate-100">

          <div
            className="h-full bg-[#6fa9dc]"
            style={{ width: `${dimension.score}%` }}
          />

        </div>

      </div>


      <div className="w-12 text-right">

        <span className="text-sm font-bold text-[#285b8f]">
          {dimension.score}%
        </span>

      </div>

    </div>
  )
}


/* ============================================================
   ICONS
============================================================ */

function StrengthIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 3v18" />
      <path d="m5 10 7-7 7 7" />
      <path d="M5 21h14" />
    </svg>
  )
}


function ImproveIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 20V4" />
      <path d="m5 11 7-7 7 7" />
    </svg>
  )
}


function InsightIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <circle cx="12" cy="7" r=".5" fill="currentColor" />
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


export default CandidateResults
