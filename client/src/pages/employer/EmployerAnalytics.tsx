import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  Clock,
  CheckCircle,
  Eye,
  Award,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const EmployerAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState("30days");

  const applicationsOverTime = [
    { date: "Oct 1", applications: 45, views: 320 },
    { date: "Oct 5", applications: 52, views: 380 },
    { date: "Oct 10", applications: 48, views: 350 },
    { date: "Oct 15", applications: 65, views: 420 },
    { date: "Oct 20", applications: 58, views: 390 },
    { date: "Oct 25", applications: 72, views: 450 },
  ];

  const applicationsByStatus = [
    { name: "Pending", value: 45, color: "#EAB308" },
    { name: "Reviewed", value: 32, color: "#3B82F6" },
    { name: "Shortlisted", value: 28, color: "#A855F7" },
    { name: "Interview", value: 15, color: "#6366F1" },
    { name: "Hired", value: 8, color: "#10B981" },
    { name: "Rejected", value: 22, color: "#EF4444" },
  ];

  const jobPostingPerformance = [
    { job: "Frontend Dev", applications: 85, views: 1200, conversionRate: 7.1 },
    {
      job: "Product Manager",
      applications: 62,
      views: 950,
      conversionRate: 6.5,
    },
    { job: "UX Designer", applications: 48, views: 780, conversionRate: 6.2 },
    { job: "Backend Dev", applications: 71, views: 1100, conversionRate: 6.5 },
    {
      job: "Marketing Spec",
      applications: 39,
      views: 650,
      conversionRate: 6.0,
    },
  ];

  const sourceAnalytics = [
    { source: "LinkedIn", applications: 120, percentage: 40 },
    { source: "Indeed", applications: 90, percentage: 30 },
    { source: "Direct", applications: 60, percentage: 20 },
    { source: "Referrals", applications: 30, percentage: 10 },
  ];

  const hiringFunnel = [
    { stage: "Applications", count: 300, percentage: 100 },
    { stage: "Reviewed", count: 180, percentage: 60 },
    { stage: "Shortlisted", count: 90, percentage: 30 },
    { stage: "Interviewed", count: 45, percentage: 15 },
    { stage: "Hired", count: 12, percentage: 4 },
  ];

  const timeToHireData = [
    { position: "Frontend Dev", days: 28 },
    { position: "Product Manager", days: 35 },
    { position: "UX Designer", days: 32 },
    { position: "Backend Dev", days: 30 },
    { position: "Marketing Spec", days: 25 },
  ];

  const metrics = {
    totalApplications: 340,
    totalViews: 4850,
    activeJobs: 12,
    avgTimeToHire: 30,
    applicationGrowth: 15.3,
    viewGrowth: 22.7,
    conversionRate: 7.0,
    offerAcceptanceRate: 85,
  };

  // Calculate total value for percentage calculation in Pie chart
  const totalApplications = applicationsByStatus.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  const MetricCard = ({
    title,
    value,
    change,
    icon: Icon,
    trend,
    subtitle,
  }: {
    title: string;
    value: string | number;
    change?: number;
    icon: any;
    trend?: "up" | "down";
    subtitle?: string;
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-600">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-100 p-3 rounded-lg">
            <Icon className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center space-x-1 ${trend === "up" ? "text-green-600" : "text-red-600"}`}
          >
            {trend === "up" ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-semibold">{change}%</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Track your recruitment performance and insights
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Applications"
            value={metrics.totalApplications}
            change={metrics.applicationGrowth}
            icon={Users}
            trend="up"
          />
          <MetricCard
            title="Job Views"
            value={metrics.totalViews.toLocaleString()}
            change={metrics.viewGrowth}
            icon={Eye}
            trend="up"
          />
          <MetricCard
            title="Active Job Posts"
            value={metrics.activeJobs}
            icon={Briefcase}
          />
          <MetricCard
            title="Avg. Time to Hire"
            value={`${metrics.avgTimeToHire} days`}
            icon={Clock}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Conversion Rate"
            value={`${metrics.conversionRate}%`}
            change={1.2}
            icon={Target}
            trend="up"
            subtitle="Applications to hires"
          />
          <MetricCard
            title="Offer Acceptance"
            value={`${metrics.offerAcceptanceRate}%`}
            icon={CheckCircle}
          />
          <MetricCard
            title="Total Hired"
            value={12}
            change={25}
            icon={Award}
            trend="up"
          />
          <MetricCard
            title="Active Pipeline"
            value={156}
            icon={Activity}
            subtitle="Candidates in process"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Applications & Views Trend
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Track applications and job views over time
              </p>
            </div>
            <BarChart3 className="w-6 h-6 text-indigo-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={applicationsOverTime}>
              <defs>
                <linearGradient
                  id="colorApplications"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="applications"
                stroke="#6366F1"
                fillOpacity={1}
                fill="url(#colorApplications)"
                name="Applications"
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorViews)"
                name="Views"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Application Status
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Distribution by status
                </p>
              </div>
              <PieChart className="w-6 h-6 text-indigo-600" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={applicationsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }: any) =>
                    `${name}: ${((value / totalApplications) * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {applicationsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {applicationsByStatus.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Hiring Funnel
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Candidate progression through stages
                </p>
              </div>
              <Activity className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="space-y-4">
              {hiringFunnel.map((stage, index) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {stage.stage}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {stage.count} ({stage.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${stage.percentage}%`,
                        backgroundColor: `hsl(${220 + index * 20}, 70%, ${60 - index * 5}%)`,
                      }}
                    />
                  </div>
                  {index < hiringFunnel.length - 1 && (
                    <div className="flex items-center justify-end mt-1">
                      <span className="text-xs text-gray-500">
                        {(
                          (hiringFunnel[index + 1].count / stage.count) *
                          100
                        ).toFixed(1)}
                        % conversion
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Job Posting Performance
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Compare performance across job listings
              </p>
            </div>
            <Briefcase className="w-6 h-6 text-indigo-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jobPostingPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="job" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend />
              <Bar
                dataKey="applications"
                fill="#6366F1"
                name="Applications"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="views"
                fill="#10B981"
                name="Views"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Job Title
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Applications
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Views
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Conversion Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobPostingPerformance.map((job) => (
                  <tr
                    key={job.job}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {job.job}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">
                      {job.applications}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">
                      {job.views}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-indigo-600 text-right">
                      {job.conversionRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Application Sources
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Where candidates find your jobs
                </p>
              </div>
              <Target className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="space-y-4">
              {sourceAnalytics.map((source) => (
                <div key={source.source} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {source.source}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {source.applications} ({source.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${source.percentage * 2.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Time to Hire
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Average days by position
                </p>
              </div>
              <Clock className="w-6 h-6 text-indigo-600" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={timeToHireData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B7280" />
                <YAxis
                  dataKey="position"
                  type="category"
                  stroke="#6B7280"
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="days" fill="#6366F1" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-md p-6 border border-indigo-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-indigo-600" />
            Key Insights & Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    Strong Growth
                  </p>
                  <p className="text-sm text-gray-600">
                    Applications increased by 15.3% compared to last period.
                    Frontend Developer role is performing exceptionally well.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    Optimize Conversion
                  </p>
                  <p className="text-sm text-gray-600">
                    LinkedIn drives 40% of applications. Consider increasing
                    budget for top-performing channels.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-500">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    Reduce Time to Hire
                  </p>
                  <p className="text-sm text-gray-600">
                    Product Manager role takes 35 days on average. Streamline
                    the interview process to improve candidate experience.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
              <div className="flex items-start space-x-3">
                <Award className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    High Quality Pipeline
                  </p>
                  <p className="text-sm text-gray-600">
                    85% offer acceptance rate indicates strong employer brand
                    and competitive offers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerAnalytics;
