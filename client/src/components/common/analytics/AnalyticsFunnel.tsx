import React from "react";
import { Activity } from "lucide-react";

interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

interface AnalyticsFunnelProps {
  title: string;
  subtitle: string;
  data: FunnelStage[];
}

export const AnalyticsFunnel: React.FC<AnalyticsFunnelProps> = ({
  title,
  subtitle,
  data,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        </div>
        <Activity className="w-6 h-6 text-indigo-600" />
      </div>
      <div className="space-y-4">
        {data.map((stage, index) => (
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
            {index < data.length - 1 && (
              <div className="flex items-center justify-end mt-1">
                <span className="text-xs text-gray-500">
                  {((data[index + 1].count / stage.count) * 100).toFixed(1)}%
                  conversion
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
