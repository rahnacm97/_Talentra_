import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import {
  createOrder,
  verifyPayment,
  fetchSubscriptionHistory,
} from "../../thunks/subscription.thunk";
import { downloadInvoice } from "../../features/subscription/subscriptionApi";
import { Check, Zap, Shield, Loader2, Calendar } from "lucide-react";
import ActiveSubscriptionModal from "../../components/employer/ActiveSubscriptionModal";
import PaymentInProgressModal from "../../components/employer/PaymentInProgressModal";
import { updateSubscriptionStatus } from "../../features/auth/authSlice";

interface Plan {
  id: "free" | "professional" | "enterprise";
  name: string;
  price: number;
  displayPrice: string;
  period: string;
  savings?: string;
  popular?: boolean;
  features: string[];
  cta: string;
  durationInMonths: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const EmployerBilling: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { history, loading } = useSelector(
    (state: RootState) => state.subscription,
  );
  const [selectedPlan, setSelectedPlan] = useState<Plan["id"]>("professional");
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [showActiveModal, setShowActiveModal] = useState(false);

  const [showPaymentInProgressModal, setShowPaymentInProgressModal] =
    useState(false);

  useEffect(() => {
    dispatch(fetchSubscriptionHistory());

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [dispatch]);

  // Sync Redux auth state with latest subscription history
  useEffect(() => {
    if (history && history.length > 0 && user?.role === "Employer") {
      const latest = history[0];
      const isActuallyActive = latest.status === "active";

      if (user.hasActiveSubscription !== isActuallyActive) {
        dispatch(
          updateSubscriptionStatus({
            hasActiveSubscription: isActuallyActive,
            currentPlan: isActuallyActive ? latest.plan : "free",
          }),
        );
      }
    }
  }, [history, user, dispatch]);

  const handleUpgrade = async (plan: Plan) => {
    if (plan.id === "free") return;
    if (isActive) {
      setShowActiveModal(true);
      return;
    }

    // Check for cross-tab payment lock
    const paymentLock = localStorage.getItem("talentra_payment_lock");
    if (paymentLock) {
      const lockData = JSON.parse(paymentLock);
      // Lock for 10 minutes to handle tab crashes but allow eventual retry
      if (Date.now() - lockData.timestamp < 10 * 60 * 1000) {
        setShowPaymentInProgressModal(true);
        return;
      }
    }

    // Set lock
    localStorage.setItem(
      "talentra_payment_lock",
      JSON.stringify({
        timestamp: Date.now(),
        planId: plan.id,
      }),
    );

    setProcessingPlanId(plan.id);

    try {
      const resultAction = await dispatch(
        createOrder({ amount: plan.price, currency: "INR" }),
      );

      if (createOrder.fulfilled.match(resultAction)) {
        const order = resultAction.payload;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount, // Already includes GST from backend
          currency: order.currency,
          name: "Talentra",
          description: `${plan.name} Subscription`,
          order_id: order.id,
          handler: async function (response: any) {
            await dispatch(
              verifyPayment({
                paymentDetails: response,
                planDetails: {
                  plan: plan.id,
                  price: plan.price,
                  durationInMonths: plan.durationInMonths,
                },
              }),
            );
            // Clear payment lock on success
            localStorage.removeItem("talentra_payment_lock");
            // Refresh user data or history
            dispatch(fetchSubscriptionHistory());
            window.location.reload(); // Simple reload to refresh auth state/subscription status
          },
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: user?.phoneNumber,
          },
          theme: {
            color: "#4F46E5",
          },
          modal: {
            ondismiss: function () {
              setProcessingPlanId(null);
              localStorage.removeItem("talentra_payment_lock");
            },
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        setProcessingPlanId(null);
        localStorage.removeItem("talentra_payment_lock");
      }
    } catch (error) {
      console.error("Payment initiation failed", error);
      setProcessingPlanId(null);
      localStorage.removeItem("talentra_payment_lock");
    }
  };

  const plans: Plan[] = [
    {
      id: "professional",
      name: "Professional Monthly",
      price: 2499,
      displayPrice: "₹2,499 + 18% GST",
      period: "month",
      popular: true,
      durationInMonths: 1,
      features: [
        "Unlimited job postings",
        "Full candidate contact details",
        "Shortlist & message candidates",
        "Featured in search results",
        "Priority support (24hr response)",
        "Advanced analytics dashboard",
        "Bulk actions & templates",
      ],
      cta: "Upgrade to Monthly",
    },
    {
      id: "enterprise",
      name: "Professional Annual",
      price: 24990,
      displayPrice: "₹24,990 + 18% GST",
      period: "year",
      savings: "Save ₹5,000 (2 months free)",
      durationInMonths: 12,
      features: [
        "Everything in Monthly plan",
        "2 months free",
        "Dedicated account manager",
        "Custom branding on jobs",
        "API access & webhooks",
        "Advanced reporting & export",
        "Priority SLA guarantee",
      ],
      cta: "Upgrade to Annual",
    },
  ];

  const isActive = user?.hasActiveSubscription;
  const currentPlan = user?.currentPlan || "free";
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <ActiveSubscriptionModal
        isOpen={showActiveModal}
        onClose={() => setShowActiveModal(false)}
        currentPlan={currentPlan}
      />
      <PaymentInProgressModal
        isOpen={showPaymentInProgressModal}
        onClose={() => setShowPaymentInProgressModal(false)}
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Billing & Subscription
          </h1>
          <p className="text-gray-600">
            Manage your subscription and payment methods
          </p>
        </div>

        {/* Active Plan Info */}

        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="font-semibold text-blue-800">
            Current Plan:{" "}
            {isActive
              ? currentPlan === "enterprise"
                ? "Professional Annual"
                : "Professional Monthly"
              : history && history.length > 0 && history[0].status === "expired"
                ? "No Plan"
                : "Free Plan"}
          </p>
          <p className="text-sm text-blue-700 mt-1">
            Status:{" "}
            {isActive
              ? "Active"
              : history && history.length > 0 && history[0].status === "expired"
                ? "Expired"
                : "Standard"}
          </p>
          {!isActive && user?.trialEndsAt && (
            <p className="text-sm text-red-600 mt-2 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Trial ends on:{" "}
              {new Date(user.trialEndsAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              <span className="text-gray-500 font-normal">
                (
                {Math.ceil(
                  (new Date(user.trialEndsAt).getTime() -
                    new Date().getTime()) /
                    (1000 * 60 * 60 * 24),
                )}{" "}
                days remaining)
              </span>
            </p>
          )}
        </div>

        {/* Plans Grid */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Choose Your Plan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => {
              const isCurrent =
                (isActive && currentPlan === plan.id) ||
                (!isActive && plan.id === "free");
              const isProcessing = loading && processingPlanId === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-xl border-2 p-6 transition-all cursor-pointer ${
                    plan.popular
                      ? "border-indigo-500 shadow-lg"
                      : "border-gray-200"
                  } ${
                    selectedPlan === plan.id
                      ? "ring-4 ring-green-500 shadow-xl"
                      : "hover:border-indigo-300 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  {plan.savings && (
                    <div className="mb-3">
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {plan.savings}
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>

                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.displayPrice}
                    </span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-6 min-h-[240px]">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isCurrent) handleUpgrade(plan);
                    }}
                    disabled={loading || isCurrent}
                    className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                      isCurrent
                        ? "bg-green-50 text-green-700 border-2 border-green-500 cursor-not-allowed"
                        : plan.popular
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isCurrent ? (
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4" /> Current Plan
                      </span>
                    ) : (
                      plan.cta
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Billing History
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              View your past subscriptions and transactions
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Plan
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Start Date
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    End Date
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history && history.length > 0 ? (
                  history.map((item: any, index: number) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <Zap className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {item.plan === "professional"
                                ? "Professional Monthly"
                                : item.plan === "enterprise"
                                  ? "Professional Annual"
                                  : item.plan}
                            </p>
                            <p className="text-xs text-gray-500">
                              Subscription
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-900">
                            ₹
                            {item.totalAmount?.toLocaleString() ||
                              item.price.toLocaleString()}
                          </p>
                          {item.subtotal && item.gstAmount && (
                            <div className="text-xs text-gray-500">
                              <div>
                                Subtotal: ₹{item.subtotal.toLocaleString()}
                              </div>
                              <div>
                                GST ({(item.gstRate * 100).toFixed(0)}%): ₹
                                {item.gstAmount.toFixed(2)}
                              </div>
                            </div>
                          )}
                          <p className="text-xs text-gray-500">
                            {item.plan === "enterprise" ? "Annual" : "Monthly"}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-gray-900">
                          {new Date(item.startDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-gray-900">
                          {new Date(item.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.status === "active"
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          />
                          {item.status === "active" ? "Active" : "Expired"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          <button
                            onClick={async () => {
                              try {
                                const blob = await downloadInvoice(item.id);
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement("a");
                                link.href = url;
                                link.download = `Invoice-${item.id}.pdf`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                              } catch (error) {
                                console.error(
                                  "Failed to download invoice:",
                                  error,
                                );
                              }
                            }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <Shield className="w-8 h-8 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          No billing history yet
                        </h4>
                        <p className="text-gray-600 mb-1">
                          You are currently on the free plan
                        </p>
                        <p className="text-sm text-gray-500">
                          Upgrade to a professional plan for more features
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-12">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Shield className="w-5 h-5 text-green-600" />
            <p className="text-sm">
              Secure payments • 30-day money-back guarantee • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerBilling;
