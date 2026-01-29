import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchMyOffers } from "../../thunks/offer.thunks";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  Calendar,
  Filter,
  Eye,
  IndianRupee,
  Award,
  Sparkles,
} from "lucide-react";
import Pagination from "../../components/common/pagination/Pagination";
import { useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";
import {
  useDebounce,
  ApplicationsSkeleton,
} from "../../components/candidate/ApplicationsComponents";
import PageHeader from "../../components/common/auth/PageHeader";
import OfferDetailsModal from "../../components/candidate/OfferDetailsModal";

const OffersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { offers, loading, pagination } = useAppSelector((s) => s.offer);
  const candidateId = useAppSelector((s) => s.auth.user?._id);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const [jobType, setJobType] = useState("");
  const [sortBy, setSortBy] = useState<
    "salary" | "appliedAt" | "updatedAt" | "hiredAt"
  >("updatedAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);

  const [debouncedSearch] = useDebounce(search, 400);

  const PAGE_SIZE = 5;

  const loadOffers = useCallback(() => {
    if (!candidateId) return;

    dispatch(
      fetchMyOffers({
        search: debouncedSearch || undefined,
        page,
        limit: PAGE_SIZE,
        jobType: jobType || undefined,
        sortBy,
        order,
      }),
    );
  }, [dispatch, candidateId, debouncedSearch, page, jobType, sortBy, order]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, jobType]);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (loading && offers.length === 0) {
    return <ApplicationsSkeleton />;
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Stats */}
        <div className="mb-8">
          <PageHeader
            title="My Offers"
            description="Congratulations! Here are your job offers and hired positions."
          />

          {offers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium mb-1">
                      Total Offers
                    </p>
                    <p className="text-4xl font-black">{offers.length}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <Award className="w-8 h-8" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">
                      Latest Offer
                    </p>
                    <p className="text-lg font-bold truncate">
                      {offers[0]?.jobTitle || "N/A"}
                    </p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <Sparkles className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100/50 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <SearchIcon className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search by job title or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-gray-50/50 font-medium text-gray-700 placeholder:text-gray-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-1 hover:bg-red-50 rounded-lg"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-4 rounded-xl transition-all font-bold cursor-pointer border-2 ${
                  showFilters || jobType || sortBy !== "updatedAt"
                    ? "bg-blue-50 border-blue-200 text-blue-600"
                    : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>

              {(search || jobType || sortBy !== "updatedAt") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setJobType("");
                    setSortBy("updatedAt");
                    setOrder("desc");
                    setShowFilters(false);
                  }}
                  className="flex items-center gap-2 px-6 py-4 text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold cursor-pointer border-2 border-red-100 hover:border-red-200"
                >
                  <CloseIcon className="w-5 h-5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t-2 border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              {/* Job Type Filter */}
              <div>
                <p className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                  Filter by Job Type
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Full-time", "Part-time", "Contract", "Internship"].map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() => setJobType(jobType === type ? "" : type)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                          jobType === type
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                            : "bg-white border-gray-100 text-gray-600 hover:border-blue-200 hover:text-blue-600"
                        }`}
                      >
                        {type}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Salary Sorting */}
              <div>
                <p className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <IndianRupee className="w-4 h-4 text-green-500" />
                  Sort by Salary
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSortBy("salary");
                      setOrder("asc");
                    }}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                      sortBy === "salary" && order === "asc"
                        ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-200"
                        : "bg-white border-gray-100 text-gray-600 hover:border-green-200 hover:text-blue-600"
                    }`}
                  >
                    Lowest to Highest
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("salary");
                      setOrder("desc");
                    }}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                      sortBy === "salary" && order === "desc"
                        ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-200"
                        : "bg-white border-gray-100 text-gray-600 hover:border-green-200 hover:text-green-600"
                    }`}
                  >
                    Highest to Lowest
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Offers List */}
        <div className="grid gap-6">
          {offers.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-2xl p-20 text-center border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30 -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-100 to-blue-100 rounded-full blur-3xl opacity-30 -ml-32 -mb-32"></div>

              <div className="relative z-10">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-28 h-28 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-200 transform rotate-3">
                  <Briefcase className="w-14 h-14 text-white" />
                </div>
                <h3 className="text-3xl font-black mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  No Offers Yet
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-10 text-lg leading-relaxed">
                  When you get hired, your official offers will appear here.
                  Keep applying and your dream job is just around the corner!
                </p>
                <button
                  onClick={() => navigate(FRONTEND_ROUTES.JOBVIEW)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-10 py-5 rounded-2xl transition-all shadow-xl shadow-blue-300 hover:shadow-2xl hover:shadow-blue-400 cursor-pointer transform hover:scale-105"
                >
                  Browse More Jobs
                </button>
              </div>
            </div>
          ) : (
            offers.map((offer, index) => (
              <div
                key={offer.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-bl-full"></div>

                <div className="p-5 relative">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Company Logo */}
                      {offer.profileImage ? (
                        <img
                          src={offer.profileImage}
                          alt={offer.name}
                          className="w-16 h-16 rounded-xl object-cover shadow-lg ring-4 ring-white group-hover:ring-blue-100 transition-all"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center text-white font-black text-2xl shadow-xl group-hover:shadow-2xl transition-all transform group-hover:scale-105">
                          {offer.name[0]}
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-2">
                          <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                            {offer.jobTitle}
                          </h3>
                          <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md shadow-md shadow-green-200 flex items-center gap-1 flex-shrink-0">
                            <Sparkles className="w-2.5 h-2.5" />
                            Offer
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors bg-gray-50 px-3 py-1.5 rounded-lg group/item">
                            <div className="bg-blue-100 p-1 rounded-md group-hover/item:bg-blue-200 transition-colors">
                              <Building2 className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <span className="font-semibold text-sm truncate">
                              {offer.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors bg-gray-50 px-3 py-1.5 rounded-lg group/item">
                            <div className="bg-purple-100 p-1 rounded-md group-hover/item:bg-purple-200 transition-colors">
                              <MapPin className="w-3.5 h-3.5 text-purple-600" />
                            </div>
                            <span className="font-semibold text-sm truncate">
                              {offer.location}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors bg-gray-50 px-3 py-1.5 rounded-lg group/item">
                            <div className="bg-green-100 p-1 rounded-md group-hover/item:bg-green-200 transition-colors">
                              <IndianRupee className="w-3.5 h-3.5 text-green-600" />
                            </div>
                            <span className="font-semibold text-sm truncate">
                              {offer.salary || "Not Specified"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors bg-gray-50 px-3 py-1.5 rounded-lg group/item">
                            <div className="bg-orange-100 p-1 rounded-md group-hover/item:bg-orange-200 transition-colors">
                              <Clock className="w-3.5 h-3.5 text-orange-600" />
                            </div>
                            <span className="font-semibold text-sm truncate">
                              {offer.jobType}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3">
                      <button
                        onClick={() => setSelectedOffer(offer)}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2 rounded-lg transition-all font-bold group/btn cursor-pointer shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 text-sm"
                      >
                        <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        View Details
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      <span>
                        Applied{" "}
                        <span className="font-bold text-gray-700">
                          {formatDate(offer.appliedAt)}
                        </span>
                      </span>
                    </div>
                    <div className="text-gray-500 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1.5 rounded-lg border border-green-100">
                      Offer Date:{" "}
                      <span className="text-green-700 font-black">
                        {offer.hiredAt
                          ? formatDate(offer.hiredAt)
                          : formatDate(offer.updatedAt!)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center pb-8">
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedOffer && (
        <OfferDetailsModal
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
        />
      )}
    </div>
  );
};

export default OffersPage;
