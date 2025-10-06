import React, { useState, useEffect } from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  Briefcase,
  Edit3,
  Save,
  X,
  Plus,
  Calendar,
  Eye,
  Trash2,
  Upload,
  ExternalLink,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchEmployerProfile } from "../../features/employer/employerSlice";
import type { EmployerProfileData } from "../../types/employer/employer.types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";

const EmployerProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((state) => state.employer);
  const auth = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("company");
  const [newBenefit, setNewBenefit] = useState("");
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
    stats: {
      totalJobs: 0,
      activeJobs: 0,
      totalApplicants: 0,
      hiredThisMonth: 0,
    },
  });

  useEffect(() => {
    if (auth.user?.id) {
      dispatch(fetchEmployerProfile(auth.user.id))
        .unwrap()
        .catch((err: any) => {
          if (
            err?.message?.includes("blocked") ||
            err?.status === 403 ||
            err?.message === "You have been blocked by admin"
          ) {
            toast.error("You have been blocked by admin");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            navigate("/login");
          }
        });
    }
  }, [auth.user, dispatch, navigate]);

  useEffect(() => {
    if (profile) {
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
        postedJobs: profile.postedJobs || [],
        stats: profile.stats || {
          totalJobs: 0,
          activeJobs: 0,
          totalApplicants: 0,
          hiredThisMonth: 0,
        },
      });
    }
  }, [profile]);

  const handleInputChange = <K extends keyof EmployerProfileData>(
    field: K,
    value: EmployerProfileData[K]
  ) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const addBenefit = () => {
    if (newBenefit.trim() && !profileData.benefits.includes(newBenefit.trim())) {
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (!profile) return <div className="p-6">No profile data found</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
    <div className="h-screen bg-gray-50 py-8 px-4">
      <div className="w-full h-full">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-700 relative">
            <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Change Cover</span>
            </button>
          </div>

          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0">
              <div className="relative -mt-16 md:-mt-12">
                <div className="w-32 h-32 bg-white rounded-2xl border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                    {profileData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg shadow-lg transition-colors duration-200">
                  <Upload className="w-4 h-4" />
                </button>
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
                      className="text-3xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={profileData.industry}
                      onChange={(e) =>
                        handleInputChange("industry", e.target.value)
                      }
                      className="text-xl text-gray-600 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                      onClick={() => setIsEditing(false)}
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
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2"
                    >
                      <Edit3 className="w-5 h-5" />
                      <span>Edit Profile</span>
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2">
                      <Plus className="w-5 h-5" />
                      <span>Post Job</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Jobs</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">
                  {profileData.stats.totalJobs}
                </h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
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
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Applicants</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">
                  {profileData.stats.totalApplicants}
                </h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Hired This Month</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">
                  {profileData.stats.hiredThisMonth}
                </h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { id: "company", label: "Company Info", icon: Building2 },
              { id: "jobs", label: "Posted Jobs", icon: Briefcase },
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
                  <h3 className="text-xl font-bold text-gray-900 mb-3">About Company</h3>
                  {isEditing ? (
                    <textarea
                      value={profileData.about}
                      onChange={(e) => handleInputChange("about", e.target.value)}
                      rows={5}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">{profileData.about}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 font-medium mb-1">Company Size</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.companySize}
                        onChange={(e) => handleInputChange("companySize", e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">{profileData.companySize}</p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 font-medium mb-1">Founded</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.founded}
                        onChange={(e) => handleInputChange("founded", e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">{profileData.founded}</p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 font-medium mb-1">Industry</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.industry}
                        onChange={(e) => handleInputChange("industry", e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">{profileData.industry}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Social Links</h3>
                  <div className="space-y-3">
                    {Object.entries(profileData.socialLinks).map(([platform, link]) => (
                      <div key={platform} className="flex items-center space-x-3">
                        <span className="text-gray-700 font-medium capitalize w-24">{platform}:</span>
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
                            className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <a
                            href={`https://${link}`}
                            className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                          >
                            <span>{link}</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "jobs" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Posted Jobs</h3>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Post New Job</span>
                  </button>
                </div>

                {profileData.postedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-xl font-bold text-gray-900">{job.title}</h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}
                          >
                            {job.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-gray-600 text-sm mb-3">
                          <div className="flex items-center space-x-1">
                            <Building2 className="w-4 h-4" />
                            <span>{job.department}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{job.type}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{job.salary}</span>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-3">{job.description}</p>

                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-indigo-600" />
                            <span className="text-gray-700">
                              <span className="font-semibold">{job.applicants}</span> applicants
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-500">Posted {formatDate(job.postedDate)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <button className="text-indigo-600 hover:text-indigo-800 p-2 bg-indigo-50 rounded-lg transition-colors duration-200">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 p-2 bg-blue-50 rounded-lg transition-colors duration-200">
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-800 p-2 bg-red-50 rounded-lg transition-colors duration-200">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "benefits" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">Employee Benefits</h3>
                    {isEditing && (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newBenefit}
                          onChange={(e) => setNewBenefit(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addBenefit()}
                          placeholder="Add benefit"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profileData.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 px-4 py-3 rounded-lg font-medium text-gray-800 flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-indigo-600" />
                          <span>{benefit}</span>
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => removeBenefit(benefit)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <X className="w-4 h-4 text-red-600 hover:text-red-800" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default EmployerProfile;