import React from "react";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PieChart } from "lucide-react";

interface AnalyticsPieChartProps {
  title: string;
  subtitle: string;
  data: any[];
  dataKey: string;
  nameKey: string;
  totalValue: number;
}

export const AnalyticsPieChart: React.FC<AnalyticsPieChartProps> = ({
  title,
  subtitle,
  data,
  dataKey,
  nameKey,
  totalValue,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        </div>
        <PieChart className="w-6 h-6 text-indigo-600" />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <RePieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }: any) =>
              `${name}: ${((value / totalValue) * 100).toFixed(0)}%`
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey={dataKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </RePieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {data.map((item) => (
          <div key={item[nameKey]} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-700">
              {item[nameKey]}: {item[dataKey]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
