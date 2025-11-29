import type { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  icon: Icon,
  label,
  value,
  color = "blue",
}) => (
  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
    <div
      className={`w-10 h-10 rounded-lg bg-${color}-100 flex items-center justify-center`}
    >
      <Icon className={`w-5 h-5 text-${color}-600`} />
    </div>
    <div>
      <p className="text-xs text-gray-600">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);
