import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";

interface AnalyticsAreaChartProps {
  title: string;
  subtitle: string;
  data: any[];
  dataKey1: string;
  dataKey2: string;
  color1: string;
  color2: string;
  name1: string;
  name2: string;
}

export const AnalyticsAreaChart: React.FC<AnalyticsAreaChartProps> = ({
  title,
  subtitle,
  data,
  dataKey1,
  dataKey2,
  color1,
  color2,
  name1,
  name2,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        </div>
        <BarChart3 className="w-6 h-6 text-indigo-600" />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`color${dataKey1}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color1} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color1} stopOpacity={0} />
            </linearGradient>
            <linearGradient id={`color${dataKey2}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color2} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color2} stopOpacity={0} />
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
            dataKey={dataKey1}
            stroke={color1}
            fillOpacity={1}
            fill={`url(#color${dataKey1})`}
            name={name1}
          />
          <Area
            type="monotone"
            dataKey={dataKey2}
            stroke={color2}
            fillOpacity={1}
            fill={`url(#color${dataKey2})`}
            name={name2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
