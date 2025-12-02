import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import CloseIcon from "@mui/icons-material/Close";
import VerifiedIcon from "@mui/icons-material/Verified";
import WarningIcon from "@mui/icons-material/Warning";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkIcon from "@mui/icons-material/Work";
import PeopleIcon from "@mui/icons-material/People";
import { RejectionReasonModal } from "../../components/admin/RejectionModal";
import DescriptionIcon from "@mui/icons-material/Description";
import RefreshIcon from "@mui/icons-material/Refresh";
import Modal from "../../components/admin/Modal";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  fetchEmployerById,
  blockUnblockEmployer,
  verifyEmployer,
  rejectEmployer,
} from "../../thunks/admin.thunk";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";

const AdminEmployerView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedEmployer, loading } = useAppSelector(
    (state) => state.adminEmployers,
  );

  const canVerify =
    selectedEmployer?.cinNumber?.trim() &&
    selectedEmployer?.businessLicense?.trim();

  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isBlockAction, setIsBlockAction] = useState<boolean | null>(null);
  const [showReasonModal, setShowReasonModal] = useState(false);

  const openReasonModal = () => setShowReasonModal(true);
  const closeReasonModal = () => setShowReasonModal(false);

  const isReSubmitted =
    selectedEmployer?.rejected &&
    selectedEmployer?.rejectionCreatedAt &&
    selectedEmployer?.updatedAt &&
    new Date(selectedEmployer.updatedAt) >
      new Date(selectedEmployer.rejectionCreatedAt);

  useEffect(() => {
    if (id) dispatch(fetchEmployerById(id));
  }, [dispatch, id]);

  const openVerifyModal = () => {
    if (!canVerify) {
      toast.warn(
        "Employer cannot be verified – CIN number and Business License are required.",
      );
      return;
    }
    setShowVerifyModal(true);
  };

  const handleBlockApprove = () => {
    if (selectedEmployer && isBlockAction !== null) {
      dispatch(
        blockUnblockEmployer({
          employerId: selectedEmployer.id,
          block: isBlockAction,
        }),
      ).then(() => dispatch(fetchEmployerById(id!)));
    }
    setShowBlockModal(false);
    setIsBlockAction(null);
  };

  const handleVerifyApprove = () => {
    if (selectedEmployer) {
      dispatch(verifyEmployer(selectedEmployer.id)).then(() =>
        dispatch(fetchEmployerById(id!)),
      );
    }
    setShowVerifyModal(false);
  };

  const handleRejectApprove = () => {
    if (!rejectionReason.trim()) {
      toast.warn("Please provide a reason for rejection.");
      return;
    }
    if (!selectedEmployer) {
      toast.error("Employer data is missing.");
      return;
    }
    dispatch(
      rejectEmployer({
        employerId: selectedEmployer.id,
        reason: rejectionReason,
      }),
    ).then(() => dispatch(fetchEmployerById(id!)));

    setShowRejectModal(false);
    setRejectionReason("");
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
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
            to={FRONTEND_ROUTES.ADMINEMPLOYERS}
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowBackIcon sx={{ fontSize: 18, mr: 0.5 }} />
            Back to Employers
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderTopActions = () => {
    if (!selectedEmployer.verified && !selectedEmployer.rejected) {
      return (
        <>
          <button
            onClick={openVerifyModal}
            disabled={!canVerify}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              canVerify
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <VerifiedIcon sx={{ fontSize: 18, mr: 1 }} />
            Verify
          </button>

          <button
            onClick={() => setShowRejectModal(true)}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18, mr: 1 }} />
            Reject
          </button>
        </>
      );
    }

    if (selectedEmployer.rejected && !isReSubmitted) {
      return (
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <CloseIcon sx={{ fontSize: 14, mr: 0.5 }} />
            Rejected
          </span>

          {canVerify && (
            <button
              onClick={openVerifyModal}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <VerifiedIcon sx={{ fontSize: 18, mr: 1 }} />
              Re-verify
            </button>
          )}

          {selectedEmployer.rejectionReason && (
            <button
              onClick={openReasonModal}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              View Reason
            </button>
          )}
        </div>
      );
    }

    if (isReSubmitted) {
      return (
        <>
          <button
            onClick={openVerifyModal}
            disabled={!canVerify}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              canVerify
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <VerifiedIcon sx={{ fontSize: 18, mr: 1 }} />
            Verify
          </button>

          <button
            onClick={() => setShowRejectModal(true)}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18, mr: 1 }} />
            Reject
          </button>
        </>
      );
    }

    return null;
  };

  const renderVerificationBadge = () => {
    if (selectedEmployer.verified) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <VerifiedIcon sx={{ fontSize: 14, mr: 0.5 }} />
          Verified
        </span>
      );
    }

    if (isReSubmitted) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
          <RefreshIcon sx={{ fontSize: 14, mr: 0.5 }} />
          Re-submitted
        </span>
      );
    }

    if (selectedEmployer.rejected) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <CloseIcon sx={{ fontSize: 14, mr: 0.5 }} />
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
        <WarningIcon sx={{ fontSize: 14, mr: 0.5 }} />
        Pending Verification
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(FRONTEND_ROUTES.ADMINEMPLOYERS)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowBackIcon sx={{ fontSize: 18, mr: 0.5 }} />
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

          <div className="flex space-x-3">{renderTopActions()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                    {renderVerificationBadge()}

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

            {/* Contact Info */}
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

            {/* Description */}
            {selectedEmployer.description && (
              <div className="px-8 py-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DescriptionIcon
                    sx={{ fontSize: 20, mr: 1, color: "#2563eb" }}
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

            {/* Industry Info */}
            {(selectedEmployer.industry ||
              selectedEmployer.cinNumber ||
              selectedEmployer.specializations ||
              selectedEmployer.socialLinks) && (
              <div className="px-8 py-6 bg-white rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BusinessIcon
                    sx={{ fontSize: 20, mr: 1, color: "#2563eb" }}
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
                        .map((b, i) => (
                          <li
                            key={i}
                            className="flex items-center text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200"
                          >
                            <span className="text-blue-600 mr-2">•</span>
                            {b.trim()}
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
                          >
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-1.5 15.5v-5.5a3.5 3.5 0 0 0-3.5-3.5h-.01a3.5 3.5 0 0 0-3.5 3.5v5.5h-2v-5.5a5.5 5.5 0 0 1 5.5-5.5h.01a5.5 5.5 0 0 1 5.5 5.5v5.5h-2zm-10-12a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm1 12v-8h-2v8h2z" />
                          </svg>
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Posted Jobs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <WorkIcon sx={{ fontSize: 20, mr: 1 }} />
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

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Verification</span>
                {renderVerificationBadge()}
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

              {isReSubmitted && (
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg text-sm">
                  <span className="text-orange-800 font-medium">
                    Updated after rejection
                  </span>
                  <span className="text-orange-600">
                    {formatDate(selectedEmployer.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DescriptionIcon sx={{ fontSize: 20, mr: 1 }} />
              Documents
            </h3>

            {selectedEmployer.businessLicense ? (
              <div
                className={`flex items-center justify-between p-3 rounded-lg ${
                  isReSubmitted
                    ? "bg-orange-50 border border-orange-200"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-lg mr-3 "bg-blue-100"
                    }`}
                  >
                    <DescriptionIcon
                      sx={{
                        fontSize: 20,
                        color: isReSubmitted ? "#f97316" : "#2563eb",
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Business License{isReSubmitted && " (Updated)"}
                    </p>
                    <p className="text-xs text-gray-500">PDF Document</p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    window.open(selectedEmployer.businessLicense!, "_blank")
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

          {/* Activity Stats */}
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

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                View Posted Jobs
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                View Applications Received
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Send Notification
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showBlockModal}
        onApprove={handleBlockApprove}
        onCancel={handleCancel}
        actionType={isBlockAction ? "block" : "unblock"}
        name={selectedEmployer.name}
      />

      <Modal
        isOpen={showVerifyModal}
        onApprove={handleVerifyApprove}
        onCancel={handleCancel}
        actionType="verify"
        name={selectedEmployer?.name ?? ""}
      />

      <Modal
        isOpen={showRejectModal}
        onApprove={handleRejectApprove}
        onCancel={() => {
          setShowRejectModal(false);
          setRejectionReason("");
        }}
        actionType="reject"
        name={selectedEmployer.name}
        reason={rejectionReason}
        onReasonChange={setRejectionReason}
      />

      <RejectionReasonModal
        isOpen={showReasonModal}
        onClose={closeReasonModal}
        reason={selectedEmployer.rejectionReason ?? ""}
        employerName={selectedEmployer.name}
      />
    </div>
  );
};

export default AdminEmployerView;
