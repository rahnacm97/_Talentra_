import React, { useEffect } from "react";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { FileText } from "lucide-react";
import Table from "../../components/admin/Table";
import { StatCard } from "../../components/admin/Statcard";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchAdminAnalytics } from "../../thunks/admin.thunk";

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector(
    (state) => state.adminAnalytics,
  );

  useEffect(() => {
    dispatch(fetchAdminAnalytics());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  const activeCandidates = data?.stats.activeCandidates ?? 0;

  const stats = [
    {
      title: "Total Candidates",
      value: data?.stats.totalCandidates?.toLocaleString() ?? "0",
      change: "+12%",
      icon: PersonIcon,
      iconBg: "bg-blue-100",
      iconColor: "#2563eb",
    },
    {
      title: "Employers",
      value: data?.stats.totalEmployers?.toLocaleString() ?? "0",
      change: "+15%",
      icon: BusinessIcon,
      iconBg: "bg-purple-100",
      iconColor: "#7c3aed",
    },
    {
      title: "Total Jobs",
      value: data?.stats.totalJobs?.toLocaleString() ?? "0",
      change: "+8%",
      icon: WorkIcon,
      iconBg: "bg-green-100",
      iconColor: "#059669",
    },
    {
      title: "Total Applications",
      value: data?.stats.totalApplications?.toLocaleString() ?? "0",
      change: "+6%",
      icon: FileText,
      iconBg: "bg-orange-100",
      iconColor: "#FB923C",
    },
  ];

  const recentActivity = [
    {
      action: "New candidate registered",
      user: "Sarah Johnson",
      time: "2 minutes ago",
    },
    {
      action: "Job posting approved",
      user: "Tech Solutions Inc.",
      time: "15 minutes ago",
    },
    {
      action: "Application submitted",
      user: "Michael Chen",
      time: "1 hour ago",
    },
    {
      action: "Employer account verified",
      user: "Innovation Labs",
      time: "2 hours ago",
    },
    { action: "Profile updated", user: "Emma Wilson", time: "3 hours ago" },
  ];

  const topJobs = data?.topJobs || [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your talent platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <NotificationsIcon sx={{ marginRight: 1, color: "#374151" }} />
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {a.action}
                    </p>
                    <p className="text-sm text-gray-500">{a.user}</p>
                  </div>
                  <div className="text-xs text-gray-400">{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-3">
            <button className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 group">
              <div className="flex items-center">
                <PersonIcon sx={{ marginRight: 2, color: "#2563eb" }} />
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-700">
                    Total Candidates
                  </div>
                  <div className="text-sm text-gray-500">
                    {activeCandidates} pending reviews
                  </div>
                </div>
              </div>
            </button>

            <button className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 group">
              <div className="flex items-center">
                <WorkIcon sx={{ marginRight: 2, color: "#059669" }} />
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-green-700">
                    Total Jobs
                  </div>
                  <div className="text-sm text-gray-500">
                    {data?.stats.totalJobs ?? 0}
                  </div>
                </div>
              </div>
            </button>

            <button className="w-full text-left p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200 group">
              <div className="flex items-center">
                <FileText className="mr-2 text-orange-400" />
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-orange-700">
                    Total Applications
                  </div>
                  <div className="text-sm text-gray-500">
                    {data?.stats.totalApplications ?? 0} total applications
                  </div>
                </div>
              </div>
            </button>

            <button className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 group">
              <div className="flex items-center">
                <BusinessIcon sx={{ marginRight: 2, color: "#7c3aed" }} />
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-purple-700">
                    Verified Employers
                  </div>
                  <div className="text-sm text-gray-500">
                    {data?.stats.totalEmployers ?? 0} total employers
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <TrendingUpIcon sx={{ marginRight: 1, color: "#374151" }} />
            Top Performing Jobs
          </h2>
        </div>
        <Table
          data={topJobs}
          columns={[
            {
              key: "title",
              label: "Job Title",
              render: (value: string) => (
                <div className="font-medium text-gray-900">{value}</div>
              ),
            },
            {
              key: "company",
              label: "Company",
              render: (value: string) => (
                <div className="text-gray-600">{value}</div>
              ),
            },
            {
              key: "applications",
              label: "Applications",
              render: (value: number) => (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                  {value}
                </span>
              ),
            },
            {
              key: "status",
              label: "Status",
              render: (value: string) => (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  {value}
                </span>
              ),
            },
          ]}
          renderActions={() => (
            <button className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
              <VisibilityIcon sx={{ fontSize: 16, marginRight: 0.5 }} />
              View
            </button>
          )}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
