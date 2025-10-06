import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface ModalProps {
  isOpen: boolean;
  onApprove: () => void;
  onCancel: () => void;
  actionType: "block" | "unblock";
  name: string; // generic name prop
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onApprove,
  onCancel,
  actionType,
  name,
}: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4">
        <div className="p-6">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-yellow-100 rounded-full mb-4">
            {actionType === "block" ? (
              <BlockIcon sx={{ fontSize: 32, color: "#f59e0b" }} />
            ) : (
              <CheckCircleIcon sx={{ fontSize: 32, color: "#10b981" }} />
            )}
          </div>

          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
            Confirm {actionType === "block" ? "Block" : "Unblock"}
          </h2>

          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to {actionType}{" "}
            <span className="font-semibold">{name}</span>? This action
            will{" "}
            {actionType === "block"
              ? "prevent them from accessing the platform"
              : "restore their access to the platform"}
            .
          </p>

          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onApprove}
              className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${
                actionType === "block"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {actionType === "block" ? "Block" : "Unblock"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
