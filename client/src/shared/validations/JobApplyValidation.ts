export interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  resume?: string;
}

export interface JobApplyFormData {
  fullName: string;
  email: string;
  phone: string;
  resume: File | null;
  coverLetter?: string;
}

export const validateJobApplyForm = (data: JobApplyFormData): FormErrors => {
  const errs: FormErrors = {};

  if (!data.fullName.trim()) {
    errs.fullName = "Full name is required";
  }

  if (!data.email.trim()) {
    errs.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errs.email = "Invalid email format";
  }

  const cleanPhone = data.phone.replace(/\D/g, "");
  if (!data.phone.trim()) {
    errs.phone = "Phone number is required";
  } else if (!/^\d{10}$/.test(cleanPhone)) {
    errs.phone = "Enter a valid phone number (10 digits)";
  }

  if (!data.resume) {
    errs.resume = "Resume is required";
  } else {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024;

    if (!allowed.includes(data.resume.type)) {
      errs.resume = "Only PDF, DOC or DOCX files are allowed";
    } else if (data.resume.size > maxSize) {
      errs.resume = "File size must be under 5 MB";
    }
  }

  return errs;
};
