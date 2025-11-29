import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface AnalyticsMetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: any;
  trend?: "up" | "down";
  subtitle?: string;
}

export const AnalyticsMetricCard: React.FC<AnalyticsMetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  trend,
  subtitle,
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
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
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
