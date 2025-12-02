import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { fetchEmployerAnalytics } from "../../thunks/employer.thunk";
import { setAnalyticsTimeRange } from "../../features/employer/employerSlice";
import {
  Users,
  Briefcase,
  Clock,
  CheckCircle,
  Eye,
  Award,
  Target,
  Activity,
  Download,
} from "lucide-react";
import { AnalyticsMetricCard } from "../../components/common/analytics/AnalyticsMetricCard";
import { AnalyticsAreaChart } from "../../components/common/analytics/AnalyticsAreaChart";
import { AnalyticsPieChart } from "../../components/common/analytics/AnalyticsPieChart";
import { AnalyticsBarChart } from "../../components/common/analytics/AnalyticsBarChart";
import { AnalyticsFunnel } from "../../components/common/analytics/AnalyticsFunnel";
import { AnalyticsProgressList } from "../../components/common/analytics/AnalyticsProgressList";

const EmployerAnalytics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, timeRange } = useSelector(
    (state: RootState) => state.employer.analytics,
  );

  useEffect(() => {
    dispatch(fetchEmployerAnalytics(timeRange));
  }, [dispatch, timeRange]);

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setAnalyticsTimeRange(e.target.value));
  };

  const applicationsOverTime = data?.applicationsOverTime || [];
  const applicationsByStatus = data?.applicationsByStatus || [];
  const jobPostingPerformance = data?.jobPostingPerformance || [];
  const hiringFunnel = data?.hiringFunnel || [];
  const timeToHireData = data?.timeToHire || [];
  const metrics = data?.stats || {
    totalApplications: 0,
    totalViews: 0,
    activeJobs: 0,
    avgTimeToHire: 0,
    totalHired: 0,
    conversionRate: 0,
    offerAcceptanceRate: 0,
    activePipeline: 0,
  };

  // Placeholder for source analytics as it's not yet in the backend response
  const sourceAnalytics = [
    { source: "LinkedIn", applications: 120, percentage: 40 },
    { source: "Indeed", applications: 90, percentage: 30 },
    { source: "Direct", applications: 60, percentage: 20 },
    { source: "Referrals", applications: 30, percentage: 10 },
  ];

  // Calculate total value for percentage calculation in Pie chart
  const totalApplications = applicationsByStatus.reduce(
    (sum: any, item: any) => sum + item.value,
    0,
  );

  if (loading && !data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

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
              onChange={handleTimeRangeChange}
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
          <AnalyticsMetricCard
            title="Total Applications"
            value={metrics.totalApplications}
            icon={Users}
            trend="up"
          />
          <AnalyticsMetricCard
            title="Job Views"
            value={metrics.totalViews.toLocaleString()}
            icon={Eye}
            trend="up"
          />
          <AnalyticsMetricCard
            title="Active Job Posts"
            value={metrics.activeJobs}
            icon={Briefcase}
          />
          <AnalyticsMetricCard
            title="Avg. Time to Hire"
            value={`${metrics.avgTimeToHire} days`}
            icon={Clock}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnalyticsMetricCard
            title="Conversion Rate"
            value={`${metrics.conversionRate}%`}
            change={1.2}
            icon={Target}
            trend="up"
            subtitle="Applications to hires"
          />
          <AnalyticsMetricCard
            title="Offer Acceptance"
            value={`${metrics.offerAcceptanceRate}%`}
            icon={CheckCircle}
          />
          <AnalyticsMetricCard
            title="Total Hired"
            value={12}
            change={25}
            icon={Award}
            trend="up"
          />
          <AnalyticsMetricCard
            title="Active Pipeline"
            value={156}
            icon={Activity}
            subtitle="Candidates in process"
          />
        </div>

        <AnalyticsAreaChart
          title="Applications & Views Trend"
          subtitle="Track applications and job views over time"
          data={applicationsOverTime}
          dataKey1="applications"
          dataKey2="views"
          color1="#6366F1"
          color2="#10B981"
          name1="Applications"
          name2="Views"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <AnalyticsPieChart
            title="Application Status"
            subtitle="Distribution by status"
            data={applicationsByStatus}
            dataKey="value"
            nameKey="name"
            totalValue={totalApplications}
          />

          <AnalyticsFunnel
            title="Hiring Funnel"
            subtitle="Candidate progression through stages"
            data={hiringFunnel}
          />
        </div>

        <AnalyticsBarChart
          title="Job Posting Performance"
          subtitle="Compare performance across job listings"
          data={jobPostingPerformance}
          dataKey="applications"
          xAxisKey="job"
          barColor="#6366F1"
          barName="Applications"
          additionalBar={{
            dataKey: "views",
            color: "#10B981",
            name: "Views",
          }}
        >
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
                {jobPostingPerformance.map((job: any) => (
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
        </AnalyticsBarChart>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnalyticsProgressList
            title="Application Sources"
            subtitle="Where candidates find your jobs"
            data={sourceAnalytics}
            labelKey="source"
            valueKey="applications"
            percentageKey="percentage"
          />

          <AnalyticsBarChart
            title="Time to Hire"
            subtitle="Average days by position"
            data={timeToHireData}
            dataKey="days"
            xAxisKey="position"
            yAxisKey="position"
            barColor="#6366F1"
            layout="vertical"
            icon="clock"
          />
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
