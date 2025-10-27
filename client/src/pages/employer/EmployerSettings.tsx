import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  CreditCard,
  Shield,
  Eye,
  EyeOff,
  Save,
  Check,
  AlertCircle,
  Download,
  Camera,
} from "lucide-react";

const EmployerSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("contact");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [contactInfo, setContactInfo] = useState({
    email: "hr@techcorp.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street, Silicon Valley, CA 94025",
    country: "United States",
    timezone: "America/Los_Angeles",
  });

  // Account Settings State
  const [accountSettings, setAccountSettings] = useState({
    accountName: "John Doe",
    accountEmail: "john.doe@techcorp.com",
    role: "HR Manager",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification Settings State
  const [notifications, setNotifications] = useState({
    emailNewApplications: true,
    emailShortlisted: true,
    emailInterviews: true,
    emailMessages: true,
    pushNewApplications: false,
    pushMessages: true,
    weeklyReport: true,
    monthlyReport: false,
  });

  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    showCompanyName: true,
    showLogo: true,
    showWebsite: true,
    allowDirectMessages: true,
    showInSearchResults: true,
  });

  // Billing State
  const [billingInfo] = useState({
    plan: "Professional",
    nextBillingDate: "Nov 25, 2025",
    amount: "$99/month",
    paymentMethod: "**** **** **** 4242",
  });

  const handleSave = (section: string) => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    console.log(`Saving ${section}...`);
  };

  const tabs = [
    { id: "contact", label: "Contact Info", icon: Mail },
    { id: "account", label: "Account", icon: User },
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
            Manage your account and contact preferences
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

        <div className="bg-white rounded-lg shadow-md mb-6">
          {/* Top Bar Navigation */}
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
          {/* Contact Information Tab */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Contact Information
                </h2>
                <p className="text-gray-600">
                  Manage your company's contact details
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          email: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          phone: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      value={contactInfo.address}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          address: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    value={contactInfo.country}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        country: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Australia</option>
                    <option>Germany</option>
                    <option>India</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={contactInfo.timezone}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        timezone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>America/Los_Angeles</option>
                    <option>America/New_York</option>
                    <option>Europe/London</option>
                    <option>Europe/Paris</option>
                    <option>Asia/Tokyo</option>
                    <option>Asia/Kolkata</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => handleSave("contact")}
                  className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          )}

          {/* Account Settings Tab */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Account Settings
                </h2>
                <p className="text-gray-600">
                  Manage your personal account information and password
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    JD
                  </div>
                  <div>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      <Camera className="w-4 h-4" />
                      <span>Change Photo</span>
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      JPG, PNG up to 2MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={accountSettings.accountName}
                    onChange={(e) =>
                      setAccountSettings({
                        ...accountSettings,
                        accountName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={accountSettings.accountEmail}
                    onChange={(e) =>
                      setAccountSettings({
                        ...accountSettings,
                        accountEmail: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={accountSettings.role}
                    onChange={(e) =>
                      setAccountSettings({
                        ...accountSettings,
                        role: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
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
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={accountSettings.currentPassword}
                        onChange={(e) =>
                          setAccountSettings({
                            ...accountSettings,
                            currentPassword: e.target.value,
                          })
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
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={accountSettings.newPassword}
                        onChange={(e) =>
                          setAccountSettings({
                            ...accountSettings,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="password"
                        value={accountSettings.confirmPassword}
                        onChange={(e) =>
                          setAccountSettings({
                            ...accountSettings,
                            confirmPassword: e.target.value,
                          })
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
                  Choose how you want to be notified
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
                        key: "emailNewApplications",
                        label: "New Applications",
                        description:
                          "Get notified when someone applies to your job",
                      },
                      {
                        key: "emailShortlisted",
                        label: "Shortlisted Candidates",
                        description: "Updates when candidates are shortlisted",
                      },
                      {
                        key: "emailInterviews",
                        label: "Interview Reminders",
                        description: "Reminders for upcoming interviews",
                      },
                      {
                        key: "emailMessages",
                        label: "New Messages",
                        description:
                          "When you receive messages from candidates",
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
                        key: "pushNewApplications",
                        label: "New Applications",
                        description:
                          "Instant push notifications for new applications",
                      },
                      {
                        key: "pushMessages",
                        label: "Messages",
                        description: "Push notifications for new messages",
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
                    Reports
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        key: "weeklyReport",
                        label: "Weekly Report",
                        description: "Summary of applications and activities",
                      },
                      {
                        key: "monthlyReport",
                        label: "Monthly Report",
                        description: "Comprehensive monthly analytics report",
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

          {/* Privacy Settings Tab */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Privacy Settings
                </h2>
                <p className="text-gray-600">
                  Control what information is visible to candidates
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    key: "showCompanyName",
                    label: "Show Company Name",
                    description: "Display your company name on job postings",
                  },
                  {
                    key: "showLogo",
                    label: "Show Company Logo",
                    description: "Display your company logo on listings",
                  },
                  {
                    key: "showWebsite",
                    label: "Show Website",
                    description: "Allow candidates to visit your website",
                  },
                  {
                    key: "allowDirectMessages",
                    label: "Allow Direct Messages",
                    description: "Let candidates message you directly",
                  },
                  {
                    key: "showInSearchResults",
                    label: "Show in Search Results",
                    description: "Appear in candidate searches for companies",
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
                    Some information may still be visible to candidates who have
                    already applied to your jobs or are in your hiring pipeline.
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
                  Manage your subscription and payment methods
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {billingInfo.plan} Plan
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Perfect for growing teams
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
                    <span>Unlimited job postings</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Advanced analytics</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Priority support</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Team collaboration tools</span>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Upgrade Plan
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors">
                    Change Plan
                  </button>
                </div>
              </div>

              <div>
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
                        <p className="font-medium text-gray-900">
                          Payment Method
                        </p>
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
                      <span className="text-gray-600">Next billing date</span>
                      <span className="font-medium text-gray-900">
                        {billingInfo.nextBillingDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Billing History
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                      {[
                        {
                          date: "Oct 25, 2025",
                          description: "Professional Plan",
                          amount: "$99.00",
                          status: "Paid",
                        },
                        {
                          date: "Sep 25, 2025",
                          description: "Professional Plan",
                          amount: "$99.00",
                          status: "Paid",
                        },
                        {
                          date: "Aug 25, 2025",
                          description: "Professional Plan",
                          amount: "$99.00",
                          status: "Paid",
                        },
                      ].map((invoice, index) => (
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
                            {invoice.amount}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {invoice.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center justify-end space-x-1 ml-auto">
                              <Download className="w-4 h-4" />
                              <span>Download</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Cancel Subscription
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      If you cancel your subscription, you'll lose access to all
                      premium features at the end of your current billing
                      period.
                    </p>
                    <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                      Cancel Subscription
                    </button>
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

export default EmployerSettings;
