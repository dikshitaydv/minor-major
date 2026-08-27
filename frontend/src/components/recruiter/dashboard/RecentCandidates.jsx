function RecentCandidates() {
  const candidates = [
    {
      name: 'Aarav Sharma',
      role: 'Backend Engineer',
      score: 92,
      status: 'Shortlisted',
      initials: 'AS',
    },
    {
      name: 'Meera Kapoor',
      role: 'Frontend Developer',
      score: 87,
      status: 'Interviewed',
      initials: 'MK',
    },
    {
      name: 'Rohan Mehta',
      role: 'Data Scientist',
      score: 81,
      status: 'Shortlisted',
      initials: 'RM',
    },
    {
      name: 'Ananya Rao',
      role: 'Backend Engineer',
      score: 76,
      status: 'Interviewed',
      initials: 'AR',
    },
  ]

  return (
    <section className="border border-slate-200 bg-white">

      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

        <div>

          <h2 className="text-sm font-bold text-[#17324f]">
            Recent Candidates
          </h2>

          <p className="mt-1 text-[10px] text-slate-400">
            Latest interview activity
          </p>

        </div>

        <button
          type="button"
          className="text-[10px] font-semibold text-[#3972a7] hover:text-[#285b8f]"
        >
          View all
        </button>

      </div>


      <div className="divide-y divide-slate-100">

        {candidates.map((candidate) => (
          <div
            key={candidate.name}
            className="flex items-center justify-between px-5 py-4 transition hover:bg-slate-50"
          >

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center bg-[#eaf3fc] text-[10px] font-semibold text-[#3972a7]">
                {candidate.initials}
              </div>

              <div>

                <p className="text-xs font-semibold text-slate-700">
                  {candidate.name}
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  {candidate.role}
                </p>

              </div>

            </div>


            <div className="text-right">

              <p className="text-sm font-bold text-[#17324f]">
                {candidate.score}
              </p>

              <p className="text-[9px] text-slate-400">
                {candidate.status}
              </p>

            </div>

          </div>
        ))}

      </div>

    </section>
  )
}

export default RecentCandidates