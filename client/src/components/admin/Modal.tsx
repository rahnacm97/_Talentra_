import React from "react";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import VerifiedIcon from "@mui/icons-material/Verified";

interface ModalProps {
  isOpen: boolean;
  onApprove: () => void;
  onCancel: () => void;
  actionType: "block" | "unblock" | "verify" | "reject" | "delete";
  name: string;
  reason?: string;
  onReasonChange?: (reason: string) => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onApprove,
  onCancel,
  actionType,
  name,
  reason = "",
  onReasonChange,
}) => {
  if (!isOpen) return null;

  const isBlock = actionType === "block";
  const isUnblock = actionType === "unblock";
  const isVerify = actionType === "verify";
  const isReject = actionType === "reject";

  const title = isVerify
    ? "Verify Employer"
    : isReject
      ? "Reject Verification"
      : actionType === "delete"
        ? "Delete Feedback"
        : `${isBlock ? "Block" : "Unblock"} Employer`;

  const description = isVerify
    ? `Are you sure you want to verify <strong>${name}</strong>? This will mark them as a verified employer on the platform.`
    : isReject
      ? `Are you sure you want to <strong>reject</strong> verification for <strong>${name}</strong>? They will be notified with the reason.`
      : actionType === "delete"
        ? `Are you sure you want to <strong>delete</strong> the feedback from <strong>${name}</strong>? This action cannot be undone.`
        : `Are you sure you want to ${isBlock ? "block" : "unblock"} <strong>${name}</strong>? This action will ${
            isBlock
              ? "prevent them from accessing the platform"
              : "restore their access to the platform"
          }.`;

  const { icon, bgColor, iconColor } = isBlock
    ? {
        icon: <BlockIcon sx={{ fontSize: 32 }} />,
        bgColor: "bg-yellow-100",
        iconColor: "#f59e0b",
      }
    : isUnblock
      ? {
          icon: <CheckCircleIcon sx={{ fontSize: 32 }} />,
          bgColor: "bg-green-100",
          iconColor: "#10b981",
        }
      : isVerify
        ? {
            icon: <VerifiedIcon sx={{ fontSize: 32 }} />,
            bgColor: "bg-green-100",
            iconColor: "#10b981",
          }
        : {
            icon: <CloseIcon sx={{ fontSize: 32 }} />,
            bgColor: "bg-red-100",
            iconColor: "#dc2626",
          };

  const approveBtnClass = isVerify
    ? "bg-green-600 hover:bg-green-700"
    : isBlock
      ? "bg-red-600 hover:bg-red-700"
      : isUnblock
        ? "bg-green-600 hover:bg-green-700"
        : "bg-red-600 hover:bg-red-700";

  const approveLabel = isVerify
    ? "Verify"
    : isBlock
      ? "Block"
      : isUnblock
        ? "Unblock"
        : actionType === "delete"
          ? "Delete"
          : "Reject";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div
          className={`flex items-center justify-center w-16 h-16 mx-auto ${bgColor} rounded-full mb-4`}
        >
          <div style={{ color: iconColor }}>{icon}</div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          {title}
        </h2>

        <p
          className="text-gray-600 text-center mb-6 text-sm"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        {isReject && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Rejection <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => onReasonChange?.(e.target.value)}
              placeholder="Enter reason for rejection (required)..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              rows={4}
              required
            />
            {!reason.trim() && (
              <p className="text-xs text-red-500 mt-1">Reason is required</p>
            )}
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onApprove}
            disabled={isReject && !reason.trim()}
            className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
              isReject && !reason.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : approveBtnClass
            }`}
          >
            {approveLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
