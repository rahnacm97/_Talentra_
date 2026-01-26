<<<<<<< Updated upstream
import React from "react";
import { Calendar, X, Briefcase, User } from "lucide-react";
import { formatFullName } from "../../utils/formatters";
import type { Interview } from "../../types/interview/interview.types";
=======
// import {
//   Calendar,
//   X,
//   Briefcase,
//   User,
//   CheckCircle,
//   XCircle,
// } from "lucide-react";
// import { formatFullName } from "../../utils/formatters";
// import type { Interview } from "../../types/interview/interview.types";
// import { useAppDispatch } from "../../hooks/hooks";
// import { updateInterviewStatus } from "../../thunks/interview.thunks";
// import toast from "react-hot-toast";
>>>>>>> Stashed changes

// interface InterviewDetailsModalProps {
//   interview: Interview;
//   onClose: () => void;
// }

// const formatDateTime = (dateIso: string) => {
//   return new Date(dateIso).toLocaleDateString("en-US", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "numeric",
//     minute: "2-digit",
//     hour12: true,
//   });
// };

<<<<<<< Updated upstream
const EmployerInterviewDetailsModal: React.FC<InterviewDetailsModalProps> = ({
  interview,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-200 border-1 rounded-full overflow-hidden flex-shrink-0">
                {interview.candidate.profileImage ? (
                  <img
                    src={interview.candidate.profileImage}
                    alt={interview.candidate.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-gray-400 m-auto mt-5" />
                )}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {formatFullName(interview.candidate.fullName)}
                </h2>
                <p className="text-xl text-gray-600 mt-2 flex items-center gap-2">
                  <Briefcase className="w-6 h-6" />
                  {interview.job.title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-gray-100 rounded-full transition"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
=======
// const EmployerInterviewDetailsModal: React.FC<InterviewDetailsModalProps> = ({
//   interview,
//   onClose,
// }) => {
//   const dispatch = useAppDispatch();

//   const handleCompleteInterview = async () => {
//     try {
//       await dispatch(
//         updateInterviewStatus({ id: interview.id, status: "completed" }),
//       ).unwrap();
//       toast.success("Interview marked as completed");
//       onClose();
//     } catch (error) {
//       toast.error(error as string);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-8">
//           {/* Header */}
//           <div className="flex justify-between items-start mb-8">
//             <div className="flex items-center gap-6">
//               <div className="w-20 h-20 bg-gray-200 border-1 rounded-full overflow-hidden flex-shrink-0">
//                 {interview.candidate.profileImage ? (
//                   <img
//                     src={interview.candidate.profileImage}
//                     alt={interview.candidate.fullName}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <User className="w-10 h-10 text-gray-400 m-auto mt-5" />
//                 )}
//               </div>
//               <div>
//                 <h2 className="text-3xl font-bold text-gray-900">
//                   {formatFullName(interview.candidate.fullName)}
//                 </h2>
//                 <p className="text-xl text-gray-600 mt-2 flex items-center gap-2">
//                   <Briefcase className="w-6 h-6" />
//                   {interview.job.title}
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-3 hover:bg-gray-100 rounded-full transition"
//               aria-label="Close"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>
>>>>>>> Stashed changes

//           {/* Interview Date */}
//           {interview.interviewDate && (
//             <div
//               className={`rounded-2xl p-8 border ${
//                 interview.status === "cancelled"
//                   ? "bg-red-50 border-red-100"
//                   : "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100"
//               }`}
//             >
//               <div className="flex items-center gap-6">
//                 <div
//                   className={`p-5 rounded-2xl ${
//                     interview.status === "cancelled"
//                       ? "bg-red-100"
//                       : "bg-indigo-100"
//                   }`}
//                 >
//                   {interview.status === "cancelled" ? (
//                     <XCircle className="w-12 h-10 text-red-600" />
//                   ) : (
//                     <Calendar className="w-12 h-10 text-indigo-600" />
//                   )}
//                 </div>
//                 <div>
//                   <p
//                     className={`text-sm font-semibold uppercase tracking-wider ${
//                       interview.status === "cancelled"
//                         ? "text-red-700"
//                         : "text-indigo-700"
//                     }`}
//                   >
//                     {interview.status === "cancelled"
//                       ? "Cancelled Interview"
//                       : "Scheduled Interview"}
//                   </p>
//                   <p className="text-xl font-bold text-gray-900 mt-2">
//                     {formatDateTime(interview.interviewDate)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

<<<<<<< Updated upstream
          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-gray-600 mb-6">
              Prepare well and give the candidate a great interview experience
            </p>
            <button
              onClick={onClose}
              className="px-10 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition text-lg shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
=======
//           {/* Footer */}
//           <div className="mt-10 text-center">
//             <p className="text-gray-600 mb-6">
//               {interview.status === "completed"
//                 ? "This interview has been completed."
//                 : interview.status === "cancelled"
//                   ? "This interview has been cancelled. No further action is required."
//                   : "Prepare well and give the candidate a great interview experience"}
//             </p>
//             <div className="flex justify-center gap-4">
//               {(interview.status === "scheduled" ||
//                 interview.status === "rescheduled") && (
//                 <button
//                   onClick={handleCompleteInterview}
//                   className="px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition text-lg shadow-lg flex items-center gap-2"
//                 >
//                   <CheckCircle className="w-5 h-5" />
//                   Mark as Completed
//                 </button>
//               )}
//               <button
//                 onClick={onClose}
//                 className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition text-lg shadow-lg"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
>>>>>>> Stashed changes

// export default EmployerInterviewDetailsModal;
