import React from "react";
import { Target } from "lucide-react";

interface AnalyticsProgressListProps {
  title: string;
  subtitle: string;
  data: any[];
  labelKey: string;
  valueKey: string;
  percentageKey: string;
}

export const AnalyticsProgressList: React.FC<AnalyticsProgressListProps> = ({
  title,
  subtitle,
  data,
  labelKey,
  valueKey,
  percentageKey,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        </div>
        <Target className="w-6 h-6 text-indigo-600" />
      </div>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item[labelKey]} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {item[labelKey]}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {item[valueKey]} ({item[percentageKey]}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                style={{ width: `${item[percentageKey] * 2.5}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
