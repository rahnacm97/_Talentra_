import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  UserPlus,
  ArrowRight,
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  Check,
} from "lucide-react";
import ScreenLeft from "../../components/common/AuthLeft";
import {
  validateFullName,
  validateEmail,
  validatePhoneNumber,
  validatePassword,
  validateConfirmPassword,
} from "../../utils/helper";
import { Link } from "react-router-dom";
import { signup } from "../../thunks/auth.thunk";
import { useAppDispatch } from "../../hooks/hooks";
import type { SignupRequest } from "../../types/auth/Auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { sendOtp } from "../../thunks/auth.thunk";

const Signup: React.FC = () => {
  const [userType, setUserType] =
    useState<SignupRequest["userType"]>("Candidate");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === "password") {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let error = "";
    if (name === "fullName") error = validateFullName(value) || "";
    if (name === "email") error = validateEmail(value) || "";
    if (name === "phoneNumber") error = validatePhoneNumber(value) || "";
    if (name === "password") error = validatePassword(value) || "";
    if (name === "confirmPassword")
      error = validateConfirmPassword(formData.password, value) || "";

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameError = validateFullName(formData.fullName);
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhoneNumber(formData.phoneNumber);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword,
    );

    if (
      nameError ||
      emailError ||
      phoneError ||
      passwordError ||
      confirmPasswordError
    ) {
      return;
    }

    setIsLoading(true);

    dispatch(
      signup({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        userType,
      }),
    )
      .unwrap()

      .then(async () => {
        const resultAction = await dispatch(
          sendOtp({ email: formData.email, purpose: "signup" }),
        );
        if (sendOtp.fulfilled.match(resultAction)) {
          toast.success("OTP sent to your email!");
          navigate("/verify", {
            state: { email: formData.email, purpose: "signup" },
          });
        } else {
          toast.error((resultAction.payload as string) || "Failed to send OTP");
        }
      })
      .catch((err) => {
        toast.error(err);
        console.error("Signup failed:", err);
      });
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return { text: "Weak", color: "text-red-500" };
      case 2:
        return { text: "Fair", color: "text-yellow-500" };
      case 3:
        return { text: "Good", color: "text-blue-500" };
      case 4:
        return { text: "Strong", color: "text-green-500" };
      default:
        return { text: "", color: "" };
    }
  };

  const passwordMatch =
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ScreenLeft />

      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md lg:max-w-lg">
          <div className="text-center mb-6 lg:mb-8">
            <div className="bg-blue-50 p-3 rounded-full inline-block mb-4">
              <UserPlus className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600 text-sm lg:text-base">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
              >
                Log In
              </Link>{" "}
              |{" "}
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
              >
                Back To Home
              </Link>
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4 lg:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am registering as
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType("Candidate")}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-2 ${
                    userType === "Candidate"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Candidate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("Employer")}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-2 ${
                    userType === "Employer"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium">Employer</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-3 pl-12 text-sm lg:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                />
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-4 py-3 pl-12 text-sm lg:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    
                  />
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    placeholder="0000000000"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-4 py-3 pl-12 text-sm lg:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    
                  />
                  <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-3 pl-12 pr-12 text-sm lg:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex space-x-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded-full transition-colors duration-200 ${
                          passwordStrength >= level
                            ? passwordStrength === 1
                              ? "bg-red-400"
                              : passwordStrength === 2
                                ? "bg-yellow-400"
                                : passwordStrength === 3
                                  ? "bg-blue-400"
                                  : "bg-green-400"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${getPasswordStrengthText().color}`}>
                    Password strength: {getPasswordStrengthText().text}
                  </p>
                </div>
              )}
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 pl-12 pr-12 text-sm lg:text-base border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 bg-gray-50 focus:bg-white ${
                    formData.confirmPassword
                      ? passwordMatch
                        ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                        : "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && (
                <p
                  className={`text-xs mt-1 ${passwordMatch ? "text-green-600" : "text-red-600"}`}
                >
                  {passwordMatch ? (
                    <span className="flex items-center">
                      <Check className="w-4 h-4 mr-1" />
                      Passwords match
                    </span>
                  ) : (
                    "Passwords do not match"
                  )}
                </p>
              )}
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !passwordMatch}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg text-sm lg:text-base transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          <div className="mt-6 lg:mt-8 text-center">
            <p className="text-xs lg:text-sm text-gray-500">
              By creating an account, you're joining thousands of professionals
              finding their next opportunity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
