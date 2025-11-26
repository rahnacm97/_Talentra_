import { useEffect, useState } from "react";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";
import { Heart, Briefcase } from "lucide-react";

export const EmptyState = ({ navigate }: { navigate: any }) => (
  <div className="bg-white rounded-lg shadow-lg p-12 text-center">
    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      No saved jobs yet
    </h3>
    <p className="text-gray-600 mb-6">
      Save jobs you're interested in to keep track of them here.
    </p>
    <button
      onClick={() => navigate(FRONTEND_ROUTES.JOBVIEW)}
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg inline-flex items-center gap-2 transition"
    >
      <Briefcase className="w-5 h-5" />
      Browse Jobs
    </button>
  </div>
);

export const SavedJobsSkeleton = () => (
  <div className="bg-gray-50 min-h-screen py-12">
    <div className="max-w-6xl mx-auto px-4">
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-lg p-6 animate-pulse"
          >
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-gray-300 rounded-lg"></div>
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                <div className="flex gap-6">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export function useDebounce<T>(value: T, delay: number): [T] {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return [debounced];
}
