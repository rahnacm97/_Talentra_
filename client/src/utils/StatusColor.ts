import type { Job } from "../types/job/job.types";

export const getStatusColor = (status: Job["status"]): string => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "closed":
      return "bg-red-100 text-red-800";
    case "draft":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusBadge = (status: Job["status"]): string => {
  switch (status) {
    case "active":
      return "bg-green-50 text-green-700";
    case "closed":
      return "bg-red-50 text-red-700";
    case "draft":
      return "bg-yellow-50 text-yellow-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
};
