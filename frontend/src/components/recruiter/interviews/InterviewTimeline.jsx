import { useState } from 'react'

function InterviewTimeline() {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Senior Backend Engineer',
      college: 'IIT Delhi',
      mode: 'On-Campus',
      date: '2026-08-28',
      startTime: '18:00',
      endTime: '20:00',
      enabled: true,
    },
    {
      id: 2,
      title: 'Frontend Developer',
      college: 'VIT',
      mode: 'On-Campus',
      date: '2026-08-29',
      startTime: '10:00',
      endTime: '12:00',
      enabled: false,
    },
    {
      id: 3,
      title: 'Data Scientist',
      college: 'NIT Trichy',
      mode: 'Off-Campus',
      date: '2026-08-30',
      startTime: '19:00',
      endTime: '21:00',
      enabled: true,
    },
    {
      id: 4,
      title: 'Backend Engineer',
      college: 'IIT Bombay',
      mode: 'On-Campus',
      date: '2026-08-30',
      startTime: '20:00',
      endTime: '22:00',
      enabled: true,
    },
  ])

  const [editingJob, setEditingJob] =
    useState(null)

  /*
   * ============================================================
   * TOGGLE TIMELINE
   * ============================================================
   */

  const toggleTimeline = (jobId) => {
    setJobs((previous) =>
      previous.map((job) =>
        job.id === jobId
          ? {
              ...job,
              enabled: !job.enabled,
            }
          : job
      )
    )
  }

  /*
   * ============================================================
   * UPDATE JOB TIMELINE
   * ============================================================
   */

  const updateJob = (updatedJob) => {
    setJobs((previous) =>
      previous.map((job) =>
        job.id === updatedJob.id
          ? updatedJob
          : job
      )
    )

    setEditingJob(null)
  }

  return (
    <section className="border border-slate-200 bg-white">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="border-b border-slate-200 px-5 py-4">

        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">

          <div>

            <div className="flex items-center gap-2">

              <div className="flex h-7 w-7 items-center justify-center bg-[#e8f2fb] text-[#3972a7]">
                <CalendarIcon />
              </div>

              <h2 className="text-sm font-bold text-[#17324f]">
                Interview Timelines
              </h2>

            </div>

            <p className="mt-2 max-w-2xl text-[10px] leading-4 text-slate-400">
              Manage candidate access windows for each
              active job and recruitment batch. Timelines
              can be enabled independently for every job.
            </p>

          </div>


          {/* Summary */}

          <div className="flex items-center gap-5">

            <TimelineStat
              label="Active"
              value={
                jobs.filter(
                  (job) => job.enabled
                ).length
              }
            />

            <TimelineStat
              label="Flexible"
              value={
                jobs.filter(
                  (job) => !job.enabled
                ).length
              }
            />

            <TimelineStat
              label="Total Jobs"
              value={jobs.length}
            />

          </div>

        </div>

      </div>


      {/* =====================================================
          JOB LIST
      ====================================================== */}

      <div className="divide-y divide-slate-100">

        {jobs.map((job) => (
          <TimelineJobRow
            key={job.id}
            job={job}
            onToggle={() =>
              toggleTimeline(job.id)
            }
            onEdit={() =>
              setEditingJob(job)
            }
          />
        ))}

      </div>


      {/* =====================================================
          EDIT PANEL
      ====================================================== */}

      {editingJob && (
        <TimelineEditor
          job={editingJob}
          onClose={() =>
            setEditingJob(null)
          }
          onSave={updateJob}
        />
      )}

    </section>
  )
}


/* ============================================================
   JOB ROW
============================================================ */

function TimelineJobRow({
  job,
  onToggle,
  onEdit,
}) {
  return (
    <div className="px-5 py-4 transition hover:bg-slate-50/60">

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

        {/* =================================================
            JOB INFORMATION
        ================================================== */}

        <div className="flex min-w-0 items-center gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#edf5fc] text-[#3972a7]">
            <BriefcaseIcon />
          </div>


          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <p className="truncate text-xs font-bold text-[#17324f]">
                {job.title}
              </p>

              <span className="bg-slate-100 px-2 py-0.5 text-[8px] font-semibold text-slate-500">
                {job.mode}
              </span>

            </div>


            <div className="mt-1.5 flex flex-wrap items-center gap-3">

              <span className="flex items-center gap-1 text-[9px] text-slate-400">
                <BuildingIcon />
                {job.college}
              </span>

              <span className="text-slate-300">
                ·
              </span>

              <span className="text-[9px] text-slate-400">
                {job.enabled
                  ? `${formatDate(
                      job.date
                    )} · ${formatTime(
                      job.startTime
                    )} – ${formatTime(
                      job.endTime
                    )}`
                  : 'Flexible access'}
              </span>

            </div>

          </div>

        </div>


        {/* =================================================
            TIMELINE DETAILS
        ================================================== */}

        <div className="flex flex-wrap items-center gap-5 xl:justify-end">

          {job.enabled && (
            <div className="hidden items-center gap-4 border-l border-slate-100 pl-5 md:flex">

              <TimelineInfo
                label="Date"
                value={formatDate(
                  job.date
                )}
              />

              <TimelineInfo
                label="Starts"
                value={formatTime(
                  job.startTime
                )}
              />

              <TimelineInfo
                label="Ends"
                value={formatTime(
                  job.endTime
                )}
              />

              <TimelineInfo
                label="Window"
                value={calculateDuration(
                  job.startTime,
                  job.endTime
                )}
              />

            </div>
          )}


          {/* =================================================
              CONFIGURE
          ================================================== */}

          <button
            type="button"
            onClick={onEdit}
            className="border border-slate-200 px-3 py-2 text-[9px] font-semibold text-slate-500 transition hover:border-[#b8d3e9] hover:bg-[#f5f9fd] hover:text-[#3972a7]"
          >
            {job.enabled
              ? 'Edit Timeline'
              : 'Configure'}
          </button>


          {/* =================================================
              SWITCH
          ================================================== */}

          <button
            type="button"
            onClick={onToggle}
            className="flex items-center gap-2"
            aria-label={`Turn timeline ${
              job.enabled
                ? 'off'
                : 'on'
            }`}
          >

            <span className="text-[9px] font-semibold text-slate-400">
              {job.enabled
                ? 'ON'
                : 'OFF'}
            </span>

            <div
              className={`relative h-5 w-9 transition ${
                job.enabled
                  ? 'bg-[#3972a7]'
                  : 'bg-slate-300'
              }`}
            >

              <div
                className={`absolute top-1 h-3 w-3 bg-white transition ${
                  job.enabled
                    ? 'left-5'
                    : 'left-1'
                }`}
              />

            </div>

          </button>

        </div>

      </div>

    </div>
  )
}


/* ============================================================
   TIMELINE EDITOR
============================================================ */

function TimelineEditor({
  job,
  onClose,
  onSave,
}) {
  const [formData, setFormData] =
    useState({
      ...job,
    })

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <div className="border-t border-slate-200 bg-[#f8fbfe]">

      {/* =================================================
          EDITOR HEADER
      ================================================== */}

      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

        <div>

          <p className="text-[9px] font-semibold uppercase tracking-wider text-[#3972a7]">
            Configure Timeline
          </p>

          <h3 className="mt-1 text-sm font-bold text-[#17324f]">
            {job.title}
          </h3>

          <p className="mt-1 text-[9px] text-slate-400">
            {job.college} · {job.mode}
          </p>

        </div>


        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center text-slate-400 hover:bg-white hover:text-slate-600"
        >
          <CloseIcon />
        </button>

      </div>


      {/* =================================================
          EDITOR BODY
      ================================================== */}

      <div className="grid gap-4 p-5 md:grid-cols-2 lg:grid-cols-5">

        {/* Date */}

        <TimelineField label="Interview Date">

          <input
            type="date"
            name="date"
            value={
              formData.date
            }
            onChange={handleChange}
            className="timeline-input"
          />

        </TimelineField>


        {/* Start */}

        <TimelineField label="Start Time">

          <input
            type="time"
            name="startTime"
            value={
              formData.startTime
            }
            onChange={handleChange}
            className="timeline-input"
          />

        </TimelineField>


        {/* End */}

        <TimelineField label="End Time">

          <input
            type="time"
            name="endTime"
            value={
              formData.endTime
            }
            onChange={handleChange}
            className="timeline-input"
          />

        </TimelineField>


        {/* Duration */}

        <div className="border border-[#d7e7f5] bg-white px-3 py-2.5">

          <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-400">
            Access Window
          </p>

          <p className="mt-1 text-xs font-bold text-[#17324f]">
            {calculateDuration(
              formData.startTime,
              formData.endTime
            )}
          </p>

        </div>


        {/* Save */}

        <div className="flex items-end">

          <button
            type="button"
            onClick={handleSave}
            className="w-full bg-[#285b8f] px-4 py-2.5 text-[10px] font-semibold text-white transition hover:bg-[#214d79]"
          >
            Save Timeline
          </button>

        </div>

      </div>


      {/* =================================================
          ACCESS INFORMATION
      ================================================== */}

      <div className="flex items-start gap-3 border-t border-slate-200 px-5 py-3">

        <InfoIcon />

        <div>

          <p className="text-[9px] font-semibold text-slate-600">
            Candidate access window
          </p>

          <p className="mt-1 max-w-3xl text-[9px] leading-4 text-slate-400">
            Candidates assigned to this job can start
            their assessment only between{' '}
            {formatTime(
              formData.startTime
            )}{' '}
            and{' '}
            {formatTime(
              formData.endTime
            )}{' '}
            on{' '}
            {formatDate(
              formData.date
            )}
            . The timeline applies only to this
            recruitment batch.
          </p>

        </div>

      </div>

    </div>
  )
}


/* ============================================================
   TIMELINE INFO
============================================================ */

function TimelineInfo({
  label,
  value,
}) {
  return (
    <div>

      <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-[10px] font-semibold text-slate-600">
        {value}
      </p>

    </div>
  )
}


/* ============================================================
   FIELD
============================================================ */

function TimelineField({
  label,
  children,
}) {
  return (
    <div>

      <label className="mb-1.5 block text-[8px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>

      {children}

    </div>
  )
}


/* ============================================================
   STAT
============================================================ */

function TimelineStat({
  label,
  value,
}) {
  return (
    <div className="text-right">

      <p className="text-[8px] uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-[#17324f]">
        {value}
      </p>

    </div>
  )
}


/* ============================================================
   DURATION
============================================================ */

function calculateDuration(
  start,
  end
) {
  if (!start || !end) {
    return '--'
  }

  const [
    startHour,
    startMinute,
  ] = start
    .split(':')
    .map(Number)

  const [
    endHour,
    endMinute,
  ] = end
    .split(':')
    .map(Number)

  let minutes =
    endHour * 60 +
    endMinute -
    (startHour * 60 +
      startMinute)

  if (minutes < 0) {
    minutes += 24 * 60
  }

  const hours = Math.floor(
    minutes / 60
  )

  const remaining =
    minutes % 60

  if (hours === 0) {
    return `${remaining} min`
  }

  if (remaining === 0) {
    return `${hours} hr`
  }

  return `${hours} hr ${remaining} min`
}


/* ============================================================
   FORMAT TIME
============================================================ */

function formatTime(time) {
  if (!time) {
    return '--'
  }

  const [
    hour,
    minute,
  ] = time
    .split(':')
    .map(Number)

  const suffix =
    hour >= 12
      ? 'PM'
      : 'AM'

  const displayHour =
    hour % 12 || 12

  return `${displayHour}:${String(
    minute
  ).padStart(2, '0')} ${suffix}`
}


/* ============================================================
   FORMAT DATE
============================================================ */

function formatDate(date) {
  if (!date) {
    return '--'
  }

  const value = new Date(
    `${date}T00:00:00`
  )

  return value.toLocaleDateString(
    'en-IN',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }
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
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="2"
      />

      <path d="M7 2v4M17 2v4M3 10h18" />

    </svg>
  )
}


function BriefcaseIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="3"
        y="7"
        width="18"
        height="13"
        rx="2"
      />

      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />

      <path d="M3 12h18" />

      <path d="M10 12v2h4v-2" />

    </svg>
  )
}


function BuildingIcon() {
  return (
    <svg
      className="h-3 w-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 21V5l8-3 8 3v16" />

      <path d="M8 9h1M15 9h1M8 13h1M15 13h1M8 17h1M15 17h1" />

    </svg>
  )
}


function InfoIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <path d="M12 11v5" />

      <path d="M12 8h.01" />

    </svg>
  )
}


function CloseIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}


export default InterviewTimeline