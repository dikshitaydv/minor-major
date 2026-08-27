import RecruiterSidebar from '../../components/recruiter/RecruiterSidebar'
import RecruiterHeader from '../../components/recruiter/RecruiterHeader'
import StatsOverview from '../../components/recruiter/dashboard/StatsOverview'
import ActiveJobs from '../../components/recruiter/dashboard/ActiveJobs'
import HiringPipeline from '../../components/recruiter/dashboard/HiringPipeline'
import RecentCandidates from '../../components/recruiter/dashboard/RecentCandidates'

function RecruiterDashboard() {
  return (
    <div className="min-h-screen bg-[#f4f8fc]">

      <RecruiterSidebar />

      <div className="ml-64 flex min-h-screen flex-col">

        <RecruiterHeader />

        <main className="flex-1 p-6 lg:p-8">

          {/* Page Heading */}

          <div className="mb-7">

            <p className="text-xs font-medium text-[#3972a7]">
              Overview
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17324f]">
              Good morning, Recruiter
            </h1>

            <p className="mt-2 text-xs text-slate-400">
              Here's what's happening with your hiring process.
            </p>

          </div>


          {/* Stats */}

          <StatsOverview />


          {/* Jobs + Pipeline */}

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">

            <ActiveJobs />

            <HiringPipeline />

          </div>


          {/* Recent Candidates */}

          <div className="mt-6">

            <RecentCandidates />

          </div>

        </main>

      </div>

    </div>
  )
}

export default RecruiterDashboard