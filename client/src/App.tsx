import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
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
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCandidates from "./pages/admin/AdminCandidate";
import AdminEmployers from "./pages/admin/AdminEmployer";
import AuthSuccess from "./pages/auth/AuthSuccess";
import CandidateProfile from "./pages/candidate/CandidateProfile";
import EmployerProfile from "./pages/employer/EmployerProfile";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";
import { FRONTEND_ROUTES } from "./shared/constants";
import AuthRouteGuard from "./components/common/AuthRouteGuard";
import NavigationProvider from "./components/common/NavigationProvider";

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
            <Route
              path={FRONTEND_ROUTES.VERIFY_OTP}
              element={
              
                  <VerifyOtp />
              
              }
            />
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
              path={FRONTEND_ROUTES.CANDIDATEPROFILE}
              element={
                <ProtectedRoute>
                  <CandidateProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path={FRONTEND_ROUTES.EMPLOYERPROFILE}
              element={
                <ProtectedRoute>
                  <EmployerProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path={FRONTEND_ROUTES.AUTHSUCCESS}
              element={<AuthSuccess />}
            />
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
            </Route>
            <Route path="*" element={<Navigate to={FRONTEND_ROUTES.HOME} />} />
          </Routes>
        </AuthRouteGuard>
      </Router>
    </>
  );
};

export default App;
