import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  LogIn,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import GoogleSignInButton from "../common/auth/GoogleSignInButton";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useNavigate } from "react-router-dom";
import { login } from "../../thunks/auth.thunk";
import type { LoginErrors } from "../../types/auth/Auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: LoginErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email (e.g., example@domain.com)";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!validateForm()) return;

    dispatch(login(formData))
      .unwrap()
      .then(() => {
        navigate(FRONTEND_ROUTES.HOME, { replace: true });
      })
      .catch((err) => {
        if (err === "You have been blocked by the admin") {
          toast.error(
            "Access denied — your account has been blocked by the admin.",
          );
        } else if (err === "Invalid credentials") {
          toast.error("Invalid email or password. Please try again.");
        } else {
          toast.error(err || "Login failed");
        }
      });
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-6 lg:mb-8">
        <div className="bg-blue-50 p-3 rounded-full inline-block mb-4">
          <LogIn className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-600 text-sm lg:text-base">
          Sign in to your account to continue
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={`w-full px-4 py-3 pl-12 text-sm lg:text-base border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 bg-gray-50 focus:bg-white ${
                errors.email
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
            />
            <Mail
              className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${
                errors.email ? "text-red-400" : "text-gray-400"
              }`}
            />
            {errors.email && (
              <AlertCircle className="w-5 h-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
            )}
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" /> {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full px-4 py-3 pl-12 pr-12 text-sm lg:text-base border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 bg-gray-50 focus:bg-white ${
                errors.password
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
            />
            <Lock
              className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${
                errors.password ? "text-red-400" : "text-gray-400"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" /> {errors.password}
            </p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="flex items-center justify-between">
          <div></div>

          <Link
            to="/forgot-password"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <LogIn className="w-5 h-5" />
            </>
          )}
        </button>

        {/* {error && (
          <p className="mt-3 text-red-600 text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" /> {error}
          </p>
        )} */}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              or continue with
            </span>
          </div>
        </div>
        <GoogleSignInButton />
      </form>

      {/* Footer */}
      <div className="mt-6 lg:mt-8 space-y-4">
        <div className="text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Sign Up
          </Link>{" "}
          |{" "}
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Back To Home
          </Link>
        </div>
        <div className="text-center text-xs text-gray-500">
          Need help?{" "}
          <button className="text-blue-600 hover:text-blue-500 font-medium">
            Contact support
          </button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center">
          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
          <p className="text-xs text-green-800">
            Your connection is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
