import React, { useState } from "react";
import {
  Upload,
  X,
  FileText,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import type {
  Experience,
  Education,
  Certification,
} from "../../types/candidate/candidate.types";
import { toast } from "react-toastify";
import { api } from "../../api/api";
import { API_ROUTES } from "../../shared/constants";
import { useAppSelector } from "../../hooks/hooks";

interface ProfileModalProps {
  type:
    | "experience"
    | "education"
    | "certifications"
    | "resume"
    | "profileImage";
  item: Experience | Education | Certification | null;
  onSave?: (
    type: "experience" | "education" | "certifications",
    data: Experience | Education | Certification,
  ) => void;
  onClose: () => void;
  onProfileUpdate?: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  type,
  item,
  onSave,
  onClose,
  onProfileUpdate,
}) => {
  const auth = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState<
    Experience | Education | Certification
  >(
    item ||
      (type === "experience"
        ? {
            id: "",
            title: "",
            company: "",
            location: "",
            startDate: "",
            endDate: null,
            description: "",
            current: false,
          }
        : type === "education"
          ? {
              id: "",
              degree: "",
              institution: "",
              location: "",
              startDate: "",
              endDate: "",
              gpa: null,
            }
          : {
              id: "",
              name: "",
              issuer: "",
              date: "",
              credentialId: "",
            }),
  );
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (field: string, value: string | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "resume" || type === "profileImage") {
      if (!file) {
        toast.error(
          `Please select a ${type === "resume" ? "resume" : "image"} file`,
        );
        return;
      }
      if (!auth.user?._id) {
        toast.error("User not authenticated");
        return;
      }
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append(type, file);
        await api.put(API_ROUTES.CANDIDATE.PROFILE(auth.user._id), formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(
          `${type === "resume" ? "Resume" : "Profile image"} uploaded successfully!`,
        );
        if (onProfileUpdate) {
          onProfileUpdate();
        }
        onClose();
      } catch (error: any) {
        toast.error(
          `Failed to upload ${type === "resume" ? "resume" : "profile image"}: ${
            error.response?.data?.message || "Unknown error"
          }`,
        );
      } finally {
        setIsUploading(false);
      }
      return;
    }

    if (type === "experience") {
      const exp = formData as Experience;
      if (!exp.title || !exp.company || !exp.startDate) {
        toast.error("Title, company, and start date are required");
        return;
      }
    } else if (type === "education") {
      const edu = formData as Education;
      if (!edu.degree || !edu.institution || !edu.startDate || !edu.endDate) {
        toast.error(
          "Degree, institution, start date, and end date are required",
        );
        return;
      }
    } else if (type === "certifications") {
      const cert = formData as Certification;
      if (!cert.name || !cert.issuer || !cert.date) {
        toast.error("Name, issuer, and date are required");
        return;
      }
    }

    if (onSave) {
      onSave(type as "experience" | "education" | "certifications", formData);
    }
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (type === "resume") {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Please upload a PDF or DOC file");
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setFile(selectedFile);
      toast.success("Resume selected successfully!");
    } else if (type === "profileImage") {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Please upload a PNG, JPEG, or JPG file");
        return;
      }
      const maxSize = 2 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      toast.success("Image selected successfully!");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setImagePreview(null);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {type === "profileImage"
              ? item
                ? "Edit Profile Image"
                : "Upload Profile Image"
              : item
                ? `Edit ${type}`
                : `Add ${type}`}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "resume" || type === "profileImage" ? (
            <div className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                {!file ? (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-700 font-medium mb-2">
                      Drag and drop your{" "}
                      {type === "resume" ? "resume" : "image"} here
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                      or click to browse
                    </p>
                    <label className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors">
                      Choose File
                      <input
                        type="file"
                        accept={
                          type === "resume"
                            ? ".pdf,.doc,.docx"
                            : ".png,.jpeg,.jpg"
                        }
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-4">
                      Supported formats:{" "}
                      {type === "resume"
                        ? "PDF, DOC, DOCX (Max 5MB)"
                        : "PNG, JPEG, JPG (Max 2MB)"}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      {type === "profileImage" && imagePreview ? (
                        <div className="flex items-center space-x-3">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="text-left">
                            <p className="font-semibold text-gray-900 text-sm">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-600 p-2 rounded-lg">
                            {type === "resume" ? (
                              <FileText className="w-6 h-6 text-white" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-gray-900 text-sm">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-red-600 hover:text-red-800 p-1"
                          disabled={isUploading}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  {type === "resume" ? (
                    <FileText className="w-4 h-4 mr-2 text-blue-600" />
                  ) : (
                    <ImageIcon className="w-4 h-4 mr-2 text-blue-600" />
                  )}
                  {type === "resume" ? "Resume" : "Profile Image"} Guidelines
                </h4>
                <ul className="text-sm text-gray-700 space-y-1 ml-6 list-disc">
                  {type === "resume" ? (
                    <>
                      <li>Use a professional format (PDF recommended)</li>
                      <li>Keep it concise (1-2 pages)</li>
                      <li>Include relevant experience and skills</li>
                      <li>Proofread for errors</li>
                    </>
                  ) : (
                    <>
                      <li>Use a high-quality image (PNG, JPEG, JPG)</li>
                      <li>Ensure the image is clear and professional</li>
                      <li>Keep file size under 2MB</li>
                      <li>Recommended dimensions: 512x512 pixels</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          ) : type === "experience" ? (
            <>
              <input
                type="text"
                value={(formData as Experience).title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Job Title"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                value={(formData as Experience).company}
                onChange={(e) => handleChange("company", e.target.value)}
                placeholder="Company"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                value={(formData as Experience).location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Location"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                value={(formData as Experience).startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                placeholder="Start Date (YYYY-MM)"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                <input
                  type="checkbox"
                  checked={(formData as Experience).current}
                  onChange={(e) => handleChange("current", e.target.checked)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700 font-medium">
                  I currently work here
                </label>
              </div>
              {!(formData as Experience).current && (
                <input
                  type="text"
                  value={(formData as Experience).endDate || ""}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  placeholder="End Date (YYYY-MM)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
              <textarea
                value={(formData as Experience).description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Description"
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </>
          ) : type === "education" ? (
            <>
              <input
                type="text"
                value={(formData as Education).degree}
                onChange={(e) => handleChange("degree", e.target.value)}
                placeholder="Degree"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                value={(formData as Education).institution}
                onChange={(e) => handleChange("institution", e.target.value)}
                placeholder="Institution"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                value={(formData as Education).location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Location"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                value={(formData as Education).startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                placeholder="Start Date (YYYY-MM)"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                value={(formData as Education).endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                placeholder="End Date (YYYY-MM)"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                value={(formData as Education).gpa || ""}
                onChange={(e) => handleChange("gpa", e.target.value || null)}
                placeholder="GPA (optional)"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </>
          ) : (
            <>
              <input
                type="text"
                value={(formData as Certification).name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Certification Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                value={(formData as Certification).issuer}
                onChange={(e) => handleChange("issuer", e.target.value)}
                placeholder="Issuer"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                value={(formData as Certification).date}
                onChange={(e) => handleChange("date", e.target.value)}
                placeholder="Issue Date (YYYY-MM)"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                value={(formData as Certification).credentialId}
                onChange={(e) => handleChange("credentialId", e.target.value)}
                placeholder="Credential ID"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-colors"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:bg-blue-400"
              disabled={isUploading}
            >
              {isUploading
                ? "Uploading..."
                : type === "resume" || type === "profileImage"
                  ? "Upload"
                  : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
