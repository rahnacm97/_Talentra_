import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";

export const EmptyState = ({ navigate }: any) => (
  <div className="bg-white rounded-lg shadow-lg p-12 text-center">
    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      No applications yet
    </h3>
    <p className="text-gray-600 mb-6">
      Start applying to jobs to see them here.
    </p>
    <button
      onClick={() => navigate(FRONTEND_ROUTES.JOBVIEW)}
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg inline-flex items-center gap-2"
    >
      <Briefcase className="w-5 h-5" />
      Browse Jobs
    </button>
  </div>
);

export const ApplicationCard = ({
  app,
  isOpen,
  onToggle,
  onViewDetails,
  formatDate,
  statusConfig,
}: any) => {
  const cfg = statusConfig[app.status];
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            {app.profileImage ? (
              <img
                src={app.profileImage}
                alt={app.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {app.name[0]}
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">
                {app.jobTitle}
              </h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">{app.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{app.location}</span>
                </div>
                {app.salary && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{app.salary}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{app.jobType}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-sm mt-2">
                <Calendar className="w-4 h-4" />
                Applied on {formatDate(app.appliedAt)}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${cfg.bg} ${cfg.text} font-medium text-sm`}
            >
              <cfg.Icon className={`w-4 h-4 ${cfg.icon}`} />
              <span>{cfg.label}</span>
            </div>
            <button
              onClick={onToggle}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
            >
              {isOpen ? "Less" : "More"} Details
              {isOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Job Description
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {app.description}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Requirements
                </h4>
                <div className="flex flex-wrap gap-2">
                  {app.requirements.map((r: string, i: number) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onViewDetails}
                  className="mx-auto block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg cursor-pointer"
                >
                  View Application Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export function useDebounce<T>(value: T, delay: number): [T] {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return [debounced];
}

export const ApplicationsSkeleton = () => (
  <div className="bg-gray-50 min-h-screen py-12">
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-lg p-6 animate-pulse"
          >
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
