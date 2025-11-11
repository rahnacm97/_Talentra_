import React from "react";
import type { SvgIconProps } from "@mui/material/SvgIcon";

type IconWrapperProps = {
  Icon: React.ComponentType<SvgIconProps>;
  bgColor: string;
  iconColor: string;
  size?: number;
};

export const IconWrapper: React.FC<IconWrapperProps> = ({
  Icon,
  bgColor,
  iconColor,
  size = 24,
}) => (
  <div className={`p-3 rounded-lg ${bgColor}`}>
    <Icon sx={{ fontSize: size, color: iconColor }} />
  </div>
);
