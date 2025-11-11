import React, { useState } from "react";
import {
  Upload,
  X,
  FileText,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../../api/api";
import { API_ROUTES } from "../../shared/constants/constants";
import { useAppSelector } from "../../hooks/hooks";
import type { EmployerProfileData } from "../../types/employer/employer.types";

interface EmployerModalProps {
  type: "license" | "profileImage";
  onClose: () => void;
  onProfileUpdate?: () => void;
  profileData: EmployerProfileData;
}

const EmployerModal: React.FC<EmployerModalProps> = ({
  type,
  onClose,
  onProfileUpdate,
  profileData,
}) => {
  const auth = useAppSelector((state) => state.auth);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (type === "license") {
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
      toast.success("License document selected successfully!");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error(
        `Please select a ${type === "license" ? "license document" : "image"} file`,
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
      if (type === "license") {
        formData.append("businessLicense", file);
      } else if (type === "profileImage") {
        formData.append("profileImage", file);
      }
      formData.append("name", profileData.name);
      formData.append("email", profileData.email);
      formData.append("phone", profileData.phone);
      formData.append("location", profileData.location);
      formData.append("website", profileData.website);
      formData.append("industry", profileData.industry);
      formData.append("companySize", profileData.companySize);
      formData.append("founded", profileData.founded);
      formData.append("about", profileData.about);
      formData.append("benefits", JSON.stringify(profileData.benefits));
      formData.append("socialLinks", JSON.stringify(profileData.socialLinks));
      formData.append("cinNumber", profileData.cinNumber);
      if (profileData.businessLicense && type !== "license") {
        formData.append("businessLicense", profileData.businessLicense);
      }
      if (profileData.profileImage && type !== "profileImage") {
        formData.append("profileImage", profileData.profileImage);
      }

      await api.put(API_ROUTES.EMPLOYER.PROFILE(auth.user._id), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(
        `${type === "license" ? "License document" : "Profile image"} uploaded successfully!`,
      );
      if (onProfileUpdate) {
        onProfileUpdate();
      }
      onClose();
    } catch (error: any) {
      toast.error(
        `Failed to upload ${type === "license" ? "license document" : "profile image"}: ${
          error.response?.data?.message || "Unknown error"
        }`,
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {type === "license"
              ? "Upload License Document"
              : "Upload Profile Image"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                    {type === "license" ? "license document" : "image"} here
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    or click to browse
                  </p>
                  <label className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors">
                    Choose File
                    <input
                      type="file"
                      accept={
                        type === "license"
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
                    {type === "license"
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
                          {type === "license" ? (
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
                {type === "license" ? (
                  <FileText className="w-4 h-4 mr-2 text-blue-600" />
                ) : (
                  <ImageIcon className="w-4 h-4 mr-2 text-blue-600" />
                )}
                {type === "license" ? "License Document" : "Profile Image"}{" "}
                Guidelines
              </h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-6 list-disc">
                {type === "license" ? (
                  <>
                    <li>
                      Use a valid license document format (PDF recommended)
                    </li>
                    <li>Ensure the document is clear and legible</li>
                    <li>File size must be less than 5MB</li>
                    <li>Include relevant company licensing information</li>
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
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployerModal;
