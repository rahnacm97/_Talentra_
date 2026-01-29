import React from "react";
import {
  X,
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  Clock,
  Calendar,
  FileText,
  CheckCircle,
  Award,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

interface OfferDetailsModalProps {
  offer: any;
  onClose: () => void;
}

const OfferDetailsModal: React.FC<OfferDetailsModalProps> = ({
  offer,
  onClose,
}) => {
  if (!offer) return null;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in"
        style={{
          animation: "scaleIn 0.3s ease-out",
        }}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 px-8 py-8 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -ml-24 -mb-24"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white mb-1 flex items-center gap-2">
                  Offer Details
                  <Sparkles className="w-6 h-6" />
                </h2>
                <p className="text-green-100 text-sm font-medium">
                  Official job offer information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-white/20 rounded-xl transition-all cursor-pointer backdrop-blur-sm group"
            >
              <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-8">
          {/* Congratulations Banner */}
          <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 rounded-2xl p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <Sparkles className="w-32 h-32 text-green-600" />
            </div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 shadow-xl">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2">
                🎉 Congratulations! 🎉
              </h3>
              <p className="text-lg text-gray-600 font-medium">
                You've been officially hired for this position!
              </p>
            </div>
          </div>

          {/* Job Overview */}
          <div className="flex items-start gap-6 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border-2 border-blue-100 shadow-sm">
            {offer.profileImage ? (
              <img
                src={offer.profileImage}
                alt={offer.name}
                className="w-28 h-28 rounded-2xl object-cover shadow-xl ring-4 ring-white"
              />
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center text-white font-black text-4xl shadow-xl">
                {offer.name[0]}
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-3xl font-black text-gray-900 mb-3 leading-tight">
                {offer.jobTitle}
              </h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-blue-100 group hover:border-blue-300 transition-colors">
                  <div className="bg-blue-100 p-1.5 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-bold text-gray-900">{offer.name}</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-purple-100 group hover:border-purple-300 transition-colors">
                  <div className="bg-purple-100 p-1.5 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <MapPin className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-bold text-gray-900">
                    {offer.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Employment Details */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-sm hover:shadow-lg transition-shadow">
              <h4 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-6">
                <div className="bg-blue-100 p-2 rounded-xl">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                Employment Details
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                  <span className="text-gray-600 text-sm font-semibold">
                    Job Type
                  </span>
                  <span className="font-black text-gray-900 flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                    <Clock className="w-4 h-4 text-orange-500" />{" "}
                    {offer.jobType}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border border-gray-100">
                  <span className="text-gray-600 text-sm font-semibold">
                    Salary Range
                  </span>
                  <span className="font-black text-green-700 flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                    <IndianRupee className="w-4 h-4" />{" "}
                    {offer.salary || "Not Specified"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-gray-100">
                  <span className="text-gray-600 text-sm font-semibold">
                    Offered On
                  </span>
                  <span className="font-black text-gray-900 flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                    <Calendar className="w-4 h-4 text-purple-500" />{" "}
                    {offer.hiredAt
                      ? formatDate(offer.hiredAt)
                      : formatDate(offer.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Application Info */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-sm hover:shadow-lg transition-shadow">
              <h4 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-6">
                <div className="bg-purple-100 p-2 rounded-xl">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                Application Info
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl border border-gray-100">
                  <span className="text-gray-600 text-sm font-semibold">
                    Candidate Name
                  </span>
                  <span className="font-black text-gray-900 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                    {offer.fullName}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border border-gray-100">
                  <span className="text-gray-600 text-sm font-semibold">
                    Status
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    {offer.status}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                  <span className="text-gray-600 text-sm font-semibold">
                    Applied Date
                  </span>
                  <span className="font-black text-gray-900 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                    {formatDate(offer.appliedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl border-2 border-gray-100 mb-6 shadow-sm">
            <h4 className="font-black text-gray-900 mb-4 text-xl flex items-center gap-2">
              <div className="bg-indigo-100 p-2 rounded-xl">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              Job Description
            </h4>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {offer.description}
              </p>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-sm">
            <h4 className="font-black text-gray-900 mb-6 text-xl flex items-center gap-2">
              <div className="bg-purple-100 p-2 rounded-xl">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              Key Requirements
            </h4>
            <div className="flex flex-wrap gap-3">
              {offer.requirements.map((r: string, i: number) => (
                <span
                  key={i}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-5 py-3 rounded-xl text-sm font-bold border-2 border-blue-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>

          {/* Success Message */}
          <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="font-black text-lg mb-1">Next Steps</p>
                <p className="text-green-100 text-sm">
                  The employer will reach out to you shortly with onboarding
                  details and your start date. Congratulations on your new role!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-blue-50 border-t-2 border-gray-100 p-6 flex justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold">
              Official offer from {offer.name}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-200 hover:shadow-xl cursor-pointer transform hover:scale-105"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferDetailsModal;
