import CandidateSidebar from './CandidateSidebar'
import CandidateHeader from './CandidateHeader'

function CandidateLayout({ children }) {
  return (
    <div className="h-screen overflow-hidden bg-[#f4f8fc]">

      {/* Fixed Sidebar */}
      <CandidateSidebar />

      {/* Main Application Area */}
      <div className="flex h-full min-w-0 flex-col lg:ml-64">

        {/* Header */}
        <CandidateHeader />

        {/* Scrollable Content */}
        <main className="min-h-0 flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  )
}

export default CandidateLayout