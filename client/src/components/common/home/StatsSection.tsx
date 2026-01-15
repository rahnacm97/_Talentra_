import { Briefcase, Users, TrendingUp, Award } from "lucide-react";
// import { useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
// import { fetchHomepageStats } from "../../thunks/homepage.thunk";

const StatsSection: React.FC = () => {
  const statsData = [
    {
      icon: Briefcase,
      label: "Active Jobs",
      value: "1,234",
    },
    {
      icon: Users,
      label: "Companies",
      value: "567",
    },
    {
      icon: TrendingUp,
      label: "Success Rate",
      value: "95%",
    },
    {
      icon: Award,
      label: "Happy Clients",
      value: "8,900",
    },
  ];

  //const dispatch = useAppDispatch();
  //const { stats } = useAppSelector((state) => state.homepage);

  // useEffect(() => {
  //   dispatch(fetchHomepageStats());
  // }, [dispatch]);

  // const statsData = [
  //   {
  //     icon: Briefcase,
  //     label: "Active Jobs",
  //     value: stats?.activeJobs?.toLocaleString() || "0",
  //   },
  //   {
  //     icon: Users,
  //     label: "Companies",
  //     value: stats?.totalCompanies?.toLocaleString() || "0",
  //   },
  //   {
  //     icon: TrendingUp,
  //     label: "Success Rate",
  //     value: `${stats?.successRate || 95}%`,
  //   },
  //   {
  //     icon: Award,
  //     label: "Happy Clients",
  //     value: stats?.totalCandidates?.toLocaleString() || "0",
  //   },
  // ];

  return (
    <div className="bg-gradient-to-r from-blue-400 to-indigo-700 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {statsData.map((stat, index) => (
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
};

export default StatsSection;
