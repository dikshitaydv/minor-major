import { useState } from 'react'
import RecruiterSidebar from '../../components/recruiter/RecruiterSidebar'
import RecruiterHeader from '../../components/recruiter/RecruiterHeader'
import CandidateFilters from '../../components/recruiter/candidates/CandidateFilters'
import CandidateTable from '../../components/recruiter/candidates/CandidateTable'
import CandidateDetails from '../../components/recruiter/candidates/CandidateDetails'

function RecruiterCandidates() {
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  return (
    <div className="min-h-screen bg-[#f4f8fc]">

      <RecruiterSidebar />

      <div className="ml-64 flex min-h-screen flex-col">

        <RecruiterHeader />

        <main className="flex-1 p-6 lg:p-8">

          {/* Page Header */}

          <div className="flex items-end justify-between">

            <div>

              <p className="text-xs font-medium text-[#3972a7]">
                Recruitment
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17324f]">
                Candidates
              </h1>

              <p className="mt-2 text-xs text-slate-400">
                Review candidates and their AI interview performance.
              </p>

            </div>

            <p className="text-xs text-slate-400">
              124 candidates
            </p>

          </div>


          {/* Filters */}

          <div className="mt-7">
            <CandidateFilters />
          </div>


          {/* Candidate Table */}

          <div className="mt-5">

            <CandidateTable
              onCandidateSelect={setSelectedCandidate}
            />

          </div>

        </main>

      </div>


      {/* Candidate Details */}

      {selectedCandidate && (
        <CandidateDetails
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}

    </div>
  )
}

export default RecruiterCandidates