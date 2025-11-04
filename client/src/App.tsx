import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAuthInitialiazer } from "./hooks/hooks";
import "react-toastify/dist/ReactToastify.css";
import PublicRoute from "./components/common/PublicRoute";
import Homepage from "./pages/common/HomePage";
import AdminSignIn from "./pages/admin/AdminSignin";
import Signup from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AdminLayout from "./layout/admin/AdminLayout";
import CandidateLayout from "./layout/candidate/CandidateLayout";
import EmployerLayout from "./layout/employer/EmployerLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCandidates from "./pages/admin/AdminCandidate";
import AdminEmployers from "./pages/admin/AdminEmployer";
import AuthSuccess from "./pages/auth/AuthSuccess";
import CandidateProfile from "./pages/candidate/CandidateProfile";
import EmployerProfile from "./pages/employer/EmployerProfile";
import AdminCandidateView from "./pages/admin/AdminCandidateView";
import AdminEmployerView from "./pages/admin/AdminEmployerView";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";
import { FRONTEND_ROUTES } from "./shared/constants/constants";
import AuthRouteGuard from "./components/common/AuthRouteGuard";
import NavigationProvider from "./components/common/NavigationProvider";
import EmployerJobs from "./pages/employer/EmployerJobs";
import EmployerApplicants from "./pages/employer/EmployerApplicants";
import EmployerAnalytics from "./pages/employer/EmployerAnalytics";
import CandidateApplications from "./pages/candidate/CandidateApplications";
import EmployerSettings from "./pages/employer/EmployerSettings";
import CandidateSavedJobs from "./pages/candidate/CandidateSavedjobs";
import CandidateNotifications from "./pages/candidate/CandidateNotifications";
import CandidateSettings from "./pages/candidate/CandidateSettings";
import EmployerInterview from "./pages/employer/EmployerInterview";
import EmployerNotifications from "./pages/employer/EmployerNotifications";
import CandidateInterviews from "./pages/candidate/CandidateInterviews";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminSettings from "./pages/admin/AdminSettings";
import JobsView from "./pages/job/JobView";
import NotFound from "./pages/common/NotFound";
import JobDetails from "./pages/job/JobDetails";

const App: React.FC = () => {
  useAuthInitialiazer();
  return (
    <>
      <Router>
        <NavigationProvider />
        <AuthRouteGuard>
          <ToastContainer
            position="top-right"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            style={{ width: "320px" }}
            toastStyle={{
              borderRadius: "0.75rem",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            }}
          />

          <Routes>
            <Route path={FRONTEND_ROUTES.LOGIN} element={<Login />} />
            <Route path={FRONTEND_ROUTES.SIGNUP} element={<Signup />} />
            <Route path={FRONTEND_ROUTES.VERIFY_OTP} element={<VerifyOtp />} />
            <Route
              path={FRONTEND_ROUTES.FORGOT_PASSWORD}
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path={FRONTEND_ROUTES.RESET_PASSWORD}
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
            />
            <Route
              path={FRONTEND_ROUTES.ADMINLOGIN}
              element={
                <PublicRoute>
                  <AdminSignIn />
                </PublicRoute>
              }
            />
            <Route
              path={FRONTEND_ROUTES.HOME}
              element={
                <PublicRoute>
                  <Homepage />
                </PublicRoute>
              }
            />
            <Route
              path={FRONTEND_ROUTES.AUTHSUCCESS}
              element={<AuthSuccess />}
            />
            <Route
              path={FRONTEND_ROUTES.JOBVIEW}
              element={
                <ProtectedRoute>
                  <JobsView />
                </ProtectedRoute>
              }
            />
            <Route
              path={FRONTEND_ROUTES.JOBDETAILS}
              element={
                <ProtectedRoute>
                  <JobDetails />
                </ProtectedRoute>
              }
            />
            <Route
              element={
                <ProtectedRoute>
                  <CandidateLayout />
                </ProtectedRoute>
              }
            >
              <Route
                path={FRONTEND_ROUTES.CANDIDATEPROFILE}
                element={<CandidateProfile />}
              />
              <Route
                path={FRONTEND_ROUTES.CANDIDATEAPPLICATIONS}
                element={<CandidateApplications />}
              />
              <Route
                path={FRONTEND_ROUTES.CANDIDATEINTERVIEW}
                element={<CandidateInterviews />}
              />
              <Route
                path={FRONTEND_ROUTES.CANDIDATESAVEDJOBS}
                element={<CandidateSavedJobs />}
              />
              <Route
                path={FRONTEND_ROUTES.CANDIDATENOTIFICATIONS}
                element={<CandidateNotifications />}
              />
              <Route
                path={FRONTEND_ROUTES.CANDIDATESETTINGS}
                element={<CandidateSettings />}
              />
            </Route>

            <Route
              element={
                <ProtectedRoute>
                  <EmployerLayout />
                </ProtectedRoute>
              }
            >
              <Route
                path={FRONTEND_ROUTES.EMPLOYERPROFILE}
                element={<EmployerProfile />}
              />
              <Route
                path={FRONTEND_ROUTES.EMPLOYERJOBS}
                element={<EmployerJobs />}
              />
              <Route
                path={FRONTEND_ROUTES.EMPLOYERAPPLICANTS}
                element={<EmployerApplicants />}
              />
              <Route
                path={FRONTEND_ROUTES.EMPLOYERANALYTICS}
                element={<EmployerAnalytics />}
              />
              <Route
                path={FRONTEND_ROUTES.EMPLOYERINTERVIEWS}
                element={<EmployerInterview />}
              />
              <Route
                path={FRONTEND_ROUTES.EMPLOYERNOTIFICATIONS}
                element={<EmployerNotifications />}
              />
              <Route
                path={FRONTEND_ROUTES.EMPLOYERSETTINGS}
                element={<EmployerSettings />}
              />
            </Route>

            <Route
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route
                path={FRONTEND_ROUTES.ADMIN_DASHBOARD}
                element={<AdminDashboard />}
              />
              <Route
                path={FRONTEND_ROUTES.ADMINCANDIDATES}
                element={<AdminCandidates />}
              />
              <Route
                path={FRONTEND_ROUTES.ADMINEMPLOYERS}
                element={<AdminEmployers />}
              />
              <Route
                path={FRONTEND_ROUTES.ADMINCANDIDATEVIEW}
                element={<AdminCandidateView />}
              />
              <Route
                path={FRONTEND_ROUTES.ADMINEMPLOYERVIEW}
                element={<AdminEmployerView />}
              />
              <Route path={FRONTEND_ROUTES.ADMINJOBS} element={<AdminJobs />} />
              <Route
                path={FRONTEND_ROUTES.ADMINNOTIFICATIONS}
                element={<AdminNotifications />}
              />
              <Route
                path={FRONTEND_ROUTES.ADMINSETTINGS}
                element={<AdminSettings />}
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthRouteGuard>
      </Router>
    </>
  );
};

export default App;
