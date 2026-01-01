import React from "react";
import { useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";
import { Lock } from "lucide-react";

interface SubscriptionExpiredModalProps {
  isOpen: boolean;
}

const SubscriptionExpiredModal: React.FC<SubscriptionExpiredModalProps> = ({
  isOpen,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Trial Period Expired
        </h2>
        <p className="text-gray-600 mb-8">
          Your one-month free trial has ended. To continue using Talentra and
          accessing premium features, please subscribe to a plan.
        </p>
        <button
          onClick={() => navigate(FRONTEND_ROUTES.EMPLOYERBILLING)}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          View Subscription Plans
        </button>
      </div>
    </div>
  );
};

export default SubscriptionExpiredModal;
