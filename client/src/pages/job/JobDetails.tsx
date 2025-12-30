import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { applyJob } from "../../thunks/candidate.thunks";
import { fetchCandidateProfile } from "../../thunks/candidate.thunks";
import { fetchJobById, unsaveJob, saveJob } from "../../thunks/job.thunk";
import { formatExperience } from "../../utils/formatters";
import {
  MapPin,
  IndianRupee,
  Clock,
  Building2,
  Users,
  Share2,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Award,
  TrendingUp,
  Globe,
  AlertCircle,
  Briefcase as BriefcaseIcon,
  Star,
  X,
  CheckCircle,
  Calendar,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";
import { aiService } from "../../services/aiService";
import { Loader2 } from "lucide-react";
import Header from "../common/Header";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";
import { JobApplyModal } from "../../components/job/JobApplyModal";

const JobDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const candidateId = useAppSelector((s) => s.auth.user?._id);
  const { id } = useParams<{ id: string }>();
  const { jobs, loadingJobId } = useAppSelector((state) => state.candidateJobs);
  const { profile: candidateProfile } = useAppSelector(
    (state) => state.candidate,
  );
  const savedJobs = useAppSelector((state) => state.candidateJobs.savedJobs);
  const isSaved = savedJobs.some((j: any) => j.id === id);

  const job = useAppSelector((state) =>
    state.candidateJobs.jobs.find((j) => j.id === id),
  );
  const loading = loadingJobId === id;

  const [showApplyModal, setShowApplyModal] = useState(false);

  // AI Match Score State
  const [matchScore, setMatchScore] = useState<{
    score: number;
    reason: string;
  } | null>(null);
  const [loadingScore, setLoadingScore] = useState(false);

  const handleCheckMatch = async () => {
    if (!candidateId || !id) {
      toast.error("Please log in to check compatibility");
      return;
    }

    setLoadingScore(true);
    try {
      const result = await aiService.getMatchScore(candidateId, id);
      setMatchScore(result);
    } catch (error) {
      toast.error("Failed to analyze compatibility");
      console.log(error);
    } finally {
      setLoadingScore(false);
    }
  };

  const handleApplySubmit = async (formData: FormData) => {
    if (!candidateId || !id) return;

    try {
      await dispatch(applyJob({ jobId: id, formData })).unwrap();
      closeApplyModal();
    } catch {}
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchJobById(id));
    }
  }, [id, dispatch]);

  const handleSaveToggle = async () => {
    if (!candidateId || !id) return;
    try {
      if (isSaved) {
        await dispatch(unsaveJob(id)).unwrap();
      } else {
        await dispatch(saveJob(id)).unwrap();
      }
    } catch (err) {
      console.error("Failed to toggle save", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-sm p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="bg-white rounded-xl shadow-sm p-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Job Not Found
            </h3>
            <p className="text-gray-600 mb-6">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to={FRONTEND_ROUTES.JOBVIEW}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const company = job.employer;

  const similarJobs = jobs
    .filter((j) => j.id !== job.id && j.type === job.type)
    .slice(0, 3)
    .map((j) => ({
      id: j.id,
      title: j.title,
      company: j.employer.companyName,
      salary: j.salary || "Not disclosed",
      location: j.location,
      type: j.type,
      posted: new Date(j.postedDate).toLocaleDateString(),
      logo: j.employer.logo || j.employer.companyName.charAt(0),
    }));

  const openApplyModal = async () => {
    if (candidateId && !candidateProfile) {
      try {
        await dispatch(fetchCandidateProfile()).unwrap();
      } catch (err) {
        toast.error("Failed to load your profile");
        console.log(err);
        return;
      }
    }
    setShowApplyModal(true);
  };
  const closeApplyModal = () => setShowApplyModal(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-indigo-600">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link
              to={FRONTEND_ROUTES.JOBVIEW}
              className="hover:text-indigo-600"
            >
              Jobs
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900">{job.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.companyName}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl">
                      {company.companyName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h1>
                    <p className="text-xl text-gray-600 flex items-center mb-4">
                      <Building2 className="w-5 h-5 mr-2" />
                      {company.companyName}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <BriefcaseIcon className="w-4 h-4 mr-1" />
                        {job.type}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Posted {new Date(job.postedDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {job.applicants} applicants
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-red-400" />
                        Deadline {formatDate(job.deadline)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveToggle}
                    className="p-3 border border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition"
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  <button className="p-3 border border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {job.status === "active" && (
                  <>
                    {job.hasApplied ? (
                      <div className="flex items-center px-6 py-3 bg-green-100 text-green-700 rounded-lg font-semibold text-sm">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Already Applied
                      </div>
                    ) : (
                      <button
                        onClick={openApplyModal}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg"
                      >
                        Apply Now
                      </button>
                    )}
                  </>
                )}

                <div
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                    job.status === "active"
                      ? "bg-green-50 text-green-700"
                      : job.status === "closed"
                        ? "bg-red-50 text-red-700"
                        : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {job.status === "active" ? (
                    <>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Actively hiring
                    </>
                  ) : job.status === "closed" ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Closed
                    </>
                  ) : (
                    <>
                      <BriefcaseIcon className="w-4 h-4 mr-2" />
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* AI Compatibility Score Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 mb-6 border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  AI Compatibility Match
                </h2>
                {!matchScore && (
                  <button
                    onClick={handleCheckMatch}
                    disabled={loadingScore}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
                  >
                    {loadingScore ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />{" "}
                        Analyzing...
                      </>
                    ) : (
                      "Check Match"
                    )}
                  </button>
                )}
              </div>

              {matchScore && (
                <div className="flex items-start gap-6 animate-fade-in">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className={`${matchScore.score >= 70 ? "text-green-500" : matchScore.score >= 40 ? "text-yellow-500" : "text-red-500"} transition-all duration-1000 ease-out`}
                        strokeDasharray={`${matchScore.score}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-xl font-bold text-gray-900">
                        {matchScore.score}%
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">
                        Match
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Analysis Result
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {matchScore.reason}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {job.salary && (
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <IndianRupee className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Salary Range</p>
                      <p className="text-xl font-bold text-gray-900">
                        {job.salary}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">per year</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Experience Required
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatExperience(job.experience)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Job Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {job.requirements.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Requirements
                </h2>
                <ul className="space-y-2 text-gray-700">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start">
                      <Star className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.responsibilities.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Responsibilities
                </h2>
                <ul className="space-y-2 text-gray-700">
                  {job.responsibilities.map((res, i) => (
                    <li key={i} className="flex items-start">
                      <BriefcaseIcon className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{res}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About {company.companyName}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {company.about || "No company description available."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {company.industry && (
                  <div>
                    <p className="text-sm text-gray-600">Industry</p>
                    <p className="font-medium">{company.industry}</p>
                  </div>
                )}
                {company.companySize && (
                  <div>
                    <p className="text-sm text-gray-600">Company Size</p>
                    <p className="font-medium">
                      {company.companySize} employees
                    </p>
                  </div>
                )}
                {company.website && (
                  <div>
                    <p className="text-sm text-gray-600">Website</p>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline flex items-center"
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      {company.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                {company.founded && (
                  <div>
                    <p className="text-sm text-gray-600">Founded</p>
                    <p className="font-medium">{company.founded}</p>
                  </div>
                )}
              </div>

              {company.benefits && company.benefits.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-2">Benefits</p>
                  <div className="flex flex-wrap gap-2">
                    {company.benefits.map((benefit, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 sticky top-24">
              {job.status === "active" && (
                <button
                  onClick={openApplyModal}
                  disabled={job.hasApplied}
                  className={`w-full text-white px-6 py-3 rounded-lg font-semibold mb-4 transition-all ${
                    job.hasApplied
                      ? "bg-green-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  }`}
                >
                  {job.hasApplied ? "Applied" : "Apply for this Job"}
                </button>
              )}

              <button
                onClick={handleSaveToggle}
                className="w-full border border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 text-gray-700 px-6 py-3 rounded-lg font-semibold"
              >
                {isSaved ? "Job Saved" : "Save Job"}
              </button>

              {job.status === "closed" && (
                <p className="mt-3 text-center text-sm text-red-600">
                  This job is closed and no longer accepting applications.
                </p>
              )}
            </div>

            {similarJobs.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Similar Jobs
                </h3>
                <div className="space-y-4">
                  {similarJobs.map((j) => (
                    <Link
                      key={j.id}
                      to={FRONTEND_ROUTES.JOBDETAILS.replace(":id", j.id)}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-600 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start space-x-3 mb-3">
                        {typeof j.logo === "string" &&
                        j.logo.startsWith("http") ? (
                          <img
                            src={j.logo}
                            alt={j.company}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {j.logo}
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {j.title}
                          </h4>
                          <p className="text-sm text-gray-600">{j.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {j.location}
                        </span>
                        <span>{j.salary}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <JobApplyModal
        jobTitle={job.title}
        isOpen={showApplyModal}
        onClose={closeApplyModal}
        // profile={{
        //   resume: candidateProfile?.resume,
        //   updatedAt: candidateProfile?.updatedAt,
        // }}
        profile={{
          name: candidateProfile?.name,
          email: candidateProfile?.email,
          phoneNumber: candidateProfile?.phoneNumber,
          resume: candidateProfile?.resume,
          updatedAt: candidateProfile?.updatedAt,
        }}
        onSubmit={handleApplySubmit}
      />
    </div>
  );
};

export default JobDetails;
