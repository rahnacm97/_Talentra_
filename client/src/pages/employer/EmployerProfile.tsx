import React, { useState, useEffect } from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  Edit3,
  Save,
  X,
  Plus,
  Upload,
  TrendingUp,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  fetchEmployerProfile,
  updateEmployerProfile,
} from "../../thunks/employer.thunk";
import type { EmployerProfileData } from "../../types/employer/employer.types";
import { useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";
import EmployerModal from "../../components/employer/EmployerModal";
import { toast } from "react-toastify";

const EmployerProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((state) => state.employer);
  const auth = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("company");
  const [newBenefit, setNewBenefit] = useState("");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"license" | "profileImage" | null>(
    null,
  );
  const [profileData, setProfileData] = useState<EmployerProfileData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    industry: "",
    companySize: "",
    founded: "",
    about: "",
    benefits: [],
    socialLinks: {
      linkedin: "",
      twitter: "",
      facebook: "",
    },
    postedJobs: [],
    cinNumber: "",
    stats: {
      totalJobs: 0,
      activeJobs: 0,
      totalApplicants: 0,
      hiredThisMonth: 0,
    },
    businessLicense: "",
    profileImage: "",
  });

  useEffect(() => {
    if (auth.user?._id) {
      dispatch(fetchEmployerProfile(auth.user._id))
        .unwrap()
        .catch((err: any) => {
          if (
            err?.message?.includes("blocked") ||
            err?.status === 403 ||
            err?.message === "You have been blocked by admin"
          ) {
            navigate(FRONTEND_ROUTES.LOGIN);
          } else {
            toast.error("Failed to load profile");
          }
        });
    }
  }, [auth.user, dispatch, navigate]);

  useEffect(() => {
    if (profile) {
      console.log("Updating profileData with profile:", profile);
      setProfileData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phoneNumber || "",
        location: profile.location || "",
        website: profile.website || "",
        industry: profile.industry || "",
        companySize: profile.companySize || "",
        founded: profile.founded || "",
        about: profile.about || "",
        benefits: profile.benefits || [],
        socialLinks: profile.socialLinks || {
          linkedin: "",
          twitter: "",
          facebook: "",
        },
        stats: profile.stats || {
          totalJobs: 0,
          activeJobs: 0,
          totalApplicants: 0,
          hiredThisMonth: 0,
        },
        postedJobs: profile.postedJobs || [],
        cinNumber: profile.cinNumber || "",
        businessLicense: profile.businessLicense || "",
        profileImage: profile.profileImage || "",
      });
    }
  }, [profile]);

  const handleInputChange = <K extends keyof EmployerProfileData>(
    field: K,
    value: EmployerProfileData[K],
  ) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setLicenseFile(e.target.files[0]);
  //   }
  // };

  const addBenefit = () => {
    if (
      newBenefit.trim() &&
      !profileData.benefits.includes(newBenefit.trim())
    ) {
      setProfileData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()],
      }));
      setNewBenefit("");
    }
  };

  const removeBenefit = (benefitToRemove: string) => {
    setProfileData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((benefit) => benefit !== benefitToRemove),
    }));
  };

  const openModal = (type: "license" | "profileImage") => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setLicenseFile(null);
  };

  const handleProfileUpdate = () => {
    if (auth.user?._id) {
      dispatch(fetchEmployerProfile(auth.user._id))
        .unwrap()
        .then(() => console.log("Refreshed successfully"))
        .catch((err: any) =>
          toast.error(err.message || "Failed to refresh profile"),
        );
    }
  };

  const handleSave = async () => {
    if (!auth.user?._id) {
      toast.error("User not authenticated");
      return;
    }
    try {
      const formData = new FormData();
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
      if (profileData.businessLicense)
        formData.append("businessLicense", profileData.businessLicense);
      if (profileData.profileImage)
        formData.append("profileImage", profileData.profileImage);
      if (licenseFile) formData.append("businessLicense", licenseFile);

      await dispatch(
        updateEmployerProfile({ employerId: auth.user._id, data: formData }),
      ).unwrap();
      toast.success("Profile updated successfully");
      setIsEditing(false);
      handleProfileUpdate();
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    }
  };

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (!profile) return <div className="p-6">No profile data found</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-700 relative shadow-xl flex items-center justify-center text-white text-4xl font-bold">
            {profileData.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>

          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0">
              <div className="relative -mt-16 md:-mt-12">
                <div className="w-32 h-32 bg-white rounded-2xl border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                  {profileData.profileImage ? (
                    <img
                      src={profileData.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold"></div>
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={() => openModal("profileImage")}
                    className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg shadow-lg transition-colors duration-200"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex-1 md:ml-6 mt-4 md:mt-0">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Company Name"
                      className="text-3xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="Location"
                      className="text-base text-gray-600 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={profileData.website}
                      onChange={(e) =>
                        handleInputChange("website", e.target.value)
                      }
                      placeholder="Website URL"
                      className="text-base text-gray-600 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profileData.name}
                    </h1>
                    <p className="text-xl text-gray-600 mt-1">
                      {profileData.industry}
                    </p>
                  </>
                )}

                <div className="flex flex-wrap gap-4 mt-3 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{profileData.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{profileData.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{profileData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <a
                      href={`https://${profileData.website}`}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      {profileData.website}
                    </a>
                  </div>
                </div>
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
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <Edit3 className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Jobs</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">
                  {profileData.stats.totalJobs}
                </h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Jobs</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">
                  {profileData.stats.activeJobs}
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Applicants
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">
                  {profileData.stats.totalApplicants}
                </h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { id: "company", label: "Company Info", icon: Building2 },
              { id: "benefits", label: "Benefits", icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "company" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    About Company
                  </h3>
                  {isEditing ? (
                    <textarea
                      value={profileData.about}
                      onChange={(e) =>
                        handleInputChange("about", e.target.value)
                      }
                      rows={5}
                      placeholder="Tell us about your company"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">
                      {profileData.about}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      Company Size
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.companySize}
                        onChange={(e) =>
                          handleInputChange("companySize", e.target.value)
                        }
                        placeholder="Number of employees"
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">
                        {profileData.companySize}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      Founded
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.founded}
                        onChange={(e) =>
                          handleInputChange("founded", e.target.value)
                        }
                        placeholder="Year founded"
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">
                        {profileData.founded}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      Industry
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.industry}
                        onChange={(e) =>
                          handleInputChange("industry", e.target.value)
                        }
                        placeholder="Industry type"
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">
                        {profileData.industry}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      CIN Number
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.cinNumber}
                        onChange={(e) =>
                          handleInputChange("cinNumber", e.target.value)
                        }
                        placeholder="Company CIN Number"
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">
                        {profileData.cinNumber}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      License Document
                    </p>
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => openModal("license")}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center space-x-1"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload License</span>
                        </button>
                        {licenseFile && (
                          <span className="text-sm text-gray-600">
                            {licenseFile.name}
                          </span>
                        )}
                        {profileData.businessLicense && !licenseFile && (
                          <a
                            href={profileData.businessLicense}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            View Current License
                          </a>
                        )}
                      </div>
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">
                        {profileData.businessLicense ? (
                          <a
                            href={profileData.businessLicense}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            View License
                          </a>
                        ) : (
                          "No license uploaded"
                        )}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Social Links
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(profileData.socialLinks).map(
                      ([platform, link]) => (
                        <div
                          key={platform}
                          className="flex items-center space-x-3"
                        >
                          <span className="text-gray-700 font-medium capitalize w-24">
                            {platform}:
                          </span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={link}
                              onChange={(e) =>
                                handleInputChange("socialLinks", {
                                  ...profileData.socialLinks,
                                  [platform]: e.target.value,
                                })
                              }
                              placeholder={`Enter ${platform} URL`}
                              className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          ) : (
                            <a
                              href={`https://${link}`}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              {link || "Not provided"}
                            </a>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "benefits" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      Employee Benefits
                    </h3>
                    {isEditing && (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newBenefit}
                          onChange={(e) => setNewBenefit(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addBenefit()}
                          placeholder="Add new benefit"
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          onClick={addBenefit}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center space-x-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <ul className="space-y-3">
                    {profileData.benefits.map((benefit, index) => (
                      <li
                        key={index}
                        className="flex items-center space-x-3 text-gray-800 group"
                      >
                        <span className="text-indigo-600">•</span>
                        <span>{benefit}</span>
                        {isEditing && (
                          <button
                            onClick={() => removeBenefit(benefit)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <X className="w-4 h-4 text-red-600 hover:text-red-800" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {modalOpen && modalType && (
          <EmployerModal
            type={modalType}
            onClose={closeModal}
            onProfileUpdate={handleProfileUpdate}
            profileData={profileData}
          />
        )}
      </div>
    </div>
  );
};

export default EmployerProfile;
