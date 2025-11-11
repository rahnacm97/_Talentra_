import React, { useState, useEffect } from "react";
import {
  Mail,
  Shield,
  Clock,
  RefreshCcw,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/hooks";
import { verifyOtp, sendOtp } from "../../thunks/auth.thunk";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

import { useLocation, useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../shared/constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpExpiration, setOtpExpiration] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const storedEmail = useSelector(
    (state: RootState) => state.auth.forgotPasswordEmail,
  );

  const { email: locationEmail, purpose } = location.state || {
    email: storedEmail || "",
    purpose: storedEmail ? "forgot-password" : "signup",
  };

  const email = locationEmail || storedEmail;

  useEffect(() => {
    setOtpExpiration(60);
  }, [email, purpose]);

  useEffect(() => {
    let otpTimer: ReturnType<typeof setInterval>;
    if (otpExpiration > 0) {
      otpTimer = setInterval(() => {
        setOtpExpiration((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(otpTimer);
  }, [otpExpiration]);

  useEffect(() => {
    let resendTimer: ReturnType<typeof setInterval>;
    if (resendCooldown > 0) {
      resendTimer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(resendTimer);
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || "";
    }
    setOtp(newOtp);
    setError("");

    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    const targetInput = document.getElementById(`otp-${lastFilledIndex}`);
    targetInput?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    if (otpExpiration <= 0) {
      setError("OTP has expired. Please request a new one.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const resultAction = await dispatch(
        verifyOtp({ email, otp: otpString, purpose }),
      );

      setLoading(false);

      if (verifyOtp.fulfilled.match(resultAction)) {
        toast.success("Successfully verified OTP!");

        if (purpose === "forgot-password") {
          navigate(FRONTEND_ROUTES.RESET_PASSWORD, {
            state: { email, purpose: "forgot-password" },
          });
        } else {
          navigate(FRONTEND_ROUTES.LOGIN, { state: { email } });
        }
      } else {
        setError((resultAction.payload as string) || "Invalid OTP");
      }
    } catch {
      setLoading(false);
      setError("Something went wrong. Try again!");
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setError("");

    try {
      const resultAction = await dispatch(sendOtp({ email, purpose }));

      setIsResending(false);

      if (sendOtp.fulfilled.match(resultAction)) {
        setResendCooldown(30);
        setOtpExpiration(60);
        setOtp(["", "", "", "", "", ""]);
        toast.success("New OTP sent!");
      } else {
        setError((resultAction.payload as string) || "Failed to resend OTP");
      }
    } catch {
      setIsResending(false);
      setError("Something went wrong. Try again!");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getExpirationStatus = () => {
    if (otpExpiration <= 0)
      return { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" };
    if (otpExpiration <= 30)
      return { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50" };
    return { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" };
  };

  const isOtpComplete = otp.every((digit) => digit !== "");
  const status = getExpirationStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-fit">
          <button
            onClick={() => navigate(FRONTEND_ROUTES.LOGIN)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors duration-200 group"
          >
            <ArrowBackIcon className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Back to Sign In</span>
          </button>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
              <div className="bg-white/20 p-3 rounded-full inline-block mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {purpose === "forgot-password"
                  ? "Verify OTP"
                  : "Email Verification"}
              </h2>
              <p className="text-blue-100 text-sm">
                Enter the verification code to continue
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Sent to
                  </p>
                  <p className="text-sm font-medium text-gray-900">{email}</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {purpose === "forgot-password"
                    ? "We sent a 6-digit verification code to reset your password."
                    : "We sent a 6-digit verification code to verify your email address and activate your account."}
                </p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 text-center">
                  Enter Verification Code
                </label>
                <div className="flex justify-center space-x-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className={`w-12 h-12 text-center text-lg font-bold border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                        error
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : digit
                            ? "border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-200"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      } focus:ring-4`}
                      maxLength={1}
                      disabled={loading}
                    />
                  ))}
                </div>

                {error && (
                  <div className="flex items-center justify-center space-x-2 text-red-600">
                    <AlertTriangle className="w-4 h-4" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}
              </div>

              {/* Timer Status */}
              <div
                className={`p-4 rounded-lg ${status.bg} border border-current border-opacity-20`}
              >
                <div className="flex items-center space-x-3">
                  <status.icon className={`w-5 h-5 ${status.color}`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${status.color}`}>
                      {otpExpiration > 0 ? "Code expires in" : "Code expired"}
                    </p>
                    <p className={`text-lg font-bold ${status.color}`}>
                      {otpExpiration > 0 ? formatTime(otpExpiration) : "00:00"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerify}
                disabled={loading || !isOtpComplete}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify My Account</span>
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Resend Section */}
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || isResending}
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <RefreshCcw
                    className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`}
                  />
                  <span>
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : isResending
                        ? "Sending..."
                        : "Resend Code"}
                  </span>
                </button>
              </div>

              {/* Help Text */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Check your spam folder if you don't see the email
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Having trouble? Contact our{" "}
              <button className="text-blue-600 hover:text-blue-500 font-medium">
                support team
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
