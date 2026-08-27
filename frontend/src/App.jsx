import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'

import Home from './pages/Home'
import AdminDashboard from './pages/admin/AdminDashboard'


import RecruiterDashboard from './pages/recruiter/RecruiterDashboard'
import RecruiterJobs from './pages/recruiter/RecruiterJobs'
import RecruiterCandidates from './pages/recruiter/RecruiterCandidates'
import RecruiterInterviews from './pages/recruiter/RecruiterInterviews'
import RecruiterAnalytics from './pages/recruiter/RecruiterAnalytics'

import CandidateDashboard from './pages/candidate/CandidateDashboard'
import CandidateInterviews from './pages/candidate/CandidateInterviews'
import CandidateResults from './pages/candidate/CandidateResults'
import CandidatePreparation from './pages/candidate/CandidatePreparation'
import CandidateInterview from './pages/candidate/CandidateInterview'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        {/* Recruiter */}
        <Route
          path="/recruiter/dashboard"
          element={<RecruiterDashboard />}
        />
        <Route
          path="/recruiter/jobs"
          element={<RecruiterJobs />}
        />
        <Route
          path="/recruiter/candidates"
          element={<RecruiterCandidates />}
        />
        <Route
          path="/recruiter/interviews"
          element={<RecruiterInterviews />}
        />




        {/* Candidate */}
        <Route
          path="/candidate/dashboard"
          element={<CandidateDashboard />}
        />
        <Route
          path="/candidate/interviews"
          element={<CandidateInterviews />}
        />
        <Route
          path="/candidate/results"
          element={<CandidateResults />}
        />
        <Route
          path="/candidate/preparation"
          element={<CandidatePreparation />}
        />
        <Route
          path="/candidate/interview/:id"
          element={<CandidateInterview   />}
        />
        <Route
          path="/recruiter/analytics"
          element={<RecruiterAnalytics />}
        />



        {/* Default */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App