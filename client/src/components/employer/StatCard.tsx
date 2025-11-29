import React from "react";
import { IconWrapper } from "../common/IconWrapper";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { LucideProps } from "lucide-react";

type StatCardProps = {
  label: string;
  value: number | string;
  icon: React.ComponentType<SvgIconProps> | React.ComponentType<LucideProps>;
  iconBg: string;
  iconColor: string;
  borderColor?: string;
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  borderColor = "border-blue-600",
}) => (
  <div
    className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${borderColor} flex items-center justify-between`}
  >
    <div>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
    </div>
    <IconWrapper Icon={Icon} bgColor={iconBg} iconColor={iconColor} />
  </div>
);
