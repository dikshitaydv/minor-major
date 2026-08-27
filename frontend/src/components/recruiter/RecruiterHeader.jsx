function RecruiterHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">

      {/* Left */}

      <div>

        <p className="text-sm font-semibold text-[#17324f]">
          Recruiter Dashboard
        </p>

        <p className="text-[10px] text-slate-400">
          Hiring overview
        </p>

      </div>


      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Search */}

        <div className="hidden items-center border border-slate-200 bg-slate-50 px-3 py-2 md:flex">

          <SearchIcon />

          <input
            type="text"
            placeholder="Search candidates..."
            className="ml-2 w-48 bg-transparent text-xs text-slate-600 outline-none placeholder:text-slate-400"
          />

        </div>


        {/* Notification */}

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
        >

          <BellIcon />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 bg-[#3972a7]" />

        </button>


        {/* Divider */}

        <div className="h-7 w-px bg-slate-200" />


        {/* Profile */}

        <button
          type="button"
          className="flex items-center gap-2"
        >

          <div className="flex h-8 w-8 items-center justify-center bg-[#dcecff] text-xs font-semibold text-[#285b8f]">
            R
          </div>

          <div className="hidden text-left sm:block">

            <p className="text-xs font-semibold text-slate-700">
              Recruiter
            </p>

            <p className="text-[9px] text-slate-400">
              Hiring Team
            </p>

          </div>

        </button>

      </div>

    </header>
  )
}


function SearchIcon() {
  return (
    <svg
      className="h-4 w-4 text-slate-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  )
}


function BellIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  )
}


export default RecruiterHeader