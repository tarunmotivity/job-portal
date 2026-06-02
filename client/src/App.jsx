import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import RecruiterDashboard from "./pages/Recruiter/RecruiterDashboard";
import CandidateDashboard from "./pages/Candidate/CandidateDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Applicants from "./pages/Recruiter/Applicants";
import CandidateApplications from "./pages/Candidate/CandidateApplications";
import CandidateSavedJobs from "./pages/Candidate/CandidateSavedJobs";
import CandidateInterviews from "./pages/Candidate/CandidateInterviews";
import RecruiterApproval from "./pages/Admin/RecruiterApproval";
import AdminCandidates from "./pages/Admin/AdminCandidates";
import AdminJobs from "./pages/Admin/AdminJobs";  
import RecruiterTalentPool from "./pages/Recruiter/RecruiterTalentPool";
import RecruiterAnalytics from "./pages/Recruiter/RecruiterAnalytics";
import RecruiterInterviews from "./pages/Recruiter/RecruiterInterviews";
import OAuthSuccess from "./pages/Auth/OAuthSuccess";
import SelectRole from "./pages/Auth/SelectRole";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/oauth-success" element={<OAuthSuccess />} />

        <Route path="/select-role" element={<SelectRole />} />

        <Route
          path="/recruiter/applicants/:jobId"
          element={
            <ProtectedRoute role="recruiter">
              <Applicants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/recruiter/*"
          element={
            <ProtectedRoute role="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/*"
          element={
            <ProtectedRoute role="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/recruiters" element=
        {<ProtectedRoute role="admin">
          <RecruiterApproval />
        </ProtectedRoute>} />
        <Route path="/admin/candidates" element=
        {<ProtectedRoute role="admin">
          <AdminCandidates />
        </ProtectedRoute>} />
        <Route path="/admin/jobs" element=
        {<ProtectedRoute role="admin">
          <AdminJobs />
        </ProtectedRoute>} />

        <Route path="/candidate/saved" element={
          <ProtectedRoute role="candidate">
            <CandidateSavedJobs />
          </ProtectedRoute>
        } />
       <Route path="/candidate/interviews" element={
          <ProtectedRoute role="candidate">
            <CandidateInterviews />
          </ProtectedRoute>
        } />
        <Route path="/candidate/applications" element={
          <ProtectedRoute role="candidate">
            <CandidateApplications />
          </ProtectedRoute>
        } />


        <Route path="/recruiter/talentpool" element={
          <ProtectedRoute role="recruiter">
            <RecruiterTalentPool />
          </ProtectedRoute>
        } />
       <Route path="/recruiter/analytics" element={
          <ProtectedRoute role="recruiter">
            <RecruiterAnalytics />
          </ProtectedRoute>
        } />
        <Route path="/recruiter/interviews" element={
          <ProtectedRoute role="recruiter">
            <RecruiterInterviews />
          </ProtectedRoute>
        } /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;