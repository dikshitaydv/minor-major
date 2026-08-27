function InterviewFilters() {
  return (
    <div className="border border-slate-200 bg-white">

      {/* =====================================================
          FILTER HEADER
      ====================================================== */}

      <div className="border-b border-slate-100 px-4 py-3">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#3972a7]">
              Interview Filters
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Narrow down interviews by candidate, job,
              college, schedule, and interview status.
            </p>

          </div>


          <button
            type="button"
            className="text-[10px] font-semibold text-slate-400 transition hover:text-[#3972a7]"
          >
            Clear All
          </button>

        </div>

      </div>


      {/* =====================================================
          FILTERS
      ====================================================== */}

      <div className="grid gap-3 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

        {/* =================================================
            SEARCH
        ================================================== */}

        <div className="flex min-w-0 items-center border border-slate-200 bg-slate-50 px-3 xl:col-span-2">

          <SearchIcon />

          <input
            type="text"
            placeholder="Search candidate, email, job, or ID..."
            className="ml-2 w-full bg-transparent py-2.5 text-xs text-slate-600 outline-none placeholder:text-slate-400"
          />

        </div>


        {/* =================================================
            STATUS
        ================================================== */}

        <FilterSelect
          label="Interview Status"
          defaultValue="all"
          options={[
            {
              value: 'all',
              label: 'All Status',
            },
            {
              value: 'upcoming',
              label: 'Upcoming',
            },
            {
              value: 'progress',
              label: 'In Progress',
            },
            {
              value: 'completed',
              label: 'Completed',
            },
            {
              value: 'cancelled',
              label: 'Cancelled',
            },
            {
              value: 'no-show',
              label: 'No Show',
            },
          ]}
        />


        {/* =================================================
            JOB
        ================================================== */}

        <FilterSelect
          label="Job"
          defaultValue="all"
          options={[
            {
              value: 'all',
              label: 'All Jobs',
            },
            {
              value: 'backend',
              label: 'Senior Backend Engineer',
            },
            {
              value: 'frontend',
              label: 'Frontend Developer',
            },
            {
              value: 'data-science',
              label: 'Data Scientist',
            },
          ]}
        />


        {/* =================================================
            COLLEGE
        ================================================== */}

        <FilterSelect
          label="College"
          defaultValue="all"
          options={[
            {
              value: 'all',
              label: 'All Colleges',
            },
            {
              value: 'iit-delhi',
              label: 'IIT Delhi',
            },
            {
              value: 'iit-bombay',
              label: 'IIT Bombay',
            },
            {
              value: 'iit-madras',
              label: 'IIT Madras',
            },
            {
              value: 'nit-trichy',
              label: 'NIT Trichy',
            },
            {
              value: 'bits-pilani',
              label: 'BITS Pilani',
            },
            {
              value: 'vit',
              label: 'VIT',
            },
            {
              value: 'srm',
              label: 'SRM University',
            },
          ]}
        />


        {/* =================================================
            HIRING MODE
        ================================================== */}

        <FilterSelect
          label="Hiring Mode"
          defaultValue="all"
          options={[
            {
              value: 'all',
              label: 'All Modes',
            },
            {
              value: 'on-campus',
              label: 'On-Campus',
            },
            {
              value: 'off-campus',
              label: 'Off-Campus',
            },
            {
              value: 'general',
              label: 'General Posting',
            },
          ]}
        />


        {/* =================================================
            DATE
        ================================================== */}

        <FilterSelect
          label="Interview Date"
          defaultValue="all"
          options={[
            {
              value: 'all',
              label: 'All Dates',
            },
            {
              value: 'today',
              label: 'Today',
            },
            {
              value: 'tomorrow',
              label: 'Tomorrow',
            },
            {
              value: 'week',
              label: 'This Week',
            },
            {
              value: 'next-week',
              label: 'Next Week',
            },
            {
              value: 'past',
              label: 'Past Interviews',
            },
          ]}
        />

      </div>


      {/* =====================================================
          SECONDARY FILTER ROW
      ====================================================== */}

      <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3">

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">

          {/* =================================================
              ACCESS WINDOW
          ================================================== */}

          <FilterSelect
            label="Interview Access"
            defaultValue="all"
            options={[
              {
                value: 'all',
                label: 'All Access States',
              },
              {
                value: 'open',
                label: 'Currently Open',
              },
              {
                value: 'upcoming',
                label: 'Not Yet Open',
              },
              {
                value: 'closed',
                label: 'Access Closed',
              },
              {
                value: 'flexible',
                label: 'Flexible Access',
              },
            ]}
          />


          {/* =================================================
              TIMELINE
          ================================================== */}

          <FilterSelect
            label="Timeline"
            defaultValue="all"
            options={[
              {
                value: 'all',
                label: 'All Timelines',
              },
              {
                value: 'enabled',
                label: 'Fixed Timeline',
              },
              {
                value: 'disabled',
                label: 'Flexible Timeline',
              },
            ]}
          />


          {/* =================================================
              SCORE
          ================================================== */}

          <FilterSelect
            label="Interview Score"
            defaultValue="all"
            options={[
              {
                value: 'all',
                label: 'Any Score',
              },
              {
                value: '90',
                label: '90 – 100',
              },
              {
                value: '80',
                label: '80 – 89',
              },
              {
                value: '70',
                label: '70 – 79',
              },
              {
                value: '60',
                label: '60 – 69',
              },
              {
                value: 'below60',
                label: 'Below 60',
              },
              {
                value: 'pending',
                label: 'Not Evaluated',
              },
            ]}
          />


          {/* =================================================
              SORT
          ================================================== */}

          <FilterSelect
            label="Sort By"
            defaultValue="recent"
            options={[
              {
                value: 'recent',
                label: 'Most Recent',
              },
              {
                value: 'oldest',
                label: 'Oldest First',
              },
              {
                value: 'score-high',
                label: 'Highest Score',
              },
              {
                value: 'score-low',
                label: 'Lowest Score',
              },
              {
                value: 'candidate',
                label: 'Candidate Name',
              },
            ]}
          />

        </div>

      </div>


      {/* =====================================================
          ACTIVE FILTER SUMMARY
      ====================================================== */}

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-4 py-3">

        <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
          Active Filters
        </span>

        <span className="bg-[#edf5fc] px-2 py-1 text-[9px] font-medium text-[#3972a7]">
          All Interviews
        </span>

      </div>

    </div>
  )
}


/* ============================================================
   FILTER SELECT
============================================================ */

function FilterSelect({
  label,
  defaultValue,
  options,
}) {
  return (
    <div className="min-w-0">

      <label className="mb-1.5 block text-[9px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <select
        defaultValue={defaultValue}
        className="w-full border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600 outline-none transition focus:border-[#8eb9df]"
      >

        {options.map(
          (option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          )
        )}

      </select>

    </div>
  )
}


/* ============================================================
   SEARCH ICON
============================================================ */

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-slate-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-4-4" />

    </svg>
  )
}


export default InterviewFilters