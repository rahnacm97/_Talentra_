import React from "react";
import {
  Filter,
  Download,
  Eye,
  MessageSquare,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Mail,
  Briefcase,
  X,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";
import type { EmployerApplicationResponseDto } from "../../types/application/application.types";
import { InterviewScheduleModal } from "./InterviewSchedule";

interface ApplicantDetailsModalProps {
  applicant: EmployerApplicationResponseDto;
  isOpen: boolean;
  onClose: () => void;
  // Updated: now accepts interviewDateTime
  onStatusChange: (
    newStatus: string,
    interviewDateTime?: string,
  ) => Promise<void>;
}

const statusOptions = [
  { value: "pending", label: "Pending", color: "yellow" },
  { value: "reviewed", label: "Reviewed", color: "blue" },
  { value: "shortlisted", label: "Shortlisted", color: "purple" },
  { value: "interview", label: "Interview", color: "indigo" },
  { value: "rejected", label: "Rejected", color: "red" },
  { value: "hired", label: "Hired", color: "green" },
];

export const ApplicantDetailsModal: React.FC<ApplicantDetailsModalProps> = ({
  applicant,
  isOpen,
  onClose,
  onStatusChange,
}) => {
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [showInterviewModal, setShowInterviewModal] = React.useState(false);

  if (!isOpen) return null;

  const getStatusColor = (s: string) => {
    const map: Record<string, string> = {
      pending:
        "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200",
      reviewed:
        "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200",
      shortlisted:
        "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200",
      interview:
        "bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 border border-indigo-200",
      rejected:
        "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200",
      hired:
        "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200",
    };
    return map[s] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  const getStatusIcon = (s: string) => {
    const map: Record<string, React.ReactNode> = {
      pending: <Clock className="w-4 h-4" />,
      reviewed: <Eye className="w-4 h-4" />,
      shortlisted: <Star className="w-4 h-4" />,
      interview: <Calendar className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />,
      hired: <CheckCircle className="w-4 h-4" />,
    };
    return map[s] || <Clock className="w-4 h-4" />;
  };

  // Unified handler
  const handleStatusUpdate = async (
    newStatus: string,
    interviewDateTime?: string,
  ) => {
    if (applicant.status === newStatus) return;

    setIsUpdating(true);
    try {
      await onStatusChange(newStatus, interviewDateTime);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Applicant Details
                </h2>
                <p className="text-indigo-100 text-sm">
                  {applicant.candidate.title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
              <div className="flex items-start gap-5">
                {applicant.candidate.profileImage ? (
                  <img
                    src={applicant.candidate.profileImage}
                    alt={applicant.fullName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <Briefcase className="w-12 h-12 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {applicant.fullName}
                  </h3>
                  <p className="text-lg font-medium text-indigo-600 mt-1">
                    {applicant.candidate.title || "Software Engineer"}
                  </p>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{applicant.candidate.location || "Remote"}</span>
                  </div>
                </div>
              </div>

              {applicant.candidate.about && (
                <div className="mt-4 p-4 bg-white/70 rounded-lg">
                  <p className="text-gray-700 italic leading-relaxed">
                    "{applicant.candidate.about}"
                  </p>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {applicant.email && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Mail className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Email</p>
                      <p className="text-gray-900 font-medium">
                        {applicant.email}
                      </p>
                    </div>
                  </div>
                )}
                {applicant.phone && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Phone</p>
                      <p className="text-gray-900 font-medium">
                        {applicant.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            {applicant.candidate.skills &&
              applicant.candidate.skills.length > 0 && (
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {applicant.candidate.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-sm font-semibold rounded-full shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Experience */}
            {applicant.candidate.experience &&
              applicant.candidate.experience.length > 0 && (
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Experience
                  </h3>
                  <div className="space-y-5">
                    {applicant.candidate.experience.map((exp, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex-shrink-0 w-2 bg-indigo-600 rounded-full"></div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {exp.title}
                          </h4>
                          <p className="text-sm text-indigo-600">
                            {exp.company}
                          </p>
                          {exp.location && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {exp.location}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {exp.startDate} –{" "}
                            {exp.current ? "Present" : exp.endDate || "Present"}
                          </p>
                          {exp.description && (
                            <p className="text-sm text-gray-700 mt-2">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Education */}
            {applicant.candidate.education &&
              applicant.candidate.education.length > 0 && (
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Education
                  </h3>
                  <div className="space-y-4">
                    {applicant.candidate.education.map((edu, i) => (
                      <div
                        key={i}
                        className="border-l-4 border-purple-500 pl-4"
                      >
                        <h4 className="font-semibold text-gray-900">
                          {edu.degree}
                        </h4>
                        <p className="text-sm text-purple-600">
                          {edu.institution}
                        </p>
                        {edu.location && (
                          <p className="text-xs text-gray-500">
                            {edu.location}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {edu.startDate} – {edu.endDate}
                        </p>
                        {edu.gpa && (
                          <p className="text-xs font-medium text-indigo-600 mt-1">
                            GPA: {edu.gpa}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Cover Letter */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                Cover Letter
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {applicant.coverLetter || (
                    <span className="text-gray-400 italic">
                      No cover letter provided
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Resume */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Resume
              </h3>
              <a
                href={applicant.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Download className="w-5 h-5" />
                Download Resume
              </a>
            </div>

            {/* Status Update Section */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-indigo-600" />
                Update Application Status
              </h3>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-gray-600 font-medium">
                  Current Status:
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${getStatusColor(applicant.status)}`}
                >
                  {getStatusIcon(applicant.status)}
                  {applicant.status.charAt(0).toUpperCase() +
                    applicant.status.slice(1)}
                </span>

                {applicant.status === "interview" &&
                  applicant.interviewDate && (
                    <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-4">
                      <Calendar className="w-10 h-10 text-indigo-600 flex-shrink-0" />

                      <div>
                        <p className="text-sm font-semibold text-indigo-700">
                          Interview Scheduled
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {new Date(applicant.interviewDate).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                        <p className="text-base font-medium text-indigo-600">
                          {new Date(applicant.interviewDate).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {statusOptions.map((opt) => {
                  const currentIndex = statusOptions.findIndex(
                    (s) => s.value === applicant.status,
                  );
                  const optionIndex = statusOptions.findIndex(
                    (s) => s.value === opt.value,
                  );
                  const isPastOrCurrent = optionIndex <= currentIndex;
                  const isCurrent = optionIndex === currentIndex;

                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        if (opt.value === "interview") {
                          setShowInterviewModal(true);
                        } else if (!isPastOrCurrent) {
                          handleStatusUpdate(opt.value);
                        }
                      }}
                      disabled={isPastOrCurrent || isUpdating}
                      className={`relative px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg
                        ${
                          isCurrent
                            ? "bg-indigo-600 text-white ring-4 ring-indigo-200"
                            : isPastOrCurrent
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-300"
                              : opt.value === "interview"
                                ? "bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border-2 border-indigo-300 hover:from-indigo-100 hover:to-blue-100 hover:border-indigo-400 hover:shadow-md"
                                : `bg-${opt.color}-50 text-${opt.color}-700 border-2 border-${opt.color}-200 hover:bg-${opt.color}-100 hover:border-${opt.color}-300 hover:shadow-md`
                        }
                        ${isUpdating ? "opacity-70 cursor-wait" : ""}
                      `}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {isCurrent && <CheckCircle className="w-5 h-5" />}
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {isUpdating && (
                <p className="text-sm text-indigo-600 font-medium mt-4 text-center animate-pulse">
                  Updating application status...
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Interview Scheduling Modal */}
      <InterviewScheduleModal
        isOpen={showInterviewModal}
        onClose={() => setShowInterviewModal(false)}
        onSchedule={async (date, time) => {
          const interviewDateTime = `${date}T${time}:00`;
          await handleStatusUpdate("interview", interviewDateTime);
        }}
      />
    </>
  );
};
