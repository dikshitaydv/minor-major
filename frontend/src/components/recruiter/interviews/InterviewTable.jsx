import InterviewRow from './InterviewRow'

function InterviewTable({ onInterviewSelect }) {
  const interviews = [
    {
      id: 'INT-1024',
      candidate: 'Aarav Sharma',
      initials: 'AS',
      email: 'aarav@example.com',
      job: 'Senior Backend Engineer',
      college: 'IIT Delhi',
      mode: 'On-Campus',
      date: 'Aug 27, 2026',
      time: '6:00 PM',
      duration: '45 min',
      score: null,
      status: 'Upcoming',
    },
    {
      id: 'INT-1023',
      candidate: 'Meera Kapoor',
      initials: 'MK',
      email: 'meera@example.com',
      job: 'Frontend Developer',
      college: 'VIT',
      mode: 'On-Campus',
      date: 'Aug 27, 2026',
      time: '1:00 PM',
      duration: '45 min',
      score: null,
      status: 'In Progress',
    },
    {
      id: 'INT-1022',
      candidate: 'Rohan Mehta',
      initials: 'RM',
      email: 'rohan@example.com',
      job: 'Data Scientist',
      college: 'NIT Trichy',
      mode: 'Off-Campus',
      date: 'Aug 26, 2026',
      time: '4:00 PM',
      duration: '60 min',
      score: 81,
      status: 'Completed',
    },
    {
      id: 'INT-1021',
      candidate: 'Ananya Rao',
      initials: 'AR',
      email: 'ananya@example.com',
      job: 'Senior Backend Engineer',
      college: 'IIT Delhi',
      mode: 'On-Campus',
      date: 'Aug 26, 2026',
      time: '11:30 AM',
      duration: '45 min',
      score: 76,
      status: 'Completed',
    },
    {
      id: 'INT-1020',
      candidate: 'Kabir Singh',
      initials: 'KS',
      email: 'kabir@example.com',
      job: 'Frontend Developer',
      college: 'BITS Pilani',
      mode: 'Off-Campus',
      date: 'Aug 25, 2026',
      time: '3:00 PM',
      duration: '45 min',
      score: 68,
      status: 'Completed',
    },
    {
      id: 'INT-1019',
      candidate: 'Diya Nair',
      initials: 'DN',
      email: 'diya@example.com',
      job: 'Data Scientist',
      college: 'SRM University',
      mode: 'On-Campus',
      date: 'Aug 24, 2026',
      time: '10:00 AM',
      duration: '60 min',
      score: 64,
      status: 'Completed',
    },
  ]

  return (
    <div className="overflow-hidden border border-slate-200 bg-white">

      {/* Header */}

      <div className="grid grid-cols-[1.6fr_1.4fr_1.3fr_1fr_0.7fr_0.9fr_40px] border-b border-slate-200 bg-slate-50 px-5 py-3">

        <Heading>
          Candidate
        </Heading>

        <Heading>
          Job
        </Heading>

        <Heading>
          College
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

      <div className="divide-y divide-slate-100">

        {interviews.map((interview) => (
          <InterviewRow
            key={interview.id}
            interview={interview}
            onClick={() =>
              onInterviewSelect(interview)
            }
          />
        ))}

      </div>

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


export default InterviewTable