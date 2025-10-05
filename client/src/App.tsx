import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAppDispatch } from "./hooks/hooks";
import { loginSuccess } from "./features/auth/authSlice";
import { adminLoginSuccess } from "./features/admin/adminAuthSlice";
import "react-toastify/dist/ReactToastify.css";

//import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";

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

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (user && accessToken && refreshToken) {
      dispatch(loginSuccess({ user, accessToken, refreshToken }));
    }
  }, [dispatch]);

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin") || "null");
    const accessToken = localStorage.getItem("adminAccessToken");
    const refreshToken = localStorage.getItem("adminRefreshToken");

    if (admin && accessToken && refreshToken) {
      dispatch(
        adminLoginSuccess({
          admin,
          accessToken,
          refreshToken,
        }),
      );
    }
  }, [dispatch]);

  return (
    <>
      <Router>
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
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/verify"
            element={
              <PublicRoute>
                <VerifyOtp />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/admin-signin"
            element={
              <PublicRoute>
                <AdminSignIn />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Homepage />
              </PublicRoute>
            }
          />
          <Route path="/auth-success" element={<AuthSuccess />} />

          {/* Admin Routes (Protected) */}
          <Route
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-candidates" element={<AdminCandidates />} />
            <Route path="/admin-employers" element={<AdminEmployers />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
