import React from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { IconWrapper } from "../common/IconWrapper";
import type { SvgIconProps } from "@mui/material/SvgIcon";

type StatCardProps = {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down";
  icon: React.ComponentType<SvgIconProps>;
  iconBg: string;
  iconColor: string;
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend = "up",
  icon: Icon,
  iconBg,
  iconColor,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between mb-4">
      <IconWrapper Icon={Icon} bgColor={iconBg} iconColor={iconColor} />
      {change && (
        <div
          className={`flex items-center text-sm font-medium ${
            trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
          {change}
        </div>
      )}
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-gray-600 text-sm">{title}</p>
  </div>
);
