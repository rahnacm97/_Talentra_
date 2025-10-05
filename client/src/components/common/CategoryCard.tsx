import { ArrowRight } from "lucide-react";

// Job Category Card Component
const CategoryCard = ({ icon: Icon, title, jobCount, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    green:
      "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    purple:
      "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    orange:
      "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
    pink: "from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700",
    indigo:
      "from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700",
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
