export const ERROR_MESSAGES = {
  SERVER_ERROR: "An error occurred, please try again later.",
  VALIDATION_ERROR: "Validation error occurred.",
  EMAIL_EXIST: "Email already exists.",
  USER_NAME_EXIST: "Username already exists.",
  EMAIL_NOT_EXIST: "Email not found.",
  OTP_EXPIRE: "Your One-Time Password has expired. Please request a new one.",
  INVALID_OTP: "The OTP you entered is incorrect. Please try again.",
  NO_COOKIES: "Please register first.",
  INVALID_CREDENTIALS:
    "Invalid credentials. Please check your email or password.",
  REFRESH_TOKEN_REQUIRED: "Refresh token required.",
  NOT_AUTHENTICATED: "Not authenticated. Please log in again.",
  GOOGLE_LOGIN_FAILED: "Google login failed. Please try again.",
  GOOGLE_AUTH_ERROR: "Error during Google authentication.",
  GOOGLE_TOKEN_INVALID: "Invalid Google token. Please try again.",
  REQUIRED_ID: "Id required.",
  RESUME_REQUIRED: "Resume is required",
  USER_BLOCKED: "User blocked by admin.",
  INVALID_REFRESH_TOKEN: "Invalid refresh token",
  NO_REFRESH_TOKEN: "No valid refresh token found",
  EMPLOYER_NOT_FOUND: "Employer not found",
  CLOUDINARY_ERROR: "Failed to upload file to Cloudinary",
  EMPLOYER_VERIFY_ERROR:
    "Cannot verify employer: CIN number and Business License are required.",
  EMPLOYER_REJECTION_ERROR: "Cannot send rejection mail to Employer.",
  INVALID_DEADLINE: "Invalid deadline date",
  FUTURE_DEADLINE: "Deadline must be in the future",
  EMPLOYER_VERIFICATION_FAILED:
    "You cannot perform this action. Complete your company verification to post or manage jobs.",
  EMPOYER_ID: "Employer ID is required",
  JOB_ID: "Job ID is required",
  JOB_NOT_FOUND: "Job not found",
  DEADLINE_PASSED: "Application deadline has passed",
  JOB_INACTIVE: "Job is no longer active",
  JOB_CONFLICT: "Already applied to this job",
} as const;

export const SUCCESS_MESSAGES = {
  USER_REGISTERED: "User registered successfully.",
  LOGIN_SUCCESS: "Login successful.",
  LOGOUT_SUCCESS: "Logout successful.",
  SEND_OTP_TO_MAIL: "OTP sent to registered email successfully.",
  OTP_VERIFIED: "OTP verified successfully.",
  PASSWORD_RESET_SUCCESS: "Password reset successfully.",
  GOOGLE_LOGIN_SUCCESS: "Google login successful.",
  GOOGLE_LOGOUT_SUCCESS: "Google logout successful.",
  FETCH_SUCCESS: "Fetched all users.",
  STATUS_UPDATED: "Status updated successfully.",
  CANDIDATE_FETCHED: "Candidate profile fetched successfully.",
  EMPLOYER_FETCHED: "Employer profile fetched successfully.",
  CANDIDATE_UPDATED: "Candidate profile updated successfully",
  EMPLOYER_UPDATED: "Employer profile updated successfully",
  JOB_POST_SUCCESS: "Job posted successfully",
  JOB_UPDATED: "Job updated",
  APPLICATION_CREATED: "Application submitted successfully",
} as const;

export const USER_ROLES = {
  CANDIDATE: "Candidate",
  EMPLOYER: "Employer",
  ADMIN: "Admin",
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
