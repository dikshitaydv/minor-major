function InterviewFilters({
  filters = {
    search: '',
    status: 'all',
    job: 'all',
    date: 'all',
    score: 'all',
    sort: 'recent',
    type: 'all',
  },
  onFiltersChange = () => { },
  jobs = [],
}) {
  const updateFilter = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      job: 'all',
      date: 'all',
      score: 'all',
      sort: 'recent',
    })
  }

  const hasActiveFilters =
    filters.search ||
    filters.status !== 'all' ||
    filters.job !== 'all' ||
    filters.date !== 'all' ||
    filters.score !== 'all' ||
    filters.sort !== 'recent'

  return (
    <div className="border border-slate-200 bg-white">

      {/* HEADER */}

      <div className="border-b border-slate-100 px-4 py-3">

        <div className="flex items-start justify-between gap-4">

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#3972a7]">
              Interview Filters
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Search and filter interviews by candidate,
              job, schedule, status, and evaluation score.
            </p>

          </div>


          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className="shrink-0 text-[10px] font-semibold text-slate-400 transition hover:text-[#3972a7] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear All
          </button>

        </div>

      </div>


      {/* MAIN FILTERS */}

      <div className="grid gap-3 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

        {/* SEARCH */}

        <div className="flex min-w-0 items-center border border-slate-200 bg-slate-50 px-3 xl:col-span-2">

          <SearchIcon />

          <input
            type="text"
            value={filters.search}
            onChange={(event) =>
              updateFilter('search', event.target.value)
            }
            placeholder="Search candidate, email, company, title..."
            className="ml-2 w-full bg-transparent py-2.5 text-xs text-slate-600 outline-none placeholder:text-slate-400"
          />

        </div>


        {/* STATUS */}

        <FilterSelect
          label="Interview Status"
          value={filters.status}
          onChange={(value) =>
            updateFilter('status', value)
          }
          options={[
            {
              value: 'all',
              label: 'All Status',
            },
            {
              value: 'SCHEDULED',
              label: 'Scheduled',
            },
            {
              value: 'IN_PROGRESS',
              label: 'In Progress',
            },
            {
              value: 'COMPLETED',
              label: 'Completed',
            },
            {
              value: 'EXPIRED',
              label: 'Expired',
            },
            {
              value: 'CANCELLED',
              label: 'Cancelled',
            },
          ]}
        />


        {/* JOB / INTERVIEW TITLE */}

        <FilterSelect
          label="Interview"
          value={filters.job}
          onChange={(value) =>
            updateFilter('job', value)
          }
          options={[
            {
              value: 'all',
              label: 'All Interviews',
            },

            ...jobs.map((job) => ({
              value: job.id,
              label: job.title,
            })),
          ]}
        />


        {/* DATE */}

        <FilterSelect
          label="Interview Date"
          value={filters.date}
          onChange={(value) =>
            updateFilter('date', value)
          }
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
              value: 'past',
              label: 'Past Interviews',
            },
          ]}
        />


        {/* SCORE */}

        <FilterSelect
          label="Evaluation Score"
          value={filters.score}
          onChange={(value) =>
            updateFilter('score', value)
          }
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

      </div>


      {/* SECONDARY FILTERS */}

      <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3">

        <div className="grid gap-3 md:grid-cols-2">

          {/* SORT */}

          <FilterSelect
            label="Sort By"
            value={filters.sort}
            onChange={(value) =>
              updateFilter('sort', value)
            }
            options={[
              {
                value: 'recent',
                label: 'Most Recently Created',
              },
              {
                value: 'scheduled-soon',
                label: 'Scheduled Soon',
              },
              {
                value: 'scheduled-late',
                label: 'Scheduled Later',
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


          {/* INTERVIEW TYPE */}

          <FilterSelect
            label="Interview Type"
            value={filters.type || 'all'}
            onChange={(value) =>
              updateFilter('type', value)
            }
            options={[
              {
                value: 'all',
                label: 'All Types',
              },
              {
                value: 'Technical Interview',
                label: 'Technical Interview',
              },
            ]}
          />

        </div>

      </div>


      {/* ACTIVE FILTERS */}

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-4 py-3">

        <span className="mr-1 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
          Active Filters
        </span>


        {!hasActiveFilters && (
          <span className="bg-[#edf5fc] px-2 py-1 text-[9px] font-medium text-[#3972a7]">
            All Interviews
          </span>
        )}


        {filters.search && (
          <ActiveFilter
            label={`Search: ${filters.search}`}
            onRemove={() => updateFilter('search', '')}
          />
        )}


        {filters.status !== 'all' && (
          <ActiveFilter
            label={`Status: ${formatStatus(filters.status)}`}
            onRemove={() =>
              updateFilter('status', 'all')
            }
          />
        )}


        {filters.date !== 'all' && (
          <ActiveFilter
            label={`Date: ${formatDateFilter(filters.date)}`}
            onRemove={() =>
              updateFilter('date', 'all')
            }
          />
        )}


        {filters.score !== 'all' && (
          <ActiveFilter
            label={`Score: ${filters.score}`}
            onRemove={() =>
              updateFilter('score', 'all')
            }
          />
        )}

      </div>

    </div>
  )
}


/* ============================================================
   FILTER SELECT
============================================================ */

function FilterSelect({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div className="min-w-0">

      <label className="mb-1.5 block text-[9px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>


      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600 outline-none transition focus:border-[#8eb9df]"
      >

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}

      </select>

    </div>
  )
}


/* ============================================================
   ACTIVE FILTER
============================================================ */

function ActiveFilter({
  label,
  onRemove,
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="flex items-center gap-1 bg-[#edf5fc] px-2 py-1 text-[9px] font-medium text-[#3972a7] transition hover:bg-[#dcecf9]"
    >

      {label}

      <span className="ml-1 text-[#3972a7]">
        ×
      </span>

    </button>
  )
}


/* ============================================================
   HELPERS
============================================================ */

function formatStatus(status) {
  return status
    .toLowerCase()
    .split('_')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(' ')
}


function formatDateFilter(date) {
  const labels = {
    today: 'Today',
    tomorrow: 'Tomorrow',
    week: 'This Week',
    past: 'Past Interviews',
  }

  return labels[date] || date
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