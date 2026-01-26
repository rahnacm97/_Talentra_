import React from "react";
import { X, ShieldCheck } from "lucide-react";

interface ActiveSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
}

const ActiveSubscriptionModal: React.FC<ActiveSubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden">
        {/* Decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="bg-indigo-50 p-4 rounded-full">
            <ShieldCheck className="w-10 h-10 text-indigo-600" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Active Subscription Found
          </h2>
          <p className="text-gray-600 mb-6 font-medium">
            You are currently subscribed to the{" "}
            <span className="text-indigo-600 font-bold uppercase">
              {currentPlan === "enterprise" ? "Annual" : "Monthly"}
            </span>{" "}
            plan.
          </p>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-8 text-sm text-left">
            <p className="text-gray-700 leading-relaxed">
              To upgrade or change your current subscription, please note:
            </p>
            <ul className="mt-3 space-y-2 text-gray-600 list-disc list-inside">
              <li>Upgrades take effect after the current billing cycle ends</li>
              <li>
                Or you can contact our support team for an immediate plan change
              </li>
              <li>
                Check your <strong>Billing History</strong> below for the exact
                expiry date
              </li>
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-indigo-600 text-white py-3.5 px-6 rounded-xl font-bold hover:bg-indigo-700 active:transform active:scale-[0.98] transition-all shadow-lg shadow-indigo-200"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveSubscriptionModal;
