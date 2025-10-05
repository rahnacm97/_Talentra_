import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentIcon from "@mui/icons-material/Assignment";
import NotificationsIcon from "@mui/icons-material/Notifications";

const AdminDashboard: React.FC = () => {
  const stats = [
    {
      title: "Total Candidates",
      value: "5,847",
      change: "+12%",
      trend: "up",
      icon: PersonIcon,
      color: "blue",
    },
    {
      title: "Active Jobs",
      value: "1,247",
      change: "+8%",
      trend: "up",
      icon: WorkIcon,
      color: "green",
    },
    {
      title: "Employers",
      value: "324",
      change: "+15%",
      trend: "up",
      icon: BusinessIcon,
      color: "purple",
    },
    {
      title: "Applications",
      value: "18,932",
      change: "+23%",
      trend: "up",
      icon: AssignmentIcon,
      color: "orange",
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

  const topJobs = [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp",
      applications: 45,
      status: "Active",
    },
    {
      title: "Data Scientist",
      company: "AI Solutions",
      applications: 38,
      status: "Active",
    },
    {
      title: "Product Manager",
      company: "StartupXYZ",
      applications: 32,
      status: "Active",
    },
    {
      title: "UX Designer",
      company: "Design Studio",
      applications: 28,
      status: "Active",
    },
    {
      title: "Backend Engineer",
      company: "CloudTech",
      applications: 25,
      status: "Active",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-500 text-blue-600 bg-blue-50",
      green: "bg-green-500 text-green-600 bg-green-50",
      purple: "bg-purple-500 text-purple-600 bg-purple-50",
      orange: "bg-orange-500 text-orange-600 bg-orange-50",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

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
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          const colorClasses = getColorClasses(stat.color).split(" ");

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[2]}`}>
                  <IconComponent
                    sx={{
                      fontSize: 24,
                      color: colorClasses[0].replace("bg-", "#"),
                    }}
                  />
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <TrendingUpIcon sx={{ fontSize: 16, marginRight: 0.5 }} />
                  {stat.change}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </div>
          );
        })}
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
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">{activity.user}</p>
                  </div>
                  <div className="text-xs text-gray-400">{activity.time}</div>
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
                    Review Candidates
                  </div>
                  <div className="text-sm text-gray-500">
                    23 pending reviews
                  </div>
                </div>
              </div>
            </button>

            <button className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 group">
              <div className="flex items-center">
                <WorkIcon sx={{ marginRight: 2, color: "#059669" }} />
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-green-700">
                    Approve Jobs
                  </div>
                  <div className="text-sm text-gray-500">
                    15 awaiting approval
                  </div>
                </div>
              </div>
            </button>

            <button className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 group">
              <div className="flex items-center">
                <BusinessIcon sx={{ marginRight: 2, color: "#7c3aed" }} />
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-purple-700">
                    Verify Employers
                  </div>
                  <div className="text-sm text-gray-500">
                    8 new registrations
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">
                  Job Title
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">
                  Company
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">
                  Applications
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {topJobs.map((job, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{job.title}</div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{job.company}</td>
                  <td className="py-4 px-6">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                      {job.applications}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                      {job.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
                      <VisibilityIcon sx={{ fontSize: 16, marginRight: 0.5 }} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
