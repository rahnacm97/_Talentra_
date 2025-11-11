import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  fetchCandidateProfile,
  updateCandidateProfile,
} from "../../thunks/candidate.thunks";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Download,
  Edit3,
  Save,
  X,
  Plus,
  Calendar,
  Building2,
  Trash2,
  Upload,
  FileText,
  CheckCircle,
} from "lucide-react";
import type {
  ProfileData,
  Experience,
  Education,
  Certification,
} from "../../types/candidate/candidate.types";
import { useNavigate } from "react-router-dom";
//import { FRONTEND_ROUTES } from "../../shared/constants/constants";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import ProfileModal from "../../components/candidate/ProfileModal";

const CandidateProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((state) => state.candidate);
  const auth = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [newSkill, setNewSkill] = useState("");
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    phoneNumber: "",
    location: "",
    title: "",
    about: "",
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    resume: "",
    profileImage: null,
  });
  const [editItem, setEditItem] = useState<
    Experience | Education | Certification | null
  >(null);
  const [modalType, setModalType] = useState<
    | "experience"
    | "education"
    | "certifications"
    | "resume"
    | "profileImage"
    | null
  >(null);

  useEffect(() => {
    if (auth.user?._id) {
      dispatch(fetchCandidateProfile(auth.user._id)).unwrap();
      // .catch((err: any) => {
      //   if (
      //     err?.message?.includes("blocked") ||
      //     err?.status === 403 ||
      //     err?.message === "You have been blocked by admin"
      //   ) {
      //     console.log(err);
      //     navigate(FRONTEND_ROUTES.LOGIN);
      //   }
      // });
    }
  }, [auth.user, dispatch, navigate]);

  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        location: profile.location || "",
        title: profile.title || "",
        about: profile.about || "",
        skills: profile.skills || [],
        experience: profile.experience || [],
        education: profile.education || [],
        certifications: profile.certifications || [],
        resume: profile.resume || "",
        profileImage: profile.profileImage || null,
      });
    }
  }, [profile]);

  const handleInputChange = (
    field: keyof ProfileData,
    value: string | null,
  ) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const openModal = (
    type:
      | "experience"
      | "education"
      | "certifications"
      | "resume"
      | "profileImage",
    item?: Experience | Education | Certification,
  ) => {
    setModalType(type);
    setEditItem(item || null);
  };

  const closeModal = () => {
    setModalType(null);
    setEditItem(null);
  };

  const handleAddOrUpdateItem = (
    type: "experience" | "education" | "certifications",
    data: Experience | Education | Certification,
  ) => {
    setProfileData((prev) => {
      const updatedArray = editItem
        ? prev[type].map((item: any) => (item.id === data.id ? data : item))
        : [...prev[type], { ...data, id: uuidv4() }];
      return { ...prev, [type]: updatedArray };
    });
    closeModal();
  };

  const handleProfileUpdate = () => {
    if (auth.user?._id) {
      dispatch(fetchCandidateProfile(auth.user._id))
        .unwrap()
        .catch((err: any) => {
          console.log(err);
          toast.error(err.message || "Failed to refresh profile");
        });
    }
  };

  const handleDeleteItem = (
    type: "experience" | "education" | "certifications",
    id: string,
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [type]: prev[type].filter((item: any) => item.id !== id),
    }));
  };

  const handleSave = async () => {
    if (!auth.user?._id) {
      toast.error("User not authenticated");
      return;
    }
    if (!profileData.name || !profileData.email) {
      toast.error("Full name and email are required");
      return;
    }
    try {
      await dispatch(
        updateCandidateProfile({ ...profileData, candidateId: auth.user._id }),
      ).unwrap();
      setIsEditing(false);
      console.log("Auth state:", auth);
      console.log("Profile data:", profileData);
    } catch (err: any) {
      console.log(err);
      toast.error(err.message || "Failed to update profile");
    }
  };

  const handleDownloadResume = () => {
    if (profileData.resume) {
      try {
        const link = document.createElement("a");
        link.href = profileData.resume;
        link.setAttribute("download", "resume.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.info("Downloading resume...");
      } catch (err) {
        console.log(err);
        toast.error("Failed to download resume");
      }
    } else {
      toast.warning("No resume uploaded yet");
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const date = new Date(parseInt(year), month ? parseInt(month) - 1 : 0);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (!profile) return <div className="p-6">No profile data found</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-700 relative shadow-xl flex items-center justify-center text-white text-4xl font-bold">
            {profileData.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>

          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0">
              <div className="relative -mt-16 md:-mt-12">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-800 to-purple-600 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center text-white text-4xl font-bold">
                  {profileData.profileImage ? (
                    <img
                      src={profileData.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : null}
                </div>
                {isEditing && (
                  <button
                    onClick={() => openModal("profileImage")}
                    className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-lg transition-colors duration-200"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex-1 md:ml-6 mt-4 md:mt-0 pt-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Full Name"
                      className="text-3xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="text"
                      value={profileData.title || ""}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value || null)
                      }
                      placeholder="Professional Title"
                      className="text-xl text-gray-600 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={profileData.location || ""}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value || null)
                      }
                      placeholder="Location"
                      className="text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={profileData.phoneNumber || ""}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value || null)
                      }
                      placeholder="Phone"
                      className="text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profileData.name}
                    </h1>
                    <p className="text-xl text-gray-600 mt-1">
                      {profileData.title}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-3 text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">
                          {profileData.location || "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{profileData.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">
                          {profileData.phoneNumber || "Not specified"}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex space-x-3 mt-4 md:mt-0">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2"
                    >
                      <Save className="w-5 h-5" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2"
                    >
                      <X className="w-5 h-5" />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2"
                    >
                      <Edit3 className="w-5 h-5" />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      onClick={handleDownloadResume}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Resume</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "experience", label: "Experience", icon: Briefcase },
              { id: "education", label: "Education", icon: GraduationCap },
              { id: "certifications", label: "Certifications", icon: Award },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    About
                  </h3>
                  {isEditing ? (
                    <textarea
                      value={profileData.about || ""}
                      onChange={(e) =>
                        handleInputChange("about", e.target.value || null)
                      }
                      rows={5}
                      placeholder="Tell us about yourself"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">
                      {profileData.about || "No description provided"}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">Resume</h3>
                    {isEditing && (
                      <button
                        onClick={() => openModal("resume")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center space-x-1"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Resume</span>
                      </button>
                    )}
                  </div>
                  {profileData.resume ? (
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-600 p-3 rounded-lg">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Resume</p>
                          <p className="text-sm text-gray-600">PDF Document</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <button
                          onClick={handleDownloadResume}
                          className="text-blue-600 hover:text-blue-800 p-2"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No resume uploaded yet</p>
                      {isEditing && (
                        <button
                          onClick={() => openModal("resume")}
                          className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Upload your resume
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">Skills</h3>
                    {isEditing && (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addSkill()}
                          placeholder="Add skill"
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={addSkill}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center space-x-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.length > 0 ? (
                      profileData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 group"
                        >
                          <span>{skill}</span>
                          {isEditing && (
                            <button
                              onClick={() => removeSkill(skill)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <X className="w-4 h-4 text-blue-600 hover:text-blue-800" />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No skills added</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Work Experience
                  </h3>
                  {isEditing && (
                    <button
                      onClick={() => openModal("experience")}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Experience</span>
                    </button>
                  )}
                </div>
                {profileData.experience.length > 0 ? (
                  profileData.experience.map((exp) => (
                    <div
                      key={exp.id}
                      className="border-l-4 border-blue-600 pl-6 py-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900">
                            {exp.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-gray-600 mt-1">
                            <Building2 className="w-4 h-4" />
                            <span className="font-medium">{exp.company}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-gray-500 text-sm mt-2">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{exp.location || "Not specified"}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {formatDate(exp.startDate)} -{" "}
                                {exp.current
                                  ? "Present"
                                  : formatDate(exp.endDate || "")}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 mt-3 leading-relaxed">
                            {exp.description || "No description provided"}
                          </p>
                        </div>
                        {isEditing && (
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => openModal("experience", exp)}
                              className="text-blue-600 hover:text-blue-800 p-2"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteItem("experience", exp.id)
                              }
                              className="text-red-600 hover:text-red-800 p-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No experience added</p>
                )}
              </div>
            )}

            {activeTab === "education" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Education</h3>
                  {isEditing && (
                    <button
                      onClick={() => openModal("education")}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Education</span>
                    </button>
                  )}
                </div>
                {profileData.education.length > 0 ? (
                  profileData.education.map((edu) => (
                    <div
                      key={edu.id}
                      className="border-l-4 border-green-600 pl-6 py-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900">
                            {edu.degree}
                          </h4>
                          <div className="flex items-center space-x-2 text-gray-600 mt-1">
                            <GraduationCap className="w-4 h-4" />
                            <span className="font-medium">
                              {edu.institution}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-gray-500 text-sm mt-2">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{edu.location || "Not specified"}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {formatDate(edu.startDate)} -{" "}
                                {formatDate(edu.endDate)}
                              </span>
                            </div>
                          </div>
                          {edu.gpa && (
                            <p className="text-gray-600 mt-2">
                              GPA:{" "}
                              <span className="font-semibold">{edu.gpa}</span>
                            </p>
                          )}
                        </div>
                        {isEditing && (
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => openModal("education", edu)}
                              className="text-blue-600 hover:text-blue-800 p-2"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteItem("education", edu.id)
                              }
                              className="text-red-600 hover:text-red-800 p-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No education added</p>
                )}
              </div>
            )}

            {activeTab === "certifications" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Certifications
                  </h3>
                  {isEditing && (
                    <button
                      onClick={() => openModal("certifications")}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Certification</span>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profileData.certifications.length > 0 ? (
                    profileData.certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 relative group"
                      >
                        {isEditing && (
                          <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => openModal("certifications", cert)}
                              className="bg-white text-blue-600 hover:text-blue-800 p-2 rounded-lg shadow-md"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteItem("certifications", cert.id)
                              }
                              className="bg-white text-red-600 hover:text-red-800 p-2 rounded-lg shadow-md"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <div className="flex items-start space-x-4">
                          <div className="bg-purple-600 p-3 rounded-lg">
                            <Award className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900 mb-1">
                              {cert.name}
                            </h4>
                            <p className="text-gray-600 text-sm mb-2">
                              {cert.issuer}
                            </p>
                            <div className="flex items-center space-x-2 text-gray-500 text-sm">
                              <Calendar className="w-4 h-4" />
                              <span>Issued {formatDate(cert.date)}</span>
                            </div>
                            <p className="text-gray-500 text-xs mt-2">
                              ID: {cert.credentialId || "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No certifications added</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {modalType && (
          <ProfileModal
            type={modalType}
            item={editItem}
            onSave={
              modalType === "resume" || modalType === "profileImage"
                ? undefined
                : handleAddOrUpdateItem
            }
            onClose={closeModal}
            onProfileUpdate={handleProfileUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default CandidateProfile;
