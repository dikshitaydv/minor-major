
function CandidateHeader() {
  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-8">

      {/* Mobile menu */}

      <button
        type="button"
        className="text-slate-500 lg:hidden"
        aria-label="Open menu"
      >
        <MenuIcon />
      </button>


      {/* Search */}

      <div className="hidden items-center gap-3 md:flex">

        <div className="relative">

          <SearchIcon />

          <input
            type="text"
            placeholder="Search interviews..."
            className="w-64 border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#8eb9df] focus:bg-white"
          />

        </div>

      </div>


      {/* Right */}

      <div className="ml-auto flex items-center gap-5">

        <button
          type="button"
          className="relative text-slate-500 hover:text-slate-800"
          aria-label="Notifications"
        >

          <BellIcon />

          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#4b9bea]" />

        </button>


        <div className="h-7 w-px bg-slate-200" />


        <button
          type="button"
          className="flex items-center gap-3"
        >

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dcecff] text-sm font-semibold text-[#285b8f]">
            A
          </div>

          <div className="hidden text-left sm:block">

            <p className="text-sm font-semibold text-slate-700">
              Candidate
            </p>

            <p className="text-xs text-slate-400">
              Candidate Account
            </p>

          </div>

          <ChevronIcon />

        </button>

      </div>

    </header>
  )
}

function MenuIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export default CandidateHeader

