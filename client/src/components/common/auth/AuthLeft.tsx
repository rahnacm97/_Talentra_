import teamImage from "../../../assets/team-image.png";
import { Building2, Users, Briefcase } from "lucide-react";
import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";

const ScreenLeft = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex-col items-center justify-center p-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-white/5 bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(255,255,255,0.05)_21%)]"></div>
      </div>

      <div className="relative z-10 text-center">
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl inline-block border border-white/20">
            <PersonSearchRoundedIcon
              sx={{
                color: "white",
                fontSize: 28,
              }}
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-1 leading-tight">
            <span className="text-blue-400 mb-1">Talentra</span>
          </h1>
        </div>
        <h1 className="text-4xl font-bold text-white mb-1 leading-tight">
          Connect Top Talent with
          <span className="text-blue-400"> Leading Companies</span>
        </h1>
        <p className="text-blue-100 text-lg mb-12 max-w-md mx-auto leading-relaxed">
          Over 1,752,324 candidates are waiting to find their perfect career
          opportunity
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="bg-blue-500 p-3 rounded-lg inline-block mb-3">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="text-white">
              <p className="text-2xl font-bold text-blue-400">25+</p>
              <p className="text-sm text-blue-100">Companies</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="bg-green-500 p-3 rounded-lg inline-block mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-white">
              <p className="text-2xl font-bold text-green-400">700+</p>
              <p className="text-sm text-blue-100">Candidates</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="bg-purple-500 p-3 rounded-lg inline-block mb-3">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div className="text-white">
              <p className="text-2xl font-bold text-purple-400">20+</p>
              <p className="text-sm text-blue-100">New Jobs</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-lg mx-auto">
          <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl h-48 flex items-center justify-center">
            <div className="text-white text-center">
              <img
                src={teamImage}
                alt="Team Collaboration"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenLeft;
