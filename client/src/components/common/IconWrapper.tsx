import React from "react";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { LucideProps } from "lucide-react";

type IconWrapperProps = {
  Icon: React.ComponentType<SvgIconProps> | React.ComponentType<LucideProps>;
  bgColor: string;
  iconColor: string;
  size?: number;
};

export const IconWrapper: React.FC<IconWrapperProps> = ({
  Icon,
  bgColor,
  iconColor,
  size = 24,
}) => {
  // Check if it's a Lucide icon by checking if it accepts 'size' prop
  const isLucideIcon = "displayName" in Icon || !("muiName" in Icon);

  return (
    <div className={`p-3 rounded-lg ${bgColor}`}>
      {isLucideIcon ? (
        <Icon size={size} style={{ color: iconColor }} />
      ) : (
        <Icon sx={{ fontSize: size, color: iconColor as any }} />
      )}
    </div>
  );
};
