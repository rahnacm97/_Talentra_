import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Modal from "../../components/admin/Modal";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  fetchCandidateById,
  toggleBlockCandidate,
} from "../../thunks/admin.thunk";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";
import { handleFileDownload } from "../../utils/fileUtils";

const AdminCandidateView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedCandidate, loading } = useAppSelector(
    (state) => state.adminCandidates,
  );

  const [showModal, setShowModal] = useState(false);
  const [isBlockAction, setIsBlockAction] = useState<boolean | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchCandidateById(id)).then((result) => {
        console.log("fetchCandidateById result:", result);
      });
    }
  }, [dispatch, id]);

  const openModal = (blocked: boolean) => {
    setIsBlockAction(!blocked);
    setShowModal(true);
  };

  const handleApprove = () => {
    if (selectedCandidate && isBlockAction !== null) {
      dispatch(
        toggleBlockCandidate({
          candidateId: selectedCandidate.id,
          block: isBlockAction,
        }),
      ).then(() => {
        if (id) {
          dispatch(fetchCandidateById(id));
        }
      });
    }
    setShowModal(false);
    setIsBlockAction(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setIsBlockAction(null);
  };

  const handleDownloadResume = () => {
    if (selectedCandidate?.resume) {
      const fileName = `Resume_${selectedCandidate.name.replace(/\s+/g, "_")}`;
      handleFileDownload(selectedCandidate.resume, fileName);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const [year, month] = dateString.split("-");
    return new Date(
      parseInt(year),
      month ? parseInt(month) - 1 : 0,
    ).toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (!selectedCandidate) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600 mb-4">Candidate not found</p>
          <Link
            to={FRONTEND_ROUTES.ADMINCANDIDATES}
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowBackIcon sx={{ fontSize: 18, marginRight: 0.5 }} />
            Back to Candidates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(FRONTEND_ROUTES.ADMINCANDIDATES)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
        >
          <ArrowBackIcon sx={{ fontSize: 18, marginRight: 0.5 }} />
          Back to Candidates
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Candidate Details
            </h1>
            <p className="text-gray-600">
              Complete profile information and status
            </p>
          </div>
          <button
            onClick={() => openModal(selectedCandidate.blocked)}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              selectedCandidate.blocked
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {selectedCandidate.blocked ? (
              <CheckCircleIcon sx={{ fontSize: 18, marginRight: 1 }} />
            ) : (
              <BlockIcon sx={{ fontSize: 18, marginRight: 1 }} />
            )}
            {selectedCandidate.blocked
              ? "Unblock Candidate"
              : "Block Candidate"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
              <div className="flex items-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                  {selectedCandidate.profileImage ? (
                    <img
                      src={selectedCandidate.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <PersonIcon sx={{ fontSize: 48, color: "#2563eb" }} />
                  )}
                </div>
                <div className="ml-6 text-white">
                  <h2 className="text-3xl font-bold mb-1">
                    {selectedCandidate.name}
                  </h2>
                  <p className="text-lg">
                    {selectedCandidate.title || "No title provided"}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedCandidate.blocked
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {selectedCandidate.blocked ? "Blocked" : "Active"}
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
                    <p className="text-gray-900">{selectedCandidate.email}</p>
                  </div>
                </div>

                {selectedCandidate.phoneNumber && (
                  <div className="flex items-start">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <PhoneIcon sx={{ fontSize: 20, color: "#10b981" }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                        Phone Number
                      </p>
                      <p className="text-gray-900">
                        {selectedCandidate.phoneNumber}
                      </p>
                    </div>
                  </div>
                )}

                {selectedCandidate.location && (
                  <div className="flex items-start">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <LocationOnIcon sx={{ fontSize: 20, color: "#7c3aed" }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                        Location
                      </p>
                      <p className="text-gray-900">
                        {selectedCandidate.location}
                      </p>
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
                      {new Date(selectedCandidate.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="px-8 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Professional Information
              </h3>
              <div className="space-y-6">
                {selectedCandidate.about && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                      About
                    </p>
                    <p className="text-gray-600">{selectedCandidate.about}</p>
                  </div>
                )}

                {selectedCandidate.skills?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                      Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCandidate.experience?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                      Experience
                    </p>
                    {selectedCandidate.experience.map((exp, index) => (
                      <div key={index} className="flex items-start mb-4">
                        <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                          <WorkIcon sx={{ fontSize: 20, color: "#4f46e5" }} />
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">
                            {exp.title}
                          </p>
                          <p className="text-gray-600 text-sm">{exp.company}</p>
                          <p className="text-gray-500 text-xs">
                            {formatDate(exp.startDate)} -{" "}
                            {exp.current
                              ? "Present"
                              : formatDate(exp.endDate || "")}
                            {exp.location && ` | ${exp.location}`}
                          </p>
                          {exp.description && (
                            <p className="text-gray-600 text-sm mt-1">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedCandidate.education?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                      Education
                    </p>
                    {selectedCandidate.education.map((edu, index) => (
                      <div key={index} className="flex items-start mb-4">
                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                          <SchoolIcon sx={{ fontSize: 20, color: "#10b981" }} />
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">
                            {edu.degree}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {edu.institution}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {formatDate(edu.startDate)} -{" "}
                            {formatDate(edu.endDate)}
                            {edu.location && ` | ${edu.location}`}
                          </p>
                          {edu.gpa && (
                            <p className="text-gray-600 text-sm mt-1">
                              GPA: {edu.gpa}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedCandidate.certifications?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                      Certifications
                    </p>
                    {selectedCandidate.certifications.map((cert, index) => (
                      <div key={index} className="flex items-start mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                          <EmojiEventsIcon
                            sx={{ fontSize: 20, color: "#7c3aed" }}
                          />
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">
                            {cert.name}
                          </p>
                          <p className="text-gray-600 text-sm">{cert.issuer}</p>
                          <p className="text-gray-500 text-xs">
                            Issued {formatDate(cert.date)}
                            {cert.credentialId && ` | ID: ${cert.credentialId}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resume Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DescriptionIcon sx={{ fontSize: 20, marginRight: 1 }} />
              Resume
            </h3>
            {selectedCandidate.resume ? (
              <div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <DescriptionIcon
                          sx={{ fontSize: 24, color: "#2563eb" }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {`Resume_${selectedCandidate.name.replace(/\s+/g, "_")}.pdf`}
                        </p>
                        <p className="text-xs text-gray-500">PDF Document</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleDownloadResume}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  <DownloadIcon sx={{ fontSize: 18, marginRight: 1 }} />
                  Download Resume
                </button>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No resume uploaded</p>
            )}
          </div>

          {/* Account Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    selectedCandidate.blocked
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {selectedCandidate.blocked ? "Blocked" : "Active"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">User ID</span>
                <span className="text-sm text-gray-900 font-mono">
                  {selectedCandidate.id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="text-sm text-gray-900">
                  {new Date(selectedCandidate.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Email Verified</span>
                <span
                  className={`text-sm font-medium ${
                    selectedCandidate.emailVerified
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedCandidate.emailVerified ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* Application Stats Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Application Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Total Applications
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {selectedCandidate.applicationsCount || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Active Applications
                </span>
                <span className="text-lg font-bold text-green-600">
                  {selectedCandidate.activeApplications || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profile Views</span>
                <span className="text-lg font-bold text-blue-600">
                  {selectedCandidate.profileViews || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onApprove={handleApprove}
        onCancel={handleCancel}
        actionType={isBlockAction ? "block" : "unblock"}
        name={selectedCandidate.name}
      />
    </div>
  );
};

export default AdminCandidateView;
