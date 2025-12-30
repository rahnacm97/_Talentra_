import React from "react";
import { IconWrapper } from "../common/home/IconWrapper";
import type { SvgIconProps } from "@mui/material/SvgIcon";

type CountCardProps = {
  label: string;
  count: number | string;
  icon: React.ComponentType<SvgIconProps>;
  iconBg: string;
  iconColor: string;
};

export const CountCard: React.FC<CountCardProps> = ({
  label,
  count,
  icon: Icon,
  iconBg,
  iconColor,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
    <IconWrapper Icon={Icon} bgColor={iconBg} iconColor={iconColor} />
    <div className="ml-4">
      <h3 className="text-2xl font-bold text-gray-900">{count}</h3>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  </div>
);
