import React, { useState } from "react";
import {
  Mail,
  Shield,
  Eye,
  EyeOff,
  Save,
  Check,
  AlertCircle,
  Bell,
  CreditCard,
} from "lucide-react";

const CandidateSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Account State
  const [accountSettings, setAccountSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    emailJobMatches: true,
    emailMessages: true,
    pushJobAlerts: false,
    weeklyDigest: true,
  });

  // Privacy State
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    showContactInfo: false,
    allowRecruiterMessages: true,
    showInSearches: true,
  });

  // Billing State
  const [billingInfo] = useState({
    plan: "Premium",
    nextBillingDate: "Nov 25, 2025",
    amount: "$19/month",
    paymentMethod: "**** **** **** 4242",
  });

  const handleSave = (section: string) => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    console.log(`Saving ${section}...`);
  };

  const tabs = [
    { id: "account", label: "Account", icon: Mail },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your candidate account preferences
          </p>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">
              Settings saved successfully!
            </p>
          </div>
        )}

        {/* Top Bar Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <nav className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Account Tab */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Account Settings
                </h2>
                <p className="text-gray-600">
                  Manage your account security and password
                </p>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Change Password
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={accountSettings.currentPassword}
                        onChange={(e) =>
                          setAccountSettings((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={accountSettings.newPassword}
                        onChange={(e) =>
                          setAccountSettings((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={accountSettings.confirmPassword}
                        onChange={(e) =>
                          setAccountSettings((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => handleSave("account")}
                  className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Notification Preferences
                </h2>
                <p className="text-gray-600">
                  Choose how you want to receive job alerts and updates
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Email Notifications
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        key: "emailJobMatches",
                        label: "Job Matches",
                        description: "New jobs matching your profile",
                      },
                      {
                        key: "emailMessages",
                        label: "Messages",
                        description: "Messages from recruiters and employers",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between py-3 border-b border-gray-100"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {item.label}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setNotifications({
                              ...notifications,
                              [item.key]:
                                !notifications[
                                  item.key as keyof typeof notifications
                                ],
                            })
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications[
                              item.key as keyof typeof notifications
                            ]
                              ? "bg-indigo-600"
                              : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications[
                                item.key as keyof typeof notifications
                              ]
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Push Notifications
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        key: "pushJobAlerts",
                        label: "Job Alerts",
                        description:
                          "Instant notifications for new job matches",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between py-3 border-b border-gray-100"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {item.label}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setNotifications({
                              ...notifications,
                              [item.key]:
                                !notifications[
                                  item.key as keyof typeof notifications
                                ],
                            })
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications[
                              item.key as keyof typeof notifications
                            ]
                              ? "bg-indigo-600"
                              : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications[
                                item.key as keyof typeof notifications
                              ]
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => handleSave("notifications")}
                  className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Privacy Settings
                </h2>
                <p className="text-gray-600">
                  Control your profile visibility to recruiters
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    key: "profileVisibility",
                    label: "Profile Visibility",
                    description: "Make your profile visible to recruiters",
                  },
                  {
                    key: "showContactInfo",
                    label: "Show Contact Info",
                    description: "Display email and phone to recruiters",
                  },
                  {
                    key: "allowRecruiterMessages",
                    label: "Allow Recruiter Messages",
                    description: "Receive direct messages from recruiters",
                  },
                  {
                    key: "showInSearches",
                    label: "Show in Searches",
                    description: "Appear in recruiter searches",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-4 border-b border-gray-100"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setPrivacySettings({
                          ...privacySettings,
                          [item.key]:
                            !privacySettings[
                              item.key as keyof typeof privacySettings
                            ],
                        })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        privacySettings[
                          item.key as keyof typeof privacySettings
                        ]
                          ? "bg-indigo-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          privacySettings[
                            item.key as keyof typeof privacySettings
                          ]
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Privacy Notice</p>
                  <p className="text-sm text-blue-800 mt-1">
                    Recruiters who have already viewed your profile may still be
                    able to contact you.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => handleSave("privacy")}
                  className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Billing & Subscription
                </h2>
                <p className="text-gray-600">
                  Manage your Premium subscription
                </p>
              </div>

              {/* Current Plan */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {billingInfo.plan} Plan
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Unlimited job applications & priority support
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-indigo-600">
                      {billingInfo.amount}
                    </p>
                    <p className="text-sm text-gray-600">Billed monthly</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Unlimited applications</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Priority support</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Resume analytics</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Job match insights</span>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors">
                    Manage Plan
                  </button>
                </div>
              </div>

              {/* Billing Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Method
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <CreditCard className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Visa</p>
                        <p className="text-sm text-gray-600">
                          {billingInfo.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                      Update
                    </button>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Next billing</span>
                      <span className="font-medium text-gray-900">
                        {billingInfo.nextBillingDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateSettings;
