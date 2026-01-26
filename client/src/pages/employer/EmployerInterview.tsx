// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Calendar,
//   User,
//   Briefcase,
//   Search,
//   Eye,
// <<<<<<< HEAD
//   X,
//   Video,
//   Clock,
//   CheckCircle,
// =======
// <<<<<<< Updated upstream
//   X, 
// =======
//   X,
//   Clock,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
// >>>>>>> Stashed changes
// >>>>>>> a4015c2 (Implement interview feature with rounds, feedback, and video flow)
// } from "lucide-react";
// import { useVideoCall } from "../../contexts/VideoCallContext";
// import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
// import { fetchEmployerInterviews } from "../../thunks/interview.thunks";
// import { formatFullName } from "../../utils/formatters";
// <<<<<<< Updated upstream
// import EmployerInterviewDetailsModal from "../../components/employer/InterviewModal";
// import type { Interview } from "../../types/interview/interview.types";
// <<<<<<< HEAD
// import Pagination from "../../components/common/pagination/Pagination";
// =======
// import Pagination from "../../components/common/Pagination";
// =======
// import { useNavigate } from "react-router-dom";
// import { FRONTEND_ROUTES } from "../../shared/constants/constants";
// import PageHeader from "../../components/common/auth/PageHeader";
// import Pagination from "../../components/common/pagination/Pagination";
// >>>>>>> Stashed changes
// >>>>>>> a4015c2 (Implement interview feature with rounds, feedback, and video flow)

// const EmployerInterview: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const { interviews, loading, pagination, error } = useAppSelector(
//     (s) => s.interview,
//   );
//   const { startCall } = useVideoCall();

// <<<<<<< HEAD
//   const [activeTab, setActiveTab] = useState<"all" | "scheduled" | "completed">(
//     "all",
//   );
// =======
// <<<<<<< Updated upstream
// =======
//   const [activeTab, setActiveTab] = useState<
//     "all" | "scheduled" | "completed" | "cancelled"
//   >("all");
// >>>>>>> Stashed changes
// >>>>>>> a4015c2 (Implement interview feature with rounds, feedback, and video flow)
//   const [searchQuery, setSearchQuery] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");

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
//         status: activeTab === "all" ? undefined : activeTab,
//       }),
//     );
//   }, [dispatch, currentPage, debouncedSearch, activeTab]);

//   const handlePageChange = useCallback((newPage: number) => {
//     setCurrentPage(newPage);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, []);

// <<<<<<< HEAD
//   const tabs = [
//     { value: "all", label: "All Interviews", icon: Calendar },
//     { value: "scheduled", label: "Scheduled", icon: Clock },
//     { value: "completed", label: "Completed", icon: CheckCircle },
//   ];
// =======
// <<<<<<< Updated upstream
// =======
//   const tabs = [
//     { value: "all", label: "All", icon: Calendar },
//     { value: "scheduled", label: "Scheduled", icon: Clock },
//     { value: "completed", label: "Completed", icon: CheckCircle },
//     { value: "cancelled", label: "Cancelled", icon: XCircle },
//   ];
// >>>>>>> Stashed changes
// >>>>>>> a4015c2 (Implement interview feature with rounds, feedback, and video flow)

//   if (loading && interviews.length === 0) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600 mb-4"></div>
//           <p className="text-gray-600 text-lg font-medium">
//             Loading your interviews...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4">
//         <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <XCircle className="w-8 h-8 text-red-600" />
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-2">
//             Failed to load interviews
//           </h3>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={() =>
//               dispatch(fetchEmployerInterviews({ page: 1, limit: 5 }))
//             }
//             className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
// <<<<<<< Updated upstream
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Interviews</h1>
//           <p className="text-gray-600">
//             View and manage your candidate interviews
//           </p>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
//           <nav className="flex flex-wrap border-b border-gray-200">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.value}
//                 onClick={() => {
//                   setActiveTab(tab.value as any);
//                   setCurrentPage(1);
//                 }}
//                 className={`flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-colors relative ${
//                   activeTab === tab.value
//                     ? "border-b-2 border-indigo-600 text-indigo-600"
//                     : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//                 }`}
//               >
//                 <tab.icon className="w-5 h-5" />
//                 <span>{tab.label}</span>
//                 {activeTab === tab.value && (
//                   <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
//                     {pagination.total}
//                   </span>
//                 )}
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Search Bar */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <div className="relative max-w-md">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
// =======

//         <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <PageHeader
//             title="Interviews"
//             description="Manage and track your candidate selection rounds"
//           />

//           <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm p-1 rounded-xl border border-gray-200 shadow-sm">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.value}
//                 onClick={() => {
//                   setActiveTab(tab.value as any);
//                   setCurrentPage(1);
//                 }}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
//                   activeTab === tab.value
//                     ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105"
//                     : "text-gray-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm"
//                 }`}
//               >
//                 <tab.icon className="w-4 h-4" />
//                 <span className="hidden sm:inline">{tab.label}</span>
//                 {activeTab === tab.value && (
//                   <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
//                     {pagination.total}
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Search/Filters */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
//           <div className="relative group max-w-2xl">
//             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
// >>>>>>> Stashed changes
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search by candidate name or job title..."
//               className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-gray-900 placeholder-gray-400 font-medium"
//             />
//             {searchQuery && (
//               <button
//                 onClick={() => setSearchQuery("")}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* List Section */}
//         <div className="grid gap-6">
//           {interviews.length === 0 ? (
// <<<<<<< Updated upstream
//             <div className="text-center py-24 bg-white rounded-2xl shadow-lg">
//               <Calendar className="w-24 h-24 text-gray-300 mx-auto mb-6" />
//               <h3 className="text-2xl font-semibold text-gray-700">
// <<<<<<< HEAD
//                 No interviews found
// =======
//                 No interviews scheduled
// =======
//             <div className="text-center py-24 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200 shadow-inner">
//               <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <Calendar className="w-12 h-12 text-gray-300" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                 {searchQuery ? "No matches found" : "No interviews yet"}
// >>>>>>> Stashed changes
// >>>>>>> a4015c2 (Implement interview feature with rounds, feedback, and video flow)
//               </h3>
//               <p className="text-gray-500 max-w-sm mx-auto">
//                 {searchQuery
//                   ? "Try adjusting your search terms to find what you're looking for."
//                   : "Interviews will appear here once applications are shortlisted and scheduled."}
//               </p>
//             </div>
//           ) : (
// <<<<<<< Updated upstream
//             <>
//               {interviews.map((interview) => (
//                 <div
//                   key={interview.id}
//                   className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
//                   onClick={() => setSelectedInterview(interview)}
//                 >
//                   <div className="flex items-center gap-6">
//                     {/* Avatar */}
//                     <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0 border-2 border-dashed border-gray-300">
//                       {interview.candidate.profileImage ? (
//                         <img
//                           src={interview.candidate.profileImage}
//                           alt={formatFullName(interview.candidate.fullName)}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <User className="w-10 h-10 text-gray-400 mx-auto mt-3" />
//                       )}
//                     </div>

//                     {/* Details */}
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3">
//                         <h3 className="text-2xl font-bold text-gray-900">
//                           {formatFullName(interview.candidate.fullName)}
//                         </h3>
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
//                             interview.status === "completed"
//                               ? "bg-green-100 text-green-700"
//                               : interview.status === "scheduled"
//                                 ? "bg-blue-100 text-blue-700"
//                                 : "bg-gray-100 text-gray-700"
//                           }`}
//                         >
//                           {interview.status}
//                         </span>
//                       </div>
//                       <p className="text-lg text-gray-600 mt-1 flex items-center gap-2">
//                         <Briefcase className="w-5 h-5" />
//                         {interview.job.title}
//                       </p>
//                       {interview.interviewDate && (
//                         <div className="mt-3 flex items-center gap-3 text-gray-700">
//                           <Calendar className="w-5 h-5 text-indigo-600" />
//                           <span className="font-medium">
//                             {new Date(
//                               interview.interviewDate,
//                             ).toLocaleDateString("en-US", {
//                               weekday: "long",
//                               month: "long",
//                               day: "numeric",
//                               hour: "numeric",
//                               minute: "2-digit",
//                               hour12: true,
//                             })}
//                           </span>
// =======
//             interviews.map((interview) => (
//               <div
//                 key={interview.id}
//                 className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-indigo-200 transition-all duration-300"
//               >
//                 <div className="p-6">
//                   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//                     <div className="flex items-center gap-5">
//                       <div className="relative">
//                         <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
//                           <User className="w-8 h-8 text-white" />
//                         </div>
//                         <div
//                           className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${
//                             interview.status === "completed"
//                               ? "bg-green-500"
//                               : interview.status === "cancelled"
//                                 ? "bg-red-500"
//                                 : "bg-blue-500 animate-pulse"
//                           }`}
//                         >
//                           <div className="w-2 h-2 bg-white rounded-full"></div>
// >>>>>>> Stashed changes
//                         </div>
//                       </div>
//                       <div>
//                         <h3 className="text-2xl font-bold text-gray-900 mb-1">
//                           {formatFullName(interview.candidate.fullName)}
//                         </h3>
//                         <div className="flex items-center gap-2 font-semibold">
//                           <Briefcase className="w-4 h-4" />
//                           <span>{interview.job.title}</span>
//                         </div>
//                       </div>
//                     </div>

// <<<<<<< HEAD
//                     {/* Actions */}
//                     <div className="flex gap-3">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setSelectedInterview(interview);
//                         }}
//                         className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-medium shadow-sm whitespace-nowrap"
//                       >
//                         <Eye className="w-5 h-5" />
//                         View Details
//                       </button>
//                       {interview.status === "scheduled" && (
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             startCall(
//                               interview.id,
//                               (interview.candidate as any)._id ||
//                                 (interview.candidate as any).id,
//                               {
//                                 name:
//                                   interview.employer.companyName ||
//                                   interview.employer.name,
//                                 image: interview.employer.logo,
//                               },
//                               {
//                                 jobTitle: interview.job.title,
//                                 interviewDate:
//                                   interview.interviewDate ||
//                                   new Date().toISOString(),
//                               },
//                             );
//                           }}
//                           className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-medium shadow-sm whitespace-nowrap"
//                         >
//                           <Video className="w-5 h-5" />
//                           Start Call
//                         </button>
//                       )}
//                     </div>
// =======
// <<<<<<< Updated upstream
//                     {/* View Details Button */}
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setSelectedInterview(interview);
//                       }}
//                       className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-medium shadow-sm whitespace-nowrap"
//                     >
//                       <Eye className="w-5 h-5" />
//                       View Details
//                     </button>
// >>>>>>> a4015c2 (Implement interview feature with rounds, feedback, and video flow)
//                   </div>
//                 </div>
//               ))}

//               {/* Pagination */}
//               {pagination.totalPages > 1 && (
//                 <Pagination
//                   currentPage={currentPage}
//                   totalPages={pagination.totalPages}
//                   onPageChange={handlePageChange}
//                 />
//               )}
//             </>
// =======
//                     <div className="flex flex-wrap items-center gap-8 p-6">
//                       <div className="space-y-1">
//                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
//                           Current Status
//                         </span>
//                         <div className="flex items-center gap-2">
//                           <span
//                             className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border flex items-center gap-2 ${
//                               interview.status === "hired"
//                                 ? "bg-emerald-50 text-emerald-700 border-emerald-200"
//                                 : interview.status === "rejected"
//                                   ? "bg-rose-50 text-rose-700 border-rose-200"
//                                   : interview.status === "completed"
//                                     ? "bg-green-50 text-green-700 border-green-200"
//                                     : interview.status === "cancelled"
//                                       ? "bg-red-50 text-red-700 border-red-200"
//                                       : "bg-indigo-50 text-indigo-700 border-indigo-200"
//                             }`}
//                           >
//                             {interview.status === "hired" && (
//                               <CheckCircle className="w-3.5 h-3.5" />
//                             )}
//                             {interview.status === "rejected" && (
//                               <XCircle className="w-3.5 h-3.5" />
//                             )}
//                             {interview.status === "completed" && (
//                               <CheckCircle className="w-3.5 h-3.5" />
//                             )}
//                             {interview.status === "cancelled" && (
//                               <AlertCircle className="w-3.5 h-3.5" />
//                             )}
//                             {(interview.status === "scheduled" ||
//                               interview.status === "rescheduled") && (
//                               <Clock className="w-3.5 h-3.5" />
//                             )}
//                             {interview.status === "hired" ||
//                             interview.status === "rejected"
//                               ? "completed"
//                               : interview.status}
//                           </span>
//                         </div>
//                       </div>

//                       {interview.interviewDate ? (
//                         <div className="space-y-1">
//                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
//                             Date & Time
//                           </span>
//                           <div className="flex items-center gap-3 text-gray-700 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100 font-bold">
//                             <Clock className="w-4 h-4 text-indigo-600" />
//                             <span>
//                               {new Date(interview.interviewDate).toLocaleString(
//                                 "en-US",
//                                 {
//                                   year: "numeric",
//                                   month: "short",
//                                   day: "numeric",
//                                   hour: "numeric",
//                                   minute: "2-digit",
//                                   hour12: true,
//                                 },
//                               )}
//                             </span>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="space-y-1">
//                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
//                             Date & Time
//                           </span>
//                           <div className="flex items-center gap-3 text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-100 font-bold">
//                             <Calendar className="w-4 h-4 text-amber-600" />
//                             <span>Scheduling Pending</span>
//                           </div>
//                         </div>
//                       )}

//                       <div className="flex items-center gap-2.5 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100 w-full lg:w-auto">
//                         {interview.status === "scheduled" ||
//                         interview.status === "rescheduled" ? (
//                           <></>
//                         ) : null}
//                         <button
//                           onClick={() =>
//                             navigate(
//                               FRONTEND_ROUTES.EMPLOYERINTERVIEWDETAIL.replace(
//                                 ":id",
//                                 interview.id,
//                               ),
//                             )
//                           }
//                           className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-100"
//                           title="View Details"
//                         >
//                           <Eye className="w-5 h-5" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
// >>>>>>> Stashed changes
//           )}
//         </div>

//         {pagination.totalPages > 1 && (
//           <div className="mt-12">
//             <Pagination
//               currentPage={currentPage}
//               totalPages={pagination.totalPages}
//               onPageChange={handlePageChange}
//             />
//           </div>
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
  X,
  Video,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useVideoCall } from "../../contexts/VideoCallContext";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchEmployerInterviews } from "../../thunks/interview.thunks";
import { formatFullName } from "../../utils/formatters";
import EmployerInterviewDetailsModal from "../../components/employer/InterviewModal";
import type { Interview } from "../../types/interview/interview.types";
import PageHeader from "../../components/common/auth/PageHeader";
import Pagination from "../../components/common/pagination/Pagination";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";

const EmployerInterview: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { interviews, loading, pagination, error } = useAppSelector(
    (state) => state.interview,
  );
  const { startCall } = useVideoCall();

  const [activeTab, setActiveTab] = useState<
    "all" | "scheduled" | "completed" | "cancelled"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    dispatch(
      fetchEmployerInterviews({
        page: currentPage,
        limit: 5,
        search: debouncedSearch || undefined,
        status: activeTab === "all" ? undefined : activeTab,
      }),
    );
  }, [dispatch, currentPage, debouncedSearch, activeTab]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const tabs = [
    { value: "all", label: "All", icon: Calendar },
    { value: "scheduled", label: "Scheduled", icon: Clock },
    { value: "completed", label: "Completed", icon: CheckCircle },
    { value: "cancelled", label: "Cancelled", icon: XCircle },
  ];

  if (loading && interviews.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your interviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load interviews</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => dispatch(fetchEmployerInterviews({ page: 1, limit: 5 }))}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header + Tabs */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <PageHeader
            title="Interviews"
            description="Manage and track your candidate selection rounds"
          />
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm p-1 rounded-xl border border-gray-200 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value as any);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab.value
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105"
                    : "text-gray-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {activeTab === tab.value && (
                  <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
                    {pagination.total}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="relative group max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by candidate name or job title..."
              className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-gray-900 placeholder-gray-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="grid gap-6">
          {interviews.length === 0 ? (
            <div className="text-center py-24 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200 shadow-inner">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {searchQuery ? "No matches found" : "No interviews yet"}
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                {searchQuery
                  ? "Try adjusting your search terms."
                  : "Interviews will appear here once applications are shortlisted and scheduled."}
              </p>
            </div>
          ) : (
            interviews.map((interview) => (
              <div
                key={interview.id}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-indigo-200 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${
                            interview.status === "completed"
                              ? "bg-green-500"
                              : interview.status === "cancelled"
                              ? "bg-red-500"
                              : "bg-blue-500 animate-pulse"
                          }`}
                        >
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {formatFullName(interview.candidate.fullName)}
                        </h3>
                        <div className="flex items-center gap-2 font-semibold">
                          <Briefcase className="w-4 h-4" />
                          <span>{interview.job.title}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-8 p-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                          Current Status
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border flex items-center gap-2 ${
                              interview.status === "completed"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : interview.status === "cancelled"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-indigo-50 text-indigo-700 border-indigo-200"
                            }`}
                          >
                            {interview.status === "completed" && <CheckCircle className="w-3.5 h-3.5" />}
                            {interview.status === "cancelled" && <AlertCircle className="w-3.5 h-3.5" />}
                            {interview.status === "scheduled" && <Clock className="w-3.5 h-3.5" />}
                            {interview.status}
                          </span>
                        </div>
                      </div>

                      {interview.interviewDate ? (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                            Date & Time
                          </span>
                          <div className="flex items-center gap-3 text-gray-700 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100 font-bold">
                            <Clock className="w-4 h-4 text-indigo-600" />
                            <span>
                              {new Date(interview.interviewDate).toLocaleString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </div>
                        </div>
                      ) : null}

                      <div className="flex items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100 w-full lg:w-auto">
                        <button
                          onClick={() => setSelectedInterview(interview)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-100"
                          title="View Details (Modal)"
                        >
                          <Eye className="w-5 h-5" />
                        </button>

                        {interview.status === "scheduled" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startCall(
                                interview.id,
                                (interview.candidate as any)._id || (interview.candidate as any).id,
                                {
                                  name: interview.employer.companyName || interview.employer.name,
                                  image: interview.employer.logo,
                                },
                                {
                                  jobTitle: interview.job.title,
                                  interviewDate: interview.interviewDate || new Date().toISOString(),
                                },
                              );
                            }}
                            className="p-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors border border-green-200"
                            title="Start Video Call"
                          >
                            <Video className="w-5 h-5" />
                          </button>
                        )}

                        {/* Optional: keep route navigation too */}
                        <button
                          onClick={() =>
                            navigate(
                              FRONTEND_ROUTES.EMPLOYERINTERVIEWDETAIL.replace(":id", interview.id),
                            )
                          }
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
                          title="View Details (Page)"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

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
