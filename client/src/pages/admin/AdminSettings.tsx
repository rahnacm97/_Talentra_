import React, { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import EmailIcon from "@mui/icons-material/Email";
import GroupIcon from "@mui/icons-material/Group";
import SaveIcon from "@mui/icons-material/Save";
import Modal from "../../components/admin/Modal";

const AdminSettings: React.FC = () => {
  // Mock settings data
  const initialSettings = {
    general: {
      siteName: "Talentra",
      maintenanceMode: false,
      maxJobsPerEmployer: 50,
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      notificationRetentionDays: 30,
    },
    userRoles: {
      allowAdminInvites: true,
      allowEmployerSelfRegistration: true,
      allowCandidateSelfRegistration: true,
    },
  };

  const [settings, setSettings] = useState(initialSettings);
  const [showModal, setShowModal] = useState(false);
  const [pendingSettings, setPendingSettings] = useState(initialSettings);

  const handleInputChange = (
    section: keyof typeof settings,
    key: string,
    value: string | boolean | number,
  ) => {
    setPendingSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    setShowModal(true);
  };

  const handleConfirmSave = () => {
    setSettings(pendingSettings);
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
    setPendingSettings(settings); // Revert pending changes
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          System Settings
        </h1>
        <p className="text-gray-600">
          Manage platform configuration and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <SettingsIcon sx={{ fontSize: 24, color: "#2563eb" }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              General Settings
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Site Name
                </label>
                <p className="text-xs text-gray-500">
                  The name displayed across the platform
                </p>
              </div>
              <input
                type="text"
                value={pendingSettings.general.siteName}
                onChange={(e) =>
                  handleInputChange("general", "siteName", e.target.value)
                }
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Maintenance Mode
                </label>
                <p className="text-xs text-gray-500">
                  Enable to restrict access to admins only
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pendingSettings.general.maintenanceMode}
                  onChange={(e) =>
                    handleInputChange(
                      "general",
                      "maintenanceMode",
                      e.target.checked,
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600">
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      pendingSettings.general.maintenanceMode
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Max Jobs per Employer
                </label>
                <p className="text-xs text-gray-500">
                  Maximum number of active jobs an employer can post
                </p>
              </div>
              <input
                type="number"
                value={pendingSettings.general.maxJobsPerEmployer}
                onChange={(e) =>
                  handleInputChange(
                    "general",
                    "maxJobsPerEmployer",
                    parseInt(e.target.value),
                  )
                }
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <EmailIcon sx={{ fontSize: 24, color: "#10b981" }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Notification Settings
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email Notifications
                </label>
                <p className="text-xs text-gray-500">
                  Send email notifications to users
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pendingSettings.notifications.emailNotifications}
                  onChange={(e) =>
                    handleInputChange(
                      "notifications",
                      "emailNotifications",
                      e.target.checked,
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600">
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      pendingSettings.notifications.emailNotifications
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Push Notifications
                </label>
                <p className="text-xs text-gray-500">
                  Enable push notifications for mobile users
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pendingSettings.notifications.pushNotifications}
                  onChange={(e) =>
                    handleInputChange(
                      "notifications",
                      "pushNotifications",
                      e.target.checked,
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600">
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      pendingSettings.notifications.pushNotifications
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Notification Retention (Days)
                </label>
                <p className="text-xs text-gray-500">
                  How long to keep notifications
                </p>
              </div>
              <input
                type="number"
                value={pendingSettings.notifications.notificationRetentionDays}
                onChange={(e) =>
                  handleInputChange(
                    "notifications",
                    "notificationRetentionDays",
                    parseInt(e.target.value),
                  )
                }
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* User Role Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <GroupIcon sx={{ fontSize: 24, color: "#7c3aed" }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              User Role Settings
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Allow Admin Invites
                </label>
                <p className="text-xs text-gray-500">
                  Allow admins to invite other admins
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pendingSettings.userRoles.allowAdminInvites}
                  onChange={(e) =>
                    handleInputChange(
                      "userRoles",
                      "allowAdminInvites",
                      e.target.checked,
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600">
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      pendingSettings.userRoles.allowAdminInvites
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Allow Employer Self-Registration
                </label>
                <p className="text-xs text-gray-500">
                  Allow employers to register without admin approval
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    pendingSettings.userRoles.allowEmployerSelfRegistration
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "userRoles",
                      "allowEmployerSelfRegistration",
                      e.target.checked,
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600">
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      pendingSettings.userRoles.allowEmployerSelfRegistration
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Allow Candidate Self-Registration
                </label>
                <p className="text-xs text-gray-500">
                  Allow candidates to register without admin approval
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    pendingSettings.userRoles.allowCandidateSelfRegistration
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "userRoles",
                      "allowCandidateSelfRegistration",
                      e.target.checked,
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600">
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      pendingSettings.userRoles.allowCandidateSelfRegistration
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            <SaveIcon sx={{ fontSize: 18, marginRight: 1 }} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showModal}
        onApprove={handleConfirmSave}
        onCancel={handleCancel}
        actionType="block"
        name="Settings"
      />
    </div>
  );
};

export default AdminSettings;
