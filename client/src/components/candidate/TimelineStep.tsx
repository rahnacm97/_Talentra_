import { CheckCircle, XCircle, Calendar } from "lucide-react";

interface TimelineStepProps {
  label: string;
  date?: string;
  status: "past" | "current" | "future" | "rejected";
  isLast?: boolean;
  highlightInterview?: boolean;
}

export const TimelineStep: React.FC<TimelineStepProps> = ({
  label,
  date,
  status,
  isLast = false,
  highlightInterview = false,
}) => {
  const isPastOrCurrent = status === "past" || status === "current";
  const isRejected = status === "rejected";

  return (
    <div className="flex gap-5 relative">
      {!isLast && (
        <div
          className={`absolute left-6 top-12 bottom-0 w-0.5 -translate-x-1/2 transition-all duration-500 ${
            isPastOrCurrent && !isRejected ? "bg-indigo-600" : "bg-gray-300"
          }`}
          style={{ height: "calc(100% - 3rem)" }}
        />
      )}

      {/* Circle + Icon */}
      <div className="relative z-10 flex-shrink-0">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
            status === "current"
              ? "bg-indigo-600 text-white ring-4 ring-indigo-100 scale-110"
              : status === "past" && !isRejected
                ? "bg-green-500 text-white"
                : isRejected
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-400 border-2 border-dashed border-gray-300"
          }`}
        >
          {status === "past" && !isRejected && (
            <CheckCircle className="w-7 h-7" />
          )}
          {status === "current" && !isRejected && (
            <CheckCircle className="w-7 h-7" />
          )}
          {isRejected && <XCircle className="w-7 h-7" />}
          {status === "future" && (
            <div className="w-4 h-4 bg-gray-400 rounded-full" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <h4
          className={`font-semibold text-lg transition-colors ${
            status === "current"
              ? "text-indigo-700"
              : status === "past"
                ? "text-gray-800"
                : "text-gray-400"
          }`}
        >
          {label}
        </h4>

        {date && highlightInterview ? (
          <div className="mt-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
            <p className="text-indigo-800 font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {date}
            </p>
          </div>
        ) : date ? (
          <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-gray-400 rounded-full"></span>
            {date}
          </p>
        ) : null}

        {status === "current" && !highlightInterview && (
          <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
            Current Stage
          </span>
        )}
      </div>
    </div>
  );
};
