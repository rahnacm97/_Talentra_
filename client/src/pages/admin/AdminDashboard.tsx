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
import { useNavigate } from "react-router-dom";
import { fetchAdminAnalytics } from "../../thunks/admin.thunk";
import { setTimeRange } from "../../features/admin/adminAnalyticsSlice";
import { API_ROUTES } from "../../shared/constants/constants";
import { AnalyticsAreaChart } from "../../components/common/analytics/AnalyticsAreaChart";
import { AnalyticsPieChart } from "../../components/common/analytics/AnalyticsPieChart";
import { AnalyticsBarChart } from "../../components/common/analytics/AnalyticsBarChart";

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data, loading, error, timeRange } = useAppSelector(
    (state) => state.adminAnalytics,
  );

  useEffect(() => {
    dispatch(fetchAdminAnalytics(timeRange));
  }, [dispatch, timeRange]);

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setTimeRange(e.target.value));
  };

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

  const topJobs = data?.topJobs || [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your talent platform.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={handleTimeRangeChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <NotificationsIcon sx={{ marginRight: 1, color: "#374151" }} />
              Recent Subscriptions
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {data?.recentSubscriptions?.length === 0 ? (
                <p className="text-gray-500 text-center">
                  No recent subscriptions
                </p>
              ) : (
                data?.recentSubscriptions?.map((sub, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 border border-transparent hover:border-gray-100"
                  >
                    {sub.employerAvatar ? (
                      <img
                        src={sub.employerAvatar}
                        alt={sub.employerName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {sub.employerName.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {sub.employerName}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                            sub.plan === "enterprise"
                              ? "bg-purple-100 text-purple-700"
                              : sub.plan === "professional"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {sub.plan}
                        </span>
                        <span className="text-xs text-gray-500">
                          ₹{sub.amount}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">
                        {new Date(sub.date).toLocaleDateString()}
                      </div>

                      <span
                        className={`text-xs font-medium ${
                          sub.status === "active"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
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

      {/* Analytics Charts Section */}
      <div className="mt-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Growth Chart */}
          <AnalyticsAreaChart
            title="User Growth"
            subtitle="New Candidates and Employers over time"
            data={data?.platformGrowth || []}
            dataKey1="newCandidates"
            dataKey2="newEmployers"
            color1="#3B82F6"
            color2="#10B981"
            name1="Candidates"
            name2="Employers"
          />

          {/* Activity Growth Chart */}
          <AnalyticsAreaChart
            title="Platform Activity"
            subtitle="New Jobs and Applications over time"
            data={data?.platformGrowth || []}
            dataKey1="newJobs"
            dataKey2="newApplications"
            color1="#F59E0B"
            color2="#6366F1"
            name1="Jobs"
            name2="Applications"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Distribution */}
          <AnalyticsPieChart
            title="User Distribution"
            subtitle="Active/Blocked Candidates & Employers"
            data={data?.userDistribution || []}
            dataKey="value"
            nameKey="name"
            totalValue={
              data?.userDistribution?.reduce(
                (acc, curr) => acc + curr.value,
                0,
              ) || 0
            }
          />

          {/* Application Status Distribution */}
          <AnalyticsPieChart
            title="Application Trends"
            subtitle="Distribution by application status"
            data={data?.applicationStatusDistribution || []}
            dataKey="value"
            nameKey="name"
            totalValue={
              data?.applicationStatusDistribution?.reduce(
                (acc, curr) => acc + curr.value,
                0,
              ) || 0
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subscription Revenue Trends */}
          <AnalyticsAreaChart
            title="Revenue Trends"
            subtitle="Professional vs Enterprise Plan Revenue"
            data={data?.subscriptionRevenue || []}
            dataKey1="professional"
            dataKey2="enterprise"
            color1="#3B82F6"
            color2="#6366F1"
            name1="Professional"
            name2="Enterprise"
          />

          {/* Top Job Categories */}
          <AnalyticsBarChart
            title="Top Job Categories"
            subtitle="Job distribution by department"
            data={
              data?.topJobCategories?.map((item) => ({
                name: item.category,
                value: item.count,
              })) || []
            }
            dataKey="value"
            xAxisKey="name"
            barColor="#F59E0B"
            barName="Jobs"
          />
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
          renderActions={(row: any) => (
            <button
              onClick={() => {
                const searchParams = new URLSearchParams();
                searchParams.set("search", row.title);
                navigate(`${API_ROUTES.ADMIN.JOBS}?${searchParams.toString()}`);
              }}
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
            >
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
