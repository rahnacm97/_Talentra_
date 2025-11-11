import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { adminLogin } from "../../thunks/auth.thunk";
import { loginSuccess } from "../../features/auth/authSlice";
import type { AdminLoginErrors } from "../../types/admin/admin.types";
import { Eye, EyeOff, Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../shared/constants";
import Cookies from "js-cookie";
import ScreenLeft from "../../components/common/AuthLeft";

const AdminSignIn: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<AdminLoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: AdminLoginErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(adminLogin(formData))
      .unwrap()
      .then((res) => {
        dispatch(
          loginSuccess({
            user: res.user,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          }),
        );
        Cookies.set("refreshToken", res.refreshToken, {
          expires: 7,
          sameSite: "Lax",
        });
        navigate(FRONTEND_ROUTES.ADMIN_DASHBOARD);
      })
      .catch((error) => {
        console.error("Login failed:", error);
        setErrors({ email: error, password: error });
      });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ScreenLeft />
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="text-center mb-6 lg:mb-8">
            <div className="bg-blue-50 p-2 sm:p-3 rounded-full inline-block mb-3 lg:mb-4">
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              Admin Portal
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@company.com"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white pr-10 sm:pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 sm:py-3 px-4 rounded-lg text-sm sm:text-base transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            {error && <p className="text-red-500 text-center text-sm mt-2"></p>}
          </form>

          <div className="mt-6 lg:mt-8 text-center">
            <p className="text-sm sm:text-base text-gray-600">
              Need user access?{" "}
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
              >
                User Sign Up
              </Link>
            </p>
          </div>

          <div className="mt-4 lg:mt-6 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800 text-center">
              🔒 This is a secure admin portal. All activities are monitored and
              logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
