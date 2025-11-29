import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface StatusBadgeProps {
  status:
    | "pending"
    | "reviewed"
    | "shortlisted"
    | "interview"
    | "rejected"
    | "accepted"
    | "hired";
  size?: "sm" | "lg";
}

const statusConfig = {
  pending: { label: "Pending Review", Icon: Clock, color: "yellow" },
  reviewed: { label: "Under Review", Icon: Eye, color: "blue" },
  shortlisted: { label: "Shortlisted", Icon: CheckCircle, color: "purple" },
  interview: { label: "Interview Scheduled", Icon: Calendar, color: "indigo" },
  rejected: { label: "Not Selected", Icon: XCircle, color: "red" },
  hired: { label: "Hired!", Icon: CheckCircle, color: "green" },
  accepted: { label: "Offer Accepted", Icon: CheckCircle, color: "emerald" },
};

export const StatusBadge: React.FC<
  StatusBadgeProps & { interviewDate?: string }
> = ({ status, interviewDate, size = "lg" }) => {
  const cfg = statusConfig[status] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    Icon: AlertCircle,
    color: "gray",
  };
  const Icon = cfg.Icon;

  const formatInterviewDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return (
      date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    );
  };

  return (
    <div
      className={`border-2 rounded-xl p-${size === "lg" ? "6" : "4"} bg-${cfg.color}-50 border-${cfg.color}-200`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full bg-${cfg.color}-500 animate-pulse`}
        />
        <span className={`text-sm font-medium text-${cfg.color}-800`}>
          CURRENT STATUS
        </span>
      </div>
      <div className="flex items-center gap-3 mt-3">
        <Icon
          className={`w-${size === "lg" ? "10" : "8"} h-${size === "lg" ? "10" : "8"} text-${cfg.color}-600`}
        />
        <div>
          <span
            className={`text-${size === "lg" ? "2xl" : "xl"} font-bold text-${cfg.color}-800 block`}
          >
            {cfg.label}
          </span>
          {status === "interview" && interviewDate && (
            <p className="text-sm text-gray-700 mt-1 font-medium">
              {formatInterviewDate(interviewDate)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
