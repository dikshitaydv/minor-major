import CandidateLayout from '../../components/layout/CandidateLayout'

function CandidateDashboard() {
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
          Good morning, Candidate
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
          value="2"
          description="Scheduled interviews"
          icon={<CalendarIcon />}
        />

        <StatCard
          label="Completed"
          value="5"
          description="Interviews completed"
          icon={<CheckIcon />}
        />

        <StatCard
          label="Average Score"
          value="82%"
          description="+6% from previous"
          icon={<ChartIcon />}
        />

        <StatCard
          label="Preparation"
          value="74%"
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
          />

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
                        Backend Developer
                      </h3>

                      <p className="text-xs text-slate-400">
                        Technical Coding Interview
                      </p>

                    </div>

                  </div>


                  <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-500">

                    <span className="flex items-center gap-2">
                      <CalendarIcon />
                      Tomorrow
                    </span>

                    <span className="flex items-center gap-2">
                      <ClockIcon />
                      10:30 AM
                    </span>

                    <span className="flex items-center gap-2">
                      <TimerIcon />
                      45 minutes
                    </span>

                  </div>

                </div>


                <div className="flex items-start">

                  <span className="bg-[#eaf5ff] px-3 py-1.5 text-xs font-semibold text-[#3972a7]">
                    Scheduled
                  </span>

                </div>

              </div>


              <div className="mt-6 border-t border-slate-100 pt-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs text-slate-400">
                      Interview focus
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">

                      <Tag text="Data Structures" />

                      <Tag text="Algorithms" />

                      <Tag text="Problem Solving" />

                    </div>

                  </div>


                  <button
                    type="button"
                    className="hidden bg-[#285b8f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#214d79] sm:block"
                  >
                    View Interview →
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* Preparation */}

        <div>

          <SectionHeader
            title="Preparation"
            action="Practice"
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
                    strokeDashoffset="69"
                    strokeLinecap="round"
                  />
                </svg>

                <span className="text-xl font-bold text-[#17324f]">
                  74%
                </span>

              </div>


              <div className="flex-1 space-y-3">

                <ProgressItem
                  label="Arrays"
                  value="85%"
                  progress="85"
                />

                <ProgressItem
                  label="Graphs"
                  value="62%"
                  progress="62"
                />

                <ProgressItem
                  label="Dynamic Programming"
                  value="48%"
                  progress="48"
                />

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
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <DimensionCard
            title="Problem Understanding"
            score="85%"
            progress="85"
          />

          <DimensionCard
            title="Reasoning & Approach"
            score="80%"
            progress="80"
          />

          <DimensionCard
            title="Data Structures"
            score="76%"
            progress="76"
          />

          <DimensionCard
            title="Algorithmic Correctness"
            score="88%"
            progress="88"
          />

          <DimensionCard
            title="Time & Space Complexity"
            score="72%"
            progress="72"
          />

          <DimensionCard
            title="Edge Cases"
            score="79%"
            progress="79"
          />

          <DimensionCard
            title="Follow-up Responses"
            score="81%"
            progress="81"
          />

          <div className="flex items-center justify-center border border-dashed border-slate-300 bg-white p-5">

            <button
              type="button"
              className="text-sm font-semibold text-[#285b8f] hover:underline"
            >
              View full evaluation →
            </button>

          </div>

        </div>

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
          />

          <div className="border border-slate-200 bg-white p-6">

            <div className="flex gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#e7f2ff] text-[#3972a7]">
                <MessageIcon />
              </div>

              <div>

                <p className="text-sm leading-6 text-slate-600">

                  Strong algorithmic reasoning and good problem
                  decomposition. Consider explaining your complexity
                  analysis more explicitly.

                </p>

                <p className="mt-3 text-xs text-slate-400">
                  From your latest interview · 2 days ago
                </p>

              </div>

            </div>

            <button
              type="button"
              className="mt-5 text-sm font-semibold text-[#285b8f] hover:underline"
            >
              View full feedback →
            </button>

          </div>

        </div>


        {/* Recommended */}

        <div>

          <SectionHeader
            title="Recommended for You"
            action="View preparation"
          />

          <div className="border border-slate-200 bg-white p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-[#4b9bea]">
                  Focus Area
                </p>

                <h3 className="mt-2 text-lg font-semibold text-[#17324f]">
                  Dynamic Programming
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Improve your problem-solving performance.
                </p>

              </div>

              <div className="text-right">

                <p className="text-2xl font-bold text-[#17324f]">
                  48%
                </p>

                <p className="text-xs text-slate-400">
                  Current score
                </p>

              </div>

            </div>

            <div className="mt-5 h-2 overflow-hidden bg-slate-100">

              <div
                className="h-full bg-[#4b9bea]"
                style={{ width: '48%' }}
              />

            </div>

            <button
              type="button"
              className="mt-5 bg-[#eaf3fc] px-4 py-2.5 text-sm font-semibold text-[#285b8f] transition hover:bg-[#dcecff]"
            >
              Start Practice →

            </button>

          </div>

        </div>

      </div>

    </CandidateLayout>
  )
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


function SectionHeader({ title, action }) {
  return (
    <div className="mb-3 flex items-center justify-between">

      <h2 className="text-sm font-semibold text-slate-700">
        {title}
      </h2>

      <button
        type="button"
        className="text-xs font-medium text-[#3972a7] hover:underline"
      >
        {action} →
      </button>

    </div>
  )
}


function Tag({ text }) {
  return (
    <span className="bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
      {text}
    </span>
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
