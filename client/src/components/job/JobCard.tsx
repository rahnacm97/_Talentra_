import { MapPin, IndianRupee } from "lucide-react";
import type React from "react";

interface JobCardProps {
  title: string;
  company: string;
  salary: string;
  location: string;
  type: string;
  posted: string;
  logo?: string;
}

const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  salary,
  location,
  type,
  posted,
  logo,
}) => (
  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 group cursor-pointer">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-4">
        {logo ? (
          <img
            src={logo}
            alt={`${company} logo`}
            className="w-12 h-12 rounded-xl object-cover border border-gray-200"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}

        {!logo && (
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            {company.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-gray-600 font-medium">{company}</p>
        </div>
      </div>

      <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
        {type}
      </span>
    </div>

    <div className="space-y-3 mb-6">
      <div className="flex items-center space-x-2 text-gray-600">
        <MapPin className="w-4 h-4" />
        <span className="text-sm">{location}</span>
      </div>
      <div className="flex items-center space-x-2 text-green-600 font-medium">
        <IndianRupee className="w-4 h-4" />
        <span className="text-sm font-semibold">{salary}</span>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-gray-500 text-sm">{posted}</span>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 transform group-hover:scale-105">
        Apply Now
      </button>
    </div>
  </div>
);

export default JobCard;
