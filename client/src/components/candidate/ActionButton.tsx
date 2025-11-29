import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  icon?: LucideIcon;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  variant = "primary",
  icon: Icon,
  className = "cursor-pointer",
  ...props
}) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200",
  };

  return (
    <button
      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};
