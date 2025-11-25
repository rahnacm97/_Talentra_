import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Mail,
  Phone,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Eye,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";
import { StatusBadge } from "../../components/candidate/StatusCard";
import { InfoCard } from "../../components/candidate/InfoCard";
import { TimelineStep } from "../../components/candidate/TimelineStep";
import { ActionButton } from "../../components/candidate/ActionButton";
import { fetchApplicationById } from "../../thunks/candidate.thunks";
import { ApplicationDetailsSkeleton } from "../../components/candidate/ApplicationSkelton";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";

const ApplicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { applications, currentApplication, currentAppLoading } =
    useAppSelector((s) => s.candidate);

  const application =
    currentApplication && currentApplication.id === id
      ? currentApplication
      : applications.find((a) => a.id === id);

  useEffect(() => {
    if (!id) return;

    dispatch(fetchApplicationById(id));
  }, [id, dispatch]);

  if (currentAppLoading) return <ApplicationDetailsSkeleton />;

  const formatDate = (dateInput: string | Date) => {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "Date not set";

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatInterviewDate = (dateInput?: string) => {
    if (!dateInput) return "Date not set";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "Date not set";

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleGoback = () => {
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate(FRONTEND_ROUTES.CANDIDATEAPPLICATIONS);
    }
  };

  const statusOptions = [
    { value: "pending", label: "Application Submitted" },
    { value: "reviewed", label: "Under Review" },
    { value: "shortlisted", label: "Shortlisted" },
    { value: "interview", label: "Interview Scheduled" },
    { value: "rejected", label: "Not Selected" },
    { value: "hired", label: "Hired!" },
  ];

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Application Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The application you're looking for doesn't exist.
          </p>
          <button
            onClick={handleGoback}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Applications</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Application Details
          </h1>
          <p className="text-gray-600">
            Track your application status and review job details
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                <div className="flex items-start gap-4">
                  {application.profileImage ? (
                    <img
                      src={application.profileImage}
                      alt={application.name}
                      className="w-16 h-16 rounded-xl bg-white p-2 object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center text-blue-600 font-bold text-2xl">
                      {application.name[0]}
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {application.jobTitle}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-blue-100">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span className="font-medium">{application.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{application.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {application.salary && (
                    <InfoCard
                      icon={DollarSign}
                      label="Salary Range"
                      value={application.salary}
                      color="green"
                    />
                  )}
                  <InfoCard
                    icon={Clock}
                    label="Job Type"
                    value={application.jobType}
                  />
                  <InfoCard
                    icon={Calendar}
                    label="Applied On"
                    value={formatDate(application.appliedAt)}
                    color="purple"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    Job Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {application.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    Requirements & Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {application.requirements.map((req, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Your Application */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Your Application
              </h3>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Full Name
                    </label>
                    <p className="text-gray-900 font-medium mt-1">
                      {application.fullName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="font-medium">{application.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Phone
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="font-medium">{application.phone}</p>
                    </div>
                  </div>
                </div>

                {application.coverLetter && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      Cover Letter
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {application.coverLetter}
                      </p>
                    </div>
                  </div>
                )}

                {application.resume && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      Resume
                    </label>
                    <a
                      href={application.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Resume.pdf
                          </p>
                          <p className="text-sm text-gray-600">
                            Click to view or download
                          </p>
                        </div>
                      </div>
                      <Download className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Application Status
              </h3>
              <div className="mb-8">
                <StatusBadge status={application.status} />
              </div>

              <div className="mt-8">
                {statusOptions.map((opt, index) => {
                  const currentIndex = statusOptions.findIndex(
                    (s) => s.value === application.status,
                  );
                  const stepStatus =
                    index < currentIndex
                      ? "past"
                      : index === currentIndex
                        ? application.status === "rejected"
                          ? "rejected"
                          : "current"
                        : "future";
                  const isLast = index === statusOptions.length - 1;

                  let displayDate: string | undefined;

                  if (index === 0) {
                    displayDate = formatDate(application.appliedAt);
                  } else if (index <= currentIndex) {
                    if (
                      opt.value === "interview" &&
                      application.interviewDate
                    ) {
                      displayDate = formatInterviewDate(
                        application.interviewDate,
                      );
                    } else if (application.updatedAt) {
                      const updated = new Date(application.updatedAt);
                      const applied = new Date(application.appliedAt);
                      if (updated > applied) {
                        displayDate = formatDate(application.updatedAt);
                      }
                    }
                  }

                  return (
                    <TimelineStep
                      key={opt.value}
                      label={opt.label}
                      status={stepStatus}
                      isLast={isLast}
                      highlightInterview={
                        opt.value === "interview" && !!application.interviewDate
                      }
                      date={
                        opt.value === "interview"
                          ? formatInterviewDate(application.interviewDate)
                          : displayDate
                      }
                    />
                  );
                })}
              </div>

              {/* Banners */}
              {application.status === "hired" && (
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                    <div>
                      <h4 className="text-xl font-bold text-green-800">
                        Congratulations! You've Been Hired!
                      </h4>
                      <p className="text-green-700">
                        Welcome to the team — we're excited to have you!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {application.status === "rejected" && (
                <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border-2 border-red-200">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-10 h-10 text-red-600" />
                    <div>
                      <h4 className="text-xl font-bold text-red-800">
                        Application Not Selected
                      </h4>
                      <p className="text-red-700">
                        Thank you for applying. We wish you the best in your job
                        search.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <ActionButton
                  onClick={() => navigate(`/jobs/${application.jobId}`)}
                  icon={Eye}
                >
                  View Job Posting
                </ActionButton>
                <ActionButton variant="danger" icon={XCircle}>
                  Withdraw Application
                </ActionButton>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-6 border border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                Pro Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5" />
                  <span>Check your email regularly for updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5" />
                  <span>Keep your profile updated</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5" />
                  <span>Prepare for potential interviews</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
