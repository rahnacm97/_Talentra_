import React from "react";
import {
  X,
  MapPin,
  Briefcase,
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { AdminJob } from "../../types/admin/admin.jobs.types";

interface JobDetailsModalProps {
  job: AdminJob | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all animate-slideUp">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 pr-4">
                <h2 className="text-3xl font-bold mb-2 leading-tight">
                  {job.title}
                </h2>
                <div className="flex items-center gap-2 text-blue-100">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-lg font-medium">
                    {job.employer.name}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all transform hover:scale-110 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Location
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {job.location}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-2 text-purple-700 mb-1">
                <Briefcase className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Type
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">{job.type}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-2 text-green-700 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Applicants
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {job.applicants ?? 0}
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-700 mb-1">
                {job.status === "active" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Status
                </span>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                  job.status === "active"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="mb-6 bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              Job Description
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-6 bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                Requirements
              </h3>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full"></div>
                Responsibilities
              </h3>
              <ul className="space-y-2">
                {job.responsibilities.map((res, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{res}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500"></p>
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
