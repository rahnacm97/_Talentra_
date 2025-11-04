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
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Job Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Title + Status */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}
            >
              {job.status}
            </span>
          </div>

          {/* Quick info row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Building2 className="w-4 h-4" />
              <span>{job.department}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center space-x-1">
              <IndianRupee className="w-4 h-4" />
              <span>{job.salary}</span>
            </div>
            {/* Add in Quick info row */}
            <div className="flex items-center space-x-1">
              <Briefcase className="w-4 h-4" />
              <span>{formatExperience(job.experience)}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <p className="whitespace-pre-wrap text-gray-700">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements
            </label>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {job.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsibilities
            </label>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {job.responsibilities.map((resp, i) => (
                <li key={i}>{resp}</li>
              ))}
            </ul>
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 border-t pt-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>
                <strong>{job.applicants}</strong> applicants
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>Posted {formatDate(job.postedDate)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-red-500" />
              <span>Deadline {formatDate(job.deadline)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobViewModal;
