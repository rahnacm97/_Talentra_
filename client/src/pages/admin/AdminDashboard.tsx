import React, { useEffect } from "react";
import PersonIcon from "@mui/icons-material/Person";
//import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
//import AssignmentIcon from "@mui/icons-material/Assignment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { StatCard } from "../../components/admin/Statcard";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

import { fetchCandidates } from "../../thunks/admin.thunk";
import { fetchEmployers } from "../../thunks/admin.thunk";
// import {
//   fetchJobs,
// } from "../../thunks/admin.thunk";
// import {
//   fetchNotifications,
// } from "../../thunks/admin.thunk";

const selectCandidates = (state: any) => state.adminCandidates;
const selectEmployers = (state: any) => state.adminEmployers;
//const selectJobs = (state: any) => state.adminJobs;
//const selectNotifications = (state: any) => state.adminNotifications;

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCandidates({ page: 1, limit: 1, search: "" }));
    dispatch(fetchEmployers({ page: 1, limit: 1, search: "" }));
    // dispatch(fetchJobs?.({ page: 1, limit: 1 }) ?? Promise.resolve());
    // dispatch(fetchNotifications?.({ page: 1, limit: 1 }) ?? Promise.resolve());
  }, [dispatch]);

  const { total: totalCandidates, candidates } =
    useAppSelector(selectCandidates);

  const { total: totalEmployers } = useAppSelector(selectEmployers);

  // const {
  //   total: totalJobs = 0,
  //   jobs = [],
  // } = useAppSelector(selectJobs);

  // const {
  //   total: totalNotifications = 0,
  // } = useAppSelector(selectNotifications);

  const activeCandidates =
    candidates?.filter((c: any) => !c.blocked).length ?? 0;
  // const totalApplications = jobs.reduce(
  //   (sum: number, j: any) => sum + (j.applications ?? 0),
  //   0
  // );

  const stats = [
    {
      title: "Total Candidates",
      value: totalCandidates?.toLocaleString() ?? "0",
      change: "+12%",
      icon: PersonIcon,
      iconBg: "bg-blue-100",
      iconColor: "#2563eb",
    },
    // {
    //   title: "Active Jobs",
    //   value: totalJobs?.toLocaleString() ?? "0",
    //   change: "+8%",
    //   icon: WorkIcon,
    //   iconBg: "bg-green-100",
    //   iconColor: "#059669",
    // },
    {
      title: "Employers",
      value: totalEmployers?.toLocaleString() ?? "0",
      change: "+15%",
      icon: BusinessIcon,
      iconBg: "bg-purple-100",
      iconColor: "#7c3aed",
    },
    // {
    //   title: "Applications",
    //   value: totalApplications?.toLocaleString() ?? "0",
    //   change: "+23%",
    //   icon: AssignmentIcon,
    //   iconBg: "bg-orange-100",
    //   iconColor: "#ea580c",
    // },
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
                    Review Candidates
                  </div>
                  <div className="text-sm text-gray-500">
                    {activeCandidates} pending reviews
                  </div>
                </div>
              </div>
            </button>

            {/* <button className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 group">
              <div className="flex items-center">
                <WorkIcon sx={{ marginRight: 2, color: "#059669" }} />
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-green-700">
                    Approve Jobs
                  </div>
                  <div className="text-sm text-gray-500">
                    {totalJobs} awaiting approval
                  </div>
                </div>
              </div>
            </button> */}

            <button className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 group">
              <div className="flex items-center">
                <BusinessIcon sx={{ marginRight: 2, color: "#7c3aed" }} />
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-purple-700">
                    Verify Employers
                  </div>
                  <div className="text-sm text-gray-500">
                    {totalEmployers} new registrations
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
              {topJobs.map((job, i) => (
                <tr
                  key={i}
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
