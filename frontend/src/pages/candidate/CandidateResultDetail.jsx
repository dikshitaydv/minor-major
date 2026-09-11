import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CandidateLayout from '../../components/layout/CandidateLayout'
import * as candidateApi from '../../api/candidate.api.js'

const DIMENSION_META = {
  algorithmCorrectness: 'Algorithmic Correctness',
  logicalReasoning: 'Reasoning & Approach',
  conceptCoverage: 'Concept Coverage',
  completeness: 'Completeness',
  dataStructure: 'Data Structure Selection',
  complexity: 'Time & Space Complexity',
  edgeCases: 'Edge Case Handling',
}

function CandidateResultDetail() {
  const { id: interviewId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    let cancelled = false

    candidateApi
      .getResultDetail(interviewId)
      .then((data) => !cancelled && setDetail(data))
      .catch((err) => !cancelled && setError(err.message || 'Unable to load this result.'))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [interviewId])

  if (loading) {
    return (
      <CandidateLayout>
        <div className="flex h-64 items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#285b8f]/30 border-t-[#285b8f]" />
        </div>
      </CandidateLayout>
    )
  }

  if (error || !detail) {
    return (
      <CandidateLayout>
        <div className="border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          {error || 'Result not found.'}
        </div>
      </CandidateLayout>
    )
  }

  return (
    <CandidateLayout>

      <button
        type="button"
        onClick={() => navigate('/candidate/results')}
        className="mb-6 text-xs font-semibold text-[#3972a7] hover:underline"
      >
        ← Back to all results
      </button>

      <div className="mb-8">

        <p className="text-sm font-medium text-[#4b9bea]">
          Detailed Report
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17324f] lg:text-3xl">
          Interview Result
        </h1>

      </div>


      <div className="grid gap-6 lg:grid-cols-3">

        <div className="border border-slate-200 bg-white p-7 lg:col-span-1">

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Overall Score
          </p>

          <p className="mt-4 text-5xl font-bold text-[#17324f]">
            {detail.overallScore}%
          </p>

        </div>

        <div className="border border-slate-200 bg-white p-7 lg:col-span-2">

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Feedback
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {detail.feedback}
          </p>

        </div>

      </div>


      <div className="mt-6 border border-slate-200 bg-white">

        {Object.entries(detail.dimensions).map(([key, score], index) => (
          <div
            key={key}
            className="flex flex-col gap-4 border-b border-slate-100 p-5 last:border-b-0 md:flex-row md:items-center"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#eaf3fc] text-xs font-bold text-[#3972a7]">
              {String(index + 1).padStart(2, '0')}
            </div>

            <div className="w-full md:w-64">
              <h3 className="text-sm font-semibold text-slate-700">
                {DIMENSION_META[key] || key}
              </h3>
            </div>

            <div className="flex-1">
              <div className="h-2 bg-slate-100">
                <div
                  className="h-full bg-[#6fa9dc]"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            <div className="w-12 text-right">
              <span className="text-sm font-bold text-[#285b8f]">
                {score}%
              </span>
            </div>
          </div>
        ))}

      </div>


      <div className="mt-6 grid gap-6 md:grid-cols-2">

        <div className="border border-slate-200 bg-white p-6">

          <p className="text-xs font-semibold uppercase tracking-wider text-[#3d8a60]">
            Strengths
          </p>

          <ul className="mt-3 space-y-2">
            {detail.strengths.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-slate-600">
                <span className="text-[#3d8a60]">✓</span>
                {item}
              </li>
            ))}
          </ul>

        </div>

        <div className="border border-slate-200 bg-white p-6">

          <p className="text-xs font-semibold uppercase tracking-wider text-[#b77a2d]">
            Areas to Improve
          </p>

          <ul className="mt-3 space-y-2">
            {detail.improvements.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-slate-600">
                <span className="text-[#b77a2d]">→</span>
                {item}
              </li>
            ))}
          </ul>

        </div>

      </div>

    </CandidateLayout>
  )
}

export default CandidateResultDetail
