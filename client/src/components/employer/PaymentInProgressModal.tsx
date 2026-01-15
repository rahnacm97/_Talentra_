import React from "react";
import { X, ExternalLink, AlertCircle } from "lucide-react";

interface PaymentInProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentInProgressModal: React.FC<PaymentInProgressModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden">
        {/* Decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-yellow-500" />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="bg-yellow-50 p-4 rounded-full">
            <AlertCircle className="w-10 h-10 text-yellow-600" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment in Progress
          </h2>
          <p className="text-gray-600 mb-6 font-medium">
            A checkout session is already active in another tab or window.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-8 text-sm text-left">
            <div className="flex gap-3 text-yellow-800">
              <ExternalLink className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                To prevent duplicate charges, we only allow one payment session at a time. Please complete the transaction in the other tab or close it before trying again.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-indigo-600 text-white py-3.5 px-6 rounded-xl font-bold hover:bg-indigo-700 active:transform active:scale-[0.98] transition-all shadow-lg shadow-indigo-200"
          >
            Got it, I'll check other tabs
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentInProgressModal;
