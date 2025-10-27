import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VerifiedIcon from "@mui/icons-material/Verified";
import WarningIcon from "@mui/icons-material/Warning";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkIcon from "@mui/icons-material/Work";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import Modal from "../../components/admin/Modal";

import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  fetchEmployerById,
  blockUnblockEmployer,
  verifyEmployer,
} from "../../thunks/admin.thunk";

const AdminEmployerView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedEmployer, loading } = useAppSelector(
    (state) => state.adminEmployers,
  );

  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [isBlockAction, setIsBlockAction] = useState<boolean | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchEmployerById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id) {
      dispatch(fetchEmployerById(id)).then((result) => {
        console.log("fetchEmployerById result:", result);
      });
    }
  }, [dispatch, id]);

  const openBlockModal = (blocked: boolean) => {
    setIsBlockAction(!blocked);
    setShowBlockModal(true);
  };

  const openVerifyModal = () => {
    setShowVerifyModal(true);
  };

  const handleBlockApprove = () => {
    if (selectedEmployer && isBlockAction !== null) {
      dispatch(
        blockUnblockEmployer({
          employerId: selectedEmployer.id,
          block: isBlockAction,
        }),
      ).then(() => {
        if (id) {
          dispatch(fetchEmployerById(id));
        }
      });
    }
    setShowBlockModal(false);
    setIsBlockAction(null);
  };

  const handleVerifyApprove = () => {
    if (selectedEmployer) {
      dispatch(verifyEmployer(selectedEmployer.id)).then(() => {
        if (id) {
          dispatch(fetchEmployerById(id));
        }
      });
    }
    setShowVerifyModal(false);
  };

  const handleCancel = () => {
    setShowBlockModal(false);
    setShowVerifyModal(false);
    setIsBlockAction(null);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employer details...</p>
        </div>
      </div>
    );
  }

  if (!selectedEmployer) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600 mb-4">Employer not found</p>
          <Link
            to="/admin-employers"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowBackIcon sx={{ fontSize: 18, marginRight: 0.5 }} />
            Back to Employers
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin-employers")}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
        >
          <ArrowBackIcon sx={{ fontSize: 18, marginRight: 0.5 }} />
          Back to Employers
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Employer Details
            </h1>
            <p className="text-gray-600">
              Complete company profile and verification status
            </p>
          </div>
          <div className="flex space-x-3">
            {!selectedEmployer.verified && (
              <button
                onClick={openVerifyModal}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200"
              >
                <VerifiedIcon sx={{ fontSize: 18, marginRight: 1 }} />
                Verify Employer
              </button>
            )}
            <button
              onClick={() => openBlockModal(selectedEmployer.blocked)}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                selectedEmployer.blocked
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {selectedEmployer.blocked ? (
                <CheckCircleIcon sx={{ fontSize: 18, marginRight: 1 }} />
              ) : (
                <BlockIcon sx={{ fontSize: 18, marginRight: 1 }} />
              )}
              {selectedEmployer.blocked ? "Unblock Employer" : "Block Employer"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Company Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
              <div className="flex items-center">
                <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center shadow-lg">
                  {selectedEmployer.profileImage ? (
                    <img
                      src={selectedEmployer.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <BusinessIcon sx={{ fontSize: 48, color: "#2563eb" }} />
                  )}
                </div>
                <div className="ml-6 text-white">
                  <h2 className="text-3xl font-bold mb-2">
                    {selectedEmployer.name}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedEmployer.verified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedEmployer.verified ? (
                        <>
                          <VerifiedIcon
                            sx={{ fontSize: 14, marginRight: 0.5 }}
                          />
                          Verified
                        </>
                      ) : (
                        <>
                          <WarningIcon
                            sx={{ fontSize: 14, marginRight: 0.5 }}
                          />
                          Pending Verification
                        </>
                      )}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedEmployer.blocked
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {selectedEmployer.blocked ? "Blocked" : "Active"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <EmailIcon sx={{ fontSize: 20, color: "#2563eb" }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                      Email Address
                    </p>
                    <p className="text-gray-900">{selectedEmployer.email}</p>
                  </div>
                </div>

                {selectedEmployer.phoneNumber && (
                  <div className="flex items-start">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <PhoneIcon sx={{ fontSize: 20, color: "#10b981" }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                        Phone Number
                      </p>
                      <p className="text-gray-900">
                        {selectedEmployer.phoneNumber}
                      </p>
                    </div>
                  </div>
                )}

                {selectedEmployer.location && (
                  <div className="flex items-start">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <LocationOnIcon sx={{ fontSize: 20, color: "#7c3aed" }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                        Location
                      </p>
                      <p className="text-gray-900">
                        {selectedEmployer.location}
                      </p>
                    </div>
                  </div>
                )}

                {selectedEmployer.website && (
                  <div className="flex items-start">
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                      <LanguageIcon sx={{ fontSize: 20, color: "#4f46e5" }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                        Website
                      </p>
                      <a
                        href={selectedEmployer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedEmployer.website}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <div className="p-2 bg-orange-100 rounded-lg mr-3">
                    <CalendarTodayIcon
                      sx={{ fontSize: 20, color: "#f97316" }}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                      Registration Date
                    </p>
                    <p className="text-gray-900">
                      {formatDate(selectedEmployer.createdAt)}
                    </p>
                  </div>
                </div>

                {selectedEmployer.companySize && (
                  <div className="flex items-start">
                    <div className="p-2 bg-teal-100 rounded-lg mr-3">
                      <PeopleIcon sx={{ fontSize: 20, color: "#14b8a6" }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                        Company Size
                      </p>
                      <p className="text-gray-900">
                        {selectedEmployer.companySize}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Company Description */}
            {/* Company Description */}
            {selectedEmployer.description && (
              <div className="px-8 py-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DescriptionIcon
                    sx={{ fontSize: 20, marginRight: 1, color: "#2563eb" }}
                  />
                  Company Description
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {selectedEmployer.description}
                </p>
                {selectedEmployer.founded && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                      Founded
                    </p>
                    <span className="inline-flex items-center px-3 py-1 text-sm text-black-700">
                      {selectedEmployer.founded}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Industry Information */}
            {(selectedEmployer.industry ||
              selectedEmployer.cinNumber ||
              selectedEmployer.specializations ||
              selectedEmployer.socialLinks) && (
              <div className="px-8 py-6 bg-white rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BusinessIcon
                    sx={{ fontSize: 20, marginRight: 1, color: "#2563eb" }}
                  />
                  Industry Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedEmployer.industry && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                        Industry
                      </p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200">
                        {selectedEmployer.industry}
                      </span>
                    </div>
                  )}
                  {selectedEmployer.cinNumber && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                        CIN
                      </p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                        {selectedEmployer.cinNumber}
                      </span>
                    </div>
                  )}
                </div>
                {selectedEmployer.specializations && (
                  <div className="mt-6">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                      Benefits
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedEmployer.specializations
                        .split(",")
                        .map((benefit: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-center text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200"
                          >
                            <span className="text-blue-600 mr-2">•</span>
                            {benefit.trim()}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
                {selectedEmployer.socialLinks && (
                  <div className="mt-6">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                      Social Links
                    </p>
                    <div className="flex flex-col gap-2 text-sm">
                      {selectedEmployer.socialLinks.linkedin && (
                        <a
                          href={selectedEmployer.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-1.5 15.5v-5.5a3.5 3.5 0 0 0-3.5-3.5h-.01a3.5 3.5 0 0 0-3.5 3.5v5.5h-2v-5.5a5.5 5.5 0 0 1 5.5-5.5h.01a5.5 5.5 0 0 1 5.5 5.5v5.5h-2zm-10-12a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm1 12v-8h-2v8h2z" />
                          </svg>
                          LinkedIn
                        </a>
                      )}
                      {selectedEmployer.socialLinks.twitter && (
                        <a
                          href={selectedEmployer.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M8 2H1l7.39 9.77L1.45 22h2.45l5.71-7.71 5.07 7.71h7.02l-7.6-10.04L20.55 2h-2.45l-5.36 7.24L8 2zm1.09 2h3.82l-8.18 16h-3.82l8.18-16z" />
                          </svg>
                          Twitter
                        </a>
                      )}
                      {selectedEmployer.socialLinks.facebook && (
                        <a
                          href={selectedEmployer.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 3.3h2.43l-.31 2.24h-2.12V10h-2V7.54H8.56V5.3h2.44V3.48c0-1.94 1.18-3 2.9-3h2V2.3h-1.37c-1.1 0-1.3.66-1.3 1.3v1.7zM12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
                          </svg>
                          Facebook
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Posted Jobs Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <WorkIcon sx={{ fontSize: 20, marginRight: 1 }} />
                Posted Jobs
              </h3>
              <Link
                to={`/admin-jobs?employer=${selectedEmployer.id}`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Jobs
              </Link>
            </div>
            {selectedEmployer.jobsPosted > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Total Jobs Posted</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {selectedEmployer.jobsPosted}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Active Jobs</p>
                    <p className="text-xl font-bold text-green-600">
                      {selectedEmployer.activeJobs || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Closed Jobs</p>
                    <p className="text-xl font-bold text-orange-600">
                      {selectedEmployer.closedJobs || 0}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No jobs posted yet</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Verification</span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    selectedEmployer.verified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {selectedEmployer.verified ? "Verified" : "Pending"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    selectedEmployer.blocked
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {selectedEmployer.blocked ? "Blocked" : "Active"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">User ID</span>
                <span className="text-sm text-gray-900 font-mono truncate ml-2">
                  {selectedEmployer.id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="text-sm text-gray-900">
                  {formatDate(selectedEmployer.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Documents Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DescriptionIcon sx={{ fontSize: 20, marginRight: 1 }} />
              Documents
            </h3>
            <div className="space-y-3">
              {selectedEmployer.businessLicense ? (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <DescriptionIcon
                        sx={{ fontSize: 20, color: "#2563eb" }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Business License
                      </p>
                      <p className="text-xs text-gray-500">PDF Document</p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      window.open(selectedEmployer.businessLicense, "_blank")
                    }
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <LanguageIcon sx={{ fontSize: 18 }} />
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No documents uploaded</p>
              )}
            </div>
          </div>

          {/* Activity Statistics Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Activity Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Jobs Posted</span>
                <span className="text-lg font-bold text-gray-900">
                  {selectedEmployer.jobsPosted || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Total Applications
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {selectedEmployer.totalApplications || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Hired Candidates</span>
                <span className="text-lg font-bold text-green-600">
                  {selectedEmployer.hiredCandidates || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profile Views</span>
                <span className="text-lg font-bold text-purple-600">
                  {selectedEmployer.profileViews || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                View Posted Jobs
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                View Applications Received
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                Send Notification
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Block/Unblock Modal */}
      <Modal
        isOpen={showBlockModal}
        onApprove={handleBlockApprove}
        onCancel={handleCancel}
        actionType={isBlockAction ? "block" : "unblock"}
        name={selectedEmployer.name}
      />

      {/* Verify Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Verify Employer
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to verify{" "}
              <strong>{selectedEmployer.name}</strong>? This will mark them as a
              verified employer on the platform.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyApprove}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployerView;
