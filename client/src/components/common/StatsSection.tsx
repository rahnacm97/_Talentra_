import { Briefcase, Users, TrendingUp, Award } from "lucide-react";

// Stats Component
const StatsSection: React.FC = () => (
  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
        {[
          { icon: Briefcase, label: "Active Jobs", value: "50,000+" },
          { icon: Users, label: "Companies", value: "12,000+" },
          { icon: TrendingUp, label: "Success Rate", value: "95%" },
          { icon: Award, label: "Happy Clients", value: "1M+" },
        ].map((stat, index) => (
          <div key={index} className="text-white">
            <div className="bg-white/20 p-4 rounded-2xl inline-block mb-4">
              <stat.icon className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
            <p className="text-blue-100">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default StatsSection;
