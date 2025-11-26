// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Calendar,
//   User,
//   Briefcase,
//   Search,
//   Eye,
// } from "lucide-react";
// import CloseIcon from "@mui/icons-material/Close";
// import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
// import { fetchEmployerInterviews } from "../../thunks/interview.thunks";
// import { formatFullName } from "../../utils/formatters";
// import EmployerInterviewDetailsModal from "../../components/employer/InterviewModal";
// import type { Interview } from "../../types/interview/interview.types";
// import Pagination from "../../components/employer/Pagination";

// const EmployerInterview: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { interviews, loading, pagination } = useAppSelector((s) => s.interview);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
//     null
//   );
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchQuery);
//       setCurrentPage(1);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   useEffect(() => {
//     dispatch(
//       fetchEmployerInterviews({
//         page: currentPage,
//         limit: 5,
//         search: debouncedSearch || undefined,
//       })
//     );
//   }, [dispatch, currentPage, debouncedSearch]);

//   const handlePageChange = useCallback((newPage: number) => {
//     setCurrentPage(newPage);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, []);

//   if (loading && interviews.length === 0) {
//     return (
//       <div className="py-20 text-center text-gray-600">
//         Loading interviews...
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Scheduled Interviews
//           </h1>
//           <p className="text-gray-600">
//             View and manage your upcoming candidate interviews
//           </p>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <div className="relative max-w-md">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search candidate or job title..."
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//             />
//             {searchQuery && (
//                 <button
//                   onClick={() => setSearchQuery("")}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
//                 >
//                   <CloseIcon className="w-4 h-4" />
//                 </button>
//               )}
//           </div>
//         </div>

//         <div className="space-y-6">
//           {interviews.length === 0 ? (
//             <div className="text-center py-24 bg-white rounded-2xl shadow-lg">
//               <Calendar className="w-24 h-24 text-gray-300 mx-auto mb-6" />
//               <h3 className="text-2xl font-semibold text-gray-700">
//                 No interviews scheduled
//               </h3>
//               <p className="text-gray-500 mt-2">
//                 Interviews will appear here once scheduled
//               </p>
//             </div>
//           ) : (
//             <>
//               {interviews.map((interview) => (
//                 <div
//                   key={interview.id}
//                   className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
//                   onClick={() => setSelectedInterview(interview)}
//                 >
//                   <div className="flex items-center gap-6">
//                     <div className="w-16 h-16 bg-gray-200 border-1 rounded-full overflow-hidden flex-shrink-0">
//                       {interview.candidate.profileImage ? (
//                         <img
//                           src={interview.candidate.profileImage}
//                           alt={interview.candidate.fullName}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <User className="w-8 h-8 text-gray-400 m-auto mt-4" />
//                       )}
//                     </div>

//                     <div className="flex-1">
//                       <h3 className="text-2xl font-bold text-gray-900">
//                         {formatFullName(interview.candidate.fullName)}
//                       </h3>
//                       <p className="text-lg text-gray-600 mt-1 flex items-center gap-2">
//                         <Briefcase className="w-5 h-5" />
//                         {interview.job.title}
//                       </p>
//                       {interview.interviewDate && (
//                         <div className="mt-3 flex items-center gap-3 text-gray-700">
//                           <Calendar className="w-5 h-5 text-indigo-600" />
//                           <span className="font-medium">
//                             {new Date(interview.interviewDate).toLocaleDateString(
//                               "en-US",
//                               {
//                                 weekday: "long",
//                                 month: "long",
//                                 day: "numeric",
//                                 hour: "numeric",
//                                 minute: "2-digit",
//                                 hour12: true,
//                               }
//                             )}
//                           </span>
//                         </div>
//                       )}
//                     </div>

//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setSelectedInterview(interview);
//                       }}
//                       className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-medium"
//                     >
//                       <Eye className="w-5 h-5" />
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               ))}

//               {pagination.totalPages > 1 && (
//                 <Pagination
//                   currentPage={currentPage}
//                   totalPages={pagination.totalPages}
//                   onPageChange={handlePageChange}
//                   className="mt-8"
//                 />
//               )}
//             </>
//           )}
//         </div>

//         {/* Reusable Modal */}
//         {selectedInterview && (
//           <EmployerInterviewDetailsModal
//             interview={selectedInterview as any}
//             onClose={() => setSelectedInterview(null)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmployerInterview;

import React, { useEffect, useState, useCallback } from "react";
import {
  Calendar,
  User,
  Briefcase,
  Search,
  Eye,
  X, // ← Use Lucide X instead of MUI CloseIcon
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchEmployerInterviews } from "../../thunks/interview.thunks";
import { formatFullName } from "../../utils/formatters";
import EmployerInterviewDetailsModal from "../../components/employer/InterviewModal";
import type { Interview } from "../../types/interview/interview.types";
import Pagination from "../../components/common/Pagination"; // or your path

const EmployerInterview: React.FC = () => {
  const dispatch = useAppDispatch();
  const { interviews, loading, pagination, error } = useAppSelector(
    (s) => s.interview,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch interviews
  useEffect(() => {
    dispatch(
      fetchEmployerInterviews({
        page: currentPage,
        limit: 5,
        search: debouncedSearch || undefined,
      }),
    );
  }, [dispatch, currentPage, debouncedSearch]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Initial loading state
  if (loading && interviews.length === 0) {
    return (
      <div className="py-20 text-center text-gray-600 text-lg">
        Loading your interviews...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-600 text-lg font-medium">{error}</p>
        <button
          onClick={() =>
            dispatch(fetchEmployerInterviews({ page: 1, limit: 5 }))
          }
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Scheduled Interviews
          </h1>
          <p className="text-gray-600">
            View and manage your upcoming candidate interviews
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate or job title..."
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            {/* Clear Button - Now Visible & Beautiful */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition hover:scale-110"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Interviews List */}
        <div className="space-y-6">
          {interviews.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl shadow-lg">
              <Calendar className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700">
                No interviews scheduled
              </h3>
              <p className="text-gray-500 mt-2">
                {searchQuery
                  ? "No interviews match your search"
                  : "Interviews will appear here once scheduled"}
              </p>
            </div>
          ) : (
            <>
              {interviews.map((interview) => (
                <div
                  key={interview.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedInterview(interview)}
                >
                  <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0 border-2 border-dashed border-gray-300">
                      {interview.candidate.profileImage ? (
                        <img
                          src={interview.candidate.profileImage}
                          alt={formatFullName(interview.candidate.fullName)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 text-gray-400 mx-auto mt-3" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {formatFullName(interview.candidate.fullName)}
                      </h3>
                      <p className="text-lg text-gray-600 mt-1 flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        {interview.job.title}
                      </p>
                      {interview.interviewDate && (
                        <div className="mt-3 flex items-center gap-3 text-gray-700">
                          <Calendar className="w-5 h-5 text-indigo-600" />
                          <span className="font-medium">
                            {new Date(
                              interview.interviewDate,
                            ).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInterview(interview);
                      }}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-medium shadow-sm whitespace-nowrap"
                    >
                      <Eye className="w-5 h-5" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}

              {/* Reusable Pagination */}
              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>

        {/* Modal */}
        {selectedInterview && (
          <EmployerInterviewDetailsModal
            interview={selectedInterview}
            onClose={() => setSelectedInterview(null)}
          />
        )}
      </div>
    </div>
  );
};

export default EmployerInterview;
