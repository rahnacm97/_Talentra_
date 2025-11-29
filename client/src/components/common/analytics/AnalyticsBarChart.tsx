import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Briefcase, Clock } from "lucide-react";

interface AnalyticsBarChartProps {
  title: string;
  subtitle: string;
  data: any[];
  dataKey: string;
  xAxisKey: string;
  yAxisKey?: string;
  barColor: string;
  barName?: string;
  layout?: "horizontal" | "vertical";
  icon?: "briefcase" | "clock";
  additionalBar?: {
    dataKey: string;
    color: string;
    name: string;
  };
  children?: React.ReactNode;
}

export const AnalyticsBarChart: React.FC<AnalyticsBarChartProps> = ({
  title,
  subtitle,
  data,
  dataKey,
  xAxisKey,
  yAxisKey,
  barColor,
  barName,
  layout = "horizontal",
  icon = "briefcase",
  additionalBar,
  children,
}) => {
  const Icon = icon === "briefcase" ? Briefcase : Clock;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        </div>
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout={layout}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          {layout === "horizontal" ? (
            <>
              <XAxis dataKey={xAxisKey} stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
            </>
          ) : (
            <>
              <XAxis type="number" stroke="#6B7280" />
              <YAxis
                dataKey={yAxisKey}
                type="category"
                stroke="#6B7280"
                width={120}
              />
            </>
          )}
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
            dataKey={dataKey}
            fill={barColor}
            name={barName}
            radius={layout === "horizontal" ? [8, 8, 0, 0] : [0, 8, 8, 0]}
          />
          {additionalBar && (
            <Bar
              dataKey={additionalBar.dataKey}
              fill={additionalBar.color}
              name={additionalBar.name}
              radius={[8, 8, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
      {children}
    </div>
  );
};
