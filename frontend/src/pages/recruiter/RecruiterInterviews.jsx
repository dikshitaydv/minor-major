import { useState } from 'react'
import RecruiterSidebar from '../../components/recruiter/RecruiterSidebar'
import RecruiterHeader from '../../components/recruiter/RecruiterHeader'
import InterviewFilters from '../../components/recruiter/interviews/InterviewFilters'
import InterviewTable from '../../components/recruiter/interviews/InterviewTable'
import InterviewDetails from '../../components/recruiter/interviews/InterviewDetails'
import InterviewTimeline from '../../components/recruiter/interviews/InterviewTimeline'

function RecruiterInterviews() {
  const [selectedInterview, setSelectedInterview] =
    useState(null)

  return (
    <div className="min-h-screen bg-[#f4f8fc]">

      <RecruiterSidebar />

      <div className="ml-64 flex min-h-screen flex-col">

        <RecruiterHeader />

        <main className="flex-1 p-6 lg:p-8">

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">

            <div>

              <p className="text-xs font-medium text-[#3972a7]">
                Recruitment
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17324f]">
                Interviews
              </h1>

              <p className="mt-2 text-xs text-slate-400">
                Schedule, manage, and monitor candidate interviews.
              </p>

            </div>


            {/* Stats */}

            <div className="flex items-center gap-6">

              <MiniStat
                label="Upcoming"
                value="08"
              />

              <MiniStat
                label="In Progress"
                value="02"
              />

              <MiniStat
                label="Completed"
                value="36"
              />

            </div>

          </div>


          {/* ==================================================
              TIMELINE
          ================================================== */}

          <div className="mt-7">

            <InterviewTimeline />

          </div>


          {/* ==================================================
              FILTERS
          ================================================== */}

          <div className="mt-6">

            <InterviewFilters />

          </div>


          {/* ==================================================
              TABLE
          ================================================== */}

          <div className="mt-5">

            <InterviewTable
              onInterviewSelect={
                setSelectedInterview
              }
            />

          </div>

        </main>

      </div>


      {/* ======================================================
          DETAILS
      ====================================================== */}

      {selectedInterview && (
        <InterviewDetails
          interview={selectedInterview}
          onClose={() =>
            setSelectedInterview(null)
          }
        />
      )}

    </div>
  )
}


/* ============================================================
   MINI STAT
============================================================ */

function MiniStat({
  label,
  value,
}) {
  return (
    <div className="text-right">

      <p className="text-[9px] uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-[#17324f]">
        {value}
      </p>

    </div>
  )
}


export default RecruiterInterviews