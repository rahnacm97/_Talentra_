import React from "react";
import {
  X,
  MapPin,
  Clock,
  IndianRupee,
  Calendar,
  Users,
  Building2,
  Briefcase,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { Job } from "../../types/job/job.types";

interface JobViewModalProps {
  job: Job;
  onClose: () => void;
}

const JobViewModal: React.FC<JobViewModalProps> = ({ job, onClose }) => {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 text-white";
      case "closed":
        return "bg-gray-500 text-white";
      case "draft":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatExperience = (exp: string): string => {
    switch (exp) {
      case "0":
        return "Fresher";
      case "1-2":
        return "1-2 years";
      case "3-5":
        return "3-5 years";
      case "6-8":
        return "6-8 years";
      case "9-12":
        return "9-12 years";
      case "13+":
        return "13+ years";
      default:
        return exp;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-md animate-fadeIn">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Gradient Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-500 to-violet-600 px-6 py-5 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Job Details
              </h2>
              <p className="text-indigo-100 text-sm">
                Complete job information
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all transform hover:scale-110 active:scale-95"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6 space-y-6">
          {/* Title + Status Card */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-bold text-gray-900 flex-1">
                {job.title}
              </h3>
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(job.status)} shadow-sm`}
              >
                {job.status}
              </span>
            </div>
          </div>

          {/* Quick Info Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 shadow-sm">
              <div className="flex items-center gap-2 text-blue-700 mb-1">
                <Building2 className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Department
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {job.department}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200 shadow-sm">
              <div className="flex items-center gap-2 text-purple-700 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Location
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {job.location}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200 shadow-sm">
              <div className="flex items-center gap-2 text-green-700 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Type
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">{job.type}</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200 shadow-sm">
              <div className="flex items-center gap-2 text-amber-700 mb-1">
                <IndianRupee className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Salary
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">{job.salary}</p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 border border-pink-200 shadow-sm">
              <div className="flex items-center gap-2 text-pink-700 mb-1">
                <Briefcase className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Experience
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {formatExperience(job.experience)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200 shadow-sm">
              <div className="flex items-center gap-2 text-indigo-700 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Applicants
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {job.applicants}
              </p>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
              Description
            </h4>
            <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Requirements Section */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></div>
              Requirements
            </h4>
            <ul className="space-y-2">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Responsibilities Section */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full"></div>
              Responsibilities
            </h4>
            <ul className="space-y-2">
              {job.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Timeline Footer Card */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    Posted On
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatDate(job.postedDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    Deadline
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatDate(job.deadline)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default JobViewModal;
