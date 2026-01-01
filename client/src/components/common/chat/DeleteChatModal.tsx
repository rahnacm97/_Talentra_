import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  chatPartnerName: string;
  loading: boolean;
}

const DeleteChatModal: React.FC<DeleteChatModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  chatPartnerName,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 opacity-100">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
            Delete Conversation
          </h3>
          
          <p className="text-gray-500 text-center mb-6">
            Are you sure you want to delete your conversation with{" "}
            <span className="font-semibold text-gray-900">{chatPartnerName}</span>? 
            This action cannot be undone and all messages will be permanently removed.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-red-200"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Conversation"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteChatModal;
