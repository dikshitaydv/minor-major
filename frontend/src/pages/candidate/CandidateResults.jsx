import { useNavigate } from 'react-router-dom'
import CandidateLayout from '../../components/layout/CandidateLayout'

function CandidateResults() {
  const navigate = useNavigate()

  const dimensions = [
    {
      name: 'Problem Understanding',
      score: 85,
      description: 'Ability to understand and clarify the problem.',
    },
    {
      name: 'Reasoning & Approach',
      score: 80,
      description: 'Quality and clarity of the proposed solution.',
    },
    {
      name: 'Data Structure Selection',
      score: 76,
      description: 'Appropriateness of the selected data structures.',
    },
    {
      name: 'Algorithmic Correctness',
      score: 88,
      description: 'Correctness and completeness of the algorithm.',
    },
    {
      name: 'Time & Space Complexity',
      score: 72,
      description: 'Understanding and optimization of complexity.',
    },
    {
      name: 'Edge Case Handling',
      score: 79,
      description: 'Ability to identify and handle edge cases.',
    },
    {
      name: 'Follow-up Response',
      score: 81,
      description: 'Quality of responses to adaptive follow-up questions.',
    },
  ]

  const recentResults = [
    {
      id: 'INT-003',
      title: 'Frontend Developer',
      date: 'Aug 24, 2026',
      score: 86,
      level: 'Strong',
    },
    {
      id: 'INT-004',
      title: 'Software Engineer',
      date: 'Aug 20, 2026',
      score: 78,
      level: 'Good',
    },
    {
      id: 'INT-005',
      title: 'Backend Developer',
      date: 'Aug 16, 2026',
      score: 82,
      level: 'Strong',
    },
  ]

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

            <ScoreCircle score={82} />

            <div>

              <p className="text-xl font-bold text-[#17324f]">
                Strong Performance
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                You're performing above average across most
                evaluation dimensions.
              </p>

            </div>

          </div>

          <div className="mt-7 border-t border-slate-100 pt-5">

            <div className="flex justify-between text-xs">

              <span className="text-slate-400">
                Previous average
              </span>

              <span className="font-semibold text-slate-600">
                76%
              </span>

            </div>

            <div className="mt-2 flex justify-between text-xs">

              <span className="text-slate-400">
                Current average
              </span>

              <span className="font-semibold text-[#3972a7]">
                82% ↑
              </span>

            </div>

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
                Algorithmic Correctness
              </h3>

            </div>

          </div>

          <p className="mt-6 text-3xl font-bold text-[#3d8a60]">
            88%
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            You consistently produce correct solutions and
            demonstrate a strong understanding of algorithms.
          </p>

          <div className="mt-5 h-1.5 bg-slate-100">

            <div
              className="h-full bg-[#6aa982]"
              style={{ width: '88%' }}
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
                Time & Space Complexity
              </h3>

            </div>

          </div>

          <p className="mt-6 text-3xl font-bold text-[#b77a2d]">
            72%
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Practice explaining complexity more clearly and
            identify optimization opportunities earlier.
          </p>

          <div className="mt-5 h-1.5 bg-slate-100">

            <div
              className="h-full bg-[#d29a50]"
              style={{ width: '72%' }}
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
            A detailed breakdown of how your interview performance
            was evaluated.
          </p>

        </div>


        <div className="border border-slate-200 bg-white">

          {dimensions.map((dimension, index) => (

            <DimensionRow
              key={dimension.name}
              dimension={dimension}
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

          {recentResults.map((result) => (

            <div
              key={result.id}
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
                    {result.date}
                  </p>

                </div>

              </div>


              <div className="flex items-center gap-6">

                <div className="text-right">

                  <p className="text-xs text-slate-400">
                    Result
                  </p>

                  <p className="text-sm font-semibold text-slate-600">
                    {result.level}
                  </p>

                </div>


                <div className="text-right">

                  <p className="text-xs text-slate-400">
                    Score
                  </p>

                  <p className="text-lg font-bold text-[#285b8f]">
                    {result.score}%
                  </p>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    navigate(`/candidate/results/${result.id}`)
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

      <div className="mt-8 border border-[#c9dff3] bg-[#eaf4ff] p-6">

        <div className="flex items-start gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-white text-[#3972a7]">
            <InsightIcon />
          </div>

          <div>

            <p className="text-xs font-semibold uppercase tracking-wider text-[#3972a7]">
              AI Performance Insight
            </p>

            <h3 className="mt-1 text-base font-bold text-[#17324f]">
              Your reasoning is stronger than your complexity analysis.
            </h3>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#58728d]">
              Your recent interviews show strong problem decomposition
              and algorithmic thinking. Focus your preparation on
              articulating time and space complexity and identifying
              optimization opportunities.
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