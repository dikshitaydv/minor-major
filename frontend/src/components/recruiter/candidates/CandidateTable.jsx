import CandidateRow from './CandidateRow'

function CandidateTable({ onCandidateSelect }) {
  const candidates = [
    {
      id: 1,
      name: 'Aarav Sharma',
      initials: 'AS',
      email: 'aarav@example.com',
      job: 'Senior Backend Engineer',
      score: 92,
      status: 'Shortlisted',
      interview: 'Completed',
      date: 'Aug 26, 2026',
    },
    {
      id: 2,
      name: 'Meera Kapoor',
      initials: 'MK',
      email: 'meera@example.com',
      job: 'Frontend Developer',
      score: 87,
      status: 'Interviewed',
      interview: 'Completed',
      date: 'Aug 26, 2026',
    },
    {
      id: 3,
      name: 'Rohan Mehta',
      initials: 'RM',
      email: 'rohan@example.com',
      job: 'Data Scientist',
      score: 81,
      status: 'Shortlisted',
      interview: 'Completed',
      date: 'Aug 25, 2026',
    },
    {
      id: 4,
      name: 'Ananya Rao',
      initials: 'AR',
      email: 'ananya@example.com',
      job: 'Senior Backend Engineer',
      score: 76,
      status: 'Interviewed',
      interview: 'Completed',
      date: 'Aug 25, 2026',
    },
    {
      id: 5,
      name: 'Kabir Singh',
      initials: 'KS',
      email: 'kabir@example.com',
      job: 'Frontend Developer',
      score: 68,
      status: 'In Progress',
      interview: 'In Progress',
      date: 'Aug 27, 2026',
    },
    {
      id: 6,
      name: 'Diya Nair',
      initials: 'DN',
      email: 'diya@example.com',
      job: 'Data Scientist',
      score: 64,
      status: 'Interviewed',
      interview: 'Completed',
      date: 'Aug 24, 2026',
    },
  ]

  return (
    <div className="overflow-hidden border border-slate-200 bg-white">

      {/* Table Header */}

      <div className="grid grid-cols-[2fr_1.5fr_0.7fr_1fr_1fr_40px] border-b border-slate-200 bg-slate-50 px-5 py-3">

        <TableHeading>
          Candidate
        </TableHeading>

        <TableHeading>
          Job
        </TableHeading>

        <TableHeading>
          AI Score
        </TableHeading>

        <TableHeading>
          Interview
        </TableHeading>

        <TableHeading>
          Status
        </TableHeading>

        <span />

      </div>


      {/* Rows */}

      <div className="divide-y divide-slate-100">

        {candidates.map((candidate) => (
          <CandidateRow
            key={candidate.id}
            candidate={candidate}
            onClick={() => onCandidateSelect(candidate)}
          />
        ))}

      </div>

    </div>
  )
}


function TableHeading({ children }) {
  return (
    <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </span>
  )
}


export default CandidateTable