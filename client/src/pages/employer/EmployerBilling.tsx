import React, { useEffect, useState } from "react";
import {
  Check,
  X,
  Zap,
  CreditCard,
  Download,
  AlertCircle,
  Shield,
} from "lucide-react";

interface Plan {
  id: "free" | "monthly" | "yearly";
  name: string;
  price: string;
  period: string;
  savings?: string;
  popular?: boolean;
  features: string[];
  cta: string;
}

interface BillingItem {
  date: string;
  description: string;
  amount: number;
  status: "Paid" | "Pending" | "Failed";
  invoiceUrl?: string;
}

const EmployerBilling: React.FC = () => {
<<<<<<< Updated upstream
  const [selectedPlan, setSelectedPlan] = useState<Plan["id"]>("monthly");

  const mockSubscription = {
    isActive: true,
    planType: "yearly" as "monthly" | "yearly",
    nextBillingDate: "2025-12-15",
    cancelAtPeriodEnd: false,
    status: "active",
    billingHistory: [
      {
        date: "2025-11-15",
        description: "Professional Annual Plan",
        amount: 24990,
        status: "Paid" as const,
        invoiceUrl: "#",
      },
      {
        date: "2024-11-15",
        description: "Professional Annual Plan",
        amount: 24990,
        status: "Paid" as const,
        invoiceUrl: "#",
      },
    ],
  };
=======
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
>>>>>>> Stashed changes

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleUpgrade = () => {
    if (selectedPlan === "free") return;

    alert(
      `Redirecting to Razorpay for ${selectedPlan === "yearly" ? "Annual" : "Monthly"} plan... (₹${selectedPlan === "yearly" ? "24,990" : "2,499"})`,
    );
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel your subscription?")) {
      alert("Subscription cancelled (demo mode)");
    }
  };

  const {
    isActive,
    planType,
    nextBillingDate,
    cancelAtPeriodEnd,
    billingHistory,
  } = mockSubscription;

  const plans: Plan[] = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      period: "forever",
      features: [
        "Maximum 10 job postings",
        "View applications",
        "Basic job visibility",
        "Email support",
      ],
      cta: "Current Plan",
    },
    {
      id: "monthly",
      name: "Professional Monthly",
      price: "₹2,499",
      period: "month",
      popular: true,
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
      id: "yearly",
      name: "Professional Annual",
      price: "₹24,990",
      period: "year",
      savings: "Save ₹5,000 (2 months free)",
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
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
<<<<<<< Updated upstream
        {isActive && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-semibold text-green-800">
              Active Plan: Professional (
              {planType === "yearly" ? "Annual" : "Monthly"})
=======
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
>>>>>>> Stashed changes
            </p>
            <p className="text-sm text-green-700 mt-1">
              Next billing: {nextBillingDate}
            </p>
            {cancelAtPeriodEnd && (
              <p className="text-red-600 font-medium mt-1">
                Subscription ends on {nextBillingDate}
              </p>
            )}
          </div>
        )}

        {/* Plans Grid */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Choose Your Plan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrent = isActive && planType === plan.id;

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
                  onClick={() => plan.id !== "free" && setSelectedPlan(plan.id)}
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
                      {plan.price}
                    </span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-6 min-h-[240px]">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        {feature.toLowerCase().includes("maximum") ||
                        feature.toLowerCase().includes("basic") ? (
                          <X className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        ) : (
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        )}
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isCurrent && plan.id !== "free") {
                        setSelectedPlan(plan.id);
                        handleUpgrade();
                      }
                    }}
                    disabled={isCurrent}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      isCurrent
                        ? "bg-green-50 text-green-700 border-2 border-green-500 cursor-not-allowed"
                        : plan.popular
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {isCurrent ? (
                      <span className="flex items-center justify-center gap-2">
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

        {/* Billing Information */}
        {isActive && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Billing Information
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Payment Method</p>
                    <p className="text-sm text-gray-600">
                      Razorpay Auto Billing
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Next billing date</span>
                  <span className="font-medium text-gray-900">
                    {nextBillingDate}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Billing cycle</span>
                  <span className="font-medium text-gray-900">
                    {planType === "yearly" ? "Annual" : "Monthly"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Billing History */}
        {isActive && billingHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Billing History
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((invoice, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {invoice.date}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {invoice.description}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right">
                        ₹{invoice.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            invoice.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : invoice.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={invoice.invoiceUrl || "#"}
                          onClick={(e) => alert("Invoice download (demo)")}
                          className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center justify-end gap-1"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cancel Subscription */}
        {isActive && !cancelAtPeriodEnd && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Cancel Subscription
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    If you cancel, you will lose premium features at the end of
                    the current billing period.
                  </p>
                  <button
                    onClick={handleCancel}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    Cancel Subscription
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
