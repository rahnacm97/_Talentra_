//Validating full name
export const validateFullName = (fullName: string): string | null => {
  if (!fullName.trim()) return "Full name is required";
  if (fullName.length < 3) return "Full name must be at least 3 characters";
  return null;
};
//Email validation
export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return "Email is required";
  if (!emailRegex.test(email)) return "Invalid email format";
  return null;
};
//Phone num validation
export const validatePhoneNumber = (phone: string): string | null => {
  const phoneRegex = /^[0-9]{10}$/;
  if (!phone.trim()) return "Phone number is required";
  if (!phoneRegex.test(phone)) return "Invalid phone number";
  return null;
};
//Password validation
export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one number";
  if (!/[^A-Za-z0-9]/.test(password))
    return "Password must contain a special character";
  return null;
};
//Password confirmation
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): string | null => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
};
