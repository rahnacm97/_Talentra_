import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  jobCount: number | string;
  color?: "blue" | "green" | "purple" | "orange" | "pink" | "indigo";
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  icon: Icon,
  title,
  jobCount,
  color = "blue",
}) => {
  const colorClasses = {
    blue: "from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600",
    green:
      "from-green-400 to-green-500 hover:from-green-600 hover:to-green-700",
    purple:
      "from-purple-400 to-purple-500 hover:from-purple-600 hover:to-purple-700",
    orange:
      "from-orange-400 to-orange-500 hover:from-orange-600 hover:to-orange-700",
    pink: "from-pink-400 to-pink-500 hover:from-pink-600 hover:to-pink-700",
    indigo:
      "from-indigo-400 to-indigo-500 hover:from-indigo-600 hover:to-indigo-700",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-white cursor-pointer group`}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors duration-300`}
        >
          <Icon className="w-8 h-8" />
        </div>
        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/80 text-sm">{jobCount} open positions</p>
    </div>
  );
};

export default CategoryCard;
