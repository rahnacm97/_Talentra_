import React, { useState, useRef, useEffect } from "react";
import { X, CheckCircle, Upload, FileText, AlertCircle } from "lucide-react";
import type { FormErrors } from "../../shared/validations/JobApplyValidation";

interface JobApplyModalProps {
  jobTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (formData: FormData) => Promise<void>;
  profile?: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    resume?: string;
    updatedAt?: string;
  };
}

export const JobApplyModal: React.FC<JobApplyModalProps> = ({
  jobTitle,
  isOpen,
  onClose,
  onSubmit,
  profile,
}) => {
  console.log("Profile in JobApplyModal:", profile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadNew, setUploadNew] = useState(false);
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "Unknown";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const profileResumeUrl = profile?.resume;
  const profileResumeDate = profile?.updatedAt;

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
      setErrors({});
      setFile(null);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (profile?.resume && !uploadNew) {
      setUploadNew(false);
    }
  }, [profile?.resume, uploadNew]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting || submitted) return;

    setIsSubmitting(true);
    setErrors({});

    const form = e.currentTarget;
    const fullName = (form.fullName.value ?? "").trim();
    const email = (form.email.value ?? "").trim();
    const phone = (form.phone.value ?? "").trim();
    const coverLetter = form.coverLetter.value ?? "";

    // Manual validation (skip resume check if using existing)
    const newErrors: FormErrors = {};
    if (!fullName) newErrors.fullName = "Full name is required";
    if (!email) newErrors.email = "Email is required";
    if (!phone) newErrors.phone = "Phone is required";

    // Only validate resume if uploading new one
    if (uploadNew && !file) {
      newErrors.resume = "Please upload a resume";
    }
    // If not uploadNew → we use existing → no resume file needed
    else if (!uploadNew && !profileResumeUrl) {
      newErrors.resume = "No saved resume found. Please upload one.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    if (coverLetter) formData.append("coverLetter", coverLetter);

    if (uploadNew && file) {
      formData.append("resume", file);
    } else {
      // Using existing resume
      formData.append("useExistingResume", "true");
    }

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }

      setSubmitted(true);
      timeoutRef.current = setTimeout(() => {
        setSubmitted(false);
        setIsSubmitting(false);
        onClose();
        timeoutRef.current = null;
      }, 2000);
    } catch (error: any) {
      console.error("Application failed:", error);
      setErrors({
        resume: error.message || "Failed to apply. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleFileSelect = (selected: File) => {
    setErrors((prev) => ({ ...prev, resume: undefined }));
    setFile(selected);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Application Submitted!
            </h3>
            <p className="text-gray-600 text-sm">We'll get back to you soon.</p>
          </div>
        ) : (
          <>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-5 pr-10">
              Apply for {jobTitle}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    name="fullName"
                    type="text"
                    placeholder="Full Name *"
                    defaultValue={profile?.name || ""}
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.fullName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-200"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email *"
                    defaultValue={profile?.email || ""}
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-200"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone *"
                  defaultValue={profile?.phoneNumber || ""}
                  className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-200"
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Resume <span className="text-red-500">*</span>
                </label>

                {/* Option 1: Use existing resume (DEFAULT if exists) */}
                {profileResumeUrl ? (
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 mb-3">
                    <input
                      type="radio"
                      name="resumeOption"
                      value="existing"
                      checked={!uploadNew}
                      onChange={() => setUploadNew(false)}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Use saved resume
                      </p>
                      <p className="text-xs text-gray-500">
                        Last updated: {formatDate(profileResumeDate || "")}
                      </p>
                    </div>
                    <FileText className="w-5 h-5 text-green-600" />
                  </label>
                ) : null}

                {/* Show preview only when "use existing" is selected */}
                {!uploadNew && profileResumeUrl && (
                  <div className="mt-2 p-4 border-2 border-dashed border-green-300 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-10 h-10 text-green-600" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            Your current resume
                          </p>
                          <p className="text-sm text-gray-600">
                            Last updated: {formatDate(profileResumeDate || "")}
                          </p>
                        </div>
                      </div>
                      <a
                        href={profileResumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline text-sm font-medium"
                      >
                        View
                      </a>
                    </div>
                  </div>
                )}

                {/* Option 2: Upload new */}
                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="resumeOption"
                    value="new"
                    checked={uploadNew}
                    onChange={() => setUploadNew(true)}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    Upload new resume
                  </span>
                </label>

                {uploadNew && (
                  <div className="mt-3">
                    {!file ? (
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors text-sm ${
                          dragActive
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-xs">
                          <span className="font-medium text-indigo-600">
                            Click or drop
                          </span>{" "}
                          (PDF, DOC, DOCX, max 5 MB)
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) =>
                            e.target.files?.[0] &&
                            handleFileSelect(e.target.files[0])
                          }
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg text-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="w-6 h-6 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900 truncate max-w-[180px]">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(1)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {errors.resume && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.resume}
                  </p>
                )}
              </div>

              <div>
                <textarea
                  name="coverLetter"
                  rows={3}
                  placeholder="Cover Letter (Optional)"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-all cursor-pointer"
              >
                Submit Application
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
